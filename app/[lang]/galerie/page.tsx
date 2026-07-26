import { hasLocale } from "@/lib/dictionaries";
import { dbGetAllOeuvres } from "@/lib/db";
import { notFound } from "next/navigation";
import GalerieGrid from "./GalerieGrid";
import { BrushStroke, Diamond } from "@/components/Ornament";

export const dynamic = "force-dynamic";

export default async function GaleriePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const oeuvres = await dbGetAllOeuvres();

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Diamond />
          </div>
          <p className="text-xs tracking-[0.35em] uppercase text-[#C8A96E] mb-3">
            {lang === "fr" ? "L'atelier de Bala" : "Bala's Atelier"}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-[#2C2A27] font-light mb-4">
            {lang === "fr" ? "Galerie" : "Gallery"}
          </h1>
          <div className="flex justify-center">
            <BrushStroke width={200} />
          </div>
        </div>

        <GalerieGrid oeuvres={oeuvres} lang={lang} />
      </div>
    </div>
  );
}
