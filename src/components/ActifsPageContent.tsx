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
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(46,128,206,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-3">
            {ap.label}
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black uppercase text-[#0C2248] leading-none mb-4"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            {ap.title}
          </h1>
          <h2
            className="text-2xl sm:text-3xl font-black uppercase text-[#2E80CE] leading-none mb-4"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            {ap.heading}
          </h2>
          <p className="text-[#1E3A5F] text-lg max-w-xl">
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
              className="card-hover bg-white rounded-2xl p-6 flex flex-col gap-4 group border border-[#DDEAFF]"
            >
              {/* Header card */}
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="text-3xl font-black text-[#0C2248] uppercase leading-none"
                    style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                  >
                    {actif.ticker}
                  </span>
                  <p className="text-[#1E3A5F] text-sm mt-0.5">{actif.name}</p>
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${actif.typeBadgeClass}`}
                >
                  {actif.type}
                </span>
              </div>

              {/* Prix + variation */}
              <div className="flex items-baseline gap-3">
                <span className="text-[#0C2248] text-2xl font-semibold">
                  {actif.price}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    actif.changePositive ? "text-[#4ADE80]" : "text-[#EF4444]"
                  }`}
                >
                  {actif.change}
                </span>
              </div>

              {/* 3 métriques */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#DDEAFF]">
                {actif.metrics.slice(0, 3).map((m) => (
                  <div key={m.label}>
                    <p className="text-[#1E3A5F]/60 text-xs mb-0.5">{m.label}</p>
                    <p
                      className="text-[#0C2248] text-sm font-semibold"
                      style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                    >
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-auto flex items-center gap-2 text-[#2E80CE] font-semibold text-sm group-hover:gap-3 transition-all">
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
