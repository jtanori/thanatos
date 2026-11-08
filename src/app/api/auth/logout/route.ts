import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  await destroySession();
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"), 303);
}
export async function GET() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
