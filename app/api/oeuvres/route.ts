import { NextResponse } from "next/server";
import { getAllOeuvres } from "@/lib/oeuvres";

export function GET() {
  const oeuvres = getAllOeuvres();
  return NextResponse.json(oeuvres);
}
