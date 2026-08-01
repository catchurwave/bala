"use client";

import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useCallback, useState } from "react";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

export default function CheckoutEmbed({
  slug,
  titre,
  prix,
  lang,
}: {
  slug: string;
  titre: string;
  prix: number;
  lang: string;
}) {
  const [error, setError] = useState("");

  const fetchClientSecret = useCallback(async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, titre, prix, lang, embedded: true }),
      });
      const json = await res.json();
      if (!res.ok || !json.clientSecret) {
        setError(json.error ?? "Erreur lors de l'initialisation du paiement.");
        return "";
      }
      return json.clientSecret as string;
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      return "";
    }
  }, [slug, titre, prix, lang]);

  if (!stripePromise) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 text-sm">
        <p className="font-medium mb-1">Paiement non configuré</p>
        <p>Les clés Stripe ne sont pas définies. Veuillez les ajouter dans les variables d&apos;environnement Vercel.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 text-sm">
        <p className="font-medium mb-1">Erreur de paiement</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
