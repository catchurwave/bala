"use client";

import { useRouter } from "next/navigation";
import type { OeuvreRow } from "@/lib/db";

export default function OeuvresTable({ oeuvres }: { oeuvres: OeuvreRow[] }) {
  const router = useRouter();

  return (
    <div className="bg-[#2C2A27] border border-[#3D3A36] overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="border-b border-[#3D3A36]">
            {["Titre", "Année", "Catégorie", "Prix", "Vedette", "Statut"].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#6B6560] whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {oeuvres.map((o) => (
            <tr
              key={o.slug}
              onClick={() => router.push(`/admin/oeuvres/${o.slug}`)}
              className="border-b border-[#3D3A36]/40 hover:bg-[#3D3A36]/50 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3">
                <div className="text-[#D4C9B6] font-medium">{o.titre}</div>
                <div className="text-[#4A4843] text-xs mt-0.5">{o.titre_en}</div>
              </td>
              <td className="px-4 py-3 text-[#6B6560]">{o.annee}</td>
              <td className="px-4 py-3 text-[#6B6560]">{o.categorie}</td>
              <td className="px-4 py-3 text-[#C8A96E] whitespace-nowrap">{o.prix ? `${o.prix} €` : "—"}</td>
              <td className="px-4 py-3 text-center">
                {o.featured ? <span className="text-[#C8A96E]">★</span> : <span className="text-[#3D3A36]">☆</span>}
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 ${o.disponible ? "text-[#4A6741] bg-[#4A6741]/10" : "text-[#6B6560] bg-[#6B6560]/10"}`}>
                  {o.disponible ? "Disponible" : "Vendue"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
