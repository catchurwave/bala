"use client";

import { useState, useEffect } from "react";

type BioData = {
  nom: string;
  nom_complet: string;
  citation: string;
  citation_en: string;
  intro_fr: string;
  intro_en: string;
  style_fr: string;
  style_en: string;
  influences_fr: string;
  influences_en: string;
  aujourdhui_fr: string;
  aujourdhui_en: string;
};

const empty: BioData = {
  nom: "Jean",
  nom_complet: "Jean Dupont",
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
};

export default function ArtisteAdminPage() {
  const [data, setData] = useState<BioData>(empty);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/bio")
      .then((r) => r.json())
      .then((json) => {
        if (json && Object.keys(json).length > 0) setData({ ...empty, ...json });
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

  const set = (k: keyof BioData, v: string) => setData((d) => ({ ...d, [k]: v }));

  const label = "block text-xs tracking-widest uppercase text-[#6B6560] mb-2";
  const input = "w-full bg-[#1A1917] text-[#D4C9B6] px-4 py-2.5 border border-[#3D3A36] focus:outline-none focus:border-[#C8A96E] transition-colors";
  const ta = "w-full bg-[#1A1917] text-[#D4C9B6] px-4 py-2.5 border border-[#3D3A36] focus:outline-none focus:border-[#C8A96E] transition-colors resize-vertical min-h-[100px]";

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-48 text-[#6B6560]">
        Chargement...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#F7F2E8] font-light">Biographie</h1>
        <p className="text-[#6B6560] text-sm mt-1">
          Modifier les textes de la page &ldquo;L&apos;Artiste&rdquo;
        </p>
      </div>

      <form onSubmit={handleSave} className="max-w-3xl space-y-8">
        {/* Identity */}
        <section>
          <h2 className="text-xs tracking-widest uppercase text-[#C8A96E] mb-4 pb-2 border-b border-[#3D3A36]">
            Identité
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Prénom</label>
              <input className={input} value={data.nom} onChange={(e) => set("nom", e.target.value)} />
            </div>
            <div>
              <label className={label}>Nom complet</label>
              <input className={input} value={data.nom_complet} onChange={(e) => set("nom_complet", e.target.value)} />
            </div>
          </div>
        </section>

        {/* Citation */}
        <section>
          <h2 className="text-xs tracking-widest uppercase text-[#C8A96E] mb-4 pb-2 border-b border-[#3D3A36]">
            Citation (page d&apos;accueil)
          </h2>
          <div className="space-y-4">
            <div>
              <label className={label}>FR</label>
              <input className={input} value={data.citation} onChange={(e) => set("citation", e.target.value)} />
            </div>
            <div>
              <label className={label}>EN</label>
              <input className={input} value={data.citation_en} onChange={(e) => set("citation_en", e.target.value)} />
            </div>
          </div>
        </section>

        {[
          { key: "intro", label: "Introduction" },
          { key: "style", label: "Style & Approche" },
          { key: "influences", label: "Influences" },
          { key: "aujourdhui", label: "Aujourd'hui" },
        ].map(({ key, label: sectionLabel }) => (
          <section key={key}>
            <h2 className="text-xs tracking-widest uppercase text-[#C8A96E] mb-4 pb-2 border-b border-[#3D3A36]">
              {sectionLabel}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={label}>FR</label>
                <textarea
                  className={ta}
                  value={data[`${key}_fr` as keyof BioData]}
                  onChange={(e) => set(`${key}_fr` as keyof BioData, e.target.value)}
                />
              </div>
              <div>
                <label className={label}>EN</label>
                <textarea
                  className={ta}
                  value={data[`${key}_en` as keyof BioData]}
                  onChange={(e) => set(`${key}_en` as keyof BioData, e.target.value)}
                />
              </div>
            </div>
          </section>
        ))}

        <div className="flex items-center gap-4 pt-4 border-t border-[#3D3A36]">
          <button
            type="submit"
            disabled={status === "saving"}
            className="bg-[#C8A96E] text-[#1A1917] text-sm tracking-widest uppercase px-8 py-3 hover:bg-[#A88748] transition-colors disabled:opacity-60"
          >
            {status === "saving" ? "Enregistrement..." : "Enregistrer"}
          </button>
          {status === "saved" && (
            <span className="text-[#4A6741] text-sm">✓ Enregistré</span>
          )}
          {status === "error" && (
            <span className="text-red-400 text-sm">Erreur lors de l&apos;enregistrement</span>
          )}
        </div>
      </form>

      <div className="mt-8 bg-[#2C2A27] border border-[#3D3A36] p-4 text-xs text-[#4A4843]">
        <strong className="text-[#6B6560]">Note :</strong> Pour que les textes de la biographie soient chargés dynamiquement depuis cet éditeur, mettez à jour{" "}
        <code className="text-[#C8A96E]">app/[lang]/artiste/page.tsx</code>{" "}
        pour lire <code className="text-[#C8A96E]">content/artiste.json</code> (déjà géré par l&apos;API admin).
      </div>
    </div>
  );
}
