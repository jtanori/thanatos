# Geocoding + Map Setup (Nominatim/OSM · Leaflet — no API keys)

How it works: the client never calls OpenStreetMap directly. `GET /api/geocode?q=` (`src/app/api/geocode/route.ts`) proxies **Nominatim** server-side with a proper `User-Agent`, caches responses for 1 hour (`next: { revalidate: 3600 }`), and falls back to the bundled city list (`src/lib/places.ts`) when OSM is unreachable. The onboarding map (`src/components/MapPicker.tsx`) is Leaflet with OSM tiles: click to move the pin, drag to fine-tune. Coordinates feed ASC/MC/houses, so map precision = reading precision.

## Local

Nothing to configure (needs internet for live OSM results; offline you get the local fallback with `source: "local"`). Verify:

```bash
curl -s "http://localhost:3000/api/geocode?q=Mexicali" | head -c 300
# expect "source":"osm" (online) or "source":"local" (offline)
```

Then open `/empezar` step 4: search a city, click the map, drag the pin — lat/lon readout updates.

**Usage policy (all environments):** Nominatim is free but shared — keep the app's server-side proxy (never call it from the browser, which would leak/burn the quota), respect ~1 req/s (the UI debounces input; keep it that way), and keep the identifying `User-Agent`. Bulk-geocode offline instead: cache results in `places.ts` or a DB table.

## Staging

1. Confirm `source: "osm"` from the staging server (some hosts block egress — if you only ever see `"local"`, allow `nominatim.openstreetmap.org:443`).
2. QA the attribution line under the map (© OpenStreetMap contributors) — required by the OSM licence.

## Production

1. No keys. At scale, options in order of preference: (a) keep Nominatim + longer cache, (b) self-host Nominatim/Photon, (c) switch to a paid provider (Mapbox/Google) behind the same `/api/geocode` contract so the UI doesn't change.
2. Monitor fallback rate: if `source: "local"` spikes, OSM is throttling or blocking you — investigate before users notice wrong houses.

## Troubleshoot

| Symptom | Fix |
|---|---|
| Always `source: "local"` | No egress to Nominatim, or rate-limited — check server logs for `geocode osm fallback` |
| Map tiles don't load | Tile CDN blocked (CSP/ad-block) — tiles come from `tile.openstreetmap.org`; check the browser console |
| Wrong city, right name | Ambiguous names (e.g. “Córdoba”) — the UI shows full `display_name`; pick the right one, then fine-tune with the pin |
