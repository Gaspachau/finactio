export default function Footer() {
  return (
    <footer className="border-t border-[#1F2937] py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <span
          className="text-[#059669] text-xl tracking-wider uppercase"
          style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700 }}
        >
          FINACTIO
        </span>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-[#6B7280]">
          {["Simulateurs", "Fiches actifs", "Glossaire", "À propos", "CGU", "Confidentialité"].map(
            (link) => (
              <a key={link} href="#" className="hover:text-[#F9F9F9] transition-colors">
                {link}
              </a>
            )
          )}
        </div>

        {/* Copyright */}
        <p className="text-[#6B7280] text-sm">
          © {new Date().getFullYear()} Finactio. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
