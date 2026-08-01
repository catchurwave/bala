import { hasLocale } from "@/lib/dictionaries";
import { dbGetOeuvre } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import PaymentSelector from "./PaymentSelector";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ slug?: string }>;
}) {
  const [{ lang }, { slug }] = await Promise.all([params, searchParams]);
  if (!hasLocale(lang)) notFound();
  if (!slug) redirect(`/${lang}/boutique`);

  const oeuvre = await dbGetOeuvre(slug);
  if (!oeuvre || oeuvre.prix == null || !oeuvre.disponible) redirect(`/${lang}/boutique/${slug}`);

  const titre = lang === "fr" ? oeuvre.titre : oeuvre.titre_en;

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-serif text-3xl text-[#2C2A27] font-light mb-10">
          {lang === "fr" ? "Finaliser votre commande" : "Complete your order"}
        </h1>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
          {/* Summary card */}
          <div className="bg-[#FAF7F2] border border-[#EDE5D4] p-6 lg:sticky lg:top-32">
            {oeuvre.image && (
              <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-[#EDE5D4]">
                <Image src={oeuvre.image} alt={titre} fill className="object-cover" sizes="400px" />
              </div>
            )}
            <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-1">{oeuvre.annee}</p>
            <h2 className="font-serif text-2xl text-[#2C2A27] font-light mb-1">{titre}</h2>
            <p className="text-sm text-[#6B6560] mb-4">{oeuvre.technique} · {oeuvre.dimensions}</p>

            <div className="border-t border-[#EDE5D4] pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#A09888] uppercase tracking-wider text-xs">
                  {lang === "fr" ? "Total" : "Total"}
                </span>
                <span className="font-serif text-2xl text-[#2C2A27]">
                  {oeuvre.prix!.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>

            {/* Reassurance mini */}
            <ul className="mt-5 space-y-2 text-xs text-[#6B6560]">
              {[
                lang === "fr" ? "🔒 Paiement 100% sécurisé" : "🔒 100% secure payment",
                lang === "fr" ? "📜 Certificat d'authenticité inclus" : "📜 Certificate of authenticity included",
                lang === "fr" ? "📦 Emballage professionnel" : "📦 Professional packaging",
                lang === "fr" ? "🚚 Livraison assurée" : "🚚 Insured shipping",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Payment options */}
          <div>
            <PaymentSelector
              slug={oeuvre.slug}
              titre={titre}
              prix={oeuvre.prix!}
              lang={lang}
              iban={process.env.BANK_IBAN ?? "— À configurer dans les variables d'environnement —"}
              bic={process.env.BANK_BIC ?? "—"}
              titulaire={process.env.BANK_TITULAIRE ?? "—"}
              chequeLibelle={process.env.CHEQUE_LIBELLE ?? "—"}
              chequeAdresse={process.env.CHEQUE_ADRESSE ?? "—"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
