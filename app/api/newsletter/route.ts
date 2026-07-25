import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "content/newsletter.json");

type Subscriber = { email: string; lang: string; date: string };

function readSubscribers(): Subscriber[] {
  if (!fs.existsSync(FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeSubscribers(list: Subscriber[]) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const { email, lang } = await req.json();

  if (!email || !validateEmail(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const list = readSubscribers();
  const exists = list.some((s) => s.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    return NextResponse.json({ error: "Déjà inscrit" }, { status: 409 });
  }

  list.push({ email: email.toLowerCase(), lang: lang ?? "fr", date: new Date().toISOString() });
  writeSubscribers(list);

  /*
   * Optionnel : intégrer Brevo / Mailchimp
   * await fetch("https://api.brevo.com/v3/contacts", {
   *   method: "POST",
   *   headers: { "api-key": process.env.BREVO_API_KEY ?? "", "Content-Type": "application/json" },
   *   body: JSON.stringify({ email, listIds: [Number(process.env.BREVO_LIST_ID)] }),
   * });
   */

  return NextResponse.json({ ok: true });
}
