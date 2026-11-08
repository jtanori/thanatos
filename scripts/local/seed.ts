import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../../src/db";
import { appSettings, interpretations, plans, subscriptions, users } from "../../src/db/schema";
import { ASC_CONTENT, HOUSE_CONTENT, MOON_CONTENT } from "../../src/lib/content";
import { hashPassword } from "../../src/lib/password";
import { assertLocalSeedAllowed } from "./seedGuard";

type SeedSubscription = {
  status: string;
  currentPeriodEnd: Date;
};

type SeedUser = {
  email: string;
  name: string;
  role: "owner" | "admin" | "editor" | "user";
  plan: "free" | "celestial" | "celestial-annual";
  subscription?: SeedSubscription;
};

const PLAN_SEEDS = [
  {
    slug: "seeker",
    name: "Seeker · Gratis (trial)",
    priceCents: 0,
    priceCentsUsd: 0,
    currency: "MXN",
    interval: "trial",
    features: ["1 Revolución Solar", "Ascendente anual + Casa del Sol (resumen)", "Rueda astral", "PDF trial"],
    active: true,
    maxCharts: 1,
    pdfAllowed: true,
  },
  {
    slug: "celestial",
    name: "Celestial · Mensual",
    priceCents: 14900,
    priceCentsUsd: 999,
    currency: "MXN",
    interval: "month",
    features: ["Revoluciones ilimitadas", "Lectura completa: Luna, stelliums, aspectos", "Casas Placidus / Iguales / Signo Entero", "PDF editorial completo"],
    active: true,
    maxCharts: 999,
    pdfAllowed: true,
  },
  {
    slug: "celestial-annual",
    name: "Celestial · Anual",
    priceCents: 149900,
    priceCentsUsd: 9999,
    currency: "MXN",
    interval: "year",
    features: ["Todo lo mensual", "Ahorra 2 meses", "Soporte prioritario"],
    active: true,
    maxCharts: 999,
    pdfAllowed: true,
  },
];

function futureDate(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function seedUsers(): SeedUser[] {
  return [
    {
      email: "owner@carta.natal",
      name: "Product Owner",
      role: "owner",
      plan: "celestial-annual",
      subscription: { status: "active", currentPeriodEnd: futureDate(365) },
    },
    {
      email: "admin@carta.natal",
      name: "Admin Sistema",
      role: "admin",
      plan: "celestial",
      subscription: { status: "active", currentPeriodEnd: futureDate(365) },
    },
    {
      email: "editor@carta.natal",
      name: "Editor Contenido",
      role: "editor",
      plan: "celestial",
      subscription: { status: "active", currentPeriodEnd: futureDate(365) },
    },
    {
      email: "free@carta.natal",
      name: "Free User",
      role: "user",
      plan: "free",
    },
    {
      email: "premium-active@carta.natal",
      name: "Premium Active",
      role: "user",
      plan: "celestial",
      subscription: { status: "active", currentPeriodEnd: futureDate(30) },
    },
    {
      email: "premium-trialing@carta.natal",
      name: "Premium Trialing",
      role: "user",
      plan: "celestial",
      subscription: { status: "trialing", currentPeriodEnd: futureDate(14) },
    },
    {
      email: "premium-past-due@carta.natal",
      name: "Premium Past Due",
      role: "user",
      plan: "celestial",
      subscription: { status: "past_due", currentPeriodEnd: futureDate(2) },
    },
    {
      email: "premium-canceled@carta.natal",
      name: "Premium Canceled",
      role: "user",
      plan: "celestial",
      subscription: { status: "canceled", currentPeriodEnd: futureDate(15) },
    },
    {
      email: "premium-expired@carta.natal",
      name: "Premium Expired",
      role: "user",
      plan: "free",
      subscription: { status: "canceled", currentPeriodEnd: futureDate(-1) },
    },
  ];
}

function interpretationRows(): Array<typeof interpretations.$inferInsert> {
  const rows: Array<typeof interpretations.$inferInsert> = [];

  for (const [sign, v] of Object.entries(ASC_CONTENT)) {
    rows.push({
      category: "ascendant",
      key: `ASC_${sign.toUpperCase()}`,
      title: v.title,
      contentShort: v.short,
      contentFull: v.full,
      contentPremium: v.premium,
      locale: "es",
    });
  }

  for (const [h, v] of Object.entries(HOUSE_CONTENT)) {
    rows.push({
      category: "sun_house",
      key: `SUN_HOUSE_${h}`,
      title: v.title,
      contentShort: v.short,
      contentFull: v.full,
      contentPremium: v.premium,
      locale: "es",
    });
  }

  for (const [sign, txt] of Object.entries(MOON_CONTENT)) {
    rows.push({
      category: "moon",
      key: `MOON_${sign.toUpperCase()}`,
      title: `Luna en ${sign} — necesidad emocional del año`,
      contentShort: txt,
      contentFull: `${txt} Observa en qué casa cae: ahí buscarás refugio y nutrición.`,
      contentPremium: `${txt} Premium: crea un ritual lunar mensual en esa casa. Luna llena = culminación; luna nueva = siembra.`,
      locale: "es",
    });
  }

  rows.push({
    category: "overview",
    key: "OVERVIEW",
    title: "Cómo leer tu Revolución Solar",
    contentShort: "El Ascendente anual da el tono, la Casa del Sol el escenario, la Luna la necesidad emocional y los stelliums el foco concentrado.",
    contentFull: "Metodología: 1) Calculamos tu Sol natal exacto. 2) Buscamos el retorno (cuando el Sol en tránsito vuelve al mismo grado/minuto). 3) Levantamos casas con tu ubicación de cumpleaños. 4) Cruzamos RS vs natal por aspectos. Gratis = Asc + Casa del Sol. Premium = todo + timeline mensual.",
    contentPremium: "Uso profesional: combina RS con tránsitos y progresiones. Si el Asc RS cae sobre un planeta natal, ese planeta se vuelve cronocrator del año.",
    locale: "es",
  });

  rows.push({
    category: "stellium",
    key: "STELLIUM",
    title: "Stelliums: concentración de energía",
    contentShort: "3+ planetas en un signo o casa indican el sector más ocupado del año.",
    contentFull: "Un stellium es un comité planetario: donde cae, hay ruido, aprendizaje acelerado y necesidad de gestión consciente. En signo = estilo; en casa = escenario.",
    contentPremium: "Premium: si el stellium toca tu Sol/Luna/Asc natal, es año bisagra. Agenda revisión trimestral de ese sector.",
    locale: "es",
  });

  return rows;
}

async function seedLocal(): Promise<void> {
  const password = process.env.LOCAL_SEED_PASSWORD;
  if (!password) throw new Error("LOCAL_SEED_PASSWORD is required");

  for (const plan of PLAN_SEEDS) {
    const existing = await db.select().from(plans).where(eq(plans.slug, plan.slug)).limit(1);
    if (existing.length === 0) {
      await db.insert(plans).values(plan);
    } else {
      await db
        .update(plans)
        .set({
          priceCents: plan.priceCents,
          priceCentsUsd: plan.priceCentsUsd,
          currency: plan.currency,
          features: plan.features,
          pdfAllowed: plan.pdfAllowed,
        })
        .where(eq(plans.slug, plan.slug));
    }
  }

  const existingInterpretations = await db.select().from(interpretations).limit(1);
  if (existingInterpretations.length === 0) {
    for (const row of interpretationRows()) {
      await db.insert(interpretations).values(row);
    }
  }

  await db.insert(appSettings).values({ key: "site_name", value: { v: "Carta Natal · Revolución Solar" } }).onConflictDoNothing();
  await db.insert(appSettings).values({ key: "free_limits", value: { maxCharts: 1, pdf: false } }).onConflictDoNothing();
  await db.insert(appSettings).values({ key: "calc_notice", value: { v: "Precisión media (Meeus). Para rectificación profesional usar efemérides suizas." } }).onConflictDoNothing();

  for (const fixture of seedUsers()) {
    const existing = await db.select().from(users).where(eq(users.email, fixture.email)).limit(1);
    let userId: string;

    if (existing.length === 0) {
      const inserted = await db
        .insert(users)
        .values({
          email: fixture.email,
          name: fixture.name,
          role: fixture.role,
          plan: fixture.plan,
          passwordHash: hashPassword(password),
        })
        .returning({ id: users.id });
      userId = inserted[0].id;
    } else {
      userId = existing[0].id;
      await db
        .update(users)
        .set({
          name: fixture.name,
          role: fixture.role,
          plan: fixture.plan,
          passwordHash: hashPassword(password),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    }

    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));

    if (fixture.subscription) {
      await db.insert(subscriptions).values({
        userId,
        planSlug: fixture.plan,
        status: fixture.subscription.status,
        currency: "MXN",
        currentPeriodEnd: fixture.subscription.currentPeriodEnd,
      });
    }
  }

  console.log(`Local seed complete: ${seedUsers().length} users, ${PLAN_SEEDS.length} plans.`);
}

assertLocalSeedAllowed();

seedLocal().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
