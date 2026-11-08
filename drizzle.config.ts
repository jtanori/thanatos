import { defineConfig } from "drizzle-kit";

// Reads DATABASE_URL from the environment (drizzle-kit loads .env automatically).
// Local:      postgresql://postgres:postgres@127.0.0.1:5432/app_db
// Staging:    point DATABASE_URL at the staging database before running db:migrate.
// Production: point DATABASE_URL at the production database before running db:migrate.
// Never use drizzle-kit push against staging, production, or any shared database.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
