import Link from "next/link";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import { dbGetFeatured } from "@/lib/db";
import OeuvreCard from "@/components/OeuvreCard";
import Reassurance from "@/components/Reassurance";
import Newsletter from "@/components/Newsletter";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const featured = await dbGetFeatured(3);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background — gradient impressionniste */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(123,163,184,0.25) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(200,169,110,0.20) 0%, transparent 50%),
              radial-gradient(ellipse at 60% 80%, rgba(74,103,65,0.15) 0%, transparent 50%),
              #F7F2E8
            `,
          }}
        />

        {/* Painterly texture */}
        <div className="absolute inset-0 texture-overlay opacity-60" />

        {/* Decorative lines */}
        <div className="absolute top-1/3 left-8 w-px h-32 bg-gradient-to-b from-transparent via-[#C8A96E]/40 to-transparent" />
        <div className="absolute top-1/3 right-8 w-px h-32 bg-gradient-to-b from-transparent via-[#C8A96E]/40 to-transparent" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-6">
            {dict.home.hero_subtitle}
          </p>

          {/* Name — to be replaced with actual artist name */}
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-[#2C2A27] leading-none mb-8 font-light">
            <span className="italic">Jean</span>{" "}
            <span className="font-normal">Dupont</span>
          </h1>

          {/* Quote */}
          <blockquote className="font-serif text-xl md:text-2xl italic text-[#6B6560] mb-12 max-w-xl mx-auto leading-relaxed">
            &ldquo;{dict.home.quote}&rdquo;
          </blockquote>

          {/* CTAs */}
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#A09888]">
          <span className="text-xs tracking-widest uppercase">
            {lang === "fr" ? "Défiler" : "Scroll"}
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-[#C8A96E]/60 to-transparent" />
        </div>
      </section>

      {/* FEATURED WORKS */}
      {featured.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-4">
                {dict.home.featured_subtitle}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#2C2A27] font-light">
                {dict.home.featured_title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featured.map((oeuvre) => (
                <OeuvreCard key={oeuvre.slug} oeuvre={oeuvre} lang={lang} />
              ))}
            </div>

            <div className="text-center mt-16">
              <Link
                href={`/${lang}/galerie`}
                className="inline-block border-b border-[#C8A96E] text-sm tracking-widest uppercase text-[#2C2A27] pb-1 hover:text-[#C8A96E] transition-colors"
              >
                {dict.home.view_all}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT STRIP */}
      <section className="bg-[#2C2A27] py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-4">
              {dict.nav.artist}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#F7F2E8] font-light mb-6 leading-tight">
              {lang === "fr"
                ? "Un regard impressionniste sur le monde"
                : "An impressionist eye on the world"}
            </h2>
            <p className="text-[#A09888] leading-relaxed mb-8">
              {lang === "fr"
                ? "Influencé par Alfred Sisley et les grands maîtres de l'impressionnisme, cet artiste capture la lumière changeante des paysages, des marines et des jardins avec une touche sensible et vibrante."
                : "Influenced by Alfred Sisley and the great Impressionist masters, this artist captures the changing light of landscapes, seascapes, and gardens with a sensitive, vibrant brushstroke."}
            </p>
            <Link
              href={`/${lang}/artiste`}
              className="inline-block border border-[#C8A96E] text-[#C8A96E] text-sm tracking-widest uppercase px-6 py-3 hover:bg-[#C8A96E] hover:text-[#2C2A27] transition-all"
            >
              {lang === "fr" ? "En savoir plus" : "Learn more"}
            </Link>
          </div>

          {/* Decorative palette colors */}
          <div className="relative hidden md:block">
            <div className="grid grid-cols-3 gap-3">
              {[
                "#C8A96E", "#7BA3B8", "#4A6741",
                "#8B4513", "#D4C9B6", "#2C2A27",
                "#EDE5D4", "#A88748", "#5A849E",
              ].map((color, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm opacity-80"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-xs text-[#6B6560] mt-4 text-center italic">
              {lang === "fr" ? "La palette de l'artiste" : "The artist's palette"}
            </p>
          </div>
        </div>
      </section>

      {/* BOUTIQUE CTA */}
      <section className="py-24 px-6 bg-[#EDE5D4]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-4">
            {dict.nav.shop}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#2C2A27] font-light mb-6">
            {lang === "fr"
              ? "Apportez l'impressionnisme chez vous"
              : "Bring Impressionism into your home"}
          </h2>
          <p className="text-[#6B6560] mb-10 leading-relaxed">
            {lang === "fr"
              ? "Chaque tableau est une œuvre originale, peinte à la main. Livraison soigneuse, certificat d'authenticité inclus."
              : "Each painting is an original work, painted by hand. Careful delivery, certificate of authenticity included."}
          </p>
          <Link
            href={`/${lang}/boutique`}
            className="inline-block bg-[#C8A96E] text-[#F7F2E8] text-sm tracking-widest uppercase px-10 py-4 hover:bg-[#A88748] transition-colors"
          >
            {dict.home.hero_cta_shop}
          </Link>
        </div>
      </section>

      {/* REASSURANCE */}
      <Reassurance lang={lang} />

      {/* NEWSLETTER */}
      <Newsletter lang={lang} />
    </>
  );
}
