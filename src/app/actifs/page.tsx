import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ActifsPageContent from "@/components/ActifsPageContent";
import { getAllActifs } from "@/lib/actifs-data";

export const metadata: Metadata = {
  title: "Fiches actifs — Finactio",
  description:
    "Apple, Bitcoin, MSCI World — comprends les actifs dans lesquels tu investis avant de te lancer.",
};

export default function ActifsPage() {
  const actifs = getAllActifs();

  return (
    <main className="min-h-screen bg-[#F0F7FF]">
      <Navbar />
      <ActifsPageContent actifs={actifs} />
      <Footer />
    </main>
  );
}
