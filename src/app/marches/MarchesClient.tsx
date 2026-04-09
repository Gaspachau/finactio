"use client";

import { useState, useEffect, useRef } from "react";
import ActionPanel from "./ActionPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StockRow {
  rang: number;
  nom: string;
  ticker: string;
  secteur: string;
  capMds: number;
  variation: number | null;
  currency: string;
  slug: string;
  prix?: number | null;
  prixDevise?: string;
}

export interface IndiceData {
  id: string;
  nom: string;
  pays: string;
  drapeau: string;
  region: "europe" | "ameriques" | "asie";
  description: string;
  stocks: StockRow[];
  indexVariation?: number | null;
}

// ─── SECTOR_MAP ticker → badge ────────────────────────────────────────────────

const SECTOR_MAP: Record<string, { label: string; bg: string; color: string }> = {
  "MC.PA":   { label: "Luxe",       bg: "#EEEDFE", color: "#3C3489" },
  "OR.PA":   { label: "Consomm.",   bg: "#E1F5EE", color: "#085041" },
  "RMS.PA":  { label: "Luxe",       bg: "#EEEDFE", color: "#3C3489" },
  "TTE.PA":  { label: "Énergie",    bg: "#FAEEDA", color: "#633806" },
  "SU.PA":   { label: "Industrie",  bg: "#E6F1FB", color: "#0C447C" },
  "AIR.PA":  { label: "Aéro",       bg: "#E6F1FB", color: "#0C447C" },
  "SAF.PA":  { label: "Aéro",       bg: "#E6F1FB", color: "#0C447C" },
  "AI.PA":   { label: "Chimie",     bg: "#E1F5EE", color: "#085041" },
  "BNP.PA":  { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "SAN.PA":  { label: "Santé",      bg: "#E1F5EE", color: "#085041" },
  "CS.PA":   { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "SG.PA":   { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "ACA.PA":  { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "BN.PA":   { label: "Alim.",      bg: "#E1F5EE", color: "#085041" },
  "KER.PA":  { label: "Luxe",       bg: "#EEEDFE", color: "#3C3489" },
  "RI.PA":   { label: "Boissons",   bg: "#FAEEDA", color: "#633806" },
  "DSY.PA":  { label: "Tech",       bg: "#E6F1FB", color: "#0C447C" },
  "CAP.PA":  { label: "Tech",       bg: "#E6F1FB", color: "#0C447C" },
  "VIE.PA":  { label: "Services",   bg: "#E6F1FB", color: "#0C447C" },
  "ORA.PA":  { label: "Télécom",    bg: "#FAECE7", color: "#712B13" },
  "ENGI.PA": { label: "Énergie",    bg: "#FAEEDA", color: "#633806" },
  "DG.PA":   { label: "Luxe",       bg: "#EEEDFE", color: "#3C3489" },
  "PUB.PA":  { label: "Média",      bg: "#FAECE7", color: "#712B13" },
  "SAP.DE":  { label: "Tech",       bg: "#E6F1FB", color: "#0C447C" },
  "SIE.DE":  { label: "Industrie",  bg: "#E6F1FB", color: "#0C447C" },
  "ALV.DE":  { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "DTE.DE":  { label: "Télécom",    bg: "#FAECE7", color: "#712B13" },
  "MBG.DE":  { label: "Auto",       bg: "#FAEEDA", color: "#633806" },
  "BMW.DE":  { label: "Auto",       bg: "#FAEEDA", color: "#633806" },
  "BAS.DE":  { label: "Chimie",     bg: "#E1F5EE", color: "#085041" },
  "VOW3.DE": { label: "Auto",       bg: "#FAEEDA", color: "#633806" },
  "IFX.DE":  { label: "Semi",       bg: "#E6F1FB", color: "#0C447C" },
  "BAYN.DE": { label: "Santé",      bg: "#E1F5EE", color: "#085041" },
  "AAPL":    { label: "Tech",       bg: "#E6F1FB", color: "#0C447C" },
  "MSFT":    { label: "Tech",       bg: "#E6F1FB", color: "#0C447C" },
  "NVDA":    { label: "Semi",       bg: "#E6F1FB", color: "#0C447C" },
  "AMZN":    { label: "E-com",      bg: "#FAEEDA", color: "#633806" },
  "GOOGL":   { label: "Tech",       bg: "#E6F1FB", color: "#0C447C" },
  "META":    { label: "Tech",       bg: "#E6F1FB", color: "#0C447C" },
  "BRK-B":   { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "LLY":     { label: "Santé",      bg: "#E1F5EE", color: "#085041" },
  "TSLA":    { label: "Auto",       bg: "#FAEEDA", color: "#633806" },
  "AVGO":    { label: "Semi",       bg: "#E6F1FB", color: "#0C447C" },
  "JPM":     { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "NFLX":    { label: "Streaming",  bg: "#FAECE7", color: "#712B13" },
  "COST":    { label: "Distrib.",   bg: "#E1F5EE", color: "#085041" },
  "ENEL.MI": { label: "Énergie",    bg: "#FAEEDA", color: "#633806" },
  "UCG.MI":  { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "ISP.MI":  { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "RACE.MI": { label: "Auto",       bg: "#FAEEDA", color: "#633806" },
  "ENI.MI":  { label: "Énergie",    bg: "#FAEEDA", color: "#633806" },
  "STM.MI":  { label: "Semi",       bg: "#E6F1FB", color: "#0C447C" },
  "ITX.MC":  { label: "Mode",       bg: "#EEEDFE", color: "#3C3489" },
  "SAN.MC":  { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "BBVA.MC": { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "IBE.MC":  { label: "Énergie",    bg: "#FAEEDA", color: "#633806" },
  "ABI.BR":  { label: "Boissons",   bg: "#FAEEDA", color: "#633806" },
  "UCB.BR":  { label: "Santé",      bg: "#E1F5EE", color: "#085041" },
  "KBC.BR":  { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "ASML.AS": { label: "Semi",       bg: "#E6F1FB", color: "#0C447C" },
  "SHEL.AS": { label: "Énergie",    bg: "#FAEEDA", color: "#633806" },
  "INGA.AS": { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "SHEL.L":  { label: "Énergie",    bg: "#FAEEDA", color: "#633806" },
  "AZN.L":   { label: "Santé",      bg: "#E1F5EE", color: "#085041" },
  "HSBA.L":  { label: "Finance",    bg: "#EEEDFE", color: "#3C3489" },
  "RR.L":    { label: "Aéro",       bg: "#E6F1FB", color: "#0C447C" },
  "7203.T":  { label: "Auto",       bg: "#FAEEDA", color: "#633806" },
  "6758.T":  { label: "Tech",       bg: "#E6F1FB", color: "#0C447C" },
  "9984.T":  { label: "Tech",       bg: "#E6F1FB", color: "#0C447C" },
  "6861.T":  { label: "Industrie",  bg: "#E6F1FB", color: "#0C447C" },
  "7267.T":  { label: "Auto",       bg: "#FAEEDA", color: "#633806" },
};

// ─── LOGO_MAP ticker → domaine Logo.dev ──────────────────────────────────────

export const LOGO_MAP: Record<string, string> = {
  "MC.PA":   "lvmh.com",           "OR.PA":   "loreal.com",          "RMS.PA":  "hermes.com",
  "TTE.PA":  "totalenergies.com",  "SU.PA":   "se.com",              "AIR.PA":  "airbus.com",
  "SAF.PA":  "safran-group.com",   "AI.PA":   "airliquide.com",      "BNP.PA":  "bnpparibas.com",
  "SAN.PA":  "sanofi.com",         "CS.PA":   "axaim.com",           "SG.PA":   "societegenerale.com",
  "ACA.PA":  "credit-agricole.com","BN.PA":   "danone.com",          "KER.PA":  "kering.com",
  "RI.PA":   "pernod-ricard.com",  "DSY.PA":  "dassault-systemes.com","CAP.PA": "capgemini.com",
  "ORA.PA":  "orange.com",         "ENGI.PA": "engie.com",           "ML.PA":   "michelin.com",
  "DG.PA":   "vinci.com",          "PUB.PA":  "publicis.com",        "LR.PA":   "legrand.com",
  "SW.PA":   "sodexo.com",         "TEP.PA":  "teleperformance.com", "ERF.PA":  "eurofins.com",
  "WLN.PA":  "worldline.com",      "ATO.PA":  "atos.net",            "HO.PA":   "thalesgroup.com",
  "SAP.DE":  "sap.com",            "SIE.DE":  "siemens.com",         "ALV.DE":  "allianz.com",
  "DTE.DE":  "telekom.com",        "MBG.DE":  "mercedes-benz.com",   "BMW.DE":  "bmw.com",
  "BAS.DE":  "basf.com",           "VOW3.DE": "volkswagen.com",      "IFX.DE":  "infineon.com",
  "BAYN.DE": "bayer.com",          "MRK.DE":  "merckgroup.com",      "DB1.DE":  "deutsche-boerse.com",
  "HEN3.DE": "henkel.com",         "RWE.DE":  "rwe.com",             "ADS.DE":  "adidas.com",
  "AAPL":    "apple.com",          "MSFT":    "microsoft.com",       "NVDA":    "nvidia.com",
  "AMZN":    "amazon.com",         "GOOGL":   "google.com",          "META":    "meta.com",
  "BRK-B":   "berkshirehathaway.com","LLY":   "lilly.com",           "TSLA":    "tesla.com",
  "AVGO":    "broadcom.com",       "JPM":     "jpmorganchase.com",   "UNH":     "unitedhealthgroup.com",
  "XOM":     "exxonmobil.com",     "V":       "visa.com",            "MA":      "mastercard.com",
  "PG":      "pg.com",             "HD":      "homedepot.com",       "COST":    "costco.com",
  "MRK":     "merck.com",          "ABBV":    "abbvie.com",          "CVX":     "chevron.com",
  "CRM":     "salesforce.com",     "BAC":     "bankofamerica.com",   "NFLX":    "netflix.com",
  "KO":      "coca-cola.com",      "PEP":     "pepsico.com",         "TMO":     "thermofisher.com",
  "ORCL":    "oracle.com",         "ACN":     "accenture.com",       "MCD":     "mcdonalds.com",
  "CSCO":    "cisco.com",          "ABT":     "abbott.com",          "WMT":     "walmart.com",
  "NKE":     "nike.com",           "ADBE":    "adobe.com",           "TXN":     "ti.com",
  "ENEL.MI": "enel.com",           "UCG.MI":  "unicredit.eu",        "ISP.MI":  "intesasanpaolo.com",
  "RACE.MI": "ferrari.com",        "ENI.MI":  "eni.com",             "STM.MI":  "st.com",
  "LDO.MI":  "leonardocompany.com","STLA.MI": "stellantis.com",
  "ITX.MC":  "inditex.com",        "SAN.MC":  "santander.com",       "BBVA.MC": "bbva.com",
  "IBE.MC":  "iberdrola.com",      "TEF.MC":  "telefonica.com",      "REP.MC":  "repsol.com",
  "ABI.BR":  "ab-inbev.com",       "UCB.BR":  "ucb.com",             "KBC.BR":  "kbc.com",
  "ASML.AS": "asml.com",           "INGA.AS": "ing.com",             "HEIA.AS": "heineken.com",
  "PHIA.AS": "philips.com",        "ADYEN.AS":"adyen.com",
  "SHEL.L":  "shell.com",          "AZN.L":   "astrazeneca.com",     "HSBA.L":  "hsbc.com",
  "ULVR.L":  "unilever.com",       "BP.L":    "bp.com",              "RIO.L":   "riotinto.com",
  "GSK.L":   "gsk.com",            "BHP.L":   "bhp.com",             "DGE.L":   "diageo.com",
  "RR.L":    "rolls-royce.com",
  "7203.T":  "toyota.com",         "6758.T":  "sony.com",            "9984.T":  "softbank.jp",
  "6861.T":  "keyence.com",        "7267.T":  "honda.com",           "4063.T":  "shinetsu.co.jp",
  "6954.T":  "fanuc.co.jp",        "9983.T":  "fastretailing.com",   "8306.T":  "mufg.jp",
};

// ─── Fallback secteur (Tailwind classes) ──────────────────────────────────────

const SECTEUR_COLORS: Record<string, string> = {
  "Technologie":        "bg-blue-50 text-blue-700",
  "Semi-conducteurs":   "bg-violet-50 text-violet-700",
  "Énergie":            "bg-orange-50 text-orange-700",
  "Santé":              "bg-green-50 text-green-700",
  "Luxe":               "bg-purple-50 text-purple-700",
  "Finance":            "bg-cyan-50 text-cyan-700",
  "Industrie":          "bg-gray-100 text-gray-600",
  "Automobile":         "bg-gray-50 text-gray-600",
  "Distribution":       "bg-amber-50 text-amber-700",
  "Aéronautique":       "bg-indigo-50 text-indigo-700",
  "Chimie":             "bg-teal-50 text-teal-700",
  "Consommation":       "bg-amber-50 text-amber-700",
  "Streaming":          "bg-red-50 text-red-700",
  "Services":           "bg-slate-50 text-slate-600",
  "Mode":               "bg-pink-50 text-pink-700",
  "Mines":              "bg-stone-50 text-stone-700",
  "Boissons":           "bg-lime-50 text-lime-700",
  "E-commerce":         "bg-orange-50 text-orange-700",
  "Réseaux sociaux":    "bg-sky-50 text-sky-700",
  "Assurance":          "bg-cyan-50 text-cyan-700",
  "Télécommunications": "bg-sky-50 text-sky-700",
  "Immobilier":         "bg-rose-50 text-rose-700",
};

function SectorBadge({ ticker, secteur }: { ticker: string; secteur: string }) {
  const entry = SECTOR_MAP[ticker];
  if (entry) {
    return (
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap"
        style={{ background: entry.bg, color: entry.color }}
      >
        {entry.label}
      </span>
    );
  }
  const cls = SECTEUR_COLORS[secteur];
  if (cls) {
    return (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${cls}`}>
        {secteur.length > 10 ? secteur.slice(0, 9) + "." : secteur}
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
      Autre
    </span>
  );
}

// ─── Filtres région ───────────────────────────────────────────────────────────

type Region = "tous" | "europe" | "ameriques" | "asie";

const FILTRES: { id: Region; label: string }[] = [
  { id: "tous",      label: "Tous" },
  { id: "europe",    label: "Europe" },
  { id: "ameriques", label: "Amériques" },
  { id: "asie",      label: "Asie" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

function sparklineColor(v: number | null): string {
  if (v === null) return "#D1D5DB";
  return v >= 0 ? "#22C55E" : "#EF4444";
}

// ─── VariationBadge ───────────────────────────────────────────────────────────

function VariationBadge({ v, size = "md" }: { v: number | null; size?: "sm" | "md" }) {
  if (v === null) return <span className="text-gray-300 text-sm">—</span>;
  const pos = v >= 0;
  const sz = size === "sm" ? "text-xs" : "text-sm";
  return (
    <span className={`inline-flex items-center gap-0.5 font-bold tabular-nums ${sz} ${pos ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
      {pos ? "▲" : "▼"} {Math.abs(v).toFixed(2)}%
    </span>
  );
}

// ─── IndiceCard ───────────────────────────────────────────────────────────────

function IndiceCard({
  indice,
  selected,
  loading,
  onClick,
}: {
  indice: IndiceData;
  selected: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  const validVar = indice.stocks.map((s) => s.variation).filter((v): v is number => v !== null);
  const avgPerf  = validVar.length > 0 ? validVar.reduce((a, b) => a + b, 0) / validVar.length : null;
  const displayPerf = indice.indexVariation ?? avgPerf;
  const pos = displayPerf !== null ? displayPerf >= 0 : true;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 px-4 py-4 transition-all duration-150 ${
        selected
          ? "border-[#185FA5] bg-[#EBF3FF]"
          : "border-[#E2EAF4] bg-white hover:border-[#BDD3F0]"
      }`}
      style={{
        boxShadow: selected
          ? "0 4px 20px rgba(24,95,165,0.15)"
          : "0 2px 8px rgba(14,52,120,0.05)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl select-none leading-none">{indice.drapeau}</span>
        <div className="flex items-center gap-1.5">
          {loading && (
            <span className="w-3 h-3 rounded-full border-2 border-[#185FA5] border-t-transparent animate-spin inline-block" />
          )}
          {displayPerf !== null && (
            <span className={`text-xs font-bold tabular-nums ${pos ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {pos ? "▲" : "▼"} {Math.abs(displayPerf).toFixed(2)}%
            </span>
          )}
        </div>
      </div>
      <p
        className={`font-black text-sm uppercase leading-tight tracking-tight ${
          selected ? "text-[#0C2248]" : "text-[#1E3A5F]"
        }`}
        style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
      >
        {indice.nom}
      </p>
      <p className="text-[#8A9BB0] text-xs mt-0.5">{indice.pays}</p>
    </button>
  );
}

// ─── SkeletonRow ──────────────────────────────────────────────────────────────

function SkeletonRow({ odd }: { odd: boolean }) {
  return (
    <div className="relative" style={{ background: odd ? "#FAFCFF" : "#fff" }}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200" />
      <div
        className="hidden sm:grid gap-x-4 items-center pl-5 pr-7 py-3.5"
        style={{ gridTemplateColumns: "4px 2.5rem 1fr 5rem 6rem 9.5rem 7.5rem 6rem 3.5rem" }}
      >
        <span />
        <div className="h-3 w-6 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-36 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-14 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
        <div className="h-5 w-20 rounded-md bg-gray-200 animate-pulse" />
        <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-14 rounded bg-gray-200 animate-pulse" />
        <span />
      </div>
      <div
        className="sm:hidden grid items-center pl-4 pr-5 py-3.5"
        style={{ gridTemplateColumns: "1fr 6rem 5.5rem 3rem" }}
      >
        <div className="h-3 w-28 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-14 rounded bg-gray-200 animate-pulse ml-auto mr-3" />
        <div className="h-3 w-12 rounded bg-gray-200 animate-pulse ml-auto mr-3" />
        <span />
      </div>
    </div>
  );
}

// ─── StockTableRow ────────────────────────────────────────────────────────────

function StockTableRow({
  s,
  i,
  onSelect,
}: {
  s: StockRow;
  i: number;
  onSelect: (stock: StockRow) => void;
}) {
  return (
    <div
      className="relative group cursor-pointer transition-colors duration-150 hover:bg-[#F0F7FF]"
      style={{ background: i % 2 === 0 ? "#fff" : "#FAFCFF" }}
      onClick={() => onSelect(s)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: sparklineColor(s.variation) }} />

      {/* Desktop */}
      <div
        className="hidden sm:grid gap-x-4 items-center pl-5 pr-7 py-3.5"
        style={{ gridTemplateColumns: "4px 2.5rem 1fr 5rem 6rem 9.5rem 7.5rem 6rem 3.5rem" }}
      >
        <span />
        <span className="text-[#C5D0DC] text-xs font-mono font-bold tabular-nums">#{s.rang}</span>
        <div className="min-w-0 flex items-center gap-2">
          {LOGO_MAP[s.ticker] && (
            <img
              src={`https://img.logo.dev/${LOGO_MAP[s.ticker]}?token=pk_X-1ZO13GSgeOoUrIuJ1B6A&size=32`}
              width={20} height={20}
              style={{ borderRadius: "5px", objectFit: "contain", flexShrink: 0 }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              alt=""
            />
          )}
          <span className="text-[#0C2248] font-bold text-sm block truncate">{s.nom}</span>
        </div>
        <span className="text-[#8A9BB0] text-xs font-mono truncate">{s.ticker}</span>
        <span className="text-[#1E3A5F] text-sm font-bold tabular-nums">
          {s.prix != null
            ? `${s.prix % 1 === 0 ? s.prix.toFixed(0) : s.prix.toFixed(2)} ${s.prixDevise ?? s.currency}`
            : "—"}
        </span>
        <div>
          <SectorBadge ticker={s.ticker} secteur={s.secteur} />
        </div>
        <span className="text-[#0C2248] text-sm font-bold tabular-nums">
          {s.capMds > 0 ? `${s.capMds.toLocaleString("fr-FR")} Mds${s.currency}` : "—"}
        </span>
        <VariationBadge v={s.variation} />
        <div className="flex justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(s); }}
            className="inline-flex items-center gap-1 text-[#2E80CE] text-xs font-semibold transition-colors hover:text-[#0C2248] group/lnk"
          >
            <span>Voir</span>
            <svg className="w-3 h-3 transition-transform duration-150 group-hover/lnk:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div
        className="sm:hidden grid items-center pl-4 pr-5 py-3.5"
        style={{ gridTemplateColumns: "1fr 6rem 5.5rem 3rem" }}
      >
        <div className="min-w-0 pr-2 flex items-center gap-2">
          {LOGO_MAP[s.ticker] && (
            <img
              src={`https://img.logo.dev/${LOGO_MAP[s.ticker]}?token=pk_X-1ZO13GSgeOoUrIuJ1B6A&size=32`}
              width={20} height={20}
              style={{ borderRadius: "5px", objectFit: "contain", flexShrink: 0 }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              alt=""
            />
          )}
          <div className="min-w-0">
            <span className="text-[#0C2248] font-bold text-sm block truncate">{s.nom}</span>
            <span className="text-[#8A9BB0] text-xs">
              {s.capMds > 0 ? `${s.capMds.toLocaleString("fr-FR")} Mds${s.currency}` : "—"}
            </span>
          </div>
        </div>
        <span className="text-[#1E3A5F] text-sm font-bold tabular-nums text-right pr-3">
          {s.prix != null
            ? `${s.prix % 1 === 0 ? s.prix.toFixed(0) : s.prix.toFixed(2)} ${s.prixDevise ?? s.currency}`
            : "—"}
        </span>
        <div className="text-right pr-3">
          <VariationBadge v={s.variation} size="sm" />
        </div>
        <div className="flex justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(s); }}
            className="text-[#2E80CE]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── StockTable ───────────────────────────────────────────────────────────────

function StockTable({
  stocks,
  loading,
  onSelect,
}: {
  stocks: StockRow[];
  loading: boolean;
  onSelect: (stock: StockRow) => void;
}) {
  if (!loading && stocks.length === 0) {
    return (
      <div className="bg-white rounded-2xl px-7 py-10 text-center"
        style={{ boxShadow: "0 2px 16px rgba(14,52,120,0.08)" }}>
        <p className="text-[#8A9BB0] text-sm">Données non disponibles pour cet indice.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 16px rgba(14,52,120,0.08)" }}>
      {/* En-têtes */}
      <div
        className="hidden sm:grid gap-x-4 px-7 py-2.5 bg-[#F8FAFD]"
        style={{ gridTemplateColumns: "4px 2.5rem 1fr 5rem 6rem 9.5rem 7.5rem 6rem 3.5rem" }}
      >
        {["", "#", "Entreprise", "Ticker", "Prix", "Secteur", "Cap. (Mds)", "Variation", ""].map((h, i) => (
          <span key={i} className="text-[#8A9BB0] text-xs uppercase tracking-widest font-semibold">{h}</span>
        ))}
      </div>

      {stocks.map((s, i) => (
        <StockTableRow key={s.ticker} s={s} i={i} onSelect={onSelect} />
      ))}

      {loading && Array.from({ length: 8 }).map((_, i) => (
        <SkeletonRow key={`sk-${i}`} odd={(stocks.length + i) % 2 !== 0} />
      ))}

      {!loading && stocks.length > 0 && (
        <div className="px-7 py-2.5 bg-[#F8FAFD] border-t border-[#F0F7FF]">
          <p className="text-[#8A9BB0] text-xs">
            {stocks.length} valeur{stocks.length > 1 ? "s" : ""} · triées par capitalisation · Yahoo Finance
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function MarchesClient({
  indices,
  updatedAt,
  fromCache,
}: {
  indices: IndiceData[];
  updatedAt: string | null;
  fromCache: boolean;
}) {
  const [selectedId,    setSelectedId]    = useState<string>(indices[0]?.id ?? "");
  const [region,        setRegion]        = useState<Region>("tous");
  const [liveData,      setLiveData]      = useState<Record<string, StockRow[]>>({});
  const [loadingId,     setLoadingId]     = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockRow | null>(null);
  const fetchedRef = useRef(new Set<string>());

  useEffect(() => {
    if (!selectedId || fetchedRef.current.has(selectedId)) return;
    fetchedRef.current.add(selectedId);
    setLoadingId(selectedId);

    fetch(`/api/indice/${selectedId}`)
      .then((r) => r.json())
      .then((data: { stocks?: StockRow[] }) => {
        if (data.stocks?.length) {
          setLiveData((prev) => ({ ...prev, [selectedId]: data.stocks! }));
        }
      })
      .catch(() => { fetchedRef.current.delete(selectedId); })
      .finally(() => { setLoadingId((prev) => (prev === selectedId ? null : prev)); });
  }, [selectedId]);

  const visibleIndices = region === "tous"
    ? indices
    : indices.filter((idx) => idx.region === region);

  const selectedIndice =
    visibleIndices.find((idx) => idx.id === selectedId) ?? visibleIndices[0];

  const displayedStocks = selectedIndice
    ? (liveData[selectedIndice.id] ?? selectedIndice.stocks)
    : [];

  const isLoading = loadingId === selectedIndice?.id;

  return (
    <>
      {/* ── Header sombre ────────────────────────────────────────────────────── */}
      <section className="bg-[#0C2248] pt-24 pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#2E80CE] text-xs font-semibold uppercase tracking-widest mb-3">Marchés</p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black uppercase text-white leading-none mb-3"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Marchés
            <br />
            <span className="text-[#2E80CE]">mondiaux</span>
          </h1>
          <p className="text-white/50 text-lg mb-6">
            Tous les grands indices classés par capitalisation.
          </p>
          <p className="text-white/25 text-xs mb-8">
            {fromCache && updatedAt
              ? `Données actualisées le ${formatUpdatedAt(updatedAt)} · Yahoo Finance`
              : "Données indicatives · actualisées manuellement"}
          </p>

          <div className="flex flex-wrap gap-2">
            {FILTRES.map((f) => (
              <button
                key={f.id}
                onClick={() => setRegion(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  region === f.id
                    ? "bg-white text-[#0C2248] shadow-lg border border-transparent"
                    : "bg-transparent border border-white/50 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grille d'indices + tableau ────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pt-8 pb-6 max-w-6xl mx-auto">

        {visibleIndices.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {visibleIndices.map((indice) => (
              <IndiceCard
                key={indice.id}
                indice={indice}
                selected={selectedIndice?.id === indice.id}
                loading={loadingId === indice.id}
                onClick={() => setSelectedId(indice.id)}
              />
            ))}
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl px-8 py-12 text-center mb-8"
            style={{ boxShadow: "0 2px 16px rgba(14,52,120,0.08)" }}
          >
            <p className="text-[#8A9BB0] text-lg mb-3">Aucun indice pour cette région.</p>
            <button
              onClick={() => setRegion("tous")}
              className="text-[#2E80CE] text-sm font-semibold hover:underline"
            >
              Voir tous les indices →
            </button>
          </div>
        )}

        {selectedIndice && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl select-none leading-none">{selectedIndice.drapeau}</span>
            <div>
              <h2
                className="text-xl font-black text-[#0C2248] uppercase leading-tight"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                {selectedIndice.nom}
              </h2>
              <p className="text-[#8A9BB0] text-xs mt-0.5">{selectedIndice.description}</p>
            </div>
          </div>
        )}

        <StockTable
          stocks={displayedStocks}
          loading={isLoading}
          onSelect={setSelectedStock}
        />
      </section>

      {/* ── Disclaimer ───────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-16 max-w-6xl mx-auto">
        <div
          className="flex gap-3 bg-white rounded-xl px-5 py-4"
          style={{ boxShadow: "0 2px 8px rgba(14,52,120,0.04)" }}
        >
          <svg className="w-4 h-4 text-[#2E80CE] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#8A9BB0] text-sm leading-relaxed">
            Données fournies par Yahoo Finance. Le top 10 est actualisé quotidiennement via Supabase ; le reste est chargé en live au clic. À titre éducatif uniquement, ne constitue pas un conseil en investissement.
          </p>
        </div>
      </section>

      {/* ── Panneau latéral ──────────────────────────────────────────────────── */}
      <ActionPanel
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
      />
    </>
  );
}
