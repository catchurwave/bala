import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function statusBadge(ps: string) {
  const map: Record<string, string> = {
    paid: "text-[#4A6741] bg-[#4A6741]/10",
    unpaid: "text-[#A09888] bg-[#A09888]/10",
    no_payment_required: "text-[#7BA3B8] bg-[#7BA3B8]/10",
  };
  const labels: Record<string, string> = { paid: "Payée", unpaid: "Non payée", no_payment_required: "Gratuite" };
  return { cls: map[ps] ?? "text-[#6B6560] bg-[#6B6560]/10", label: labels[ps] ?? ps };
}

export default async function CommandesPage() {
  if (!(await getAdminSession())) redirect("/admin/login");

  const stripe = getStripe();

  if (!stripe) {
    return (
      <div className="bg-red-900/20 border border-red-800 p-6 text-sm text-red-300">
        <p className="font-medium">⚠ STRIPE_SECRET_KEY non configurée</p>
      </div>
    );
  }

  let sessions: Stripe.Checkout.Session[] = [];
  let hasMore = false;
  let error = "";

  try {
    const res = await stripe.checkout.sessions.list({
      limit: 50,
      expand: ["data.line_items"],
    });
    sessions = res.data;
    hasMore = res.has_more;
  } catch (e) {
    error = String(e);
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 p-6 text-sm text-red-300">
        <p className="font-medium">Erreur Stripe</p>
        <p className="text-xs mt-2 break-all">{error}</p>
      </div>
    );
  }

  const paid = sessions.filter((s) => s.payment_status === "paid");
  const totalRevenue = paid.reduce((sum, s) => sum + (s.amount_total ?? 0), 0) / 100;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#F7F2E8] font-light">Commandes</h1>
        <p className="text-[#6B6560] text-sm mt-1">{sessions.length} session{sessions.length > 1 ? "s" : ""} · {paid.length} payée{paid.length > 1 ? "s" : ""}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { label: "Commandes payées", value: paid.length, color: "text-[#4A6741]" },
          { label: "Chiffre d'affaires", value: `${totalRevenue.toLocaleString("fr-FR")} €`, color: "text-[#C8A96E]" },
          { label: "En attente", value: sessions.filter((s) => s.payment_status === "unpaid").length, color: "text-[#A09888]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#2C2A27] border border-[#3D3A36] p-5">
            <p className={`font-serif text-3xl font-light ${color}`}>{value}</p>
            <p className="text-xs tracking-widest uppercase text-[#6B6560] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {sessions.length === 0 ? (
        <div className="bg-[#2C2A27] border border-[#3D3A36] p-12 text-center">
          <p className="font-serif text-xl italic text-[#6B6560]">Aucune commande pour l&apos;instant</p>
        </div>
      ) : (
        <div className="bg-[#2C2A27] border border-[#3D3A36] overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#3D3A36]">
                {["Date", "Client", "Tableau", "Montant", "Statut", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#6B6560] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => {
                const { cls, label } = statusBadge(s.payment_status);
                const itemName = s.line_items?.data[0]?.description ?? s.metadata?.slug ?? "—";
                return (
                  <tr key={s.id} className="border-b border-[#3D3A36]/40 hover:bg-[#3D3A36]/30 transition-colors">
                    <td className="px-4 py-3 text-[#6B6560] whitespace-nowrap">
                      {new Date(s.created * 1000).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[#D4C9B6]">{s.customer_details?.name ?? "—"}</div>
                      <div className="text-[#4A4843] text-xs">{s.customer_details?.email ?? ""}</div>
                    </td>
                    <td className="px-4 py-3 text-[#A09888] text-xs">{itemName}</td>
                    <td className="px-4 py-3 text-[#C8A96E] whitespace-nowrap font-medium">
                      {s.amount_total ? `${(s.amount_total / 100).toLocaleString("fr-FR")} €` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 ${cls}`}>{label}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/commandes/${s.id}`} className="text-xs text-[#C8A96E] hover:underline whitespace-nowrap">
                        Détail →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && (
        <p className="text-xs text-[#4A4843] text-center mt-6">
          Plus de 50 commandes — ouvre le <a href="https://dashboard.stripe.com/payments" target="_blank" className="text-[#C8A96E] underline">Dashboard Stripe</a> pour tout voir.
        </p>
      )}
    </div>
  );
}
