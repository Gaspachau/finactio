"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Données ──────────────────────────────────────────────────────────────────

const PEA_AVANTAGES = [
  "Exonération d'impôt sur les plus-values après 5 ans (17,2% au lieu de 30%)",
  "Idéal pour investir sur le long terme en Europe",
  "Compatible avec la plupart des ETF actions européens et monde",
  "Dividendes réinvestis sans imposition tant que l'argent reste dans le PEA",
];

const PEA_INCONVENIENTS = [
  "Plafond de versement à 150 000€",
  "Limité aux actions européennes et ETF éligibles",
  "Retrait avant 5 ans entraîne la clôture du plan",
  "Pas d'accès direct aux actions US, crypto, obligations",
];

const CTO_AVANTAGES = [
  "Aucune restriction géographique — monde entier accessible",
  "Pas de plafond de versement",
  "Accès aux actions US, ETF monde, obligations, crypto, matières premières",
  "Retraits possibles à tout moment sans pénalité fiscale",
];

const CTO_INCONVENIENTS = [
  "Flat tax 30% sur toutes les plus-values et dividendes (PFU)",
  "Pas d'avantage fiscal lié à la durée de détention",
  "Fiscalité moins avantageuse que le PEA pour les résidents français",
];

const PEA_COURTIERS = [
  {
    nom: "Trade Republic",
    frais: "1€ / ordre",
    badge: "Le moins cher",
    badgeColor: "bg-[#4ADE80]/15 text-green-700 border-green-200",
  },
  {
    nom: "Boursorama",
    frais: "0,5% (min 1,99€)",
    badge: null,
  },
  {
    nom: "Fortuneo",
    frais: "0,2% (min 0,99€)",
    badge: null,
  },
];

const CTO_COURTIERS = [
  {
    nom: "Interactive Brokers",
    frais: "0€ / ordre",
    badge: "Le moins cher",
    badgeColor: "bg-[#4ADE80]/15 text-green-700 border-green-200",
  },
  {
    nom: "Trade Republic",
    frais: "1€ / ordre",
    badge: null,
  },
  {
    nom: "Degiro",
    frais: "0,50€ + 0,004%",
    badge: null,
  },
];

// ─── Quiz ─────────────────────────────────────────────────────────────────────

type Q1 = "low" | "mid" | "high" | null;
type Q2 = "europe" | "world" | "both" | null;
type Q3 = "short" | "long" | null;

function getRecommendation(q1: Q1, q2: Q2, q3: Q3): { compte: "PEA" | "CTO" | null; courtier: string; reason: string } | null {
  if (!q1 || !q2 || !q3) return null;

  // Préférence PEA : horizon long + Europe ou les deux
  if (q3 === "long" && (q2 === "europe" || q2 === "both")) {
    return {
      compte: "PEA",
      courtier: "Trade Republic",
      reason: "Avec un horizon 5 ans+, le PEA te fait économiser 13% de taxes sur tes gains. Trade Republic à 1€/ordre est imbattable pour débuter.",
    };
  }

  // Monde entier + court terme → CTO IBKR
  if (q2 === "world" && q3 === "short") {
    return {
      compte: "CTO",
      courtier: "Interactive Brokers",
      reason: "Tu veux investir sur le monde entier avec un horizon court. Le CTO chez Interactive Brokers (0€/ordre) est le plus flexible.",
    };
  }

  // Monde entier + long terme → CTO ou les deux
  if (q2 === "world" && q3 === "long") {
    return {
      compte: "CTO",
      courtier: "Interactive Brokers",
      reason: "Le PEA ne couvre pas les actions US. Pour un portefeuille mondial, commence par un CTO chez Interactive Brokers — idéalement complété par un PEA pour tes ETF Europe.",
    };
  }

  // Faible budget + Europe + long → PEA Trade Republic
  if (q1 === "low" && q2 === "europe" && q3 === "long") {
    return {
      compte: "PEA",
      courtier: "Trade Republic",
      reason: "Avec moins de 100€/mois sur le long terme en Europe, le PEA chez Trade Republic à 1€ fixe est optimal : peu de frais, avantage fiscal maximal.",
    };
  }

  // Fallback
  if (q3 === "long") {
    return {
      compte: "PEA",
      courtier: "Trade Republic",
      reason: "Pour un horizon long terme en Europe, le PEA reste la meilleure enveloppe fiscale disponible pour les résidents français.",
    };
  }

  return {
    compte: "CTO",
    courtier: "Degiro",
    reason: "Pour un horizon court et un accès flexible aux marchés, le CTO chez Degiro offre un bon rapport frais / fonctionnalités.",
  };
}

// ─── Composants ───────────────────────────────────────────────────────────────

function PillButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
        active
          ? "bg-[#1E3A5F] border-[#1E3A5F] text-white shadow-[0_2px_8px_rgba(30,58,95,0.25)]"
          : "bg-white border-[#DDEAFF] text-[#1E3A5F] hover:border-[#2E80CE]/50 hover:text-[#0C2248]"
      }`}
    >
      {label}
    </button>
  );
}

interface CourtierRow {
  nom: string;
  frais: string;
  badge?: string | null;
  badgeColor?: string;
}

function CourtierTable({ courtiers }: { courtiers: CourtierRow[] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#DDEAFF]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F0F7FF] border-b border-[#DDEAFF]">
            <th className="text-left px-4 py-3 text-[#1E3A5F]/60 text-xs uppercase tracking-widest font-semibold">
              Courtier
            </th>
            <th className="text-left px-4 py-3 text-[#1E3A5F]/60 text-xs uppercase tracking-widest font-semibold">
              Frais / ordre
            </th>
          </tr>
        </thead>
        <tbody>
          {courtiers.map((c, i) => (
            <tr
              key={c.nom}
              className={`border-b border-[#DDEAFF] last:border-0 ${i % 2 === 1 ? "bg-[#F8FBFF]" : "bg-white"}`}
            >
              <td className="px-4 py-3 text-[#0C2248] font-semibold flex items-center gap-2 flex-wrap">
                {c.nom}
                {c.badge && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${c.badgeColor}`}>
                    {c.badge}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-[#1E3A5F] font-medium tabular-nums">{c.frais}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccountCard({
  badge,
  badgeColor,
  title,
  description,
  avantages,
  inconvenients,
  plafond,
  courtiers,
  verdict,
}: {
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  avantages: string[];
  inconvenients: string[];
  plafond: string | null;
  courtiers: CourtierRow[];
  verdict: string;
}) {
  return (
    <div
      className="bg-white rounded-3xl border border-[#DDEAFF] overflow-hidden flex flex-col"
      style={{ boxShadow: "0 8px 32px rgba(14,52,120,0.08)" }}
    >
      {/* Header */}
      <div className="p-6 sm:p-8 flex-1 space-y-6">
        {/* Badge + titre */}
        <div>
          <span className={`inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border mb-3 ${badgeColor}`}>
            {badge}
          </span>
          <h2
            className="text-3xl font-black text-[#0C2248] uppercase leading-none"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            {title}
          </h2>
          <p className="text-[#1E3A5F] text-sm mt-2 leading-relaxed">{description}</p>
        </div>

        {/* Plafond */}
        {plafond && (
          <div className="flex items-center gap-3 bg-[#DDEAFF]/60 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-[#2E80CE] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#1E3A5F] text-sm font-medium">{plafond}</p>
          </div>
        )}

        {/* Avantages / inconvénients */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            {avantages.map((a) => (
              <div key={a} className="flex items-start gap-2">
                <span className="text-[#4ADE80] mt-0.5 shrink-0 font-bold">✓</span>
                <p className="text-[#1E3A5F] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {inconvenients.map((x) => (
              <div key={x} className="flex items-start gap-2">
                <span className="text-[#EF4444] mt-0.5 shrink-0 font-bold">✗</span>
                <p className="text-[#1E3A5F] text-sm leading-relaxed">{x}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tableau courtiers */}
        <div>
          <p className="text-[#1E3A5F]/60 text-xs uppercase tracking-widest font-semibold mb-3">
            Courtiers recommandés
          </p>
          <CourtierTable courtiers={courtiers} />
        </div>
      </div>

      {/* Verdict */}
      <div className="bg-[#1E3A5F] px-6 sm:px-8 py-5">
        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">Verdict</p>
        <p className="text-white text-sm leading-relaxed">{verdict}</p>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function DecouvrirPage() {
  const [q1, setQ1] = useState<Q1>(null);
  const [q2, setQ2] = useState<Q2>(null);
  const [q3, setQ3] = useState<Q3>(null);

  const reco = getRecommendation(q1, q2, q3);

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #F0F7FF 0%, #EBF3FF 50%, #F0F7FF 100%)" }}
    >
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-16 px-4 sm:px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(46,128,206,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(46,128,206,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-4">
            Découvrir
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black uppercase text-[#0C2248] leading-none mb-5"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Trouve le meilleur
            <br />
            <span className="text-[#2E80CE]">courtier pour toi</span>
          </h1>
          <p className="text-[#1E3A5F] text-lg max-w-2xl mx-auto">
            On compare les frais, la fiscalité et les restrictions de chaque compte — pour que tu choisisses en connaissance de cause.
          </p>
        </div>
      </section>

      {/* ── Quiz ── */}
      <section className="px-4 sm:px-6 pb-12 max-w-3xl mx-auto">
        <div
          className="bg-white rounded-3xl border border-[#DDEAFF] p-6 sm:p-8 space-y-8"
          style={{ boxShadow: "0 8px 32px rgba(14,52,120,0.08)" }}
        >
          <p
            className="text-[#0C2248] text-xl font-black uppercase"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Ton profil en 3 questions
          </p>

          {/* Q1 */}
          <div className="space-y-3">
            <p className="text-[#1E3A5F] text-sm font-semibold">
              Tu investis combien par mois ?
            </p>
            <div className="flex flex-wrap gap-2">
              <PillButton label="Moins de 100€" active={q1 === "low"} onClick={() => setQ1("low")} />
              <PillButton label="100 – 500€" active={q1 === "mid"} onClick={() => setQ1("mid")} />
              <PillButton label="Plus de 500€" active={q1 === "high"} onClick={() => setQ1("high")} />
            </div>
          </div>

          {/* Q2 */}
          <div className="space-y-3">
            <p className="text-[#1E3A5F] text-sm font-semibold">
              Tu veux investir où ?
            </p>
            <div className="flex flex-wrap gap-2">
              <PillButton label="Europe uniquement" active={q2 === "europe"} onClick={() => setQ2("europe")} />
              <PillButton label="Monde entier" active={q2 === "world"} onClick={() => setQ2("world")} />
              <PillButton label="Les deux" active={q2 === "both"} onClick={() => setQ2("both")} />
            </div>
          </div>

          {/* Q3 */}
          <div className="space-y-3">
            <p className="text-[#1E3A5F] text-sm font-semibold">
              Ton horizon d&apos;investissement ?
            </p>
            <div className="flex flex-wrap gap-2">
              <PillButton label="Moins de 5 ans" active={q3 === "short"} onClick={() => setQ3("short")} />
              <PillButton label="5 ans et plus" active={q3 === "long"} onClick={() => setQ3("long")} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Recommandation dynamique ── */}
      {reco && (
        <section className="px-4 sm:px-6 pb-10 max-w-3xl mx-auto">
          <div
            className="rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 8px 32px rgba(14,52,120,0.12)" }}
          >
            <div className="bg-[#0C2248] px-6 sm:px-8 py-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#2E80CE]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2E80CE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-[#2E80CE] text-xs font-bold uppercase tracking-widest">
                  Notre recommandation
                </p>
              </div>
              <p
                className="text-white text-2xl sm:text-3xl font-black uppercase leading-tight mb-3"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                {reco.compte} chez {reco.courtier}
              </p>
              <p className="text-white/70 text-sm leading-relaxed">{reco.reason}</p>
            </div>
            <div className="bg-[#1E3A5F] px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
              <p className="text-white/60 text-xs">
                Basé sur tes réponses — modifiable à tout moment ci-dessus.
              </p>
              <button
                onClick={() => { setQ1(null); setQ2(null); setQ3(null); }}
                className="text-[#2E80CE] text-xs font-semibold hover:text-white transition-colors shrink-0"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Fiches PEA / CTO ── */}
      <section className="px-4 sm:px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <AccountCard
            badge="Fiscalité avantageuse"
            badgeColor="bg-[#4ADE80]/15 text-green-700 border-green-200"
            title="PEA"
            description="Le Plan d'Épargne en Actions est un compte boursier réservé aux résidents français. Son atout majeur : après 5 ans de détention, tes gains ne sont taxés qu'à 17,2% (prélèvements sociaux) au lieu de 30% avec la flat tax classique."
            avantages={PEA_AVANTAGES}
            inconvenients={PEA_INCONVENIENTS}
            plafond="Plafond de versement : 150 000€ (hors plus-values)"
            courtiers={PEA_COURTIERS}
            verdict="Le PEA est l'enveloppe de référence pour les investisseurs long terme résidant en France. Si tu peux bloquer ton argent 5 ans et que tu vises les marchés européens ou des ETF monde éligibles, c'est ton point de départ."
          />
          <AccountCard
            badge="Flexible"
            badgeColor="bg-orange-50 text-orange-600 border-orange-200"
            title="CTO"
            description="Le Compte-Titres Ordinaire est un compte sans restriction. Tu peux y loger n'importe quel actif coté : actions US, ETF monde, obligations, REITs... en contrepartie d'une flat tax de 30% sur tous tes gains et dividendes."
            avantages={CTO_AVANTAGES}
            inconvenients={CTO_INCONVENIENTS}
            plafond={null}
            courtiers={CTO_COURTIERS}
            verdict="Le CTO est indispensable si tu veux investir au-delà de l'Europe ou diversifier avec des actifs non éligibles au PEA. Idéalement, ouvre-le en complément d'un PEA pour combiner flexibilité et optimisation fiscale."
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
