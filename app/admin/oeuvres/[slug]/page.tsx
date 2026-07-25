import { getOeuvre } from "@/lib/oeuvres";
import { notFound } from "next/navigation";
import OeuvreForm from "../OeuvreForm";

export const dynamic = "force-dynamic";

export default async function EditOeuvrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const oeuvre = getOeuvre(slug);
  if (!oeuvre) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#F7F2E8] font-light">Éditer</h1>
        <p className="text-[#C8A96E] text-sm mt-1 font-serif italic">{oeuvre.titre}</p>
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
