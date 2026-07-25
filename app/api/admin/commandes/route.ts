import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key);
}

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  const { searchParams } = new URL(req.url);
  const starting_after = searchParams.get("cursor") ?? undefined;

  const sessions = await stripe.checkout.sessions.list({
    limit: 25,
    ...(starting_after ? { starting_after } : {}),
    expand: ["data.line_items"],
  });

  const orders = sessions.data.map((s) => ({
    id: s.id,
    created: s.created,
    amount_total: s.amount_total,
    currency: s.currency,
    payment_status: s.payment_status,
    customer_email: s.customer_details?.email ?? null,
    customer_name: s.customer_details?.name ?? null,
    slug: s.metadata?.slug ?? null,
    payment_intent: typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id ?? null,
    items: s.line_items?.data.map((li) => ({
      name: li.description ?? "",
      amount: li.amount_total,
      qty: li.quantity,
    })) ?? [],
  }));

  return NextResponse.json({
    orders,
    has_more: sessions.has_more,
    next_cursor: sessions.data.length > 0 ? sessions.data[sessions.data.length - 1].id : null,
  });
}
