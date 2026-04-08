import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarchesClient, { type IndiceData, type StockRow } from "./MarchesClient";

export const metadata: Metadata = {
  title: "Marchés mondiaux — Finactio",
  description: "Tous les grands indices mondiaux classés par capitalisation : CAC 40, S&P 500, NASDAQ, Nikkei, FTSE 100.",
};

// ─── Types FMP ────────────────────────────────────────────────────────────────

interface FMPStock {
  symbol: string;
  companyName: string | null;
  marketCap: number | null;
  sector: string | null;
  changesPercentage?: number | null;
}

// ─── Mapping secteurs EN → FR ─────────────────────────────────────────────────

const SECTOR_FR: Record<string, string> = {
  "Technology":             "Technologie",
  "Healthcare":             "Santé",
  "Energy":                 "Énergie",
  "Financial Services":     "Finance",
  "Financials":             "Finance",
  "Consumer Cyclical":      "Consommation",
  "Consumer Defensive":     "Consommation",
  "Consumer Goods":         "Consommation",
  "Industrials":            "Industrie",
  "Basic Materials":        "Matières premières",
  "Materials":              "Matières premières",
  "Real Estate":            "Immobilier",
  "Communication Services": "Télécom & Médias",
  "Utilities":              "Services publics",
  "Aerospace & Defense":    "Aéronautique",
  "Automotive":             "Auto",
  "Semiconductors":         "Semi-conducteurs",
};

function mapSector(s: string | null): string {
  if (!s) return "Divers";
  return SECTOR_FR[s] ?? s;
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchTopStocks(exchange: string, limit: number, currency: string): Promise<StockRow[]> {
  const key = process.env.FMP_API_KEY;
  if (!key) return [];

  try {
    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/stock-screener?exchange=${exchange}&limit=${limit}&apikey=${key}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];

    const raw: unknown = await res.json();
    if (!Array.isArray(raw)) return [];

    return (raw as FMPStock[])
      .filter((s) => s.marketCap && s.marketCap > 0 && s.symbol && s.companyName)
      .sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0))
      .slice(0, 10)
      .map((s, i): StockRow => ({
        rang: i + 1,
        nom: s.companyName ?? s.symbol,
        ticker: s.symbol,
        secteur: mapSector(s.sector),
        capMds: Math.round((s.marketCap ?? 0) / 1e9),
        variation: s.changesPercentage ?? null,
        currency,
        slug: s.symbol.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      }));
  } catch {
    return [];
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MarchesPage() {
  const [euronext, nyse, nasdaq, jpx, lse] = await Promise.all([
    fetchTopStocks("EURONEXT", 40, "€"),
    fetchTopStocks("NYSE",     50, "$"),
    fetchTopStocks("NASDAQ",   50, "$"),
    fetchTopStocks("JPX",      30, "$"),
    fetchTopStocks("LSE",      30, "$"),
  ]);

  const indices: IndiceData[] = [
    {
      id: "cac40",
      nom: "CAC 40",
      pays: "France",
      drapeau: "🇫🇷",
      region: "europe",
      description: "Les 40 plus grandes capitalisations cotées sur Euronext Paris.",
      stocks: euronext,
    },
    {
      id: "sp500",
      nom: "S&P 500",
      pays: "États-Unis",
      drapeau: "🇺🇸",
      region: "usa",
      description: "Les 500 plus grandes entreprises américaines cotées en Bourse.",
      stocks: nyse,
    },
    {
      id: "nasdaq",
      nom: "NASDAQ 100",
      pays: "Tech US",
      drapeau: "🇺🇸",
      region: "usa",
      description: "Les plus grandes valeurs technologiques et de croissance cotées au NASDAQ.",
      stocks: nasdaq,
    },
    {
      id: "nikkei",
      nom: "Nikkei 225",
      pays: "Japon",
      drapeau: "🇯🇵",
      region: "asie",
      description: "Les 225 principales valeurs de la Bourse de Tokyo.",
      stocks: jpx,
    },
    {
      id: "ftse100",
      nom: "FTSE 100",
      pays: "Royaume-Uni",
      drapeau: "🇬🇧",
      region: "europe",
      description: "Les 100 premières capitalisations du London Stock Exchange.",
      stocks: lse,
    },
  ];

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #F0F7FF 0%, #EBF3FF 50%, #F0F7FF 100%)" }}
    >
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-14 px-4 sm:px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(46,128,206,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: "radial-gradient(circle, rgba(46,128,206,0.1) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-4">Marchés</p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black uppercase text-[#0C2248] leading-none mb-4"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Les marchés
            <br />
            <span className="text-[#2E80CE]">mondiaux</span>
          </h1>
          <p className="text-[#1E3A5F] text-lg max-w-xl">
            Tous les grands indices, classés par capitalisation. Données actualisées toutes les heures.
          </p>
        </div>
      </section>

      <MarchesClient indices={indices} />

      <Footer />
    </main>
  );
}
