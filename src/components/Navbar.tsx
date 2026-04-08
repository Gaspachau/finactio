"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage, useT } from "@/contexts/LanguageContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLanguage } = useLanguage();
  const t = useT();

  const NAV_LINKS = [
    { label: t.nav.simulateurs, href: "/simulateurs" },
    { label: t.nav.fichesActifs, href: "/actifs" },
    { label: t.nav.glossaire, href: "/glossaire" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F0F7FF]/92 backdrop-blur-md border-b border-[#DDEAFF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl tracking-tight uppercase select-none"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900 }}
        >
          <span className="text-[#0C2248]">FIN</span>
          <span className="text-[#2E80CE]">ACTIO</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[#1E3A5F] hover:text-[#0C2248] transition-colors text-sm font-medium tracking-wide"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA + lang toggle + mobile toggle */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div className="flex items-center bg-[#DDEAFF] rounded-lg border border-[#BDD3F0] overflow-hidden text-xs font-bold">
            <button
              onClick={() => lang !== "fr" && toggleLanguage()}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "fr"
                  ? "bg-[#1E3A5F] text-white"
                  : "text-[#1E3A5F] hover:text-[#0C2248]"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => lang !== "en" && toggleLanguage()}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "en"
                  ? "bg-[#1E3A5F] text-white"
                  : "text-[#1E3A5F] hover:text-[#0C2248]"
              }`}
            >
              EN
            </button>
          </div>

          <Link
            href="/#cta"
            className="hidden md:inline-flex bg-[#1E3A5F] hover:bg-[#0C2248] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            {t.nav.commencer}
          </Link>
          <button
            className="md:hidden text-[#1E3A5F] hover:text-[#0C2248]"
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
        <div className="md:hidden bg-[#DDEAFF] border-t border-[#BDD3F0] px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[#1E3A5F] hover:text-[#0C2248] transition-colors font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#cta"
            className="bg-[#1E3A5F] hover:bg-[#0C2248] text-white text-sm font-semibold px-5 py-2 rounded-lg text-center transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.commencer}
          </Link>
        </div>
      )}
    </nav>
  );
}
