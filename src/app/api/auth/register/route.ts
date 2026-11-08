import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, subscriptions, plans } from "@/db/schema";
import { hashPassword, createSession, logAudit } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body as { email?: string; password?: string; name?: string };
    if (!email || !password || !name) return NextResponse.json({ error: "Faltan campos: nombre, email y contraseña." }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    const clean = email.trim().toLowerCase();
    const exists = await db.select().from(users).where(eq(users.email, clean)).limit(1);
    if (exists.length > 0) return NextResponse.json({ error: "Ese correo ya tiene cuenta. Inicia sesión." }, { status: 409 });

    // Primer usuario = owner (bootstrap). Resto = user/free
    const all = await db.select({ id: users.id }).from(users).limit(1);
    const isFirst = all.length === 0;
    const role = isFirst ? "owner" : "user";
    const plan = isFirst ? "premium" : "free";

    const inserted = await db
      .insert(users)
      .values({ email: clean, passwordHash: hashPassword(password), name: name.trim(), role, plan })
      .returning();
    const user = inserted[0];
    // plan free por defecto
    const planRows = await db.select().from(plans).where(eq(plans.slug, isFirst ? "celestial-annual" : "seeker")).limit(1);
    const slug = planRows[0]?.slug ?? (isFirst ? "celestial-annual" : "seeker");
    await db.insert(subscriptions).values({ userId: user.id, planSlug: slug, status: "active" });
    await createSession(user.id);
    await logAudit(user.id, "register", "user", user.id, { role, plan });
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno al registrar." }, { status: 500 });
  }
}
