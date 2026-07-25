import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dbGetBio } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ArtistePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const savedBio = await dbGetBio();

  const bio = {
    fr: {
      intro: savedBio?.intro_fr || "Né dans une famille passionnée d'art, Jean Dupont a commencé à peindre dès l'enfance, guidé par l'admiration de son père pour les grands maîtres. C'est la découverte de l'œuvre d'Alfred Sisley qui a été déterminante : la lumière douce, les paysages ruraux baignés de brume, les reflets sur l'eau.",
      style: savedBio?.style_fr || "Son style s'inscrit dans la tradition impressionniste, avec une touche personnelle qui privilégie la chaleur des ocres et la vibration des bleus. Chaque tableau est une tentative de capturer l'instant fugace — une lumière particulière, une heure magique, une atmosphère unique.",
      influences: savedBio?.influences_fr || "Sisley, Monet, Pissarro — les grands noms de l'impressionnisme ont nourri sa vision. Mais c'est dans la nature elle-même, dans les bords de Seine, les forêts automnes, les ports bretons, qu'il puise son inspiration première.",
      today: savedBio?.aujourdhui_fr || "Aujourd'hui, il peint dans son atelier et sur le motif, fidèle à la tradition impressionniste du plein air. Ses œuvres font partie de collections privées en France et à l'étranger.",
    },
    en: {
      intro: savedBio?.intro_en || "Born into a family passionate about art, Jean Dupont began painting in childhood, guided by his father's admiration for the great masters. It was the discovery of Alfred Sisley's work that proved decisive: the soft light, rural landscapes bathed in mist, reflections on water.",
      style: savedBio?.style_en || "His style follows the Impressionist tradition, with a personal touch that favours the warmth of ochres and the vibration of blues. Each painting is an attempt to capture the fleeting moment — a particular light, a magic hour, a unique atmosphere.",
      influences: savedBio?.influences_en || "Sisley, Monet, Pissarro — the great names of Impressionism have nourished his vision. But it is in nature itself, along the banks of the Seine, in autumn forests, in Breton harbours, that he finds his primary inspiration.",
      today: savedBio?.aujourdhui_en || "Today he paints in his studio and en plein air, faithful to the Impressionist outdoor tradition. His works are held in private collections in France and abroad.",
    },
  };

  const artistName = savedBio?.nom_complet || "Jean Dupont";

  const t = bio[lang as "fr" | "en"];

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-4">
            {dict.artist.subtitle}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-[#2C2A27] font-light">
            {dict.artist.title}
          </h1>
          <div className="w-16 h-px bg-[#C8A96E] mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-5 gap-16">
          {/* Photo placeholder */}
          <div className="md:col-span-2">
            <div className="frame sticky top-28">
              <div className="aspect-[3/4] bg-gradient-to-br from-[#EDE5D4] to-[#D4C9B6] flex items-center justify-center">
                <div className="text-center text-[#A09888]">
                  <svg className="w-20 h-20 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-xs italic">
                    {lang === "fr" ? "Photo de l'artiste" : "Artist photo"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio text */}
          <div className="md:col-span-3 space-y-10">
            <div>
              <h2 className="font-serif text-3xl text-[#2C2A27] font-light mb-5">
                {artistName}
              </h2>
              <p className="text-[#4A4843] leading-[1.9] text-lg">{t.intro}</p>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-4">
                {lang === "fr" ? "Style & Approche" : "Style & Approach"}
              </h3>
              <p className="text-[#4A4843] leading-[1.9]">{t.style}</p>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-4">
                {lang === "fr" ? "Influences" : "Influences"}
              </h3>
              <p className="text-[#4A4843] leading-[1.9]">{t.influences}</p>

              {/* Sisley tribute */}
              <blockquote className="mt-6 pl-5 border-l-2 border-[#C8A96E] font-serif text-xl italic text-[#6B6560]">
                {lang === "fr"
                  ? "« Sisley m'a appris que la lumière n'est pas un détail — c'est le sujet lui-même. »"
                  : "\"Sisley taught me that light is not a detail — it is the subject itself.\""}
              </blockquote>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-4">
                {lang === "fr" ? "Aujourd'hui" : "Today"}
              </h3>
              <p className="text-[#4A4843] leading-[1.9]">{t.today}</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                href={`/${lang}/galerie`}
                className="border border-[#2C2A27] text-[#2C2A27] text-sm tracking-widest uppercase px-6 py-3 hover:bg-[#2C2A27] hover:text-[#F7F2E8] transition-all"
              >
                {dict.nav.gallery}
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="bg-[#C8A96E] text-[#F7F2E8] text-sm tracking-widest uppercase px-6 py-3 hover:bg-[#A88748] transition-colors"
              >
                {dict.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
