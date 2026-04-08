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
        <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-2">
          {t.simulateursSection.label}
        </p>
        <h2
          className="text-4xl sm:text-5xl font-black uppercase text-[#0C2248] leading-tight"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          {t.simulateursSection.heading1}
          <br />
          <span className="text-[#2E80CE]">{t.simulateursSection.heading2}</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((sim, idx) => {
          const href = HREFS[idx] ?? "#";
          return (
            <div
              key={sim.title}
              className="card-hover bg-[#DDEAFF] rounded-2xl p-8 flex flex-col gap-5 border border-[#BDD3F0]"
            >
              <span className="text-4xl">{idx === 0 ? "📈" : "🏠"}</span>
              <div>
                <h3
                  className="text-2xl font-black uppercase text-[#0C2248] mb-2"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  {sim.title}
                </h3>
                <p className="text-[#1E3A5F] leading-relaxed text-sm">
                  {sim.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sim.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#F0F7FF] text-[#1E3A5F] px-3 py-1 rounded-full font-medium border border-[#BDD3F0]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={href}
                className={`mt-auto inline-flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all ${href === "#" ? "text-[#1E3A5F]/40 pointer-events-none" : "text-[#2E80CE]"}`}
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
