import postgres from "postgres";

function getClient() {
  const url = process.env.POSTGRES_URL;
  if (!url) throw new Error("POSTGRES_URL not set");
  return postgres(url, { ssl: "require", max: 1 });
}

/* ── Schema ─────────────────────────────────────────────── */

export async function createTables() {
  const sql = getClient();
  await sql`
    CREATE TABLE IF NOT EXISTS oeuvres (
      slug           TEXT PRIMARY KEY,
      titre          TEXT NOT NULL,
      titre_en       TEXT NOT NULL,
      annee          INTEGER NOT NULL,
      technique      TEXT NOT NULL DEFAULT '',
      dimensions     TEXT NOT NULL DEFAULT '',
      categorie      TEXT NOT NULL DEFAULT 'autre',
      image          TEXT NOT NULL DEFAULT '',
      prix           INTEGER,
      disponible     BOOLEAN NOT NULL DEFAULT true,
      featured       BOOLEAN NOT NULL DEFAULT false,
      description    TEXT NOT NULL DEFAULT '',
      description_en TEXT NOT NULL DEFAULT '',
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS artiste (
      id   INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL DEFAULT '{}'
    )
  `;
  await sql`INSERT INTO artiste (id, data) VALUES (1, '{}') ON CONFLICT DO NOTHING`;
  await sql`
    CREATE TABLE IF NOT EXISTS newsletter (
      email         TEXT PRIMARY KEY,
      lang          TEXT NOT NULL DEFAULT 'fr',
      subscribed_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql.end();
}

/* ── Oeuvres ─────────────────────────────────────────────── */

export type OeuvreRow = {
  slug: string;
  titre: string;
  titre_en: string;
  annee: number;
  technique: string;
  dimensions: string;
  categorie: "paysage" | "nature" | "portrait" | "marine" | "autre";
  image: string;
  prix?: number | null;
  disponible: boolean;
  featured: boolean;
  description: string;
  description_en: string;
};

export async function dbGetAllOeuvres(): Promise<OeuvreRow[]> {
  const sql = getClient();
  const rows = await sql<OeuvreRow[]>`
    SELECT * FROM oeuvres ORDER BY annee DESC, created_at DESC
  `;
  await sql.end();
  return rows;
}

export async function dbGetOeuvre(slug: string): Promise<OeuvreRow | null> {
  const sql = getClient();
  const rows = await sql<OeuvreRow[]>`SELECT * FROM oeuvres WHERE slug = ${slug}`;
  await sql.end();
  return rows[0] ?? null;
}

export async function dbGetFeatured(limit = 3): Promise<OeuvreRow[]> {
  const sql = getClient();
  const rows = await sql<OeuvreRow[]>`
    SELECT * FROM oeuvres WHERE featured = true ORDER BY annee DESC LIMIT ${limit}
  `;
  await sql.end();
  return rows;
}

export async function dbGetAVendre(): Promise<OeuvreRow[]> {
  const sql = getClient();
  const rows = await sql<OeuvreRow[]>`
    SELECT * FROM oeuvres WHERE prix IS NOT NULL ORDER BY annee DESC
  `;
  await sql.end();
  return rows;
}

export async function dbUpsertOeuvre(o: OeuvreRow): Promise<void> {
  const sql = getClient();
  await sql`
    INSERT INTO oeuvres
      (slug, titre, titre_en, annee, technique, dimensions, categorie,
       image, prix, disponible, featured, description, description_en)
    VALUES
      (${o.slug}, ${o.titre}, ${o.titre_en}, ${o.annee}, ${o.technique},
       ${o.dimensions}, ${o.categorie}, ${o.image}, ${o.prix ?? null},
       ${o.disponible}, ${o.featured}, ${o.description}, ${o.description_en})
    ON CONFLICT (slug) DO UPDATE SET
      titre          = EXCLUDED.titre,
      titre_en       = EXCLUDED.titre_en,
      annee          = EXCLUDED.annee,
      technique      = EXCLUDED.technique,
      dimensions     = EXCLUDED.dimensions,
      categorie      = EXCLUDED.categorie,
      image          = EXCLUDED.image,
      prix           = EXCLUDED.prix,
      disponible     = EXCLUDED.disponible,
      featured       = EXCLUDED.featured,
      description    = EXCLUDED.description,
      description_en = EXCLUDED.description_en
  `;
  await sql.end();
}

export async function dbDeleteOeuvre(slug: string): Promise<void> {
  const sql = getClient();
  await sql`DELETE FROM oeuvres WHERE slug = ${slug}`;
  await sql.end();
}

export async function dbSlugExists(slug: string): Promise<boolean> {
  const sql = getClient();
  const rows = await sql`SELECT 1 FROM oeuvres WHERE slug = ${slug}`;
  await sql.end();
  return rows.length > 0;
}

/* ── Artiste / Bio ───────────────────────────────────────── */

export async function dbGetBio(): Promise<Record<string, string>> {
  const sql = getClient();
  const rows = await sql<{ data: Record<string, string> }[]>`
    SELECT data FROM artiste WHERE id = 1
  `;
  await sql.end();
  return rows[0]?.data ?? {};
}

export async function dbSetBio(data: Record<string, string>): Promise<void> {
  const sql = getClient();
  await sql`
    INSERT INTO artiste (id, data) VALUES (1, ${JSON.stringify(data)})
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
  await sql.end();
}

/* ── Newsletter ──────────────────────────────────────────── */

export type Subscriber = { email: string; lang: string; subscribed_at: string };

export async function dbGetSubscribers(): Promise<Subscriber[]> {
  const sql = getClient();
  const rows = await sql<Subscriber[]>`
    SELECT email, lang, subscribed_at FROM newsletter ORDER BY subscribed_at DESC
  `;
  await sql.end();
  return rows;
}

export async function dbSubscriberExists(email: string): Promise<boolean> {
  const sql = getClient();
  const rows = await sql`SELECT 1 FROM newsletter WHERE email = ${email.toLowerCase()}`;
  await sql.end();
  return rows.length > 0;
}

export async function dbAddSubscriber(email: string, lang: string): Promise<void> {
  const sql = getClient();
  await sql`
    INSERT INTO newsletter (email, lang)
    VALUES (${email.toLowerCase()}, ${lang})
    ON CONFLICT DO NOTHING
  `;
  await sql.end();
}
