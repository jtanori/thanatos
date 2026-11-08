# House Systems Setup (Equal · Placidus · Whole Sign)

**What “Placidus” means:** the most-used house system in modern Western astrology. It divides the diurnal/nocturnal arc into unequal *temporal hours*: houses 1/4/7/10 rise from ASC/IC/DSC/MC and the intermediate cusps are computed from time, not fixed 30° slices. Result: different-sized houses that mirror the real rhythm of the day at your latitude.

- **Equal** (default): twelve 30° houses from the Ascendant. Simple, stable everywhere — best default.
- **Placidus**: unequal quadrant houses. Modern standard, more nuance — but mathematically unstable past |lat| > 66°, where the app falls back to Equal with a notice.
- **Whole Sign**: one sign = one house (Hellenistic tradition).

Why it matters: the **Sun's house** (the year's stage) can shift between systems, so onboarding lets the user choose, and the reading + PDF always show the system used plus all 12 cusps.

## Local

Nothing to configure — logic lives in `src/lib/astro.ts` (`placidusCusps()`, `wholeSignCusps()`, `houseOfWithCusps()`, `HOUSE_SYSTEMS`) and is stored per chart (`solar_charts.house_system`).

Verify the difference on the same data:

```bash
# Equal
curl -s -X POST http://localhost:3000/api/charts/calculate \
  -H "Content-Type: application/json" \
  -d '{"guestName":"Test","birthDate":"1984-05-16","birthTime":"01:00","birthPlace":"Mexicali","birthLat":32.6393,"birthLon":-115.4747,"birthTimezone":"America/Tijuana","returnPlace":"Mexicali","returnLat":32.6393,"returnLon":-115.4747,"targetYear":2027,"houseSystem":"equal"}'
# Placidus — compare sunHouse / houses[] in the reading
# ... same body with "houseSystem":"placidus"
```

To change the default: onboarding posts `houseSystem` from the step-6 selector; the API defaults to `"equal"` for unknown values (`calculate/route.ts`) and `/pricing` + `/arquitectura` document the trade-offs.

## Staging

QA matrix: generate the same chart in all three systems; confirm house numbers, the cusp table, and the PDF badge match; test a high-latitude birthplace (e.g. Reykjavík 64.1°N works, Longyearbyen 78°N must show the Equal-fallback notice).

## Production

No setup. Note the honest precision limits in the UI/docs: Mean-astronomy engine (Meeus) + simplified Placidus semiarc (typical error < 1.5° at mid latitudes). The upgrade path (Swiss Ephemeris) slots behind the same `calculateRevolution()` contract.

## Troubleshoot

| Symptom | Fix |
|---|---|
| `houseSystem` ignored | API only accepts `equal|placidus|whole`, anything else → `equal` — check the POST body |
| Weird houses near the poles | Expected: fallback to Equal + notice — confirm the notice renders rather than “fixing” the math |
| Sun house differs from another site | Different systems or ephemeris precision — compare with the same system selected and note the ± tolerance |
