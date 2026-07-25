import { NextRequest, NextResponse } from "next/server";
import { dbSubscriberExists, dbAddSubscriber } from "@/lib/db";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const { email, lang } = await req.json();

  if (!email || !validateEmail(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  if (await dbSubscriberExists(email)) {
    return NextResponse.json({ error: "Déjà inscrit" }, { status: 409 });
  }

  await dbAddSubscriber(email, lang ?? "fr");
  return NextResponse.json({ ok: true });
}
