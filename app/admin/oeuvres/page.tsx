import { dbGetAllOeuvres } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OeuvresListPage() {
  let oeuvres: Awaited<ReturnType<typeof dbGetAllOeuvres>> = [];
  try {
    oeuvres = await dbGetAllOeuvres();
  } catch {
    return (
      <div className="bg-red-900/20 border border-red-800 p-6 text-sm text-red-300">
        <p className="font-medium">⚠ DB non configurée — lance <code>/api/admin/setup</code> d&apos;abord.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#F7F2E8] font-light">Œuvres</h1>
          <p className="text-[#6B6560] text-sm mt-1">{oeuvres.length} tableau{oeuvres.length > 1 ? "x" : ""}</p>
        </div>
        <Link href="/admin/oeuvres/new" className="bg-[#C8A96E] text-[#1A1917] text-xs sm:text-sm tracking-widest uppercase px-4 sm:px-6 py-3 hover:bg-[#A88748] transition-colors shrink-0">
          + Ajouter
        </Link>
      </div>

      {oeuvres.length === 0 ? (
        <div className="bg-[#2C2A27] border border-[#3D3A36] p-12 text-center">
          <p className="font-serif text-xl italic text-[#6B6560]">Aucun tableau pour l&apos;instant</p>
          <Link href="/admin/oeuvres/new" className="mt-4 inline-block text-[#C8A96E] text-sm underline">
            Ajouter le premier tableau
          </Link>
        </div>
      ) : (
        <div className="bg-[#2C2A27] border border-[#3D3A36] overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-[#3D3A36]">
                {["Titre", "Année", "Catégorie", "Prix", "Vedette", "Statut", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#6B6560] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {oeuvres.map((o) => (
                <tr key={o.slug} className="border-b border-[#3D3A36]/40 hover:bg-[#3D3A36]/30 transition-colors">
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
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/oeuvres/${o.slug}`} className="text-xs text-[#C8A96E] hover:underline">Éditer →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
