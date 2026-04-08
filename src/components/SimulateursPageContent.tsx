"use client";

import { useT } from "@/contexts/LanguageContext";
import SimulateurInterets from "@/components/SimulateurInterets";
import Footer from "@/components/Footer";

const PAGE_STATS = [
  { value: "120", label: "leçons" },
  { value: "42k", label: "apprenants" },
  { value: "100%", label: "gratuit" },
];

export default function SimulateursPageContent() {
  const t = useT();
  const sp = t.simulateursPage;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #F0F7FF 0%, #EBF3FF 50%, #F0F7FF 100%)",
      }}
    >
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-16 px-4 sm:px-6">
        {/* Glow de fond */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(46,128,206,0.13) 0%, transparent 70%)",
          }}
        />
        {/* Grille décorative */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(46,128,206,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-4">
            {sp.label}
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-black uppercase text-[#0C2248] leading-none mb-5"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            {sp.title}
          </h1>
          <p className="text-[#1E3A5F] text-lg max-w-xl mb-10">
            {sp.subtitle}
          </p>

          {/* Bande de stats */}
          <div className="flex flex-wrap gap-3 sm:gap-0 sm:inline-flex sm:divide-x sm:divide-[#BDD3F0] bg-white rounded-2xl border border-[#DDEAFF] overflow-hidden"
            style={{ boxShadow: "0 4px 16px rgba(14,52,120,0.06)" }}>
            {PAGE_STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center px-8 py-4">
                <span
                  className="text-3xl font-black text-[#0C2248] leading-none"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  {s.value}
                </span>
                <span className="text-[#1E3A5F]/60 text-xs uppercase tracking-widest mt-1">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contenu ── */}
      <section className="px-4 sm:px-6 pb-24 max-w-6xl mx-auto space-y-16">
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-11 h-11 rounded-xl bg-[#1E3A5F] flex items-center justify-center shrink-0 mt-0.5"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
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

          <div className="mt-4 flex gap-3 bg-white border border-[#BDD3F0] rounded-xl px-5 py-4"
            style={{ boxShadow: "0 2px 8px rgba(14,52,120,0.04)" }}>
            <svg className="w-4 h-4 text-[#2E80CE] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#1E3A5F] text-sm leading-relaxed">
              {sp.note}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
