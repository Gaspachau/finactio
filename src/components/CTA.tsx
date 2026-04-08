"use client";

import { useState } from "react";
import { useT } from "@/contexts/LanguageContext";

export default function CTA() {
  const [email, setEmail] = useState("");
  const t = useT();

  return (
    <section id="cta" className="py-24 px-4 sm:px-6 bg-[#0C2248]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[#2E80CE] text-sm font-semibold uppercase tracking-widest mb-4">
          {t.cta.label}
        </p>
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-[#F0F7FF] leading-tight mb-4"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          {t.cta.heading1}
          <br />
          <span className="text-[#2E80CE]">{t.cta.heading2}</span>
        </h2>
        <p className="text-[#F0F7FF]/60 mb-10 text-base">
          {t.cta.subtitle}
        </p>

        <form
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.cta.placeholder}
            className="flex-1 bg-[#1E3A5F] border border-[#2E80CE]/30 text-[#F0F7FF] placeholder-[#F0F7FF]/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2E80CE] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#2E80CE] hover:bg-[#1E3A5F] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap border border-[#2E80CE]"
          >
            {t.cta.submit}
          </button>
        </form>

        <p className="text-[#F0F7FF]/40 text-xs mt-4">
          {t.cta.fine}
        </p>
      </div>
    </section>
  );
}
