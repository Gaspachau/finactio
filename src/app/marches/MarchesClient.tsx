"use client";

import { useState } from "react";
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
  region: "europe" | "usa" | "asie";
  description: string;
  stocks: StockRow[];
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
};

function secteurClass(s: string) {
  return SECTEUR_COLORS[s] ?? "bg-gray-100 text-gray-600";
}

// ─── Filtres ──────────────────────────────────────────────────────────────────

type Region = "tous" | "europe" | "usa" | "asie";

const FILTRES: { id: Region; label: string }[] = [
  { id: "tous",   label: "Tous" },
  { id: "europe", label: "Europe" },
  { id: "usa",    label: "États-Unis" },
  { id: "asie",   label: "Asie" },
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

// ─── IndiceSection ────────────────────────────────────────────────────────────

function IndiceSection({ indice, defaultOpen }: { indice: IndiceData; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  const avgPerf = indice.stocks.length > 0
    ? indice.stocks.reduce((s, x) => s + (x.variation ?? 0), 0) / indice.stocks.length
    : null;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 16px rgba(14,52,120,0.08)" }}
    >
      {/* ── Card header ─────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 sm:px-7 py-5 flex items-center gap-4 hover:bg-[#F8FBFF] transition-colors duration-150"
      >
        <span className="text-3xl select-none leading-none">{indice.drapeau}</span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span
              className="text-xl font-black text-[#0C2248] uppercase tracking-tight"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              {indice.nom}
            </span>
            <span className="text-[#8A9BB0] text-sm font-medium">{indice.pays}</span>
          </div>
          <p className="text-[#8A9BB0] text-xs mt-0.5 hidden sm:block">{indice.description}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {avgPerf !== null && (
            <span className={`text-sm font-bold tabular-nums ${avgPerf >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {avgPerf >= 0 ? "▲" : "▼"} {Math.abs(avgPerf).toFixed(2)}%
            </span>
          )}
          <svg
            className={`w-4 h-4 text-[#8A9BB0] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* ── Tableau ──────────────────────────────────────────────────────────── */}
      {open && (
        <div style={{ borderTop: "2px solid #F0F7FF" }}>
          {indice.stocks.length === 0 ? (
            <div className="px-7 py-10 text-center">
              <p className="text-[#8A9BB0] text-sm">Données non disponibles pour cet indice.</p>
            </div>
          ) : (
            <>
              {/* En-têtes desktop */}
              <div className="hidden sm:grid gap-x-4 px-7 py-2.5 bg-[#F8FAFD]"
                style={{ gridTemplateColumns: "4px 2.5rem 1fr 5rem 6rem 9.5rem 7.5rem 6rem 3.5rem" }}>
                {["", "#", "Entreprise", "Ticker", "Prix", "Secteur", "Cap. (Mds)", "Variation", ""].map((h, i) => (
                  <span key={i} className="text-[#8A9BB0] text-xs uppercase tracking-widest font-semibold">{h}</span>
                ))}
              </div>

              {/* Lignes */}
              {indice.stocks.map((s, i) => (
                <div
                  key={s.ticker}
                  className="relative group transition-colors duration-150 hover:bg-[#F0F7FF]"
                  style={{ background: i % 2 === 0 ? "#fff" : "#FAFCFF" }}
                >
                  {/* Sparkline bar — barre colorée gauche */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ background: sparklineColor(s.variation) }}
                  />

                  {/* Desktop grid */}
                  <div
                    className="hidden sm:grid gap-x-4 items-center pl-5 pr-7 py-3.5"
                    style={{ gridTemplateColumns: "4px 2.5rem 1fr 5rem 6rem 9.5rem 7.5rem 6rem 3.5rem" }}
                  >
                    {/* Spacer sparkline */}
                    <span />

                    {/* Rang */}
                    <span className="text-[#C5D0DC] text-xs font-mono font-bold tabular-nums">#{s.rang}</span>

                    {/* Entreprise */}
                    <div className="min-w-0">
                      <span className="text-[#0C2248] font-bold text-sm block truncate">{s.nom}</span>
                    </div>

                    {/* Ticker */}
                    <span className="text-[#8A9BB0] text-xs font-mono truncate">{s.ticker}</span>

                    {/* Prix */}
                    <span className="text-[#1E3A5F] text-sm font-bold tabular-nums">
                      {s.prix != null
                        ? `${s.prix % 1 === 0 ? s.prix.toFixed(0) : s.prix.toFixed(2)} ${s.prixDevise ?? s.currency}`
                        : "—"}
                    </span>

                    {/* Secteur */}
                    <div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${secteurClass(s.secteur)}`}>
                        {s.secteur}
                      </span>
                    </div>

                    {/* Cap */}
                    <span className="text-[#0C2248] text-sm font-bold tabular-nums">
                      {s.capMds > 0 ? `${s.capMds.toLocaleString("fr-FR")} Mds${s.currency}` : "—"}
                    </span>

                    {/* Variation */}
                    <VariationBadge v={s.variation} />

                    {/* Voir */}
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

                  {/* Mobile grid */}
                  <div className="sm:hidden grid items-center pl-4 pr-5 py-3.5"
                    style={{ gridTemplateColumns: "1fr 6rem 5.5rem 3rem" }}>

                    {/* Entreprise + cap en dessous */}
                    <div className="min-w-0 pr-2">
                      <span className="text-[#0C2248] font-bold text-sm block truncate">{s.nom}</span>
                      <span className="text-[#8A9BB0] text-xs">
                        {s.capMds > 0 ? `${s.capMds.toLocaleString("fr-FR")} Mds${s.currency}` : "—"}
                      </span>
                    </div>

                    {/* Prix */}
                    <span className="text-[#1E3A5F] text-sm font-bold tabular-nums text-right pr-3">
                      {s.prix != null
                        ? `${s.prix % 1 === 0 ? s.prix.toFixed(0) : s.prix.toFixed(2)} ${s.prixDevise ?? s.currency}`
                        : "—"}
                    </span>

                    {/* Variation */}
                    <div className="text-right pr-3">
                      <VariationBadge v={s.variation} size="sm" />
                    </div>

                    {/* Voir */}
                    <div className="flex justify-end">
                      <Link href={`/marches/${encodeURIComponent(s.ticker)}`}
                        className="text-[#2E80CE] group/lnk">
                        <svg className="w-4 h-4 transition-transform duration-150 group-hover/lnk:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
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

export default function MarchesClient({
  indices,
  updatedAt,
  fromCache,
}: {
  indices: IndiceData[];
  updatedAt: string | null;
  fromCache: boolean;
}) {
  const [region, setRegion] = useState<Region>("tous");
  const filtres = indices.filter((idx) => region === "tous" || idx.region === region);

  return (
    <>
      {/* ── Header sombre ──────────────────────────────────────────────────── */}
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

          {/* Bandeau mise à jour */}
          <p className="text-white/25 text-xs mb-8">
            {fromCache && updatedAt
              ? `Données actualisées le ${formatUpdatedAt(updatedAt)} · Yahoo Finance`
              : "Données indicatives · actualisées manuellement"}
          </p>

          {/* Filtres pills */}
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

      {/* ── Indices ─────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-8 max-w-6xl mx-auto space-y-4">
        {filtres.length > 0 ? (
          filtres.map((indice, i) => (
            <IndiceSection key={indice.id} indice={indice} defaultOpen={i === 0} />
          ))
        ) : (
          <div
            className="bg-white rounded-2xl px-8 py-16 text-center"
            style={{ boxShadow: "0 2px 16px rgba(14,52,120,0.08)" }}
          >
            <p className="text-[#8A9BB0] text-lg">Aucun indice pour cette région.</p>
            <button
              onClick={() => setRegion("tous")}
              className="mt-4 text-[#2E80CE] text-sm font-semibold hover:underline"
            >
              Voir tous les indices →
            </button>
          </div>
        )}
      </section>

      {/* ── Disclaimer ──────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-16 max-w-6xl mx-auto">
        <div
          className="flex gap-3 bg-white rounded-xl px-5 py-4"
          style={{ boxShadow: "0 2px 8px rgba(14,52,120,0.04)" }}
        >
          <svg className="w-4 h-4 text-[#2E80CE] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#8A9BB0] text-sm leading-relaxed">
            Données fournies par Yahoo Finance, actualisées quotidiennement. Les informations affichées sont à titre éducatif uniquement et ne constituent pas un conseil en investissement.
          </p>
        </div>
      </section>
    </>
  );
}
