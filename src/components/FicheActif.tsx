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
        <p key={i} className="text-[#9CA3AF] leading-relaxed text-base sm:text-lg">
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
        <div key={i} className="bg-[#111827] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#6B7280] text-sm font-medium">{c.ratio}</span>
            <span
              className="text-[#059669] text-2xl font-bold tabular-nums"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              {c.valeur}
            </span>
          </div>
          <p className="text-[#6B7280] text-sm leading-relaxed border-t border-[#1F2937] pt-2">
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
        <label className="text-[#6B7280] text-sm">{label}</label>
        <span className="text-[#F9F9F9] text-xl font-bold"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}>{display}</span>
      </div>
      <div className="relative h-2 rounded-full bg-[#374151]">
        <div className="absolute inset-y-0 left-0 rounded-full bg-[#059669] transition-all duration-150"
          style={{ width: `${pct}%` }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2" style={{ zIndex: 2 }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#059669] border-2 border-[#111827] shadow pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }} />
      </div>
      <div className="flex justify-between text-[#4B5563] text-xs">
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
      <div className="bg-[#111827] rounded-xl p-4 flex items-start gap-3">
        <span className="text-[#059669] text-sm mt-0.5 shrink-0">ℹ</span>
        <p className="text-[#6B7280] text-sm">{actif.performanceLabel}</p>
      </div>

      <div className="space-y-6">
        <SimulateurSlider label={tf.simuMontant} value={montant} min={100} max={10000} step={100}
          display={montant.toLocaleString("fr-FR") + " €"} onChange={setMontant} />
        <SimulateurSlider label={tf.simuDuree} value={duree} min={1} max={15} step={1}
          display={duree + " " + tf.simuAns} onChange={setDuree} />
      </div>

      {/* Résultats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#059669]/10 border border-[#059669]/30 rounded-xl p-4 text-center">
          <p className="text-[#6B7280] text-xs mb-1">{tf.simuCapitalFinal}</p>
          <p className="text-[#059669] text-xl font-bold"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}>{formatEur(capitalFinal)}</p>
        </div>
        <div className="bg-[#111827] rounded-xl p-4 text-center">
          <p className="text-[#6B7280] text-xs mb-1">{tf.simuGain}</p>
          <p className="text-[#F9F9F9] text-xl font-bold"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}>+{formatEur(gain)}</p>
        </div>
        <div className="bg-[#111827] rounded-xl p-4 text-center">
          <p className="text-[#6B7280] text-xs mb-1">{tf.simuMultiplicateur}</p>
          <p className="text-[#F9F9F9] text-xl font-bold"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}>{multiplicateur}×</p>
        </div>
      </div>

      {/* Graphique */}
      <div>
        <p className="text-[#6B7280] text-xs uppercase tracking-widest font-semibold mb-3">
          {tf.simuProjection} {duree} {tf.simuAns}
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gSimu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis dataKey="annee" tick={{ fill: "#6B7280", fontSize: 11 }} tickLine={false}
              axisLine={false} tickFormatter={v => `${v}a`} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} tickLine={false} axisLine={false}
              width={52}
              tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(0) + "k" : v.toString()} />
            <Tooltip
              contentStyle={{ background: "#0F172A", border: "1px solid #374151", borderRadius: 12 }}
              labelStyle={{ color: "#6B7280", fontSize: 11 }}
              formatter={(v: unknown) => [formatEur(v as number), "Valeur"]}
              labelFormatter={(l) => `Année ${l}`}
            />
            <Area type="monotone" dataKey="valeur" stroke="#059669" strokeWidth={2}
              fill="url(#gSimu)" name="valeur" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[#4B5563] text-xs text-center">
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
        <div className={`text-6xl font-bold ${score === actif.quiz.length ? "text-[#059669]" : score >= 2 ? "text-[#F9F9F9]" : "text-[#6B7280]"}`}
          style={{ fontFamily: "var(--font-barlow-condensed)" }}>
          {score}/{actif.quiz.length}
        </div>
        <p className="text-[#9CA3AF] text-base max-w-md mx-auto">{scoreMsg}</p>
        <div className="flex justify-center gap-2">
          {actif.quiz.map((_, i) => (
            <span key={i} className={`w-3 h-3 rounded-full ${answers[i] === actif.quiz[i].answer ? "bg-[#059669]" : "bg-red-500"}`} />
          ))}
        </div>
        <button onClick={resetQuiz}
          className="bg-[#1F2937] hover:bg-[#374151] text-[#F9F9F9] font-semibold px-6 py-3 rounded-lg text-sm transition-colors">
          {tf.quizRestart}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-[#1F2937] rounded-full overflow-hidden">
          <div className="h-full bg-[#059669] rounded-full transition-all duration-300"
            style={{ width: `${((current) / actif.quiz.length) * 100}%` }} />
        </div>
        <span className="text-[#6B7280] text-xs whitespace-nowrap">{current + 1}/{actif.quiz.length}</span>
      </div>

      {/* Question */}
      <div className="bg-[#111827] rounded-xl p-5">
        <p className="text-[#F9F9F9] font-semibold text-base leading-snug">{q.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let cls = "border border-[#374151] bg-[#111827] text-[#F9F9F9] hover:border-[#059669]/60";
          if (chosen !== null) {
            if (i === q.answer) cls = "border border-[#059669] bg-[#059669]/10 text-[#059669]";
            else if (i === chosen) cls = "border border-red-500 bg-red-500/10 text-red-400";
            else cls = "border border-[#1F2937] bg-[#111827] text-[#4B5563]";
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
          ? "bg-[#059669]/10 border-[#059669]/30 text-[#059669]"
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
      <section className="pt-24 pb-8 border-b border-[#1F2937]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Badge type */}
          <span className={`inline-flex items-center text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 ${actif.typeBadgeClass}`}>
            {actif.type}
          </span>

          {/* Ticker + Nom + Prix */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-5 mb-6">
            <h1 className="text-6xl sm:text-7xl font-bold uppercase leading-none text-[#F9F9F9]"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}>
              {actif.ticker}
            </h1>
            <div className="pb-1">
              <p className="text-[#6B7280] text-lg">{actif.name}</p>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="text-[#F9F9F9] text-2xl font-semibold">{actif.price}</span>
                <span className={`text-base font-semibold ${actif.changePositive ? "text-[#059669]" : "text-red-400"}`}>
                  {actif.change}
                </span>
              </div>
            </div>
          </div>

          {/* 4 métriques */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {actif.metrics.map((m) => (
              <div key={m.label} className="bg-[#1F2937] rounded-xl px-4 py-3">
                <p className="text-[#6B7280] text-xs mb-1">{m.label}</p>
                <p className="text-[#F9F9F9] text-xl font-bold"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Onglets ── */}
      <div className="sticky top-16 z-40 bg-[#111827] border-b border-[#1F2937]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-[#059669] text-[#F9F9F9]"
                    : "border-transparent text-[#6B7280] hover:text-[#F9F9F9]"
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
