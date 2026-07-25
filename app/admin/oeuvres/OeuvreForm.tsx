"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export type OeuvreFormState = {
  slug: string;
  titre: string;
  titre_en: string;
  annee: number;
  technique: string;
  dimensions: string;
  categorie: string;
  image: string;
  prix: string;
  disponible: boolean;
  featured: boolean;
  description: string;
  description_en: string;
};

const defaultState: OeuvreFormState = {
  slug: "",
  titre: "",
  titre_en: "",
  annee: new Date().getFullYear(),
  technique: "Huile sur toile",
  dimensions: "",
  categorie: "paysage",
  image: "",
  prix: "",
  disponible: true,
  featured: false,
  description: "",
  description_en: "",
};

const CATEGORIES = [
  { value: "paysage", label: "Paysage" },
  { value: "nature", label: "Nature morte" },
  { value: "portrait", label: "Portrait" },
  { value: "marine", label: "Marine" },
  { value: "autre", label: "Autre" },
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function OeuvreForm({
  initial,
  mode,
}: {
  initial?: Partial<OeuvreFormState>;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState<OeuvreFormState>({
    ...defaultState,
    ...initial,
    prix: initial?.prix ?? "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof OeuvreFormState, v: string | boolean | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok) set("image", json.url);
    else setError(json.error ?? "Upload échoué");
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      annee: Number(form.annee),
      prix: form.prix ? Number(form.prix) : null,
    };

    const url =
      mode === "create"
        ? "/api/admin/oeuvres"
        : `/api/admin/oeuvres/${form.slug}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "Erreur");
      setSaving(false);
      return;
    }

    router.push("/admin/oeuvres");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Supprimer "${form.titre}" ? Cette action est irréversible.`)) return;
    setDeleting(true);
    await fetch(`/api/admin/oeuvres/${form.slug}`, { method: "DELETE" });
    router.push("/admin/oeuvres");
    router.refresh();
  }

  const label = "block text-xs tracking-widest uppercase text-[#6B6560] mb-2";
  const input =
    "w-full bg-[#1A1917] text-[#D4C9B6] px-4 py-2.5 border border-[#3D3A36] focus:outline-none focus:border-[#C8A96E] transition-colors";
  const textarea =
    "w-full bg-[#1A1917] text-[#D4C9B6] px-4 py-2.5 border border-[#3D3A36] focus:outline-none focus:border-[#C8A96E] transition-colors resize-vertical min-h-[100px]";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Slug (create only) */}
      {mode === "create" && (
        <div>
          <label className={label}>
            Slug (identifiant URL) *
          </label>
          <input
            className={input}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="ex: matin-sur-la-seine"
            required
          />
          <p className="text-xs text-[#4A4843] mt-1">
            Généré auto depuis le titre FR →{" "}
            <button
              type="button"
              className="text-[#C8A96E] underline"
              onClick={() => set("slug", slugify(form.titre))}
            >
              Générer
            </button>
          </p>
        </div>
      )}

      {/* Titres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Titre (FR) *</label>
          <input
            className={input}
            value={form.titre}
            onChange={(e) => set("titre", e.target.value)}
            required
          />
        </div>
        <div>
          <label className={label}>Titre (EN) *</label>
          <input
            className={input}
            value={form.titre_en}
            onChange={(e) => set("titre_en", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Technique / Dimensions / Année / Catégorie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Technique</label>
          <input className={input} value={form.technique} onChange={(e) => set("technique", e.target.value)} />
        </div>
        <div>
          <label className={label}>Dimensions</label>
          <input className={input} value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="60 × 80 cm" />
        </div>
        <div>
          <label className={label}>Année</label>
          <input type="number" className={input} value={form.annee} onChange={(e) => set("annee", Number(e.target.value))} />
        </div>
        <div>
          <label className={label}>Catégorie</label>
          <select className={input} value={form.categorie} onChange={(e) => set("categorie", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Prix */}
      <div>
        <label className={label}>Prix (€) — laisser vide si pas en vente</label>
        <input
          type="number"
          className={input}
          value={form.prix}
          onChange={(e) => set("prix", e.target.value)}
          placeholder="1200"
          min={0}
        />
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6">
        {[
          { key: "disponible", label: "Disponible à la vente" },
          { key: "featured", label: "Affiché en vedette (accueil)" },
        ].map(({ key, label: l }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form[key as "disponible" | "featured"]}
              onChange={(e) => set(key as "disponible" | "featured", e.target.checked)}
              className="w-4 h-4 accent-[#C8A96E]"
            />
            <span className="text-sm text-[#D4C9B6]">{l}</span>
          </label>
        ))}
      </div>

      {/* Image upload */}
      <div>
        <label className={label}>Image</label>
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <input
              className={input}
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="/images/oeuvres/fichier.jpg"
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="text-xs text-[#C8A96E] border border-[#C8A96E] px-4 py-2 hover:bg-[#C8A96E] hover:text-[#1A1917] transition-colors disabled:opacity-60"
              >
                {uploading ? "Upload..." : "⬆ Uploader une image"}
              </button>
              <span className="text-xs text-[#4A4843]">jpg / png / webp · max 10 Mo</span>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
          {form.image && (
            <div className="w-24 h-24 relative border border-[#3D3A36] overflow-hidden shrink-0">
              <Image src={form.image} alt="preview" fill className="object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <label className={label}>Description (FR) *</label>
        <textarea className={textarea} value={form.description} onChange={(e) => set("description", e.target.value)} required />
      </div>
      <div>
        <label className={label}>Description (EN) *</label>
        <textarea className={textarea} value={form.description_en} onChange={(e) => set("description_en", e.target.value)} required />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#3D3A36]">
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#C8A96E] text-[#1A1917] text-sm tracking-widest uppercase px-8 py-3 hover:bg-[#A88748] transition-colors disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : mode === "create" ? "Créer le tableau" : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-[#3D3A36] text-[#6B6560] text-sm tracking-widest uppercase px-6 py-3 hover:border-[#6B6560] hover:text-[#D4C9B6] transition-colors"
          >
            Annuler
          </button>
        </div>

        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-400 hover:text-red-300 border border-red-900 px-5 py-3 hover:border-red-400 transition-colors disabled:opacity-60"
          >
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
        )}
      </div>
    </form>
  );
}
