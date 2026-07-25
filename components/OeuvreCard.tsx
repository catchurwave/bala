import Link from "next/link";
import Image from "next/image";
import type { Oeuvre } from "@/lib/oeuvres";

export default function OeuvreCard({
  oeuvre,
  lang,
  showPrice = false,
}: {
  oeuvre: Oeuvre;
  lang: string;
  showPrice?: boolean;
}) {
  const titre = lang === "fr" ? oeuvre.titre : oeuvre.titre_en;
  const description =
    lang === "fr" ? oeuvre.description : oeuvre.description_en;

  const href = showPrice
    ? `/${lang}/boutique/${oeuvre.slug}`
    : `/${lang}/galerie/${oeuvre.slug}`;

  return (
    <Link href={href} className="group painting-card block">
      <div className="frame">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE5D4]">
          {oeuvre.image ? (
            <Image
              src={oeuvre.image}
              alt={titre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            /* Placeholder when no image yet */
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDE5D4] to-[#D4C9B6]">
              <svg
                className="w-16 h-16 text-[#C8A96E] opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={0.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-[#2C2A27]/0 group-hover:bg-[#2C2A27]/30 transition-all duration-300 flex items-end">
            <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full bg-gradient-to-t from-[#2C2A27]/90 to-transparent p-4">
              <p className="text-[#F7F2E8] text-xs leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>
          </div>

          {/* Sale badge */}
          {showPrice && !oeuvre.disponible && (
            <div className="absolute top-3 right-3 bg-[#2C2A27] text-[#F7F2E8] text-xs px-2 py-1 uppercase tracking-wider">
              Vendue
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 px-1">
        <h3 className="font-serif text-xl text-[#2C2A27] group-hover:text-[#C8A96E] transition-colors">
          {titre}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-[#6B6560]">
            {oeuvre.technique} · {oeuvre.annee}
          </p>
          {showPrice && oeuvre.prix && (
            <p className="text-sm font-medium text-[#4A6741]">
              {oeuvre.prix.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
          )}
        </div>
        <p className="text-xs text-[#A09888] mt-0.5">{oeuvre.dimensions}</p>
      </div>
    </Link>
  );
}
