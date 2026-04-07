export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-[#1F2937] text-[#059669] text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase">
        <span className="w-1.5 h-1.5 bg-[#059669] rounded-full inline-block"></span>
        Plateforme éducative finance personnelle
      </div>

      {/* Title */}
      <h1
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase leading-none tracking-tight mb-6"
        style={{ fontFamily: "var(--font-barlow-condensed)" }}
      >
        <span className="text-[#F9F9F9]">COMPRENDS</span>
        <br />
        <span className="text-[#059669]">TON ARGENT.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-[#6B7280] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
        Simulateurs interactifs, fiches actifs et leçons de 8 minutes pour
        apprendre à investir intelligemment — sans jargon, sans prise de tête.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#cta"
          className="bg-[#059669] hover:bg-[#047857] text-white font-semibold px-8 py-3.5 rounded-lg text-base transition-colors w-full sm:w-auto"
        >
          Commencer gratuitement
        </a>
        <a
          href="#simulateurs"
          className="border border-[#1F2937] hover:border-[#6B7280] text-[#F9F9F9] font-semibold px-8 py-3.5 rounded-lg text-base transition-colors w-full sm:w-auto"
        >
          Voir les simulateurs
        </a>
      </div>
    </section>
  );
}
