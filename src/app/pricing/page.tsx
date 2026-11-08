import { headers } from "next/headers";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { getLocaleFromCookies, getCurrencyFromCookies, formatPrice, t } from "@/lib/i18n";
import CheckoutButton from "@/components/CheckoutButton";
import { CurrencySwitcher } from "@/components/LocaleControls";
import { isStripeConfigured } from "@/lib/stripe";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Pricing() {
  const h = await headers();
  const locale = getLocaleFromCookies(h.get("cookie"));
  const currency = getCurrencyFromCookies(h.get("cookie"));
  const stripeOn = isStripeConfigured();

  let list: Array<typeof plans.$inferSelect> = [];
  try {
    list = await db.select().from(plans);
  } catch { list = []; }

  const fallback = [
    { slug: "seeker", name: locale === "es" ? "Seeker · Gratis (trial)" : "Seeker · Free (trial)", priceCents: 0, priceCentsUsd: 0, currency: "MXN", interval: "trial", features: locale === "es" ? ["1 Revolución Solar", "Asc + Casa del Sol (resumen)", "Rueda astral", "PDF trial"] : ["1 Solar Return", "Rising + Sun house (summary)", "Chart wheel", "Trial PDF"], active: true },
    { slug: "celestial", name: locale === "es" ? "Celestial · Mensual" : "Celestial · Monthly", priceCents: 14900, priceCentsUsd: 999, currency: "MXN", interval: "month", features: locale === "es" ? ["Revoluciones ilimitadas", "Luna + stelliums + aspectos", "Casas Placidus/Iguales/Entero", "PDF editorial completo"] : ["Unlimited returns", "Moon + stelliums + aspects", "Placidus/Equal/Whole houses", "Full editorial PDF"], active: true },
    { slug: "celestial-annual", name: locale === "es" ? "Celestial · Anual" : "Celestial · Yearly", priceCents: 149900, priceCentsUsd: 9999, currency: "MXN", interval: "year", features: locale === "es" ? ["Todo lo mensual", "Ahorra 2 meses", "Soporte prioritario"] : ["Everything monthly", "Save 2 months", "Priority support"], active: true },
  ];
  const show = list.length > 0 ? list.map((p) => ({
    slug: p.slug,
    name: p.name,
    priceCents: p.priceCents,
    priceCentsUsd: (p as { priceCentsUsd?: number }).priceCentsUsd ?? Math.round(p.priceCents / 17.2),
    interval: p.interval,
    features: (p.features as string[]) ?? [],
    active: p.active,
  })) : fallback;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex justify-center"><CurrencySwitcher initial={currency} /></div>
      <p className="mt-4 text-center text-xs uppercase tracking-[0.22em] text-[#a32e0c]">{locale === "es" ? "Precios simples · MXN por defecto" : "Simple pricing · MXN by default"}</p>
      <h1 className="font-serif-display text-center text-5xl">{t(locale, "pricing.title")}</h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-[#6b5d51]">{t(locale, "pricing.sub")}</p>
      <p className="mx-auto mt-2 max-w-xl text-center text-xs text-[#8a7a6e]">
        {stripeOn ? t(locale, "pricing.secure") : t(locale, "pricing.demo")} · {!stripeOn && <Link href="/arquitectura" className="underline">¿Cómo activo Stripe? Ver guía</Link>}
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {show.map((p) => {
          const cents = currency === "MXN" ? Number(p.priceCents) : Number(p.priceCentsUsd);
          const isFree = cents === 0;
          return (
            <div key={p.slug} className={`rounded-3xl p-7 ${isFree ? "border border-[#a32e0c]/15 bg-white" : "bg-[#2b211b] text-white shadow-xl"}`}>
              <div className="text-sm uppercase tracking-widest opacity-70">{p.interval}</div>
              <div className="font-serif-display mt-1 text-2xl">{p.name}</div>
              <div className="mt-3 text-4xl font-bold">
                {isFree ? (locale === "es" ? "Gratis" : "Free") : formatPrice(cents, currency, locale)}
                <span className="text-base font-normal opacity-70">/{p.interval === "month" ? (locale === "es" ? "mes" : "mo") : p.interval === "year" ? (locale === "es" ? "año" : "yr") : "·"}</span>
              </div>
              {!isFree && <div className="mt-1 text-xs opacity-70">{currency === "MXN" ? `≈ ${formatPrice(Number(p.priceCentsUsd), "USD", locale)} USD` : `≈ ${formatPrice(Number(p.priceCents), "MXN", locale)} MXN`}</div>}
              <ul className="mt-4 space-y-2 text-sm">{(p.features ?? []).map((f) => <li key={f}>✓ {f}</li>)}</ul>
              <div className="mt-6">
                {isFree ? (
                  <Link href="/empezar" className="block rounded-full border border-[#a32e0c] py-3 text-center font-semibold text-[#a32e0c]">{t(locale, "pricing.free.cta")}</Link>
                ) : (
                  <CheckoutButton planSlug={p.slug} currency={currency} label={t(locale, "pricing.paid.cta")} dark={!isFree} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mx-auto mt-8 max-w-3xl rounded-3xl bg-white p-6 text-sm leading-relaxed shadow-sm">
        <b>¿Qué es Placidus?</b>{" "}
        {locale === "es"
          ? "Placidus es el sistema de casas más usado en astrología occidental moderna: divide el día en horas temporales desiguales, así las casas tienen tamaños distintos según latitud y hora. Casas Iguales (30° desde el Ascendente) es más simple y estable; Signo Entero usa un signo = una casa (tradición helenística). En el onboarding puedes elegir; la Casa del Sol puede cambiar de una opción a otra."
          : "Placidus is the most used house system in modern Western astrology: it divides the day into unequal temporal hours, so houses have different sizes by latitude and time. Equal Houses (30° from the Ascendant) is simpler and stable; Whole Sign uses one sign = one house (Hellenistic tradition). You can choose in onboarding; the Sun's house may shift between options."}
      </div>
    </main>
  );
}
