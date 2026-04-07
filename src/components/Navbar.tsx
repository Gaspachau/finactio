"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111827]/90 backdrop-blur-sm border-b border-[#1F2937]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <span
          className="text-[#059669] text-2xl tracking-wider uppercase"
          style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700 }}
        >
          FINACTIO
        </span>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {["Simulateurs", "Fiches actifs", "Glossaire"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#6B7280] hover:text-[#F9F9F9] transition-colors text-sm font-medium tracking-wide"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#cta"
            className="hidden md:inline-flex bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Commencer
          </a>
          <button
            className="md:hidden text-[#6B7280] hover:text-[#F9F9F9]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1F2937] border-t border-[#111827] px-4 py-4 flex flex-col gap-4">
          {["Simulateurs", "Fiches actifs", "Glossaire"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#6B7280] hover:text-[#F9F9F9] transition-colors font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <a
            href="#cta"
            className="bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold px-5 py-2 rounded-lg text-center transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Commencer
          </a>
        </div>
      )}
    </nav>
  );
}
