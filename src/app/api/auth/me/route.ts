import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const u = await getSessionUser().catch(() => null);
  if (!u) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { id: u.id, email: u.email, name: u.name, role: u.role, plan: u.plan } });
}
