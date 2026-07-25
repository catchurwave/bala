"use client";

import { useState } from "react";

export default function BuyButton({
  slug,
  titre,
  prix,
  lang,
  label,
}: {
  slug: string;
  titre: string;
  prix: number;
  lang: string;
  label: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, titre, prix, lang }),
      });
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-[#2C2A27] text-[#F7F2E8] text-sm tracking-widest uppercase py-4 hover:bg-[#C8A96E] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {lang === "fr" ? "Redirection..." : "Redirecting..."}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
