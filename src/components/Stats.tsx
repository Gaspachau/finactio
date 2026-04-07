const stats = [
  { value: "42 000", label: "Apprenants actifs" },
  { value: "120", label: "Leçons disponibles" },
  { value: "4.9★", label: "Note moyenne" },
  { value: "8 min", label: "Par leçon en moyenne" },
];

export default function Stats() {
  return (
    <section className="bg-[#1F2937] border-y border-[#111827]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p
              className="text-4xl sm:text-5xl font-bold text-[#059669] mb-1"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              {stat.value}
            </p>
            <p className="text-[#6B7280] text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
