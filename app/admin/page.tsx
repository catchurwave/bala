import { dbGetAllOeuvres } from "@/lib/db";
import Link from "next/link";
import OeuvresTable from "./oeuvres/OeuvresTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let all: Awaited<ReturnType<typeof dbGetAllOeuvres>> = [];
  let dbError = "";

  try {
    all = await dbGetAllOeuvres();
  } catch (e) {
    dbError = String(e);
  }

  if (dbError) {
    return (
      <div className="max-w-xl">
        <h1 className="font-serif text-3xl text-[#F7F2E8] font-light mb-6">Tableau de bord</h1>
        <div className="bg-red-900/20 border border-red-800 p-6 text-sm text-red-300 space-y-4">
          <p className="font-medium">⚠ Base de données non configurée</p>
          <p>Ajoute <code className="bg-red-900/40 px-1">POSTGRES_URL</code> dans <strong>Vercel → Settings → Environment Variables</strong>, puis redéploie.</p>
          <p className="text-red-400 text-xs break-all">{dbError}</p>
        </div>
        <div className="mt-6 bg-[#2C2A27] border border-[#3D3A36] p-4 text-xs text-[#6B6560]">
          Après avoir ajouté les variables et redéployé, va sur{" "}
          <a href="/api/admin/setup" className="text-[#C8A96E] underline" target="_blank">/api/admin/setup</a>{" "}
          pour initialiser les tables.
        </div>
      </div>
    );
  }
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
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
          <Link href="/admin/oeuvres/new" className="bg-[#C8A96E] text-[#1A1917] text-xs sm:text-sm tracking-widest uppercase px-4 sm:px-6 py-3 hover:bg-[#A88748] transition-colors">
            + Ajouter une œuvre
          </Link>
          <Link href="/admin/oeuvres" className="border border-[#3D3A36] text-[#D4C9B6] text-xs sm:text-sm tracking-widest uppercase px-4 sm:px-6 py-3 hover:border-[#C8A96E] hover:text-[#C8A96E] transition-colors">
            Gérer les œuvres
          </Link>
          <Link href="/admin/artiste" className="border border-[#3D3A36] text-[#D4C9B6] text-xs sm:text-sm tracking-widest uppercase px-4 sm:px-6 py-3 hover:border-[#C8A96E] hover:text-[#C8A96E] transition-colors">
            Éditer la biographie
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-xs tracking-widest uppercase text-[#6B6560] mb-4">Œuvres récentes</h2>
        <OeuvresTable oeuvres={all.slice(0, 8)} />
      </div>
    </div>
  );
}
