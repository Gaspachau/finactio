"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Entreprise {
  rang: number;
  nom: string;
  ticker: string;
  secteur: string;
  capMds: number;
  capDevise: string;
  variation: number;
  slug: string;
}

interface Indice {
  id: string;
  nom: string;
  pays: string;
  drapeau: string;
  region: "europe" | "usa" | "asie" | "monde";
  description: string;
  perf: number;
  entreprises: Entreprise[];
}

// ─── Couleurs secteurs ────────────────────────────────────────────────────────

const SECTEUR_COLORS: Record<string, string> = {
  "Technologie":      "bg-blue-50 text-blue-700 border-blue-200",
  "Semi-conducteurs": "bg-violet-50 text-violet-700 border-violet-200",
  "Énergie":          "bg-amber-50 text-amber-700 border-amber-200",
  "Santé":            "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Luxe":             "bg-purple-50 text-purple-700 border-purple-200",
  "Finance":          "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Industrie":        "bg-slate-100 text-slate-700 border-slate-200",
  "Auto":             "bg-gray-50 text-gray-700 border-gray-200",
  "Distribution":     "bg-orange-50 text-orange-700 border-orange-200",
  "Aéronautique":     "bg-sky-50 text-sky-700 border-sky-200",
  "Chimie":           "bg-teal-50 text-teal-700 border-teal-200",
  "Médias/Tech":      "bg-pink-50 text-pink-700 border-pink-200",
  "E-commerce":       "bg-blue-50 text-blue-700 border-blue-200",
  "Streaming":        "bg-red-50 text-red-700 border-red-200",
  "Conglomérat":      "bg-slate-100 text-slate-700 border-slate-200",
  "Électronique":     "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Cosmétiques":      "bg-rose-50 text-rose-700 border-rose-200",
  "Robotique":        "bg-slate-100 text-slate-700 border-slate-200",
  "Mode":             "bg-purple-50 text-purple-700 border-purple-200",
  "Services":         "bg-blue-50 text-blue-700 border-blue-200",
  "Mines":            "bg-stone-50 text-stone-700 border-stone-200",
  "Boissons":         "bg-amber-50 text-amber-700 border-amber-200",
  "Consommation":     "bg-orange-50 text-orange-700 border-orange-200",
  "Investissement":   "bg-indigo-50 text-indigo-700 border-indigo-200",
};

function secteurClass(s: string) {
  return SECTEUR_COLORS[s] ?? "bg-gray-50 text-gray-700 border-gray-200";
}

// ─── Données ──────────────────────────────────────────────────────────────────

const INDICES: Indice[] = [
  {
    id: "cac40",
    nom: "CAC 40",
    pays: "France",
    drapeau: "🇫🇷",
    region: "europe",
    description: "Les 40 plus grandes capitalisations cotées à la Bourse de Paris.",
    perf: 0.62,
    entreprises: [
      { rang: 1,  nom: "LVMH",               ticker: "MC",   secteur: "Luxe",          capMds: 392, capDevise: "€", variation:  0.8,  slug: "lvmh" },
      { rang: 2,  nom: "Hermès",              ticker: "RMS",  secteur: "Luxe",          capMds: 218, capDevise: "€", variation:  1.2,  slug: "hermes" },
      { rang: 3,  nom: "L'Oréal",             ticker: "OR",   secteur: "Cosmétiques",   capMds: 197, capDevise: "€", variation:  0.4,  slug: "loreal" },
      { rang: 4,  nom: "Airbus",              ticker: "AIR",  secteur: "Aéronautique",  capMds: 124, capDevise: "€", variation:  1.8,  slug: "airbus" },
      { rang: 5,  nom: "Sanofi",              ticker: "SAN",  secteur: "Santé",         capMds: 117, capDevise: "€", variation: -0.7,  slug: "sanofi" },
      { rang: 6,  nom: "TotalEnergies",       ticker: "TTE",  secteur: "Énergie",       capMds: 147, capDevise: "€", variation: -0.3,  slug: "totalenergies" },
      { rang: 7,  nom: "Schneider Electric",  ticker: "SU",   secteur: "Industrie",     capMds: 112, capDevise: "€", variation:  0.5,  slug: "schneider-electric" },
      { rang: 8,  nom: "Safran",              ticker: "SAF",  secteur: "Aéronautique",  capMds:  84, capDevise: "€", variation:  0.6,  slug: "safran" },
      { rang: 9,  nom: "BNP Paribas",         ticker: "BNP",  secteur: "Finance",       capMds:  76, capDevise: "€", variation: -1.1,  slug: "bnp-paribas" },
      { rang: 10, nom: "Air Liquide",         ticker: "AI",   secteur: "Chimie",        capMds:  73, capDevise: "€", variation:  0.2,  slug: "air-liquide" },
    ],
  },
  {
    id: "sp500",
    nom: "S&P 500",
    pays: "États-Unis",
    drapeau: "🇺🇸",
    region: "usa",
    description: "Les 500 plus grandes entreprises américaines cotées en Bourse.",
    perf: 1.14,
    entreprises: [
      { rang: 1,  nom: "Microsoft",          ticker: "MSFT", secteur: "Technologie",      capMds: 3120, capDevise: "$", variation:  0.8,  slug: "microsoft" },
      { rang: 2,  nom: "Apple",              ticker: "AAPL", secteur: "Technologie",      capMds: 2950, capDevise: "$", variation:  0.5,  slug: "apple" },
      { rang: 3,  nom: "Nvidia",             ticker: "NVDA", secteur: "Semi-conducteurs", capMds: 2820, capDevise: "$", variation:  2.1,  slug: "nvidia" },
      { rang: 4,  nom: "Alphabet",           ticker: "GOOG", secteur: "Technologie",      capMds: 2110, capDevise: "$", variation:  0.4,  slug: "alphabet" },
      { rang: 5,  nom: "Amazon",             ticker: "AMZN", secteur: "E-commerce",       capMds: 1960, capDevise: "$", variation:  1.3,  slug: "amazon" },
      { rang: 6,  nom: "Meta",               ticker: "META", secteur: "Médias/Tech",      capMds: 1430, capDevise: "$", variation:  1.7,  slug: "meta" },
      { rang: 7,  nom: "Berkshire Hathaway", ticker: "BRK",  secteur: "Investissement",   capMds:  935, capDevise: "$", variation: -0.2,  slug: "berkshire-hathaway" },
      { rang: 8,  nom: "Eli Lilly",          ticker: "LLY",  secteur: "Santé",            capMds:  755, capDevise: "$", variation: -0.8,  slug: "eli-lilly" },
      { rang: 9,  nom: "Tesla",              ticker: "TSLA", secteur: "Auto",             capMds:  685, capDevise: "$", variation:  3.2,  slug: "tesla" },
      { rang: 10, nom: "Broadcom",           ticker: "AVGO", secteur: "Semi-conducteurs", capMds:  625, capDevise: "$", variation:  1.1,  slug: "broadcom" },
    ],
  },
  {
    id: "nasdaq100",
    nom: "NASDAQ 100",
    pays: "Tech US",
    drapeau: "🇺🇸",
    region: "usa",
    description: "Les 100 plus grandes valeurs technologiques et de croissance cotées au NASDAQ.",
    perf: 1.48,
    entreprises: [
      { rang: 1,  nom: "Microsoft",  ticker: "MSFT", secteur: "Technologie",      capMds: 3120, capDevise: "$", variation:  0.8,  slug: "microsoft" },
      { rang: 2,  nom: "Apple",      ticker: "AAPL", secteur: "Technologie",      capMds: 2950, capDevise: "$", variation:  0.5,  slug: "apple" },
      { rang: 3,  nom: "Nvidia",     ticker: "NVDA", secteur: "Semi-conducteurs", capMds: 2820, capDevise: "$", variation:  2.1,  slug: "nvidia" },
      { rang: 4,  nom: "Amazon",     ticker: "AMZN", secteur: "E-commerce",       capMds: 1960, capDevise: "$", variation:  1.3,  slug: "amazon" },
      { rang: 5,  nom: "Meta",       ticker: "META", secteur: "Médias/Tech",      capMds: 1430, capDevise: "$", variation:  1.7,  slug: "meta" },
      { rang: 6,  nom: "Alphabet",   ticker: "GOOG", secteur: "Technologie",      capMds: 2110, capDevise: "$", variation:  0.4,  slug: "alphabet" },
      { rang: 7,  nom: "Tesla",      ticker: "TSLA", secteur: "Auto",             capMds:  685, capDevise: "$", variation:  3.2,  slug: "tesla" },
      { rang: 8,  nom: "Broadcom",   ticker: "AVGO", secteur: "Semi-conducteurs", capMds:  625, capDevise: "$", variation:  1.1,  slug: "broadcom" },
      { rang: 9,  nom: "Costco",     ticker: "COST", secteur: "Distribution",     capMds:  398, capDevise: "$", variation: -0.3,  slug: "costco" },
      { rang: 10, nom: "Netflix",    ticker: "NFLX", secteur: "Streaming",        capMds:  314, capDevise: "$", variation:  0.9,  slug: "netflix" },
    ],
  },
  {
    id: "nikkei225",
    nom: "Nikkei 225",
    pays: "Japon",
    drapeau: "🇯🇵",
    region: "asie",
    description: "Les 225 principales valeurs de la Bourse de Tokyo (TSE).",
    perf: -0.38,
    entreprises: [
      { rang: 1,  nom: "Toyota",       ticker: "7203", secteur: "Auto",          capMds: 285, capDevise: "$", variation:  0.4,  slug: "toyota" },
      { rang: 2,  nom: "Keyence",      ticker: "6861", secteur: "Industrie",     capMds: 135, capDevise: "$", variation:  0.7,  slug: "keyence" },
      { rang: 3,  nom: "Sony",         ticker: "6758", secteur: "Électronique",  capMds: 122, capDevise: "$", variation:  1.1,  slug: "sony" },
      { rang: 4,  nom: "SoftBank",     ticker: "9984", secteur: "Investissement",capMds: 112, capDevise: "$", variation:  2.3,  slug: "softbank" },
      { rang: 5,  nom: "Mitsubishi",   ticker: "8058", secteur: "Conglomérat",   capMds:  97, capDevise: "$", variation: -0.5,  slug: "mitsubishi" },
      { rang: 6,  nom: "Shin-Etsu",    ticker: "4063", secteur: "Chimie",        capMds:  87, capDevise: "$", variation:  0.2,  slug: "shin-etsu" },
      { rang: 7,  nom: "Recruit",      ticker: "6098", secteur: "Services",      capMds:  74, capDevise: "$", variation:  1.4,  slug: "recruit" },
      { rang: 8,  nom: "Fast Retailing",ticker:"9983", secteur: "Mode",          capMds:  60, capDevise: "$", variation:  0.6,  slug: "fast-retailing" },
      { rang: 9,  nom: "Honda",        ticker: "7267", secteur: "Auto",          capMds:  57, capDevise: "$", variation: -0.8,  slug: "honda" },
      { rang: 10, nom: "Fanuc",        ticker: "6954", secteur: "Robotique",     capMds:  49, capDevise: "$", variation: -1.2,  slug: "fanuc" },
    ],
  },
  {
    id: "ftse100",
    nom: "FTSE 100",
    pays: "Royaume-Uni",
    drapeau: "🇬🇧",
    region: "europe",
    description: "Les 100 premières capitalisations du London Stock Exchange.",
    perf: 0.21,
    entreprises: [
      { rang: 1,  nom: "AstraZeneca",  ticker: "AZN",  secteur: "Santé",    capMds: 248, capDevise: "$", variation:  0.9,  slug: "astrazeneca" },
      { rang: 2,  nom: "Shell",        ticker: "SHEL", secteur: "Énergie",  capMds: 214, capDevise: "$", variation: -0.4,  slug: "shell" },
      { rang: 3,  nom: "BHP",          ticker: "BHP",  secteur: "Mines",    capMds: 144, capDevise: "$", variation:  0.8,  slug: "bhp" },
      { rang: 4,  nom: "HSBC",         ticker: "HSBA", secteur: "Finance",  capMds: 168, capDevise: "$", variation: -0.7,  slug: "hsbc" },
      { rang: 5,  nom: "Unilever",     ticker: "ULVR", secteur: "Consommation", capMds: 118, capDevise: "$", variation: 0.3, slug: "unilever" },
      { rang: 6,  nom: "Rio Tinto",    ticker: "RIO",  secteur: "Mines",    capMds: 110, capDevise: "$", variation:  0.5,  slug: "rio-tinto" },
      { rang: 7,  nom: "BP",           ticker: "BP",   secteur: "Énergie",  capMds:  97, capDevise: "$", variation: -1.1,  slug: "bp" },
      { rang: 8,  nom: "GSK",          ticker: "GSK",  secteur: "Santé",    capMds:  80, capDevise: "$", variation: -0.2,  slug: "gsk" },
      { rang: 9,  nom: "Diageo",       ticker: "DGE",  secteur: "Boissons", capMds:  57, capDevise: "$", variation: -0.6,  slug: "diageo" },
      { rang: 10, nom: "Rolls-Royce",  ticker: "RR",   secteur: "Aéronautique", capMds: 54, capDevise: "$", variation: 4.2, slug: "rolls-royce" },
    ],
  },
];

type Region = "tous" | "europe" | "usa" | "asie" | "monde";

const FILTRES: { id: Region; label: string }[] = [
  { id: "tous",   label: "Tous" },
  { id: "europe", label: "Europe" },
  { id: "usa",    label: "États-Unis" },
  { id: "asie",   label: "Asie" },
  { id: "monde",  label: "Monde" },
];

// ─── Sous-composants ──────────────────────────────────────────────────────────

function VariationBadge({ v }: { v: number }) {
  const pos = v >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums ${pos ? "text-[#16a34a]" : "text-[#EF4444]"}`}>
      {pos ? "▲" : "▼"} {Math.abs(v).toFixed(2)}%
    </span>
  );
}

function IndiceSection({ indice, defaultOpen }: { indice: Indice; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-[#DDEAFF] overflow-hidden"
      style={{ boxShadow: "0 4px 20px rgba(14,52,120,0.06)" }}>
      {/* Header collapsible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 sm:px-7 py-5 flex items-center gap-4 hover:bg-[#F8FBFF] transition-colors group"
      >
        <span className="text-3xl select-none">{indice.drapeau}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="text-xl font-black text-[#0C2248] uppercase"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              {indice.nom}
            </span>
            <span className="text-[#1E3A5F]/50 text-sm font-medium">{indice.pays}</span>
          </div>
          <p className="text-[#1E3A5F]/60 text-xs mt-0.5 hidden sm:block">{indice.description}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <VariationBadge v={indice.perf} />
          <svg
            className={`w-5 h-5 text-[#1E3A5F]/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Table */}
      {open && (
        <div className="border-t border-[#DDEAFF]">
          {/* Header colonnes — masqué sur mobile */}
          <div className="hidden sm:grid grid-cols-[2rem_1fr_6rem_9rem_7rem_5.5rem_7rem] gap-x-3 px-5 sm:px-7 py-2.5 bg-[#F0F7FF] border-b border-[#DDEAFF]">
            <span className="text-[#1E3A5F]/40 text-xs uppercase tracking-widest font-semibold">#</span>
            <span className="text-[#1E3A5F]/40 text-xs uppercase tracking-widest font-semibold">Entreprise</span>
            <span className="text-[#1E3A5F]/40 text-xs uppercase tracking-widest font-semibold">Ticker</span>
            <span className="text-[#1E3A5F]/40 text-xs uppercase tracking-widest font-semibold">Secteur</span>
            <span className="text-[#1E3A5F]/40 text-xs uppercase tracking-widest font-semibold text-right">Cap. (Mds)</span>
            <span className="text-[#1E3A5F]/40 text-xs uppercase tracking-widest font-semibold text-right">Variation</span>
            <span></span>
          </div>

          {indice.entreprises.map((e, i) => (
            <div
              key={e.slug + e.rang}
              className={`grid grid-cols-[2rem_1fr_auto] sm:grid-cols-[2rem_1fr_6rem_9rem_7rem_5.5rem_7rem] gap-x-3 items-center px-5 sm:px-7 py-3.5 border-b border-[#DDEAFF] last:border-0 transition-colors hover:bg-[#EBF3FF]/60 ${
                i % 2 === 0 ? "bg-white" : "bg-[#F0F7FF]/60"
              }`}
            >
              {/* Rang */}
              <span className="text-[#1E3A5F]/30 text-xs font-bold tabular-nums">#{e.rang}</span>

              {/* Nom */}
              <div className="min-w-0">
                <span className="text-[#0C2248] font-semibold text-sm truncate block">{e.nom}</span>
                <span className="text-[#1E3A5F]/50 text-xs sm:hidden">{e.ticker} · {e.capMds} Mds{e.capDevise}</span>
              </div>

              {/* Ticker — desktop */}
              <span className="hidden sm:block text-[#1E3A5F]/50 text-xs font-mono">{e.ticker}</span>

              {/* Secteur — desktop */}
              <span className={`hidden sm:inline-block text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border w-fit ${secteurClass(e.secteur)}`}>
                {e.secteur}
              </span>

              {/* Cap — desktop */}
              <span className="hidden sm:block text-[#0C2248] text-sm font-semibold tabular-nums text-right">
                {e.capMds.toLocaleString("fr-FR")} Mds{e.capDevise}
              </span>

              {/* Variation — desktop */}
              <div className="hidden sm:flex justify-end">
                <VariationBadge v={e.variation} />
              </div>

              {/* Action */}
              <div className="flex justify-end sm:justify-end">
                <Link
                  href={`/actifs/${e.slug}`}
                  className="text-[#2E80CE] text-xs font-semibold hover:text-[#1E3A5F] transition-colors whitespace-nowrap inline-flex items-center gap-1 group/link"
                >
                  <span className="hidden sm:inline">Voir la fiche</span>
                  <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarchesPage() {
  const [region, setRegion] = useState<Region>("tous");

  const indicesFiltres = INDICES.filter(
    (idx) => region === "tous" || idx.region === region
  );

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #F0F7FF 0%, #EBF3FF 50%, #F0F7FF 100%)" }}
    >
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-14 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(46,128,206,0.12) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: "radial-gradient(circle, rgba(46,128,206,0.1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative max-w-6xl mx-auto">
          <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-4">Marchés</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase text-[#0C2248] leading-none mb-4"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Les marchés
            <br />
            <span className="text-[#2E80CE]">mondiaux</span>
          </h1>
          <p className="text-[#1E3A5F] text-lg max-w-xl">
            Tous les grands indices, classés par capitalisation.
          </p>
        </div>
      </section>

      {/* ── Filtres ── */}
      <section className="px-4 sm:px-6 pb-8 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {FILTRES.map((f) => (
            <button
              key={f.id}
              onClick={() => setRegion(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                region === f.id
                  ? "bg-[#1E3A5F] border-[#1E3A5F] text-white shadow-[0_2px_8px_rgba(30,58,95,0.2)]"
                  : "bg-white border-[#DDEAFF] text-[#1E3A5F] hover:border-[#2E80CE]/50 hover:text-[#0C2248]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Liste des indices ── */}
      <section className="px-4 sm:px-6 pb-24 max-w-6xl mx-auto space-y-5">
        {indicesFiltres.length > 0 ? (
          indicesFiltres.map((indice, i) => (
            <IndiceSection key={indice.id} indice={indice} defaultOpen={i === 0} />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-[#DDEAFF] px-8 py-16 text-center"
            style={{ boxShadow: "0 4px 20px rgba(14,52,120,0.06)" }}>
            <p className="text-[#1E3A5F]/40 text-lg">Aucun indice pour cette région pour l&apos;instant.</p>
            <button onClick={() => setRegion("tous")}
              className="mt-4 text-[#2E80CE] text-sm font-semibold hover:underline">
              Voir tous les indices →
            </button>
          </div>
        )}
      </section>

      {/* ── Disclaimer ── */}
      <section className="px-4 sm:px-6 pb-16 max-w-6xl mx-auto">
        <div className="flex gap-3 bg-white border border-[#DDEAFF] rounded-xl px-5 py-4"
          style={{ boxShadow: "0 2px 8px rgba(14,52,120,0.04)" }}>
          <svg className="w-4 h-4 text-[#2E80CE] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#1E3A5F] text-sm leading-relaxed">
            Les capitalisations et variations affichées sont indicatives et à titre éducatif uniquement. Elles ne constituent pas des données de marché en temps réel. Consulte un conseiller financier avant tout investissement.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
