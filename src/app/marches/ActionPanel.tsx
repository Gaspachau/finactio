"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip,
} from "recharts";
import type { StockRow } from "./MarchesClient";
import { LOGO_MAP } from "./MarchesClient";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countryFromTicker(ticker: string): { pays: string; drapeau: string } {
  if (ticker.endsWith(".PA")) return { pays: "France",       drapeau: "🇫🇷" };
  if (ticker.endsWith(".DE")) return { pays: "Allemagne",    drapeau: "🇩🇪" };
  if (ticker.endsWith(".MI")) return { pays: "Italie",       drapeau: "🇮🇹" };
  if (ticker.endsWith(".MC")) return { pays: "Espagne",      drapeau: "🇪🇸" };
  if (ticker.endsWith(".BR")) return { pays: "Belgique",     drapeau: "🇧🇪" };
  if (ticker.endsWith(".AS")) return { pays: "Pays-Bas",     drapeau: "🇳🇱" };
  if (ticker.endsWith(".L"))  return { pays: "Royaume-Uni",  drapeau: "🇬🇧" };
  if (ticker.endsWith(".T"))  return { pays: "Japon",        drapeau: "🇯🇵" };
  return                             { pays: "États-Unis",   drapeau: "🇺🇸" };
}

// Pseudo-random déterministe (LCG) — résultat stable pour un ticker donné
function tickerSeed(ticker: string): number {
  return ticker.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7) >>> 0;
}

function generateSparkline(
  prix: number,
  variation: number,
  seed: number,
): { prix: number }[] {
  const N   = 30;
  const vol = Math.max(Math.abs(variation) * 0.6, 0.8);
  const prices: number[] = [prix];
  let rng = seed;

  for (let i = 1; i < N; i++) {
    rng = ((rng * 1664525 + 1013904223) | 0) >>> 0;
    const rand = rng / 0xffffffff - 0.5;
    const prev = prices[0] / (1 + (rand * vol) / 100);
    prices.unshift(Math.max(0.01, Math.round(prev * 100) / 100));
  }

  return prices.map((p) => ({ prix: p }));
}

// ─── Composant ────────────────────────────────────────────────────────────────

export default function ActionPanel({
  stock,
  onClose,
}: {
  stock: StockRow | null;
  onClose: () => void;
}) {
  const open = stock !== null;

  // Garde le dernier stock connu pour l'animation de fermeture
  const lastRef = useRef<StockRow | null>(null);
  if (stock !== null) lastRef.current = stock;
  const s = stock ?? lastRef.current;

  // Fermeture au clavier
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  // Bloque le scroll du body
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!s) return null;

  const { pays, drapeau } = countryFromTicker(s.ticker);
  const pos        = (s.variation ?? 0) >= 0;
  const lineColor  = pos ? "#22C55E" : "#EF4444";
  const sparkData  = generateSparkline(
    s.prix ?? 100,
    s.variation ?? 0,
    tickerSeed(s.ticker),
  );
  const prixDisplay = (s.prix ?? 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const gradId = `spk-${s.ticker.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <>
      {/* ── Overlay ──────────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />

      {/* ── Panneau latéral ──────────────────────────────────────────────────── */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header sombre */}
        <div className="bg-[#0C2248] px-6 pt-8 pb-6 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-3xl select-none shrink-0">{drapeau}</span>
              {LOGO_MAP[s.ticker] && (
                <img
                  src={`https://img.logo.dev/${LOGO_MAP[s.ticker]}?token=pk_X-1ZO13GSgeOoUrIuJ1B6A&size=64`}
                  width={44} height={44}
                  style={{ borderRadius: "10px", objectFit: "contain", flexShrink: 0, background: "#fff" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                  alt=""
                />
              )}
              <div className="min-w-0">
                <p className="text-white/40 text-xs font-mono mb-0.5">{s.ticker}</p>
                <h2
                  className="text-white font-black text-xl uppercase leading-tight truncate"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  {s.nom}
                </h2>
                <p className="text-white/40 text-xs mt-0.5">{pays}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors ml-4 mt-1 shrink-0"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Prix + variation */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl sm:text-4xl font-black text-white tabular-nums">
              {prixDisplay} {s.prixDevise ?? s.currency}
            </span>
            <span className={`text-base font-bold tabular-nums ${pos ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {pos ? "▲" : "▼"} {Math.abs(s.variation ?? 0).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Corps scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* 4 métriques */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Capitalisation",
                value: s.capMds > 0
                  ? `${s.capMds.toLocaleString("fr-FR")} Mds${s.currency}`
                  : "—",
              },
              { label: "Secteur",      value: s.secteur || "—" },
              {
                label: "Variation 1j",
                value: s.variation != null
                  ? `${s.variation >= 0 ? "+" : ""}${s.variation.toFixed(2)}%`
                  : "—",
              },
              { label: "Pays",         value: `${drapeau} ${pays}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#F4F7FC] rounded-xl px-4 py-3">
                <p className="text-[#8A9BB0] text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-[#0C2248] text-sm font-bold truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Mini sparkline */}
          <div>
            <p className="text-[#8A9BB0] text-xs font-semibold uppercase tracking-wider mb-2">
              Cours · 30 derniers jours
            </p>
            <div className="bg-[#F4F7FC] rounded-xl overflow-hidden">
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={sparkData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={lineColor} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const v = payload[0].value as number;
                      return (
                        <div className="bg-white rounded-lg px-2 py-1 shadow-md text-xs font-bold text-[#0C2248]">
                          {v.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {s.prixDevise ?? s.currency}
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="prix"
                    stroke={lineColor}
                    strokeWidth={1.5}
                    fill={`url(#${gradId})`}
                    dot={false}
                    activeDot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[#C5D0DC] text-xs mt-1.5 text-center">
              Données simulées · à titre illustratif uniquement
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-[#F0F7FF] bg-white flex-shrink-0">
          <Link
            href={`/marches/${encodeURIComponent(s.ticker)}`}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-[#0C2248] hover:bg-[#1E3A5F] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Voir la fiche complète
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
