import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarchesClient, { type IndiceData } from "./MarchesClient";
import { STATIC_INDICES } from "@/lib/marches-data";

export const metadata: Metadata = {
  title: "Marchés mondiaux — Finactio",
  description: "Tous les grands indices mondiaux classés par capitalisation : CAC 40, S&P 500, NASDAQ, Nikkei, FTSE 100.",
};

// Revalide toutes les heures — la page est mise en cache entre les requêtes
export const revalidate = 3600;

// ─── Lecture depuis Supabase ───────────────────────────────────────────────────

interface MarchesCache {
  source: "yahoo" | "static";
  indices: IndiceData[];
}

async function loadMarches(): Promise<{
  indices: IndiceData[];
  updatedAt: string | null;
  fromCache: boolean;
}> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: row, error } = await supabase
      .from("marches_cache")
      .select("data, updated_at")
      .eq("id", 1)
      .single();

    if (error || !row?.data) throw new Error(error?.message ?? "empty");

    const cache = row.data as MarchesCache;
    return {
      indices: cache.indices ?? STATIC_INDICES,
      updatedAt: row.updated_at as string,
      fromCache: true,
    };
  } catch {
    return { indices: STATIC_INDICES, updatedAt: null, fromCache: false };
  }
}

function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MarchesPage() {
  const { indices, updatedAt, fromCache } = await loadMarches();

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #F0F7FF 0%, #EBF3FF 50%, #F0F7FF 100%)" }}
    >
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-14 px-4 sm:px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(46,128,206,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: "radial-gradient(circle, rgba(46,128,206,0.1) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-4">Marchés</p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black uppercase text-[#0C2248] leading-none mb-4"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Les marchés
            <br />
            <span className="text-[#2E80CE]">mondiaux</span>
          </h1>
          <p className="text-[#1E3A5F] text-lg max-w-xl">
            Tous les grands indices, classés par capitalisation.
          </p>

          {/* Date de dernière mise à jour */}
          {updatedAt && (
            <p className="mt-3 text-[#1E3A5F]/50 text-sm">
              Données actualisées le {formatUpdatedAt(updatedAt)}
            </p>
          )}
        </div>
      </section>

      {/* ── Bandeau indicatif ── */}
      <div className="px-4 sm:px-6 max-w-6xl mx-auto mb-2">
        <div className="flex items-center gap-2 bg-[#DDEAFF]/60 border border-[#BDD3F0] rounded-xl px-4 py-2.5 w-fit">
          <svg className="w-3.5 h-3.5 text-[#2E80CE] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#1E3A5F] text-xs font-medium">
            {fromCache
              ? "Données actualisées quotidiennement via API — à titre éducatif uniquement"
              : "Données indicatives — actualisées manuellement (avril 2026)"}
          </p>
        </div>
      </div>

      <MarchesClient indices={indices} />

      <Footer />
    </main>
  );
}
