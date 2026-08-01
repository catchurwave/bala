"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { OeuvreRow } from "@/lib/db";

export default function OeuvresCarousel({
  oeuvres,
  lang,
  showPrice = false,
  title,
}: {
  oeuvres: OeuvreRow[];
  lang: string;
  showPrice?: boolean;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!ref.current) return;
    const card = ref.current.querySelector("[data-card]") as HTMLElement | null;
    const offset = card ? card.offsetWidth + 24 : 324;
    ref.current.scrollBy({ left: dir === "right" ? offset : -offset, behavior: "smooth" });
  }

  if (oeuvres.length === 0) return null;

  return (
    <section className="mt-24 border-t border-[#EDE5D4] pt-16">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-serif text-3xl text-[#2C2A27] font-light">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 border border-[#C8A96E] text-[#C8A96E] hover:bg-[#C8A96E] hover:text-[#F7F2E8] transition-colors flex items-center justify-center text-lg"
            aria-label="Précédent"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 border border-[#C8A96E] text-[#C8A96E] hover:bg-[#C8A96E] hover:text-[#F7F2E8] transition-colors flex items-center justify-center text-lg"
            aria-label="Suivant"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {oeuvres.map((o) => {
          const titre = lang === "fr" ? o.titre : o.titre_en;
          const href = showPrice
            ? `/${lang}/boutique/${o.slug}`
            : `/${lang}/galerie/${o.slug}`;
          return (
            <Link
              key={o.slug}
              href={href}
              data-card=""
              className="group painting-card flex-none w-[260px] sm:w-[300px] snap-start bg-[#FDFAF5] shadow-[0_4px_20px_rgba(44,42,39,0.08)] p-3"
            >
              <div className="frame">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F2E8]">
                  {o.image ? (
                    <Image
                      src={o.image}
                      alt={titre}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                      sizes="300px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#C8A96E] opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {showPrice && !o.disponible && (
                    <div className="absolute top-2 right-2 bg-[#2C2A27] text-[#F7F2E8] text-[10px] px-2 py-0.5 uppercase tracking-wider">
                      {lang === "fr" ? "Vendu" : "Sold"}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 px-1 pb-1">
                <h3 className="font-serif text-base text-[#2C2A27] group-hover:text-[#C96844] transition-colors leading-tight">
                  {titre}
                </h3>
                <p className="text-xs text-[#A09888] mt-0.5">{o.dimensions}</p>
                {showPrice && o.prix != null && (
                  <p className="text-sm font-medium text-[#4A6741] mt-1">
                    {o.prix.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 0,
                    })}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
