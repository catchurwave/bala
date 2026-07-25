import { dbGetAllOeuvres } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const all = await dbGetAllOeuvres();
  const vente = all.filter((o) => o.prix != null);
  const vendues = vente.filter((o) => !o.disponible);
  const featured = all.filter((o) => o.featured);

  const stats = [
    { label: "Œuvres totales", value: all.length, color: "text-[#C8A96E]" },
    { label: "En vente", value: vente.filter((o) => o.disponible).length, color: "text-[#4A6741]" },
    { label: "Vendues", value: vendues.length, color: "text-[#7BA3B8]" },
    { label: "En vedette", value: featured.length, color: "text-[#A88748]" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#F7F2E8] font-light">Tableau de bord</h1>
        <p className="text-[#6B6560] text-sm mt-1">Bienvenue dans l&apos;administration du site</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-[#2C2A27] p-6 border border-[#3D3A36]">
            <p className={`font-serif text-4xl font-light ${color}`}>{value}</p>
            <p className="text-xs tracking-wider text-[#6B6560] mt-2 uppercase">{label}</p>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <h2 className="text-xs tracking-widest uppercase text-[#6B6560] mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/oeuvres/new" className="bg-[#C8A96E] text-[#1A1917] text-sm tracking-widest uppercase px-6 py-3 hover:bg-[#A88748] transition-colors">
            + Ajouter une œuvre
          </Link>
          <Link href="/admin/oeuvres" className="border border-[#3D3A36] text-[#D4C9B6] text-sm tracking-widest uppercase px-6 py-3 hover:border-[#C8A96E] hover:text-[#C8A96E] transition-colors">
            Gérer les œuvres
          </Link>
          <Link href="/admin/artiste" className="border border-[#3D3A36] text-[#D4C9B6] text-sm tracking-widest uppercase px-6 py-3 hover:border-[#C8A96E] hover:text-[#C8A96E] transition-colors">
            Éditer la biographie
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-xs tracking-widest uppercase text-[#6B6560] mb-4">Œuvres récentes</h2>
        <div className="bg-[#2C2A27] border border-[#3D3A36] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3D3A36]">
                {["Titre", "Année", "Catégorie", "Prix", "Statut"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#6B6560]">{h}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {all.slice(0, 8).map((o) => (
                <tr key={o.slug} className="border-b border-[#3D3A36]/50 hover:bg-[#3D3A36]/30 transition-colors">
                  <td className="px-4 py-3 text-[#D4C9B6] font-medium">{o.titre}</td>
                  <td className="px-4 py-3 text-[#6B6560]">{o.annee}</td>
                  <td className="px-4 py-3 text-[#6B6560]">{o.categorie}</td>
                  <td className="px-4 py-3 text-[#C8A96E]">{o.prix ? `${o.prix} €` : "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 ${o.disponible ? "text-[#4A6741] bg-[#4A6741]/10" : "text-[#6B6560] bg-[#6B6560]/10"}`}>
                      {o.disponible ? "Disponible" : "Vendue"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/oeuvres/${o.slug}`} className="text-xs text-[#C8A96E] hover:underline">Éditer</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
