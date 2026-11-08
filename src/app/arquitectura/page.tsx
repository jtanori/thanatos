export const dynamic = "force-dynamic";

export default function Arquitectura() {
  const sections: Array<[string, string[]]> = [
    [
      "1 · Visión del producto",
      [
        "Producto: Revolución Solar (Solar Return) como blueprint anual — Ascendente RS (tono), Casa del Sol (escenario), Luna (necesidad), stelliums (foco) y aspectos RS vs natal.",
        "Dos productos: Seeker/Gratis (trial: 1 carta, Asc + Casa del Sol resumidos, sin PDF) y Celestial/Premium (ilimitado, lectura completa, timeline 12 meses, PDF).",
        "Flujo: landing → onboarding 6 pasos (nombre, fecha, hora, lugar natal, año + lugar de cumpleaños, confirmación) → cálculo → lectura con paywall poroso → cuenta/suscripción.",
      ],
    ],
    [
      "2 · Stack decidido (y por qué)",
      [
        "Next.js 16 App Router + React 19: SSR para SEO astral + client components solo en onboarding/rueda. Un solo deploy, sin SPA separada.",
        "PostgreSQL + Drizzle ORM: relacional para usuarios/cartas/suscripciones/auditoría; JSONB para planetas/casas/aspectos (flexible sin perder SQL). drizzle-kit push para migraciones simples.",
        "Auth propia con scrypt + sesiones httpOnly (30 días): evita vendor lock (Clerk/Auth0) en MVP; migrable a Auth.js cuando se necesite OAuth/Google.",
        "Motor astro propio (Meeus baja precisión): cero dependencias, explicable y testeable. Precisión ±6h suficiente para demo. Ruta de mejora: Swiss Ephemeris (wasm) o API Astronomy Engine sin cambiar el contrato calculateRevolution().",
        "Tailwind v4 + tokens cálidos (#fff8f1, #a32e0c, Fraunces): replica la dirección visual adjunta (desierto, observatorio, serif editorial).",
      ],
    ],
    [
      "3 · Base de datos — modelo",
      [
        "users(id, email único, passwordHash scrypt, name, role[owner|admin|editor|user], plan[free|premium], datos natales + returnPlace/lat/lon, timestamps).",
        "sessions(id, userId FK cascade, token único, expiresAt).",
        "solar_charts(id, userId nullable para invitados, targetYear, inputs natales + retorno, natalSunLongitude, returnMomentUtc, asc/mc, sunHouse, moon, stelliums/planets/houses/aspects JSONB).",
        "interpretations(category, key, title, short/full/premium, locale, version, updatedBy): la base editable por el Editor. La lectura hace lookup por clave (ASC_LEO, SUN_HOUSE_10) con fallback en código.",
        "plans(slug único: seeker/celestial/celestial-annual, priceCents, interval, features JSONB, maxCharts, pdfAllowed) + subscriptions(userId, planSlug, status).",
        "audit_logs(actorId, action, entity, entityId, meta) + app_settings(key PK, value JSONB). Índices: users.email, sessions.token, charts(userId, targetYear).",
      ],
    ],
    [
      "4 · Roles y seguridad (RBAC)",
      [
        "Jerarquía: owner(3) > admin(2) > editor(1) > user(0). Helper canAccess(role, needed). Owner configura todo (settings/planes); admin gestiona usuarios + seed; editor solo CRUD de knowledge; user solo sus cartas.",
        "Solo owner puede otorgar owner/admin. Contraseñas scrypt(timingSafeEqual), cookies httpOnly + SameSite=Lax + Secure en prod. Sin secretos en cliente; cálculo en servidor.",
        "Paywall: isPremiumUser() + chequeo en servidor al renderizar /revolucion/[id] (blur + CTA si free). Límite free: 1 año distinto (402 + upgrade:true). Validación de inputs (año 1900-2100, coordenadas requeridas).",
        "Pendiente prod: rate-limit en /calculate y /login, CAPTCHA en register, MFA para owner/admin, cifrado en reposo (pgcrypto para lat/lon si se exige), borrado GDPR.",
      ],
    ],
    [
      "5 · CI/CD, branching y deploys",
      [
        "Branching propuesto: main (prod, protegida) ← staging (pre-prod) ← feature/* (PRs). Commits convencionales (feat:, fix:, content:). CODEOWNERS: owner en settings/planes, editor en content.",
        "CI (GitHub Actions): job validate = npx next typegen + tsc --noEmit + npm run build + (vitest para astro: test de retorno solar conocido + test de casas). Bloquea merge si falla.",
        "CD: push a main → build → migrate (drizzle-kit push con DATABASE_URL de prod) → deploy (Vercel/Render/Fly) → smoke /api/health. Rollback por redeploy del SHA anterior; migraciones solo aditivas.",
        "Entornos: .env.local (dev), preview por PR (Neon branch), staging, prod. Secretos en gestor (Vercel Env / Doppler), nunca en repo. Backups diarios PG + PITR; seed idempotente para demos.",
      ],
    ],
    [
      "6 · Cálculo + Placidus — ¿qué significa la opción?",
      [
        "Longitud solar: serie de Meeus (g, q + 1.915·sin g). Retorno por minimización |Sol tránsito − Sol natal|. Asc/MC vía GMST+LST.",
        "¿Qué es Placidus? Es el sistema de casas más usado en astrología occidental moderna. Divide el arco diurno/nocturno en horas temporales desiguales: las casas 1,4,7,10 nacen de ASC/MC/DSC/IC y las intermedias (2,3,5,6,8,9,11,12) se calculan por tiempo, no por 30° fijos. Resultado: casas de tamaños distintos que reflejan el ritmo real del día en tu latitud.",
        "¿En qué se diferencia? Casas Iguales = 12×30° desde el ASC (simple, estable en todo el mundo, ideal para principiantes y latitudes extremas). Signo Entero = un signo = una casa (helenística, el signo del ASC es la casa 1). Placidus = cuadrantes temporales (estándar moderno, más matiz pero inestable más allá de |lat|>66°, donde caemos a Iguales con aviso).",
        "¿Importa para tu lectura? Sí: la Casa del Sol (tu escenario anual) puede moverse de casa al cambiar de sistema. Por eso el onboarding deja elegir y la lectura + PDF muestran el sistema usado y las 12 cúspides. Implementación: placidusCusps() por arco semidiurno simplificado (error <1.5° en latitudes medias), houseOfWithCusps() para asignar planetas.",
      ],
    ],
    [
      "6b · Fase 2 entregada ✅ — Stripe + i18n + PDF + mapa real",
      [
        "Stripe: Checkout (mode subscription, MXN por defecto, toggle MXN/USD) + Customer Portal + webhook (checkout.session.completed → plan premium, subscription.updated/deleted → downgrade). Sin claves → modo demo que sube a Premium para probar. Con claves: STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET + PRICE IDs opcionales o price_data dinámico ($149 MXN/mes, $1,499 MXN/año).",
        "i18n ES/EN: diccionario en src/lib/i18n.ts, cookies locale/currency (1 año), LanguageSwitcher + CurrencySwitcher, Intl.NumberFormat es-MX/en-US. Landing/pricing/onboarding/lectura/PDF bilingües; resto con fallback ES.",
        "PDF editorial (@react-pdf): portada oscura + 2-4 páginas (Asc, Casa del Sol, estrategia premium, aspectos + tabla de posiciones + cúspides). Gratis = trial con CTA; Premium = completo. Ruta /api/charts/[id]/pdf?locale=es|en, botón de descarga en la lectura.",
        "Geocoding real + mapa: proxy /api/geocode → Nominatim (OSM, sin key, con fallback local) + MapPicker Leaflet (click + drag, tile.openstreetmap.org). Las coordenadas alimentan ASC/MC/casas; la precisión de casas depende de esto.",
      ],
    ],
    [
      "7 · Monetización y contenido",
      [
        "Free = adquisición: deja probar el momento 'wow' (rueda + Asc + Casa) pero difumina Luna/stelliums/aspectos. Premium = transformación: timeline, PDF, años ilimitados.",
        "Contenido desacoplado: el Editor reescribe títulos/textos sin deploy (tabla interpretations + versionado). Cada cambio queda en audit_logs con updatedBy.",
        "Métricas: activación (% onboarding→carta), conversión free→premium, retención anual (¿vuelve en su cumpleaños?), NPS de lectura. Eventos listos para PostHog.",
      ],
    ],
    [
      "8 · Roadmap",
      [
        "Fase 1: auth + onboarding + cálculo + paywall + admin/editor + seed. ✅",
        "Fase 2 (esta entrega): Stripe MXN/USD + PDF editorial + geocoding OSM + mapa Leaflet + i18n ES/EN + Placidus/Iguales/Entero. ✅",
        "Fase 3: Swiss Ephemeris, tránsitos del año, sinastría, timeline 12 meses interactivo, recordatorios de cumpleaños, app móvil (mismo API).",
        "Respuestas a tus preguntas: precio en MXN por defecto ($149/mes, $1,499/año) con toggle a USD · Stripe (Checkout+Portal+webhooks) · Placidus disponible, Iguales por defecto (estable) · PDF con diseño editorial sí, con portada oscura y tipografía serif.",
      ],
    ],
  ];

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-[#a32e0c]">Documento de decisión · CI/CD · DB · Seguridad</p>
      <h1 className="font-serif-display text-5xl">Cómo construiría la Revolución Solar — antes de escribir más código.</h1>
      <p className="mt-4 leading-relaxed text-[#5b4d42]">
        Me pediste discutirlo antes del build. Aquí está mi propuesta completa — y ya la implementé en esta demo para que puedas tocarla:
        onboarding en <a href="/empezar" className="font-semibold text-[#a32e0c]">/empezar</a>, lectura en <a href="/dashboard" className="font-semibold text-[#a32e0c]">/dashboard</a>,
        admin en <a href="/admin" className="font-semibold text-[#a32e0c]">/admin</a>, editor en <a href="/editor" className="font-semibold text-[#a32e0c]">/editor</a>.
      </p>
      <div className="mt-8 space-y-5">
        {sections.map(([title, bullets]) => (
          <section key={title} className="rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="font-serif-display text-2xl">{title}</h2>
            <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-[#3d332c]">
              {bullets.map((b) => <li key={b} className="flex gap-2"><span className="text-[#a32e0c]">✦</span><span>{b}</span></li>)}
            </ul>
          </section>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="/empezar" className="btn-clay rounded-full px-7 py-3 font-semibold">Probar el onboarding →</a>
        <a href="/admin" className="rounded-full border border-[#a32e0c] px-7 py-3 font-semibold text-[#a32e0c]">Abrir panel admin</a>
        <a href="/guia" className="rounded-full bg-[#2b211b] px-7 py-3 font-semibold text-white">📖 Guía de setup · Local/Staging/Prod</a>
      </div>
    </main>
  );
}
