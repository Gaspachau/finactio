"use client";

import Link from "next/link";
import { useT } from "@/contexts/LanguageContext";

const ACTIFS_STATIC = [
  {
    slug: "apple",
    ticker: "AAPL",
    name: "Apple Inc.",
    type: "Action",
    typeColor: "text-blue-600",
    typeBg: "bg-blue-50 border-blue-200",
    price: "182,52 $",
    change: "+1,34%",
    positive: true,
    metrics: [
      { label: "P/E ratio", value: "28,4x" },
      { label: "Dividende", value: "0,92 %" },
      { label: "52 sem. haut", value: "199,62 $" },
    ],
  },
  {
    slug: "bitcoin",
    ticker: "BTC",
    name: "Bitcoin",
    type: "Cryptomonnaie",
    typeColor: "text-amber-600",
    typeBg: "bg-amber-50 border-amber-200",
    price: "67 240 $",
    change: "+3,21%",
    positive: true,
    metrics: [
      { label: "Cap. marché", value: "1 320 Mds $" },
      { label: "Dominance", value: "52,3 %" },
      { label: "Halving", value: "2028" },
    ],
  },
  {
    slug: "msci-world",
    ticker: "MSCI W",
    name: "MSCI World",
    type: "ETF",
    typeColor: "text-[#2E80CE]",
    typeBg: "bg-[#DDEAFF] border-[#BDD3F0]",
    price: "420,18 €",
    change: "+0,87%",
    positive: true,
    metrics: [
      { label: "Frais (TER)", value: "0,12 %" },
      { label: "Perf. 10 ans", value: "+178 %" },
      { label: "Pays", value: "23" },
    ],
  },
];

export default function FichesActifs() {
  const t = useT();

  return (
    <section id="fiches" className="py-20 px-4 sm:px-6 bg-[#DDEAFF]/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-2">
            {t.fichesActifsSection.label}
          </p>
          <h2
            className="text-4xl sm:text-5xl font-black uppercase text-[#0C2248] leading-tight"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            {t.fichesActifsSection.heading1}
            <br />
            <span className="text-[#2E80CE]">{t.fichesActifsSection.heading2}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ACTIFS_STATIC.map((actif, idx) => (
            <div
              key={actif.ticker}
              className="card-hover bg-white rounded-2xl p-6 flex flex-col gap-4 border border-[#DDEAFF]"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="text-2xl font-black text-[#0C2248]"
                    style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                  >
                    {actif.ticker}
                  </span>
                  <p className="text-[#1E3A5F] text-sm">{actif.name}</p>
                </div>
                <span className={`text-xs font-semibold uppercase ${actif.typeColor} ${actif.typeBg} px-2.5 py-1 rounded-full border`}>
                  {actif.type}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-[#0C2248]">
                  {actif.price}
                </span>
                <span className={`text-sm font-semibold ${actif.positive ? "text-[#4ADE80]" : "text-[#EF4444]"}`}>
                  {actif.change}
                </span>
              </div>

              {/* Description */}
              <p className="text-[#1E3A5F] text-sm leading-relaxed">
                {t.fichesActifsSection.actifs[idx]?.description ?? ""}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#DDEAFF]">
                {actif.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-[#1E3A5F]/60 text-xs mb-0.5">{m.label}</p>
                    <p className="text-[#0C2248] text-sm font-semibold">{m.value}</p>
                  </div>
                ))}
              </div>

              <Link
                href={`/actifs/${actif.slug}`}
                className="text-[#2E80CE] text-sm font-semibold hover:text-[#1E3A5F] transition-colors"
              >
                {t.fichesActifsSection.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
