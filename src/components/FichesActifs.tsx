const actifs = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    type: "Action",
    typeColor: "text-blue-400",
    price: "182,52 $",
    change: "+1,34%",
    positive: true,
    description:
      "Géant technologique américain. Produits phares : iPhone, Mac, services. Capitalisation >2 800 Mds $.",
    metrics: [
      { label: "P/E ratio", value: "28,4x" },
      { label: "Dividende", value: "0,92 %" },
      { label: "52 sem. haut", value: "199,62 $" },
    ],
  },
  {
    ticker: "BTC",
    name: "Bitcoin",
    type: "Cryptomonnaie",
    typeColor: "text-yellow-400",
    price: "67 240 $",
    change: "+3,21%",
    positive: true,
    description:
      "Première cryptomonnaie mondiale. Offre limitée à 21 millions d'unités. Réserve de valeur numérique.",
    metrics: [
      { label: "Cap. marché", value: "1 320 Mds $" },
      { label: "Dominance", value: "52,3 %" },
      { label: "Halving", value: "2028" },
    ],
  },
  {
    ticker: "MSCI W",
    name: "MSCI World",
    type: "ETF",
    typeColor: "text-emerald-400",
    price: "420,18 €",
    change: "+0,87%",
    positive: true,
    description:
      "Indice mondial couvrant 23 pays développés, ~1 500 entreprises. Standard de la diversification passive.",
    metrics: [
      { label: "Frais (TER)", value: "0,12 %" },
      { label: "Perf. 10 ans", value: "+178 %" },
      { label: "Pays", value: "23" },
    ],
  },
];

export default function FichesActifs() {
  return (
    <section id="fiches" className="py-20 px-4 sm:px-6 bg-[#1F2937]/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#059669] text-sm font-semibold uppercase tracking-widest mb-2">
            Fiches actifs
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold uppercase text-[#F9F9F9] leading-tight"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            COMPRENDS CE DANS QUOI
            <br />
            <span className="text-[#059669]">TU INVESTIS.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {actifs.map((actif) => (
            <div
              key={actif.ticker}
              className="bg-[#1F2937] rounded-2xl p-6 flex flex-col gap-4 hover:ring-1 hover:ring-[#059669]/40 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="text-2xl font-bold text-[#F9F9F9]"
                    style={{ fontFamily: "var(--font-barlow-condensed)" }}
                  >
                    {actif.ticker}
                  </span>
                  <p className="text-[#6B7280] text-sm">{actif.name}</p>
                </div>
                <span className={`text-xs font-semibold uppercase ${actif.typeColor} bg-[#111827] px-2.5 py-1 rounded-full`}>
                  {actif.type}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-[#F9F9F9]">
                  {actif.price}
                </span>
                <span className={`text-sm font-medium ${actif.positive ? "text-[#059669]" : "text-red-400"}`}>
                  {actif.change}
                </span>
              </div>

              {/* Description */}
              <p className="text-[#6B7280] text-sm leading-relaxed">
                {actif.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#111827]">
                {actif.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-[#6B7280] text-xs mb-0.5">{m.label}</p>
                    <p className="text-[#F9F9F9] text-sm font-medium">{m.value}</p>
                  </div>
                ))}
              </div>

              <a
                href="#"
                className="text-[#059669] text-sm font-semibold hover:underline"
              >
                Voir la fiche complète →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
