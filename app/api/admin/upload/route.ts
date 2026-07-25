import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Type non supporté (jpg/png/webp uniquement)" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop lourd (max 10 Mo)" }, { status: 400 });
  }

  /* Sanitize filename — only keep alphanumeric, hyphens, dots */
  const safeName = path
    .basename(file.name)
    .toLowerCase()
    .replace(/[^a-z0-9.\-]/g, "-");

  const uploadDir = path.join(process.cwd(), "public/images/oeuvres");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  fs.writeFileSync(path.join(uploadDir, safeName), Buffer.from(bytes));

  return NextResponse.json({ url: `/images/oeuvres/${safeName}` });
}
