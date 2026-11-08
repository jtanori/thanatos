"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { USAGE_ROLES, USAGE_UI, pick } from "@/lib/usageGuide";
import type { Locale } from "@/lib/i18n";

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export default function ManualClient() {
  const [locale, setLocale] = useState<Locale>("es");
  const [role, setRole] = useState(USAGE_ROLES[0].id);

  useEffect(() => {
    const c = getCookie("locale");
    if (c === "es" || c === "en") setLocale(c);
  }, []);

  const active = USAGE_ROLES.find((r) => r.id === role) ?? USAGE_ROLES[0];

  return (
    <main className="bg-[#fff8f1]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap items-center gap-2">
          <p className="rounded-full bg-[#2b211b] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#ffe8c8]">
            🧪 {pick(USAGE_UI.kicker, locale)}
          </p>
          <span className="ml-auto flex gap-1 text-xs">
            {(["es", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLocale(l);
                  document.cookie = `locale=${l}; path=/; max-age=31536000`;
                }}
                className={`rounded-full px-3 py-1 font-bold ${locale === l ? "bg-[#a32e0c] text-white" : "bg-[#f6e8d7]"}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </span>
        </div>

        <h1 className="font-serif-display mt-4 text-4xl md:text-5xl">{pick(USAGE_UI.title, locale)}</h1>
        <p className="mt-3 max-w-2xl text-[#6b5d51]">{pick(USAGE_UI.sub, locale)}</p>
        <p className="mt-2 font-mono text-xs text-[#8a7a6e]">{pick(USAGE_UI.devNote, locale)}</p>

        {/* Role tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {USAGE_ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                role === r.id ? "btn-clay text-white" : "bg-white shadow-sm hover:bg-[#fff6ea]"
              }`}
            >
              {r.icon} {pick(r.title, locale)}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <span className="rounded-full bg-[#f6e8d7] px-3 py-1 text-xs font-bold text-[#a32e0c]">
            {pick(active.badge, locale)}
          </span>
          <h2 className="font-serif-display mt-3 text-3xl">
            {active.icon} {pick(active.title, locale)}
          </h2>
          <p className="mt-2 text-[#5b4d42]">{pick(active.summary, locale)}</p>

          <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#a32e0c]">
            {pick(USAGE_UI.canTitle, locale)}
          </h3>
          <div className="mt-3 space-y-4">
            {active.can.map((c, i) => (
              <section key={i} className="rounded-2xl bg-[#fff8f1] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-serif-display text-xl">{pick(c.title, locale)}</h4>
                  {c.route && (
                    <Link
                      href={c.route}
                      className="ml-auto rounded-full bg-[#2b211b] px-4 py-1 text-xs font-bold text-white hover:bg-[#a32e0c]"
                    >
                      {c.route} {pick(USAGE_UI.open, locale)}
                    </Link>
                  )}
                </div>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-[#3d332c]">
                  {c.steps.map((s, j) => (
                    <li key={j}>{pick(s, locale)}</li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#a32e0c]">
            {pick(USAGE_UI.limitsTitle, locale)}
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-[#5b4d42]">
            {active.limits.map((l, i) => (
              <li key={i} className="flex gap-2">
                <span>⛔</span>
                <span>{pick(l, locale)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-[#2b211b] p-5 text-[#ffe8c8]">
            <h3 className="font-serif-display text-xl">{pick(USAGE_UI.verifyTitle, locale)}</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              {active.verify.map((v, i) => (
                <li key={i} className="flex gap-2">
                  <span>☐</span>
                  <code className="font-mono text-[13px]">{pick(v, locale)}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#8a7a6e]">
          {locale === "es" ? "Demo: owner/admin/editor/user@carta.natal · password123 · Seed en /admin" : "Demo: owner/admin/editor/user@carta.natal · password123 · Seed in /admin"}
        </p>
      </div>
    </main>
  );
}
