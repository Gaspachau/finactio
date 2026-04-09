import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import YahooFinance from "yahoo-finance2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarchesClient, { type IndiceData, type StockRow } from "./MarchesClient";
import { STATIC_INDICES } from "@/lib/marches-data";

export const metadata: Metadata = {
  title: "Marchés mondiaux — Finactio",
  description: "Tous les grands indices mondiaux classés par capitalisation : CAC 40, S&P 500, NASDAQ, Nikkei, FTSE 100.",
};

export const revalidate = 60; // prix temps réel, refresh 1 min

// ─── Yahoo Finance (instance module-level) ────────────────────────────────────

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// ─── Lecture depuis Supabase ───────────────────────────────────────────────────

interface CommodityItem { prix: number | null; variation: number | null; }

interface MarchesCache {
  source: "yahoo" | "static";
  indices: IndiceData[];
  commodities?: { gold: CommodityItem; eurusd: CommodityItem };
}

async function loadFromSupabase(): Promise<{
  indices: IndiceData[];
  updatedAt: string | null;
  commodities: MarchesCache["commodities"];
}> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: row, error } = await supabase
      .from("marches_cache")
      .select("data, updated_at")
      .eq("id", 1)
      .single();

    if (error || !row?.data) throw new Error(error?.message ?? "empty");

    const cache = row.data as MarchesCache;
    return {
      indices:     cache.indices ?? STATIC_INDICES,
      updatedAt:   row.updated_at as string,
      commodities: cache.commodities,
    };
  } catch {
    return { indices: STATIC_INDICES, updatedAt: null, commodities: undefined };
  }
}

// ─── Merge avec prix temps réel Yahoo Finance ─────────────────────────────────

async function mergeLivePrices(indices: IndiceData[]): Promise<IndiceData[]> {
  try {
    // Collecte tous les tickers uniques
    const allTickers = Array.from(
      new Set(indices.flatMap((idx) => idx.stocks.map((s) => s.ticker)))
    );

    // 1 appel batch Yahoo Finance
    const quotes = await (yf.quote as (s: string[], o: object, m: object) => Promise<Record<string, unknown>[]>)(
      allTickers, {}, { validateResult: false }
    );

    // Map ticker → quote
    const quoteMap = new Map<string, Record<string, unknown>>();
    for (const q of quotes) {
      if (q?.symbol) quoteMap.set(q.symbol as string, q);
    }

    // Merge : garde cap/secteur/nom de Supabase, met à jour prix/variation
    return indices.map((indice) => ({
      ...indice,
      stocks: indice.stocks.map((stock): StockRow => {
        const q = quoteMap.get(stock.ticker);
        if (!q) return stock;

        const isL = stock.ticker.endsWith(".L");
        const rawPrice = q.regularMarketPrice as number | undefined;
        const prix = rawPrice != null
          ? (isL ? Math.round((rawPrice / 100) * 100) / 100 : Math.round(rawPrice * 100) / 100)
          : stock.prix;

        const rawPct = q.regularMarketChangePercent as number | undefined;
        const variation = rawPct != null
          ? Math.round(rawPct * 100) / 100
          : stock.variation;

        return { ...stock, prix, variation };
      }),
    }));
  } catch (err) {
    console.error("[marches] live price merge error:", err);
    return indices; // fallback : données Supabase inchangées
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MarchesPage() {
  const { indices: baseIndices, updatedAt, commodities } = await loadFromSupabase();
  const indices = await mergeLivePrices(baseIndices);
  const fromCache = updatedAt !== null;

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <Navbar dark />
      <MarchesClient indices={indices} updatedAt={updatedAt} fromCache={fromCache} commodities={commodities} />
      <Footer />
    </div>
  );
}
