"use client";

import { use, useState } from "react";

export default function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const t = {
    fr: {
      title: "Contact",
      subtitle: "Prendre contact",
      name: "Votre nom",
      email: "Votre email",
      subject: "Sujet",
      message: "Message",
      send: "Envoyer",
      sending: "Envoi...",
      success: "Message envoyé ! L'artiste vous répondra bientôt.",
      error: "Une erreur s'est produite. Veuillez réessayer.",
      note: "Pour toute question sur une œuvre, une commande, ou une exposition, n'hésitez pas à écrire.",
    },
    en: {
      title: "Contact",
      subtitle: "Get in touch",
      name: "Your name",
      email: "Your email",
      subject: "Subject",
      message: "Message",
      send: "Send",
      sending: "Sending...",
      success: "Message sent! The artist will reply soon.",
      error: "An error occurred. Please try again.",
      note: "For any question about a work, a purchase, or an exhibition, feel free to write.",
    },
  }[lang as "fr" | "en"] ?? {
    title: "Contact", subtitle: "Get in touch", name: "Name", email: "Email",
    subject: "Subject", message: "Message", send: "Send", sending: "Sending...",
    success: "Sent!", error: "Error", note: "",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-4">
            {t.subtitle}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-[#2C2A27] font-light mb-4">
            {t.title}
          </h1>
          <div className="w-16 h-px bg-[#C8A96E] mx-auto mb-6" />
          <p className="text-[#6B6560] max-w-md mx-auto">{t.note}</p>
        </div>

        <div className="max-w-xl mx-auto">
          {status === "sent" ? (
            <div className="text-center py-16 bg-[#EDE5D4]">
              <svg className="w-12 h-12 text-[#4A6741] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-serif text-2xl italic text-[#2C2A27]">{t.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { key: "name", label: t.name, type: "text" },
                { key: "email", label: t.email, type: "email" },
                { key: "subject", label: t.subject, type: "text" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-xs tracking-widest uppercase text-[#6B6560] mb-2">
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-transparent border-b border-[#D4C9B6] pb-3 text-[#2C2A27] placeholder-[#A09888] focus:outline-none focus:border-[#C8A96E] transition-colors"
                    placeholder={label}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs tracking-widest uppercase text-[#6B6560] mb-2">
                  {t.message}
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent border-b border-[#D4C9B6] pb-3 text-[#2C2A27] placeholder-[#A09888] focus:outline-none focus:border-[#C8A96E] transition-colors resize-none"
                  placeholder={t.message}
                />
              </div>

              {status === "error" && (
                <p className="text-red-600 text-sm">{t.error}</p>
              )}

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary"
                >
                  {status === "sending" ? t.sending : t.send}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
