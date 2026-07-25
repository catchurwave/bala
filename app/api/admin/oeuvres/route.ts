import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { writeOeuvre, oeuvreExists } from "@/lib/admin-oeuvres";
import { getAllOeuvres } from "@/lib/oeuvres";
import { ghWrite } from "@/lib/github-fs";
import { buildMdxContent } from "@/lib/admin-oeuvres";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getAllOeuvres());
}

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  if (oeuvreExists(data.slug)) {
    return NextResponse.json({ error: "Un tableau avec ce slug existe déjà" }, { status: 409 });
  }

  const slug = writeOeuvre(data);
  const mdx = buildMdxContent({ ...data, slug });
  await ghWrite(`content/oeuvres/${slug}.mdx`, mdx, `admin: add painting "${data.titre}"`);

  return NextResponse.json({ ok: true, slug }, { status: 201 });
}
