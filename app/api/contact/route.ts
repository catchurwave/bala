import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  /*
   * To enable email delivery, set these env vars and uncomment the nodemailer block:
   *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL
   *
   * npm install nodemailer @types/nodemailer
   *
   * import nodemailer from "nodemailer";
   * const transporter = nodemailer.createTransport({
   *   host: process.env.SMTP_HOST,
   *   port: Number(process.env.SMTP_PORT ?? 587),
   *   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
   * });
   * await transporter.sendMail({
   *   from: `"${name}" <${email}>`,
   *   to: process.env.CONTACT_TO_EMAIL,
   *   subject: `[Contact site] ${subject}`,
   *   text: message,
   * });
   */

  console.log("[CONTACT]", { name, email, subject, message });

  return NextResponse.json({ ok: true });
}
