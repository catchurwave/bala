import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { ghWriteBinary } from "@/lib/github-fs";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Type non supporté (jpg/png/webp)" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop lourd (max 10 Mo)" }, { status: 400 });
  }

  const safeName = path
    .basename(file.name)
    .toLowerCase()
    .replace(/[^a-z0-9.\-]/g, "-");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await ghWriteBinary(
    `public/images/oeuvres/${safeName}`,
    buffer,
    `admin: upload image ${safeName}`
  );

  return NextResponse.json({ url: `/images/oeuvres/${safeName}` });
}
