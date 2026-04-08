import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Finactio — Apprends la finance qui rapporte",
  description:
    "Simulateurs, fiches actifs et leçons courtes pour comprendre et investir intelligemment.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@100,200,300,400,500,700,800,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#F0F7FF] text-[#0C2248] antialiased"
        style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
