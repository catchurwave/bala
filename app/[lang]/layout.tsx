import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { dbGetBio } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import Navigation from "@/components/Navigation";
import AdminBar from "@/components/AdminBar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import OeuvreModal from "@/components/OeuvreModal";
import { ModalProvider } from "@/components/ModalContext";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const bio = await dbGetBio().catch((): Record<string, string> => ({}));
  return {
    title: bio.meta_titre || "Artiste Peintre — Œuvres Impressionnistes",
    description:
      (lang === "fr" ? bio.meta_description_fr : bio.meta_description_en) ||
      "Découvrez les œuvres d'un peintre impressionniste. Galerie en ligne et boutique d'art.",
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const [dict, bio, isAdmin] = await Promise.all([
    getDictionary(lang),
    dbGetBio().catch((): Record<string, string> => ({})),
    getAdminSession().catch(() => false),
  ]);

  return (
    <ModalProvider>
      {isAdmin && <AdminBar />}
      <Navigation lang={lang} dict={dict} artistName={bio.nom_atelier || bio.nom_complet || "Atelier"} isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} dict={dict} bio={bio} />
      <OeuvreModal lang={lang} />
      <CookieBanner lang={lang} />
    </ModalProvider>
  );
}
