import { hasLocale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return result;
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const [{ lang }, { session_id }] = await Promise.all([params, searchParams]);
  if (!hasLocale(lang)) notFound();

  const stripe = getStripe();
  const isFr = lang === "fr";

  let session: Stripe.Checkout.Session | null = null;
  if (stripe && session_id) {
    try {
      session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items"],
      });
    } catch {
      // session not found — still show generic success
    }
  }

  const isPaid = session?.payment_status === "paid";
  const customerName = session?.customer_details?.name ?? null;
  const customerEmail = session?.customer_details?.email ?? null;
  const itemName = session?.line_items?.data[0]?.description ?? null;
  const amount = session?.amount_total ?? null;

  const today = new Date();
  const deliveryMin = addBusinessDays(today, 5);
  const deliveryMax = addBusinessDays(today, 12);

  const formatDate = (d: Date) =>
    d.toLocaleDateString(isFr ? "fr-FR" : "en-GB", { day: "numeric", month: "long" });

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-2xl mx-auto px-6">

        {/* Big checkmark */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-[#4A6741]/10 border border-[#4A6741]/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-9 h-9 text-[#4A6741]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl text-[#2C2A27] font-light mb-3">
            {isFr ? "Merci pour votre commande" : "Thank you for your order"}
            {customerName ? `, ${customerName.split(" ")[0]}` : ""}
          </h1>
          {customerEmail && (
            <p className="text-[#6B6560] text-sm">
              {isFr
                ? `Un email de confirmation a été envoyé à ${customerEmail}`
                : `A confirmation email has been sent to ${customerEmail}`}
            </p>
          )}
        </div>

        {/* Order summary */}
        {isPaid && itemName && (
          <div className="bg-[#FAF7F2] border border-[#EDE5D4] p-6 mb-6">
            <h2 className="text-xs tracking-widest uppercase text-[#A09888] mb-4">
              {isFr ? "Votre commande" : "Your order"}
            </h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#2C2A27] font-medium">{itemName}</p>
                <p className="text-xs text-[#A09888] mt-0.5">
                  {isFr ? "Peinture originale · Certificat inclus" : "Original painting · Certificate included"}
                </p>
              </div>
              {amount && (
                <p className="font-serif text-xl text-[#2C2A27]">
                  {(amount / 100).toLocaleString(isFr ? "fr-FR" : "en-GB", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 0,
                  })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Estimated delivery */}
        <div className="bg-[#FAF7F2] border border-[#EDE5D4] p-6 mb-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl mt-0.5">🚚</span>
            <div>
              <h2 className="text-xs tracking-widest uppercase text-[#A09888] mb-1">
                {isFr ? "Livraison estimée" : "Estimated delivery"}
              </h2>
              <p className="text-[#2C2A27] font-medium">
                {isFr
                  ? `Entre le ${formatDate(deliveryMin)} et le ${formatDate(deliveryMax)}`
                  : `Between ${formatDate(deliveryMin)} and ${formatDate(deliveryMax)}`}
              </p>
              <p className="text-xs text-[#6B6560] mt-1">
                {isFr
                  ? "Délai indicatif — vous recevrez un email de suivi dès l'expédition."
                  : "Indicative timeline — you will receive a tracking email once shipped."}
              </p>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-[#FAF7F2] border border-[#EDE5D4] p-6 mb-10">
          <h2 className="text-xs tracking-widest uppercase text-[#A09888] mb-5">
            {isFr ? "Ce qui se passe ensuite" : "What happens next"}
          </h2>
          <ol className="space-y-4">
            {(isFr
              ? [
                  ["📧", "Email de confirmation", "Vous venez de recevoir le récapitulatif de votre commande."],
                  ["🎨", "Préparation par l'artiste", "Jean prépare personnellement votre tableau avec soin."],
                  ["📦", "Emballage professionnel", "Emballage adapté aux œuvres d'art avec protection renforcée."],
                  ["🚚", "Expédition suivie", "Livraison avec numéro de suivi, assurée contre les dommages."],
                  ["📜", "Certificat d'authenticité", "Inclus dans le colis, signé de la main de l'artiste."],
                ]
              : [
                  ["📧", "Confirmation email", "You have just received your order summary."],
                  ["🎨", "Artist preparation", "Jean personally prepares your painting with care."],
                  ["📦", "Professional packaging", "Art-grade packaging with reinforced protection."],
                  ["🚚", "Tracked shipping", "Delivery with tracking number, insured against damage."],
                  ["📜", "Certificate of authenticity", "Included in the parcel, hand-signed by the artist."],
                ]
            ).map(([icon, title, desc], i) => (
              <li key={i} className="flex gap-4">
                <span className="text-xl shrink-0 w-7">{icon}</span>
                <div>
                  <p className="text-sm font-medium text-[#2C2A27]">{title}</p>
                  <p className="text-xs text-[#6B6560] mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link href={`/${lang}/galerie`} className="btn-primary text-center">
            {isFr ? "Retour à la galerie" : "Back to gallery"}
          </Link>
          <Link href={`/${lang}/contact`} className="btn-outline text-center">
            {isFr ? "Nous contacter" : "Contact us"}
          </Link>
        </div>
      </div>
    </div>
  );
}
