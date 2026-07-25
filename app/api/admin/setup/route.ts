import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createTables, dbUpsertOeuvre } from "@/lib/db";
import { getAllOeuvres } from "@/lib/oeuvres";

export async function POST() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await createTables();

  /* Seed from existing MDX files */
  const oeuvres = getAllOeuvres();
  for (const o of oeuvres) {
    await dbUpsertOeuvre(o);
  }

  return NextResponse.json({ ok: true, seeded: oeuvres.length });
}
