import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

const BIO_FILE = path.join(process.cwd(), "content/artiste.json");

function readBio() {
  if (!fs.existsSync(BIO_FILE)) return {};
  return JSON.parse(fs.readFileSync(BIO_FILE, "utf-8"));
}

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(readBio());
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const dir = path.dirname(BIO_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(BIO_FILE, JSON.stringify(data, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
