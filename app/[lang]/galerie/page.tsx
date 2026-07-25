"use client";

import { use, useEffect, useState } from "react";

type OeuvreData = {
  slug: string;
  titre: string;
  titre_en: string;
  annee: number;
  technique: string;
  dimensions: string;
  categorie: string;
  image: string;
  prix?: number;
  disponible: boolean;
  featured: boolean;
  description: string;
  description_en: string;
};

export default function GaleriePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const [oeuvres, setOeuvres] = useState<OeuvreData[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/oeuvres")
      .then((r) => r.json())
      .then(setOeuvres);
  }, []);

  const categories =
    lang === "fr"
      ? { all: "Toutes", paysage: "Paysages", nature: "Nature morte", portrait: "Portraits", marine: "Marines" }
      : { all: "All", paysage: "Landscapes", nature: "Still Life", portrait: "Portraits", marine: "Seascapes" };

  const filtered =
    filter === "all" ? oeuvres : oeuvres.filter((o) => o.categorie === filter);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-7xl text-[#2C2A27] font-light mb-4">
            {lang === "fr" ? "Galerie" : "Gallery"}
          </h1>
          <div className="w-16 h-px bg-[#C8A96E] mx-auto" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-xs tracking-widest uppercase px-5 py-2 border transition-all ${
                filter === key
                  ? "bg-[#2C2A27] text-[#F7F2E8] border-[#2C2A27]"
                  : "border-[#D4C9B6] text-[#6B6560] hover:border-[#C8A96E] hover:text-[#C8A96E]"
              }`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((oeuvre) => {
              const titre = lang === "fr" ? oeuvre.titre : oeuvre.titre_en;
              const description = lang === "fr" ? oeuvre.description : oeuvre.description_en;

              return (
                <div key={oeuvre.slug} className="group painting-card">
                  <div className="frame">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE5D4]">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDE5D4] to-[#D4C9B6]">
                        <svg className="w-16 h-16 text-[#C8A96E] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-[#2C2A27]/0 group-hover:bg-[#2C2A27]/30 transition-all duration-300 flex items-end">
                        <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full bg-gradient-to-t from-[#2C2A27]/90 to-transparent p-4">
                          <p className="text-[#F7F2E8] text-xs leading-relaxed line-clamp-2">{description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 px-1">
                    <h3 className="font-serif text-xl text-[#2C2A27]">{titre}</h3>
                    <p className="text-sm text-[#6B6560] mt-1">{oeuvre.technique} · {oeuvre.annee}</p>
                    <p className="text-xs text-[#A09888] mt-0.5">{oeuvre.dimensions}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
