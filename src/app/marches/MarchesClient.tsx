"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StockRow {
  rang: number;
  nom: string;
  ticker: string;
  secteur: string;
  capMds: number;
  variation: number | null;
  currency: string;
  slug: string;
  prix?: number | null;
  prixDevise?: string;
}

export interface IndiceData {
  id: string;
  nom: string;
  pays: string;
  drapeau: string;
  region: "europe" | "ameriques" | "asie";
  description: string;
  stocks: StockRow[];
  indexVariation?: number | null;
}

// ─── Secteurs ─────────────────────────────────────────────────────────────────

const SECTEUR_COLORS: Record<string, string> = {
  "Technologie":        "bg-blue-50 text-blue-700",
  "Semi-conducteurs":   "bg-violet-50 text-violet-700",
  "Énergie":            "bg-orange-50 text-orange-700",
  "Santé":              "bg-green-50 text-green-700",
  "Luxe":               "bg-purple-50 text-purple-700",
  "Finance":            "bg-cyan-50 text-cyan-700",
  "Industrie":          "bg-gray-100 text-gray-600",
  "Automobile":         "bg-gray-50 text-gray-600",
  "Distribution":       "bg-amber-50 text-amber-700",
  "Aéronautique":       "bg-indigo-50 text-indigo-700",
  "Chimie":             "bg-teal-50 text-teal-700",
  "Consommation":       "bg-amber-50 text-amber-700",
  "Électronique":       "bg-blue-50 text-blue-700",
  "Streaming":          "bg-red-50 text-red-700",
  "Services":           "bg-slate-50 text-slate-600",
  "Mode":               "bg-pink-50 text-pink-700",
  "Robotique":          "bg-indigo-50 text-indigo-700",
  "Mines":              "bg-stone-50 text-stone-700",
  "Boissons":           "bg-lime-50 text-lime-700",
  "E-commerce":         "bg-orange-50 text-orange-700",
  "Réseaux sociaux":    "bg-sky-50 text-sky-700",
  "Assurance":          "bg-cyan-50 text-cyan-700",
  "Télécommunications": "bg-sky-50 text-sky-700",
  "Immobilier":         "bg-rose-50 text-rose-700",
  "Matériaux":          "bg-teal-50 text-teal-700",
};

function secteurClass(s: string) {
  return SECTEUR_COLORS[s] ?? "bg-gray-100 text-gray-600";
}

// ─── Filtres région ───────────────────────────────────────────────────────────

type Region = "tous" | "europe" | "ameriques" | "asie";

const FILTRES: { id: Region; label: string }[] = [
  { id: "tous",      label: "Tous" },
  { id: "europe",    label: "Europe" },
  { id: "ameriques", label: "Amériques" },
  { id: "asie",      label: "Asie" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

function sparklineColor(v: number | null): string {
  if (v === null) return "#D1D5DB";
  return v >= 0 ? "#22C55E" : "#EF4444";
}

// ─── VariationBadge ───────────────────────────────────────────────────────────

function VariationBadge({ v, size = "md" }: { v: number | null; size?: "sm" | "md" }) {
  if (v === null) return <span className="text-gray-300 text-sm">—</span>;
  const pos = v >= 0;
  const sz = size === "sm" ? "text-xs" : "text-sm";
  return (
    <span className={`inline-flex items-center gap-0.5 font-bold tabular-nums ${sz} ${pos ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
      {pos ? "▲" : "▼"} {Math.abs(v).toFixed(2)}%
    </span>
  );
}

// ─── IndiceCard ───────────────────────────────────────────────────────────────

function IndiceCard({
  indice,
  selected,
  loading,
  onClick,
}: {
  indice: IndiceData;
  selected: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  const validVar = indice.stocks.map((s) => s.variation).filter((v): v is number => v !== null);
  const avgPerf  = validVar.length > 0 ? validVar.reduce((a, b) => a + b, 0) / validVar.length : null;
  const displayPerf = indice.indexVariation ?? avgPerf;
  const pos = displayPerf !== null ? displayPerf >= 0 : true;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 px-4 py-4 transition-all duration-150 ${
        selected
          ? "border-[#185FA5] bg-[#EBF3FF]"
          : "border-[#E2EAF4] bg-white hover:border-[#BDD3F0]"
      }`}
      style={{
        boxShadow: selected
          ? "0 4px 20px rgba(24,95,165,0.15)"
          : "0 2px 8px rgba(14,52,120,0.05)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl select-none leading-none">{indice.drapeau}</span>
        <div className="flex items-center gap-1.5">
          {loading && (
            <span className="w-3 h-3 rounded-full border-2 border-[#185FA5] border-t-transparent animate-spin inline-block" />
          )}
          {displayPerf !== null && (
            <span className={`text-xs font-bold tabular-nums ${pos ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {pos ? "▲" : "▼"} {Math.abs(displayPerf).toFixed(2)}%
            </span>
          )}
        </div>
      </div>
      <p
        className={`font-black text-sm uppercase leading-tight tracking-tight ${
          selected ? "text-[#0C2248]" : "text-[#1E3A5F]"
        }`}
        style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
      >
        {indice.nom}
      </p>
      <p className="text-[#8A9BB0] text-xs mt-0.5">{indice.pays}</p>
    </button>
  );
}

// ─── SkeletonRow ──────────────────────────────────────────────────────────────

function SkeletonRow({ odd }: { odd: boolean }) {
  return (
    <div className="relative" style={{ background: odd ? "#FAFCFF" : "#fff" }}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200" />
      {/* Desktop */}
      <div
        className="hidden sm:grid gap-x-4 items-center pl-5 pr-7 py-3.5"
        style={{ gridTemplateColumns: "4px 2.5rem 1fr 5rem 6rem 9.5rem 7.5rem 6rem 3.5rem" }}
      >
        <span />
        <div className="h-3 w-6 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-36 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-14 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
        <div className="h-5 w-20 rounded-md bg-gray-200 animate-pulse" />
        <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-14 rounded bg-gray-200 animate-pulse" />
        <span />
      </div>
      {/* Mobile */}
      <div
        className="sm:hidden grid items-center pl-4 pr-5 py-3.5"
        style={{ gridTemplateColumns: "1fr 6rem 5.5rem 3rem" }}
      >
        <div className="h-3 w-28 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-14 rounded bg-gray-200 animate-pulse ml-auto mr-3" />
        <div className="h-3 w-12 rounded bg-gray-200 animate-pulse ml-auto mr-3" />
        <span />
      </div>
    </div>
  );
}

// ─── StockTableRow ────────────────────────────────────────────────────────────

function StockTableRow({ s, i }: { s: StockRow; i: number }) {
  return (
    <div
      className="relative group transition-colors duration-150 hover:bg-[#F0F7FF]"
      style={{ background: i % 2 === 0 ? "#fff" : "#FAFCFF" }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: sparklineColor(s.variation) }} />

      {/* Desktop */}
      <div
        className="hidden sm:grid gap-x-4 items-center pl-5 pr-7 py-3.5"
        style={{ gridTemplateColumns: "4px 2.5rem 1fr 5rem 6rem 9.5rem 7.5rem 6rem 3.5rem" }}
      >
        <span />
        <span className="text-[#C5D0DC] text-xs font-mono font-bold tabular-nums">#{s.rang}</span>
        <div className="min-w-0">
          <span className="text-[#0C2248] font-bold text-sm block truncate">{s.nom}</span>
        </div>
        <span className="text-[#8A9BB0] text-xs font-mono truncate">{s.ticker}</span>
        <span className="text-[#1E3A5F] text-sm font-bold tabular-nums">
          {s.prix != null
            ? `${s.prix % 1 === 0 ? s.prix.toFixed(0) : s.prix.toFixed(2)} ${s.prixDevise ?? s.currency}`
            : "—"}
        </span>
        <div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${secteurClass(s.secteur)}`}>
            {s.secteur}
          </span>
        </div>
        <span className="text-[#0C2248] text-sm font-bold tabular-nums">
          {s.capMds > 0 ? `${s.capMds.toLocaleString("fr-FR")} Mds${s.currency}` : "—"}
        </span>
        <VariationBadge v={s.variation} />
        <div className="flex justify-end">
          <Link
            href={`/marches/${encodeURIComponent(s.ticker)}`}
            className="inline-flex items-center gap-1 text-[#2E80CE] text-xs font-semibold transition-colors hover:text-[#0C2248] group/lnk"
          >
            <span>Voir</span>
            <svg className="w-3 h-3 transition-transform duration-150 group-hover/lnk:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div
        className="sm:hidden grid items-center pl-4 pr-5 py-3.5"
        style={{ gridTemplateColumns: "1fr 6rem 5.5rem 3rem" }}
      >
        <div className="min-w-0 pr-2">
          <span className="text-[#0C2248] font-bold text-sm block truncate">{s.nom}</span>
          <span className="text-[#8A9BB0] text-xs">
            {s.capMds > 0 ? `${s.capMds.toLocaleString("fr-FR")} Mds${s.currency}` : "—"}
          </span>
        </div>
        <span className="text-[#1E3A5F] text-sm font-bold tabular-nums text-right pr-3">
          {s.prix != null
            ? `${s.prix % 1 === 0 ? s.prix.toFixed(0) : s.prix.toFixed(2)} ${s.prixDevise ?? s.currency}`
            : "—"}
        </span>
        <div className="text-right pr-3">
          <VariationBadge v={s.variation} size="sm" />
        </div>
        <div className="flex justify-end">
          <Link href={`/marches/${encodeURIComponent(s.ticker)}`} className="text-[#2E80CE] group/lnk">
            <svg className="w-4 h-4 transition-transform duration-150 group-hover/lnk:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── StockTable ───────────────────────────────────────────────────────────────

function StockTable({ stocks, loading }: { stocks: StockRow[]; loading: boolean }) {
  const SKELETON_COUNT = 8;

  if (!loading && stocks.length === 0) {
    return (
      <div className="bg-white rounded-2xl px-7 py-10 text-center"
        style={{ boxShadow: "0 2px 16px rgba(14,52,120,0.08)" }}>
        <p className="text-[#8A9BB0] text-sm">Données non disponibles pour cet indice.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 16px rgba(14,52,120,0.08)" }}>

      {/* En-têtes desktop */}
      <div
        className="hidden sm:grid gap-x-4 px-7 py-2.5 bg-[#F8FAFD]"
        style={{ gridTemplateColumns: "4px 2.5rem 1fr 5rem 6rem 9.5rem 7.5rem 6rem 3.5rem" }}
      >
        {["", "#", "Entreprise", "Ticker", "Prix", "Secteur", "Cap. (Mds)", "Variation", ""].map((h, i) => (
          <span key={i} className="text-[#8A9BB0] text-xs uppercase tracking-widest font-semibold">{h}</span>
        ))}
      </div>

      {/* Lignes existantes */}
      {stocks.map((s, i) => <StockTableRow key={s.ticker} s={s} i={i} />)}

      {/* Skeleton pendant chargement */}
      {loading && Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <SkeletonRow key={`sk-${i}`} odd={(stocks.length + i) % 2 !== 0} />
      ))}

      {/* Compteur */}
      {!loading && stocks.length > 0 && (
        <div className="px-7 py-2.5 bg-[#F8FAFD] border-t border-[#F0F7FF]">
          <p className="text-[#8A9BB0] text-xs">
            {stocks.length} valeur{stocks.length > 1 ? "s" : ""} · triées par capitalisation · Yahoo Finance
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function MarchesClient({
  indices,
  updatedAt,
  fromCache,
}: {
  indices: IndiceData[];
  updatedAt: string | null;
  fromCache: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string>(indices[0]?.id ?? "");
  const [region,     setRegion]     = useState<Region>("tous");
  const [liveData,   setLiveData]   = useState<Record<string, StockRow[]>>({});
  const [loadingId,  setLoadingId]  = useState<string | null>(null);
  const fetchedRef = useRef(new Set<string>());

  // Charge les stocks live à chaque changement d'indice sélectionné
  useEffect(() => {
    if (!selectedId || fetchedRef.current.has(selectedId)) return;
    fetchedRef.current.add(selectedId);
    setLoadingId(selectedId);

    fetch(`/api/indice/${selectedId}`)
      .then((r) => r.json())
      .then((data: { stocks?: StockRow[] }) => {
        if (data.stocks?.length) {
          setLiveData((prev) => ({ ...prev, [selectedId]: data.stocks! }));
        }
      })
      .catch(() => {
        fetchedRef.current.delete(selectedId); // retry possible
      })
      .finally(() => {
        setLoadingId((prev) => (prev === selectedId ? null : prev));
      });
  }, [selectedId]);

  const visibleIndices = region === "tous"
    ? indices
    : indices.filter((idx) => idx.region === region);

  const selectedIndice =
    visibleIndices.find((idx) => idx.id === selectedId) ?? visibleIndices[0];

  const displayedStocks = selectedIndice
    ? (liveData[selectedIndice.id] ?? selectedIndice.stocks)
    : [];

  const isLoading = loadingId === selectedIndice?.id;

  return (
    <>
      {/* ── Header sombre ────────────────────────────────────────────────────── */}
      <section className="bg-[#0C2248] pt-24 pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#2E80CE] text-xs font-semibold uppercase tracking-widest mb-3">Marchés</p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black uppercase text-white leading-none mb-3"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Marchés
            <br />
            <span className="text-[#2E80CE]">mondiaux</span>
          </h1>
          <p className="text-white/50 text-lg mb-6">
            Tous les grands indices classés par capitalisation.
          </p>
          <p className="text-white/25 text-xs mb-8">
            {fromCache && updatedAt
              ? `Données actualisées le ${formatUpdatedAt(updatedAt)} · Yahoo Finance`
              : "Données indicatives · actualisées manuellement"}
          </p>

          {/* Filtres région */}
          <div className="flex flex-wrap gap-2">
            {FILTRES.map((f) => (
              <button
                key={f.id}
                onClick={() => setRegion(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  region === f.id
                    ? "bg-white text-[#0C2248] shadow-lg border border-transparent"
                    : "bg-transparent border border-white/50 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grille d'indices + tableau ────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pt-8 pb-6 max-w-6xl mx-auto">

        {/* Cards 3×3 */}
        {visibleIndices.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {visibleIndices.map((indice) => (
              <IndiceCard
                key={indice.id}
                indice={indice}
                selected={selectedIndice?.id === indice.id}
                loading={loadingId === indice.id}
                onClick={() => setSelectedId(indice.id)}
              />
            ))}
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl px-8 py-12 text-center mb-8"
            style={{ boxShadow: "0 2px 16px rgba(14,52,120,0.08)" }}
          >
            <p className="text-[#8A9BB0] text-lg mb-3">Aucun indice pour cette région.</p>
            <button
              onClick={() => setRegion("tous")}
              className="text-[#2E80CE] text-sm font-semibold hover:underline"
            >
              Voir tous les indices →
            </button>
          </div>
        )}

        {/* En-tête tableau */}
        {selectedIndice && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl select-none leading-none">{selectedIndice.drapeau}</span>
            <div>
              <h2
                className="text-xl font-black text-[#0C2248] uppercase leading-tight"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                {selectedIndice.nom}
              </h2>
              <p className="text-[#8A9BB0] text-xs mt-0.5">{selectedIndice.description}</p>
            </div>
          </div>
        )}

        {/* Tableau plat */}
        <StockTable stocks={displayedStocks} loading={isLoading} />
      </section>

      {/* ── Disclaimer ───────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-16 max-w-6xl mx-auto">
        <div
          className="flex gap-3 bg-white rounded-xl px-5 py-4"
          style={{ boxShadow: "0 2px 8px rgba(14,52,120,0.04)" }}
        >
          <svg className="w-4 h-4 text-[#2E80CE] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#8A9BB0] text-sm leading-relaxed">
            Données fournies par Yahoo Finance. Le top 10 est actualisé quotidiennement via Supabase ; le reste des valeurs est chargé en live au clic. À titre éducatif uniquement, ne constitue pas un conseil en investissement.
          </p>
        </div>
      </section>
    </>
  );
}
