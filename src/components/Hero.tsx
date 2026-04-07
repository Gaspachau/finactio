export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 px-4 sm:px-6 text-center">
      {/* Dot grid texture */}
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      {/* Radial emerald glow behind title */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(5,150,105,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#1F2937] text-[#059669] text-xs font-semibold px-4 py-1.5 rounded-full mb-10 tracking-widest uppercase border border-[#059669]/20">
          <span className="w-1.5 h-1.5 bg-[#059669] rounded-full inline-block animate-pulse" />
          Plateforme éducative finance personnelle
        </div>

        {/* Title */}
        <h1
          className="text-[4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[9rem] font-bold uppercase leading-none tracking-tight mb-8"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          <span className="text-[#F9F9F9] block">COMPRENDS</span>
          <span className="text-[#059669] animate-underline inline-block">
            TON ARGENT.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#6B7280] text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Simulateurs interactifs, fiches actifs et leçons de 8 minutes pour
          apprendre à investir intelligemment — sans jargon, sans prise de tête.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#cta"
            className="btn-emerald bg-[#059669] hover:bg-[#047857] text-white font-semibold px-9 py-4 rounded-lg text-base w-full sm:w-auto"
          >
            Commencer gratuitement
          </a>
          <a
            href="#simulateurs"
            className="border border-[#374151] hover:border-[#6B7280] text-[#F9F9F9] font-semibold px-9 py-4 rounded-lg text-base transition-colors w-full sm:w-auto"
          >
            Voir les simulateurs
          </a>
        </div>
      </div>
    </section>
  );
}
