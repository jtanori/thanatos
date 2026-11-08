import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { interpretations } from "@/db/schema";
import { getSessionUser, canAccess, logAudit } from "@/lib/auth";

export async function GET() {
  const me = await getSessionUser().catch(() => null);
  if (!me || !canAccess(me.role, "editor")) return NextResponse.json({ error: "Solo editor/admin/owner." }, { status: 403 });
  const rows = await db.select().from(interpretations).orderBy(desc(interpretations.updatedAt)).limit(200);
  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  const me = await getSessionUser().catch(() => null);
  if (!me || !canAccess(me.role, "editor")) return NextResponse.json({ error: "Solo editor/admin/owner." }, { status: 403 });
  const body = await req.json();
  const { category, key, title, contentShort, contentFull, contentPremium } = body as Record<string, string>;
  if (!category || !key || !title || !contentShort || !contentFull) return NextResponse.json({ error: "Faltan campos." }, { status: 400 });
  const ins = await db.insert(interpretations).values({ category, key, title, contentShort, contentFull, contentPremium, locale: "es", updatedBy: me.id }).returning();
  await logAudit(me.id, "create_knowledge", "interpretation", ins[0].id, { key });
  return NextResponse.json({ ok: true, item: ins[0] });
}

export async function PATCH(req: Request) {
  const me = await getSessionUser().catch(() => null);
  if (!me || !canAccess(me.role, "editor")) return NextResponse.json({ error: "Solo editor/admin/owner." }, { status: 403 });
  const body = await req.json();
  const { id, title, contentShort, contentFull, contentPremium } = body as Record<string, string>;
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 });
  const upd = await db.update(interpretations).set({ title, contentShort, contentFull, contentPremium, updatedBy: me.id, updatedAt: new Date() }).where(eq(interpretations.id, id)).returning();
  await logAudit(me.id, "update_knowledge", "interpretation", id, { title });
  return NextResponse.json({ ok: true, item: upd[0] });
}
