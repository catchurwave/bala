/**
 * import-tableaux.mjs
 * Upload paintings from /workspace/bala/tableaux/ to Vercel Blob + insert to DB.
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-tableaux.mjs
 *
 * Prerequisites:
 *   - BLOB_READ_WRITE_TOKEN set in .env.local (Vercel Dashboard > Storage > Blob)
 *   - POSTGRES_URL set in .env.local
 */

import { readFileSync, existsSync } from "fs";
import { resolve, basename } from "path";
import postgres from "postgres";

const TABLEAUX_DIR = resolve(process.cwd(), "../tableaux");

// ── Painting catalog ─────────────────────────────────────────────────────────
// Each entry maps a filename to painting metadata.
// slug is auto-generated from titre if not provided.
// Set `skip: true` for duplicates or unidentified paintings.

const CATALOG = [
  {
    file: "tableau1.jpeg",
    num: 39,
    slug: "cavaliers-et-chateau",
    titre: "Cavaliers et château",
    titre_en: "Riders and Castle",
    annee: 2022,
    technique: "Huile sur toile",
    dimensions: "54 × 65 cm",
    categorie: "figuratif",
    description: "Composition onirique et mythologique — cavaliers, figures ailées et tours d'une ville fantastique, dans un style expressionniste vibrant.",
    description_en: "Dreamlike mythological composition — riders, winged figures and towers of a fantastical city, in vibrant Expressionist style.",
    prix: 2800,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 14.59.33.jpeg",
    skip: true, // duplicate of tableau1
  },
  {
    file: "WhatsApp Image 2026-07-25 at 15.01.49.jpeg",
    num: 38,
    slug: "toits-de-la-vieille-ville",
    titre: "Toits de la vieille ville",
    titre_en: "Old Town Rooftops",
    annee: 2023,
    technique: "Huile sur toile",
    dimensions: "40 × 40 cm",
    categorie: "architecture",
    description: "Vue aérienne d'une vieille ville aux toits colorés — une explosion de couleurs naïves et expressives, où chaque toit raconte une histoire.",
    description_en: "Aerial view of an old town with colourful rooftops — an explosion of naive and expressive colour where every rooftop tells a story.",
    prix: 1400,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 15.41.17.jpeg",
    num: 37,
    slug: "la-ville-en-cercle",
    titre: "La ville en cercle",
    titre_en: "The City in a Circle",
    annee: 2023,
    technique: "Huile sur toile",
    dimensions: "30 × 30 cm",
    categorie: "architecture",
    description: "Composition circulaire géométrique où une vieille ville est enfermée dans un médaillon de couleur — entre cubisme et naïvisme.",
    description_en: "Geometric circular composition where an old town is enclosed in a colourful medallion — between Cubism and Naïve art.",
    prix: 950,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 15.43.23.jpeg",
    num: 36,
    slug: "village-aux-domes",
    titre: "Village aux dômes",
    titre_en: "Village of Domes",
    annee: 2022,
    technique: "Huile sur toile",
    dimensions: "30 × 30 cm",
    categorie: "architecture",
    description: "Vieille ville aux dômes et clochers, dans des tons pastel doux — une vision poétique de l'architecture orientale.",
    description_en: "Old town with domes and bell towers in soft pastel tones — a poetic vision of Eastern architecture.",
    prix: 950,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 15.43.23 (1).jpeg",
    skip: true, // not catalogued
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.06.jpeg",
    num: 40,
    slug: "l-ombre-et-le-troupeau",
    titre: "L'ombre et le troupeau",
    titre_en: "Shadow and the Herd",
    annee: 2023,
    technique: "Huile sur toile",
    dimensions: "38 × 46 cm",
    categorie: "figuratif",
    description: "Composition dramatique et symboliste — figures humaines vulnérables face à des forces sombres, dans des teintes lavande et gris profond.",
    description_en: "Dramatic symbolist composition — vulnerable human figures facing dark forces, in deep lavender and grey tones.",
    prix: 1600,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.06 (1).jpeg",
    num: 19,
    slug: "port-dans-la-brume",
    titre: "Port dans la brume",
    titre_en: "Harbour in the Mist",
    annee: 2021,
    technique: "Huile sur toile",
    dimensions: "55 × 38 cm",
    categorie: "marine",
    description: "Port impressionniste baigné dans la brume — bâtiments rouges, mâts de voiliers et oiseaux dans un ciel nacré. Hommage à Boudin.",
    description_en: "Impressionist harbour bathed in mist — red buildings, ship masts and birds in a pearlescent sky. A tribute to Boudin.",
    prix: 1800,
  },
  { file: "WhatsApp Image 2026-07-25 at 16.08.06 (2).jpeg", skip: true },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.06 (3).jpeg",
    num: 20,
    slug: "l-horizon-turquoise",
    titre: "L'horizon turquoise",
    titre_en: "The Turquoise Horizon",
    annee: 2023,
    technique: "Huile sur toile",
    dimensions: "61 × 50 cm",
    categorie: "marine",
    description: "Marine abstraite dans des bleus et turquoises lumineux — mer et ciel se fondent dans une harmonie presque musicale.",
    description_en: "Abstract seascape in luminous blues and turquoises — sea and sky merge in an almost musical harmony.",
    prix: 2200,
  },
  { file: "WhatsApp Image 2026-07-25 at 16.08.06 (4).jpeg", skip: true },
  { file: "WhatsApp Image 2026-07-25 at 16.08.06 (5).jpeg", skip: true },
  { file: "WhatsApp Image 2026-07-25 at 16.08.06 (6).jpeg", skip: true },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.07.jpeg",
    num: 35,
    slug: "la-cite-geometrique",
    titre: "La cité géométrique",
    titre_en: "The Geometric City",
    annee: 2023,
    technique: "Huile sur toile",
    dimensions: "60 × 80 cm",
    categorie: "architecture",
    description: "Grande composition audacieuse — une cité flottante sur fond turquoise éclatant, mêlant architecture organique et motifs géométriques dans une explosion de couleurs.",
    description_en: "Bold large-scale composition — a floating city on a blazing turquoise ground, blending organic architecture with geometric patterns in an explosion of colour.",
    prix: 4200,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.07 (1).jpeg",
    num: 28,
    slug: "lac-verdoyant",
    titre: "Lac verdoyant",
    titre_en: "Verdant Lake",
    annee: 2021,
    technique: "Huile sur toile",
    dimensions: "50 × 61 cm",
    categorie: "paysage",
    description: "Lac impressionniste dans un écrin de verdure — roseaux élancés, promeneurs blancs et eau miroitante dans la lumière douce.",
    description_en: "Impressionist lake in a setting of green — slender reeds, white strollers and shimmering water in gentle light.",
    prix: 2400,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.07 (2).jpeg",
    num: 41,
    slug: "vision-mystique",
    titre: "Vision mystique",
    titre_en: "Mystical Vision",
    annee: 2024,
    technique: "Huile sur toile",
    dimensions: "65 × 92 cm",
    categorie: "figuratif",
    description: "Œuvre majestueuse et onirique — ville-montagne engloutie par des forces mystiques, figures en apesanteur et lumières explosives dans une palette violacée et turquoise.",
    description_en: "Majestic dreamlike work — a mountain-city engulfed by mystical forces, weightless figures and explosive light in a violet and turquoise palette.",
    prix: 5500,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.07 (3).jpeg",
    num: 4,
    slug: "le-marche-du-village",
    titre: "Le marché du village",
    titre_en: "The Village Market",
    annee: 2020,
    technique: "Huile sur toile",
    dimensions: "50 × 65 cm",
    categorie: "figuratif",
    description: "Scène de marché animée dans un village d'antan — personnages hauts en couleur, étals de fleurs et architecture rustique dans la lumière hivernale.",
    description_en: "Lively market scene in a village of old — colourful figures, flower stalls and rustic architecture in winter light.",
    prix: 2600,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.07 (4).jpeg",
    num: 3,
    slug: "la-place-ensoleilee",
    titre: "La place ensoleillée",
    titre_en: "The Sunny Square",
    annee: 2022,
    technique: "Huile sur toile",
    dimensions: "50 × 60 cm",
    categorie: "architecture",
    description: "Place de village naïve et lumineuse sous un grand soleil d'or — façades colorées, fontaine centrale et promeneurs dans une atmosphère de fête.",
    description_en: "Naïve luminous village square beneath a great golden sun — colourful façades, central fountain and strollers in a festive atmosphere.",
    prix: 2800,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.07 (5).jpeg",
    num: 23,
    slug: "ile-et-mats-dans-la-brume",
    titre: "Île et mâts dans la brume",
    titre_en: "Island and Masts in the Mist",
    annee: 2022,
    technique: "Huile sur toile",
    dimensions: "61 × 46 cm",
    categorie: "marine",
    description: "Paysage lacustre impressionniste — silhouettes de mâts se découpant sur un ciel bleu lumineux, île boisée au loin dans la douceur de l'été.",
    description_en: "Impressionist lake scene — mast silhouettes against a luminous blue sky, wooded island in the distance in summer softness.",
    prix: 2200,
  },
  { file: "WhatsApp Image 2026-07-25 at 16.08.07 (6).jpeg", skip: true },
  { file: "WhatsApp Image 2026-07-25 at 16.08.07 (7).jpeg", skip: true },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.08.jpeg",
    num: 24,
    slug: "l-atelier-du-peintre",
    titre: "L'atelier du peintre",
    titre_en: "The Painter's Studio",
    annee: 2021,
    technique: "Huile sur toile",
    dimensions: "46 × 61 cm",
    categorie: "figuratif",
    description: "Intérieur d'atelier impressionniste — modèle de dos devant un chevalet, lumière de fenêtre et ambiance intimiste. Hommage à Degas et au monde de l'art.",
    description_en: "Impressionist studio interior — model seen from behind before an easel, window light and intimate atmosphere. A tribute to Degas and the art world.",
    prix: 2400,
    mis_en_avant: true,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.08 (1).jpeg",
    num: 31,
    slug: "paysage-d-automne",
    titre: "Paysage d'automne",
    titre_en: "Autumn Landscape",
    annee: 2019,
    technique: "Huile sur toile",
    dimensions: "27 × 41 cm",
    categorie: "paysage",
    description: "Paysage automnal doré à la manière de Corot et Sisley — silhouettes d'arbres dénudés, clocher au loin, promeneurs dans la lumière du soir.",
    description_en: "Golden autumnal landscape in the manner of Corot and Sisley — bare tree silhouettes, distant steeple, strollers in evening light.",
    prix: 1200,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.08 (2).jpeg",
    num: 21,
    slug: "danse-folklorique",
    titre: "Danse folklorique",
    titre_en: "Folk Dance",
    annee: 2021,
    technique: "Huile sur toile",
    dimensions: "50 × 61 cm",
    categorie: "figuratif",
    description: "Ronde joyeuse dans un pré estival — costumes traditionnels, bâtisses d'époque et ciel d'été dans une composition lumineuse et vivante.",
    description_en: "Joyful ring dance in a summer meadow — traditional costumes, old farmhouses and summer sky in a bright and lively composition.",
    prix: 2400,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.08 (3).jpeg",
    num: 16,
    slug: "les-joueurs-de-cartes",
    titre: "Les joueurs de cartes",
    titre_en: "The Card Players",
    annee: 2020,
    technique: "Huile sur toile",
    dimensions: "46 × 61 cm",
    categorie: "figuratif",
    description: "Scène nocturne de café — hommes absorbés par une partie de cartes sous la lumière d'une lampe suspendue. Hommage à Cézanne.",
    description_en: "Nocturnal café scene — men absorbed in a card game beneath the light of a hanging lamp. A tribute to Cézanne.",
    prix: 2600,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.08 (4).jpeg",
    num: 27,
    slug: "le-jardin-impressionniste",
    titre: "Le jardin impressionniste",
    titre_en: "The Impressionist Garden",
    annee: 2020,
    technique: "Huile sur toile",
    dimensions: "36 × 30 cm",
    categorie: "paysage",
    description: "Jardin à la manière de Monet — végétation dense et lumineuse, reflets dans l'eau, touche libre et sensible.",
    description_en: "Garden in the manner of Monet — dense luminous vegetation, water reflections, free and sensitive brushwork.",
    prix: 1100,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.08 (5).jpeg",
    num: 22,
    slug: "village-de-provence",
    titre: "Village de Provence",
    titre_en: "Provençal Village",
    annee: 2022,
    technique: "Huile sur toile",
    dimensions: "50 × 65 cm",
    categorie: "paysage",
    description: "Village méditerranéen entre pins et oliviers — toits de tuiles roses, façades ocre et ciel turquoise éclatant. L'essence du Midi.",
    description_en: "Mediterranean village between pines and olives — pink tiled roofs, ochre façades and blazing turquoise sky. The essence of the South.",
    prix: 2600,
    mis_en_avant: true,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.08 (6).jpeg",
    num: 14,
    slug: "le-marche-aux-fleurs",
    titre: "Le marché aux fleurs",
    titre_en: "The Flower Market",
    annee: 2020,
    technique: "Huile sur toile",
    dimensions: "61 × 46 cm",
    categorie: "figuratif",
    description: "Scène animée de marché — foule colorée autour d'étals de fleurs, dans une rue animée. Touche impressionniste directe et spontanée.",
    description_en: "Lively market scene — colourful crowd around flower stalls in a busy street. Direct, spontaneous Impressionist brushwork.",
    prix: 2200,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.08 (7).jpeg",
    num: 15,
    slug: "rencontre-dans-le-jardin",
    titre: "Rencontre dans le jardin",
    titre_en: "Encounter in the Garden",
    annee: 2019,
    technique: "Huile sur toile",
    dimensions: "35 × 48 cm",
    categorie: "figuratif",
    description: "Trois figures dans un jardin aux couleurs chaudes — robe d'été, chapeau de paille, végétation expressionniste. Hommage à Renoir.",
    description_en: "Three figures in a warm-toned garden — summer dress, straw hat, expressionist vegetation. A tribute to Renoir.",
    prix: 1600,
  },
  { file: "WhatsApp Image 2026-07-25 at 16.08.08 (8).jpeg", skip: true },
  { file: "WhatsApp Image 2026-07-25 at 16.08.08 (9).jpeg", skip: true },
  { file: "WhatsApp Image 2026-07-25 at 16.08.08 (10).jpeg", skip: true },
  { file: "WhatsApp Image 2026-07-25 at 16.08.08 (11).jpeg", skip: true },
  { file: "WhatsApp Image 2026-07-25 at 16.08.08 (12).jpeg", skip: true },
  { file: "WhatsApp Image 2026-07-25 at 16.08.08 (13).jpeg", skip: true },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.09.jpeg",
    num: 11,
    slug: "promenade-au-bord-de-l-eau",
    titre: "Promenade au bord de l'eau",
    titre_en: "Promenade by the Water",
    annee: 2021,
    technique: "Huile sur toile",
    dimensions: "40 × 40 cm",
    categorie: "marine",
    description: "Couple en promenade au bord de l'eau dans la lumière dorée — voiliers, promeneurs et ciel turquoise. Hommage à Monet et à l'impressionnisme.",
    description_en: "Couple strolling along the waterfront in golden light — sailboats, Sunday walkers and turquoise sky. A tribute to Monet and Impressionism.",
    prix: 1800,
    mis_en_avant: true,
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.09 (1).jpeg",
    skip: true, // duplicate of 16.08.09
  },
  {
    file: "WhatsApp Image 2026-07-25 at 16.08.09 (2).jpeg",
    num: 9,
    slug: "procession-folklorique",
    titre: "Procession folklorique",
    titre_en: "Folk Procession",
    annee: 2020,
    technique: "Huile sur toile",
    dimensions: "70 × 50 cm",
    categorie: "figuratif",
    description: "Longue procession en costumes traditionnels parmi les cerisiers en fleurs — un instant de fête et de mémoire collective.",
    description_en: "Long procession in traditional costumes among flowering cherry trees — a moment of celebration and collective memory.",
    prix: 3200,
  },
  { file: "WhatsApp Image 2026-07-25 at 16.08.09 (3).jpeg", skip: true },
  { file: "WhatsApp Image 2026-07-25 at 16.08.09 (4).jpeg", skip: true },
  { file: "WhatsApp Image 2026-07-25 at 16.08.09 (5).jpeg", skip: true },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

async function uploadToBlob(filePath, slug) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN not set in .env.local");

  const { put } = await import("@vercel/blob");
  const fileBuffer = readFileSync(filePath);
  const filename = `oeuvres/${slug}.jpg`;

  const result = await put(filename, fileBuffer, {
    access: "public",
    token,
    contentType: "image/jpeg",
    addRandomSuffix: false,
  });
  return result.url;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const POSTGRES_URL = process.env.POSTGRES_URL;
if (!POSTGRES_URL) {
  console.error("❌ POSTGRES_URL not set in .env.local");
  process.exit(1);
}
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("❌ BLOB_READ_WRITE_TOKEN not set in .env.local");
  console.error("   Get it from Vercel Dashboard > Storage > your Blob store > .env.local");
  process.exit(1);
}

const sql = postgres(POSTGRES_URL, { ssl: "require", max: 1 });

let imported = 0, skipped = 0, errors = 0;

for (const entry of CATALOG) {
  if (entry.skip) { skipped++; continue; }

  const filePath = resolve(TABLEAUX_DIR, entry.file);
  if (!existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${entry.file}`);
    errors++;
    continue;
  }

  const slug = entry.slug || slugify(entry.titre);

  try {
    console.log(`📤 Uploading #${entry.num}: ${entry.titre} (${entry.dimensions})…`);
    const imageUrl = await uploadToBlob(filePath, slug);

    await sql`
      INSERT INTO oeuvres (
        slug, titre, titre_en, annee, technique, dimensions, categorie,
        image, prix, disponible, featured, description, description_en
      ) VALUES (
        ${slug}, ${entry.titre}, ${entry.titre_en}, ${entry.annee},
        ${entry.technique}, ${entry.dimensions}, ${entry.categorie},
        ${imageUrl}, ${entry.prix ?? null}, true,
        ${entry.mis_en_avant ?? false},
        ${entry.description}, ${entry.description_en}
      )
      ON CONFLICT (slug) DO UPDATE SET
        titre = EXCLUDED.titre,
        titre_en = EXCLUDED.titre_en,
        image = EXCLUDED.image,
        prix = EXCLUDED.prix,
        dimensions = EXCLUDED.dimensions,
        technique = EXCLUDED.technique,
        description = EXCLUDED.description,
        description_en = EXCLUDED.description_en,
        featured = EXCLUDED.featured
    `;

    console.log(`   ✅ ${slug} → ${imageUrl}`);
    imported++;
  } catch (err) {
    console.error(`   ❌ Error for ${entry.file}:`, err.message);
    errors++;
  }
}

await sql.end();

console.log(`\n📊 Done: ${imported} imported, ${skipped} skipped, ${errors} errors`);
console.log("   Update remaining entries through the admin panel at /admin/oeuvres");
