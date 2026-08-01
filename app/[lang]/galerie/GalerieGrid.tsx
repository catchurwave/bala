"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { OeuvreRow } from "@/lib/db";
import { useModal } from "@/components/ModalContext";

const CATEGORIES_FR = { all: "Toutes", paysage: "Paysages", nature: "Nature morte", portrait: "Portraits", marine: "Marines" };
const CATEGORIES_EN = { all: "All", paysage: "Landscapes", nature: "Still Life", portrait: "Portraits", marine: "Seascapes" };

export default function GalerieGrid({ oeuvres, lang }: { oeuvres: OeuvreRow[]; lang: string }) {
  const [filter, setFilter] = useState("all");
  const { open } = useModal();

  const categories = lang === "fr" ? CATEGORIES_FR : CATEGORIES_EN;
  const filtered = filter === "all" ? oeuvres : oeuvres.filter((o) => o.categorie === filter);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={filter === key ? "btn-primary btn-sm" : "btn-outline btn-sm"}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-[#A09888]">
          <p className="font-serif text-2xl italic">
            {lang === "fr" ? "Aucune œuvre dans cette catégorie" : "No works in this category"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((o) => {
            const titre = lang === "fr" ? o.titre : o.titre_en;
            const description = lang === "fr" ? o.description : o.description_en;

            return (
              <div key={o.slug} className="group painting-card bg-[#FDFAF5] shadow-[0_4px_24px_rgba(44,42,39,0.09)] p-4 hover:shadow-[0_12px_40px_rgba(44,42,39,0.15)]">
                <div className="frame">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F2E8]">
                    {o.image ? (
                      <Image
                        src={o.image}
                        alt={titre}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDE5D4] to-[#D4C9B6]">
                        <svg className="w-16 h-16 text-[#C8A96E] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Status dot — only for paintings with price */}
                    {o.prix != null && (
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ring-2 ring-white/80 ${
                            o.disponible ? "bg-[#4A6741]" : "bg-red-500"
                          }`}
                        />
                        <span className="text-[10px] uppercase tracking-wider text-white/90 font-medium drop-shadow">
                          {o.disponible
                            ? (lang === "fr" ? "En vente" : "For sale")
                            : (lang === "fr" ? "Vendu" : "Sold")}
                        </span>
                      </div>
                    )}
                    {/* Hover overlay with quick-view */}
                    <div className="absolute inset-0 bg-[#2C2A27]/0 group-hover:bg-[#2C2A27]/40 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                      <button
                        onClick={() => open(o)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 btn-primary btn-sm"
                      >
                        {lang === "fr" ? "Aperçu rapide" : "Quick view"}
                      </button>
                      <Link
                        href={`/${lang}/galerie/${o.slug}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#F7F2E8] text-[10px] tracking-widest uppercase border border-white/60 px-4 py-2 hover:border-[#C96844] hover:text-[#C96844] transition-colors"
                      >
                        {lang === "fr" ? "Voir détail" : "View detail"}
                      </Link>
                    </div>
                  </div>
                </div>
                <Link href={`/${lang}/galerie/${o.slug}`} className="mt-4 px-1 pb-1 block">
                  <h3 className="font-serif text-xl text-[#2C2A27] group-hover:text-[#C8A96E] transition-colors">{titre}</h3>
                  <p className="text-sm text-[#6B6560] mt-1">{o.technique} · {o.annee}</p>
                  <p className="text-xs text-[#A09888] mt-0.5">{o.dimensions}</p>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
