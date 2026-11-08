"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GUIDE_SECTIONS, GUIDE_UI, ENVS, pick, type Env } from "@/lib/guide";
import type { Locale } from "@/lib/i18n";

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function CopyBtn({ code, locale }: { code: string; locale: Locale }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard bloqueado */
        }
      }}
      className="rounded-full bg-[#2b211b] px-3 py-1 text-xs font-bold text-white hover:bg-[#a32e0c]"
    >
      {done ? pick(GUIDE_UI.copied, locale) : pick(GUIDE_UI.copy, locale)}
    </button>
  );
}

export default function Guia() {
  const [locale, setLocale] = useState<Locale>("es");
  const [section, setSection] = useState(GUIDE_SECTIONS[0].id);
  const [env, setEnv] = useState<Env>("local");

  useEffect(() => {
    const c = getCookie("locale");
    if (c === "es" || c === "en") setLocale(c);
  }, []);

  const active = GUIDE_SECTIONS.find((s) => s.id === section) ?? GUIDE_SECTIONS[0];

  return (
    <main className="bg-[#fff8f1]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a32e0c]">{pick(GUIDE_UI.kicker, locale)}</p>
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
        <h1 className="font-serif-display mt-3 text-4xl md:text-5xl">{pick(GUIDE_UI.title, locale)}</h1>
        <p className="mt-3 max-w-2xl text-[#6b5d51]">{pick(GUIDE_UI.sub, locale)}</p>
        <p className="mt-2 text-xs text-[#8a7a6e]">{pick(GUIDE_UI.prereq, locale)}</p>

        {/* Option tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {GUIDE_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                section === s.id ? "btn-clay text-white" : "bg-white shadow-sm hover:bg-[#fff6ea]"
              }`}
            >
              {s.icon} {pick(s.title, locale)}
            </button>
          ))}
        </div>

        {/* Env pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {ENVS.map((e) => (
            <button
              key={e.id}
              onClick={() => setEnv(e.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                env === e.id ? "bg-[#2b211b] text-white" : "bg-[#f6e8d7] text-[#5b4d42]"
              }`}
            >
              {e.icon} {locale === "en" ? e.en : e.es}
            </button>
          ))}
          <Link href="/arquitectura" className="ml-auto text-sm font-semibold text-[#a32e0c] hover:underline">
            → {locale === "es" ? "Ver decisiones de arquitectura" : "See architecture decisions"}
          </Link>
        </div>

        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-[#3d332c]">{pick(active.summary, locale)}</p>

        <div className="mt-6 space-y-4">
          {active.envs[env].map((st, i) => (
            <section key={i} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="font-serif-display text-xl">{pick(st.title, locale)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5b4d42]">{pick(st.text, locale)}</p>
              {st.code && (
                <div className="mt-3 overflow-hidden rounded-2xl bg-[#2b211b]">
                  <div className="flex justify-end p-2">
                    <CopyBtn code={st.code} locale={locale} />
                  </div>
                  <pre className="overflow-x-auto px-4 pb-4 font-mono text-[12.5px] leading-relaxed text-[#ffe8c8]">
                    {st.code}
                  </pre>
                </div>
              )}
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-3xl bg-[#2b211b] p-6 text-[#ffe8c8]">
          <h2 className="font-serif-display text-2xl">{pick(GUIDE_UI.verifyTitle, locale)}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {active.verify.map((v, i) => (
              <li key={i} className="flex gap-2">
                <span>☐</span>
                <code className="font-mono text-[13px]">{pick(v, locale)}</code>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-6 text-center text-xs text-[#8a7a6e]">
          {locale === "es" ? "Versión repo: " : "Repo version: "}
          <code>docs/SETUP.md · docs/STRIPE.md · docs/I18N_CURRENCY.md · docs/PDF.md · docs/GEOCODING_MAPS.md · docs/HOUSE_SYSTEMS.md</code>
        </p>
      </div>
    </main>
  );
}
