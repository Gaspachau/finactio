"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ActifData } from "@/lib/actifs-data";
import { useT } from "@/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "histoire" | "chiffres" | "simulateur" | "quiz";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEur(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(".", ",") + " M€";
  return Math.round(n).toLocaleString("fr-FR") + " €";
}

// ─── Onglet Histoire ──────────────────────────────────────────────────────────

function HistoireTab({ actif }: { actif: ActifData }) {
  return (
    <div className="space-y-6">
      {actif.histoire.map((para, i) => (
        <p key={i} className="text-[#1E3A5F] leading-relaxed text-base sm:text-lg">
          {para}
        </p>
      ))}
    </div>
  );
}

// ─── Onglet Chiffres ──────────────────────────────────────────────────────────

function ChiffresTab({ actif }: { actif: ActifData }) {
  return (
    <div className="space-y-3">
      {actif.chiffres.map((c, i) => (
        <div key={i} className="bg-[#F0F7FF] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#1E3A5F] text-sm font-medium">{c.ratio}</span>
            <span
              className="text-[#2E80CE] text-2xl font-bold tabular-nums"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              {c.valeur}
            </span>
          </div>
          <p className="text-[#1E3A5F] text-sm leading-relaxed border-t border-[#DDEAFF] pt-2">
            {c.explication}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Onglet Simulateur ────────────────────────────────────────────────────────

function SimulateurSlider({
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
        <span className="text-[#0C2248] text-xl font-bold"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{display}</span>
      </div>
      <div className="relative h-2 rounded-full bg-[#DDEAFF]">
        <div className="absolute inset-y-0 left-0 rounded-full bg-[#2E80CE] transition-all duration-150"
          style={{ width: `${pct}%` }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2" style={{ zIndex: 2 }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#2E80CE] border-2 border-white shadow pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }} />
      </div>
      <div className="flex justify-between text-[#1E3A5F]/60 text-xs">
        <span>{min.toLocaleString("fr-FR")}</span>
        <span>{max.toLocaleString("fr-FR")}</span>
      </div>
    </div>
  );
}

function SimulateurTab({ actif }: { actif: ActifData }) {
  const [montant, setMontant] = useState(1000);
  const [duree, setDuree] = useState(5);
  const t = useT();
  const tf = t.ficheActif;

  const chartData = useMemo(() =>
    Array.from({ length: duree + 1 }, (_, i) => ({
      annee: i,
      valeur: Math.round(montant * Math.pow(1 + actif.tauxAnnuelSimu, i)),
    })),
    [montant, duree, actif.tauxAnnuelSimu]
  );

  const capitalFinal = chartData[chartData.length - 1].valeur;
  const gain = capitalFinal - montant;
  const multiplicateur = (capitalFinal / montant).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="bg-[#F0F7FF] rounded-xl p-4 flex items-start gap-3">
        <span className="text-[#2E80CE] text-sm mt-0.5 shrink-0">ℹ</span>
        <p className="text-[#1E3A5F] text-sm">{actif.performanceLabel}</p>
      </div>

      <div className="space-y-6">
        <SimulateurSlider label={tf.simuMontant} value={montant} min={100} max={10000} step={100}
          display={montant.toLocaleString("fr-FR") + " €"} onChange={setMontant} />
        <SimulateurSlider label={tf.simuDuree} value={duree} min={1} max={15} step={1}
          display={duree + " " + tf.simuAns} onChange={setDuree} />
      </div>

      {/* Résultats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#2E80CE]/10 border border-[#2E80CE]/30 rounded-xl p-4 text-center">
          <p className="text-[#1E3A5F] text-xs mb-1">{tf.simuCapitalFinal}</p>
          <p className="text-[#2E80CE] text-xl font-bold"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{formatEur(capitalFinal)}</p>
        </div>
        <div className="bg-[#F0F7FF] rounded-xl p-4 text-center">
          <p className="text-[#1E3A5F] text-xs mb-1">{tf.simuGain}</p>
          <p className="text-[#0C2248] text-xl font-bold"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>+{formatEur(gain)}</p>
        </div>
        <div className="bg-[#F0F7FF] rounded-xl p-4 text-center">
          <p className="text-[#1E3A5F] text-xs mb-1">{tf.simuMultiplicateur}</p>
          <p className="text-[#0C2248] text-xl font-bold"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{multiplicateur}×</p>
        </div>
      </div>

      {/* Graphique */}
      <div>
        <p className="text-[#1E3A5F] text-xs uppercase tracking-widest font-semibold mb-3">
          {tf.simuProjection} {duree} {tf.simuAns}
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gSimu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2E80CE" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#2E80CE" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F0FA" vertical={false} />
            <XAxis dataKey="annee" tick={{ fill: "#1E3A5F", fontSize: 11 }} tickLine={false}
              axisLine={false} tickFormatter={v => `${v}a`} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "#1E3A5F", fontSize: 11 }} tickLine={false} axisLine={false}
              width={52}
              tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(0) + "k" : v.toString()} />
            <Tooltip
              contentStyle={{ background: "#ffffff", border: "1px solid rgba(46,128,206,0.4)", borderRadius: 12 }}
              labelStyle={{ color: "#1E3A5F", fontSize: 11 }}
              formatter={(v: unknown) => [formatEur(v as number), "Valeur"]}
              labelFormatter={(l) => `Année ${l}`}
            />
            <Area type="monotone" dataKey="valeur" stroke="#2E80CE" strokeWidth={2}
              fill="url(#gSimu)" name="valeur" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[#1E3A5F]/60 text-xs text-center">
        {tf.simuDisclaimer}
      </p>
    </div>
  );
}

// ─── Onglet Quiz ──────────────────────────────────────────────────────────────

function QuizTab({ actif }: { actif: ActifData }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(actif.quiz.length).fill(null)
  );
  const [done, setDone] = useState(false);
  const t = useT();
  const tf = t.ficheActif;

  const q = actif.quiz[current];
  const chosen = answers[current];

  const handleAnswer = (idx: number) => {
    if (chosen !== null) return;
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);

    setTimeout(() => {
      if (current < actif.quiz.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        setDone(true);
      }
    }, 1400);
  };

  const score = answers.filter((a, i) => a === actif.quiz[i]?.answer).length;
  const scoreMsg = tf.quizScores[score] ?? tf.quizScores[tf.quizScores.length - 1];

  const resetQuiz = () => {
    setCurrent(0);
    setAnswers(Array(actif.quiz.length).fill(null));
    setDone(false);
  };

  if (done) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className={`text-6xl font-bold ${score === actif.quiz.length ? "text-[#2E80CE]" : score >= 2 ? "text-[#0C2248]" : "text-[#1E3A5F]"}`}
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          {score}/{actif.quiz.length}
        </div>
        <p className="text-[#1E3A5F] text-base max-w-md mx-auto">{scoreMsg}</p>
        <div className="flex justify-center gap-2">
          {actif.quiz.map((_, i) => (
            <span key={i} className={`w-3 h-3 rounded-full ${answers[i] === actif.quiz[i].answer ? "bg-[#2E80CE]" : "bg-red-500"}`} />
          ))}
        </div>
        <button onClick={resetQuiz}
          className="bg-[#DDEAFF] hover:bg-[#BDD3F0] text-[#0C2248] font-semibold px-6 py-3 rounded-lg text-sm transition-colors">
          {tf.quizRestart}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-[#DDEAFF] rounded-full overflow-hidden">
          <div className="h-full bg-[#2E80CE] rounded-full transition-all duration-300"
            style={{ width: `${((current) / actif.quiz.length) * 100}%` }} />
        </div>
        <span className="text-[#1E3A5F] text-xs whitespace-nowrap">{current + 1}/{actif.quiz.length}</span>
      </div>

      {/* Question */}
      <div className="bg-[#F0F7FF] rounded-xl p-5">
        <p className="text-[#0C2248] font-semibold text-base leading-snug">{q.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let cls = "border border-[#BDD3F0] bg-[#F0F7FF] text-[#0C2248] hover:border-[#2E80CE]/60";
          if (chosen !== null) {
            if (i === q.answer) cls = "border border-[#2E80CE] bg-[#2E80CE]/10 text-[#2E80CE]";
            else if (i === chosen) cls = "border border-red-500 bg-red-500/10 text-red-400";
            else cls = "border border-[#DDEAFF] bg-[#F0F7FF] text-[#1E3A5F]/60";
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)}
              className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all ${cls} ${chosen !== null ? "cursor-default" : "cursor-pointer"}`}>
              <span className="font-semibold mr-2">{["A", "B", "C"][i]}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {chosen !== null && (
        <div className={`rounded-xl px-4 py-3 text-sm border ${chosen === q.answer
          ? "bg-[#2E80CE]/10 border-[#2E80CE]/30 text-[#2E80CE]"
          : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          <span className="font-semibold">{chosen === q.answer ? tf.quizCorrect : tf.quizWrong}</span>
          {q.explication}
        </div>
      )}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function FicheActif({ actif }: { actif: ActifData }) {
  const [activeTab, setActiveTab] = useState<Tab>("histoire");
  const t = useT();
  const tf = t.ficheActif;

  const TABS: { id: Tab; label: string }[] = [
    { id: "histoire", label: tf.tabs.histoire },
    { id: "chiffres", label: tf.tabs.chiffres },
    { id: "simulateur", label: tf.tabs.simulateur },
    { id: "quiz", label: tf.tabs.quiz },
  ];

  return (
    <>
      {/* ── Header ── */}
      <section className="pt-24 pb-8 border-b border-[#DDEAFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Badge type */}
          <span className={`inline-flex items-center text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 ${actif.typeBadgeClass}`}>
            {actif.type}
          </span>

          {/* Ticker + Nom + Prix */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-5 mb-6">
            <h1 className="text-6xl sm:text-7xl font-bold uppercase leading-none text-[#0C2248]"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              {actif.ticker}
            </h1>
            <div className="pb-1">
              <p className="text-[#1E3A5F] text-lg">{actif.name}</p>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="text-[#0C2248] text-2xl font-semibold">{actif.price}</span>
                <span className={`text-base font-semibold ${actif.changePositive ? "text-[#2E80CE]" : "text-red-400"}`}>
                  {actif.change}
                </span>
              </div>
            </div>
          </div>

          {/* 4 métriques */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {actif.metrics.map((m) => (
              <div key={m.label} className="bg-[#DDEAFF] rounded-xl px-4 py-3">
                <p className="text-[#1E3A5F] text-xs mb-1">{m.label}</p>
                <p className="text-[#0C2248] text-xl font-bold"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Onglets ── */}
      <div className="sticky top-16 z-40 bg-[#F0F7FF] border-b border-[#DDEAFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-[#2E80CE] text-[#0C2248]"
                    : "border-transparent text-[#1E3A5F] hover:text-[#0C2248]"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contenu ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 pb-24">
        {activeTab === "histoire" && <HistoireTab actif={actif} />}
        {activeTab === "chiffres" && <ChiffresTab actif={actif} />}
        {activeTab === "simulateur" && <SimulateurTab actif={actif} />}
        {activeTab === "quiz" && <QuizTab actif={actif} />}
      </section>
    </>
  );
}
