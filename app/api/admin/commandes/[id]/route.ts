import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import Stripe from "stripe";
import { dbGetOeuvre, dbUpsertOeuvre } from "@/lib/db";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.retrieve(id, {
    expand: ["line_items", "customer", "payment_intent"],
  });

  const pi = typeof session.payment_intent === "object" ? session.payment_intent : null;
  const charge = pi && "latest_charge" in pi
    ? (typeof pi.latest_charge === "object" ? pi.latest_charge : null)
    : null;

  const refunds = pi?.id
    ? (await stripe.refunds.list({ payment_intent: pi.id, limit: 10 })).data
    : [];

  return NextResponse.json({
    id: session.id,
    created: session.created,
    amount_total: session.amount_total,
    currency: session.currency,
    payment_status: session.payment_status,
    status: session.status,
    customer_email: session.customer_details?.email ?? null,
    customer_name: session.customer_details?.name ?? null,
    customer_phone: session.customer_details?.phone ?? null,
    shipping: session.collected_information?.shipping_details ?? null,
    billing: session.customer_details?.address ?? null,
    slug: session.metadata?.slug ?? null,
    payment_intent_id: pi?.id ?? null,
    charge_id: typeof pi?.latest_charge === "string" ? pi.latest_charge : charge?.id ?? null,
    receipt_url: charge && "receipt_url" in charge ? charge.receipt_url : null,
    items: session.line_items?.data.map((li) => ({
      name: li.description ?? "",
      amount: li.amount_total,
      qty: li.quantity,
    })) ?? [],
    refunds: refunds.map((r) => ({
      id: r.id,
      amount: r.amount,
      status: r.status,
      created: r.created,
      reason: r.reason,
    })),
  });
}

// POST → issue refund
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { amount, reason = "requested_by_customer", restore_stock = true } = await req.json();
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.retrieve(id, {
    expand: ["payment_intent"],
  });

  const pi = typeof session.payment_intent === "object" ? session.payment_intent : null;
  const piId = pi?.id ?? (typeof session.payment_intent === "string" ? session.payment_intent : null);
  if (!piId) return NextResponse.json({ error: "No payment intent" }, { status: 400 });

  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: piId,
    reason: reason as Stripe.RefundCreateParams.Reason,
  };
  if (amount) refundParams.amount = Math.round(amount * 100);

  const refund = await stripe.refunds.create(refundParams);

  // Re-stock the painting if fully refunded
  if (restore_stock && !amount && session.metadata?.slug) {
    const oeuvre = await dbGetOeuvre(session.metadata.slug);
    if (oeuvre) await dbUpsertOeuvre({ ...oeuvre, disponible: true });
  }

  return NextResponse.json({ ok: true, refund: { id: refund.id, amount: refund.amount, status: refund.status } });
}
