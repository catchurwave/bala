import { getAdminSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";
import RefundButton from "./RefundButton";

export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export default async function CommandeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getAdminSession())) redirect("/admin/login");

  const { id } = await params;
  const stripe = getStripe();
  if (!stripe) return <div className="text-red-400">STRIPE_SECRET_KEY manquant</div>;

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(id, {
      expand: ["line_items", "customer", "payment_intent"],
    });
  } catch {
    notFound();
  }

  const pi = typeof session.payment_intent === "object" ? session.payment_intent as Stripe.PaymentIntent : null;
  const piId = pi?.id ?? (typeof session.payment_intent === "string" ? session.payment_intent : null);

  const refunds = piId
    ? (await stripe.refunds.list({ payment_intent: piId, limit: 10 })).data
    : [];

  const totalRefunded = refunds.filter((r) => r.status === "succeeded").reduce((s, r) => s + r.amount, 0);
  const isFullyRefunded = session.amount_total !== null && totalRefunded >= session.amount_total;
  const canRefund = session.payment_status === "paid" && !isFullyRefunded;

  const shipping = session.collected_information?.shipping_details ?? null;
  const billing = session.customer_details;

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <Link href="/admin/commandes" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#6B6560] hover:text-[#C8A96E] transition-colors mb-8">
        ← Retour aux commandes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#F7F2E8] font-light">Commande</h1>
          <p className="text-[#4A4843] text-xs mt-1 font-mono">{session.id}</p>
        </div>
        <div className="flex items-center gap-3">
          {piId && (
            <a
              href={`https://dashboard.stripe.com/payments/${piId}`}
              target="_blank"
              className="text-xs border border-[#3D3A36] text-[#6B6560] px-4 py-2 hover:border-[#C8A96E] hover:text-[#C8A96E] transition-colors"
            >
              ↗ Voir sur Stripe
            </a>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Status + amount */}
        <div className="bg-[#2C2A27] border border-[#3D3A36] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase text-[#6B6560] mb-1">Montant</p>
              <p className="font-serif text-4xl text-[#C8A96E] font-light">
                {session.amount_total ? `${(session.amount_total / 100).toLocaleString("fr-FR")} €` : "—"}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-xs px-3 py-1 inline-block mb-2 ${
                session.payment_status === "paid"
                  ? isFullyRefunded ? "text-[#A09888] bg-[#A09888]/10" : "text-[#4A6741] bg-[#4A6741]/10"
                  : "text-[#6B6560] bg-[#6B6560]/10"
              }`}>
                {session.payment_status === "paid"
                  ? isFullyRefunded ? "Remboursée" : "Payée"
                  : "Non payée"}
              </div>
              <p className="text-xs text-[#4A4843]">
                {new Date(session.created * 1000).toLocaleDateString("fr-FR", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          {totalRefunded > 0 && (
            <div className="mt-4 pt-4 border-t border-[#3D3A36]">
              <p className="text-xs text-[#A09888]">
                Remboursé : <span className="text-[#D4C9B6]">{(totalRefunded / 100).toLocaleString("fr-FR")} €</span>
              </p>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="bg-[#2C2A27] border border-[#3D3A36] p-6">
          <h2 className="text-xs tracking-widest uppercase text-[#6B6560] mb-4">Articles</h2>
          {session.line_items?.data.map((li) => (
            <div key={li.id} className="flex justify-between items-center py-2 border-b border-[#3D3A36]/40 last:border-0">
              <div>
                <p className="text-[#D4C9B6]">{li.description}</p>
                <p className="text-xs text-[#4A4843]">Qté : {li.quantity}</p>
              </div>
              <p className="text-[#C8A96E]">{li.amount_total ? `${(li.amount_total / 100).toLocaleString("fr-FR")} €` : "—"}</p>
            </div>
          ))}
          {session.metadata?.slug && (
            <div className="mt-4 pt-4 border-t border-[#3D3A36]/40">
              <Link
                href={`/admin/oeuvres/${session.metadata.slug}`}
                className="text-xs text-[#C8A96E] hover:underline"
              >
                → Voir / éditer cette œuvre
              </Link>
            </div>
          )}
        </div>

        {/* Customer */}
        <div className="bg-[#2C2A27] border border-[#3D3A36] p-6">
          <h2 className="text-xs tracking-widest uppercase text-[#6B6560] mb-4">Client</h2>
          <div className="space-y-2 text-sm">
            {billing?.name && <Row label="Nom" value={billing.name} />}
            {billing?.email && <Row label="Email" value={billing.email} />}
            {billing?.phone && <Row label="Téléphone" value={billing.phone} />}
          </div>
        </div>

        {/* Shipping */}
        {shipping?.address && (
          <div className="bg-[#2C2A27] border border-[#3D3A36] p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#6B6560] mb-4">Adresse de livraison</h2>
            <address className="not-italic text-sm text-[#D4C9B6] leading-relaxed">
              {shipping.name && <div className="font-medium">{shipping.name}</div>}
              {shipping.address.line1 && <div>{shipping.address.line1}</div>}
              {shipping.address.line2 && <div>{shipping.address.line2}</div>}
              <div>
                {[shipping.address.postal_code, shipping.address.city].filter(Boolean).join(" ")}
              </div>
              {shipping.address.state && <div>{shipping.address.state}</div>}
              {shipping.address.country && <div className="text-[#A09888]">{shipping.address.country}</div>}
            </address>
          </div>
        )}

        {/* Billing address */}
        {billing?.address && (
          <div className="bg-[#2C2A27] border border-[#3D3A36] p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#6B6560] mb-4">Adresse de facturation</h2>
            <address className="not-italic text-sm text-[#D4C9B6] leading-relaxed">
              {billing.address.line1 && <div>{billing.address.line1}</div>}
              {billing.address.line2 && <div>{billing.address.line2}</div>}
              <div>{[billing.address.postal_code, billing.address.city].filter(Boolean).join(" ")}</div>
              {billing.address.country && <div className="text-[#A09888]">{billing.address.country}</div>}
            </address>
          </div>
        )}

        {/* Refunds history */}
        {refunds.length > 0 && (
          <div className="bg-[#2C2A27] border border-[#3D3A36] p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#6B6560] mb-4">Remboursements</h2>
            <div className="space-y-2">
              {refunds.map((r) => (
                <div key={r.id} className="flex justify-between items-center text-sm py-2 border-b border-[#3D3A36]/40 last:border-0">
                  <div>
                    <p className="text-[#D4C9B6]">{new Date(r.created * 1000).toLocaleDateString("fr-FR")}</p>
                    <p className="text-xs text-[#4A4843]">{r.reason ?? "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#C8A96E]">{(r.amount / 100).toLocaleString("fr-FR")} €</p>
                    <span className={`text-xs ${r.status === "succeeded" ? "text-[#4A6741]" : "text-[#A09888]"}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Refund action */}
        {canRefund && (
          <div className="bg-[#2C2A27] border border-[#3D3A36] p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#6B6560] mb-4">Rembourser</h2>
            <RefundButton
              sessionId={session.id}
              maxAmount={(session.amount_total ?? 0) / 100}
              alreadyRefunded={totalRefunded / 100}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#A09888] text-xs uppercase tracking-wider">{label}</span>
      <span className="text-[#D4C9B6]">{value}</span>
    </div>
  );
}
