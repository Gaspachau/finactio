import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { STATIC_INDICES } from "@/lib/marches-data";
import type { StockRow } from "@/app/marches/MarchesClient";

// ─── Tous les symboles par indice ─────────────────────────────────────────────

const INDICE_SYMBOLS: Record<string, string[]> = {
  cac40: [
    "MC.PA","TTE.PA","RMS.PA","SU.PA","SAN.PA","OR.PA","AIR.PA","BNP.PA","SAF.PA","AI.PA",
    "CS.PA","SG.PA","ACA.PA","BN.PA","KER.PA","RI.PA","DSY.PA","CAP.PA","VIE.PA","ML.PA",
    "DG.PA","PUB.PA","LR.PA","SW.PA","STLAP.PA","MTX.PA","TEP.PA","ERF.PA","WLN.PA","ENGI.PA",
    "ORA.PA","STM.PA","ATO.PA","HO.PA","TFI.PA","SOLB.PA","EL.PA","RCO.PA","BOL.PA","GTT.PA",
  ],
  dax40: [
    "SAP.DE","SIE.DE","ALV.DE","DTE.DE","MBG.DE","BMW.DE","BAS.DE","VOW3.DE","IFX.DE","ADS.DE",
    "MRK.DE","BAYN.DE","DB1.DE","HEN3.DE","MTX.DE","RWE.DE","PAH3.DE","AIR.DE","FME.DE","SHL.DE",
    "DHER.DE","ZAL.DE","VNA.DE","SY1.DE","QIA.DE","ENR.DE","BNR.DE","GXI.DE","HNR1.DE","LEG.DE",
    "P911.DE","BEI.DE","DHL.DE","1COV.DE","MAN.DE","CBKG.DE","FRE.DE","CON.DE","HEI.DE","G1A.DE",
  ],
  ftsemib: [
    "ENEL.MI","UCG.MI","ISP.MI","RACE.MI","ENI.MI","STM.MI","MB.MI","LDO.MI","STLA.MI","TIT.MI",
    "TRN.MI","AZM.MI","BMED.MI","G.MI","CNHI.MI","MONC.MI","PRY.MI","PST.MI","BGN.MI","INW.MI",
  ],
  ibex35: [
    "ITX.MC","SAN.MC","BBVA.MC","IBE.MC","TEF.MC","REE.MC","GAS.MC","REP.MC","ACS.MC","FER.MC",
    "CLNX.MC","ENG.MC","MAP.MC","AENA.MC","MRL.MC","CABK.MC","SAB.MC","BKT.MC","VIS.MC","MEL.MC",
  ],
  bel20: [
    "ABI.BR","UCB.BR","KBC.BR","AGS.BR","SOLB.BR","UMI.BR","WDP.BR","GLPG.BR","BPOST.BR","GBLB.BR",
    "COFB.BR","AED.BR","BELU.BR","COLR.BR","DIE.BR","EVS.BR","MELE.BR","ONTEX.BR","PROX.BR","TER.BR",
  ],
  aex: [
    "ASML.AS","SHEL.AS","INGA.AS","HEIA.AS","PHIA.AS","ADYEN.AS","NN.AS","WKL.AS","RAND.AS",
    "AH.AS","URW.AS","AKZA.AS","DSM.AS","IMCD.AS","BESI.AS","LIGHT.AS","VPK.AS","OCI.AS",
  ],
  ftse100: [
    "SHEL.L","AZN.L","HSBA.L","ULVR.L","BP.L","RIO.L","GSK.L","BHP.L","DGE.L","RR.L",
    "LSEG.L","NG.L","REL.L","CPG.L","BATS.L","AAL.L","GLEN.L","ABF.L","AV.L","BARC.L",
    "LLOY.L","STAN.L","NWG.L","PRU.L","MNDI.L","RKT.L","VOD.L","BT-A.L","MNG.L","INF.L",
  ],
  sp500: [
    "AAPL","MSFT","NVDA","AMZN","GOOGL","META","BRK-B","LLY","TSLA","AVGO",
    "JPM","UNH","XOM","V","MA","PG","HD","COST","MRK","ABBV",
    "CVX","CRM","BAC","NFLX","KO","PEP","TMO","ORCL","ACN","MCD",
    "CSCO","ABT","WMT","NKE","PM","ADBE","TXN","DHR","BMY","AMGN",
  ],
  nikkei: [
    "7203.T","6758.T","9984.T","6861.T","7267.T","4063.T","6098.T","6954.T","9983.T","8306.T",
    "7751.T","6502.T","4519.T","9433.T","8035.T","6857.T","7832.T","4543.T","9432.T","6367.T",
    "4901.T","7201.T","3382.T","6594.T","8001.T","8031.T","9020.T","7011.T","5401.T","4523.T",
  ],
};

// ─── Traduction secteur Yahoo → français ─────────────────────────────────────

const SECTOR_FR: Record<string, string> = {
  "Technology":             "Technologie",
  "Healthcare":             "Santé",
  "Financial Services":     "Finance",
  "Consumer Cyclical":      "Consommation",
  "Consumer Defensive":     "Consommation",
  "Energy":                 "Énergie",
  "Industrials":            "Industrie",
  "Basic Materials":        "Chimie",
  "Communication Services": "Télécommunications",
  "Real Estate":            "Immobilier",
  "Utilities":              "Énergie",
};

// ─── Lookup statique (noms & secteurs FR) ─────────────────────────────────────

const staticMeta = new Map<string, Pick<StockRow, "nom" | "secteur" | "slug">>();
for (const indice of STATIC_INDICES) {
  for (const stock of indice.stocks) {
    staticMeta.set(stock.ticker, { nom: stock.nom, secteur: stock.secteur, slug: stock.slug });
  }
}

// ─── Helpers devise ───────────────────────────────────────────────────────────

function isEuro(ticker: string): boolean {
  return [".PA", ".DE", ".MI", ".MC", ".BR", ".AS"].some((s) => ticker.endsWith(s));
}

// ─── Yahoo Finance ────────────────────────────────────────────────────────────

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// ─── Route GET ────────────────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const symbols = INDICE_SYMBOLS[id];
  if (!symbols) {
    return NextResponse.json({ error: "Unknown indice" }, { status: 404 });
  }

  try {
    const rawQuotes = await (
      yf.quote as (s: string[], o: object, m: object) => Promise<Record<string, unknown>[]>
    )(symbols, {}, { validateResult: false });

    const quotesArray = Array.isArray(rawQuotes) ? rawQuotes : [rawQuotes];
    const rows: StockRow[] = [];

    for (const q of quotesArray) {
      const ticker = q.symbol as string | undefined;
      if (!ticker) continue;

      const rawCap   = q.marketCap   as number | undefined;
      const rawPrice = q.regularMarketPrice as number | undefined;
      if (!rawCap || rawCap <= 0) continue;

      // ── Capitalisation & devise ───────────────────────────────────────────────
      let currency: string;
      let capMds: number;

      if (ticker.endsWith(".T")) {
        currency = "$";
        capMds = Math.round(rawCap / 1e9 / 150);
      } else if (isEuro(ticker)) {
        currency = "€";
        capMds = Math.round(rawCap / 1e9);
      } else {
        currency = "$";
        capMds = Math.round(rawCap / 1e9);
      }

      // ── Prix ─────────────────────────────────────────────────────────────────
      let prix: number | null = null;
      let prixDevise = currency;

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
        q.regularMarketChangePercent != null
          ? Math.round((q.regularMarketChangePercent as number) * 100) / 100
          : null;

      // ── Nom & secteur (statique en priorité, sinon Yahoo) ─────────────────────
      const base        = staticMeta.get(ticker);
      const yahooSector = q.sector as string | undefined;
      const nom     = base?.nom     ?? (q.longName  as string | undefined) ?? (q.shortName as string | undefined) ?? ticker;
      const secteur = base?.secteur ?? (yahooSector ? (SECTOR_FR[yahooSector] ?? yahooSector) : "—");
      const slug    = base?.slug    ?? ticker.toLowerCase().replace(/\./g, "-").replace(/[^a-z0-9-]/g, "-");

      rows.push({ rang: 0, nom, ticker, secteur, capMds, variation, currency, slug, prix, prixDevise });
    }

    const stocks = rows
      .filter((r) => r.capMds > 0)
      .sort((a, b) => b.capMds - a.capMds)
      .map((r, i) => ({ ...r, rang: i + 1 }));

    return NextResponse.json({ stocks }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    console.error(`[api/indice/${id}] error:`, err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
