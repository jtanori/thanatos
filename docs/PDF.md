# PDF Setup — Editorial Solar Return Downloads

How it works: `GET /api/charts/[id]/pdf?locale=es|en` renders `SolarPDF` (`src/lib/solarPdf.tsx`, `@react-pdf/renderer`) to a buffer and returns it as `attachment`. Free users get a **trial PDF** (cover + essentials + upgrade CTA); premium roles get the **full PDF** (cover + Rising + Sun house + premium strategy + Moon/stelliums + aspects + positions table + house cusps). The download button is `src/components/PdfButton.tsx`. No env vars, no external services.

## Local

Nothing to configure. Verify:

```bash
# Generate a chart first (onboarding or API), then:
curl -s -o /tmp/sr-es.pdf -w "http=%{http_code} type=%{content_type}\n" \
  "http://localhost:3000/api/charts/<id>/pdf?locale=es"
head -c 5 /tmp/sr-es.pdf   # must print %PDF-
```

Repeat with `?locale=en`. Fonts are built-in Helvetica (no font loading in serverless), colors follow the brand tokens (`#A32E0C`, `#2B211B`, cream).

To edit the design: change `SolarPDF` styles/sections — keep the `full` flag logic so trial users never receive premium text.

## Staging

1. QA both PDFs (ES + EN, trial + premium account) — check cover data, cusp table, and that trial PDFs contain no premium paragraphs.
2. Load-test one generation per chart (PDF render is CPU-bound; it runs per-request, nothing to pre-warm).

## Production

1. No setup. Optional hardening: put the route behind the existing session check only (already the case — private charts require their owner or a privileged role), and add rate-limiting if downloads get abused.
2. If PDFs grow (images, custom fonts), register fonts with `Font.register()` in `solarPdf.tsx` and confirm the font files are bundled (`next.config.ts` untouched today — revisit if you add binary assets).

## Troubleshoot

| Symptom | Fix |
|---|---|
| 404 on the PDF route | Wrong chart id, or not logged in as the chart's owner — open it from `/dashboard` |
| Trial user sees full PDF | `isPremiumUser()` logic in `src/lib/auth.ts` — check `users.plan` value in DB |
| Garbled characters | Stick to built-in fonts or properly registered custom fonts; verify accented glyphs (á, ñ) render |
