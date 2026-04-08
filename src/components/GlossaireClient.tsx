"use client";

import { useState, useMemo } from "react";
import { useT } from "@/contexts/LanguageContext";
import type { GlossaireTerm } from "@/lib/i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

type Categorie = "Bourse" | "Épargne" | "Immobilier" | "Crypto" | "Fiscalité";

const CAT_COLORS: Record<Categorie, string> = {
  Bourse: "text-blue-600 bg-blue-50 border-blue-200",
  Épargne: "text-[#2E80CE] bg-[#DDEAFF] border-[#BDD3F0]",
  Immobilier: "text-orange-600 bg-orange-50 border-orange-200",
  Crypto: "text-amber-600 bg-amber-50 border-amber-200",
  Fiscalité: "text-purple-600 bg-purple-50 border-purple-200",
};

// ─── Composant terme ──────────────────────────────────────────────────────────

function TermeCard({ terme, exempleLabel }: { terme: GlossaireTerm; exempleLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="w-full text-left bg-white rounded-2xl p-5 sm:p-6 card-hover transition-all border border-[#DDEAFF]"
      aria-expanded={open}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Mot + badge */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2
              className="text-2xl font-black text-[#0C2248] uppercase leading-none"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              {terme.mot}
            </h2>
            <span
              className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${CAT_COLORS[terme.categorie]}`}
            >
              {terme.categorie}
            </span>
          </div>

          {/* Définition */}
          <p className="text-[#1E3A5F] text-sm leading-relaxed">{terme.definition}</p>

          {/* Analogie */}
          <p className="text-[#1E3A5F]/60 text-sm italic mt-2 leading-relaxed">
            {terme.analogie}
          </p>
        </div>

        {/* Chevron */}
        <div
          className={`shrink-0 text-[#2E80CE] transition-transform duration-300 mt-1 ${open ? "rotate-180" : ""}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Exemple chiffré (expand) */}
      {open && (
        <div className="mt-4 pt-4 border-t border-[#DDEAFF]">
          <p className="text-xs text-[#2E80CE] font-semibold uppercase tracking-widest mb-2">
            {exempleLabel}
          </p>
          <p className="text-[#1E3A5F] text-sm leading-relaxed">{terme.exemple}</p>
        </div>
      )}
    </button>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function GlossaireClient() {
  const [search, setSearch] = useState("");
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const t = useT();
  const gp = t.glossairePage;

  const filtered = useMemo(() => {

    const q = search.trim().toLowerCase();
    const activeCat = gp.categories[activeCatIdx];
    return gp.terms.filter((terme) => {
      const matchCat = activeCatIdx === 0 || terme.categorie === activeCat;
      const matchSearch =
        !q ||
        terme.mot.toLowerCase().includes(q) ||
        terme.definition.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCatIdx, gp]);

  // Raw FR categories for counting (always use FR categorie field)
  const FR_CATS: Categorie[] = ["Bourse", "Épargne", "Immobilier", "Crypto", "Fiscalité"];

  return (
    <>
    {/* Header */}
    <section className="relative overflow-hidden pt-32 pb-12 px-4 sm:px-6">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(46,128,206,0.10) 0%, transparent 70%)" }} />
      <div className="relative max-w-4xl mx-auto">
        <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-3">{gp.label}</p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase text-[#0C2248] leading-none mb-4"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          {gp.title}
        </h1>
        <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#2E80CE] leading-none mb-4"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          {gp.heading}
        </h2>
        <p className="text-[#1E3A5F] text-lg">{gp.subtitle}</p>
      </div>
    </section>

    <section className="px-4 sm:px-6 pb-24 max-w-4xl mx-auto space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E3A5F]/60 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={gp.searchPlaceholder}
          className="w-full bg-white border border-[#DDEAFF] text-[#0C2248] placeholder-[#1E3A5F]/40 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#2E80CE] transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E3A5F]/60 hover:text-[#0C2248] transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtres catégorie */}
      <div className="flex flex-wrap gap-2">
        {gp.categories.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => setActiveCatIdx(idx)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              activeCatIdx === idx
                ? "bg-[#1E3A5F] border-[#1E3A5F] text-white"
                : "border-[#DDEAFF] text-[#1E3A5F] hover:border-[#2E80CE] hover:text-[#0C2248]"
            }`}
          >
            {cat}
            {idx > 0 && (
              <span className="ml-1.5 text-xs opacity-60">
                {gp.terms.filter((t) => t.categorie === FR_CATS[idx - 1]).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Compteur résultats */}
      <p className="text-[#1E3A5F]/60 text-sm">
        {search || activeCatIdx !== 0
          ? gp.foundLabel(filtered.length)
          : gp.totalLabel(filtered.length)}
      </p>

      {/* Liste */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((terme) => (
            <TermeCard key={terme.mot} terme={terme} exempleLabel={gp.exempleLabel} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[#1E3A5F]/60 text-lg">{gp.noResult(search)}</p>
          <button
            onClick={() => { setSearch(""); setActiveCatIdx(0); }}
            className="mt-4 text-[#2E80CE] text-sm hover:underline"
          >
            {gp.resetFilters}
          </button>
        </div>
      )}
    </section>
    </>
  );
}
