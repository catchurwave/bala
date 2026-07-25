import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content/oeuvres");

export type OeuvreFormData = {
  slug: string;
  titre: string;
  titre_en: string;
  annee: number;
  technique: string;
  dimensions: string;
  categorie: string;
  image: string;
  prix?: number | null;
  disponible: boolean;
  featured: boolean;
  description: string;
  description_en: string;
};

function sanitizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function toMdx(data: OeuvreFormData): string {
  const prix = data.prix ? `\nprix: ${data.prix}` : "";
  return `---
titre: "${data.titre.replace(/"/g, '\\"')}"
titre_en: "${data.titre_en.replace(/"/g, '\\"')}"
annee: ${data.annee}
technique: "${data.technique}"
dimensions: "${data.dimensions}"
categorie: "${data.categorie}"
image: "${data.image}"${prix}
disponible: ${data.disponible}
featured: ${data.featured}
description: "${data.description.replace(/"/g, '\\"')}"
description_en: "${data.description_en.replace(/"/g, '\\"')}"
---
`;
}

export function writeOeuvre(data: OeuvreFormData): string {
  if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

  const slug = sanitizeSlug(data.slug);
  if (!slug) throw new Error("Slug invalide");

  const filepath = path.join(contentDir, `${slug}.mdx`);
  fs.writeFileSync(filepath, toMdx({ ...data, slug }), "utf-8");
  return slug;
}

export function deleteOeuvre(slug: string): void {
  const safe = sanitizeSlug(slug);
  const filepath = path.join(contentDir, `${safe}.mdx`);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
}

export function oeuvreExists(slug: string): boolean {
  const safe = sanitizeSlug(slug);
  return fs.existsSync(path.join(contentDir, `${safe}.mdx`));
}
