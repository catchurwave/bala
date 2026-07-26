"use client";

import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useCallback } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, titre, prix, lang, embedded: true }),
    });
    const { clientSecret } = await res.json();
    return clientSecret as string;
  }, [slug, titre, prix, lang]);

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
