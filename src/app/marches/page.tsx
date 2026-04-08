import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarchesClient, { type IndiceData } from "./MarchesClient";

export const metadata: Metadata = {
  title: "Marchés mondiaux — Finactio",
  description: "Tous les grands indices mondiaux classés par capitalisation : CAC 40, S&P 500, NASDAQ, Nikkei, FTSE 100.",
};

// ─── Données statiques (capitalisations indicatives — avril 2026) ─────────────

const INDICES: IndiceData[] = [
  {
    id: "cac40",
    nom: "CAC 40",
    pays: "France",
    drapeau: "🇫🇷",
    region: "europe",
    description: "Les 40 plus grandes capitalisations cotées sur Euronext Paris.",
    stocks: [
      { rang: 1,  nom: "LVMH",               ticker: "MC.PA",  secteur: "Luxe",          capMds: 312, variation:  0.8, currency: "€", slug: "lvmh" },
      { rang: 2,  nom: "TotalEnergies",       ticker: "TTE.PA", secteur: "Énergie",       capMds: 145, variation: -0.3, currency: "€", slug: "totalenergies" },
      { rang: 3,  nom: "Hermès",              ticker: "RMS.PA", secteur: "Luxe",          capMds: 198, variation:  1.2, currency: "€", slug: "hermes" },
      { rang: 4,  nom: "Schneider Electric",  ticker: "SU.PA",  secteur: "Industrie",     capMds: 112, variation:  0.5, currency: "€", slug: "schneider-electric" },
      { rang: 5,  nom: "Sanofi",              ticker: "SAN.PA", secteur: "Santé",         capMds: 108, variation: -0.1, currency: "€", slug: "sanofi" },
      { rang: 6,  nom: "L'Oréal",             ticker: "OR.PA",  secteur: "Consommation",  capMds: 195, variation:  0.6, currency: "€", slug: "loreal" },
      { rang: 7,  nom: "Airbus",              ticker: "AIR.PA", secteur: "Aéronautique",  capMds:  98, variation:  1.8, currency: "€", slug: "airbus" },
      { rang: 8,  nom: "BNP Paribas",         ticker: "BNP.PA", secteur: "Finance",       capMds:  72, variation: -0.4, currency: "€", slug: "bnp-paribas" },
      { rang: 9,  nom: "Safran",              ticker: "SAF.PA", secteur: "Aéronautique",  capMds:  68, variation:  0.9, currency: "€", slug: "safran" },
      { rang: 10, nom: "Air Liquide",         ticker: "AI.PA",  secteur: "Chimie",        capMds:  78, variation:  0.2, currency: "€", slug: "air-liquide" },
    ],
  },
  {
    id: "sp500",
    nom: "S&P 500",
    pays: "États-Unis",
    drapeau: "🇺🇸",
    region: "usa",
    description: "Les 500 plus grandes entreprises américaines cotées en Bourse.",
    stocks: [
      { rang: 1,  nom: "Apple",              ticker: "AAPL",  secteur: "Technologie",      capMds: 3100, variation:  1.2, currency: "$", slug: "apple" },
      { rang: 2,  nom: "Microsoft",          ticker: "MSFT",  secteur: "Technologie",      capMds: 2900, variation:  0.8, currency: "$", slug: "microsoft" },
      { rang: 3,  nom: "Nvidia",             ticker: "NVDA",  secteur: "Semi-conducteurs", capMds: 2600, variation:  2.1, currency: "$", slug: "nvidia" },
      { rang: 4,  nom: "Amazon",             ticker: "AMZN",  secteur: "E-commerce",       capMds: 2100, variation:  0.5, currency: "$", slug: "amazon" },
      { rang: 5,  nom: "Alphabet",           ticker: "GOOGL", secteur: "Technologie",      capMds: 1950, variation:  0.3, currency: "$", slug: "alphabet" },
      { rang: 6,  nom: "Meta",               ticker: "META",  secteur: "Réseaux sociaux",  capMds: 1400, variation:  1.5, currency: "$", slug: "meta" },
      { rang: 7,  nom: "Berkshire Hathaway", ticker: "BRK-B", secteur: "Finance",          capMds: 1050, variation: -0.1, currency: "$", slug: "berkshire-hathaway" },
      { rang: 8,  nom: "Eli Lilly",          ticker: "LLY",   secteur: "Santé",            capMds:  780, variation:  0.7, currency: "$", slug: "eli-lilly" },
      { rang: 9,  nom: "Tesla",              ticker: "TSLA",  secteur: "Automobile",       capMds:  720, variation:  3.2, currency: "$", slug: "tesla" },
      { rang: 10, nom: "Broadcom",           ticker: "AVGO",  secteur: "Semi-conducteurs", capMds:  680, variation:  1.1, currency: "$", slug: "broadcom" },
    ],
  },
  {
    id: "nasdaq",
    nom: "NASDAQ 100",
    pays: "États-Unis",
    drapeau: "🇺🇸",
    region: "usa",
    description: "Les plus grandes valeurs technologiques cotées au NASDAQ.",
    stocks: [
      { rang: 1,  nom: "Apple",     ticker: "AAPL",  secteur: "Technologie",      capMds: 3100, variation:  1.2, currency: "$", slug: "apple" },
      { rang: 2,  nom: "Microsoft", ticker: "MSFT",  secteur: "Technologie",      capMds: 2900, variation:  0.8, currency: "$", slug: "microsoft" },
      { rang: 3,  nom: "Nvidia",    ticker: "NVDA",  secteur: "Semi-conducteurs", capMds: 2600, variation:  2.1, currency: "$", slug: "nvidia" },
      { rang: 4,  nom: "Amazon",    ticker: "AMZN",  secteur: "E-commerce",       capMds: 2100, variation:  0.5, currency: "$", slug: "amazon" },
      { rang: 5,  nom: "Meta",      ticker: "META",  secteur: "Réseaux sociaux",  capMds: 1400, variation:  1.5, currency: "$", slug: "meta" },
      { rang: 6,  nom: "Alphabet",  ticker: "GOOGL", secteur: "Technologie",      capMds: 1950, variation:  0.3, currency: "$", slug: "alphabet" },
      { rang: 7,  nom: "Tesla",     ticker: "TSLA",  secteur: "Automobile",       capMds:  720, variation:  3.2, currency: "$", slug: "tesla" },
      { rang: 8,  nom: "Broadcom",  ticker: "AVGO",  secteur: "Semi-conducteurs", capMds:  680, variation:  1.1, currency: "$", slug: "broadcom" },
      { rang: 9,  nom: "Costco",    ticker: "COST",  secteur: "Distribution",     capMds:  420, variation:  0.4, currency: "$", slug: "costco" },
      { rang: 10, nom: "Netflix",   ticker: "NFLX",  secteur: "Streaming",        capMds:  380, variation:  1.8, currency: "$", slug: "netflix" },
    ],
  },
  {
    id: "nikkei",
    nom: "Nikkei 225",
    pays: "Japon",
    drapeau: "🇯🇵",
    region: "asie",
    description: "Les 225 principales valeurs de la Bourse de Tokyo.",
    stocks: [
      { rang: 1,  nom: "Toyota",           ticker: "7203.T", secteur: "Automobile", capMds: 280, variation:  0.4, currency: "$", slug: "toyota" },
      { rang: 2,  nom: "Sony",             ticker: "6758.T", secteur: "Électronique",capMds: 110, variation:  0.9, currency: "$", slug: "sony" },
      { rang: 3,  nom: "SoftBank",         ticker: "9984.T", secteur: "Technologie", capMds:  98, variation:  1.2, currency: "$", slug: "softbank" },
      { rang: 4,  nom: "Keyence",          ticker: "6861.T", secteur: "Industrie",   capMds:  92, variation:  0.3, currency: "$", slug: "keyence" },
      { rang: 5,  nom: "Mitsubishi UFJ",   ticker: "8306.T", secteur: "Finance",     capMds:  95, variation:  0.6, currency: "$", slug: "mitsubishi-ufj" },
      { rang: 6,  nom: "Recruit Holdings", ticker: "6098.T", secteur: "Services",    capMds:  72, variation:  0.7, currency: "$", slug: "recruit-holdings" },
      { rang: 7,  nom: "Fast Retailing",   ticker: "9983.T", secteur: "Mode",        capMds:  62, variation:  1.4, currency: "$", slug: "fast-retailing" },
      { rang: 8,  nom: "Honda",            ticker: "7267.T", secteur: "Automobile",  capMds:  48, variation: -0.2, currency: "$", slug: "honda" },
      { rang: 9,  nom: "Shin-Etsu Chemical",ticker:"4063.T", secteur: "Chimie",      capMds:  45, variation:  0.5, currency: "$", slug: "shin-etsu-chemical" },
      { rang: 10, nom: "Fanuc",            ticker: "6954.T", secteur: "Robotique",   capMds:  38, variation: -0.1, currency: "$", slug: "fanuc" },
    ],
  },
  {
    id: "ftse100",
    nom: "FTSE 100",
    pays: "Royaume-Uni",
    drapeau: "🇬🇧",
    region: "europe",
    description: "Les 100 plus grandes capitalisations de la Bourse de Londres.",
    stocks: [
      { rang: 1,  nom: "AstraZeneca", ticker: "AZN.L",  secteur: "Santé",        capMds: 210, variation:  0.8, currency: "$", slug: "astrazeneca" },
      { rang: 2,  nom: "Shell",       ticker: "SHEL.L", secteur: "Énergie",      capMds: 185, variation: -0.3, currency: "$", slug: "shell" },
      { rang: 3,  nom: "HSBC",        ticker: "HSBA.L", secteur: "Finance",      capMds: 145, variation:  0.2, currency: "$", slug: "hsbc" },
      { rang: 4,  nom: "Rio Tinto",   ticker: "RIO.L",  secteur: "Mines",        capMds:  95, variation:  1.1, currency: "$", slug: "rio-tinto" },
      { rang: 5,  nom: "Unilever",    ticker: "ULVR.L", secteur: "Consommation", capMds: 112, variation:  0.4, currency: "$", slug: "unilever" },
      { rang: 6,  nom: "BHP",         ticker: "BHP.L",  secteur: "Mines",        capMds:  82, variation:  0.9, currency: "$", slug: "bhp" },
      { rang: 7,  nom: "BP",          ticker: "BP.L",   secteur: "Énergie",      capMds:  88, variation: -0.5, currency: "$", slug: "bp" },
      { rang: 8,  nom: "GSK",         ticker: "GSK.L",  secteur: "Santé",        capMds:  78, variation:  0.3, currency: "$", slug: "gsk" },
      { rang: 9,  nom: "Diageo",      ticker: "DGE.L",  secteur: "Boissons",     capMds:  58, variation: -0.2, currency: "$", slug: "diageo" },
      { rang: 10, nom: "Rolls-Royce", ticker: "RR.L",   secteur: "Aéronautique", capMds:  48, variation:  2.3, currency: "$", slug: "rolls-royce" },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarchesPage() {
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
            Tous les grands indices, classés par capitalisation.
          </p>
        </div>
      </section>

      {/* ── Bandeau indicatif ── */}
      <div className="px-4 sm:px-6 max-w-6xl mx-auto mb-2">
        <div className="flex items-center gap-2 bg-[#DDEAFF]/60 border border-[#BDD3F0] rounded-xl px-4 py-2.5 w-fit">
          <svg className="w-3.5 h-3.5 text-[#2E80CE] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#1E3A5F] text-xs font-medium">
            Données indicatives — actualisées manuellement (avril 2026)
          </p>
        </div>
      </div>

      <MarchesClient indices={INDICES} />

      <Footer />
    </main>
  );
}
