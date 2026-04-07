"use client";

import { useState } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");

  return (
    <section id="cta" className="py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[#059669] text-sm font-semibold uppercase tracking-widest mb-4">
          Accès gratuit
        </p>
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-[#F9F9F9] leading-tight mb-4"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          PRÊT À PASSER
          <br />
          <span className="text-[#059669]">À L&apos;ACTION ?</span>
        </h2>
        <p className="text-[#6B7280] mb-10 text-base">
          Rejoins 42 000 apprenants qui maîtrisent leur argent avec Finactio.
          C&apos;est gratuit, sans engagement.
        </p>

        <form
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.com"
            className="flex-1 bg-[#1F2937] border border-[#374151] text-[#F9F9F9] placeholder-[#6B7280] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#059669] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#059669] hover:bg-[#047857] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            S&apos;inscrire gratuitement
          </button>
        </form>

        <p className="text-[#6B7280] text-xs mt-4">
          Aucune carte bancaire requise · Désabonnement en un clic
        </p>
      </div>
    </section>
  );
}
