import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword, createSession, logAudit } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as { email?: string; password?: string };
    if (!email || !password) return NextResponse.json({ error: "Email y contraseña requeridos." }, { status: 400 });
    const rows = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
    if (rows.length === 0) return NextResponse.json({ error: "No encontramos esa cuenta." }, { status: 404 });
    const user = rows[0];
    if (!verifyPassword(password, user.passwordHash)) return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
    await createSession(user.id);
    await logAudit(user.id, "login", "user", user.id, {});
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
