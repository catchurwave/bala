import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key);
}

function validateEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !validateEmail(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const stripe = getStripe();

  const customers = await stripe.customers.search({
    query: `email:'${email.toLowerCase()}'`,
    limit: 1,
  });

  if (customers.data.length === 0) {
    return NextResponse.json({ orders: [] });
  }

  const customer = customers.data[0];

  const sessions = await stripe.checkout.sessions.list({
    customer: customer.id,
    limit: 20,
    expand: ["data.line_items"],
  });

  const orders = sessions.data
    .filter((s) => s.payment_status === "paid")
    .map((s) => ({
      id: s.id,
      date: new Date(s.created * 1000).toISOString(),
      amount: s.amount_total ? s.amount_total / 100 : 0,
      currency: s.currency?.toUpperCase() ?? "EUR",
      status: "paid",
      items:
        s.line_items?.data.map((li) => ({
          name: li.description ?? li.price?.product ?? "Œuvre",
          qty: li.quantity ?? 1,
          amount: li.amount_total ? li.amount_total / 100 : 0,
        })) ?? [],
    }));

  return NextResponse.json({ orders });
}
