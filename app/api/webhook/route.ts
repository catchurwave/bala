import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { dbUpsertOeuvre, dbGetOeuvre } from "@/lib/db";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not set" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${String(err)}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const slug = session.metadata?.slug;
    if (slug && session.payment_status === "paid") {
      const oeuvre = await dbGetOeuvre(slug);
      if (oeuvre) {
        await dbUpsertOeuvre({ ...oeuvre, disponible: false });
      }
    }
  }

  return NextResponse.json({ received: true });
}
