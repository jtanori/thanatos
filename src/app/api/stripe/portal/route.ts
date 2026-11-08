import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getStripe, appUrl } from "@/lib/stripe";

export async function POST() {
  const user = await getSessionUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Inicia sesión." }, { status: 401 });
  const stripe = getStripe();
  if (!stripe || !user.stripeCustomerId) {
    return NextResponse.json({ url: "/cuenta", demo: true });
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl()}/cuenta`,
  });
  return NextResponse.json({ url: session.url });
}
