import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlossaireClient from "@/components/GlossaireClient";

export const metadata: Metadata = {
  title: "Glossaire — Finactio",
  description:
    "Le jargon de la finance, enfin expliqué simplement. ETF, PER, dividende, inflation… 20 termes essentiels avec exemples chiffrés.",
};

export default function GlossairePage() {
  return (
    <main className="min-h-screen bg-[#111827]">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden pt-32 pb-12 px-4 sm:px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(5,150,105,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          <p className="text-[#059669] text-sm font-semibold uppercase tracking-widest mb-3">
            Référence
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold uppercase text-[#F9F9F9] leading-none mb-4"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            GLOSSAIRE
          </h1>
          <p className="text-[#6B7280] text-lg">
            Le jargon de la finance, enfin expliqué simplement.
          </p>
        </div>
      </section>

      <GlossaireClient />

      <Footer />
    </main>
  );
}
