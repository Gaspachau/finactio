"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types (partagés avec page.tsx) ──────────────────────────────────────────

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
  region: "europe" | "usa" | "asie";
  description: string;
  stocks: StockRow[];
}

// ─── Couleurs secteurs ────────────────────────────────────────────────────────

const SECTEUR_COLORS: Record<string, string> = {
  "Technologie":          "bg-blue-50 text-blue-700 border-blue-200",
  "Semi-conducteurs":     "bg-violet-50 text-violet-700 border-violet-200",
  "Énergie":              "bg-amber-50 text-amber-700 border-amber-200",
  "Santé":                "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Luxe":                 "bg-purple-50 text-purple-700 border-purple-200",
  "Finance":              "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Industrie":            "bg-slate-100 text-slate-700 border-slate-200",
  "Auto":                 "bg-gray-50 text-gray-700 border-gray-200",
  "Distribution":         "bg-orange-50 text-orange-700 border-orange-200",
  "Aéronautique":         "bg-sky-50 text-sky-700 border-sky-200",
  "Chimie":               "bg-teal-50 text-teal-700 border-teal-200",
  "Télécom & Médias":     "bg-pink-50 text-pink-700 border-pink-200",
  "Matières premières":   "bg-stone-50 text-stone-700 border-stone-200",
  "Immobilier":           "bg-lime-50 text-lime-700 border-lime-200",
  "Services publics":     "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Consommation":         "bg-orange-50 text-orange-700 border-orange-200",
  "Investissement":       "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Divers":               "bg-gray-50 text-gray-600 border-gray-200",
};

function secteurClass(s: string) {
  return SECTEUR_COLORS[s] ?? "bg-gray-50 text-gray-600 border-gray-200";
}

// ─── Filtres ──────────────────────────────────────────────────────────────────

type Region = "tous" | "europe" | "usa" | "asie";

const FILTRES: { id: Region; label: string }[] = [
  { id: "tous",   label: "Tous" },
  { id: "europe", label: "Europe" },
  { id: "usa",    label: "États-Unis" },
  { id: "asie",   label: "Asie" },
];

// ─── Sous-composants ──────────────────────────────────────────────────────────

function VariationBadge({ v }: { v: number | null }) {
  if (v === null) return <span className="text-[#1E3A5F]/30 text-sm">—</span>;
  const pos = v >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums ${pos ? "text-[#16a34a]" : "text-[#EF4444]"}`}>
      {pos ? "▲" : "▼"} {Math.abs(v).toFixed(2)}%
    </span>
  );
}

function IndiceSection({ indice, defaultOpen }: { indice: IndiceData; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  const avgPerf = indice.stocks.length > 0
    ? indice.stocks.reduce((s, x) => s + (x.variation ?? 0), 0) / indice.stocks.length
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[#DDEAFF] overflow-hidden"
      style={{ boxShadow: "0 4px 20px rgba(14,52,120,0.06)" }}>

      {/* Header collapsible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 sm:px-7 py-5 flex items-center gap-4 hover:bg-[#F8FBFF] transition-colors"
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
          <p className="text-[#1E3A5F]/50 text-xs mt-0.5 hidden sm:block">{indice.description}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {avgPerf !== null && <VariationBadge v={avgPerf} />}
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
          {indice.stocks.length === 0 ? (
            <div className="px-7 py-10 text-center">
              <p className="text-[#1E3A5F]/40 text-sm">Données non disponibles pour cet indice.</p>
            </div>
          ) : (
            <>
              {/* En-têtes — desktop uniquement */}
              <div className="hidden sm:grid grid-cols-[2.5rem_1fr_5.5rem_6.5rem_10rem_8rem_6rem_6rem] gap-x-3 px-7 py-2.5 bg-[#F0F7FF] border-b border-[#DDEAFF]">
                {["#", "Entreprise", "Ticker", "Prix", "Secteur", "Cap. (Mds)", "Variation", ""].map((h) => (
                  <span key={h} className="text-[#1E3A5F]/40 text-xs uppercase tracking-widest font-semibold">{h}</span>
                ))}
              </div>

              {indice.stocks.map((s, i) => (
                <div
                  key={s.ticker}
                  className={`grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[2.5rem_1fr_5.5rem_6.5rem_10rem_8rem_6rem_6rem] gap-x-3 items-center px-5 sm:px-7 py-3.5 border-b border-[#DDEAFF] last:border-0 transition-colors hover:bg-[#EBF3FF]/60 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F0F7FF]/50"
                  }`}
                >
                  {/* Rang */}
                  <span className="text-[#1E3A5F]/30 text-xs font-bold tabular-nums">#{s.rang}</span>

                  {/* Nom */}
                  <div className="min-w-0">
                    <span className="text-[#0C2248] font-semibold text-sm block truncate">{s.nom}</span>
                    <span className="text-[#1E3A5F]/50 text-xs sm:hidden">
                      {s.ticker}
                      {s.prix != null ? ` · ${s.prix.toFixed(2)} ${s.prixDevise ?? s.currency}` : ""}
                      {" · "}{s.capMds > 0 ? `${s.capMds.toLocaleString("fr-FR")} Mds${s.currency}` : "—"}
                    </span>
                  </div>

                  {/* Ticker — desktop */}
                  <span className="hidden sm:block text-[#1E3A5F]/50 text-xs font-mono truncate">{s.ticker}</span>

                  {/* Prix — desktop */}
                  <span className="hidden sm:block text-[#0C2248] text-sm tabular-nums">
                    {s.prix != null ? `${s.prix.toFixed(2)} ${s.prixDevise ?? s.currency}` : "—"}
                  </span>

                  {/* Secteur — desktop */}
                  <div className="hidden sm:flex">
                    <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border truncate max-w-full ${secteurClass(s.secteur)}`}>
                      {s.secteur}
                    </span>
                  </div>

                  {/* Cap — desktop */}
                  <span className="hidden sm:block text-[#0C2248] text-sm font-semibold tabular-nums">
                    {s.capMds > 0 ? `${s.capMds.toLocaleString("fr-FR")} Mds${s.currency}` : "—"}
                  </span>

                  {/* Variation — desktop */}
                  <div className="hidden sm:flex">
                    <VariationBadge v={s.variation} />
                  </div>

                  {/* Lien */}
                  <div className="flex justify-end">
                    <Link
                      href={`/actifs/${s.slug}`}
                      className="inline-flex items-center gap-1 text-[#2E80CE] text-xs font-semibold hover:text-[#1E3A5F] transition-colors whitespace-nowrap group/link"
                    >
                      <span className="hidden sm:inline">Voir</span>
                      <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function MarchesClient({ indices }: { indices: IndiceData[] }) {
  const [region, setRegion] = useState<Region>("tous");

  const filtres = indices.filter((idx) => region === "tous" || idx.region === region);

  return (
    <>
      {/* Filtres */}
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

      {/* Indices */}
      <section className="px-4 sm:px-6 pb-16 max-w-6xl mx-auto space-y-5">
        {filtres.length > 0 ? (
          filtres.map((indice, i) => (
            <IndiceSection key={indice.id} indice={indice} defaultOpen={i === 0} />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-[#DDEAFF] px-8 py-16 text-center"
            style={{ boxShadow: "0 4px 20px rgba(14,52,120,0.06)" }}>
            <p className="text-[#1E3A5F]/40 text-lg">Aucun indice pour cette région.</p>
            <button onClick={() => setRegion("tous")}
              className="mt-4 text-[#2E80CE] text-sm font-semibold hover:underline">
              Voir tous les indices →
            </button>
          </div>
        )}
      </section>

      {/* Disclaimer */}
      <section className="px-4 sm:px-6 pb-16 max-w-6xl mx-auto">
        <div className="flex gap-3 bg-white border border-[#DDEAFF] rounded-xl px-5 py-4"
          style={{ boxShadow: "0 2px 8px rgba(14,52,120,0.04)" }}>
          <svg className="w-4 h-4 text-[#2E80CE] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#1E3A5F] text-sm leading-relaxed">
            Données fournies par Financial Modeling Prep, actualisées toutes les heures. Les informations affichées sont à titre éducatif uniquement et ne constituent pas un conseil en investissement.
          </p>
        </div>
      </section>
    </>
  );
}
