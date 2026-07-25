"use client";

import { useState, useEffect } from "react";

type BioData = Record<string, string>;

const defaults: BioData = {
  nom: "Jean",
  nom_complet: "Jean Dupont",
  nom_atelier: "Atelier",
  citation: "La lumière est le souffle de la peinture",
  citation_en: "Light is the breath of painting",
  intro_fr: "",
  intro_en: "",
  style_fr: "",
  style_en: "",
  influences_fr: "",
  influences_en: "",
  aujourdhui_fr: "",
  aujourdhui_en: "",
  citation_artiste_fr: "",
  citation_artiste_en: "",
  bio_court_fr: "Peintre impressionniste inspiré par la lumière, la nature et la tradition de Sisley.",
  bio_court_en: "Impressionist painter inspired by light, nature, and the tradition of Sisley.",
  tagline_fr: "Un regard impressionniste sur le monde",
  tagline_en: "An impressionist eye on the world",
  tagline_desc_fr: "Influencé par Alfred Sisley et les grands maîtres de l'impressionnisme, cet artiste capture la lumière changeante des paysages, des marines et des jardins avec une touche sensible et vibrante.",
  tagline_desc_en: "Influenced by Alfred Sisley and the great Impressionist masters, this artist captures the changing light of landscapes, seascapes, and gardens with a sensitive, vibrant brushstroke.",
  boutique_titre_fr: "Apportez l'impressionnisme chez vous",
  boutique_titre_en: "Bring Impressionism into your home",
  boutique_desc_fr: "Chaque tableau est une œuvre originale, peinte à la main. Livraison soigneuse, certificat d'authenticité inclus.",
  boutique_desc_en: "Each painting is an original work, painted by hand. Careful delivery, certificate of authenticity included.",
  meta_titre: "Artiste Peintre — Œuvres Impressionnistes",
  meta_description_fr: "Découvrez les œuvres d'un peintre impressionniste. Galerie en ligne et boutique d'art.",
  meta_description_en: "Discover the works of an impressionist painter. Online gallery and art shop.",
};

export default function ArtisteAdminPage() {
  const [data, setData] = useState<BioData>(defaults);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/bio")
      .then((r) => r.json())
      .then((json) => {
        if (json && Object.keys(json).length > 0) setData({ ...defaults, ...json });
        setLoaded(true);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/admin/bio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => setStatus("idle"), 2500);
  }

  const set = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));

  const lbl = "block text-xs tracking-widest uppercase text-[#6B6560] mb-2";
  const inp = "w-full bg-[#1A1917] text-[#D4C9B6] px-4 py-2.5 border border-[#3D3A36] focus:outline-none focus:border-[#C8A96E] transition-colors";
  const ta = "w-full bg-[#1A1917] text-[#D4C9B6] px-4 py-2.5 border border-[#3D3A36] focus:outline-none focus:border-[#C8A96E] transition-colors resize-vertical min-h-[80px]";
  const h2 = "text-xs tracking-widest uppercase text-[#C8A96E] mb-4 pb-2 border-b border-[#3D3A36]";

  if (!loaded) {
    return <div className="flex items-center justify-center h-48 text-[#6B6560]">Chargement...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#F7F2E8] font-light">Contenu du site</h1>
        <p className="text-[#6B6560] text-sm mt-1">Tous les textes dynamiques du site</p>
      </div>

      <form onSubmit={handleSave} className="max-w-3xl space-y-10">

        {/* ── Identité ── */}
        <section>
          <h2 className={h2}>Identité de l&apos;artiste</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Prénom</label>
              <input className={inp} value={data.nom ?? ""} onChange={(e) => set("nom", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Nom complet</label>
              <input className={inp} value={data.nom_complet ?? ""} onChange={(e) => set("nom_complet", e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <label className={lbl}>Nom du logo / Atelier</label>
            <input className={inp} value={data.nom_atelier ?? ""} onChange={(e) => set("nom_atelier", e.target.value)} placeholder="Atelier" />
            <p className="text-xs text-[#4A4843] mt-1">Affiché dans la navigation et le pied de page</p>
          </div>
        </section>

        {/* ── SEO / Méta ── */}
        <section>
          <h2 className={h2}>SEO — Balises méta</h2>
          <div className="space-y-4">
            <div>
              <label className={lbl}>Titre de la page (title)</label>
              <input className={inp} value={data.meta_titre ?? ""} onChange={(e) => set("meta_titre", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Description (FR)</label>
              <input className={inp} value={data.meta_description_fr ?? ""} onChange={(e) => set("meta_description_fr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Description (EN)</label>
              <input className={inp} value={data.meta_description_en ?? ""} onChange={(e) => set("meta_description_en", e.target.value)} />
            </div>
          </div>
        </section>

        {/* ── Citation hero ── */}
        <section>
          <h2 className={h2}>Citation — page d&apos;accueil (hero)</h2>
          <div className="space-y-4">
            <div>
              <label className={lbl}>FR</label>
              <input className={inp} value={data.citation ?? ""} onChange={(e) => set("citation", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>EN</label>
              <input className={inp} value={data.citation_en ?? ""} onChange={(e) => set("citation_en", e.target.value)} />
            </div>
          </div>
        </section>

        {/* ── À propos (homepage strip) ── */}
        <section>
          <h2 className={h2}>Page d&apos;accueil — Section À propos</h2>
          <div className="space-y-4">
            <div>
              <label className={lbl}>Titre (FR)</label>
              <input className={inp} value={data.tagline_fr ?? ""} onChange={(e) => set("tagline_fr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Titre (EN)</label>
              <input className={inp} value={data.tagline_en ?? ""} onChange={(e) => set("tagline_en", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Description (FR)</label>
              <textarea className={ta} value={data.tagline_desc_fr ?? ""} onChange={(e) => set("tagline_desc_fr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Description (EN)</label>
              <textarea className={ta} value={data.tagline_desc_en ?? ""} onChange={(e) => set("tagline_desc_en", e.target.value)} />
            </div>
          </div>
        </section>

        {/* ── Boutique CTA (homepage) ── */}
        <section>
          <h2 className={h2}>Page d&apos;accueil — Section Boutique</h2>
          <div className="space-y-4">
            <div>
              <label className={lbl}>Titre (FR)</label>
              <input className={inp} value={data.boutique_titre_fr ?? ""} onChange={(e) => set("boutique_titre_fr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Titre (EN)</label>
              <input className={inp} value={data.boutique_titre_en ?? ""} onChange={(e) => set("boutique_titre_en", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Description (FR)</label>
              <textarea className={ta} value={data.boutique_desc_fr ?? ""} onChange={(e) => set("boutique_desc_fr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Description (EN)</label>
              <textarea className={ta} value={data.boutique_desc_en ?? ""} onChange={(e) => set("boutique_desc_en", e.target.value)} />
            </div>
          </div>
        </section>

        {/* ── Bio courte (footer) ── */}
        <section>
          <h2 className={h2}>Pied de page — Présentation courte</h2>
          <div className="space-y-4">
            <div>
              <label className={lbl}>FR</label>
              <textarea className={ta} value={data.bio_court_fr ?? ""} onChange={(e) => set("bio_court_fr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>EN</label>
              <textarea className={ta} value={data.bio_court_en ?? ""} onChange={(e) => set("bio_court_en", e.target.value)} />
            </div>
          </div>
        </section>

        {/* ── Biographie complète ── */}
        {[
          { key: "intro", label: "Introduction" },
          { key: "style", label: "Style & Approche" },
          { key: "influences", label: "Influences" },
          { key: "aujourdhui", label: "Aujourd'hui" },
        ].map(({ key, label: sectionLabel }) => (
          <section key={key}>
            <h2 className={h2}>Biographie — {sectionLabel}</h2>
            <div className="space-y-4">
              <div>
                <label className={lbl}>FR</label>
                <textarea
                  className={ta}
                  style={{ minHeight: "120px" }}
                  value={data[`${key}_fr`] ?? ""}
                  onChange={(e) => set(`${key}_fr`, e.target.value)}
                />
              </div>
              <div>
                <label className={lbl}>EN</label>
                <textarea
                  className={ta}
                  style={{ minHeight: "120px" }}
                  value={data[`${key}_en`] ?? ""}
                  onChange={(e) => set(`${key}_en`, e.target.value)}
                />
              </div>
            </div>
          </section>
        ))}

        {/* ── Citation artiste (page artiste) ── */}
        <section>
          <h2 className={h2}>Page L&apos;Artiste — Citation mise en avant</h2>
          <div className="space-y-4">
            <div>
              <label className={lbl}>FR</label>
              <input className={inp} value={data.citation_artiste_fr ?? ""} onChange={(e) => set("citation_artiste_fr", e.target.value)} placeholder="« Sisley m'a appris que la lumière n'est pas un détail... »" />
            </div>
            <div>
              <label className={lbl}>EN</label>
              <input className={inp} value={data.citation_artiste_en ?? ""} onChange={(e) => set("citation_artiste_en", e.target.value)} placeholder='"Sisley taught me that light is not a detail..."' />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4 pt-4 border-t border-[#3D3A36]">
          <button
            type="submit"
            disabled={status === "saving"}
            className="bg-[#C8A96E] text-[#1A1917] text-sm tracking-widest uppercase px-8 py-3 hover:bg-[#A88748] transition-colors disabled:opacity-60"
          >
            {status === "saving" ? "Enregistrement..." : "Enregistrer"}
          </button>
          {status === "saved" && <span className="text-[#4A6741] text-sm">✓ Enregistré</span>}
          {status === "error" && <span className="text-red-400 text-sm">Erreur lors de l&apos;enregistrement</span>}
        </div>
      </form>
    </div>
  );
}
