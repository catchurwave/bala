import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { dbGetBio, dbSetBio } from "@/lib/db";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await dbGetBio());
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  await dbSetBio(data);
  return NextResponse.json({ ok: true });
}
