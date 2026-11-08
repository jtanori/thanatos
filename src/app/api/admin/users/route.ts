import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { getSessionUser, canAccess, logAudit } from "@/lib/auth";

export async function GET() {
  const me = await getSessionUser().catch(() => null);
  if (!me || !canAccess(me.role, "admin")) return NextResponse.json({ error: "Solo admin/owner." }, { status: 403 });
  const rows = await db.select().from(users).orderBy(desc(users.createdAt)).limit(100);
  return NextResponse.json({ users: rows.map((u) => ({ ...u, passwordHash: undefined })) });
}

export async function PATCH(req: Request) {
  const me = await getSessionUser().catch(() => null);
  if (!me || !canAccess(me.role, "admin")) return NextResponse.json({ error: "Solo admin/owner." }, { status: 403 });
  const { id, role, plan } = (await req.json()) as { id?: string; role?: string; plan?: string };
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 });
  // Solo owner puede tocar roles owner/admin
  if (role && ["owner", "admin"].includes(role) && me.role !== "owner") {
    return NextResponse.json({ error: "Solo el Product Owner puede asignar owner/admin." }, { status: 403 });
  }
  const patch: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
  if (role && ["owner", "admin", "editor", "user"].includes(role)) (patch as Record<string, unknown>).role = role;
  if (plan && ["free", "premium", "celestial", "celestial-annual", "seeker"].includes(plan)) (patch as Record<string, unknown>).plan = plan;
  await db.update(users).set(patch).where(eq(users.id, id));
  if (plan) {
    await db.insert(subscriptions).values({ userId: id, planSlug: plan === "free" ? "seeker" : plan === "premium" ? "celestial-annual" : plan, status: "active" });
  }
  await logAudit(me.id, "update_user", "user", id, { role, plan });
  return NextResponse.json({ ok: true });
}
