"use client";

import Link from "next/link";
import { useT } from "@/contexts/LanguageContext";
import type { ActifData } from "@/lib/actifs-data";

export default function ActifsPageContent({ actifs }: { actifs: ActifData[] }) {
  const t = useT();
  const ap = t.actifsPage;

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden pt-32 pb-12 px-4 sm:px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(5,150,105,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-[#059669] text-sm font-semibold uppercase tracking-widest mb-3">
            {ap.label}
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold uppercase text-[#F9F9F9] leading-none mb-4"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            {ap.title}
          </h1>
          <h2
            className="text-2xl sm:text-3xl font-bold uppercase text-[#059669] leading-none mb-4"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            {ap.heading}
          </h2>
          <p className="text-[#6B7280] text-lg max-w-xl">
            {ap.subtitle}
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="px-4 sm:px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actifs.map((actif) => (
            <Link
              key={actif.slug}
              href={`/actifs/${actif.slug}`}
              className="card-hover bg-[#1F2937] rounded-2xl p-6 flex flex-col gap-4 group"
            >
              {/* Header card */}
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="text-3xl font-bold text-[#F9F9F9] uppercase leading-none"
                    style={{ fontFamily: "var(--font-barlow-condensed)" }}
                  >
                    {actif.ticker}
                  </span>
                  <p className="text-[#6B7280] text-sm mt-0.5">{actif.name}</p>
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${actif.typeBadgeClass}`}
                >
                  {actif.type}
                </span>
              </div>

              {/* Prix + variation */}
              <div className="flex items-baseline gap-3">
                <span className="text-[#F9F9F9] text-2xl font-semibold">
                  {actif.price}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    actif.changePositive ? "text-[#059669]" : "text-red-400"
                  }`}
                >
                  {actif.change}
                </span>
              </div>

              {/* 3 métriques */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#111827]">
                {actif.metrics.slice(0, 3).map((m) => (
                  <div key={m.label}>
                    <p className="text-[#6B7280] text-xs mb-0.5">{m.label}</p>
                    <p
                      className="text-[#F9F9F9] text-sm font-semibold"
                      style={{ fontFamily: "var(--font-barlow-condensed)" }}
                    >
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-auto flex items-center gap-2 text-[#059669] font-semibold text-sm group-hover:gap-3 transition-all">
                {ap.voirFiche}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
