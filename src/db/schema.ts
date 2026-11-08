import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  doublePrecision,
  integer,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 32 }).notNull().default("user"),
  plan: varchar("plan", { length: 32 }).notNull().default("free"),
  locale: varchar("locale", { length: 16 }).notNull().default("es"),
  currency: varchar("currency", { length: 8 }).notNull().default("MXN"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 128 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 128 }),
  birthDate: varchar("birth_date", { length: 32 }),
  birthTime: varchar("birth_time", { length: 32 }),
  birthPlace: varchar("birth_place", { length: 255 }),
  birthLat: doublePrecision("birth_lat"),
  birthLon: doublePrecision("birth_lon"),
  birthTimezone: varchar("birth_timezone", { length: 64 }),
  returnPlace: varchar("return_place", { length: 255 }),
  returnLat: doublePrecision("return_lat"),
  returnLon: doublePrecision("return_lon"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const solarCharts = pgTable("solar_charts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  guestName: varchar("guest_name", { length: 255 }),
  targetYear: integer("target_year").notNull(),
  birthDate: varchar("birth_date", { length: 32 }).notNull(),
  birthTime: varchar("birth_time", { length: 32 }).notNull(),
  birthPlace: varchar("birth_place", { length: 255 }).notNull(),
  birthLat: doublePrecision("birth_lat").notNull(),
  birthLon: doublePrecision("birth_lon").notNull(),
  birthTimezone: varchar("birth_timezone", { length: 64 }).notNull().default("America/Mexico_City"),
  returnPlace: varchar("return_place", { length: 255 }).notNull(),
  returnLat: doublePrecision("return_lat").notNull(),
  returnLon: doublePrecision("return_lon").notNull(),
  houseSystem: varchar("house_system", { length: 16 }).notNull().default("equal"),
  natalSunLongitude: doublePrecision("natal_sun_longitude").notNull(),
  returnMomentUtc: timestamp("return_moment_utc").notNull(),
  ascLongitude: doublePrecision("asc_longitude").notNull(),
  ascSign: varchar("asc_sign", { length: 32 }).notNull(),
  mcLongitude: doublePrecision("mc_longitude").notNull(),
  sunHouse: integer("sun_house").notNull(),
  moonSign: varchar("moon_sign", { length: 32 }).notNull(),
  moonHouse: integer("moon_house").notNull(),
  stelliums: jsonb("stelliums").notNull().default([]),
  planetsNatal: jsonb("planets_natal").notNull().default([]),
  planetsReturn: jsonb("planets_return").notNull().default([]),
  houses: jsonb("houses").notNull().default([]),
  aspects: jsonb("aspects").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const interpretations = pgTable("interpretations", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: varchar("category", { length: 64 }).notNull(),
  key: varchar("key", { length: 128 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  contentShort: text("content_short").notNull(),
  contentFull: text("content_full").notNull(),
  contentPremium: text("content_premium"),
  locale: varchar("locale", { length: 16 }).notNull().default("es"),
  version: integer("version").notNull().default(1),
  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  priceCents: integer("price_cents").notNull().default(0),
  currency: varchar("currency", { length: 16 }).notNull().default("MXN"),
  priceCentsUsd: integer("price_cents_usd").notNull().default(0),
  stripePriceIdMxn: varchar("stripe_price_id_mxn", { length: 128 }),
  stripePriceIdUsd: varchar("stripe_price_id_usd", { length: 128 }),
  interval: varchar("interval", { length: 32 }).notNull().default("once"),
  features: jsonb("features").notNull().default([]),
  active: boolean("active").notNull().default(true),
  maxCharts: integer("max_charts").notNull().default(1),
  pdfAllowed: boolean("pdf_allowed").notNull().default(false),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  planSlug: varchar("plan_slug", { length: 64 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("active"),
  currency: varchar("currency", { length: 8 }).notNull().default("MXN"),
  stripeSessionId: varchar("stripe_session_id", { length: 128 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 128 }),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id),
  action: varchar("action", { length: 128 }).notNull(),
  entity: varchar("entity", { length: 64 }).notNull(),
  entityId: varchar("entity_id", { length: 128 }),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const appSettings = pgTable("app_settings", {
  key: varchar("key", { length: 128 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type SolarChart = typeof solarCharts.$inferSelect;
export type Interpretation = typeof interpretations.$inferSelect;
