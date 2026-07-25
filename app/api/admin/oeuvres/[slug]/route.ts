import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { dbGetOeuvre, dbUpsertOeuvre, dbDeleteOeuvre } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const oeuvre = await dbGetOeuvre(slug);
  if (!oeuvre) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(oeuvre);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const data = await req.json();
  await dbUpsertOeuvre({ ...data, slug, prix: data.prix ?? null });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  await dbDeleteOeuvre(slug);
  return NextResponse.json({ ok: true });
}
