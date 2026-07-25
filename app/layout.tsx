import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artiste Peintre — Œuvres Impressionnistes",
  description:
    "Découvrez les œuvres d'un peintre impressionniste. Galerie en ligne et boutique d'art.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
