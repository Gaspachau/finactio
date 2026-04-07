import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Simulateurs from "@/components/Simulateurs";
import FichesActifs from "@/components/FichesActifs";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111827]">
      <Navbar />
      <Hero />
      <Stats />
      <Simulateurs />
      <FichesActifs />
      <CTA />
      <Footer />
    </main>
  );
}
