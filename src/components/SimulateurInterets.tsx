"use client";

import { useMemo, useState } from "react";
import { useT } from "@/contexts/LanguageContext";
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

// ─── Calculs ──────────────────────────────────────────────────────────────────

function computeData(s: Scenario) {
  const r = s.taux / 100 / 12;
  return Array.from({ length: s.duree + 1 }, (_, annee) => {
    const n = annee * 12;
    const f = r === 0 ? 1 : Math.pow(1 + r, n);
    const valeur =
      r === 0
        ? s.capital + s.versement * n
        : s.capital * f + s.versement * ((f - 1) / r);
    const verse = s.capital + s.versement * n;
    return {
      annee,
      verse: Math.round(verse),
      interets: Math.max(0, Math.round(valeur - verse)),
    };
  });
}

function formatEur(n: number): string {
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(2).replace(".", ",") + " M€";
  return Math.round(n).toLocaleString("fr-FR") + " €";
}

function formatYAxisKeur(v: number): string {
  if (v >= 1_000_000)
    return (v / 1_000_000).toFixed(1).replace(".0", "") + "M€";
  if (v >= 1_000) return (v / 1_000).toFixed(0) + "k€";
  return v + "€";
}

import type { Translation } from "@/lib/i18n";

function computeInsights(
  s: Scenario,
  capitalFinal: number,
  totalInterets: number,
  tSim: Translation["simu"]
): string[] {
  const ins: string[] = [];
  if (s.taux > 0) {
    const d = Math.round(72 / s.taux);
    ins.push(tSim.insightDoubling(s.taux.toFixed(1).replace(".", ","), d));
  }
  if (capitalFinal > 0 && totalInterets > 0) {
    const pct = Math.round((totalInterets / capitalFinal) * 100);
    if (pct >= 15) ins.push(tSim.insightPct(pct));
  }
  if (s.versement <= 1900 && s.taux > 0) {
    const extra = computeData({ ...s, versement: s.versement + 100 });
    const gain =
      extra[extra.length - 1].verse +
      extra[extra.length - 1].interets -
      capitalFinal;
    if (gain > 200) ins.push(tSim.insightExtra(formatEur(gain)));
  }
  if (ins.length === 0 && s.taux === 0) ins.push(tSim.insightNoReturn);
  return ins.slice(0, 3);
}

const MILESTONES = [
  { value: 50_000, label: "50k€" },
  { value: 100_000, label: "100k€" },
  { value: 250_000, label: "250k€" },
  { value: 500_000, label: "500k€" },
];

const CAPITAL_PRESETS = [500, 1_000, 5_000, 10_000, 25_000, 50_000];
const VERSEMENT_PRESETS = [0, 50, 100, 200, 500, 1_000];

function fmtPreset(v: number): string {
  if (v === 0) return "0 €";
  if (v >= 1000) return (v / 1000) + "k€";
  return v + " €";
}

// ─── ButtonSelect ─────────────────────────────────────────────────────────────

function ButtonSelect({
  label,
  value,
  presets,
  onChange,
  placeholder = "Autre montant…",
}: {
  label: string;
  value: number;
  presets: number[];
  onChange: (v: number) => void;
  placeholder?: string;
}) {
  const [rawInput, setRawInput] = useState("");

  const activePreset = rawInput === "" ? value : -1;

  const selectPreset = (v: number) => {
    setRawInput("");
    onChange(v);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setRawInput(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 0) onChange(Math.min(num, 999_999));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-baseline">
        <p className="text-[#1E3A5F] text-sm">{label}</p>
        <span
          className="text-[#0C2248] text-xl font-bold tabular-nums"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          {value.toLocaleString("fr-FR")} €
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => selectPreset(p)}
            className={`py-2.5 px-1 rounded-xl text-sm font-semibold border transition-all ${
              activePreset === p
                ? "bg-[#1E3A5F] border-[#1E3A5F] text-white shadow-[0_0_12px_rgba(46,128,206,0.25)]"
                : "bg-[#F0F7FF] border-[#BDD3F0] text-[#1E3A5F] hover:border-[#2E80CE]/50 hover:text-[#0C2248]"
            }`}
          >
            {fmtPreset(p)}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={rawInput}
          onChange={handleInput}
          className="w-full bg-[#F0F7FF] border border-[#BDD3F0] text-[#0C2248] placeholder-[#1E3A5F]/40 rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none focus:border-[#2E80CE] transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E3A5F] text-sm pointer-events-none">
          €
        </span>
      </div>
    </div>
  );
}

// ─── Slider (taux + durée) ────────────────────────────────────────────────────

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  accent = "#2E80CE",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
  accent?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="text-[#1E3A5F] text-sm">{label}</label>
        <span
          className="text-[#0C2248] text-xl font-bold tabular-nums"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          {display}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-[#DDEAFF]">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          style={{ zIndex: 2 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow pointer-events-none transition-all duration-150"
          style={{ left: `calc(${pct}% - 8px)`, backgroundColor: accent, zIndex: 1 }}
        />
      </div>
      <div className="flex justify-between text-[#1E3A5F]/60 text-xs">
        <span>{min.toLocaleString("fr-FR")}</span>
        <span>{max.toLocaleString("fr-FR")}</span>
      </div>
    </div>
  );
}

// ─── Tooltip custom ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
  showB,
  tSim,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: number;
  showB?: boolean;
  tSim: Translation["simu"];
}) {
  if (!active || !payload?.length) return null;
  const verse = payload.find((p) => p.name === "verse")?.value ?? 0;
  const interets = payload.find((p) => p.name === "interets")?.value ?? 0;
  const totalB = payload.find((p) => p.name === "totalB")?.value;

  return (
    <div className="bg-white border border-[#2E80CE]/40 rounded-xl px-5 py-4 text-sm shadow-xl shadow-[#2E80CE]/10 min-w-[200px]">
      <p className="text-[#2E80CE] text-xs font-bold uppercase tracking-widest mb-3">
        {tSim.annee} {label}
      </p>
      <p
        className="text-[#0C2248] text-2xl font-bold mb-3"
        style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
      >
        {formatEur(verse + interets)}
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-8">
          <span className="flex items-center gap-2 text-xs text-[#1E3A5F]">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#DDEAFF", border: "1px solid #1E3A5F" }} />
            {tSim.capitalVerse}
          </span>
          <span className="text-[#1E3A5F] text-xs font-medium tabular-nums">
            {formatEur(verse)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-8">
          <span className="flex items-center gap-2 text-xs text-[#1E3A5F]">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#2E80CE", border: "1px solid #1C6BB5" }} />
            {tSim.interetsGeneres}
          </span>
          <span className="text-[#2E80CE] text-xs font-semibold tabular-nums">
            {formatEur(interets)}
          </span>
        </div>
        {showB && totalB !== undefined && (
          <div className="flex items-center justify-between gap-8 pt-1.5 mt-1.5 border-t border-[#DDEAFF]">
            <span className="text-xs text-[#F59E0B]">{tSim.scenarioB}</span>
            <span className="text-[#F59E0B] text-xs font-semibold tabular-nums">
              {formatEur(totalB)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Milestone label ──────────────────────────────────────────────────────────

function MilestoneLabel({
  viewBox,
  value,
}: {
  viewBox?: { x?: number };
  value?: string;
}) {
  const x = viewBox?.x ?? 0;
  const len = value?.length ?? 0;
  return (
    <g>
      <rect
        x={x + 3}
        y={3}
        width={len * 7 + 10}
        height={17}
        rx={4}
        fill="#F0F7FF"
        fillOpacity={0.95}
      />
      <text
        x={x + 8}
        y={15}
        fill="rgba(30,58,95,0.65)"
        fontSize={9}
        fontWeight={700}
      >
        {value}
      </text>
    </g>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const DEFAULT_A: Scenario = { capital: 10_000, versement: 200, taux: 7, duree: 20 };
const DEFAULT_B: Scenario = { capital: 5_000, versement: 300, taux: 8, duree: 20 };

export default function SimulateurInterets() {
  const t = useT();
  const tSim = t.simu;

  const [scenA, setScenar] = useState<Scenario>(DEFAULT_A);
  const setA = (k: keyof Scenario) => (v: number) =>
    setScenar((p) => ({ ...p, [k]: v }));

  const [showB, setShowB] = useState(false);
  const [scenB, setScenarB] = useState<Scenario>(DEFAULT_B);
  const setB = (k: keyof Scenario) => (v: number) =>
    setScenarB((p) => ({ ...p, [k]: v }));

  const [pinnedYear, setPinnedYear] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dataA = useMemo(() => computeData(scenA), [scenA]);
  const dataB = useMemo(() => (showB ? computeData(scenB) : []), [scenB, showB]);

  const lastA = dataA[dataA.length - 1];
  const capitalFinal = lastA.verse + lastA.interets;
  const totalVerse = lastA.verse;
  const totalInterets = lastA.interets;
  const mise = scenA.capital + scenA.versement * scenA.duree * 12;
  const multiplicateur = mise > 0 ? capitalFinal / mise : 1;

  const insights = useMemo(
    () => computeInsights(scenA, capitalFinal, totalInterets, tSim),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenA, capitalFinal, totalInterets, tSim]
  );

  const milestones = useMemo(
    () =>
      MILESTONES.map(({ value, label }) => {
        const pt = dataA.find((p) => p.verse + p.interets >= value);
        return pt ? { year: pt.annee, label } : null;
      }).filter((m): m is { year: number; label: string } => m !== null),
    [dataA]
  );

  const maxDuree = showB ? Math.max(scenA.duree, scenB.duree) : scenA.duree;
  const chartData = useMemo(
    () =>
      Array.from({ length: maxDuree + 1 }, (_, i) => ({
        annee: i,
        verse: dataA[i]?.verse,
        interets: dataA[i]?.interets,
        ...(showB && dataB[i]
          ? { totalB: dataB[i].verse + dataB[i].interets }
          : {}),
      })),
    [dataA, dataB, showB, maxDuree]
  );

  const xTicks = useMemo(
    () =>
      Array.from(
        { length: Math.floor(scenA.duree / 5) + 1 },
        (_, i) => i * 5
      ),
    [scenA.duree]
  );

  const pinnedData = pinnedYear !== null ? dataA[pinnedYear] : null;
  const pinnedDataB =
    pinnedYear !== null && showB ? dataB[pinnedYear] : null;
  const metricsKey = `${capitalFinal}-${totalVerse}-${totalInterets}`;

  return (
    <div className="space-y-6">
      {/* ── Contrôles ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-8 border border-[#DDEAFF]">
        {/* Capital + Versement (boutons) */}
        <div className="space-y-6">
          <ButtonSelect
            label={tSim.capitalInitial}
            value={scenA.capital}
            presets={CAPITAL_PRESETS}
            onChange={setA("capital")}
            placeholder={tSim.autreAmout}
          />
          <ButtonSelect
            label={tSim.versementMensuel}
            value={scenA.versement}
            presets={VERSEMENT_PRESETS}
            onChange={setA("versement")}
            placeholder={tSim.autreAmout}
          />
        </div>

        {/* Taux + Durée (sliders) */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Slider
            label={tSim.tauxAnnuel}
            value={scenA.taux}
            min={0}
            max={15}
            step={0.1}
            display={scenA.taux.toFixed(1).replace(".", ",") + " %"}
            onChange={setA("taux")}
          />
          <Slider
            label={tSim.duree}
            value={scenA.duree}
            min={1}
            max={40}
            step={1}
            display={scenA.duree + " " + tSim.ans}
            onChange={setA("duree")}
          />
        </div>

        {/* ── 4 Métriques ── */}
        <div
          key={metricsKey}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up"
        >
          {/* Capital final */}
          <div className="col-span-2 sm:col-span-1 bg-[#1E3A5F]/5 border border-[#2E80CE]/30 rounded-2xl px-5 py-6 text-center">
            <p className="text-[#1E3A5F] text-xs uppercase tracking-widest mb-2">
              {tSim.capitalFinal}
            </p>
            <p
              className="text-3xl sm:text-4xl font-bold text-[#2E80CE] tabular-nums leading-none mb-1"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              {formatEur(capitalFinal)}
            </p>
            <p className="text-[#2E80CE]/60 text-xs">
              {tSim.gainsSubtitle(formatEur(totalInterets))}
            </p>
          </div>

          {/* Total versé */}
          <div className="bg-[#F0F7FF] rounded-2xl px-5 py-6 text-center">
            <p className="text-[#1E3A5F] text-xs uppercase tracking-widest mb-2">
              {tSim.totalVerse}
            </p>
            <p
              className="text-2xl sm:text-3xl font-bold text-[#0C2248] tabular-nums leading-none mb-1"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              {formatEur(totalVerse)}
            </p>
            <p className="text-[#1E3A5F]/60 text-xs">{tSim.effortSubtitle}</p>
          </div>

          {/* Intérêts */}
          <div className="bg-[#F0F7FF] rounded-2xl px-5 py-6 text-center">
            <p className="text-[#1E3A5F] text-xs uppercase tracking-widest mb-2">
              {tSim.interetsGeneres}
            </p>
            <p
              className="text-2xl sm:text-3xl font-bold text-[#0C2248] tabular-nums leading-none mb-1"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              {formatEur(totalInterets)}
            </p>
            <p className="text-[#1E3A5F]/60 text-xs">{tSim.sansTravailler}</p>
          </div>

          {/* Multiplicateur */}
          <div className="bg-[#F0F7FF] rounded-2xl px-5 py-6 text-center">
            <p className="text-[#1E3A5F] text-xs uppercase tracking-widest mb-2">
              {tSim.multiplicateur}
            </p>
            <p
              className="text-2xl sm:text-3xl font-bold text-[#0C2248] tabular-nums leading-none mb-1"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              ×{multiplicateur.toFixed(1)}
            </p>
            <p className="text-[#1E3A5F]/60 text-xs">{tSim.miseMultipliee}</p>
          </div>
        </div>

        {/* ── Insights ── */}
        {insights.length > 0 && (
          <div className="space-y-2">
            {insights.map((text, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[#F0F7FF] rounded-xl px-4 py-3 border border-[#DDEAFF]"
              >
                <span className="text-[#2E80CE] mt-0.5 shrink-0">💡</span>
                <p className="text-[#1E3A5F] text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Scénario B ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DDEAFF]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[#0C2248] font-semibold text-sm">
              {tSim.comparerScenario}
            </p>
            <p className="text-[#1E3A5F] text-xs">
              {tSim.comparerSubtitle}
            </p>
          </div>
          <button
            onClick={() => setShowB((v) => !v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
              showB
                ? "bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#F59E0B]"
                : "border-[#BDD3F0] text-[#1E3A5F] hover:border-[#1E3A5F] hover:text-[#0C2248]"
            }`}
          >
            {showB ? tSim.masquerScenarioB : tSim.ajouterScenario}
          </button>
        </div>

        {showB && (
          <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-[#BDD3F0]">
            <Slider
              label={tSim.capitalInitialB}
              value={scenB.capital}
              min={0}
              max={50000}
              step={500}
              display={scenB.capital.toLocaleString("fr-FR") + " €"}
              onChange={setB("capital")}
              accent="#F59E0B"
            />
            <Slider
              label={tSim.versementMensuelB}
              value={scenB.versement}
              min={0}
              max={2000}
              step={50}
              display={scenB.versement.toLocaleString("fr-FR") + " €"}
              onChange={setB("versement")}
              accent="#F59E0B"
            />
            <Slider
              label={tSim.tauxAnnuelB}
              value={scenB.taux}
              min={0}
              max={15}
              step={0.1}
              display={scenB.taux.toFixed(1).replace(".", ",") + " %"}
              onChange={setB("taux")}
              accent="#F59E0B"
            />
            <Slider
              label={tSim.dureeB}
              value={scenB.duree}
              min={1}
              max={40}
              step={1}
              display={scenB.duree + " " + tSim.ans}
              onChange={setB("duree")}
              accent="#F59E0B"
            />
          </div>
        )}
      </div>

      {/* ── Graphique ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DDEAFF]">
        <div className="flex items-center justify-between mb-4">
          <p
            className="text-[#0C2248] font-bold uppercase text-lg"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            {tSim.evolutionSur} {scenA.duree} {tSim.ans}
          </p>
          <p className="text-[#1E3A5F]/60 text-xs hidden sm:block">
            {tSim.cliquePourExplorer}
          </p>
        </div>

        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart
            data={chartData}
            margin={{ top: 24, right: 8, left: 4, bottom: 0 }}
            onMouseDown={(s) => {
              if (s?.activeLabel !== undefined) {
                setIsDragging(true);
                setPinnedYear(Number(s.activeLabel));
              }
            }}
            onMouseMove={(s) => {
              if (isDragging && s?.activeLabel !== undefined)
                setPinnedYear(Number(s.activeLabel));
            }}
            onMouseUp={() => setIsDragging(false)}
            onClick={(s) => {
              if (!isDragging && s?.activeLabel !== undefined)
                setPinnedYear((prev) =>
                  prev === Number(s.activeLabel) ? null : Number(s.activeLabel)
                );
            }}
          >
            <defs>
              <linearGradient id="gVerse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DDEAFF" stopOpacity={1} />
                <stop offset="100%" stopColor="#DDEAFF" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="gInterets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2E80CE" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#2E80CE" stopOpacity={0.06} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#E8F0FA"
              vertical={false}
              strokeOpacity={1}
            />

            <XAxis
              dataKey="annee"
              ticks={xTicks}
              tick={{ fill: "#1E3A5F", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}a`}
            />
            <YAxis
              tick={{ fill: "#1E3A5F", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxisKeur}
              width={52}
            />

            <Tooltip
              content={<CustomTooltip showB={showB} tSim={tSim} />}
              cursor={{ stroke: "#BDD3F0", strokeWidth: 1.5, strokeDasharray: "4 4" }}
            />

            {/* Milestones */}
            {milestones.map((m) => (
              <ReferenceLine
                key={m.label}
                x={m.year}
                stroke="rgba(46,128,206,0.2)"
                strokeWidth={1}
                strokeDasharray="4 3"
                label={<MilestoneLabel value={m.label} />}
              />
            ))}

            {/* Curseur épinglé */}
            {pinnedYear !== null && (
              <ReferenceLine
                x={pinnedYear}
                stroke="#2E80CE"
                strokeWidth={1.5}
                strokeDasharray="5 3"
              />
            )}

            <Area
              type="monotone"
              dataKey="verse"
              stackId="a"
              stroke="#1E3A5F"
              strokeWidth={1.5}
              fill="url(#gVerse)"
              name="verse"
              dot={false}
              activeDot={{ r: 4, fill: "#1E3A5F", stroke: "white", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="interets"
              stackId="a"
              stroke="#2E80CE"
              strokeWidth={2}
              fill="url(#gInterets)"
              name="interets"
              dot={false}
              activeDot={{ r: 5, fill: "#2E80CE", stroke: "white", strokeWidth: 2 }}
            />

            {showB && (
              <Line
                type="monotone"
                dataKey="totalB"
                stroke="#F59E0B"
                strokeWidth={2.5}
                dot={false}
                name="totalB"
                connectNulls
                strokeDasharray="6 3"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Légende */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: "#DDEAFF", border: "1px solid #1E3A5F" }}
            />
            <span className="text-[#1E3A5F] text-xs">{tSim.capitalVerse}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: "#2E80CE", border: "1px solid #1C6BB5" }}
            />
            <span className="text-[#1E3A5F] text-xs">{tSim.interetsGeneres}</span>
          </div>
          {showB && (
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-0"
                style={{ borderTop: "2px dashed #F59E0B", display: "block", width: 24 }}
              />
              <span className="text-[#1E3A5F] text-xs">{tSim.scenarioB}</span>
            </div>
          )}
        </div>

        {/* Panneau curseur épinglé */}
        {pinnedData && (
          <div className="mt-5 bg-[#F8FBFF] rounded-xl border border-[#2E80CE]/25 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#2E80CE] font-semibold text-sm">
                📍 {tSim.annee} {pinnedYear}
              </p>
              <button
                onClick={() => setPinnedYear(null)}
                className="text-[#1E3A5F]/60 hover:text-[#0C2248] text-xs transition-colors"
              >
                {tSim.fermer}
              </button>
            </div>
            <div
              className={`grid gap-4 text-center ${showB && pinnedDataB ? "grid-cols-4" : "grid-cols-3"}`}
            >
              <div>
                <p className="text-[#1E3A5F] text-xs mb-1">{tSim.capitalVerse}</p>
                <p
                  className="text-[#0C2248] font-bold"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  {formatEur(pinnedData.verse)}
                </p>
              </div>
              <div>
                <p className="text-[#1E3A5F] text-xs mb-1">{tSim.interets}</p>
                <p
                  className="text-[#2E80CE] font-bold"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  {formatEur(pinnedData.interets)}
                </p>
              </div>
              <div>
                <p className="text-[#1E3A5F] text-xs mb-1">{tSim.total}</p>
                <p
                  className="text-[#0C2248] text-lg font-bold"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  {formatEur(pinnedData.verse + pinnedData.interets)}
                </p>
              </div>
              {showB && pinnedDataB && (
                <div>
                  <p className="text-[#1E3A5F] text-xs mb-1">{tSim.totalB}</p>
                  <p
                    className="text-[#F59E0B] text-lg font-bold"
                    style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                  >
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
