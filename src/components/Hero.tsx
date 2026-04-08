"use client";

import { useT } from "@/contexts/LanguageContext";

export default function Hero() {
  const t = useT();

  return (
    <section className="relative overflow-hidden pt-32 pb-24 px-4 sm:px-6 text-center">
      {/* Dot grid texture */}
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      {/* Ceruleen radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(46,128,206,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#DDEAFF] text-[#2E80CE] text-xs font-semibold px-4 py-1.5 rounded-full mb-10 tracking-widest uppercase border border-[#2E80CE]/20">
          <span className="w-1.5 h-1.5 bg-[#2E80CE] rounded-full inline-block animate-pulse" />
          {t.hero.badge}
        </div>

        {/* Title */}
        <h1
          className="text-[4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[9rem] font-black uppercase leading-none tracking-tight mb-8"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          <span className="text-[#0C2248] block">{t.hero.titleLine1}</span>
          <span className="text-[#2E80CE] animate-underline inline-block">
            {t.hero.titleLine2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#1E3A5F] text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          {t.hero.subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#cta"
            className="btn-ardoise bg-[#1E3A5F] hover:bg-[#0C2248] text-white font-semibold px-9 py-4 rounded-lg text-base w-full sm:w-auto"
          >
            {t.hero.ctaPrimary}
          </a>
          <a
            href="#simulateurs"
            className="border border-[#1E3A5F]/30 hover:border-[#1E3A5F] text-[#1E3A5F] font-semibold px-9 py-4 rounded-lg text-base transition-colors w-full sm:w-auto"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
