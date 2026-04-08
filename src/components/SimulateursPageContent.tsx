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
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(46,128,206,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-3">
            {sp.label}
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black uppercase text-[#0C2248] leading-none mb-4"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            {sp.title}
          </h1>
          <p className="text-[#1E3A5F] text-lg max-w-xl">
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
                className="text-2xl sm:text-3xl font-black uppercase text-[#0C2248]"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                {sp.simuTitle}
              </h2>
              <p className="text-[#1E3A5F]/60 text-sm mt-1">
                {sp.simuSubtitle}
              </p>
            </div>
          </div>

          <SimulateurInterets />

          <div className="mt-4 flex gap-3 bg-[#DDEAFF]/50 border border-[#BDD3F0] rounded-xl px-5 py-4">
            <span className="text-[#2E80CE] mt-0.5 shrink-0">ℹ</span>
            <p className="text-[#1E3A5F] text-sm leading-relaxed">
              {sp.note}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
