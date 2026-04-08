import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SimulateursPageContent from "@/components/SimulateursPageContent";

export const metadata: Metadata = {
  title: "Simulateurs — Finactio",
  description:
    "Simule l'évolution de ton épargne et la puissance des intérêts composés.",
};

export default function SimulateursPage() {
  return (
    <main className="min-h-screen bg-[#F0F7FF]">
      <Navbar />
      <SimulateursPageContent />
    </main>
  );
}
