import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export async function POST(req: NextRequest) {
  const { slug, titre, prix, lang } = await req.json();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.headers.get("origin") ?? "";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: prix * 100,
          product_data: {
            name: titre,
            metadata: { slug },
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/${lang}/boutique/${slug}?success=1`,
    cancel_url: `${baseUrl}/${lang}/boutique/${slug}?cancel=1`,
    metadata: { slug, lang },
  });

  return NextResponse.json({ url: session.url });
}
