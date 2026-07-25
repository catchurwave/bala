import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!expected) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not set" }, { status: 500 });
  }

  const a = Buffer.from(password ?? "");
  const b = Buffer.from(expected);
  const match =
    a.length === b.length && timingSafeEqual(a, b);

  if (!match) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  const token = await signToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600,
  });
  return res;
}
