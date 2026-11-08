import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const me = await getSessionUser().catch(() => null);
  if (!me) return NextResponse.json({ error: "Inicia sesión." }, { status: 401 });
  const body = await req.json();
  const { name, birthPlace, birthTimezone } = body as Record<string, string>;
  await db.update(users).set({
    name: (name as string) || me.name,
    birthPlace: (birthPlace as string) ?? me.birthPlace,
    birthTimezone: (birthTimezone as string) ?? me.birthTimezone,
    updatedAt: new Date(),
  }).where(eq(users.id, me.id));
  return NextResponse.json({ ok: true });
}
