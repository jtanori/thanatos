import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { db } from "@/db";
import { sessions, users, type User } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/password";

export { hashPassword, verifyPassword } from "@/lib/password";

const SESSION_COOKIE = "sr_session";
const SESSION_DAYS = 30;

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({ userId, token, expiresAt });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const { eq: eq2 } = await import("drizzle-orm");
    await db.delete(sessions).where(eq2(sessions.token, token));
  }
  jar.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getSessionUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({ user: users, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);
  if (rows.length === 0) return null;
  if (new Date(rows[0].expiresAt) < new Date()) return null;
  return rows[0].user;
}

export async function requireUser(): Promise<User> {
  const u = await getSessionUser();
  if (!u) throw new Error("UNAUTHORIZED");
  return u;
}

export type Role = "owner" | "admin" | "editor" | "user";
const RANK: Record<Role, number> = { user: 0, editor: 1, admin: 2, owner: 3 };

export function canAccess(userRole: string, needed: Role): boolean {
  const a = RANK[(userRole as Role) ?? "user"] ?? 0;
  const b = RANK[needed] ?? 0;
  return a >= b;
}

export function isPremiumUser(u: { plan?: string | null } | null | undefined): boolean {
  if (!u) return false;
  return u.plan === "premium" || u.plan === "celestial" || u.plan === "celestial-annual";
}

export async function logAudit(actorId: string | null, action: string, entity: string, entityId?: string, meta?: unknown) {
  try {
    const { auditLogs } = await import("@/db/schema");
    await db.insert(auditLogs).values({ actorId, action, entity, entityId, meta: (meta as object) ?? null });
  } catch {
    // ignore
  }
}
