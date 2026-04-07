"use client";

import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Scenario {
  capital: number;
  versement: number;
  taux: number;
  duree: number;
}

interface DataPoint {
  annee: number;
  verse: number;
  interets: number;
}

// ─── Calculs ──────────────────────────────────────────────────────────────────

function computeData(s: Scenario): DataPoint[] {
  const r = s.taux / 100 / 12;
  return Array.from({ length: s.duree + 1 }, (_, annee) => {
    const n = annee * 12;
    const f = r === 0 ? 1 : Math.pow(1 + r, n);
    const valeur = r === 0
      ? s.capital + s.versement * n
      : s.capital * f + s.versement * ((f - 1) / r);
    const verse = s.capital + s.versement * n;
    return { annee, verse: Math.round(verse), interets: Math.max(0, Math.round(valeur - verse)) };
  });
}

function formatEur(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(".", ",") + " M€";
  return Math.round(n).toLocaleString("fr-FR") + " €";
}

function formatYAxis(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(0) + "k";
  return v.toString();
}

function computeInsights(s: Scenario, capitalFinal: number, totalInterets: number): string[] {
  const ins: string[] = [];
  if (s.taux > 0) {
    const d = Math.round(72 / s.taux);
    ins.push(`À ${s.taux.toFixed(1).replace(".", ",")} % annuel, ton capital double environ tous les ${d} ans.`);
  }
  if (capitalFinal > 0 && totalInterets > 0) {
    const pct = Math.round((totalInterets / capitalFinal) * 100);
    if (pct >= 15)
      ins.push(`Les intérêts représentent ${pct} % de ton capital final — c'est la magie des intérêts composés.`);
  }
  if (s.versement <= 1900 && s.taux > 0) {
    const extra = computeData({ ...s, versement: s.versement + 100 });
    const gain = (extra[extra.length - 1].verse + extra[extra.length - 1].interets) - capitalFinal;
    if (gain > 200)
      ins.push(`+100 €/mois supplémentaires te rapporteraient ${formatEur(gain)} de plus à terme.`);
  }
  if (ins.length === 0 && s.taux === 0)
    ins.push("Sans rendement, tu n'accumules que ce que tu verses. Augmente le taux pour voir la magie opérer.");
  return ins.slice(0, 3);
}

const MILESTONES = [
  { value: 50_000, label: "50k" },
  { value: 100_000, label: "100k" },
  { value: 250_000, label: "250k" },
  { value: 500_000, label: "500k" },
  { value: 1_000_000, label: "1M" },
];

// ─── Sous-composants ──────────────────────────────────────────────────────────

function Slider({
  label, value, min, max, step, display, onChange, accent = "#059669",
}: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (v: number) => void; accent?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="text-[#6B7280] text-sm">{label}</label>
        <span className="text-[#F9F9F9] text-xl font-bold tabular-nums"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}>
          {display}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-[#374151]">
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, backgroundColor: accent }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2" style={{ zIndex: 2 }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#111827] shadow pointer-events-none transition-all duration-150"
          style={{ left: `calc(${pct}% - 8px)`, backgroundColor: accent, zIndex: 1 }} />
      </div>
      <div className="flex justify-between text-[#4B5563] text-xs">
        <span>{min.toLocaleString("fr-FR")}</span>
        <span>{max.toLocaleString("fr-FR")}</span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, showB }: {
  active?: boolean; payload?: { value: number; name: string }[]; label?: number; showB?: boolean;
}) {
  if (!active || !payload?.length) return null;
  const verse = payload.find(p => p.name === "verse")?.value ?? 0;
  const interets = payload.find(p => p.name === "interets")?.value ?? 0;
  const totalB = payload.find(p => p.name === "totalB")?.value;

  return (
    <div className="bg-[#0F172A] border border-[#374151] rounded-xl px-4 py-3 text-sm shadow-2xl">
      <p className="text-[#6B7280] mb-2 font-semibold">Année {label}</p>
      <div className="space-y-1">
        <p className="text-[#F9F9F9] font-bold text-base" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
          {formatEur(verse + interets)}
        </p>
        <p className="text-[#6B7280] text-xs">Capital versé : <span className="text-[#9CA3AF]">{formatEur(verse)}</span></p>
        <p className="text-[#059669] text-xs font-medium">Intérêts : {formatEur(interets)}</p>
        {showB && totalB !== undefined && (
          <p className="text-[#F59E0B] text-xs font-medium border-t border-[#374151] pt-1 mt-1">
            Scénario B : {formatEur(totalB)}
          </p>
        )}
      </div>
    </div>
  );
}

function MilestoneLabel({ viewBox, value }: { viewBox?: { x?: number }; value?: string }) {
  const x = viewBox?.x ?? 0;
  return (
    <g>
      <rect x={x + 3} y={2} width={value ? value.length * 6 + 8 : 32} height={15} rx={3} fill="#1F2937" />
      <text x={x + 7} y={13} fill="#6B7280" fontSize={9} fontWeight={700}>{value}</text>
    </g>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const DEFAULT_A: Scenario = { capital: 10000, versement: 200, taux: 7, duree: 20 };
const DEFAULT_B: Scenario = { capital: 5000, versement: 300, taux: 8, duree: 20 };

export default function SimulateurInterets() {
  // Scénario A
  const [scenA, setScenar] = useState<Scenario>(DEFAULT_A);
  const setA = (k: keyof Scenario) => (v: number) => setScenar(p => ({ ...p, [k]: v }));

  // Scénario B
  const [showB, setShowB] = useState(false);
  const [scenB, setScenarB] = useState<Scenario>(DEFAULT_B);
  const setB = (k: keyof Scenario) => (v: number) => setScenarB(p => ({ ...p, [k]: v }));

  // Cursor explorable
  const [pinnedYear, setPinnedYear] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculs
  const dataA = useMemo(() => computeData(scenA), [scenA]);
  const dataB = useMemo(() => (showB ? computeData(scenB) : []), [scenB, showB]);

  const lastA = dataA[dataA.length - 1];
  const capitalFinal = lastA.verse + lastA.interets;
  const totalVerse = lastA.verse;
  const totalInterets = lastA.interets;

  const insights = useMemo(
    () => computeInsights(scenA, capitalFinal, totalInterets),
    [scenA, capitalFinal, totalInterets]
  );

  // Milestones visibles sur le graphique
  const milestones = useMemo(() =>
    MILESTONES
      .map(({ value, label }) => {
        const pt = dataA.find(p => p.verse + p.interets >= value);
        return pt ? { year: pt.annee, label } : null;
      })
      .filter((m): m is { year: number; label: string } => m !== null),
    [dataA]
  );

  // Données fusionnées (pour scénario B)
  const maxDuree = showB ? Math.max(scenA.duree, scenB.duree) : scenA.duree;
  const chartData = useMemo(() =>
    Array.from({ length: maxDuree + 1 }, (_, i) => ({
      annee: i,
      verse: dataA[i]?.verse,
      interets: dataA[i]?.interets,
      ...(showB && dataB[i] ? { totalB: dataB[i].verse + dataB[i].interets } : {}),
    })),
    [dataA, dataB, showB, maxDuree]
  );

  // Données du curseur épinglé
  const pinnedData = pinnedYear !== null ? dataA[pinnedYear] : null;
  const pinnedDataB = (pinnedYear !== null && showB) ? dataB[pinnedYear] : null;
  const metricsKey = `${capitalFinal}-${totalVerse}-${totalInterets}`;

  return (
    <div className="space-y-6">
      {/* ── Sliders scénario A ── */}
      <div className="bg-[#1F2937] rounded-2xl p-6 sm:p-8 space-y-8">
        <div className="grid sm:grid-cols-2 gap-6">
          <Slider label="Capital initial" value={scenA.capital} min={0} max={50000} step={500}
            display={scenA.capital.toLocaleString("fr-FR") + " €"} onChange={setA("capital")} />
          <Slider label="Versement mensuel" value={scenA.versement} min={0} max={2000} step={50}
            display={scenA.versement.toLocaleString("fr-FR") + " €"} onChange={setA("versement")} />
          <Slider label="Taux annuel" value={scenA.taux} min={0} max={15} step={0.1}
            display={scenA.taux.toFixed(1).replace(".", ",") + " %"} onChange={setA("taux")} />
          <Slider label="Durée" value={scenA.duree} min={1} max={40} step={1}
            display={scenA.duree + " ans"} onChange={setA("duree")} />
        </div>

        {/* ── Métriques ── */}
        <div key={metricsKey} className="grid grid-cols-3 gap-4 animate-fade-up">
          {[
            { label: "Capital final", value: formatEur(capitalFinal), highlight: true },
            { label: "Total versé", value: formatEur(totalVerse), highlight: false },
            { label: "Intérêts générés", value: formatEur(totalInterets), highlight: false },
          ].map(item => (
            <div key={item.label}
              className={`rounded-xl px-4 py-5 text-center ${item.highlight
                ? "bg-[#059669]/10 border border-[#059669]/30"
                : "bg-[#111827]"}`}>
              <p className="text-[#6B7280] text-xs mb-1">{item.label}</p>
              <p className={`text-xl sm:text-2xl font-bold tabular-nums leading-tight ${item.highlight ? "text-[#059669]" : "text-[#F9F9F9]"}`}
                style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Insights dynamiques ── */}
        {insights.length > 0 && (
          <div className="space-y-2">
            {insights.map((text, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#111827] rounded-xl px-4 py-3">
                <span className="text-[#059669] text-base mt-0.5 shrink-0">💡</span>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Scénario B ── */}
      <div className="bg-[#1F2937] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[#F9F9F9] font-semibold text-sm">Comparer un scénario</p>
            <p className="text-[#6B7280] text-xs">Superpose une 2e configuration sur le même graphique</p>
          </div>
          <button
            onClick={() => setShowB(v => !v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
              showB
                ? "bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#F59E0B]"
                : "border-[#374151] text-[#6B7280] hover:border-[#6B7280] hover:text-[#F9F9F9]"
            }`}
          >
            {showB ? "✕ Masquer le scénario B" : "+ Ajouter un scénario"}
          </button>
        </div>

        {showB && (
          <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-[#374151]">
            <Slider label="Capital initial B" value={scenB.capital} min={0} max={50000} step={500}
              display={scenB.capital.toLocaleString("fr-FR") + " €"} onChange={setB("capital")} accent="#F59E0B" />
            <Slider label="Versement mensuel B" value={scenB.versement} min={0} max={2000} step={50}
              display={scenB.versement.toLocaleString("fr-FR") + " €"} onChange={setB("versement")} accent="#F59E0B" />
            <Slider label="Taux annuel B" value={scenB.taux} min={0} max={15} step={0.1}
              display={scenB.taux.toFixed(1).replace(".", ",") + " %"} onChange={setB("taux")} accent="#F59E0B" />
            <Slider label="Durée B" value={scenB.duree} min={1} max={40} step={1}
              display={scenB.duree + " ans"} onChange={setB("duree")} accent="#F59E0B" />
          </div>
        )}
      </div>

      {/* ── Graphique ── */}
      <div className="bg-[#1F2937] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[#6B7280] text-xs uppercase tracking-widest font-semibold">
            Évolution sur {scenA.duree} ans
          </p>
          <p className="text-[#4B5563] text-xs">Clique ou glisse pour explorer</p>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 8, left: 0, bottom: 0 }}
            onMouseDown={(s) => {
              if (s?.activeLabel !== undefined) {
                setIsDragging(true);
                setPinnedYear(Number(s.activeLabel));
              }
            }}
            onMouseMove={(s) => {
              if (isDragging && s?.activeLabel !== undefined) {
                setPinnedYear(Number(s.activeLabel));
              }
            }}
            onMouseUp={() => setIsDragging(false)}
            onClick={(s) => {
              if (!isDragging && s?.activeLabel !== undefined)
                setPinnedYear(prev => prev === Number(s.activeLabel) ? null : Number(s.activeLabel));
            }}
          >
            <defs>
              <linearGradient id="gVerse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4B5563" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#4B5563" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gInterets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#059669" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#27364a" vertical={false} />
            <XAxis dataKey="annee" tick={{ fill: "#6B7280", fontSize: 11 }} tickLine={false}
              axisLine={false} tickFormatter={v => `${v}a`} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={formatYAxis} width={44} />
            <Tooltip content={<CustomTooltip showB={showB} />}
              cursor={{ stroke: "#374151", strokeWidth: 1, strokeDasharray: "4 4" }} />

            {/* Milestones */}
            {milestones.map(m => (
              <ReferenceLine key={m.label} x={m.year} stroke="#374151" strokeWidth={1}
                strokeDasharray="3 3"
                label={<MilestoneLabel value={m.label} />} />
            ))}

            {/* Curseur épinglé */}
            {pinnedYear !== null && (
              <ReferenceLine x={pinnedYear} stroke="#059669" strokeWidth={1.5}
                strokeDasharray="5 3" />
            )}

            <Area type="monotone" dataKey="verse" stackId="a" stroke="#4B5563" strokeWidth={1.5}
              fill="url(#gVerse)" name="verse" />
            <Area type="monotone" dataKey="interets" stackId="a" stroke="#059669" strokeWidth={2}
              fill="url(#gInterets)" name="interets" />

            {showB && (
              <Line type="monotone" dataKey="totalB" stroke="#F59E0B" strokeWidth={2.5}
                dot={false} name="totalB" connectNulls strokeDasharray="6 3" />
            )}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Légende */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#4B5563]" />
            <span className="text-[#6B7280] text-xs">Capital versé (A)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#059669]" />
            <span className="text-[#6B7280] text-xs">Intérêts (A)</span>
          </div>
          {showB && (
            <div className="flex items-center gap-2">
              <span className="w-7 h-0.5 bg-[#F59E0B]" style={{ borderTop: "2px dashed #F59E0B" }} />
              <span className="text-[#6B7280] text-xs">Total scénario B</span>
            </div>
          )}
        </div>

        {/* Panneau curseur épinglé */}
        {pinnedData && (
          <div className="mt-5 bg-[#111827] rounded-xl border border-[#059669]/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#059669] font-semibold text-sm">
                📍 Année {pinnedYear}
              </p>
              <button onClick={() => setPinnedYear(null)}
                className="text-[#4B5563] hover:text-[#F9F9F9] text-xs transition-colors">
                ✕ Fermer
              </button>
            </div>
            <div className={`grid gap-4 text-center ${showB && pinnedDataB ? "grid-cols-4" : "grid-cols-3"}`}>
              <div>
                <p className="text-[#6B7280] text-xs mb-1">Capital versé</p>
                <p className="text-[#F9F9F9] font-bold" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                  {formatEur(pinnedData.verse)}
                </p>
              </div>
              <div>
                <p className="text-[#6B7280] text-xs mb-1">Intérêts</p>
                <p className="text-[#059669] font-bold" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                  {formatEur(pinnedData.interets)}
                </p>
              </div>
              <div>
                <p className="text-[#6B7280] text-xs mb-1">Total A</p>
                <p className="text-[#F9F9F9] text-lg font-bold" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                  {formatEur(pinnedData.verse + pinnedData.interets)}
                </p>
              </div>
              {showB && pinnedDataB && (
                <div>
                  <p className="text-[#6B7280] text-xs mb-1">Total B</p>
                  <p className="text-[#F59E0B] text-lg font-bold" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                    {formatEur(pinnedDataB.verse + pinnedDataB.interets)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
