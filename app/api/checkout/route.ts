import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const { slug, titre, prix, lang } = await req.json();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.headers.get("origin") ?? "";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: prix * 100,
          product_data: { name: titre, metadata: { slug } },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_creation: "always",
    phone_number_collection: { enabled: true },
    shipping_address_collection: {
      allowed_countries: ["FR", "BE", "CH", "LU", "MC", "GB", "DE", "ES", "IT", "NL", "PT", "US", "CA", "AU"],
    },
    billing_address_collection: "required",
    success_url: `${baseUrl}/${lang}/boutique/${slug}?success=1`,
    cancel_url: `${baseUrl}/${lang}/boutique/${slug}?cancel=1`,
    metadata: { slug, lang },
  });

  return NextResponse.json({ url: session.url });
}
