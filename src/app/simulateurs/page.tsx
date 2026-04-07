import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SimulateurInterets from "@/components/SimulateurInterets";

export const metadata: Metadata = {
  title: "Simulateurs — Finactio",
  description:
    "Simule l'évolution de ton épargne et la puissance des intérêts composés.",
};

export default function SimulateursPage() {
  return (
    <main className="min-h-screen bg-[#111827]">
      <Navbar />

      {/* Header de page */}
      <section className="relative overflow-hidden pt-32 pb-12 px-4 sm:px-6">
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(5,150,105,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-[#059669] text-sm font-semibold uppercase tracking-widest mb-3">
            Outils gratuits
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold uppercase text-[#F9F9F9] leading-none mb-4"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            SIMULATEURS
          </h1>
          <p className="text-[#6B7280] text-lg max-w-xl">
            Visualise l&apos;impact de tes décisions financières avant de les prendre.
            Modifie les paramètres et observe les résultats en temps réel.
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="px-4 sm:px-6 pb-24 max-w-6xl mx-auto space-y-16">
        {/* Simulateur intérêts composés */}
        <div>
          {/* Titre du simulateur */}
          <div className="flex items-start gap-4 mb-6">
            <span className="text-3xl mt-1">📈</span>
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold uppercase text-[#F9F9F9]"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                Intérêts composés
              </h2>
              <p className="text-[#6B7280] text-sm mt-1">
                Calcule la valeur finale de ton épargne en tenant compte du capital
                de départ, des versements réguliers et des intérêts qui se
                capitalisent sur la durée.
              </p>
            </div>
          </div>

          <SimulateurInterets />

          {/* Note pédagogique */}
          <div className="mt-4 flex gap-3 bg-[#1F2937]/50 border border-[#374151] rounded-xl px-5 py-4">
            <span className="text-[#059669] mt-0.5 shrink-0">ℹ</span>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              Ce simulateur utilise la formule des intérêts composés avec
              capitalisation mensuelle. Les résultats sont donnés à titre
              indicatif et ne constituent pas un conseil en investissement. Les
              performances passées ne préjugent pas des performances futures.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
