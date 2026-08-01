/**
 * fix-rotation.mjs
 * Rotate sideways paintings 90° CW, re-upload to Vercel Blob.
 *
 * Usage:
 *   node --env-file=.env.local scripts/fix-rotation.mjs
 */

import { execSync } from "child_process";
import { resolve, join } from "path";
import { existsSync, mkdirSync, rmSync } from "fs";
import { put } from "@vercel/blob";
import { readFileSync } from "fs";

const TABLEAUX_DIR = resolve(process.cwd(), "../tableaux");
const TMP_DIR = resolve(process.cwd(), "/tmp/fix-rotation");

const TO_FIX = [
  { file: "WhatsApp Image 2026-07-25 at 16.08.06 (1).jpeg", slug: "port-dans-la-brume" },
  { file: "WhatsApp Image 2026-07-25 at 16.08.06 (3).jpeg", slug: "l-horizon-turquoise" },
  { file: "WhatsApp Image 2026-07-25 at 16.08.07 (5).jpeg", slug: "ile-et-mats-dans-la-brume" },
  { file: "WhatsApp Image 2026-07-25 at 16.08.08 (6).jpeg", slug: "le-marche-aux-fleurs" },
  { file: "WhatsApp Image 2026-07-25 at 16.08.09 (2).jpeg", slug: "procession-folklorique" },
];

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("❌ BLOB_READ_WRITE_TOKEN not set");
  process.exit(1);
}

mkdirSync(TMP_DIR, { recursive: true });

for (const { file, slug } of TO_FIX) {
  const src = join(TABLEAUX_DIR, file);
  const dst = join(TMP_DIR, `${slug}.jpg`);

  if (!existsSync(src)) {
    console.warn(`⚠️  Not found: ${file}`);
    continue;
  }

  // Rotate 90° CW using PIL
  console.log(`🔄 Rotating: ${slug}`);
  execSync(
    `python3 -c "
from PIL import Image
img = Image.open('${src}')
rotated = img.rotate(-90, expand=True)
rotated.save('${dst}', 'JPEG', quality=92)
"`
  );

  // Re-upload to Vercel Blob (overwrites)
  console.log(`📤 Uploading: oeuvres/${slug}.jpg`);
  const buffer = readFileSync(dst);
  const result = await put(`oeuvres/${slug}.jpg`, buffer, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: "image/jpeg",
    addRandomSuffix: false,
  });

  console.log(`   ✅ ${result.url}`);
}

rmSync(TMP_DIR, { recursive: true });
console.log("\n✅ Done. DB URLs unchanged — no DB update needed.");
