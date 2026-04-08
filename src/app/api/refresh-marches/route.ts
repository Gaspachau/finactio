import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { STATIC_INDICES } from "@/lib/marches-data";

interface FmpProfile {
  symbol: string;
  marketCap: number;
  changePercentage: number | null;
}

export async function GET(req: NextRequest) {
  // ── Vérification du secret ──────────────────────────────────────────────────
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "FMP_API_KEY not configured" }, { status: 500 });
  }

  // ── Collecte des symboles dédupliqués ───────────────────────────────────────
  const symbolSet = new Set<string>();
  for (const indice of STATIC_INDICES) {
    for (const stock of indice.stocks) {
      symbolSet.add(stock.ticker);
    }
  }
  const symbols = Array.from(symbolSet).join(",");

  // ── 1 seul appel batch FMP ──────────────────────────────────────────────────
  let fmpData: FmpProfile[] = [];
  try {
    const url = `https://financialmodelingprep.com/stable/profile?symbol=${encodeURIComponent(symbols)}&apikey=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    if (Array.isArray(json)) fmpData = json;
  } catch (err) {
    console.error("[refresh-marches] FMP fetch error:", err);
    // On continue avec les données statiques si l'API échoue
  }

  // ── Lookup map ticker → données FMP ────────────────────────────────────────
  const map = new Map<string, FmpProfile>();
  for (const item of fmpData) {
    if (item?.symbol) map.set(item.symbol, item);
  }

  // ── Mise à jour des données ─────────────────────────────────────────────────
  const updatedIndices = STATIC_INDICES.map((indice) => ({
    ...indice,
    stocks: indice.stocks.map((stock) => {
      const info = map.get(stock.ticker);
      if (!info || !info.marketCap) return stock;

      // Conversion market cap en milliards
      // Nikkei (.T) : FMP retourne en JPY → diviser par 150 pour USD
      const capMds = stock.ticker.endsWith(".T")
        ? Math.round(info.marketCap / 1e9 / 150)
        : Math.round(info.marketCap / 1e9);

      const variation =
        info.changePercentage !== null && info.changePercentage !== undefined
          ? Math.round(info.changePercentage * 100) / 100
          : stock.variation;

      return { ...stock, capMds, variation };
    }),
  }));

  // ── Écriture dans public/data/marches.json ──────────────────────────────────
  const payload = {
    updatedAt: new Date().toISOString(),
    source: fmpData.length > 0 ? "fmp" : "static",
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

  return NextResponse.json({ success: true, updatedAt: payload.updatedAt, symbolsUpdated: fmpData.length });
}
