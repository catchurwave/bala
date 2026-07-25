import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { dbGetAllOeuvres, dbUpsertOeuvre, dbSlugExists } from "@/lib/db";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const oeuvres = await dbGetAllOeuvres();
  return NextResponse.json(oeuvres);
}

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const slug = data.slug?.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  if (!slug) return NextResponse.json({ error: "Slug invalide" }, { status: 400 });

  if (await dbSlugExists(slug)) {
    return NextResponse.json({ error: "Un tableau avec ce slug existe déjà" }, { status: 409 });
  }

  await dbUpsertOeuvre({ ...data, slug, prix: data.prix ?? null });
  return NextResponse.json({ ok: true, slug }, { status: 201 });
}
