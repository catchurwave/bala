import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { dbGetAVendre } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Reassurance from "@/components/Reassurance";

export default async function BoutiquePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const oeuvres = await dbGetAVendre();

  return (
    <>
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-4">
            {dict.shop.subtitle}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-[#2C2A27] font-light mb-4">
            {dict.shop.title}
          </h1>
          <div className="w-16 h-px bg-[#C8A96E] mx-auto mb-6" />
          <p className="text-sm text-[#6B6560] max-w-xl mx-auto leading-relaxed">
            {lang === "fr"
              ? "Chaque œuvre est unique, peinte à la main. Livraison sécurisée. Certificat d'authenticité inclus."
              : "Each work is unique, hand-painted. Secure delivery. Certificate of authenticity included."}
          </p>
        </div>

        {/* Secure payment badge */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-2 bg-[#EDE5D4] px-4 py-2 text-xs text-[#6B6560]">
            <svg className="w-4 h-4 text-[#4A6741]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {dict.shop.secure_payment}
          </div>
        </div>

        {oeuvres.length === 0 ? (
          <div className="text-center py-24 text-[#A09888]">
            <p className="font-serif text-2xl italic">
              {lang === "fr" ? "Boutique bientôt disponible" : "Shop coming soon"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {oeuvres.map((oeuvre) => {
              const titre = lang === "fr" ? oeuvre.titre : oeuvre.titre_en;

              return (
                <Link
                  key={oeuvre.slug}
                  href={`/${lang}/boutique/${oeuvre.slug}`}
                  className="group painting-card block"
                >
                  <div className="frame">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE5D4]">
                      {oeuvre.image ? (
                        <Image
                          src={oeuvre.image}
                          alt={titre}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDE5D4] to-[#D4C9B6]">
                          <svg className="w-16 h-16 text-[#C8A96E] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {!oeuvre.disponible && (
                        <div className="absolute inset-0 bg-[#2C2A27]/50 flex items-center justify-center">
                          <span className="font-serif text-xl italic text-[#F7F2E8]">{dict.shop.sold}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 px-1">
                    <h3 className="font-serif text-xl text-[#2C2A27] group-hover:text-[#C8A96E] transition-colors">
                      {titre}
                    </h3>
                    <p className="text-sm text-[#6B6560] mt-1">
                      {oeuvre.technique} · {oeuvre.dimensions}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      {oeuvre.prix ? (
                        <p className="font-serif text-2xl text-[#2C2A27]">
                          {oeuvre.prix.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 0,
                          })}
                        </p>
                      ) : null}
                      <span
                        className={`text-xs tracking-widest uppercase px-3 py-1 ${
                          oeuvre.disponible
                            ? "text-[#4A6741] border border-[#4A6741]"
                            : "text-[#A09888] border border-[#A09888]"
                        }`}
                      >
                        {oeuvre.disponible ? dict.shop.available : dict.shop.sold}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
    <Reassurance lang={lang} />
    </>
  );
}
