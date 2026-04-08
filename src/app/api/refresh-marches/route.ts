import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import YahooFinance from "yahoo-finance2";
import { STATIC_INDICES } from "@/lib/marches-data";
import type { IndiceData, StockRow } from "@/app/marches/MarchesClient";

// ─── Symboles par indice ───────────────────────────────────────────────────────

const SYMBOLS: Record<string, string[]> = {
  cac40:   ["MC.PA","TTE.PA","RMS.PA","SU.PA","SAN.PA","OR.PA","AIR.PA","BNP.PA","SAF.PA","AI.PA"],
  sp500:   ["AAPL","MSFT","NVDA","AMZN","GOOGL","META","BRK-B","LLY","TSLA","AVGO"],
  nasdaq:  ["AAPL","MSFT","NVDA","AMZN","META","GOOGL","TSLA","AVGO","COST","NFLX"],
  nikkei:  ["7203.T","6758.T","9984.T","6861.T","7267.T","4063.T","6098.T","6954.T","9983.T","8306.T"],
  ftse100: ["SHEL.L","AZN.L","HSBA.L","ULVR.L","BP.L","RIO.L","GSK.L","BHP.L","DGE.L","RR.L"],
};

// ─── Route GET ────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Vérification du secret
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Client Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Déduplique tous les symboles
  const allSymbols = Array.from(new Set(Object.values(SYMBOLS).flat()));

  // 1 seul appel Yahoo Finance pour tous les symboles
  let quoteMap = new Map<string, Record<string, unknown>>();
  let symbolsFetched = 0;

  try {
    const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });
    const quotes = await (yf.quote as (s: string[], o: object, m: object) => Promise<Record<string, unknown>[]>)(
      allSymbols, {}, { validateResult: false }
    );
    const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
    quoteMap = new Map(quotesArray.map((q) => [q["symbol"] as string, q]));
    symbolsFetched = quoteMap.size;
  } catch (err) {
    console.error("[refresh-marches] Yahoo Finance error:", err);
  }

  // ─── Lookup statique ──────────────────────────────────────────────────────────

  const staticMap = new Map<string, StockRow>();
  for (const indice of STATIC_INDICES) {
    for (const stock of indice.stocks) {
      staticMap.set(stock.ticker, stock);
    }
  }

  function buildStocks(indiceId: string): StockRow[] {
    const tickers = SYMBOLS[indiceId] ?? [];
    const rows: StockRow[] = [];

    for (const ticker of tickers) {
      const q = quoteMap.get(ticker);
      const base = staticMap.get(ticker);
      if (!base) continue;

      const rawCap = q?.marketCap as number | undefined;
      const rawPrice = q?.regularMarketPrice as number | undefined;

      // ── Capitalisation ────────────────────────────────────────────────────────
      // .PA  → Yahoo: EUR  → rawCap / 1e9 → Mds€
      // US   → Yahoo: USD  → rawCap / 1e9 → Mds$
      // .T   → Yahoo: JPY  → rawCap / 1e9 / 150 → Mds$ (USD equiv)
      // .L   → Yahoo: USD  (marketCap normalisé en USD malgré currency=GBp)
      //              → rawCap / 1e9 → Mds$
      let capMds = base.capMds;
      let currency = base.currency;

      if (rawCap && rawCap > 0) {
        if (ticker.endsWith(".T")) {
          capMds = Math.round(rawCap / 1e9 / 150);
          currency = "$";
        } else {
          capMds = Math.round(rawCap / 1e9);
          currency = ticker.endsWith(".PA") ? "€" : "$";
        }
      }

      // ── Prix ──────────────────────────────────────────────────────────────────
      // .L  → Yahoo: regularMarketPrice en GBp (pence) → divise par 100 pour £
      // .T  → Yahoo: regularMarketPrice en JPY → affiche tel quel en ¥
      // .PA → EUR, US → USD : affiche tel quel
      let prix: number | null = null;
      let prixDevise: string = currency;

      if (rawPrice != null && rawPrice > 0) {
        if (ticker.endsWith(".L")) {
          prix = Math.round((rawPrice / 100) * 100) / 100;
          prixDevise = "£";
        } else if (ticker.endsWith(".T")) {
          prix = Math.round(rawPrice);
          prixDevise = "¥";
        } else {
          prix = Math.round(rawPrice * 100) / 100;
          prixDevise = currency;
        }
      }

      const variation =
        q?.regularMarketChangePercent != null
          ? Math.round((q.regularMarketChangePercent as number) * 100) / 100
          : base.variation;

      rows.push({ ...base, capMds, variation, currency, prix, prixDevise });
    }

    return rows
      .filter((r) => r.capMds > 0)
      .sort((a, b) => b.capMds - a.capMds)
      .map((r, i) => ({ ...r, rang: i + 1 }));
  }

  const updatedIndices: IndiceData[] = STATIC_INDICES.map((indice) => ({
    ...indice,
    stocks: buildStocks(indice.id),
  }));

  // ─── Sauvegarde dans Supabase ─────────────────────────────────────────────────

  const payload = {
    source: symbolsFetched > 0 ? "yahoo" : "static",
    indices: updatedIndices,
  };

  const { error } = await supabase
    .from("marches_cache")
    .update({ data: payload, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    console.error("[refresh-marches] Supabase write error:", error);
    return NextResponse.json({ error: "Failed to update Supabase cache", details: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    updatedAt: new Date().toISOString(),
    source: payload.source,
    symbolsFetched,
  });
}
