"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Currency, Locale } from "@/lib/i18n";

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function LanguageSwitcher({ initial }: { initial: Locale }) {
  const [locale, setLocale] = useState<Locale>(initial);
  const router = useRouter();
  useEffect(() => {
    const c = getCookie("locale");
    if (c === "es" || c === "en") setLocale(c);
  }, []);
  function set(l: Locale) {
    setLocale(l);
    document.cookie = `locale=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }
  return (
    <div className="flex items-center gap-1 rounded-full bg-[#f6e8d7] p-1 text-sm">
      {(["es", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => set(l)}
          className={`rounded-full px-3 py-1 font-semibold ${locale === l ? "bg-white shadow" : "text-[#8a7a6e]"}`}
          aria-pressed={locale === l}
        >
          {l === "es" ? "🇪🇸 ES" : "🇬🇧 EN"}
        </button>
      ))}
    </div>
  );
}

export function CurrencySwitcher({ initial }: { initial: Currency }) {
  const [cur, setCur] = useState<Currency>(initial);
  const router = useRouter();
  useEffect(() => {
    const c = getCookie("currency");
    if (c === "MXN" || c === "USD") setCur(c);
  }, []);
  function set(c: Currency) {
    setCur(c);
    document.cookie = `currency=${c}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }
  return (
    <div className="flex items-center gap-1 rounded-full bg-[#2b211b] p-1 text-sm text-white">
      {(["MXN", "USD"] as Currency[]).map((c) => (
        <button
          key={c}
          onClick={() => set(c)}
          className={`rounded-full px-3 py-1 font-bold ${cur === c ? "bg-[#c9481a]" : "opacity-70"}`}
          aria-pressed={cur === c}
        >
          {c === "MXN" ? "$ MXN" : "$ USD"}
        </button>
      ))}
    </div>
  );
}
