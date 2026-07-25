import { hasLocale } from "@/lib/dictionaries";
import { dbGetOeuvre } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OeuvreGaleriePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const oeuvre = await dbGetOeuvre(slug);
  if (!oeuvre) notFound();

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
          <div className="frame">
            <div className="relative aspect-[4/3] bg-[#EDE5D4]">
              {oeuvre.image ? (
                <Image
                  src={oeuvre.image}
                  alt={titre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-[#C8A96E] opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
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
              <div className="border-t border-[#EDE5D4] pt-6">
                <Link
                  href={`/${lang}/boutique/${oeuvre.slug}`}
                  className="inline-block bg-[#C8A96E] text-[#F7F2E8] text-sm tracking-widest uppercase px-8 py-3 hover:bg-[#A88748] transition-colors"
                >
                  {lang === "fr" ? "Voir en boutique" : "View in shop"} →
                </Link>
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
    </div>
  );
}
