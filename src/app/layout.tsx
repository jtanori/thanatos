import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import "./globals.css";
import { getSessionUser } from "@/lib/auth";
import { getLocaleFromCookies, getCurrencyFromCookies, t, type Locale } from "@/lib/i18n";
import { LanguageSwitcher, CurrencySwitcher } from "@/components/LocaleControls";

export const metadata: Metadata = {
  title: "Revolución Solar — Tu mapa del año | Carta Natal",
  description:
    "Calcula tu Revolución Solar con precisión astronómica: retorno exacto del Sol, Ascendente anual, Casa del Sol, Luna, stelliums y aspectos. ES/EN, MXN por defecto, PDF editorial.",
};

async function Navbar({ locale }: { locale: Locale }) {
  const user = await getSessionUser().catch(() => null);
  return (
    <header className="sticky top-0 z-40 border-b border-[#a32e0c]/10 bg-[#fff8f1]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <Link href="/" className="font-serif-display text-2xl text-[#a32e0c]">
          Carta Natal
        </Link>
        <nav className="hidden items-center gap-6 text-[15px] text-[#5b4d42] lg:flex">
          <Link href="/#como-funciona" className="hover:text-[#a32e0c]">{t(locale, "nav.chart")}</Link>
          <Link href="/biblioteca" className="hover:text-[#a32e0c]">{t(locale, "nav.library")}</Link>
          <Link href="/arquitectura" className="hover:text-[#a32e0c]">{t(locale, "nav.architecture")}</Link>
          <Link href="/pricing" className="hover:text-[#a32e0c]">{t(locale, "nav.pricing")}</Link>
          {(user?.role === "owner" || user?.role === "admin") && (
            <Link href="/admin" className="rounded-full bg-[#a32e0c]/10 px-3 py-1 font-medium text-[#a32e0c]">{t(locale, "nav.admin")}</Link>
          )}
          {user?.role === "editor" && (
            <Link href="/editor" className="rounded-full bg-[#a32e0c]/10 px-3 py-1 font-medium text-[#a32e0c]">{t(locale, "nav.editor")}</Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher initial={locale} />
          {!user ? (
            <>
              <Link href="/login" className="hidden text-sm font-medium text-[#5b4d42] hover:text-[#a32e0c] sm:block">{t(locale, "nav.login")}</Link>
              <Link href="/empezar" className="btn-clay rounded-full px-4 py-2 text-sm font-semibold">{t(locale, "nav.create")}</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f6e8d7] font-bold text-[#a32e0c]">
                  {(user.name?.[0] ?? "J").toUpperCase()}
                </span>
                <span className="hidden sm:block">{user.name}</span>
                <span className="hidden rounded-full bg-[#a32e0c]/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-[#a32e0c] md:block">{user.role} · {user.plan}</span>
              </Link>
              <Link href="/cuenta" className="hidden text-sm text-[#5b4d42] hover:text-[#a32e0c] sm:block">{t(locale, "nav.account")}</Link>
              <form action="/api/auth/logout" method="post">
                <button className="hidden text-sm text-[#8a7a6e] hover:text-[#a32e0c] sm:block" type="submit">{t(locale, "nav.logout")}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const locale = getLocaleFromCookies(h.get("cookie"));
  const currency = getCurrencyFromCookies(h.get("cookie"));
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        <Navbar locale={locale} />
        {children}
        <footer className="border-t border-[#a32e0c]/10 bg-[#f9ecdc]">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-4">
            <div>
              <div className="font-serif-display text-xl tracking-[0.18em] text-[#a32e0c]">CARTA NATAL</div>
              <p className="mt-3 text-sm leading-relaxed text-[#6b5d51]">
                {locale === "es"
                  ? "Astrología de precisión para el alma contemporánea. Revolución Solar calculada con astronomía real."
                  : "Precision astrology for the contemporary soul. Solar Return computed with real astronomy."}
              </p>
              <p className="mt-3 text-xs text-[#8a7a6e]">© 2026 Carta Natal. · MXN {currency === "MXN" ? "· $ MXN por defecto" : "· $ USD"}</p>
              <div className="mt-3 flex gap-2">
                <CurrencySwitcher initial={currency} />
              </div>
            </div>
            <div className="text-sm">
              <div className="mb-3 font-semibold uppercase tracking-widest text-[#8a7a6e]">Explorar</div>
              <div className="space-y-2 text-[#5b4d42]">
                <Link className="block hover:text-[#a32e0c]" href="/empezar">Revolución Solar / Solar Return</Link>
                <Link className="block hover:text-[#a32e0c]" href="/biblioteca">{t(locale, "nav.library")}</Link>
                <Link className="block hover:text-[#a32e0c]" href="/pricing">{t(locale, "nav.pricing")} · MXN/USD</Link>
                <Link className="block hover:text-[#a32e0c]" href="/guia">📖 Guía de setup · Setup guide</Link>
                {process.env.NODE_ENV === "development" && (
                  <Link className="block hover:text-[#a32e0c]" href="/manual">🧪 Manual de uso (dev)</Link>
                )}
              </div>
            </div>
            <div className="text-sm">
              <div className="mb-3 font-semibold uppercase tracking-widest text-[#8a7a6e]">Empresa</div>
              <div className="space-y-2 text-[#5b4d42]">
                <Link className="block hover:text-[#a32e0c]" href="/arquitectura">Cómo funciona + Arquitectura</Link>
                <Link className="block hover:text-[#a32e0c]" href="/dashboard">Mi carta</Link>
                <Link className="block hover:text-[#a32e0c]" href="/cuenta">{t(locale, "nav.account")}</Link>
              </div>
            </div>
            <div className="text-sm">
              <div className="mb-3 font-semibold uppercase tracking-widest text-[#8a7a6e]">Legal</div>
              <div className="space-y-2 text-[#5b4d42]">
                <span className="block">Privacidad · Privacy</span>
                <span className="block">Términos · Terms</span>
                <span className="block">Stripe · OpenStreetMap · 🔒</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
