import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { put } from "@vercel/blob";
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

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN non configuré — ajoute-le dans Vercel → Settings → Environment Variables" },
      { status: 500 }
    );
  }

  try {
    const blob = await put(`oeuvres/${safeName}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
