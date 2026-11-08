# Stripe Setup — Test & Live Payments (MXN default, USD toggle)

How it works in this repo: `POST /api/stripe/checkout` creates a Checkout Session in `subscription` mode (`src/app/api/stripe/checkout/route.ts`). `POST /api/stripe/webhook` applies `checkout.session.completed` → upgrades `users.plan`, and `customer.subscription.updated/deleted` → downgrades on cancel. `POST /api/stripe/portal` opens the Customer Portal. Prices default to **MXN** ($149/mo, $1,499/yr) with a USD toggle ($9.99/$99.99). If no fixed Price IDs are set, prices are created dynamically via `price_data`.

## Local

No keys needed to develop: without `STRIPE_SECRET_KEY`, checkout runs in **demo mode** — the user is upgraded instantly and redirected to `/dashboard?upgraded=demo`. The pricing page shows a demo notice automatically.

To test the **real** flow locally:

```bash
# 1) Install the Stripe CLI and log in
stripe login

# 2) Add to .env (test keys from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_URL=http://localhost:3000

# 3) Forward webhooks to your dev server (in another terminal)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 4) The CLI prints a whsec_... secret — add it and restart dev
STRIPE_WEBHOOK_SECRET=whsec_...

# 5) Restart + pay with 4242 4242 4242 4242, any future date, any CVC
npm run dev
```

Optional: create fixed Products/Prices in the test dashboard (e.g. “Celestial MXN Monthly” at $149 MXN recurring monthly) and set `STRIPE_PRICE_CELESTIAL_MXN=price_...` (plus `_USD` and `_ANNUAL_` variants). Without them, dynamic `price_data` is used — fine for local/staging.

## Staging

1. Use **test-mode** keys only (`sk_test_...`). Set in the hosting dashboard for the staging env.
2. Stripe Dashboard (test mode) → Developers → Webhooks → **Add endpoint**: `https://staging.tu-dominio.com/api/stripe/webhook`; subscribe to `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
3. Copy the endpoint's signing secret → `STRIPE_WEBHOOK_SECRET` (staging env) → redeploy.
4. Verify: `GET /api/stripe/webhook` returns `{"stripe":"configured"}`; run a full test purchase with `4242...`; confirm `users.plan = celestial` and a `subscriptions` row with `status = active`.

## Production

1. Switch the Dashboard to **live mode** and repeat the staging steps with `sk_live_...` and a **separate** webhook endpoint at `https://tu-dominio.com/api/stripe/webhook` (own `whsec_...`).
2. Recommended: create fixed live Products/Prices (MXN + USD, monthly + annual) and set the four `STRIPE_PRICE_*` vars — stable reporting and easy price changes without deploys.
3. Go-live checklist: test purchase with a real card + immediate refund in live mode · Customer Portal works from `/cuenta` · webhook deliveries green in Dashboard · `users.plan` downgrades when a subscription is canceled (webhook `deleted`).

## Troubleshoot

| Symptom | Fix |
|---|---|
| Instant upgrade, no Stripe page | Demo mode — set `STRIPE_SECRET_KEY` |
| `Bad signature` 400 on webhook | Wrong `STRIPE_WEBHOOK_SECRET` for that endpoint (test vs live mix-up is the classic cause) |
| Success page shows localhost | `NEXT_PUBLIC_URL` not set in that environment — set it and redeploy |
| Prices look wrong | With fixed Price IDs, amounts come from Stripe; without, from `PRICE_CATALOG` in `src/lib/stripe.ts` |
