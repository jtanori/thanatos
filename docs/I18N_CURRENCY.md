# i18n + Currency Setup (ES/EN · MXN default · USD toggle)

How it works: a cookie-based dictionary in `src/lib/i18n.ts` (`locale=es|en`, `currency=MXN|USD`, 1-year cookies). Server components read cookies via `getLocaleFromCookies()` / `getCurrencyFromCookies()`; client toggles live in `src/components/LocaleControls.tsx` (`LanguageSwitcher`, `CurrencySwitcher`). Prices format with `Intl.NumberFormat` (`es-MX` / `en-US`) via `formatPrice()`. Spanish is the fallback for missing keys; the editorial long-form content stays in Spanish with English sign-name mapping (`signName()`).

## Local

Nothing to configure — defaults are `es` + `MXN`. To verify:

1. Open `/pricing` — toggle `ES/EN` in the navbar and `$ MXN / $ USD` in the footer; prices reformat (e.g. `$149.00 MXN` ↔ `US$9.99`).
2. Generate a chart, then open `/api/charts/<id>/pdf?locale=en` vs `?locale=es` — both should download a valid PDF.

To add a string: add the key to **both** `ES` and `EN` dicts in `src/lib/i18n.ts`, use `t(locale, "key")`. To add a locale (e.g. `pt`): extend the `Locale` type, `LOCALES`, both dicts, and the cookie regexes.

The demo conversion rate `USD_MXN_RATE = 17.2` is display-only; real charges use the catalog amounts in `src/lib/stripe.ts` (`PRICE_CATALOG`: 14900/999 monthly, 149900/9999 annual, in cents).

## Staging

1. QA both locales end-to-end: onboarding → reading → PDF in ES and EN; confirm no raw keys (e.g. `pricing.title`) leak into the UI.
2. Confirm currency persists across pages (cookie scope `path=/`) and Stripe receives the selected currency (`metadata.currency` in the Checkout Session).

## Production

1. Decide the default locale per market (code default is `es`; change `getLocaleFromCookies` fallback if needed).
2. Optional: set `USD_MXN_RATE` from `/admin` settings or env if you display converted estimates anywhere.
3. If you add a third currency later, extend the `Currency` type + `CURRENCIES` + Stripe `amounts` map in the checkout route + the `currency` cookie regex — then update this doc.

## Troubleshoot

| Symptom | Fix |
|---|---|
| Page shows the key instead of text | Key missing from that locale's dict — add it to both `ES` and `EN` |
| Toggle doesn't stick | Third-party cookies blocked or cookie overwritten — check DevTools → Application → Cookies (`locale`, `currency`) |
| Wrong price format | `Intl.NumberFormat` depends on runtime ICU — Node 20+ full-icu is fine; verify with `node -e "console.log(new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(149))"` |
