"use client";

import { useT } from "@/contexts/LanguageContext";

export default function Footer() {
  const t = useT();

  return (
    <footer className="border-t border-[#DDEAFF] py-10 px-4 sm:px-6 bg-[#F0F7FF]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <span
          className="text-xl tracking-tight uppercase select-none"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900 }}
        >
          <span className="text-[#0C2248]">FIN</span>
          <span className="text-[#2E80CE]">ACTIO</span>
        </span>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-[#1E3A5F]">
          {t.footer.links.map((link) => (
            <a key={link} href="#" className="hover:text-[#0C2248] transition-colors">
              {link}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-[#1E3A5F]/60 text-sm">
          © {new Date().getFullYear()} Finactio. {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
