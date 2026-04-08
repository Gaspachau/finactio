"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  high52w?: number | null;
  low52w?: number | null;
  previousClose?: number | null;
}

// ─── Périodes ─────────────────────────────────────────────────────────────────

type Period = "1S" | "1M" | "3M" | "6M" | "1A";

const PERIODS: Period[] = ["1S", "1M", "3M", "6M", "1A"];

const PERIOD_CONFIG: Record<Period, { points: number; unit: "day" | "week" | "month"; label: string }> = {
  "1S": { points: 7,  unit: "day",   label: "1 semaine" },
  "1M": { points: 22, unit: "day",   label: "1 mois" },
  "3M": { points: 13, unit: "week",  label: "3 mois" },
  "6M": { points: 26, unit: "week",  label: "6 mois" },
  "1A": { points: 52, unit: "week",  label: "1 an" },
};

// ─── Générateur de données simulées (seeded, reproductible) ──────────────────

function seededRng(seed: number) {
  let s = (seed * 1664525 + 1013904223) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function generateHistory(
  currentPrice: number,
  ticker: string,
  points: number,
  unit: "day" | "week" | "month"
): { date: string; prix: number }[] {
  const seed = ticker.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = seededRng(seed + points);
  const volatility = unit === "day" ? 0.012 : unit === "week" ? 0.025 : 0.04;

  // Génère des prix en remontant depuis aujourd'hui
  const prices: number[] = [currentPrice];
  for (let i = 1; i < points; i++) {
    const drift = (rand() - 0.485) * volatility * 2;
    prices.unshift(prices[0] * (1 - drift));
  }

  // Génère les dates correspondantes
  const now = new Date();
  const msPerUnit = unit === "day" ? 86400000 : unit === "week" ? 7 * 86400000 : 30 * 86400000;

  return prices.map((p, i) => {
    const d = new Date(now.getTime() - (points - 1 - i) * msPerUnit);
    const label = unit === "day"
      ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
      : unit === "week"
        ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
        : d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    return { date: label, prix: Math.round(p * 100) / 100 };
  });
}

// ─── Tooltip custom ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, prixDevise }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  prixDevise: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl px-4 py-3" style={{ boxShadow: "0 4px 20px rgba(14,52,120,0.14)" }}>
      <p className="text-[#8A9BB0] text-xs mb-1">{label}</p>
      <p className="text-[#0C2248] text-sm font-bold tabular-nums">
        {payload[0].value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {prixDevise}
      </p>
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

export default function StockDetailClient({ stock }: { stock: StockDetail }) {
  const [period, setPeriod] = useState<Period>("1M");

  const { points, unit } = PERIOD_CONFIG[period];
  const chartData = useMemo(
    () => generateHistory(stock.prix, stock.ticker, points, unit),
    [stock.prix, stock.ticker, points, unit]
  );

  const chartMin = Math.min(...chartData.map((d) => d.prix));
  const chartMax = Math.max(...chartData.map((d) => d.prix));
  const domain: [number, number] = [chartMin * 0.995, chartMax * 1.005];

  const pos = stock.variation >= 0;
  const prixDisplay = stock.prix % 1 === 0
    ? stock.prix.toLocaleString("fr-FR")
    : stock.prix.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function fmtPrice(v: number | null | undefined): string {
    if (v == null) return "—";
    return `${v % 1 === 0 ? v.toLocaleString("fr-FR") : v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${stock.prixDevise}`;
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

          {/* Back */}
          <Link href="/marches"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux marchés
          </Link>

          {/* Drapeau + identité */}
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

          {/* Filtres de période */}
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

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E80CE" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#2E80CE" stopOpacity={0} />
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
                width={60}
              />
              <Tooltip
                content={(props) => (
                  <CustomTooltip
                    active={props.active}
                    payload={props.payload as unknown as { value: number }[] | undefined}
                    label={props.label as string}
                    prixDevise={stock.prixDevise}
                  />
                )}
              />
              <Area
                type="monotone"
                dataKey="prix"
                stroke="#2E80CE"
                strokeWidth={2}
                fill="url(#areaGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#2E80CE", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>

          <p className="text-[#8A9BB0] text-xs mt-2 text-center">
            Données simulées à titre indicatif · non contractuelles
          </p>
        </div>

        {/* ── Métriques ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Prix actuel"
            value={fmtPrice(stock.prix)}
          />
          <MetricCard
            label="Variation jour"
            value={`${pos ? "+" : ""}${stock.variation.toFixed(2)}%`}
            sub={stock.previousClose != null ? `Clôture préc. ${fmtPrice(stock.previousClose)}` : undefined}
          />
          <MetricCard
            label="Capitalisation"
            value={stock.capMds > 0 ? `${stock.capMds.toLocaleString("fr-FR")} Mds${stock.currency}` : "—"}
          />
          <MetricCard
            label="Volume"
            value={fmtVolume(stock.volume)}
          />
          <MetricCard
            label="Plus haut 52S"
            value={fmtPrice(stock.high52w)}
          />
          <MetricCard
            label="Plus bas 52S"
            value={fmtPrice(stock.low52w)}
          />
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
            Les données affichées sont fournies par Yahoo Finance et actualisées quotidiennement.
            Elles sont présentées à titre éducatif uniquement et ne constituent pas un conseil en investissement.
            Le graphique d&apos;évolution est une simulation indicative basée sur le prix et la volatilité observés.
          </p>
        </div>

      </div>
    </div>
  );
}
