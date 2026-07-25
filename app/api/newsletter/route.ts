import { NextRequest, NextResponse } from "next/server";
import { ghWrite, ghReadJson } from "@/lib/github-fs";
import fs from "fs";
import path from "path";

const GH_PATH = "content/newsletter.json";
const LOCAL = path.join(process.cwd(), GH_PATH);

type Subscriber = { email: string; lang: string; date: string };

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readSubscribers(): Promise<Subscriber[]> {
  if (fs.existsSync(LOCAL)) {
    try { return JSON.parse(fs.readFileSync(LOCAL, "utf-8")); } catch { /* fall through */ }
  }
  return ghReadJson<Subscriber[]>(GH_PATH, []);
}

export async function POST(req: NextRequest) {
  const { email, lang } = await req.json();

  if (!email || !validateEmail(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const list = await readSubscribers();
  const exists = list.some((s) => s.email.toLowerCase() === email.toLowerCase());

  if (exists) return NextResponse.json({ error: "Déjà inscrit" }, { status: 409 });

  list.push({ email: email.toLowerCase(), lang: lang ?? "fr", date: new Date().toISOString() });

  await ghWrite(GH_PATH, JSON.stringify(list, null, 2), `newsletter: new subscriber ${email}`);

  return NextResponse.json({ ok: true });
}
