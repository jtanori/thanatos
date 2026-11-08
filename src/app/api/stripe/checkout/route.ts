import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { getSessionUser, logAudit } from "@/lib/auth";
import { getStripe, appUrl, stripePriceIdFor } from "@/lib/stripe";
import type { Currency } from "@/lib/i18n";

export async function POST(req: Request) {
  const user = await getSessionUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Inicia sesión para pagar." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const planSlug = (body.planSlug as string) ?? "celestial";
  const currency = ((body.currency as string) === "USD" ? "USD" : "MXN") as Currency;
  if (!["celestial", "celestial-annual"].includes(planSlug)) {
    return NextResponse.json({ error: "Plan inválido." }, { status: 400 });
  }

  const stripe = getStripe();
  // Modo demo sin claves: sube a premium directo para probar el flujo
  if (!stripe) {
    const plan = planSlug === "celestial-annual" ? "celestial-annual" : "celestial";
    await db.update(users).set({ plan, currency, updatedAt: new Date() }).where(eq(users.id, user.id));
    await db.insert(subscriptions).values({
      userId: user.id,
      planSlug: plan,
      status: "active",
      currency,
      stripeSessionId: `demo_${Date.now()}`,
    });
    await logAudit(user.id, "demo_upgrade", "subscription", plan, { currency });
    return NextResponse.json({ demo: true, url: "/dashboard?upgraded=demo" });
  }

  // Modo real Stripe
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, name: user.name, metadata: { userId: user.id } });
    customerId = customer.id;
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, user.id));
  }

  const priceId = stripePriceIdFor(planSlug, currency);
  const url = appUrl();
  let session;
  if (priceId) {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${url}/dashboard?upgraded=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/pricing?cancelled=1`,
      metadata: { userId: user.id, planSlug, currency },
      subscription_data: { metadata: { userId: user.id, planSlug, currency } },
    });
  } else {
    // Sin Price ID configurado: usa price_data dinámico (MXN por defecto)
    const amounts: Record<string, Record<string, number>> = {
      celestial: { MXN: 14900, USD: 999 },
      "celestial-annual": { MXN: 149900, USD: 9999 },
    };
    const unit = amounts[planSlug]?.[currency] ?? 14900;
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: planSlug === "celestial-annual" ? "Celestial Anual — Revolución Solar" : "Celestial Mensual — Revolución Solar",
            },
            unit_amount: unit,
            recurring: { interval: planSlug === "celestial-annual" ? "year" : "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${url}/dashboard?upgraded=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/pricing?cancelled=1`,
      metadata: { userId: user.id, planSlug, currency },
      subscription_data: { metadata: { userId: user.id, planSlug, currency } },
    });
  }
  await logAudit(user.id, "checkout_created", "subscription", planSlug, { currency, sessionId: session.id });
  return NextResponse.json({ url: session.url });
}
