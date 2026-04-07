"use client";

import { useT } from "@/contexts/LanguageContext";
import SimulateurInterets from "@/components/SimulateurInterets";
import Footer from "@/components/Footer";

export default function SimulateursPageContent() {
  const t = useT();
  const sp = t.simulateursPage;

  return (
    <>
      {/* Header de page */}
      <section className="relative overflow-hidden pt-32 pb-12 px-4 sm:px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(5,150,105,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-[#059669] text-sm font-semibold uppercase tracking-widest mb-3">
            {sp.label}
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold uppercase text-[#F9F9F9] leading-none mb-4"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            {sp.title}
          </h1>
          <p className="text-[#6B7280] text-lg max-w-xl">
            {sp.subtitle}
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="px-4 sm:px-6 pb-24 max-w-6xl mx-auto space-y-16">
        <div>
          <div className="flex items-start gap-4 mb-6">
            <span className="text-3xl mt-1">📈</span>
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold uppercase text-[#F9F9F9]"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                {sp.simuTitle}
              </h2>
              <p className="text-[#6B7280] text-sm mt-1">
                {sp.simuSubtitle}
              </p>
            </div>
          </div>

          <SimulateurInterets />

          <div className="mt-4 flex gap-3 bg-[#1F2937]/50 border border-[#374151] rounded-xl px-5 py-4">
            <span className="text-[#059669] mt-0.5 shrink-0">ℹ</span>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              {sp.note}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
