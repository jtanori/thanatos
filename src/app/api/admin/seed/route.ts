import { NextResponse } from "next/server";
import { db } from "@/db";
import { plans, interpretations, appSettings, users } from "@/db/schema";
import { getSessionUser, canAccess, hashPassword } from "@/lib/auth";
import { ASC_CONTENT, HOUSE_CONTENT, MOON_CONTENT } from "@/lib/content";
import { eq } from "drizzle-orm";

export async function POST() {
  const me = await getSessionUser().catch(() => null);
  // Permite seed si no hay usuarios (bootstrap) o si es owner/admin
  const anyUsers = await db.select({ id: users.id }).from(users).limit(1);
  if (anyUsers.length > 0 && (!me || !canAccess(me.role, "admin"))) {
    return NextResponse.json({ error: "Solo admin/owner." }, { status: 403 });
  }

  // Planes MXN por defecto + USD: free (Seeker) + paid (Celestial mensual/anual)
  const planSeeds = [
    { slug: "seeker", name: "Seeker · Gratis (trial)", priceCents: 0, priceCentsUsd: 0, currency: "MXN", interval: "trial", features: ["1 Revolución Solar", "Ascendente anual + Casa del Sol (resumen)", "Rueda astral", "PDF trial"], active: true, maxCharts: 1, pdfAllowed: true },
    { slug: "celestial", name: "Celestial · Mensual", priceCents: 14900, priceCentsUsd: 999, currency: "MXN", interval: "month", features: ["Revoluciones ilimitadas", "Lectura completa: Luna, stelliums, aspectos", "Casas Placidus / Iguales / Signo Entero", "PDF editorial completo"], active: true, maxCharts: 999, pdfAllowed: true },
    { slug: "celestial-annual", name: "Celestial · Anual", priceCents: 149900, priceCentsUsd: 9999, currency: "MXN", interval: "year", features: ["Todo lo mensual", "Ahorra 2 meses", "Soporte prioritario"], active: true, maxCharts: 999, pdfAllowed: true },
  ];
  for (const p of planSeeds) {
    const ex = await db.select().from(plans).where(eq(plans.slug, p.slug)).limit(1);
    if (ex.length === 0) await db.insert(plans).values(p);
    else await db.update(plans).set({ priceCents: p.priceCents, priceCentsUsd: p.priceCentsUsd, currency: p.currency, features: p.features, pdfAllowed: p.pdfAllowed }).where(eq(plans.slug, p.slug));
  }

  // Interpretaciones
  const existing = await db.select().from(interpretations).limit(1);
  if (existing.length === 0) {
    const rows: Array<typeof interpretations.$inferInsert> = [];
    for (const [sign, v] of Object.entries(ASC_CONTENT)) {
      rows.push({ category: "ascendant", key: `ASC_${sign.toUpperCase()}`, title: v.title, contentShort: v.short, contentFull: v.full, contentPremium: v.premium, locale: "es" });
    }
    for (const [h, v] of Object.entries(HOUSE_CONTENT)) {
      rows.push({ category: "sun_house", key: `SUN_HOUSE_${h}`, title: v.title, contentShort: v.short, contentFull: v.full, contentPremium: v.premium, locale: "es" });
    }
    for (const [sign, txt] of Object.entries(MOON_CONTENT)) {
      rows.push({ category: "moon", key: `MOON_${sign.toUpperCase()}`, title: `Luna en ${sign} — necesidad emocional del año`, contentShort: txt, contentFull: txt + " Observa en qué casa cae: ahí buscarás refugio y nutrición.", contentPremium: txt + " Premium: crea un ritual lunar mensual en esa casa. Luna llena = culminación; luna nueva = siembra.", locale: "es" });
    }
    rows.push({
      category: "overview", key: "OVERVIEW", title: "Cómo leer tu Revolución Solar",
      contentShort: "El Ascendente anual da el tono, la Casa del Sol el escenario, la Luna la necesidad emocional y los stelliums el foco concentrado.",
      contentFull: "Metodología: 1) Calculamos tu Sol natal exacto. 2) Buscamos el retorno (cuando el Sol en tránsito vuelve al mismo grado/minuto). 3) Levantamos casas con tu ubicación de cumpleaños. 4) Cruzamos RS vs natal por aspectos. Gratis = Asc + Casa del Sol. Premium = todo + timeline mensual.",
      contentPremium: "Uso profesional: combina RS con tránsitos y progresiones. Si el Asc RS cae sobre un planeta natal, ese planeta se vuelve cronocrator del año.",
      locale: "es",
    });
    rows.push({
      category: "stellium", key: "STELLIUM", title: "Stelliums: concentración de energía",
      contentShort: "3+ planetas en un signo o casa indican el sector más ocupado del año.",
      contentFull: "Un stellium es un comité planetario: donde cae, hay ruido, aprendizaje acelerado y necesidad de gestión consciente. En signo = estilo; en casa = escenario.",
      contentPremium: "Premium: si el stellium toca tu Sol/Luna/Asc natal, es año bisagra. Agenda revisión trimestral de ese sector.",
      locale: "es",
    });
    for (const r of rows) await db.insert(interpretations).values(r);
  }

  await db.insert(appSettings).values({ key: "site_name", value: { v: "Carta Natal · Revolución Solar" } }).onConflictDoNothing();
  await db.insert(appSettings).values({ key: "free_limits", value: { maxCharts: 1, pdf: false } }).onConflictDoNothing();
  await db.insert(appSettings).values({ key: "calc_notice", value: { v: "Precisión media (Meeus). Para rectificación profesional usar efemérides suizas." } }).onConflictDoNothing();

  // Usuarios demo si no existen (owner/admin/editor/user)
  const mk = async (email: string, name: string, role: string, plan: string) => {
    const ex = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (ex.length === 0) {
      await db.insert(users).values({ email, name, role, plan, passwordHash: hashPassword("password123") });
    }
  };
  await mk("owner@carta.natal", "Product Owner", "owner", "premium");
  await mk("admin@carta.natal", "Admin Sistema", "admin", "premium");
  await mk("editor@carta.natal", "Editor Contenido", "editor", "premium");
  await mk("user@carta.natal", "Usuario Demo", "user", "free");

  return NextResponse.json({ ok: true, message: "Seed completo: planes, interpretaciones, ajustes y usuarios demo (password123)." });
}
