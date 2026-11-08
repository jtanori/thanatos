import { NextResponse } from "next/server";
import { db } from "@/db";
import { appSettings, plans } from "@/db/schema";
import { getSessionUser, canAccess, logAudit } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const me = await getSessionUser().catch(() => null);
  if (!me || !canAccess(me.role, "admin")) return NextResponse.json({ error: "Solo admin/owner." }, { status: 403 });
  const s = await db.select().from(appSettings);
  const p = await db.select().from(plans);
  return NextResponse.json({ settings: s, plans: p });
}

export async function POST(req: Request) {
  const me = await getSessionUser().catch(() => null);
  if (!me || !canAccess(me.role, "owner")) return NextResponse.json({ error: "Solo Product Owner puede configurar el producto." }, { status: 403 });
  const { key, value } = (await req.json()) as { key?: string; value?: unknown };
  if (!key) return NextResponse.json({ error: "Falta key." }, { status: 400 });
  await db.insert(appSettings).values({ key, value: (value as object) ?? {}, updatedBy: me.id }).onConflictDoUpdate({ target: appSettings.key, set: { value: (value as object) ?? {}, updatedBy: me.id, updatedAt: new Date() } });
  await logAudit(me.id, "update_setting", "setting", key, value);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  // actualizar plan (owner)
  const me = await getSessionUser().catch(() => null);
  if (!me || !canAccess(me.role, "owner")) return NextResponse.json({ error: "Solo Product Owner." }, { status: 403 });
  const { slug, name, priceCents, active, features } = (await req.json()) as Record<string, string | number | boolean | string[]>;
  if (!slug) return NextResponse.json({ error: "Falta slug." }, { status: 400 });
  await db.update(plans).set({ name: name as string, priceCents: priceCents as number, active: active as boolean, features: (features as string[]) ?? [] }).where(eq(plans.slug, slug as string));
  await logAudit(me.id, "update_plan", "plan", slug as string, { name, priceCents });
  return NextResponse.json({ ok: true });
}
