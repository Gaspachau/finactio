"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartPoint {
  date: string;
  prix: number;
}

export interface StockDetail {
  ticker: string;
  nom: string;
  secteur: string;
  capMds: number;
  currency: string;
  prixDevise: string;
  prix: number;
  variation: number;
  indiceNom: string;
  pays: string;
  drapeau: string;
  volume?: number | null;
  dayHigh?: number | null;
  dayLow?: number | null;
  high52w?: number | null;
  low52w?: number | null;
  previousClose?: number | null;
}

// ─── Périodes ─────────────────────────────────────────────────────────────────

type Period = "1S" | "1M" | "3M" | "6M" | "1A";

const PERIODS: Period[] = ["1S", "1M", "3M", "6M", "1A"];

const PERIOD_POINTS: Record<Period, number> = {
  "1S":  7,
  "1M":  30,
  "3M":  90,
  "6M":  180,
  "1A":  Infinity,
};

// ─── Tooltip custom ───────────────────────────────────────────────────────────

interface TooltipEntry {
  date: string;
  prix: number;
  varJour: number | null;
}

function CustomTooltip({
  active, payload, prixDevise,
}: {
  active?: boolean;
  payload?: { payload: TooltipEntry }[];
  prixDevise: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const pos = d.varJour != null ? d.varJour >= 0 : true;

  return (
    <div className="bg-white rounded-xl px-4 py-3" style={{ boxShadow: "0 4px 20px rgba(14,52,120,0.14)" }}>
      <p className="text-[#8A9BB0] text-xs mb-1">{d.date}</p>
      <p className="text-[#0C2248] text-sm font-bold tabular-nums">
        {d.prix.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {prixDevise}
      </p>
      {d.varJour != null && (
        <p className={`text-xs font-semibold mt-0.5 ${pos ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
          {pos ? "▲" : "▼"} {Math.abs(d.varJour).toFixed(2)}% vs J-1
        </p>
      )}
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4" style={{ boxShadow: "0 2px 12px rgba(14,52,120,0.07)" }}>
      <p className="text-[#8A9BB0] text-xs font-semibold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[#0C2248] text-lg font-bold tabular-nums leading-tight">{value}</p>
      {sub && <p className="text-[#8A9BB0] text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function StockDetailClient({
  stock,
  chartData,
}: {
  stock: StockDetail;
  chartData: ChartPoint[];
}) {
  const [period, setPeriod] = useState<Period>("1M");

  // Filtre côté client — slice les N derniers points
  const filteredData = useMemo<TooltipEntry[]>(() => {
    const n = PERIOD_POINTS[period];
    const slice = n === Infinity ? chartData : chartData.slice(-n);
    return slice.map((d, i) => {
      const prev = i > 0 ? slice[i - 1].prix : null;
      const varJour = prev != null && prev > 0
        ? Math.round(((d.prix - prev) / prev) * 10000) / 100
        : null;
      return { ...d, varJour };
    });
  }, [chartData, period]);

  const hasData = filteredData.length > 0;
  const prices  = filteredData.map((d) => d.prix);
  const minP    = hasData ? Math.min(...prices) : 0;
  const maxP    = hasData ? Math.max(...prices) : 1;
  const domain: [number, number] = [minP * 0.995, maxP * 1.005];

  // Détermine si le graphique est positif (1er → dernier)
  const chartPositive = hasData
    ? filteredData[filteredData.length - 1].prix >= filteredData[0].prix
    : true;
  const lineColor = chartPositive ? "#22C55E" : "#EF4444";
  const gradId    = chartPositive ? "gradGreen" : "gradRed";

  const pos         = stock.variation >= 0;
  const prixDisplay = stock.prix.toLocaleString("fr-FR", {
    minimumFractionDigits: stock.prix % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  function fmtPrice(v: number | null | undefined): string {
    if (v == null) return "—";
    return `${v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${stock.prixDevise}`;
  }

  function fmtVolume(v: number | null | undefined): string {
    if (v == null) return "—";
    if (v >= 1e9) return `${(v / 1e9).toFixed(2)} Md`;
    if (v >= 1e6) return `${(v / 1e6).toFixed(1)} M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(0)} k`;
    return v.toString();
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC]">

      {/* ── Header sombre ────────────────────────────────────────────────────── */}
      <section className="bg-[#0C2248] pt-20 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Retour */}
          <Link href="/marches"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux marchés
          </Link>

          {/* Identité */}
          <div className="flex items-start gap-4 mb-6">
            <span className="text-4xl leading-none select-none mt-1">{stock.drapeau}</span>
            <div>
              <p className="text-white/40 text-sm font-mono mb-0.5">{stock.ticker}</p>
              <h1
                className="text-3xl sm:text-4xl font-black text-white uppercase leading-tight"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                {stock.nom}
              </h1>
              <p className="text-white/40 text-sm mt-1">{stock.pays} · {stock.indiceNom}</p>
            </div>
          </div>

          {/* Prix + variation */}
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl sm:text-5xl font-black text-white tabular-nums">
              {prixDisplay} {stock.prixDevise}
            </span>
            <span className={`text-xl font-bold tabular-nums ${pos ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {pos ? "▲" : "▼"} {Math.abs(stock.variation).toFixed(2)}%
            </span>
          </div>

          {/* 4 métriques */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Capitalisation", value: stock.capMds > 0 ? `${stock.capMds.toLocaleString("fr-FR")} Mds${stock.currency}` : "—" },
              { label: "Secteur",        value: stock.secteur },
              { label: "Devise",         value: stock.prixDevise },
              { label: "Indice",         value: stock.indiceNom },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.07)" }}>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">{label}</p>
                <p className="text-white text-sm font-bold truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Graphique ─────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl px-5 sm:px-7 pt-6 pb-4" style={{ boxShadow: "0 2px 16px rgba(14,52,120,0.08)" }}>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#0C2248] font-bold text-base">Évolution du cours</h2>
            <div className="flex gap-1 bg-[#F4F7FC] rounded-xl p-1">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                    period === p
                      ? "bg-white text-[#0C2248] shadow-sm"
                      : "text-[#8A9BB0] hover:text-[#1E3A5F]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {hasData ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={filteredData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={lineColor} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F0F7FF" strokeWidth={1} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#8A9BB0", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  orientation="right"
                  domain={domain}
                  tick={{ fill: "#8A9BB0", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
                  width={64}
                />
                <Tooltip
                  content={(props) => (
                    <CustomTooltip
                      active={props.active}
                      payload={props.payload as unknown as { payload: TooltipEntry }[] | undefined}
                      prixDevise={stock.prixDevise}
                    />
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="prix"
                  stroke={lineColor}
                  strokeWidth={2}
                  fill={`url(#${gradId})`}
                  dot={false}
                  activeDot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-[#8A9BB0] text-sm">Données historiques non disponibles.</p>
            </div>
          )}

          <p className="text-[#8A9BB0] text-xs mt-2 text-center">
            Cours de clôture · Yahoo Finance · {filteredData.length} points
          </p>
        </div>

        {/* ── Métriques ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard label="Prix actuel"    value={fmtPrice(stock.prix)} />
          <MetricCard
            label="Variation jour"
            value={`${pos ? "+" : ""}${stock.variation.toFixed(2)}%`}
            sub={stock.previousClose != null ? `Clôture préc. ${fmtPrice(stock.previousClose)}` : undefined}
          />
          <MetricCard label="Plus haut jour" value={fmtPrice(stock.dayHigh)} />
          <MetricCard label="Plus bas jour"  value={fmtPrice(stock.dayLow)} />
          <MetricCard
            label="Capitalisation"
            value={stock.capMds > 0 ? `${stock.capMds.toLocaleString("fr-FR")} Mds${stock.currency}` : "—"}
          />
          <MetricCard label="Volume"         value={fmtVolume(stock.volume)} />
          <MetricCard label="Plus haut 52S"  value={fmtPrice(stock.high52w)} />
          <MetricCard label="Plus bas 52S"   value={fmtPrice(stock.low52w)} />
        </div>

        {/* ── À propos ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl px-6 py-6" style={{ boxShadow: "0 2px 16px rgba(14,52,120,0.08)" }}>
          <h2 className="text-[#0C2248] font-bold text-base mb-4">À propos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {[
              { label: "Ticker",  value: stock.ticker },
              { label: "Secteur", value: stock.secteur },
              { label: "Pays",    value: `${stock.drapeau} ${stock.pays}` },
              { label: "Indice",  value: stock.indiceNom },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[#8A9BB0] text-xs font-semibold uppercase tracking-widest mb-1">{label}</p>
                <p className="text-[#0C2248] text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-[#8A9BB0] text-sm leading-relaxed">
            Cours de clôture journaliers fournis par Yahoo Finance.
            Les données sont actualisées toutes les heures et présentées à titre éducatif uniquement.
            Elles ne constituent pas un conseil en investissement.
          </p>
        </div>

      </div>
    </div>
  );
}
