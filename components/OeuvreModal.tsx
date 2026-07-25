"use client";

import { useEffect } from "react";
import { useModal } from "./ModalContext";
import Image from "next/image";
import Link from "next/link";
import SizeVisualizer from "./SizeVisualizer";

export default function OeuvreModal({ lang }: { lang: string }) {
  const { oeuvre, close } = useModal();

  useEffect(() => {
    if (!oeuvre) return;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [oeuvre, close]);

  if (!oeuvre) return null;

  const titre = lang === "fr" ? oeuvre.titre : oeuvre.titre_en;
  const description = lang === "fr" ? oeuvre.description : oeuvre.description_en;

  const t = {
    fr: { view: "Voir la fiche complète", buy: "Acheter", available: "Disponible", sold: "Vendue", close: "Fermer" },
    en: { view: "View full details", buy: "Buy", available: "Available", sold: "Sold", close: "Close" },
  }[lang as "fr" | "en"] ?? { view: "View", buy: "Buy", available: "Available", sold: "Sold", close: "Close" };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1A1917]/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 bg-[#F7F2E8] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={close}
          aria-label={t.close}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center text-[#6B6560] hover:text-[#2C2A27] bg-[#F7F2E8]/80 rounded-full"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="frame m-6 md:m-0 md:rounded-none">
            <div className="relative aspect-[4/3] bg-[#EDE5D4]">
              {oeuvre.image ? (
                <Image src={oeuvre.image} alt={titre} fill className="object-cover" sizes="50vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDE5D4] to-[#D4C9B6]">
                  <svg className="w-16 h-16 text-[#C8A96E] opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-2">{oeuvre.annee}</p>
              <h2 className="font-serif text-2xl text-[#2C2A27] font-light mb-3">{titre}</h2>
              <p className="text-sm text-[#6B6560] leading-relaxed mb-6">{description}</p>

              <div className="space-y-2 mb-4 border-t border-[#EDE5D4] pt-4">
                {[
                  [lang === "fr" ? "Technique" : "Technique", oeuvre.technique],
                  [lang === "fr" ? "Dimensions" : "Dimensions", oeuvre.dimensions],
                ].map(([k, v]) => v ? (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-[#A09888] text-xs uppercase tracking-wider">{k}</span>
                    <span className="text-[#2C2A27]">{v}</span>
                  </div>
                ) : null)}
              </div>
              {oeuvre.dimensions && (
                <div className="mb-4">
                  <SizeVisualizer dimensions={oeuvre.dimensions} lang={lang} />
                </div>
              )}

              {oeuvre.prix && (
                <div className="flex items-center justify-between mb-6">
                  <p className="font-serif text-3xl text-[#2C2A27]">
                    {oeuvre.prix.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", {
                      style: "currency", currency: "EUR", minimumFractionDigits: 0,
                    })}
                  </p>
                  <span className={`text-xs px-2 py-1 border ${oeuvre.disponible ? "text-[#4A6741] border-[#4A6741]" : "text-[#A09888] border-[#A09888]"}`}>
                    {oeuvre.disponible ? t.available : t.sold}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {oeuvre.prix && oeuvre.disponible && (
                <Link
                  href={`/${lang}/boutique/${oeuvre.slug}`}
                  onClick={close}
                  className="w-full bg-[#2C2A27] text-[#F7F2E8] text-xs tracking-widest uppercase py-3 text-center hover:bg-[#C8A96E] transition-colors"
                >
                  {t.buy}
                </Link>
              )}
              <Link
                href={oeuvre.prix ? `/${lang}/boutique/${oeuvre.slug}` : `/${lang}/galerie`}
                onClick={close}
                className="w-full border border-[#2C2A27] text-[#2C2A27] text-xs tracking-widest uppercase py-3 text-center hover:border-[#C8A96E] hover:text-[#C8A96E] transition-colors"
              >
                {t.view}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
