import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import YahooFinance from "yahoo-finance2";
import { STATIC_INDICES } from "@/lib/marches-data";
import type { IndiceData, StockRow } from "@/app/marches/MarchesClient";

// ─── Symboles par indice ───────────────────────────────────────────────────────

const SYMBOLS: Record<string, string[]> = {
  cac40:  ["MC.PA","TTE.PA","RMS.PA","SU.PA","SAN.PA","OR.PA","AIR.PA","BNP.PA","SAF.PA","AI.PA"],
  sp500:  ["AAPL","MSFT","NVDA","AMZN","GOOGL","META","BRK-B","LLY","TSLA","AVGO"],
  nasdaq: ["AAPL","MSFT","NVDA","AMZN","META","GOOGL","TSLA","AVGO","COST","NFLX"],
  nikkei: ["7203.T","6758.T","9984.T","6861.T","7267.T","4063.T","6098.T","6954.T","9983.T","8306.T"],
  ftse100:["SHEL.L","AZN.L","HSBA.L","ULVR.L","BP.L","RIO.L","GSK.L","BHP.L","DGE.L","RR.L"],
};

// ─── Route GET ────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Vérification du secret
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    // Fallback : on sauvegarde les données statiques avec la date actuelle
  }

  // ─── Reconstruction des indices ──────────────────────────────────────────────

  // Lookup des données statiques par ticker (pour slug, rang, secteur, nom FR)
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

      // Capitalisation boursière en milliards
      let capMds = base.capMds;
      if (q?.marketCap && typeof q.marketCap === "number" && q.marketCap > 0) {
        // Nikkei (.T) : Yahoo retourne en JPY → conversion USD
        capMds = ticker.endsWith(".T")
          ? Math.round((q.marketCap as number) / 1e9 / 150)
          : Math.round((q.marketCap as number) / 1e9);
      }

      // Variation journalière (Yahoo retourne déjà en %)
      const variation =
        q?.regularMarketChangePercent != null
          ? Math.round((q.regularMarketChangePercent as number) * 100) / 100
          : base.variation;

      rows.push({ ...base, capMds, variation });
    }

    // Tri par capitalisation décroissante + renumérotation
    return rows
      .filter((r) => r.capMds > 0)
      .sort((a, b) => b.capMds - a.capMds)
      .map((r, i) => ({ ...r, rang: i + 1 }));
  }

  const updatedIndices: IndiceData[] = STATIC_INDICES.map((indice) => ({
    ...indice,
    stocks: buildStocks(indice.id),
  }));

  // ─── Écriture dans public/data/marches.json ───────────────────────────────

  const payload = {
    updatedAt: new Date().toISOString(),
    source: symbolsFetched > 0 ? "yahoo" : "static",
    indices: updatedIndices,
  };

  try {
    const dir = path.join(process.cwd(), "public", "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "marches.json"), JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    console.error("[refresh-marches] Write error:", err);
    return NextResponse.json({ error: "Failed to write marches.json" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    updatedAt: payload.updatedAt,
    source: payload.source,
    symbolsFetched,
  });
}
