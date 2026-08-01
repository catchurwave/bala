import { dbGetOeuvre } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import OeuvreForm from "../OeuvreForm";

export const dynamic = "force-dynamic";

export default async function EditOeuvrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const oeuvre = await dbGetOeuvre(slug);
  if (!oeuvre) notFound();

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#F7F2E8] font-light">Éditer</h1>
          <p className="text-[#C8A96E] text-sm mt-1 font-serif italic">{oeuvre.titre}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/fr/galerie/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase border border-[#C8A96E] text-[#C8A96E] px-4 py-2 hover:bg-[#C8A96E] hover:text-[#1A1917] transition-colors"
          >
            ↗ Voir le tableau
          </Link>
          {oeuvre.prix != null && (
            <Link
              href={`/fr/boutique/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase border border-[#4A6741] text-[#4A6741] px-4 py-2 hover:bg-[#4A6741] hover:text-[#F7F2E8] transition-colors"
            >
              ↗ Voir en boutique
            </Link>
          )}
        </div>
      </div>
      <OeuvreForm
        mode="edit"
        initial={{
          slug: oeuvre.slug,
          titre: oeuvre.titre,
          titre_en: oeuvre.titre_en,
          annee: oeuvre.annee,
          technique: oeuvre.technique,
          dimensions: oeuvre.dimensions,
          categorie: oeuvre.categorie,
          image: oeuvre.image,
          prix: oeuvre.prix ? String(oeuvre.prix) : "",
          disponible: oeuvre.disponible,
          featured: oeuvre.featured,
          description: oeuvre.description,
          description_en: oeuvre.description_en,
        }}
      />
    </div>
  );
}
