import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import YahooFinance from "yahoo-finance2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StockDetailClient, { type StockDetail, type ChartPoint } from "./StockDetailClient";
import type { IndiceData, StockRow } from "@/app/marches/MarchesClient";
import { STATIC_INDICES } from "@/lib/marches-data";

export const revalidate = 3600;

// ─── Métadonnées ──────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: { symbol: string } }
): Promise<Metadata> {
  const symbol = decodeURIComponent(params.symbol).toUpperCase();
  return {
    title: `${symbol} — Marchés — Finactio`,
    description: `Cours, capitalisation et métriques de ${symbol} en temps réel.`,
  };
}

// ─── Mapping drapeau / pays ───────────────────────────────────────────────────

function countryFromTicker(ticker: string): { pays: string; drapeau: string } {
  if (ticker.endsWith(".PA")) return { pays: "France",        drapeau: "🇫🇷" };
  if (ticker.endsWith(".T"))  return { pays: "Japon",         drapeau: "🇯🇵" };
  if (ticker.endsWith(".L"))  return { pays: "Royaume-Uni",   drapeau: "🇬🇧" };
  return                             { pays: "États-Unis",    drapeau: "🇺🇸" };
}

// ─── Lookup dans le cache Supabase ────────────────────────────────────────────

interface CacheData {
  source: string;
  indices: IndiceData[];
}

async function findInCache(
  symbol: string
): Promise<{ stock: StockRow; indiceNom: string } | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: row, error } = await supabase
      .from("marches_cache")
      .select("data")
      .eq("id", 1)
      .single();

    if (error || !row?.data) throw new Error("no cache");

    const cache = row.data as CacheData;
    for (const indice of cache.indices) {
      const found = indice.stocks.find(
        (s) => s.ticker.toUpperCase() === symbol.toUpperCase()
      );
      if (found) return { stock: found, indiceNom: indice.nom };
    }
  } catch {
    // Fallback sur données statiques
    for (const indice of STATIC_INDICES) {
      const found = indice.stocks.find(
        (s) => s.ticker.toUpperCase() === symbol.toUpperCase()
      );
      if (found) return { stock: found, indiceNom: indice.nom };
    }
  }
  return null;
}

// ─── Données Yahoo Finance temps réel ────────────────────────────────────────

interface LiveData {
  prix: number;
  variation: number;
  capMds: number;
  volume?: number | null;
  high52w?: number | null;
  low52w?: number | null;
  previousClose?: number | null;
  longName?: string;
}

// Instance partagée (supprime les deux notices)
const yf = new YahooFinance({ suppressNotices: ["yahooSurvey", "ripHistorical"] });

async function getLiveData(symbol: string): Promise<LiveData | null> {
  try {
    const q = await (yf.quote as (s: string, o: object, m: object) => Promise<Record<string, unknown>>)(
      symbol, {}, { validateResult: false }
    );

    if (!q?.regularMarketPrice) return null;

    const rawCap = q.marketCap as number | undefined;
    let capMds = 0;
    if (rawCap && rawCap > 0) {
      capMds = symbol.endsWith(".T")
        ? Math.round(rawCap / 1e9 / 150)
        : Math.round(rawCap / 1e9);
    }

    // Prix .L : GBp → £
    const rawPrice = q.regularMarketPrice as number;
    const prix = symbol.endsWith(".L") ? Math.round((rawPrice / 100) * 100) / 100 : rawPrice;
    const prevClose = q.regularMarketPreviousClose as number | undefined;
    const previousClose = prevClose != null && symbol.endsWith(".L")
      ? Math.round((prevClose / 100) * 100) / 100
      : prevClose ?? null;

    // 52W high/low .L : GBp → £
    const raw52H = q.fiftyTwoWeekHigh as number | undefined;
    const raw52L = q.fiftyTwoWeekLow as number | undefined;
    const high52w = raw52H != null
      ? (symbol.endsWith(".L") ? Math.round((raw52H / 100) * 100) / 100 : raw52H)
      : null;
    const low52w = raw52L != null
      ? (symbol.endsWith(".L") ? Math.round((raw52L / 100) * 100) / 100 : raw52L)
      : null;

    return {
      prix,
      variation: Math.round((q.regularMarketChangePercent as number ?? 0) * 100) / 100,
      capMds,
      volume:   (q.regularMarketVolume as number | undefined) ?? null,
      high52w,
      low52w,
      previousClose,
      longName: (q.longName as string | undefined) ?? (q.shortName as string | undefined),
    };
  } catch (err) {
    console.error("[stock-detail] Yahoo Finance error:", err);
    return null;
  }
}

// ─── Données historiques Yahoo Finance ───────────────────────────────────────

async function getHistoricalData(symbol: string): Promise<ChartPoint[]> {
  try {
    const period2 = new Date().toISOString().split("T")[0];
    const period1 = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      .toISOString().split("T")[0];

    const historical = await yf.historical(symbol, { period1, period2, interval: "1d" });

    return historical.map((d) => {
      // Prix : .L en GBp → divise par 100
      const close = symbol.endsWith(".L")
        ? Math.round((d.close / 100) * 100) / 100
        : Math.round(d.close * 100) / 100;

      const date = new Date(d.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      });

      return { date, prix: close };
    });
  } catch (err) {
    console.error("[stock-detail] historical error:", err);
    return [];
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function StockPage({ params }: { params: { symbol: string } }) {
  const symbol = decodeURIComponent(params.symbol);

  // 1. Lookup dans le cache
  const cached = await findInCache(symbol);
  if (!cached) return notFound();

  const { stock, indiceNom } = cached;
  const { pays, drapeau } = countryFromTicker(symbol);

  // 2. Données live + historique en parallèle
  const [live, chartData] = await Promise.all([
    getLiveData(symbol),
    getHistoricalData(symbol),
  ]);

  // 3. Fusion
  const detail: StockDetail = {
    ticker:        symbol,
    nom:           live?.longName ?? stock.nom,
    secteur:       stock.secteur,
    capMds:        live?.capMds ?? stock.capMds,
    currency:      stock.currency,
    prixDevise:    stock.prixDevise ?? stock.currency,
    prix:          live?.prix ?? stock.prix ?? 0,
    variation:     live?.variation ?? stock.variation ?? 0,
    indiceNom,
    pays,
    drapeau,
    volume:        live?.volume,
    high52w:       live?.high52w,
    low52w:        live?.low52w,
    previousClose: live?.previousClose,
  };

  return (
    <>
      <Navbar />
      <StockDetailClient stock={detail} chartData={chartData} />
      <Footer />
    </>
  );
}
