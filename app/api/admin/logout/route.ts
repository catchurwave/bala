import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

function clearCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}

export async function GET(req: NextRequest) {
  const home = new URL("/", req.url);
  return clearCookie(NextResponse.redirect(home));
}

export async function POST() {
  return clearCookie(NextResponse.json({ ok: true }));
}
