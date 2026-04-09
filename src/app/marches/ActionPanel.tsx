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

  const lastRef = useRef<StockRow | null>(null);
  if (stock !== null) lastRef.current = stock;
  const s = stock ?? lastRef.current;

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

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
      {/* ── Overlay ────────────────────────────────────────────────────────── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 300ms",
        }}
      />

      {/* ── Panneau latéral ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          boxShadow: "-4px 0 40px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header sombre */}
        <div
          style={{
            background: "#0C2248",
            padding: "32px 24px 24px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <span style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>{drapeau}</span>
              {LOGO_MAP[s.ticker] && (
                <img
                  src={`https://img.logo.dev/${LOGO_MAP[s.ticker]}?token=pk_JcnamDAGQfCv-29I4SMuNg&size=96`}
                  width={56} height={56}
                  style={{
                    borderRadius: 14,
                    objectFit: "contain",
                    flexShrink: 0,
                    background: "#fff",
                    padding: 3,
                    border: "0.5px solid rgba(255,255,255,0.15)",
                  }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  alt=""
                />
              )}
              <div style={{ minWidth: 0 }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "monospace", marginBottom: 2 }}>
                  {s.ticker}
                </p>
                <h2
                  style={{
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 20,
                    textTransform: "uppercase",
                    lineHeight: 1.2,
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.nom}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>{pays}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Fermer"
              style={{
                color: "rgba(255,255,255,0.4)",
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: 16,
                marginTop: 4,
                flexShrink: 0,
                padding: 0,
                lineHeight: 1,
              }}
            >
              <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Prix + variation */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
              {prixDisplay} {s.prixDevise ?? s.currency}
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: lineColor }}>
              {pos ? "▲" : "▼"} {Math.abs(s.variation ?? 0).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Corps scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* 4 métriques */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
              <div key={label} style={{ background: "#F4F7FC", borderRadius: 12, padding: "12px 16px" }}>
                <p style={{ color: "#8A9BB0", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                  {label}
                </p>
                <p style={{ color: "#0C2248", fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Mini sparkline */}
          <div>
            <p style={{ color: "#8A9BB0", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Cours · 30 derniers jours
            </p>
            <div style={{ background: "#F4F7FC", borderRadius: 12, overflow: "hidden" }}>
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
                        <div style={{ background: "#fff", borderRadius: 8, padding: "4px 8px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", fontSize: 11, fontWeight: 700, color: "#0C2248" }}>
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
            <p style={{ color: "#C5D0DC", fontSize: 11, marginTop: 6, textAlign: "center" }}>
              Données simulées · à titre illustratif uniquement
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #F0F7FF",
            background: "#fff",
            flexShrink: 0,
          }}
        >
          <Link
            href={`/marches/${encodeURIComponent(s.ticker)}`}
            onClick={onClose}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "#0C2248",
              color: "#fff",
              fontWeight: 600,
              padding: "12px 0",
              borderRadius: 12,
              textDecoration: "none",
              fontSize: 14,
              transition: "background 150ms",
            }}
          >
            Voir la fiche complète
            <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
