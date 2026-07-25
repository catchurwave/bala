import { NextResponse } from "next/server";
import { createTables, dbUpsertOeuvre } from "@/lib/db";
import { getAllOeuvres } from "@/lib/oeuvres";

async function run() {
  await createTables();
  const oeuvres = getAllOeuvres();
  for (const o of oeuvres) {
    await dbUpsertOeuvre(o);
  }
  return oeuvres.length;
}

export async function GET() {
  try {
    const seeded = await run();
    return NextResponse.json({ ok: true, message: `Tables créées. ${seeded} tableau(x) importé(s).` });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST() {
  try {
    const seeded = await run();
    return NextResponse.json({ ok: true, seeded });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
