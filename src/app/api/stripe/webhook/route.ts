import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { getStripe } from "@/lib/stripe";
import { logAudit } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface StripeEvt {
  type: string;
  data: { object: Record<string, unknown> };
}

// Webhook Stripe → subscriptions. Configura STRIPE_WEBHOOK_SECRET en prod.
// Dev: stripe listen --forward-to localhost:3000/api/stripe/webhook
export async function POST(req: Request) {
  const stripe = getStripe();
  const raw = await req.text();
  let evt: StripeEvt;

  if (stripe && process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      const sig = req.headers.get("stripe-signature") ?? "";
      const constructed = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
      evt = constructed as unknown as StripeEvt;
    } catch (e) {
      console.error("webhook signature fail", e);
      return NextResponse.json({ error: "Bad signature" }, { status: 400 });
    }
  } else {
    try {
      evt = JSON.parse(raw) as StripeEvt;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }

  try {
    if (evt.type === "checkout.session.completed") {
      const s = evt.data.object as {
        metadata?: Record<string, string>;
        customer?: string;
        subscription?: string;
        id?: string;
      };
      const userId = s.metadata?.userId;
      const planSlug = s.metadata?.planSlug ?? "celestial";
      const currency = s.metadata?.currency ?? "MXN";
      if (userId) {
        const plan = planSlug === "celestial-annual" ? "celestial-annual" : "celestial";
        await db
          .update(users)
          .set({
            plan,
            currency: currency === "USD" ? "USD" : "MXN",
            stripeCustomerId: (s.customer as string) ?? undefined,
            stripeSubscriptionId: (s.subscription as string) ?? undefined,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
        await db.insert(subscriptions).values({
          userId,
          planSlug: plan,
          status: "active",
          currency: currency === "USD" ? "USD" : "MXN",
          stripeSessionId: (s.id as string) ?? null,
          stripeSubscriptionId: (s.subscription as string) ?? null,
        });
        await logAudit(userId, "stripe_checkout_completed", "subscription", plan, { currency });
      }
    } else if (evt.type === "customer.subscription.updated" || evt.type === "customer.subscription.deleted") {
      const sub = evt.data.object as { id?: string; status?: string; metadata?: Record<string, string> };
      const userId = (sub.metadata?.userId as string) ?? undefined;
      const status = evt.type === "customer.subscription.deleted" ? "canceled" : (sub.status ?? "active");
      if (sub.id) {
        const rows = await db.select().from(subscriptions).where(eq(subscriptions.stripeSubscriptionId, sub.id)).limit(5);
        for (const r of rows) {
          await db.update(subscriptions).set({ status }).where(eq(subscriptions.id, r.id));
        }
        if (userId && status === "canceled") {
          await db.update(users).set({ plan: "free", updatedAt: new Date() }).where(eq(users.id, userId));
        }
        await logAudit(userId ?? null, "stripe_subscription_" + status, "subscription", sub.id, {});
      }
    }
  } catch (e) {
    console.error("webhook handler", e);
  }
  return NextResponse.json({ received: true });
}

export async function GET() {
  const configured = Boolean(process.env.STRIPE_SECRET_KEY);
  return NextResponse.json({
    ok: true,
    stripe: configured ? "configured" : "demo-mode",
    hint: configured
      ? "Usa `stripe listen --forward-to localhost:3000/api/stripe/webhook` y STRIPE_WEBHOOK_SECRET."
      : "Define STRIPE_SECRET_KEY (+ opcional STRIPE_WEBHOOK_SECRET y PRICE IDs) para pagos reales. Sin claves, el checkout usa modo demo.",
  });
}
