import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { writeOeuvre, deleteOeuvre } from "@/lib/admin-oeuvres";
import { getOeuvre } from "@/lib/oeuvres";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const oeuvre = getOeuvre(slug);
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
  writeOeuvre({ ...data, slug });
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
  deleteOeuvre(slug);
  return NextResponse.json({ ok: true });
}
