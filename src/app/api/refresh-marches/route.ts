import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import YahooFinance from "yahoo-finance2";
import { STATIC_INDICES } from "@/lib/marches-data";
import type { IndiceData, StockRow } from "@/app/marches/MarchesClient";

// ─── Symboles actions par indice ──────────────────────────────────────────────

const SYMBOLS: Record<string, string[]> = {
  cac40:   ["MC.PA","TTE.PA","RMS.PA","SU.PA","SAN.PA","OR.PA","AIR.PA","BNP.PA","SAF.PA","AI.PA"],
  dax40:   ["SAP.DE","SIE.DE","ALV.DE","DTE.DE","MBG.DE","BMW.DE","BAS.DE","VOW3.DE","IFX.DE","ADS.DE"],
  ftsemib: ["ENEL.MI","UCG.MI","ISP.MI","RACE.MI","ENI.MI","STM.MI","MB.MI","LDO.MI","STLA.MI","TIT.MI"],
  ibex35:  ["ITX.MC","SAN.MC","BBVA.MC","IBE.MC","TEF.MC"],
  bel20:   ["ABI.BR","UCB.BR","KBC.BR","AGS.BR","SOLB.BR"],
  aex:     ["ASML.AS","SHEL.AS","INGA.AS","HEIA.AS","PHIA.AS"],
  ftse100: ["SHEL.L","AZN.L","HSBA.L","ULVR.L","BP.L","RIO.L","GSK.L","BHP.L","DGE.L","RR.L"],
  sp500:   ["AAPL","MSFT","NVDA","AMZN","GOOGL","META","BRK-B","LLY","TSLA","AVGO"],
  nikkei:  ["7203.T","6758.T","9984.T","6861.T","7267.T","4063.T","6098.T","6954.T","9983.T","8306.T"],
  smi:     ["NESN.SW","NOVN.SW","ROG.SW","UBSG.SW","ABBN.SW","CFR.SW","ZURN.SW","SREN.SW","LONN.SW","GIVN.SW"],
};

// ─── Matières premières & devises ─────────────────────────────────────────────

const COMMODITY_SYMBOLS = ["GC=F", "EURUSD=X"];

// ─── Symboles d'indices Yahoo Finance (pour variation réelle) ─────────────────

const INDEX_SYMBOL_MAP: Record<string, string> = {
  cac40:   "^FCHI",
  dax40:   "^GDAXI",
  ftsemib: "^FTSEMIB",
  ibex35:  "^IBEX",
  bel20:   "^BFX",
  aex:     "^AEX",
  ftse100: "^FTSE",
  sp500:   "^GSPC",
  nikkei:  "^N225",
  smi:     "^SSMI",
};

const INDEX_SYMBOLS = Object.values(INDEX_SYMBOL_MAP);

// ─── Suffixes européens (EUR) ─────────────────────────────────────────────────

function isEuro(ticker: string): boolean {
  return (
    ticker.endsWith(".PA") || ticker.endsWith(".DE") || ticker.endsWith(".MI") ||
    ticker.endsWith(".MC") || ticker.endsWith(".BR") || ticker.endsWith(".AS")
  );
}

function isCHF(ticker: string): boolean {
  return ticker.endsWith(".SW");
}

// ─── Route GET ────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Déduplique : actions + symboles d'indices + matières premières
  const allStockSymbols = Array.from(new Set(Object.values(SYMBOLS).flat()));
  const allSymbols = Array.from(new Set([...allStockSymbols, ...INDEX_SYMBOLS, ...COMMODITY_SYMBOLS]));

  // 1 seul appel batch Yahoo Finance
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

      const rawCap   = q?.marketCap as number | undefined;
      const rawPrice = q?.regularMarketPrice as number | undefined;

      // ── Capitalisation ────────────────────────────────────────────────────────
      let capMds   = base.capMds;
      let currency = base.currency;

      if (rawCap && rawCap > 0) {
        if (ticker.endsWith(".T")) {
          capMds = Math.round(rawCap / 1e9 / 150); // JPY → Mds$ equiv
          currency = "$";
        } else if (isEuro(ticker)) {
          capMds = Math.round(rawCap / 1e9);
          currency = "€";
        } else if (isCHF(ticker)) {
          capMds = Math.round(rawCap / 1e9);
          currency = "CHF";
        } else {
          capMds = Math.round(rawCap / 1e9);
          currency = ticker.endsWith(".L") ? "$" : "$";
        }
      }

      // ── Prix ──────────────────────────────────────────────────────────────────
      let prix: number | null = null;
      let prixDevise: string  = currency;

      if (rawPrice != null && rawPrice > 0) {
        if (ticker.endsWith(".L")) {
          prix = Math.round((rawPrice / 100) * 100) / 100; // GBp → £
          prixDevise = "£";
        } else if (ticker.endsWith(".T")) {
          prix = Math.round(rawPrice); // JPY
          prixDevise = "¥";
        } else if (ticker.endsWith(".SW")) {
          prix = Math.round(rawPrice * 100) / 100;
          prixDevise = "CHF";
        } else {
          prix = Math.round(rawPrice * 100) / 100;
          prixDevise = currency; // "€" ou "$"
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

  function getIndexVariation(indiceId: string): number | null {
    const symbol = INDEX_SYMBOL_MAP[indiceId];
    if (!symbol) return null;
    const q = quoteMap.get(symbol);
    if (q?.regularMarketChangePercent == null) return null;
    return Math.round((q.regularMarketChangePercent as number) * 100) / 100;
  }

  const updatedIndices: IndiceData[] = STATIC_INDICES.map((indice) => ({
    ...indice,
    stocks: buildStocks(indice.id),
    indexVariation: getIndexVariation(indice.id),
  }));

  // ─── Matières premières & devises ─────────────────────────────────────────────

  function extractCommodity(symbol: string): { prix: number | null; variation: number | null } {
    const q = quoteMap.get(symbol);
    if (!q) return { prix: null, variation: null };
    const rawPrice = q["regularMarketPrice"] as number | undefined;
    const rawPct   = q["regularMarketChangePercent"] as number | undefined;
    return {
      prix:      rawPrice != null ? Math.round(rawPrice * 100) / 100 : null,
      variation: rawPct   != null ? Math.round(rawPct   * 100) / 100 : null,
    };
  }

  const commodities = {
    gold:   extractCommodity("GC=F"),
    eurusd: extractCommodity("EURUSD=X"),
  };

  // ─── Sauvegarde dans Supabase ─────────────────────────────────────────────────

  const payload = {
    source: symbolsFetched > 0 ? "yahoo" : "static",
    indices: updatedIndices,
    commodities,
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
    indicesFetched: updatedIndices.map((i) => ({
      id: i.id,
      stocks: i.stocks.length,
      indexVariation: i.indexVariation,
    })),
  });
}
