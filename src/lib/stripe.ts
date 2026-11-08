import Stripe from "stripe";
import type { Currency } from "./i18n";

// Catálogo con MXN por defecto + USD. Precios demo editables en /admin.
export interface PriceDef {
  slug: string;
  interval: "trial" | "month" | "year";
  mxnCents: number;
  usdCents: number;
  stripePriceIdMxn?: string;
  stripePriceIdUsd?: string;
}

export const PRICE_CATALOG: PriceDef[] = [
  { slug: "seeker", interval: "trial", mxnCents: 0, usdCents: 0 },
  {
    slug: "celestial",
    interval: "month",
    mxnCents: 14900, // $149 MXN/mes
    usdCents: 999,   // $9.99 USD/mes
    stripePriceIdMxn: process.env.STRIPE_PRICE_CELESTIAL_MXN,
    stripePriceIdUsd: process.env.STRIPE_PRICE_CELESTIAL_USD,
  },
  {
    slug: "celestial-annual",
    interval: "year",
    mxnCents: 149900, // $1,499 MXN/año
    usdCents: 9999,   // $99.99 USD/año
    stripePriceIdMxn: process.env.STRIPE_PRICE_CELESTIAL_ANNUAL_MXN,
    stripePriceIdUsd: process.env.STRIPE_PRICE_CELESTIAL_ANNUAL_USD,
  },
];

export function priceFor(slug: string, currency: Currency): number {
  const p = PRICE_CATALOG.find((x) => x.slug === slug);
  if (!p) return 0;
  return currency === "MXN" ? p.mxnCents : p.usdCents;
}

export function stripePriceIdFor(slug: string, currency: Currency): string | undefined {
  const p = PRICE_CATALOG.find((x) => x.slug === slug);
  if (!p) return undefined;
  return currency === "MXN" ? p.stripePriceIdMxn : p.stripePriceIdUsd;
}

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function appUrl(): string {
  return (
    process.env.NEXT_PUBLIC_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}
