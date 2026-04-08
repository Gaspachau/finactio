"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Données comptes ──────────────────────────────────────────────────────────

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

// ─── Données courtiers ────────────────────────────────────────────────────────

interface CourtierRow {
  nom: string;
  courtage: string;
  garde: string;
  highlight?: "best" | "worst";
  badge?: string;
}

const PEA_COURTIERS: CourtierRow[] = [
  { nom: "Trade Republic", courtage: "1€ / ordre", garde: "0€", highlight: "best", badge: "Le moins cher" },
  { nom: "Bourse Direct", courtage: "0,99€ / ordre", garde: "0€" },
  { nom: "Fortuneo", courtage: "0,2% (min 0,99€)", garde: "0€" },
  { nom: "Boursorama", courtage: "0,5% (min 1,99€)", garde: "0€" },
  { nom: "Saxo Banque", courtage: "0,08% (min 3€)", garde: "0€" },
  { nom: "BNP Paribas", courtage: "0,7% (min 7,50€)", garde: "22,50€ / an", highlight: "worst", badge: "Le plus cher" },
];

const CTO_COURTIERS: CourtierRow[] = [
  { nom: "Interactive Brokers", courtage: "0€ / ordre", garde: "0€", highlight: "best", badge: "Le moins cher" },
  { nom: "Trade Republic", courtage: "1€ / ordre", garde: "0€" },
  { nom: "Bourse Direct", courtage: "0,99€ / ordre", garde: "0€" },
  { nom: "Degiro", courtage: "0,50€ + 0,004%", garde: "0€" },
  { nom: "Saxo", courtage: "0,08% (min 3€)", garde: "0€" },
  { nom: "BNP", courtage: "0,7% (min 7,50€)", garde: "22,50€ / an", highlight: "worst", badge: "Le plus cher" },
];

// ─── Données frais ────────────────────────────────────────────────────────────

const FRAIS_TYPES = [
  {
    titre: "Frais de garde",
    icone: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    explication: "Ce que tu paies chaque année juste pour détenir tes titres chez un courtier — même sans passer un seul ordre.",
    exemple: "10 000€ investis. BNP : 22,50€/an. Trade Republic : 0€. Sur 10 ans = 225€ perdus. Réinvestis à 7%/an, ça aurait fait 314€ supplémentaires.",
    alerte: false,
  },
  {
    titre: "Frais de courtage",
    icone: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    explication: "Commission prélevée à chaque achat ou vente d'un titre. Elle peut être fixe (1€) ou proportionnelle (0,5% du montant).",
    exemple: "Tu achètes 500€ d'Apple. BNP : 7,50€ (1,5%). Trade Republic : 1€. Interactive Brokers : 0€. Sur 20 ordres/an : jusqu'à 130€ de différence — soit 26% de ton premier mois d'épargne.",
    alerte: true,
  },
  {
    titre: "Droits de garde",
    icone: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    explication: "Frais annuels calculés sur la valeur totale de ton portefeuille. Souvent confondus avec les frais de garde fixes.",
    exemple: "Portefeuille de 50 000€ taxé à 0,1%/an = 50€. Sur 20 ans, ces 50€/an auraient généré 2 000€ supplémentaires s'ils avaient été investis en ETF à 7%.",
    alerte: false,
  },
  {
    titre: "Frais d'inactivité",
    icone: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    explication: "Pénalité automatique facturée si tu ne passes pas d'ordre pendant une période définie (souvent 3 mois).",
    exemple: "3 mois sans ordre = 10€/mois facturés automatiquement chez certains courtiers. Soit 120€/an pour ne rien faire. Trade Republic, Boursorama et Interactive Brokers : 0€.",
    alerte: true,
  },
  {
    titre: "Le spread",
    icone: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    explication: "Différence entre le prix d'achat (ask) et le prix de vente (bid) d'un titre. C'est le coût caché que personne ne voit sur sa facture.",
    exemple: "Action cotée à 100€. Tu achètes à 100,10€, tu revends à 99,90€. Sur 100 actions = 10€ de frais invisibles par aller-retour, sans aucune commission affichée.",
    alerte: false,
  },
];

// ─── Quiz ─────────────────────────────────────────────────────────────────────

type Q1 = "low" | "mid" | "high" | null;
type Q2 = "europe" | "world" | "both" | null;
type Q3 = "short" | "long" | null;

function getRecommendation(q1: Q1, q2: Q2, q3: Q3): { compte: "PEA" | "CTO"; courtier: string; reason: string } | null {
  if (!q1 || !q2 || !q3) return null;

  if (q3 === "long" && (q2 === "europe" || q2 === "both")) {
    return {
      compte: "PEA",
      courtier: "Trade Republic",
      reason: "Avec un horizon 5 ans+, le PEA te fait économiser 13% de taxes sur tes gains. Trade Republic à 1€/ordre est imbattable pour débuter.",
    };
  }
  if (q2 === "world" && q3 === "short") {
    return {
      compte: "CTO",
      courtier: "Interactive Brokers",
      reason: "Tu veux investir sur le monde entier avec un horizon court. Le CTO chez Interactive Brokers (0€/ordre) est le plus flexible.",
    };
  }
  if (q2 === "world" && q3 === "long") {
    return {
      compte: "CTO",
      courtier: "Interactive Brokers",
      reason: "Le PEA ne couvre pas les actions US. Pour un portefeuille mondial, commence par un CTO chez Interactive Brokers — idéalement complété par un PEA pour tes ETF Europe.",
    };
  }
  if (q1 === "low" && q2 === "europe" && q3 === "long") {
    return {
      compte: "PEA",
      courtier: "Trade Republic",
      reason: "Avec moins de 100€/mois sur le long terme en Europe, le PEA chez Trade Republic à 1€ fixe est optimal : peu de frais, avantage fiscal maximal.",
    };
  }
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

function PillButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
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

function CourtierTable({ courtiers }: { courtiers: CourtierRow[] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#DDEAFF]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F0F7FF] border-b border-[#DDEAFF]">
            <th className="text-left px-4 py-3 text-[#1E3A5F]/60 text-xs uppercase tracking-widest font-semibold">Courtier</th>
            <th className="text-left px-4 py-3 text-[#1E3A5F]/60 text-xs uppercase tracking-widest font-semibold">Courtage / ordre</th>
            <th className="text-left px-4 py-3 text-[#1E3A5F]/60 text-xs uppercase tracking-widest font-semibold">Garde / an</th>
          </tr>
        </thead>
        <tbody>
          {courtiers.map((c) => {
            const rowBg =
              c.highlight === "best"
                ? "bg-[#DCFCE7]"
                : c.highlight === "worst"
                ? "bg-[#FEE2E2]"
                : "bg-white";
            return (
              <tr key={c.nom} className={`border-b border-[#DDEAFF] last:border-0 ${rowBg}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#0C2248] font-semibold">{c.nom}</span>
                    {c.badge && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          c.highlight === "best"
                            ? "bg-white/80 text-green-700 border-green-300"
                            : "bg-white/80 text-red-600 border-red-300"
                        }`}
                      >
                        {c.badge}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#1E3A5F] font-medium tabular-nums">{c.courtage}</td>
                <td className={`px-4 py-3 font-medium tabular-nums ${c.highlight === "worst" ? "text-[#EF4444] font-semibold" : "text-[#1E3A5F]"}`}>
                  {c.garde}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AccountCard({
  badge, badgeColor, title, description, avantages, inconvenients, plafond, courtiers, verdict,
}: {
  badge: string; badgeColor: string; title: string; description: string;
  avantages: string[]; inconvenients: string[]; plafond: string | null;
  courtiers: CourtierRow[]; verdict: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-[#DDEAFF] overflow-hidden flex flex-col"
      style={{ boxShadow: "0 8px 32px rgba(14,52,120,0.08)" }}>
      <div className="p-6 sm:p-8 flex-1 space-y-6">
        <div>
          <span className={`inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border mb-3 ${badgeColor}`}>
            {badge}
          </span>
          <h2 className="text-3xl font-black text-[#0C2248] uppercase leading-none"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            {title}
          </h2>
          <p className="text-[#1E3A5F] text-sm mt-2 leading-relaxed">{description}</p>
        </div>

        {plafond && (
          <div className="flex items-center gap-3 bg-[#DDEAFF]/60 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-[#2E80CE] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#1E3A5F] text-sm font-medium">{plafond}</p>
          </div>
        )}

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

        <div>
          <p className="text-[#1E3A5F]/60 text-xs uppercase tracking-widest font-semibold mb-3">
            Comparatif courtiers
          </p>
          <CourtierTable courtiers={courtiers} />
        </div>
      </div>

      <div className="bg-[#1E3A5F] px-6 sm:px-8 py-5">
        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">Verdict</p>
        <p className="text-white text-sm leading-relaxed">{verdict}</p>
      </div>
    </div>
  );
}

// ─── Slider simple ────────────────────────────────────────────────────────────

function SimpleSlider({
  label, value, min, max, step, display, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="text-[#1E3A5F] text-sm">{label}</label>
        <span className="text-[#0C2248] text-lg font-bold tabular-nums"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          {display}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-[#DDEAFF]">
        <div className="absolute inset-y-0 left-0 rounded-full bg-[#2E80CE] transition-all duration-150"
          style={{ width: `${pct}%` }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2" style={{ zIndex: 2 }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#2E80CE] border-2 border-white shadow pointer-events-none transition-all duration-150"
          style={{ left: `calc(${pct}% - 8px)`, zIndex: 1 }} />
      </div>
      <div className="flex justify-between text-[#1E3A5F]/50 text-xs">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

// ─── Simulateur frais ─────────────────────────────────────────────────────────

function SimulateurFrais() {
  const [mensuel, setMensuel] = useState(200);
  const [duree, setDuree] = useState(10);

  const ordresParAn = 20;

  const { fraisTR, fraisBNP, economie } = useMemo(() => {
    // Taille moyenne d'un ordre = (mensuel × 12) / ordresParAn
    const ordreAvg = (mensuel * 12) / ordresParAn;

    // Trade Republic : 1€ fixe / ordre
    const trParOrdre = 1;
    const trGardeAn = 0;
    const fraisTR = (trParOrdre * ordresParAn + trGardeAn) * duree;

    // BNP : max(0.7% × montant, 7.5€) / ordre + 22.5€ garde/an
    const bnpParOrdre = Math.max(0.007 * ordreAvg, 7.5);
    const bnpGardeAn = 22.5;
    const fraisBNP = (bnpParOrdre * ordresParAn + bnpGardeAn) * duree;

    return { fraisTR: Math.round(fraisTR), fraisBNP: Math.round(fraisBNP), economie: Math.round(fraisBNP - fraisTR) };
  }, [mensuel, duree]);

  const fmt = (n: number) => n.toLocaleString("fr-FR") + " €";

  return (
    <div className="bg-white rounded-3xl border border-[#DDEAFF] p-6 sm:p-8 space-y-8"
      style={{ boxShadow: "0 8px 32px rgba(14,52,120,0.08)" }}>
      <div>
        <p className="text-[#2E80CE] text-xs font-bold uppercase tracking-widest mb-1">Simulateur</p>
        <h3 className="text-2xl font-black text-[#0C2248] uppercase"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          Impact des frais sur ta durée
        </h3>
        <p className="text-[#1E3A5F]/60 text-sm mt-1">
          Basé sur 20 ordres/an. Compare Trade Republic vs BNP Paribas.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <SimpleSlider
          label="Montant mensuel investi"
          value={mensuel}
          min={50}
          max={1000}
          step={50}
          display={fmt(mensuel)}
          onChange={setMensuel}
        />
        <SimpleSlider
          label="Durée d'investissement"
          value={duree}
          min={1}
          max={30}
          step={1}
          display={`${duree} ans`}
          onChange={setDuree}
        />
      </div>

      {/* Résultat central */}
      <div className="bg-[#1E3A5F] rounded-2xl px-6 py-5 text-center">
        <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-2">
          Chez Trade Republic tu économises
        </p>
        <p className="text-4xl sm:text-5xl font-black text-[#4ADE80] tabular-nums"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          {fmt(economie)}
        </p>
        <p className="text-white/60 text-sm mt-1">
          vs BNP Paribas sur {duree} an{duree > 1 ? "s" : ""}
        </p>
      </div>

      {/* Deux colonnes */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Trade Republic */}
        <div className="rounded-2xl border-2 border-[#4ADE80]/40 bg-[#DCFCE7]/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-green-800 font-black text-lg uppercase"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              Trade Republic
            </p>
            <span className="text-xs font-semibold bg-[#4ADE80]/20 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
              Recommandé
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-800/70">Courtage (1€ × {ordresParAn} × {duree} ans)</span>
              <span className="text-green-800 font-semibold tabular-nums">{fmt(20 * duree)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-800/70">Frais de garde</span>
              <span className="text-green-800 font-semibold">0 €</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-green-200">
              <span className="text-green-800 font-bold">Total payé</span>
              <span className="text-green-800 font-black text-lg tabular-nums"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                {fmt(fraisTR)}
              </span>
            </div>
          </div>
        </div>

        {/* BNP */}
        <div className="rounded-2xl border-2 border-[#EF4444]/30 bg-[#FEE2E2]/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-red-800 font-black text-lg uppercase"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              BNP Paribas
            </p>
            <span className="text-xs font-semibold bg-[#EF4444]/10 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
              Le plus cher
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-red-800/70">Courtage (7,50€ min × {ordresParAn} × {duree} ans)</span>
              <span className="text-red-800 font-semibold tabular-nums">{fmt(fraisBNP - Math.round(22.5 * duree))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-800/70">Frais de garde (22,50€ × {duree} ans)</span>
              <span className="text-red-800 font-semibold tabular-nums">{fmt(Math.round(22.5 * duree))}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-red-200">
              <span className="text-red-800 font-bold">Total payé</span>
              <span className="text-red-800 font-black text-lg tabular-nums"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                {fmt(fraisBNP)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[#1E3A5F]/40 text-xs text-center">
        Hypothèses : {ordresParAn} ordres/an, courtage BNP min 7,50€/ordre + 22,50€ garde/an. Calcul hors inflation et intérêts composés.
      </p>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function DecouvrirPage() {
  const [q1, setQ1] = useState<Q1>(null);
  const [q2, setQ2] = useState<Q2>(null);
  const [q3, setQ3] = useState<Q3>(null);
  const [openFrais, setOpenFrais] = useState<number | null>(null);

  const reco = getRecommendation(q1, q2, q3);

  return (
    <main className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #F0F7FF 0%, #EBF3FF 50%, #F0F7FF 100%)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-16 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(46,128,206,0.12) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: "radial-gradient(circle, rgba(46,128,206,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-4">Découvrir</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase text-[#0C2248] leading-none mb-5"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
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
        <div className="bg-white rounded-3xl border border-[#DDEAFF] p-6 sm:p-8 space-y-8"
          style={{ boxShadow: "0 8px 32px rgba(14,52,120,0.08)" }}>
          <p className="text-[#0C2248] text-xl font-black uppercase"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Ton profil en 3 questions
          </p>
          <div className="space-y-3">
            <p className="text-[#1E3A5F] text-sm font-semibold">Tu investis combien par mois ?</p>
            <div className="flex flex-wrap gap-2">
              <PillButton label="Moins de 100€" active={q1 === "low"} onClick={() => setQ1("low")} />
              <PillButton label="100 – 500€" active={q1 === "mid"} onClick={() => setQ1("mid")} />
              <PillButton label="Plus de 500€" active={q1 === "high"} onClick={() => setQ1("high")} />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[#1E3A5F] text-sm font-semibold">Tu veux investir où ?</p>
            <div className="flex flex-wrap gap-2">
              <PillButton label="Europe uniquement" active={q2 === "europe"} onClick={() => setQ2("europe")} />
              <PillButton label="Monde entier" active={q2 === "world"} onClick={() => setQ2("world")} />
              <PillButton label="Les deux" active={q2 === "both"} onClick={() => setQ2("both")} />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[#1E3A5F] text-sm font-semibold">Ton horizon d&apos;investissement ?</p>
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
          <div className="rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 8px 32px rgba(14,52,120,0.12)" }}>
            <div className="bg-[#0C2248] px-6 sm:px-8 py-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#2E80CE]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2E80CE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-[#2E80CE] text-xs font-bold uppercase tracking-widest">Notre recommandation</p>
              </div>
              <p className="text-white text-2xl sm:text-3xl font-black uppercase leading-tight mb-3"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                {reco.compte} chez {reco.courtier}
              </p>
              <p className="text-white/70 text-sm leading-relaxed">{reco.reason}</p>
            </div>
            <div className="bg-[#1E3A5F] px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
              <p className="text-white/60 text-xs">Basé sur tes réponses — modifiable à tout moment ci-dessus.</p>
              <button onClick={() => { setQ1(null); setQ2(null); setQ3(null); }}
                className="text-[#2E80CE] text-xs font-semibold hover:text-white transition-colors shrink-0">
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

      {/* ── Comprendre les frais ── */}
      <section className="px-4 sm:px-6 pb-16 max-w-4xl mx-auto">
        {/* Header section */}
        <div className="mb-10">
          <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-3">Éducation</p>
          <h2 className="text-4xl sm:text-5xl font-black uppercase text-[#0C2248] leading-none mb-3"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Comprendre
            <br />
            <span className="text-[#2E80CE]">les frais</span>
          </h2>
          <p className="text-[#1E3A5F] text-lg max-w-xl">
            5 types de frais qui grignotent ton épargne — avec des exemples concrets pour mesurer leur impact réel.
          </p>
        </div>

        {/* Accordéon 5 types */}
        <div className="space-y-3 mb-12">
          {FRAIS_TYPES.map((f, i) => {
            const isOpen = openFrais === i;
            return (
              <div key={f.titre}
                className="bg-white rounded-2xl border border-[#DDEAFF] overflow-hidden"
                style={{ boxShadow: "0 4px 16px rgba(14,52,120,0.05)" }}>
                <button
                  onClick={() => setOpenFrais(isOpen ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? "bg-[#1E3A5F] text-white" : "bg-[#DDEAFF] text-[#2E80CE]"
                  }`}>
                    {f.icone}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#0C2248] font-black text-base uppercase"
                        style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                        {f.titre}
                      </span>
                      {f.alerte && (
                        <span className="text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full">
                          Attention
                        </span>
                      )}
                    </div>
                    {!isOpen && (
                      <p className="text-[#1E3A5F]/60 text-sm truncate mt-0.5">{f.explication}</p>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-[#1E3A5F]/40 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 space-y-4 border-t border-[#DDEAFF]">
                    <div className="pt-4">
                      <p className="text-[#1E3A5F] text-sm leading-relaxed">{f.explication}</p>
                    </div>
                    <div className="bg-[#1E3A5F] rounded-xl px-5 py-4">
                      <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-2">
                        Exemple concret
                      </p>
                      <p className="text-white text-sm leading-relaxed">{f.exemple}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Simulateur d'impact */}
        <SimulateurFrais />
      </section>

      <Footer />
    </main>
  );
}
