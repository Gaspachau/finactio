import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export async function GET(
  _req: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const { ticker } = params;

  const [quoteRes, summaryRes] = await Promise.allSettled([
    (yf.quote as (s: string, o: object, m: object) => Promise<Record<string, unknown>>)(
      ticker, {}, { validateResult: false }
    ),
    (yf.quoteSummary as (s: string, o: object, m: object) => Promise<Record<string, unknown>>)(
      ticker,
      { modules: ["summaryDetail", "defaultKeyStatistics", "financialData", "calendarEvents"] },
      { validateResult: false }
    ),
  ]);

  const quote   = quoteRes.status   === "fulfilled" ? quoteRes.value   : {};
  const summary = summaryRes.status === "fulfilled" ? summaryRes.value : {};

  const sd = (summary["summaryDetail"]        as Record<string, unknown> | undefined) ?? {};
  const ks = (summary["defaultKeyStatistics"] as Record<string, unknown> | undefined) ?? {};
  const fd = (summary["financialData"]        as Record<string, unknown> | undefined) ?? {};
  const ce = (summary["calendarEvents"]       as Record<string, unknown> | undefined) ?? {};

  const earnings     = ce["earnings"]     as Record<string, unknown> | undefined;
  const earningsDates= earnings?.["earningsDate"] as unknown[] | undefined;
  const earningsDate = earningsDates?.[0] ?? null;

  return NextResponse.json({
    per:                     (sd["trailingPE"]              as number | null) ?? null,
    dividendeParAction:      (sd["dividendRate"]            as number | null) ?? null,
    rendementDividende:      (sd["dividendYield"]           as number | null) ?? null,
    tauxDistribution:        (sd["payoutRatio"]             as number | null) ?? null,
    bpa:                     (ks["trailingEps"]              as number | null) ?? null,
    margeNette:              (fd["profitMargins"]            as number | null) ?? null,
    croissanceDividende5ans: (ks["fiveYearAvgDividendYield"] as number | null) ?? null,
    dernierVersement:        sd["exDividendDate"]  ?? null,
    prochainResultats:       earningsDate          ?? null,
    prochainDividende:       ce["exDividendDate"]  ?? null,
    versementDividende:      ce["dividendDate"]    ?? null,
    volume:                  (quote["regularMarketVolume"] as number | null) ?? null,
    exchange:                (quote["fullExchangeName"]    as string | null) ?? null,
    marketTime:              (quote["regularMarketTime"]   as number | null) ?? null,
  }, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
