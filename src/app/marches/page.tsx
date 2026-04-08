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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MarchesPage() {
  const { indices, updatedAt, fromCache } = await loadMarches();

  return (
    <div className="min-h-screen bg-[#F4F7FC]">
      <Navbar />
      <MarchesClient indices={indices} updatedAt={updatedAt} fromCache={fromCache} />
      <Footer />
    </div>
  );
}
