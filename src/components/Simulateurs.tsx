const simulateurs = [
  {
    icon: "📈",
    title: "Simulateur d'intérêts composés",
    description:
      "Visualise l'effet boule de neige de tes placements sur 5, 10, 20 ou 40 ans. Ajuste le capital de départ, l'apport mensuel et le taux de rendement.",
    tags: ["Épargne", "Long terme", "Interactif"],
    cta: "Lancer le simulateur",
  },
  {
    icon: "🏠",
    title: "Simulateur crédit immobilier",
    description:
      "Calcule tes mensualités, le coût total du crédit et le taux d'endettement. Compare plusieurs scénarios en temps réel.",
    tags: ["Immobilier", "Crédit", "Mensualités"],
    cta: "Simuler un crédit",
  },
];

export default function Simulateurs() {
  return (
    <section id="simulateurs" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="text-[#059669] text-sm font-semibold uppercase tracking-widest mb-2">
          Simulateurs
        </p>
        <h2
          className="text-4xl sm:text-5xl font-bold uppercase text-[#F9F9F9] leading-tight"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          PRENDS DES DÉCISIONS
          <br />
          <span className="text-[#059669]">ÉCLAIRÉES.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {simulateurs.map((sim) => (
          <div
            key={sim.title}
            className="card-hover bg-[#1F2937] rounded-2xl p-8 flex flex-col gap-5"
          >
            <span className="text-4xl">{sim.icon}</span>
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
            <a
              href="#"
              className="mt-auto inline-flex items-center gap-2 text-[#059669] font-semibold text-sm hover:gap-3 transition-all"
            >
              {sim.cta}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
