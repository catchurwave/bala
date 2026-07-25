import { NextResponse } from "next/server";
import { dbGetAllOeuvres } from "@/lib/db";

export async function GET() {
  const oeuvres = await dbGetAllOeuvres();
  return NextResponse.json(oeuvres);
}
