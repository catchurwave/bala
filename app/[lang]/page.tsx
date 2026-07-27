import Link from "next/link";
import Image from "next/image";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import { dbGetFeatured, dbGetBio } from "@/lib/db";
import OeuvreCard from "@/components/OeuvreCard";
import Reassurance from "@/components/Reassurance";
import Newsletter from "@/components/Newsletter";
import { BrushStroke, Diamond, SectionHeader } from "@/components/Ornament";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const [featured, bio] = await Promise.all([
    dbGetFeatured(3),
    dbGetBio().catch((): Record<string, string> => ({})),
  ]);

  const artistPrenom = bio.nom || "Jean";
  const artistNom = bio.nom_complet?.split(" ").slice(1).join(" ") || "Balabanian";
  const quote = lang === "fr" ? (bio.citation || dict.home.quote) : (bio.citation_en || dict.home.quote);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 15% 45%, rgba(91,155,168,0.18) 0%, transparent 55%),
              radial-gradient(ellipse at 85% 20%, rgba(200,169,110,0.22) 0%, transparent 50%),
              radial-gradient(ellipse at 55% 85%, rgba(74,103,65,0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 40% 30%, rgba(196,103,75,0.08) 0%, transparent 45%),
              #F7F2E8
            `,
          }}
        />
        <div className="absolute inset-0 texture-overlay opacity-70" />

        {/* Vertical accent lines */}
        <div className="absolute top-1/4 left-10 w-px h-40 bg-gradient-to-b from-transparent via-[#C8A96E]/30 to-transparent" />
        <div className="absolute top-1/4 right-10 w-px h-40 bg-gradient-to-b from-transparent via-[#C8A96E]/30 to-transparent" />

        {/* Top decorative line */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-[#C8A96E]/40 to-transparent" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="flex justify-center mb-5">
            <Diamond color="#C8A96E" />
          </div>

          <p className="text-xs tracking-[0.35em] uppercase text-[#C8A96E] mb-8">
            {dict.home.hero_subtitle}
          </p>

          <h1 className="sr-only">{`${artistPrenom} ${artistNom} — L'atelier de Bala`}</h1>
          <div className="flex justify-center mb-6">
            <Image
              src="/logo-atelier.png"
              alt={`L'atelier de Bala — ${artistPrenom} ${artistNom}`}
              width={520}
              height={174}
              className="w-[320px] sm:w-[420px] md:w-[520px] h-auto object-contain drop-shadow-sm"
              priority
            />
          </div>

          <div className="flex justify-center mb-8">
            <BrushStroke width={220} />
          </div>

          <blockquote className="quote-artistic font-serif text-xl md:text-2xl text-[#7A6E65] mb-12 max-w-xl mx-auto leading-relaxed pl-6">
            &ldquo;{quote}&rdquo;
          </blockquote>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${lang}/galerie`}
              className="px-8 py-3.5 bg-[#2C2A27] text-[#F7F2E8] text-sm tracking-widest uppercase hover:bg-[#C8A96E] transition-colors duration-300"
            >
              {dict.home.hero_cta_gallery}
            </Link>
            <Link
              href={`/${lang}/boutique`}
              className="px-8 py-3.5 border border-[#2C2A27] text-[#2C2A27] text-sm tracking-widest uppercase hover:border-[#C8A96E] hover:text-[#C8A96E] transition-colors duration-300"
            >
              {dict.home.hero_cta_shop}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#A09888]">
          <span className="text-xs tracking-widest uppercase">
            {lang === "fr" ? "Défiler" : "Scroll"}
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-[#C8A96E]/60 to-transparent" />
        </div>
      </section>

      {/* ── SECTION DIVIDER ──────────────────────────────────────── */}
      <div className="watercolor-divider mx-auto max-w-2xl my-0 opacity-60" />

      {/* ── FEATURED WORKS ──────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-24 px-6 atelier-section">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              eyebrow={dict.home.featured_subtitle}
              title={dict.home.featured_title}
              className="mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featured.map((oeuvre) => (
                <OeuvreCard key={oeuvre.slug} oeuvre={oeuvre} lang={lang} />
              ))}
            </div>

            <div className="text-center mt-16">
              <Link
                href={`/${lang}/galerie`}
                className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-[#2C2A27] hover:text-[#C8A96E] transition-colors group"
              >
                <span>{dict.home.view_all}</span>
                <span className="block h-px w-8 bg-[#C8A96E] group-hover:w-16 transition-all duration-300" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION DIVIDER ──────────────────────────────────────── */}
      <div className="watercolor-divider mx-auto max-w-2xl opacity-60" />

      {/* ── ABOUT STRIP ─────────────────────────────────────────── */}
      <section className="bg-[#2C2A27] py-24 px-6 relative overflow-hidden">
        {/* Subtle texture on dark bg */}
        <div className="absolute inset-0 texture-overlay opacity-40" />

        {/* Corner brushstroke decoration */}
        <div className="absolute top-8 left-8 opacity-10">
          <BrushStroke color="#C8A96E" width={120} />
        </div>
        <div className="absolute bottom-8 right-8 opacity-10 rotate-180">
          <BrushStroke color="#C8A96E" width={120} />
        </div>

        <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Diamond color="#C8A96E" />
              <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E]">
                {dict.nav.artist}
              </p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#F7F2E8] font-light mb-4 leading-tight">
              {lang === "fr"
                ? (bio.tagline_fr || "Un regard vivant sur le monde")
                : (bio.tagline_en || "A vibrant eye on the world")}
            </h2>
            <BrushStroke color="#C8A96E" width={160} className="mb-6" />
            <p className="text-[#A09888] leading-relaxed mb-8">
              {lang === "fr"
                ? (bio.tagline_desc_fr || "Entre impressionnisme et expressionnisme, entre villes chatoyantes et paysages lumineux, Bala peint avec une liberté et une couleur qui lui sont propres.")
                : (bio.tagline_desc_en || "Between Impressionism and Expressionism, between vibrant cities and luminous landscapes, Bala paints with a freedom and color that are uniquely his own.")}
            </p>
            <Link
              href={`/${lang}/artiste`}
              className="inline-block border border-[#C8A96E] text-[#C8A96E] text-sm tracking-widest uppercase px-6 py-3 hover:bg-[#C8A96E] hover:text-[#2C2A27] transition-all"
            >
              {lang === "fr" ? "En savoir plus" : "Learn more"}
            </Link>
          </div>

          {/* Palette decoration */}
          <div className="relative hidden md:flex flex-col items-center gap-6">
            <p className="text-xs text-[#6B6560] uppercase tracking-widest text-center">
              {lang === "fr" ? "La palette de l'atelier" : "The atelier palette"}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { color: "#5B9BA8", label: "Turquoise" },
                { color: "#C8A96E", label: "Ocre" },
                { color: "#4A6741", label: "Forêt" },
                { color: "#C4674B", label: "Corail" },
                { color: "#7BA3B8", label: "Ciel" },
                { color: "#D4C9B6", label: "Brume" },
                { color: "#8B4513", label: "Sienna" },
                { color: "#A88748", label: "Or foncé" },
                { color: "#EDE5D4", label: "Crème" },
              ].map(({ color, label }) => (
                <div key={color} className="group relative aspect-square">
                  <div
                    className="w-full h-full rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-default"
                    style={{ backgroundColor: color }}
                    title={label}
                  />
                </div>
              ))}
            </div>
            <Diamond color="#C8A96E" />
          </div>
        </div>
      </section>

      {/* ── BOUTIQUE CTA ────────────────────────────────────────── */}
      <section className="py-24 px-6 linen-bg relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 watercolor-divider opacity-40" />

        {/* Decorative corner brush strokes */}
        <div className="absolute top-12 left-0 opacity-15 -rotate-12">
          <BrushStroke color="#C8A96E" width={100} />
        </div>
        <div className="absolute bottom-12 right-0 opacity-15 rotate-12">
          <BrushStroke color="#C8A96E" width={100} />
        </div>

        <div className="max-w-3xl mx-auto text-center relative">
          <div className="flex justify-center mb-6">
            <Diamond />
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-4">
            {dict.nav.shop}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#2C2A27] font-light mb-4">
            {lang === "fr"
              ? (bio.boutique_titre_fr || "Apportez l'art chez vous")
              : (bio.boutique_titre_en || "Bring art into your home")}
          </h2>
          <div className="flex justify-center mb-6">
            <BrushStroke />
          </div>
          <p className="text-[#6B6560] mb-10 leading-relaxed max-w-lg mx-auto">
            {lang === "fr"
              ? (bio.boutique_desc_fr || "Chaque tableau est une œuvre originale, peinte à la main. Livraison soigneuse, certificat d'authenticité signé par l'artiste inclus.")
              : (bio.boutique_desc_en || "Each painting is an original work, painted by hand. Careful delivery, certificate of authenticity hand-signed by the artist included.")}
          </p>
          <Link
            href={`/${lang}/boutique`}
            className="inline-block bg-[#C8A96E] text-[#F7F2E8] text-sm tracking-widest uppercase px-10 py-4 hover:bg-[#A88748] transition-colors"
          >
            {dict.home.hero_cta_shop}
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 watercolor-divider opacity-40" />
      </section>

      {/* ── REASSURANCE ─────────────────────────────────────────── */}
      <Reassurance lang={lang} />

      {/* ── NEWSLETTER ──────────────────────────────────────────── */}
      <Newsletter lang={lang} />
    </>
  );
}
