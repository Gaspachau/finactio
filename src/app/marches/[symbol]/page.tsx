import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import YahooFinance from "yahoo-finance2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StockDetailClient, { type StockDetail, type ChartPoint } from "./StockDetailClient";
import type { IndiceData, StockRow } from "@/app/marches/MarchesClient";
import { STATIC_INDICES } from "@/lib/marches-data";

// quote → 5 min, historical → 1h (via unstable_cache)
export const revalidate = 300;

// ─── Mapping symbol → indice ──────────────────────────────────────────────────

const INDICE_MAP: Record<string, string> = {
  "MC.PA":  "CAC 40", "TTE.PA": "CAC 40", "RMS.PA": "CAC 40",
  "SU.PA":  "CAC 40", "SAN.PA": "CAC 40", "OR.PA":  "CAC 40",
  "AIR.PA": "CAC 40", "BNP.PA": "CAC 40", "SAF.PA": "CAC 40", "AI.PA": "CAC 40",
  "AAPL":   "S&P 500 · NASDAQ", "MSFT":  "S&P 500 · NASDAQ",
  "NVDA":   "S&P 500 · NASDAQ", "AMZN":  "S&P 500 · NASDAQ",
  "GOOGL":  "S&P 500 · NASDAQ", "META":  "S&P 500 · NASDAQ",
  "BRK-B":  "S&P 500",          "LLY":   "S&P 500",
  "TSLA":   "S&P 500 · NASDAQ", "AVGO":  "S&P 500 · NASDAQ",
  "COST":   "NASDAQ",           "NFLX":  "NASDAQ",
  "7203.T": "Nikkei 225", "6758.T": "Nikkei 225", "9984.T": "Nikkei 225",
  "6861.T": "Nikkei 225", "7267.T": "Nikkei 225", "4063.T": "Nikkei 225",
  "6098.T": "Nikkei 225", "6954.T": "Nikkei 225", "9983.T": "Nikkei 225", "8306.T": "Nikkei 225",
  "SHEL.L": "FTSE 100", "AZN.L":  "FTSE 100", "HSBA.L": "FTSE 100",
  "ULVR.L": "FTSE 100", "BP.L":   "FTSE 100", "RIO.L":  "FTSE 100",
  "GSK.L":  "FTSE 100", "BHP.L":  "FTSE 100", "DGE.L":  "FTSE 100", "RR.L": "FTSE 100",
};

// ─── Mapping drapeau / pays ───────────────────────────────────────────────────

function countryFromTicker(ticker: string): { pays: string; drapeau: string } {
  if (ticker.endsWith(".PA")) return { pays: "France",       drapeau: "🇫🇷" };
  if (ticker.endsWith(".T"))  return { pays: "Japon",        drapeau: "🇯🇵" };
  if (ticker.endsWith(".L"))  return { pays: "Royaume-Uni",  drapeau: "🇬🇧" };
  return                             { pays: "États-Unis",   drapeau: "🇺🇸" };
}

// ─── Lookup Supabase (pour nom, secteur, prixDevise du cache) ─────────────────

interface CacheData { source: string; indices: IndiceData[] }

async function findInCache(symbol: string): Promise<StockRow | null> {
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
      if (found) return found;
    }
  } catch {
    for (const indice of STATIC_INDICES) {
      const found = indice.stocks.find(
        (s) => s.ticker.toUpperCase() === symbol.toUpperCase()
      );
      if (found) return found;
    }
  }
  return null;
}

// ─── Instance Yahoo Finance ───────────────────────────────────────────────────

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey", "ripHistorical"] });

// ─── Conversion GBp helper ────────────────────────────────────────────────────

function gbpConvert(v: number | undefined | null, isL: boolean): number | null {
  if (v == null) return null;
  return isL ? Math.round((v / 100) * 100) / 100 : Math.round(v * 100) / 100;
}

// ─── Données temps réel (quote) — revalidate: 300 via page-level ─────────────

interface LiveData {
  prix: number;
  variation: number;
  capMds: number;
  secteurYahoo?: string;
  longName?: string;
  volume?:        number | null;
  dayHigh?:       number | null;
  dayLow?:        number | null;
  high52w?:       number | null;
  low52w?:        number | null;
  previousClose?: number | null;
}

async function getLiveData(symbol: string): Promise<LiveData | null> {
  try {
    const q = await (yf.quote as (s: string, o: object, m: object) => Promise<Record<string, unknown>>)(
      symbol, {}, { validateResult: false }
    );
    if (!q?.regularMarketPrice) return null;

    const isL  = symbol.endsWith(".L");
    const isT  = symbol.endsWith(".T");

    const rawCap = q.marketCap as number | undefined;
    let capMds = 0;
    if (rawCap && rawCap > 0) {
      capMds = isT
        ? Math.round(rawCap / 1e9 / 150)
        : Math.round(rawCap / 1e9);
    }

    const prix = gbpConvert(q.regularMarketPrice as number, isL) ?? 0;

    return {
      prix,
      variation:     Math.round(((q.regularMarketChangePercent as number) ?? 0) * 100) / 100,
      capMds,
      secteurYahoo:  (q.sector as string | undefined) ?? undefined,
      longName:      (q.longName as string | undefined) ?? (q.shortName as string | undefined),
      volume:        (q.regularMarketVolume as number | undefined) ?? null,
      dayHigh:       gbpConvert(q.regularMarketDayHigh  as number | undefined, isL),
      dayLow:        gbpConvert(q.regularMarketDayLow   as number | undefined, isL),
      high52w:       gbpConvert(q.fiftyTwoWeekHigh      as number | undefined, isL),
      low52w:        gbpConvert(q.fiftyTwoWeekLow       as number | undefined, isL),
      previousClose: gbpConvert(q.regularMarketPreviousClose as number | undefined, isL),
    };
  } catch (err) {
    console.error("[stock-detail] quote error:", err);
    return null;
  }
}

// ─── Données historiques — cachées 1h via unstable_cache ─────────────────────

const getHistoricalData = unstable_cache(
  async (symbol: string): Promise<ChartPoint[]> => {
    try {
      const period2 = new Date().toISOString().split("T")[0];
      const period1 = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        .toISOString().split("T")[0];

      const historical = await yf.historical(symbol, { period1, period2, interval: "1d" });
      const isL = symbol.endsWith(".L");

      return historical.map((d) => ({
        date:  new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
        prix:  isL
          ? Math.round((d.close / 100) * 100) / 100
          : Math.round(d.close * 100) / 100,
      }));
    } catch (err) {
      console.error("[stock-detail] historical error:", err);
      return [];
    }
  },
  ["historical-data"],
  { revalidate: 3600 }
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: { symbol: string } }
): Promise<Metadata> {
  const sym = decodeURIComponent(params.symbol).toUpperCase();
  return {
    title:       `${sym} — Marchés — Finactio`,
    description: `Cours, capitalisation et métriques de ${sym} en temps réel.`,
  };
}

export default async function StockPage({ params }: { params: { symbol: string } }) {
  const symbol = decodeURIComponent(params.symbol);

  // 1. Vérification : le ticker est dans notre univers
  const cachedStock = await findInCache(symbol);
  if (!cachedStock) return notFound();

  const { pays, drapeau } = countryFromTicker(symbol);
  const indiceNom = INDICE_MAP[symbol] ?? INDICE_MAP[symbol.toUpperCase()] ?? "N/A";

  // 2. Quote (5 min) + Historique (1h) en parallèle
  const [live, chartData] = await Promise.all([
    getLiveData(symbol),
    getHistoricalData(symbol),
  ]);

  // 3. Fusion — Yahoo Finance prime sur le cache Supabase
  const prixDevise = cachedStock.prixDevise ?? cachedStock.currency;

  const detail: StockDetail = {
    ticker:        symbol,
    nom:           live?.longName        ?? cachedStock.nom,
    secteur:       live?.secteurYahoo    ?? cachedStock.secteur,
    capMds:        live?.capMds          ?? cachedStock.capMds,
    currency:      cachedStock.currency,
    prixDevise,
    prix:          live?.prix            ?? cachedStock.prix ?? 0,
    variation:     live?.variation       ?? cachedStock.variation ?? 0,
    indiceNom,
    pays,
    drapeau,
    volume:        live?.volume,
    dayHigh:       live?.dayHigh,
    dayLow:        live?.dayLow,
    high52w:       live?.high52w,
    low52w:        live?.low52w,
    previousClose: live?.previousClose,
  };

  return (
    <>
      <Navbar dark />
      <StockDetailClient stock={detail} chartData={chartData} />
      <Footer />
    </>
  );
}
