import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { ghWrite, ghReadJson } from "@/lib/github-fs";
import fs from "fs";
import path from "path";

const BIO_PATH = "content/artiste.json";
const LOCAL = path.join(process.cwd(), BIO_PATH);

function readLocal() {
  if (!fs.existsSync(LOCAL)) return {};
  try { return JSON.parse(fs.readFileSync(LOCAL, "utf-8")); } catch { return {}; }
}

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = fs.existsSync(LOCAL) ? readLocal() : await ghReadJson(BIO_PATH, {});
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  await ghWrite(BIO_PATH, JSON.stringify(data, null, 2), "admin: update artist bio");
  return NextResponse.json({ ok: true });
}
