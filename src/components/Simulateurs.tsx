"use client";

import Link from "next/link";
import { useT } from "@/contexts/LanguageContext";

const HREFS = ["/simulateurs", "#"];

export default function Simulateurs() {
  const t = useT();
  const items = t.simulateursSection.items;

  return (
    <section id="simulateurs" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="text-[#059669] text-sm font-semibold uppercase tracking-widest mb-2">
          {t.simulateursSection.label}
        </p>
        <h2
          className="text-4xl sm:text-5xl font-bold uppercase text-[#F9F9F9] leading-tight"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {t.simulateursSection.heading1}
          <br />
          <span className="text-[#059669]">{t.simulateursSection.heading2}</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((sim, idx) => {
          const href = HREFS[idx] ?? "#";
          return (
            <div
              key={sim.title}
              className="card-hover bg-[#1F2937] rounded-2xl p-8 flex flex-col gap-5"
            >
              <span className="text-4xl">{idx === 0 ? "📈" : "🏠"}</span>
              <div>
                <h3
                  className="text-2xl font-bold uppercase text-[#F9F9F9] mb-2"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {sim.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed text-sm">
                  {sim.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sim.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#111827] text-[#6B7280] px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={href}
                className={`mt-auto inline-flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all ${href === "#" ? "text-[#6B7280] pointer-events-none" : "text-[#059669]"}`}
              >
                {sim.cta}
                {href !== "#" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
