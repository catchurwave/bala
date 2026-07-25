import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Oeuvre = {
  slug: string;
  titre: string;
  titre_en: string;
  annee: number;
  technique: string;
  dimensions: string;
  categorie: "paysage" | "nature" | "portrait" | "marine" | "autre";
  image: string;
  prix?: number;
  disponible: boolean;
  featured: boolean;
  description: string;
  description_en: string;
};

const contentDir = path.join(process.cwd(), "content/oeuvres");

export function getAllOeuvres(): Oeuvre[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        ...data,
      } as Oeuvre;
    })
    .sort((a, b) => b.annee - a.annee);
}

export function getOeuvre(slug: string): Oeuvre | undefined {
  const file = path.join(contentDir, `${slug}.mdx`);
  const fallback = path.join(contentDir, `${slug}.md`);
  const target = fs.existsSync(file) ? file : fs.existsSync(fallback) ? fallback : null;

  if (!target) return undefined;

  const raw = fs.readFileSync(target, "utf-8");
  const { data } = matter(raw);
  return { slug, ...data } as Oeuvre;
}

export function getFeaturedOeuvres(limit = 3): Oeuvre[] {
  return getAllOeuvres()
    .filter((o) => o.featured)
    .slice(0, limit);
}

export function getOeuvresAVendre(): Oeuvre[] {
  return getAllOeuvres().filter((o) => o.prix != null);
}
