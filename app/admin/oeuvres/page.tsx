import { dbGetAllOeuvres } from "@/lib/db";
import Link from "next/link";
import OeuvresTable from "./OeuvresTable";

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
        <OeuvresTable oeuvres={oeuvres} />
      )}
    </div>
  );
}
