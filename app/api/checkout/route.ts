import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: "Stripe non configuré (STRIPE_SECRET_KEY manquant)" }, { status: 500 });
  }

  const { slug, titre, prix, lang, embedded } = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.headers.get("origin") ?? "";

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "eur",
        unit_amount: prix * 100,
        product_data: { name: titre, metadata: { slug } },
      },
      quantity: 1,
    },
  ];

  const common: Partial<Stripe.Checkout.SessionCreateParams> = {
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_creation: "always",
    phone_number_collection: { enabled: true },
    shipping_address_collection: {
      allowed_countries: ["FR", "BE", "CH", "LU", "MC", "GB", "DE", "ES", "IT", "NL", "PT", "US", "CA", "AU"],
    },
    billing_address_collection: "required",
    metadata: { slug, lang },
  };

  try {
    if (embedded) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = await (stripe.checkout.sessions.create as any)({
        ...common,
        ui_mode: "embedded_page",
        return_url: `${baseUrl}/${lang}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      });
      return NextResponse.json({ clientSecret: session.client_secret });
    }

    const session = await stripe.checkout.sessions.create({
      ...common,
      success_url: `${baseUrl}/${lang}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${lang}/boutique/${slug}`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe inconnue";
    console.error("[checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
