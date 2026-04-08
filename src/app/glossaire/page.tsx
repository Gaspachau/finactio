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
    <main className="min-h-screen bg-[#F0F7FF]">
      <Navbar />
      <GlossaireClient />
      <Footer />
    </main>
  );
}
