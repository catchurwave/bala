import { hasLocale } from "@/lib/dictionaries";
import { dbGetOeuvre, dbGetAllOeuvres } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import ImageLightbox from "@/components/ImageLightbox";
import SizeVisualizer from "@/components/SizeVisualizer";
import OeuvresCarousel from "@/components/OeuvresCarousel";

export const dynamic = "force-dynamic";

export default async function OeuvreGaleriePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const [oeuvre, allOeuvres] = await Promise.all([
    dbGetOeuvre(slug),
    dbGetAllOeuvres(),
  ]);
  if (!oeuvre) notFound();

  const autresOeuvres = allOeuvres.filter((o) => o.slug !== slug).slice(0, 10);

  const titre = lang === "fr" ? oeuvre.titre : oeuvre.titre_en;
  const description = lang === "fr" ? oeuvre.description : oeuvre.description_en;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back */}
        <Link
          href={`/${lang}/galerie`}
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#A09888] hover:text-[#C8A96E] transition-colors mb-12"
        >
          ← {lang === "fr" ? "Retour à la galerie" : "Back to gallery"}
        </Link>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div className="flex flex-col gap-4">
            <div className="frame">
              <div className="relative aspect-[4/3] bg-[#EDE5D4] overflow-hidden">
                {oeuvre.image ? (
                  <ImageLightbox src={oeuvre.image} alt={titre} priority />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-24 h-24 text-[#C8A96E] opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            {oeuvre.dimensions && <SizeVisualizer dimensions={oeuvre.dimensions} lang={lang} />}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-3">{oeuvre.annee}</p>
              <h1 className="font-serif text-4xl md:text-5xl text-[#2C2A27] font-light leading-tight mb-4">
                {titre}
              </h1>
              <p className="text-[#6B6560] leading-relaxed">{description}</p>
            </div>

            <div className="border-t border-[#EDE5D4] pt-6 space-y-3">
              {[
                { label: lang === "fr" ? "Technique" : "Technique", value: oeuvre.technique },
                { label: lang === "fr" ? "Dimensions" : "Dimensions", value: oeuvre.dimensions },
                { label: lang === "fr" ? "Année" : "Year", value: String(oeuvre.annee) },
                { label: lang === "fr" ? "Catégorie" : "Category", value: oeuvre.categorie },
              ].filter(({ value }) => value).map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[#A09888] uppercase tracking-wider text-xs">{label}</span>
                  <span className="text-[#2C2A27]">{value}</span>
                </div>
              ))}
            </div>

            {oeuvre.prix != null ? (
              <div className="border-t border-[#EDE5D4] pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-[#2C2A27]">
                    {oeuvre.prix.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", {
                      style: "currency", currency: "EUR", minimumFractionDigits: 0,
                    })}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs tracking-widest uppercase px-3 py-1 border ${
                    oeuvre.disponible ? "text-[#4A6741] border-[#4A6741]" : "text-red-500 border-red-400"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${oeuvre.disponible ? "bg-[#4A6741]" : "bg-red-500"}`} />
                    {oeuvre.disponible
                      ? (lang === "fr" ? "En vente" : "For sale")
                      : (lang === "fr" ? "Vendu" : "Sold")}
                  </span>
                </div>
                {oeuvre.disponible && (
                  <Link href={`/${lang}/boutique/${oeuvre.slug}`} className="btn-primary block text-center">
                    {lang === "fr" ? "Acquérir cette œuvre" : "Acquire this work"} →
                  </Link>
                )}
              </div>
            ) : (
              <div className="border-t border-[#EDE5D4] pt-6">
                <Link
                  href={`/${lang}/contact`}
                  className="inline-block border border-[#2C2A27] text-[#2C2A27] text-sm tracking-widest uppercase px-8 py-3 hover:bg-[#2C2A27] hover:text-[#F7F2E8] transition-all"
                >
                  {lang === "fr" ? "Renseignements" : "Inquire"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <OeuvresCarousel
        oeuvres={autresOeuvres}
        lang={lang}
        title={lang === "fr" ? "Autres œuvres" : "More works"}
      />
    </div>
  );
}
