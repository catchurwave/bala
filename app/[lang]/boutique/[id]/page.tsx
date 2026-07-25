import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { dbGetOeuvre } from "@/lib/db";
import { notFound } from "next/navigation";
import BuyButton from "./BuyButton";
import ImageLightbox from "@/components/ImageLightbox";
import SizeVisualizer from "@/components/SizeVisualizer";

export const dynamic = "force-dynamic";

export default async function OeuvrePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();

  const oeuvre = await dbGetOeuvre(id);
  if (!oeuvre || oeuvre.prix == null) notFound();

  const dict = await getDictionary(lang);
  const titre = lang === "fr" ? oeuvre.titre : oeuvre.titre_en;
  const description = lang === "fr" ? oeuvre.description : oeuvre.description_en;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
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
              <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-3">
                {oeuvre.annee}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-[#2C2A27] font-light leading-tight mb-4">
                {titre}
              </h1>
              <p className="text-[#6B6560] leading-relaxed">{description}</p>
            </div>

            {/* Details table */}
            <div className="border-t border-[#EDE5D4] pt-6 space-y-3">
              {[
                { label: dict.shop.technique, value: oeuvre.technique },
                { label: dict.shop.dimensions, value: oeuvre.dimensions },
                { label: dict.shop.year, value: String(oeuvre.annee) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[#A09888] uppercase tracking-wider text-xs">{label}</span>
                  <span className="text-[#2C2A27]">{value}</span>
                </div>
              ))}
            </div>

            {/* Price + buy */}
            <div className="border-t border-[#EDE5D4] pt-6">
              <div className="flex items-center justify-between mb-6">
                <p className="font-serif text-4xl text-[#2C2A27]">
                  {oeuvre.prix!.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 0,
                  })}
                </p>
                <span
                  className={`text-xs tracking-widest uppercase px-3 py-1 border ${
                    oeuvre.disponible
                      ? "text-[#4A6741] border-[#4A6741]"
                      : "text-[#A09888] border-[#A09888]"
                  }`}
                >
                  {oeuvre.disponible ? dict.shop.available : dict.shop.sold}
                </span>
              </div>

              {oeuvre.disponible && (
                <BuyButton
                  slug={oeuvre.slug}
                  titre={titre}
                  prix={oeuvre.prix!}
                  lang={lang}
                  label={dict.shop.checkout}
                />
              )}

              <div className="flex items-center gap-2 mt-4 text-xs text-[#A09888]">
                <svg className="w-3.5 h-3.5 text-[#4A6741]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {dict.shop.secure_payment}
              </div>
            </div>

            {/* Certificate note */}
            <div className="bg-[#EDE5D4] p-4 text-xs text-[#6B6560] leading-relaxed">
              {lang === "fr"
                ? "Cette œuvre est accompagnée d'un certificat d'authenticité signé par l'artiste. Emballage professionnel et livraison assurée inclus."
                : "This work comes with a certificate of authenticity signed by the artist. Professional packaging and insured delivery included."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
