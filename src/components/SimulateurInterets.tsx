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

// ─── Calculs ─────────────────────────────────────────────────────────────────

function computeData(
  capital: number,
  versement: number,
  tauxAnnuel: number,
  duree: number
) {
  const r = tauxAnnuel / 100 / 12; // taux mensuel
  const points = [];

  for (let annee = 0; annee <= duree; annee++) {
    const n = annee * 12;
    let valeur: number;

    if (r === 0) {
      valeur = capital + versement * n;
    } else {
      const facteur = Math.pow(1 + r, n);
      valeur = capital * facteur + versement * ((facteur - 1) / r);
    }

    const verse = capital + versement * n;
    const interets = Math.max(0, valeur - verse);

    points.push({
      annee,
      verse: Math.round(verse),
      interets: Math.round(interets),
    });
  }

  return points;
}

function formatEur(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(".", ",") + " M€";
  return n.toLocaleString("fr-FR") + " €";
}

// ─── Slider ──────────────────────────────────────────────────────────────────

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="text-[#6B7280] text-sm">{label}</label>
        <span
          className="text-[#F9F9F9] text-xl font-bold tabular-nums"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {display}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-[#374151]">
        {/* filled track */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#059669]"
          style={{ width: `${pct}%` }}
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
        {/* thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#059669] border-2 border-[#111827] shadow pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)`, zIndex: 1 }}
        />
      </div>
      <div className="flex justify-between text-[#4B5563] text-xs">
        <span>{min.toLocaleString("fr-FR")}</span>
        <span>{max.toLocaleString("fr-FR")}</span>
      </div>
    </div>
  );
}

// ─── Tooltip recharts ────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  const verse = payload.find((p) => p.name === "verse")?.value ?? 0;
  const interets = payload.find((p) => p.name === "interets")?.value ?? 0;

  return (
    <div className="bg-[#1F2937] border border-[#374151] rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-[#6B7280] mb-2 font-medium">Année {label}</p>
      <p className="text-[#F9F9F9]">
        Total :{" "}
        <span className="font-bold" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
          {formatEur(verse + interets)}
        </span>
      </p>
      <p className="text-[#6B7280]">
        Capital versé :{" "}
        <span className="text-[#F9F9F9]">{formatEur(verse)}</span>
      </p>
      <p className="text-[#059669]">
        Intérêts :{" "}
        <span className="font-semibold">{formatEur(interets)}</span>
      </p>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function SimulateurInterets() {
  const [capital, setCapital] = useState(10000);
  const [versement, setVersement] = useState(200);
  const [taux, setTaux] = useState(7);
  const [duree, setDuree] = useState(20);

  const data = useMemo(
    () => computeData(capital, versement, taux, duree),
    [capital, versement, taux, duree]
  );

  const last = data[data.length - 1];
  const capitalFinal = last.verse + last.interets;
  const totalVerse = last.verse;
  const totalInterets = last.interets;

  return (
    <div className="bg-[#1F2937] rounded-2xl p-6 sm:p-8 space-y-8">
      {/* ── Sliders ── */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Slider
          label="Capital initial"
          value={capital}
          min={0}
          max={50000}
          step={500}
          display={capital.toLocaleString("fr-FR") + " €"}
          onChange={setCapital}
        />
        <Slider
          label="Versement mensuel"
          value={versement}
          min={0}
          max={2000}
          step={50}
          display={versement.toLocaleString("fr-FR") + " €"}
          onChange={setVersement}
        />
        <Slider
          label="Taux annuel"
          value={taux}
          min={0}
          max={15}
          step={0.1}
          display={taux.toFixed(1).replace(".", ",") + " %"}
          onChange={setTaux}
        />
        <Slider
          label="Durée"
          value={duree}
          min={1}
          max={40}
          step={1}
          display={duree + " ans"}
          onChange={setDuree}
        />
      </div>

      {/* ── Résultats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Capital final", value: formatEur(capitalFinal), highlight: true },
          { label: "Total versé", value: formatEur(totalVerse), highlight: false },
          { label: "Intérêts générés", value: formatEur(totalInterets), highlight: false },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl px-4 py-5 text-center ${
              item.highlight
                ? "bg-[#059669]/10 border border-[#059669]/30"
                : "bg-[#111827]"
            }`}
          >
            <p className="text-[#6B7280] text-xs mb-1">{item.label}</p>
            <p
              className={`text-xl sm:text-2xl font-bold tabular-nums leading-tight ${
                item.highlight ? "text-[#059669]" : "text-[#F9F9F9]"
              }`}
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Graphique ── */}
      <div>
        <p className="text-[#6B7280] text-xs uppercase tracking-widest font-semibold mb-4">
          Évolution sur {duree} ans
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradVerse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4B5563" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#4B5563" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="gradInterets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="annee"
              tick={{ fill: "#6B7280", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v} ans`}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                v >= 1_000_000
                  ? (v / 1_000_000).toFixed(1) + "M"
                  : v >= 1000
                  ? (v / 1000).toFixed(0) + "k"
                  : v.toString()
              }
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#374151", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="verse"
              stackId="a"
              stroke="#4B5563"
              strokeWidth={1.5}
              fill="url(#gradVerse)"
              name="verse"
            />
            <Area
              type="monotone"
              dataKey="interets"
              stackId="a"
              stroke="#059669"
              strokeWidth={2}
              fill="url(#gradInterets)"
              name="interets"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Légende */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#4B5563] inline-block" />
            <span className="text-[#6B7280] text-xs">Capital versé</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#059669] inline-block" />
            <span className="text-[#6B7280] text-xs">Intérêts générés</span>
          </div>
        </div>
      </div>
    </div>
  );
}
