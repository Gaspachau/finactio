"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { StockRow } from "./MarchesClient";
import { LOGO_MAP, SECTOR_MAP } from "./MarchesClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StockDetail {
  per?:                     number | null;
  dividendeParAction?:      number | null;
  rendementDividende?:      number | null;
  tauxDistribution?:        number | null;
  bpa?:                     number | null;
  margeNette?:              number | null;
  croissanceDividende5ans?: number | null;
  dernierVersement?:        string | null;
  prochainResultats?:       string | null;
  prochainDividende?:       string | null;
  versementDividende?:      string | null;
  volume?:                  number | null;
  exchange?:                string | null;
  marketTime?:              number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FLAG_SUFFIXES: [string, string][] = [
  [".PA", "🇫🇷"], [".DE", "🇩🇪"], [".MI", "🇮🇹"], [".MC", "🇪🇸"],
  [".BR", "🇧🇪"], [".AS", "🇳🇱"], [".L",  "🇬🇧"], [".T",  "🇯🇵"],
];

const EXCHANGE_SUFFIXES: [string, string][] = [
  [".PA", "Euronext Paris"], [".DE", "Xetra"], [".MI", "Borsa Italiana"],
  [".MC", "Bolsa Madrid"],   [".BR", "Euronext Brussels"], [".AS", "Euronext Amsterdam"],
  [".L",  "London SE"],      [".T",  "Tokyo SE"],
];

function flagFromTicker(t: string): string {
  for (const [s, f] of FLAG_SUFFIXES) if (t.endsWith(s)) return f;
  return "🇺🇸";
}

function exchangeFromTicker(t: string): string {
  for (const [s, e] of EXCHANGE_SUFFIXES) if (t.endsWith(s)) return e;
  return "NYSE / Nasdaq";
}

function cleanExchange(raw: string): string {
  return raw
    .replace("NasdaqGS", "Nasdaq").replace("NasdaqCM", "Nasdaq")
    .replace("NYQ", "NYSE").replace("PCX", "NYSE")
    .replace(/^Paris$/, "Euronext Paris").replace(/^Amsterdam$/, "Euronext Amsterdam")
    .replace(/^Brussels$/, "Euronext Brussels").replace(/^Milan$/, "Borsa Italiana");
}

function formatVol(v: number): string {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}Md`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}k`;
  return String(v);
}

function formatDate(d: string | null | undefined): string | null {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  } catch { return null; }
}

const NO_DIV_REASON: Record<string, string> = {
  "Tech":       "préfère réinvestir dans la R&D",
  "Semi":       "préfère réinvestir dans la R&D",
  "Finance":    "renforce ses capitaux propres",
  "Auto":       "finance ses investissements de production",
  "Énergie":    "finance ses investissements d'infrastructure",
  "Santé":      "investit dans la R&D et les essais cliniques",
  "Mode":       "investit dans l'expansion et les acquisitions",
  "Luxe":       "investit dans l'expansion et les acquisitions",
  "Aéro":       "finance le développement de nouveaux programmes",
  "Streaming":  "investit dans la production de contenu",
  "Paiements":  "finance l'expansion de son réseau",
};

// ─── Sous-composants ──────────────────────────────────────────────────────────

function LogoCell({ ticker }: { ticker: string }) {
  const [failed, setFailed] = useState(false);
  const domain = LOGO_MAP[ticker];
  const entry  = SECTOR_MAP[ticker];
  const bg     = entry?.bg    ?? "#E6F1FB";
  const color  = entry?.color ?? "#0C447C";
  const abbr   = ticker.replace(/\.[A-Z]+$/, "").slice(0, 3).toUpperCase();

  return (
    <div style={{
      width: 42, height: 42, borderRadius: 12, background: "#fff",
      padding: 4, display: "flex", alignItems: "center",
      justifyContent: "center", flexShrink: 0, overflow: "hidden",
    }}>
      {domain && !failed ? (
        <img
          src={`https://img.logo.dev/${domain}?token=pk_JcnamDAGQfCv-29I4SMuNg&size=64`}
          width={34} height={34}
          style={{ objectFit: "contain" }}
          onError={() => setFailed(true)}
          alt=""
        />
      ) : (
        <span style={{
          width: "100%", height: "100%", borderRadius: 8,
          background: bg, color, fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          userSelect: "none", letterSpacing: "-0.03em",
        }}>
          {abbr}
        </span>
      )}
    </div>
  );
}

function KpiCard({
  label, value, color, loading,
}: { label: string; value: string; color: string; loading: boolean }) {
  return (
    <div style={{
      background: "#F0F7FF", borderRadius: 10, padding: "10px 8px",
      textAlign: "center", border: "1px solid #DDEAFF",
    }}>
      <p style={{
        color: "#8A9BB0", fontSize: 9, fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, margin: "0 0 4px",
      }}>
        {label}
      </p>
      <p style={{
        color: loading ? "#E2EAF4" : color,
        fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums", margin: 0,
      }}>
        {loading ? "—" : value}
      </p>
    </div>
  );
}

function DivRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "#8A9BB0", fontSize: 11 }}>{label}</span>
      <span style={{ color: "#1E3A5F", fontSize: 11, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

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

  const [detail, setDetail] = useState<StockDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!stock) return;
    setDetail(null);
    setDetailLoading(true);
    fetch(`/api/stock/${encodeURIComponent(stock.ticker)}`)
      .then((r) => r.json())
      .then((d: StockDetail) => setDetail(d))
      .catch(() => {})
      .finally(() => setDetailLoading(false));
  }, [stock?.ticker]);

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

  // ── Dérivations ────────────────────────────────────────────────────────────

  const flag         = flagFromTicker(s.ticker);
  const sectorEntry  = SECTOR_MAP[s.ticker];
  const secteurLabel = sectorEntry?.label ?? s.secteur ?? "—";
  const pos          = (s.variation ?? 0) >= 0;
  const varColor     = pos ? "#22C55E" : "#EF4444";
  const varBg        = pos ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)";
  const devise       = s.prixDevise ?? s.currency ?? "€";
  const prixDisplay  = (s.prix ?? 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
  const absChange = s.prix != null && s.variation != null
    ? Math.abs((s.prix * s.variation) / 100).toFixed(2)
    : null;

  // Ligne exchange / volume / heure
  const exchangeRaw   = detail?.exchange ? cleanExchange(detail.exchange) : exchangeFromTicker(s.ticker);
  const marketTimeFmt = detail?.marketTime
    ? new Date(detail.marketTime * 1000).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : null;
  const metaLine = [
    exchangeRaw,
    detail?.volume ? `Vol. ${formatVol(detail.volume)}` : null,
    marketTimeFmt,
  ].filter(Boolean).join(" · ");

  // KPIs
  const perVal   = detail?.per;
  const rendVal  = detail?.rendementDividende;
  const bpaVal   = detail?.bpa;
  const margeVal = detail?.margeNette;

  function perColor(p: number) {
    if (p > 40) return "#F97316";
    if (p < 15) return "#22C55E";
    return "#1E3A5F";
  }
  function margeColor(m: number) {
    if (m > 0.15) return "#22C55E";
    if (m < 0.05) return "#F97316";
    return "#1E3A5F";
  }

  // Agenda
  const agendaEvents = [
    { date: formatDate(detail?.prochainDividende), label: "Div.",      bgBadge: "rgba(34,197,94,0.12)",  colorBadge: "#16A34A" },
    { date: formatDate(detail?.prochainResultats), label: "Résultats", bgBadge: "rgba(59,130,246,0.12)", colorBadge: "#2563EB" },
    { date: formatDate(detail?.versementDividende),label: "Div.",      bgBadge: "rgba(34,197,94,0.12)",  colorBadge: "#16A34A" },
  ].filter((e) => e.date !== null) as { date: string; label: string; bgBadge: string; colorBadge: string }[];

  // Dividende
  const hasDividende = (detail?.dividendeParAction ?? 0) > 0;

  return (
    <>
      {/* ── Overlay ──────────────────────────────────────────────────────── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.35)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 300ms",
        }}
      />

      {/* ── Panneau ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
          width: "100%", maxWidth: 440,
          background: "#fff",
          boxShadow: "-4px 0 40px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms ease",
        }}
      >
        {/* ── Header #0A1628 ──────────────────────────────────────────── */}
        <div style={{ background: "#0A1628", padding: "22px 20px 18px", flexShrink: 0 }}>

          {/* Ligne 1 : logo + nom + ×  */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
            <LogoCell ticker={s.ticker} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 3px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {s.nom}
              </p>
              <p style={{ color: "#5A7A9A", fontSize: 11, margin: 0 }}>
                {s.ticker} · {flag} · {secteurLabel}
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Fermer"
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 16, lineHeight: 1, marginTop: 2,
              }}
            >
              ×
            </button>
          </div>

          {/* Ligne 2 : prix + cap pill */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
            <p style={{ color: "#fff", fontSize: 32, fontWeight: 900, margin: 0, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {prixDisplay}&thinsp;<span style={{ fontSize: 17 }}>{devise}</span>
            </p>
            {s.capMds > 0 && (
              <span style={{
                background: "rgba(255,255,255,0.06)", color: "#8AABCC",
                fontSize: 11, fontWeight: 600, padding: "4px 10px",
                borderRadius: 20, whiteSpace: "nowrap", lineHeight: 1,
              }}>
                {s.capMds.toLocaleString("fr-FR")} Mds{s.currency}
              </span>
            )}
          </div>

          {/* Ligne 3 : badge variation */}
          {s.variation != null && (
            <div style={{ marginBottom: 8 }}>
              <span style={{
                background: varBg, color: varColor,
                fontSize: 12, fontWeight: 700, padding: "4px 10px",
                borderRadius: 20, fontVariantNumeric: "tabular-nums",
                display: "inline-block",
              }}>
                {pos ? "▲" : "▼"} {pos ? "+" : ""}{s.variation.toFixed(2)}%
                {absChange ? ` · ${pos ? "+" : "−"}${absChange} ${devise}` : ""}
              </span>
            </div>
          )}

          {/* Ligne 4 : exchange · vol · heure */}
          <p style={{ color: "#4A6A8A", fontSize: 9, margin: 0, letterSpacing: "0.03em" }}>
            {metaLine}
          </p>
        </div>

        {/* ── Corps scrollable ──────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0" }}>

          {/* KPIs */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: "#8A9BB0", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
              Fondamentaux
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              <KpiCard
                label="PER"
                value={perVal != null ? `${perVal.toFixed(1)}×` : "—"}
                color={perVal != null ? perColor(perVal) : "#C5D0DC"}
                loading={detailLoading}
              />
              <KpiCard
                label="Rendement"
                value={rendVal != null && rendVal > 0 ? `${(rendVal * 100).toFixed(2)}%` : "—"}
                color={rendVal != null && rendVal > 0 ? "#22C55E" : "#C5D0DC"}
                loading={detailLoading}
              />
              <KpiCard
                label="BPA"
                value={bpaVal != null ? `${bpaVal.toFixed(2)} ${devise}` : "—"}
                color={bpaVal != null ? "#1E3A5F" : "#C5D0DC"}
                loading={detailLoading}
              />
              <KpiCard
                label="Marge nette"
                value={margeVal != null ? `${(margeVal * 100).toFixed(1)}%` : "—"}
                color={margeVal != null ? margeColor(margeVal) : "#C5D0DC"}
                loading={detailLoading}
              />
            </div>
          </div>

          {/* Dividende */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: "#8A9BB0", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
              Dividende
            </p>
            {detailLoading ? (
              <div style={{ background: "#F8FAFD", borderRadius: 12, padding: 16, minHeight: 72, border: "1px solid #EEF2F7" }} />
            ) : hasDividende ? (
              <div style={{ background: "#F0F7FF", borderRadius: 12, padding: 14, border: "1px solid #DDEAFF" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <span style={{ color: "#0C2248", fontSize: 18, fontWeight: 800 }}>
                      {detail!.dividendeParAction!.toFixed(2)} {devise}
                    </span>
                    <span style={{ color: "#8A9BB0", fontSize: 11, marginLeft: 6 }}>/ action · annuel</span>
                  </div>
                  {rendVal != null && rendVal > 0 && (
                    <span style={{
                      background: "rgba(34,197,94,0.12)", color: "#16A34A",
                      fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                    }}>
                      {(rendVal * 100).toFixed(2)}%
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {detail!.dernierVersement && (
                    <DivRow label="Dernier ex-dividende" value={formatDate(detail!.dernierVersement) ?? "—"} />
                  )}
                  {detail!.tauxDistribution != null && (
                    <DivRow label="Taux de distribution" value={`${(detail!.tauxDistribution * 100).toFixed(1)}%`} />
                  )}
                  {detail!.croissanceDividende5ans != null && (
                    <DivRow label="Croissance 5 ans (moy.)" value={`${detail!.croissanceDividende5ans.toFixed(2)}%`} />
                  )}
                </div>
              </div>
            ) : (
              <div style={{ background: "#F8FAFD", borderRadius: 12, padding: 14, border: "1px solid #EEF2F7" }}>
                <p style={{ color: "#1E3A5F", fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>
                  Aucun dividende versé
                </p>
                <p style={{ color: "#8A9BB0", fontSize: 11, margin: 0 }}>
                  {s.nom} {NO_DIV_REASON[secteurLabel] ?? "suit une politique de croissance"}.
                </p>
              </div>
            )}
          </div>

          {/* Agenda */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: "#8A9BB0", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
              Agenda
            </p>
            {detailLoading ? (
              <div style={{ background: "#F8FAFD", borderRadius: 12, padding: 16, minHeight: 50, border: "1px solid #EEF2F7" }} />
            ) : agendaEvents.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {agendaEvents.map((ev, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#F8FAFD", borderRadius: 10, padding: "10px 14px",
                    border: "1px solid #EEF2F7",
                  }}>
                    <span style={{ color: "#1E3A5F", fontSize: 12, fontWeight: 600 }}>{ev.date}</span>
                    <span style={{
                      background: ev.bgBadge, color: ev.colorBadge,
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                    }}>
                      {ev.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: "#F8FAFD", borderRadius: 12, padding: 14,
                border: "1px solid #EEF2F7", textAlign: "center",
              }}>
                <p style={{ color: "#C5D0DC", fontSize: 12, margin: 0 }}>Aucun événement prévu</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer CTA ──────────────────────────────────────────────── */}
        <div style={{ padding: "14px 20px 18px", borderTop: "1px solid #F0F7FF", background: "#fff", flexShrink: 0 }}>
          <Link
            href={`/marches/${encodeURIComponent(s.ticker)}`}
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#0C2248", color: "#fff",
              fontWeight: 600, padding: "12px 0", borderRadius: 12,
              textDecoration: "none", fontSize: 13,
            }}
          >
            Voir la fiche complète
            <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
