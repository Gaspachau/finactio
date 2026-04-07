"use client";

import { useState } from "react";
import { useT } from "@/contexts/LanguageContext";

export default function CTA() {
  const [email, setEmail] = useState("");
  const t = useT();

  return (
    <section id="cta" className="py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[#059669] text-sm font-semibold uppercase tracking-widest mb-4">
          {t.cta.label}
        </p>
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-[#F9F9F9] leading-tight mb-4"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {t.cta.heading1}
          <br />
          <span className="text-[#059669]">{t.cta.heading2}</span>
        </h2>
        <p className="text-[#6B7280] mb-10 text-base">
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
            className="flex-1 bg-[#1F2937] border border-[#374151] text-[#F9F9F9] placeholder-[#6B7280] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#059669] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#059669] hover:bg-[#047857] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            {t.cta.submit}
          </button>
        </form>

        <p className="text-[#6B7280] text-xs mt-4">
          {t.cta.fine}
        </p>
      </div>
    </section>
  );
}
