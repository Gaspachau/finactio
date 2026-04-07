import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Finactio — Apprends la finance qui rapporte",
  description:
    "Simulateurs, fiches actifs et leçons courtes pour comprendre et investir intelligemment.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="bg-[#111827] text-[#F9F9F9] antialiased" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
