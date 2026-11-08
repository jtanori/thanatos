import type { Locale } from "./i18n";

export type Env = "local" | "staging" | "production";
export interface LText {
  es: string;
  en: string;
}
export interface Step {
  title: LText;
  text: LText;
  code?: string;
}
export interface Section {
  id: string;
  icon: string;
  title: LText;
  summary: LText;
  envs: Record<Env, Step[]>;
  verify: LText[];
}

export function pick(t: LText, locale: Locale): string {
  return locale === "en" ? t.en : t.es;
}

export const ENVS: Array<{ id: Env; icon: string; es: string; en: string }> = [
  { id: "local", icon: "💻", es: "Local", en: "Local" },
  { id: "staging", icon: "🧪", es: "Staging", en: "Staging" },
  { id: "production", icon: "🚀", es: "Producción", en: "Production" },
];

export const GUIDE_UI: Record<string, LText> = {
  kicker: { es: "Guía de setup · Local · Staging · Producción", en: "Setup guide · Local · Staging · Production" },
  title: { es: "Pon en marcha cada pieza, en cada entorno.", en: "Get every piece running, in every environment." },
  sub: {
    es: "Base local, pagos Stripe, idioma y moneda, PDF editorial, mapas y casas. Elige una opción y un entorno. Versión repo en /docs.",
    en: "Local base, Stripe payments, language and currency, editorial PDF, maps and houses. Pick an option and an environment. Repo version in /docs.",
  },
  verifyTitle: { es: "✅ Lista de verificación", en: "✅ Verification checklist" },
  copy: { es: "Copiar", en: "Copy" },
  copied: { es: "¡Copiado!", en: "Copied!" },
  prereq: { es: "Requisitos: Node 20+ · npm 10+ · PostgreSQL 15+ · Stripe CLI (solo pagos reales)", en: "Requirements: Node 20+ · npm 10+ · PostgreSQL 15+ · Stripe CLI (real payments only)" },
};

export const GUIDE_SECTIONS: Section[] = [
  {
    id: "base",
    icon: "🧱",
    title: { es: "Base: app + base de datos", en: "Base: app + database" },
    summary: {
      es: "Instalación, variables de entorno, migraciones con Drizzle, seed demo y validación. Sin esto, nada más funciona.",
      en: "Install, env vars, Drizzle migrations, demo seed and validation. Without this, nothing else works.",
    },
    envs: {
      local: [
        {
          title: { es: "1 · Instalar y configurar entorno", en: "1 · Install and configure env" },
          text: {
            es: "Copia el ejemplo de variables y crea la base local. drizzle.config.ts lee DATABASE_URL del entorno.",
            en: "Copy the env example and create the local database. drizzle.config.ts reads DATABASE_URL from the environment.",
          },
          code: "npm install\ncp .env.example .env\npsql postgresql://postgres:postgres@127.0.0.1:5432/postgres -c \"CREATE DATABASE app_db;\"\nnpx drizzle-kit push\nnpm run dev",
        },
        {
          title: { es: "2 · Seed (planes MXN/USD + demo)", en: "2 · Seed (MXN/USD plans + demo)" },
          text: {
            es: "Con la BD vacía el seed es abierto; después exige sesión admin/owner. Crea planes, interpretaciones, ajustes y 4 usuarios demo (password123).",
            en: "With an empty DB the seed is open; afterwards it requires an admin/owner session. Creates plans, interpretations, settings and 4 demo users (password123).",
          },
          code: 'curl -X POST http://localhost:3000/api/admin/seed',
        },
        {
          title: { es: "3 · Validar", en: "3 · Validate" },
          text: { es: "Los tres comandos deben pasar antes de cada PR.", en: "All three must pass before every PR." },
          code: "npx next typegen\nnpm exec tsc -- --noEmit --pretty false\nnpm run build",
        },
      ],
      staging: [
        {
          title: { es: "1 · Proyecto + BD de staging", en: "1 · Staging project + DB" },
          text: {
            es: "Crea el hosting (p. ej. Vercel/Render) y una Postgres separada (p. ej. rama Neon). Fija NEXT_PUBLIC_URL a la URL de staging.",
            en: "Create the hosting (e.g. Vercel/Render) and a separate Postgres (e.g. Neon branch). Pin NEXT_PUBLIC_URL to the staging URL.",
          },
          code: "DATABASE_URL=<staging-connection-string>\nNEXT_PUBLIC_URL=https://staging.tu-dominio.com",
        },
        {
          title: { es: "2 · Migrar y sembrar", en: "2 · Migrate and seed" },
          text: { es: "Migra apuntando a staging y haz seed una vez sobre la BD vacía.", en: "Migrate pointing at staging and seed once on the empty DB." },
          code: 'DATABASE_URL="<staging-connection-string>" npx drizzle-kit push\ncurl -X POST https://staging.tu-dominio.com/api/admin/seed',
        },
      ],
      production: [
        {
          title: { es: "1 · Proyecto + BD productiva", en: "1 · Production project + DB" },
          text: {
            es: "Postgres dedicada con backups diarios + PITR y red privada. Rama main protegida → deploy a prod.",
            en: "Dedicated Postgres with daily backups + PITR and private networking. Protected main branch → prod deploy.",
          },
          code: "DATABASE_URL=<prod-connection-string>\nNEXT_PUBLIC_URL=https://tu-dominio.com",
        },
        {
          title: { es: "2 · Migrar, sembrar y asegurar", en: "2 · Migrate, seed and secure" },
          text: {
            es: "Migraciones solo aditivas. Seed una vez y luego elimina o rota los usuarios demo (password público).",
            en: "Additive-only migrations. Seed once, then delete or rotate the demo users (public password).",
          },
          code: 'DATABASE_URL="<prod-connection-string>" npx drizzle-kit push\ncurl -X POST https://tu-dominio.com/api/admin/seed\n# luego: borra owner/admin/editor/user@carta.natal o cambia sus passwords en /admin',
        },
      ],
    },
    verify: [
      { es: "GET /api/health → {\"ok\":true} en los 3 entornos", en: "GET /api/health → {\"ok\":true} in all 3 environments" },
      { es: "Registro + login + cálculo de carta funcionan", en: "Register + login + chart calculation work" },
      { es: "typegen + tsc + build en verde", en: "typegen + tsc + build green" },
    ],
  },
  {
    id: "stripe",
    icon: "💳",
    title: { es: "Stripe: pagos MXN/USD", en: "Stripe: MXN/USD payments" },
    summary: {
      es: "Checkout por suscripción ($149 MXN/mes · $1,499 MXN/año, toggle USD), Portal y webhooks. Sin claves = modo demo.",
      en: "Subscription checkout ($149 MXN/mo · $1,499 MXN/yr, USD toggle), Portal and webhooks. No keys = demo mode.",
    },
    envs: {
      local: [
        {
          title: { es: "1 · Modo demo (sin claves)", en: "1 · Demo mode (no keys)" },
          text: {
            es: "Sin STRIPE_SECRET_KEY el checkout sube a Premium al instante. Ideal para desarrollar el resto.",
            en: "Without STRIPE_SECRET_KEY checkout upgrades to Premium instantly. Ideal for developing everything else.",
          },
          code: "# .env vacío de Stripe → /pricing muestra aviso demo\ncurl -X POST http://localhost:3000/api/stripe/checkout \\\n  -H \"Content-Type: application/json\" -d '{\"planSlug\":\"celestial\",\"currency\":\"MXN\"}'\n# sin sesión → 401 (esperado); con sesión → {\"demo\":true}",
        },
        {
          title: { es: "2 · Flujo real con Stripe CLI", en: "2 · Real flow with Stripe CLI" },
          text: {
            es: "Claves test + reenvío de webhooks. Paga con 4242 4242 4242 4242.",
            en: "Test keys + webhook forwarding. Pay with 4242 4242 4242 4242.",
          },
          code: "stripe login\n# .env: STRIPE_SECRET_KEY=sk_test_... NEXT_PUBLIC_URL=http://localhost:3000\nstripe listen --forward-to localhost:3000/api/stripe/webhook\n# añade el whsec_... impreso → STRIPE_WEBHOOK_SECRET=whsec_...\nnpm run dev",
        },
      ],
      staging: [
        {
          title: { es: "1 · Claves test + webhook", en: "1 · Test keys + webhook" },
          text: {
            es: "Solo sk_test_. Endpoint dedicado con los 3 eventos; guarda su whsec_... en el env de staging.",
            en: "sk_test_ only. Dedicated endpoint with the 3 events; store its whsec_... in the staging env.",
          },
          code: "STRIPE_SECRET_KEY=sk_test_...\nSTRIPE_WEBHOOK_SECRET=whsec_... # del endpoint staging\n# Dashboard test → Webhooks → Add endpoint:\n# https://staging.tu-dominio.com/api/stripe/webhook\n# eventos: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted",
        },
        {
          title: { es: "2 · Verificar", en: "2 · Verify" },
          text: {
            es: "El endpoint GET indica si Stripe está configurado; la compra test debe subir el plan.",
            en: "The GET endpoint reports Stripe status; the test purchase must upgrade the plan.",
          },
          code: 'curl -s https://staging.tu-dominio.com/api/stripe/webhook\n# → {"stripe":"configured"}',
        },
      ],
      production: [
        {
          title: { es: "1 · Claves live + Price IDs fijos", en: "1 · Live keys + fixed Price IDs" },
          text: {
            es: "Repite staging en modo live con endpoint propio. Recomendado: crear Productos/Precios fijos (MXN+USD, mensual+anual) y fijar los 4 STRIPE_PRICE_*.",
            en: "Repeat staging in live mode with its own endpoint. Recommended: create fixed Products/Prices (MXN+USD, monthly+annual) and pin the 4 STRIPE_PRICE_* vars.",
          },
          code: "STRIPE_SECRET_KEY=sk_live_...\nSTRIPE_WEBHOOK_SECRET=whsec_... # del endpoint PROD (distinto al de staging)\nSTRIPE_PRICE_CELESTIAL_MXN=price_...\nSTRIPE_PRICE_CELESTIAL_USD=price_...\nSTRIPE_PRICE_CELESTIAL_ANNUAL_MXN=price_...\nSTRIPE_PRICE_CELESTIAL_ANNUAL_USD=price_...",
        },
        {
          title: { es: "2 · Go-live", en: "2 · Go-live" },
          text: {
            es: "Compra real + reembolso inmediato, Portal desde /cuenta, webhooks en verde y downgrade al cancelar.",
            en: "Real purchase + immediate refund, Portal from /cuenta, green webhooks, downgrade on cancel.",
          },
          code: "# Dashboard live → Webhooks → Add endpoint:\n# https://tu-dominio.com/api/stripe/webhook",
        },
      ],
    },
    verify: [
      { es: "Sin sesión → 401; con sesión + sin claves → {\"demo\":true}", en: "No session → 401; session + no keys → {\"demo\":true}" },
      { es: "Compra test/live → users.plan = celestial(_annual) + fila en subscriptions", en: "Test/live purchase → users.plan = celestial(_annual) + subscriptions row" },
      { es: "Cancelar suscripción → plan vuelve a free (webhook deleted)", en: "Cancel subscription → plan back to free (deleted webhook)" },
    ],
  },
  {
    id: "i18n",
    icon: "🌐",
    title: { es: "Idioma ES/EN + moneda", en: "Language ES/EN + currency" },
    summary: {
      es: "Diccionario por cookies (locale, currency), MXN por defecto con toggle USD. Sin servicios externos.",
      en: "Cookie dictionary (locale, currency), MXN default with USD toggle. No external services.",
    },
    envs: {
      local: [
        {
          title: { es: "1 · Probar", en: "1 · Try it" },
          text: {
            es: "Alterna ES/EN en el navbar y MXN/USD en el footer de /pricing. Añade strings en ambos dictados de src/lib/i18n.ts.",
            en: "Toggle ES/EN in the navbar and MXN/USD in the /pricing footer. Add strings to both dicts in src/lib/i18n.ts.",
          },
          code: "# ES:  $149.00 MXN   EN:  MX$149.00 / US$9.99\n# PDF bilingüe:\ncurl -s -o /tmp/es.pdf \"http://localhost:3000/api/charts/<id>/pdf?locale=es\"\ncurl -s -o /tmp/en.pdf \"http://localhost:3000/api/charts/<id>/pdf?locale=en\"",
        },
      ],
      staging: [
        {
          title: { es: "1 · QA bilingüe", en: "1 · Bilingual QA" },
          text: {
            es: "Onboarding → lectura → PDF en ES y EN. Que no se escape ninguna clave cruda (p. ej. pricing.title) y que la moneda persista (cookie path=/).",
            en: "Onboarding → reading → PDF in ES and EN. No raw keys leaking (e.g. pricing.title) and currency persisting (cookie path=/).",
          },
          code: "# DevTools → Application → Cookies: locale, currency",
        },
      ],
      production: [
        {
          title: { es: "1 · Defaults por mercado", en: "1 · Market defaults" },
          text: {
            es: "El fallback es es + MXN (getLocaleFromCookies/getCurrencyFromCookies). Cámbialo si tu mercado principal cambia; la tasa demo USD_MXN_RATE es solo visual.",
            en: "Fallback is es + MXN (getLocaleFromCookies/getCurrencyFromCookies). Change it if your main market changes; the demo USD_MXN_RATE is display-only.",
          },
          code: "# src/lib/i18n.ts → USD_MXN_RATE, fallbacks de cookies",
        },
      ],
    },
    verify: [
      { es: "Toggle ES/EN reformatea precios y traduce navbar, pricing, onboarding y PDF", en: "ES/EN toggle reformats prices and translates navbar, pricing, onboarding and PDF" },
      { es: "Stripe recibe la moneda elegida (metadata.currency)", en: "Stripe receives the chosen currency (metadata.currency)" },
    ],
  },
  {
    id: "pdf",
    icon: "📄",
    title: { es: "PDF editorial descargable", en: "Downloadable editorial PDF" },
    summary: {
      es: "Ruta /api/charts/[id]/pdf con @react-pdf: trial gratis vs completo premium, portada + cúspides. Sin configuración.",
      en: "Route /api/charts/[id]/pdf with @react-pdf: free trial vs full premium, cover + cusps. No configuration.",
    },
    envs: {
      local: [
        {
          title: { es: "1 · Generar y comprobar", en: "1 · Generate and check" },
          text: {
            es: "Crea una carta y descarga el PDF. Debe empezar por %PDF-. Fuentes Helvetica integradas (sin assets).",
            en: "Create a chart and download the PDF. It must start with %PDF-. Built-in Helvetica fonts (no assets).",
          },
          code: 'curl -s -o /tmp/sr.pdf -w "http=%{http_code} type=%{content_type}\\n" \\\n  "http://localhost:3000/api/charts/<id>/pdf?locale=es"\nhead -c 5 /tmp/sr.pdf  # %PDF-',
        },
      ],
      staging: [
        {
          title: { es: "1 · QA trial vs premium", en: "1 · Trial vs premium QA" },
          text: {
            es: "Con cuenta free: PDF trial con CTA y sin párrafos premium. Con premium: 4 páginas completas ES + EN.",
            en: "With a free account: trial PDF with CTA and no premium paragraphs. With premium: full 4 pages ES + EN.",
          },
          code: "# /revolucion/<id> → botón Descargar PDF editorial ↓",
        },
      ],
      production: [
        {
          title: { es: "1 · Endurecer si hace falta", en: "1 · Harden if needed" },
          text: {
            es: "La ruta ya exige sesión/dueño. Si hay abuso, añade rate-limit. Si agregas fuentes propias, regístralas con Font.register() y verifica el bundle.",
            en: "The route already requires session/owner. If abused, add rate-limiting. If you add custom fonts, register with Font.register() and verify the bundle.",
          },
          code: "# src/lib/solarPdf.tsx → estilos y secciones",
        },
      ],
    },
    verify: [
      { es: "200 + application/pdf + cabecera %PDF- en ambos locales", en: "200 + application/pdf + %PDF- header in both locales" },
      { es: "Trial sin texto premium; premium con tabla de posiciones y cúspides", en: "Trial without premium text; premium with positions and cusps tables" },
    ],
  },
  {
    id: "mapas",
    icon: "🗺️",
    title: { es: "Geocoding + mapa real", en: "Geocoding + real map" },
    summary: {
      es: "Proxy /api/geocode → Nominatim (sin API key, caché 1h, fallback local) + Leaflet con click/drag. Las coords alimentan ASC/MC/casas.",
      en: "Proxy /api/geocode → Nominatim (keyless, 1h cache, local fallback) + Leaflet with click/drag. Coords feed ASC/MC/houses.",
    },
    envs: {
      local: [
        {
          title: { es: "1 · Probar (requiere internet)", en: "1 · Try it (needs internet)" },
          text: {
            es: "Online devuelve source osm; offline, fallback local. En /empezar paso 4 busca, haz click y arrastra el pin.",
            en: "Online returns source osm; offline, local fallback. In /empezar step 4 search, click and drag the pin.",
          },
          code: 'curl -s "http://localhost:3000/api/geocode?q=Mexicali" | head -c 200\n# → {"results":[...],"source":"osm"}',
        },
      ],
      staging: [
        {
          title: { es: "1 · Salida a OSM + atribución", en: "1 · OSM egress + attribution" },
          text: {
            es: "Confirma source osm desde el servidor (si el host bloquea egress solo verás local) y que el mapa muestra © OpenStreetMap.",
            en: "Confirm source osm from the server (if the host blocks egress you'll only see local) and that the map shows © OpenStreetMap.",
          },
          code: 'curl -s "https://staging.tu-dominio.com/api/geocode?q=Madrid" | head -c 200',
        },
      ],
      production: [
        {
          title: { es: "1 · Escalar sin cambiar la UI", en: "1 · Scale without changing the UI" },
          text: {
            es: "Respeta ~1 req/s (el proxy + debounce ya lo hacen) y el User-Agent identificable. Si creces: más caché, Photon propio o proveedor pago tras el mismo contrato /api/geocode.",
            en: "Respect ~1 req/s (proxy + debounce already do) and the identifying User-Agent. As you grow: more cache, self-hosted Photon, or a paid provider behind the same /api/geocode contract.",
          },
          code: "# src/app/api/geocode/route.ts → next: { revalidate: 3600 }",
        },
      ],
    },
    verify: [
      { es: "Búsqueda devuelve coords reales (osm) y el pin mueve lat/lon", en: "Search returns real coords (osm) and the pin moves lat/lon" },
      { es: "Atribución OSM visible bajo el mapa", en: "OSM attribution visible under the map" },
    ],
  },
  {
    id: "casas",
    icon: "🏠",
    title: { es: "Casas: Iguales · Placidus · Entero", en: "Houses: Equal · Placidus · Whole" },
    summary: {
      es: "Placidus = casas desiguales por horas temporales (estándar moderno). Iguales (defecto) = 12×30° estables. Entero = un signo por casa.",
      en: "Placidus = unequal houses by temporal hours (modern standard). Equal (default) = stable 12×30°. Whole = one sign per house.",
    },
    envs: {
      local: [
        {
          title: { es: "1 · Comparar sistemas", en: "1 · Compare systems" },
          text: {
            es: "Genera la misma carta con cada houseSystem y compara sunHouse: la Casa del Sol puede moverse (p. ej. 10 en Iguales vs 4 en Placidus).",
            en: "Generate the same chart with each houseSystem and compare sunHouse: the Sun's house can move (e.g. 10 in Equal vs 4 in Placidus).",
          },
          code: 'curl -s -X POST http://localhost:3000/api/charts/calculate \\\n  -H "Content-Type: application/json" \\\n  -d \'{"guestName":"Test","birthDate":"1984-05-16","birthTime":"01:00","birthPlace":"Mexicali","birthLat":32.6393,"birthLon":-115.4747,"birthTimezone":"America/Tijuana","returnPlace":"Mexicali","returnLat":32.6393,"returnLon":-115.4747,"targetYear":2027,"houseSystem":"placidus"}\'',
        },
      ],
      staging: [
        {
          title: { es: "1 · Matriz QA + latitudes altas", en: "1 · QA matrix + high latitudes" },
          text: {
            es: "Misma carta en los 3 sistemas: coinciden lectura, tabla de cúspides y badge del PDF. Prueba Reykjavík (64°N, ok) y Longyearbyen (78°N, debe avisar fallback a Iguales).",
            en: "Same chart in all 3 systems: reading, cusp table and PDF badge must match. Try Reykjavík (64°N, fine) and Longyearbyen (78°N, must show Equal-fallback notice).",
          },
          code: "# /empezar paso 6 → selector de sistema · /revolucion/<id> → badge 🏠",
        },
      ],
      production: [
        {
          title: { es: "1 · Sin configuración", en: "1 · No configuration" },
          text: {
            es: "Todo es código (src/lib/astro.ts: placidusCusps(), houseOfWithCusps()). La mejora futura (Swiss Ephemeris) entra tras el mismo contrato calculateRevolution().",
            en: "It's all code (src/lib/astro.ts: placidusCusps(), houseOfWithCusps()). The future upgrade (Swiss Ephemeris) slots behind the same calculateRevolution() contract.",
          },
          code: "# valores aceptados: equal | placidus | whole (otro → equal)",
        },
      ],
    },
    verify: [
      { es: "El sistema elegido aparece en lectura, PDF y solar_charts.house_system", en: "The chosen system shows in reading, PDF and solar_charts.house_system" },
      { es: "|lat|>66° en Placidus muestra aviso de fallback a Iguales", en: "|lat|>66° in Placidus shows the Equal-fallback notice" },
    ],
  },
];
