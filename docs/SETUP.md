# Setup Guide — Local · Staging · Production

Stack: **Next.js 16 (App Router) + React 19 · PostgreSQL + Drizzle ORM · Tailwind v4 · Stripe · @react-pdf · Leaflet/OpenStreetMap**. Bilingual ES/EN, MXN default currency.

An interactive, bilingual version of this guide lives in the app at **`/guia`**.

---

## 1. Prerequisites (all environments)

| Tool | Version | Check |
|---|---|---|
| Node.js | 20+ | `node -v` |
| npm | 10+ | `npm -v` |
| PostgreSQL | 15+ (local only; managed PG for staging/prod, e.g. Neon/Supabase/RDS) | `psql --version` |
| Stripe CLI | latest (only if testing real payments locally) | `stripe --version` |
| Git | any | `git --version` |

---

## 2. Local setup

```bash
# 1) Install
npm install

# 2) Environment
cp .env.example .env
# .env already points at local Postgres:
# DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db

# 3) Create the database (if it doesn't exist)
psql postgresql://postgres:postgres@127.0.0.1:5432/postgres -c "CREATE DATABASE app_db;"

# 4) Apply schema (drizzle.config.ts reads DATABASE_URL from .env)
npx drizzle-kit push

# 5) Run
npm run dev   # http://localhost:3000
```

**Seed the demo data** (plans in MXN/USD, interpretations, settings, demo users). The seed endpoint is open **only while the users table is empty**; afterwards it requires an admin/owner session:

```bash
curl -X POST http://localhost:3000/api/admin/seed
```

Demo accounts (password `password123`): `owner@carta.natal` · `admin@carta.natal` · `editor@carta.natal` · `user@carta.natal`

**Usage manual (dev only):** while running `npm run dev`, open `/manual` — a web-based, per-role guide (visitor → free → premium → editor → admin → owner) with steps, limits, and verification checklists. The route is gated with `NODE_ENV !== "development"` → 404, so it never ships to staging/production (footer link is likewise dev-only).

**Validate** (must all pass before opening a PR):

```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run build
```

### Environment variables (full reference)

| Variable | Required | Used in | Notes |
|---|---|---|---|
| `DATABASE_URL` | Yes, everywhere | `src/db/index.ts`, `drizzle.config.ts` | Never commit real values |
| `NEXT_PUBLIC_URL` (or `NEXT_PUBLIC_APP_URL`) | Staging/prod | `src/lib/stripe.ts` `appUrl()` | Stripe success/cancel redirects. Falls back to `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Only for real payments | `src/lib/stripe.ts` | Without it, checkout runs in **demo mode** (instant upgrade, no charge) |
| `STRIPE_WEBHOOK_SECRET` | Staging/prod | `src/app/api/stripe/webhook/route.ts` | Without it, webhook accepts unsigned JSON (dev only) |
| `STRIPE_PRICE_CELESTIAL_MXN` / `_USD` | No | `src/lib/stripe.ts` | Fixed monthly Price IDs. If empty, prices are created dynamically ($149 MXN / $9.99 USD) |
| `STRIPE_PRICE_CELESTIAL_ANNUAL_MXN` / `_USD` | No | `src/lib/stripe.ts` | Fixed annual Price IDs. If empty, dynamic ($1,499 MXN / $99.99 USD) |

---

## 3. Staging setup

Purpose: a prod-like environment for QA with **test-mode** money and a disposable database.

1. **Hosting**: create one project (e.g. Vercel preview/production instance, Render, or Fly) named `carta-natal-staging`. Note its URL, e.g. `https://staging.tu-dominio.com`.
2. **Database**: create a separate managed Postgres (e.g. a Neon branch of prod, or a second Supabase project). Copy its connection string.
3. **Env vars** (hosting dashboard → Environment → staging):
   - `DATABASE_URL` = staging connection string
   - `NEXT_PUBLIC_URL` = `https://staging.tu-dominio.com`
   - `STRIPE_SECRET_KEY` = `sk_test_...` (Stripe **test** key — never a live key here)
   - `STRIPE_WEBHOOK_SECRET` = staging endpoint secret (see step 5)
4. **Migrate** from your machine (or CI) against staging:
   ```bash
   DATABASE_URL="<staging-connection-string>" npx drizzle-kit push
   ```
5. **Stripe → Developers → Webhooks → Add endpoint**: `https://staging.tu-dominio.com/api/stripe/webhook`, events `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Copy the `whsec_...` signing secret into env, redeploy.
6. **Deploy** (push to `staging` branch or promote), then **seed once** (empty DB, so no auth needed):
   ```bash
   curl -X POST https://staging.tu-dominio.com/api/admin/seed
   ```
7. **Smoke test**: `GET /api/health` → `{"ok":true}` · `GET /api/stripe/webhook` → `{"stripe":"configured"}` · register a user → calculate a chart → pay with card `4242 4242 4242 4242` → plan becomes `celestial`.

---

## 4. Production setup

Same as staging, with **live** money and hardened data:

1. **Hosting**: project `carta-natal-prod` at `https://tu-dominio.com`.
2. **Database**: dedicated managed Postgres with **daily backups + PITR**. Restrict connections (IP allowlist / private networking).
3. **Env vars**: `DATABASE_URL` (prod) · `NEXT_PUBLIC_URL=https://tu-dominio.com` · `STRIPE_SECRET_KEY=sk_live_...` · `STRIPE_WEBHOOK_SECRET` (prod endpoint secret) · optional fixed Price IDs.
4. **Migrate**: `DATABASE_URL="<prod-connection-string>" npx drizzle-kit push` (migrations are additive-only; never destructive edits).
5. **Stripe webhook**: separate live endpoint `https://tu-dominio.com/api/stripe/webhook` with the same 3 events; store its own `whsec_...`.
6. **Deploy** from `main` (protected branch), **seed once** on the empty DB, then **delete or rotate the demo users** (or change their passwords in `/admin`) — seed creates `owner/admin/editor/user@carta.natal` with a public password.
7. **Smoke test** with a real card + immediate refund, then verify the subscription row and `users.plan`.
8. **Ops**: enable uptime check on `/api/health`; keep Stripe Dashboard → Developers → Webhooks green (retry on 5xx); rotate `STRIPE_WEBHOOK_SECRET` yearly.

### Branching & CI/CD recap

`feature/*` → PR → `staging` → QA → `main` (protected) → prod. CI blocks merge unless `next typegen` + `tsc --noEmit` + `npm run build` pass. Rollback = redeploy previous SHA. Secrets live in the hosting dashboard, never in git.

---

## 5. Per-option guides

| Option | Guide | Needs keys? |
|---|---|---|
| Stripe payments (MXN default, USD toggle) | [`docs/STRIPE.md`](./STRIPE.md) | `sk_test_` / `sk_live_` + webhook secret |
| i18n ES/EN + currency | [`docs/I18N_CURRENCY.md`](./I18N_CURRENCY.md) | No |
| Editorial PDF downloads | [`docs/PDF.md`](./PDF.md) | No |
| Geocoding + map picker | [`docs/GEOCODING_MAPS.md`](./GEOCODING_MAPS.md) | No (OSM, keyless) |
| House systems (Equal / Placidus / Whole Sign) | [`docs/HOUSE_SYSTEMS.md`](./HOUSE_SYSTEMS.md) | No |

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| `DATABASE_URL is required` | `.env` missing — `cp .env.example .env` |
| `drizzle-kit push` targets the wrong DB | It reads `DATABASE_URL` from env; export the right one inline per environment |
| Seed returns `Solo admin/owner` (403) | DB already has users — log in as owner/admin first, or seed only on fresh DBs |
| Stripe checkout upgrades instantly, no Stripe page | Normal without `STRIPE_SECRET_KEY` = **demo mode**. Add a test key for the real flow |
| Webhook `Bad signature` (400) | `STRIPE_WEBHOOK_SECRET` doesn't match the endpoint's secret — re-copy from Stripe Dashboard and redeploy |
| PDF route 404 | Chart id wrong, or not logged in for someone else's chart — check `/dashboard` links |
