"use client";

import { use, useState } from "react";

type Order = {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  items: { name: string; qty: number; amount: number }[];
};

export default function MonComptePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const t = {
    fr: {
      title: "Mon espace",
      subtitle: "Retrouvez vos commandes",
      emailLabel: "Votre adresse email d'achat",
      cta: "Consulter mes commandes",
      loading: "Recherche...",
      noOrders: "Aucune commande trouvée pour cette adresse.",
      ordersTitle: "Vos commandes",
      date: "Date",
      total: "Total",
      status: "Statut",
      paid: "Payée",
      note: "Vous avez une question sur une commande ?",
      contact: "Contacter l'artiste",
    },
    en: {
      title: "My account",
      subtitle: "View your orders",
      emailLabel: "Your purchase email address",
      cta: "View my orders",
      loading: "Searching...",
      noOrders: "No orders found for this address.",
      ordersTitle: "Your orders",
      date: "Date",
      total: "Total",
      status: "Status",
      paid: "Paid",
      note: "Have a question about an order?",
      contact: "Contact the artist",
    },
  }[lang as "fr" | "en"] ?? {} as Record<string, string>;

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrders(null);

    const res = await fetch("/api/mon-compte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      setError(t.noOrders as string);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setOrders(data.orders);
    setLoading(false);
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-4">
            {t.subtitle as string}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#2C2A27] font-light mb-4">
            {t.title as string}
          </h1>
          <div className="w-16 h-px bg-[#C8A96E] mx-auto" />
        </div>

        {/* Email form */}
        <div className="max-w-md mx-auto mb-12">
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#6B6560] mb-2">
                {t.emailLabel as string}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-[#D4C9B6] pb-3 text-[#2C2A27] placeholder-[#A09888] focus:outline-none focus:border-[#C8A96E] transition-colors"
                placeholder="email@exemple.com"
              />
            </div>
            {error && <p className="text-sm text-[#8B4513]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2C2A27] text-[#F7F2E8] text-sm tracking-widest uppercase py-3 hover:bg-[#C8A96E] transition-colors disabled:opacity-60"
            >
              {loading ? (t.loading as string) : (t.cta as string)}
            </button>
          </form>
        </div>

        {/* Orders */}
        {orders !== null && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-[#EDE5D4]">
                <p className="font-serif text-xl italic text-[#6B6560]">
                  {t.noOrders as string}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="font-serif text-2xl text-[#2C2A27] font-light mb-6">
                  {t.ordersTitle as string} ({orders.length})
                </h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-[#EDE5D4] bg-[#F7F2E8]">
                      {/* Order header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-[#EDE5D4] bg-[#EDE5D4]/50">
                        <div>
                          <p className="text-xs text-[#A09888] uppercase tracking-wider">{t.date as string}</p>
                          <p className="text-sm text-[#2C2A27]">
                            {new Date(order.date).toLocaleDateString(
                              lang === "fr" ? "fr-FR" : "en-GB",
                              { day: "numeric", month: "long", year: "numeric" }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#A09888] uppercase tracking-wider">{t.total as string}</p>
                          <p className="font-serif text-lg text-[#2C2A27]">
                            {order.amount.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", {
                              style: "currency",
                              currency: order.currency,
                              minimumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                        <span className="text-xs border border-[#4A6741] text-[#4A6741] px-3 py-1">
                          {t.paid as string}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="px-5 py-4 space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-[#4A4843]">{item.name}</span>
                            <span className="text-[#2C2A27]">
                              {item.amount.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", {
                                style: "currency", currency: order.currency, minimumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Help */}
                <div className="mt-8 text-center text-sm text-[#6B6560]">
                  <p>{t.note as string}</p>
                  <a
                    href={`/${lang}/contact`}
                    className="text-[#C8A96E] underline mt-1 inline-block"
                  >
                    {t.contact as string}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
