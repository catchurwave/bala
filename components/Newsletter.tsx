"use client";

import { useState } from "react";

export default function Newsletter({ lang }: { lang: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err" | "exists">("idle");

  const t = {
    fr: {
      title: "Restez informé",
      subtitle: "Nouvelles œuvres, expositions, actualités de l'atelier — directement dans votre boîte mail.",
      placeholder: "Votre adresse email",
      cta: "S'abonner",
      ok: "Merci ! Vous êtes inscrit.",
      err: "Une erreur s'est produite.",
      exists: "Cette adresse est déjà inscrite.",
      legal: "Pas de spam. Désabonnement en un clic.",
    },
    en: {
      title: "Stay informed",
      subtitle: "New works, exhibitions, studio news — straight to your inbox.",
      placeholder: "Your email address",
      cta: "Subscribe",
      ok: "Thank you! You are subscribed.",
      err: "An error occurred.",
      exists: "This address is already subscribed.",
      legal: "No spam. Unsubscribe in one click.",
    },
  }[lang as "fr" | "en"] ?? { title: "", subtitle: "", placeholder: "", cta: "", ok: "", err: "", exists: "", legal: "" };

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lang }),
    });
    if (res.status === 409) { setStatus("exists"); return; }
    setStatus(res.ok ? "ok" : "err");
  }

  return (
    <section className="bg-[#EDE5D4] py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-3">Newsletter</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#2C2A27] font-light mb-4">{t.title}</h2>
        <p className="text-[#6B6560] mb-8 leading-relaxed">{t.subtitle}</p>

        {status === "ok" ? (
          <div className="flex items-center justify-center gap-2 text-[#4A6741]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-serif text-lg italic">{t.ok}</p>
          </div>
        ) : (
          <form onSubmit={handle} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 bg-[#F7F2E8] border border-[#D4C9B6] px-4 py-3 text-[#2C2A27] placeholder-[#A09888] focus:outline-none focus:border-[#C8A96E] transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-[#2C2A27] text-[#F7F2E8] text-xs tracking-widest uppercase px-6 py-3 hover:bg-[#C8A96E] transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {status === "loading" ? "..." : t.cta}
            </button>
          </form>
        )}

        {(status === "err" || status === "exists") && (
          <p className="text-sm text-[#8B4513] mt-3">
            {status === "exists" ? t.exists : t.err}
          </p>
        )}

        <p className="text-xs text-[#A09888] mt-4">{t.legal}</p>
      </div>
    </section>
  );
}
