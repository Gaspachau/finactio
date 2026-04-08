import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FicheActif from "@/components/FicheActif";
import { getActifBySlug, getAllSlugs } from "@/lib/actifs-data";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const actif = getActifBySlug(params.slug);
  if (!actif) return {};
  return {
    title: `${actif.ticker} — Fiche actif | Finactio`,
    description: actif.description,
  };
}

export default function ActifPage({ params }: { params: { slug: string } }) {
  const actif = getActifBySlug(params.slug);
  if (!actif) notFound();

  return (
    <main className="min-h-screen bg-[#F0F7FF]">
      <Navbar />
      <FicheActif actif={actif} />
      <Footer />
    </main>
  );
}
