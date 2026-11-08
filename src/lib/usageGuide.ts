import type { LText } from "./guide";
import { pick } from "./guide";

export { pick };
export type { LText };

export interface Capability {
  title: LText;
  route?: string;
  steps: LText[];
}

export interface RoleGuide {
  id: string;
  icon: string;
  badge: LText;
  title: LText;
  summary: LText;
  can: Capability[];
  limits: LText[];
  verify: LText[];
}

export const USAGE_UI: Record<string, LText> = {
  kicker: {
    es: "Manual de uso · Solo visible en desarrollo",
    en: "Usage manual · Development only",
  },
  title: {
    es: "Qué puede hacer cada usuario y cómo.",
    en: "What each user can do and how.",
  },
  sub: {
    es: "Elige un rol para ver sus capacidades paso a paso, sus límites y cómo verificarlo. Esta página responde 404 en staging y producción.",
    en: "Pick a role to see its step-by-step capabilities, limits, and how to verify them. This page returns 404 on staging and production.",
  },
  devNote: {
    es: "NODE_ENV=development — si ves esto, estás en local. En prod esta ruta no existe.",
    en: "NODE_ENV=development — if you see this, you're on local. In prod this route doesn't exist.",
  },
  canTitle: { es: "Puedes hacer esto", en: "You can do this" },
  limitsTitle: { es: "Límites", en: "Limits" },
  verifyTitle: { es: "✅ Cómo verificarlo", en: "✅ How to verify" },
  open: { es: "Abrir →", en: "Open →" },
};

export const USAGE_ROLES: RoleGuide[] = [
  {
    id: "visitor",
    icon: "👁️",
    badge: { es: "Sin cuenta", en: "No account" },
    title: { es: "Visitante", en: "Visitor" },
    summary: {
      es: "Explora y calcula tu Revolución Solar sin registrarte. La carta se guarda y la ves con su enlace directo.",
      en: "Explore and calculate your Solar Return without signing up. The chart is saved and viewable via its direct link.",
    },
    can: [
      {
        title: { es: "Calcular tu Revolución Solar", en: "Calculate your Solar Return" },
        route: "/empezar",
        steps: [
          {
            es: "Desde la portada pulsa «Calcular mi Revolución Solar» (o escribe tu nombre en la tarjeta).",
            en: "From the landing press “Calculate my Solar Return” (or type your name in the card).",
          },
          {
            es: "Completa los 7 pasos: nombre → fecha → hora + timezone → ciudad natal (búsqueda real + mapa) → año + ciudad de cumpleaños → sistema de casas → confirmar.",
            en: "Complete the 7 steps: name → date → time + timezone → birth city (real search + map) → year + birthday city → house system → confirm.",
          },
          {
            es: "Al generar, verás la lectura: Ascendente, Casa del Sol, rueda, y secciones premium difuminadas.",
            en: "On generate you'll see the reading: Rising, Sun house, wheel, and blurred premium sections.",
          },
        ],
      },
      {
        title: { es: "Descargar el PDF trial", en: "Download the trial PDF" },
        steps: [
          {
            es: "En la lectura pulsa «Descargar PDF editorial ↓» (versión trial con CTA, sin texto premium).",
            en: "In the reading press “Download editorial PDF ↓” (trial version with CTA, no premium text).",
          },
          {
            es: "Cambia el idioma del PDF con ?locale=es o ?locale=en en la URL de descarga.",
            en: "Switch the PDF language with ?locale=es or ?locale=en in the download URL.",
          },
        ],
      },
      {
        title: { es: "Crear tu cuenta", en: "Create your account" },
        route: "/register",
        steps: [
          {
            es: "Regístrate con nombre + email + contraseña (mín. 8). Si la BD está vacía, ¡serás owner!",
            en: "Sign up with name + email + password (min. 8). If the DB is empty, you'll be owner!",
          },
          {
            es: "Con cuenta, tus cartas se guardan en «Mis cartas» del dashboard y tu perfil natal se autocompleta.",
            en: "With an account, your charts are saved under dashboard “My charts” and your natal profile autocompletes.",
          },
        ],
      },
    ],
    limits: [
      {
        es: "Sin dashboard: tus cartas solo viven en su enlace directo. Regístrate para guardarlas.",
        en: "No dashboard: your charts only live at their direct link. Sign up to keep them.",
      },
    ],
    verify: [
      {
        es: "Calcula como visitante → la URL /revolucion/<id> abre la lectura y el PDF trial descarga %PDF-.",
        en: "Calculate as visitor → the /revolucion/<id> URL opens the reading and the trial PDF downloads %PDF-.",
      },
    ],
  },
  {
    id: "free",
    icon: "✨",
    badge: { es: "Plan Seeker · Gratis", en: "Seeker plan · Free" },
    title: { es: "Usuario Free", en: "Free User" },
    summary: {
      es: "1 Revolución Solar (1 año distinto) con Ascendente + Casa del Sol, rueda y PDF trial. Recalcular el mismo año actualiza la carta.",
      en: "1 Solar Return (1 distinct year) with Rising + Sun house, wheel and trial PDF. Recalculating the same year updates the chart.",
    },
    can: [
      {
        title: { es: "Gestionar tu carta en el dashboard", en: "Manage your chart in the dashboard" },
        route: "/dashboard",
        steps: [
          {
            es: "Entra a /dashboard: verás tu carta guardada (año, Asc, Casa del Sol, Luna).",
            en: "Open /dashboard: you'll see your saved chart (year, Rising, Sun house, Moon).",
          },
          {
            es: "Recalcular el mismo año la actualiza (upsert). Pedir otro año responde 402 con upgrade:true.",
            en: "Recalculating the same year updates it (upsert). Requesting another year returns 402 with upgrade:true.",
          },
        ],
      },
      {
        title: { es: "Pasar a Premium", en: "Upgrade to Premium" },
        route: "/pricing",
        steps: [
          {
            es: "En /pricing elige Celestial mensual ($149 MXN) o anual ($1,499 MXN), moneda MXN/USD, y paga con Stripe.",
            en: "In /pricing pick Celestial monthly ($149 MXN) or annual ($1,499 MXN), MXN/USD currency, and pay with Stripe.",
          },
          {
            es: "Sin STRIPE_SECRET_KEY el checkout es demo: sube a Premium al instante (aviso visible en la página).",
            en: "Without STRIPE_SECRET_KEY checkout is demo: upgrades to Premium instantly (visible notice on the page).",
          },
        ],
      },
      {
        title: { es: "Ajustar cuenta, idioma y moneda", en: "Adjust account, language and currency" },
        route: "/cuenta",
        steps: [
          {
            es: "En /cuenta actualiza tu perfil natal (se usa para prellenar el onboarding).",
            en: "In /cuenta update your natal profile (used to prefill onboarding).",
          },
          {
            es: "Cambia ES/EN en el navbar y MXN/USD en el footer: precios, lectura y PDF se reformatean.",
            en: "Switch ES/EN in the navbar and MXN/USD in the footer: prices, reading and PDF reformat.",
          },
        ],
      },
    ],
    limits: [
      {
        es: "1 año distinto. Secciones Luna/stelliums/aspectos difuminadas + PDF trial.",
        en: "1 distinct year. Moon/stelliums/aspects sections blurred + trial PDF.",
      },
    ],
    verify: [
      {
        es: "Como user@carta.natal calcula 2027 → ok; calcula 2028 → 402 upgrade:true.",
        en: "As user@carta.natal calculate 2027 → ok; calculate 2028 → 402 upgrade:true.",
      },
    ],
  },
  {
    id: "premium",
    icon: "👑",
    badge: { es: "Plan Celestial · Pago", en: "Celestial plan · Paid" },
    title: { es: "Usuario Premium", en: "Premium User" },
    summary: {
      es: "Años ilimitados, lectura completa (Luna, stelliums, 8 aspectos RS vs natal), PDF editorial completo y Portal de Stripe.",
      en: "Unlimited years, full reading (Moon, stelliums, 8 SR-vs-natal aspects), full editorial PDF and Stripe Portal.",
    },
    can: [
      {
        title: { es: "Calcular años ilimitados y comparar casas", en: "Calculate unlimited years and compare houses" },
        route: "/empezar",
        steps: [
          {
            es: "Genera 2026, 2027, 2028… cada carta se guarda aparte en tu dashboard.",
            en: "Generate 2026, 2027, 2028… each chart is saved separately in your dashboard.",
          },
          {
            es: "Repite un año cambiando el sistema (Iguales/Placidus/Entero) y compara la Casa del Sol.",
            en: "Repeat a year changing the system (Equal/Placidus/Whole) and compare the Sun's house.",
          },
        ],
      },
      {
        title: { es: "Leer todo + descargar PDF completo", en: "Read everything + download full PDF" },
        steps: [
          {
            es: "Estrategia premium del Ascendente y la Casa, Luna emocional, stelliums y tabla de aspectos desbloqueadas.",
            en: "Premium strategy for Rising and Sun house, emotional Moon, stelliums and aspects table unlocked.",
          },
          {
            es: "El botón descarga el PDF completo (4 págs, portada + cúspides) en ES o EN.",
            en: "The button downloads the full PDF (4 pages, cover + cusps) in ES or EN.",
          },
        ],
      },
      {
        title: { es: "Gestionar tu suscripción", en: "Manage your subscription" },
        route: "/cuenta",
        steps: [
          {
            es: "En /cuenta pulsa «Gestionar en Stripe →» para ver facturas, cambiar tarjeta o cancelar (Customer Portal).",
            en: "In /cuenta press “Manage in Stripe →” to see invoices, change card or cancel (Customer Portal).",
          },
          {
            es: "Al cancelar, el webhook deleted te devuelve a free automáticamente.",
            en: "On cancel, the deleted webhook moves you back to free automatically.",
          },
        ],
      },
    ],
    limits: [
      {
        es: "Sin límites de cartas. El PDF y la lectura completa dependen de mantener la suscripción activa.",
        en: "No chart limits. Full PDF and reading depend on keeping the subscription active.",
      },
    ],
    verify: [
      {
        es: "Como owner paga (demo o test 4242…) → users.plan = celestial(_annual) y el blur desaparece.",
        en: "As owner pay (demo or test 4242…) → users.plan = celestial(_annual) and the blur disappears.",
      },
    ],
  },
  {
    id: "editor",
    icon: "✏️",
    badge: { es: "Rol editor", en: "Editor role" },
    title: { es: "Editor de contenido", en: "Content Editor" },
    summary: {
      es: "Reescribe los textos que producen cada lectura (y el PDF) sin tocar código. Todo cambio queda auditado.",
      en: "Rewrite the texts behind every reading (and PDF) without touching code. Every change is audited.",
    },
    can: [
      {
        title: { es: "Editar la base de conocimiento", en: "Edit the knowledge base" },
        route: "/editor",
        steps: [
          {
            es: "Filtra por clave: ASC_LEO (Ascendentes), SUN_HOUSE_10 (Casa del Sol), MOON_TAURO (Luna), OVERVIEW, STELLIUM.",
            en: "Filter by key: ASC_LEO (Risings), SUN_HOUSE_10 (Sun house), MOON_TAURO (Moon), OVERVIEW, STELLIUM.",
          },
          {
            es: "Edita título, resumen (gratis), completo y premium. Guardar publica al instante en lecturas y PDFs.",
            en: "Edit title, short (free), full and premium. Saving publishes instantly to readings and PDFs.",
          },
        ],
      },
      {
        title: { es: "Comprobar tu cambio", en: "Check your change" },
        route: "/biblioteca",
        steps: [
          {
            es: "Abre /biblioteca para ver la ficha publicada y recalcula una carta de ese signo/casa para verla en contexto.",
            en: "Open /biblioteca to see the published card and recalculate a chart of that sign/house to see it in context.",
          },
        ],
      },
    ],
    limits: [
      {
        es: "Solo contenido (interpretations). Sin usuarios, planes, ajustes ni seed.",
        en: "Content only (interpretations). No users, plans, settings or seed.",
      },
    ],
    verify: [
      {
        es: "Como editor@carta.natal edita SUN_HOUSE_10 → la lectura de una carta con Sol en Casa 10 cambia.",
        en: "As editor@carta.natal edit SUN_HOUSE_10 → the reading of a chart with Sun in House 10 changes.",
      },
    ],
  },
  {
    id: "admin",
    icon: "🛠️",
    badge: { es: "Rol admin", en: "Admin role" },
    title: { es: "Admin del sistema", en: "System Admin" },
    summary: {
      es: "Gestiona usuarios, roles y planes, ejecuta el seed y revisa ajustes. No puede tocar owner/admin (solo owner).",
      en: "Manage users, roles and plans, run the seed and review settings. Can't touch owner/admin (owner only).",
    },
    can: [
      {
        title: { es: "Gestionar usuarios y suscripciones", en: "Manage users and subscriptions" },
        route: "/admin",
        steps: [
          {
            es: "En /admin cambia rol (user/editor) y plan (free/premium) de cualquier cuenta; el cambio es inmediato.",
            en: "In /admin change role (user/editor) and plan (free/premium) of any account; it applies immediately.",
          },
          {
            es: "Sube a un usuario free a premium para probar el paywall sin pagar (útil en QA de staging).",
            en: "Bump a free user to premium to test the paywall without paying (handy for staging QA).",
          },
        ],
      },
      {
        title: { es: "Ejecutar seed y revisar auditoría", en: "Run seed and review audit" },
        route: "/admin",
        steps: [
          {
            es: "El botón seed crea planes/interpretaciones/ajustes y usuarios demo si faltan (idempotente).",
            en: "The seed button creates plans/interpretations/settings and missing demo users (idempotent).",
          },
          {
            es: "Cada cambio (registros, upgrades, ediciones) queda en audit_logs con actor y fecha.",
            en: "Every change (signups, upgrades, edits) lands in audit_logs with actor and date.",
          },
        ],
      },
    ],
    limits: [
      {
        es: "No puede otorgar owner/admin ni editar ajustes del producto (settings/planes) — eso es del owner.",
        en: "Can't grant owner/admin nor edit product settings (settings/plans) — that's owner's.",
      },
    ],
    verify: [
      {
        es: "Como admin cambia user@carta.natal a premium → su blur desaparece sin pagar.",
        en: "As admin switch user@carta.natal to premium → their blur disappears without paying.",
      },
    ],
  },
  {
    id: "owner",
    icon: "👑",
    badge: { es: "Rol owner", en: "Owner role" },
    title: { es: "Product Owner", en: "Product Owner" },
    summary: {
      es: "Control total: configura planes, precios y ajustes, otorga roles y prepara cada entorno.",
      en: "Full control: configure plans, prices and settings, grant roles and prepare each environment.",
    },
    can: [
      {
        title: { es: "Configurar el producto", en: "Configure the product" },
        route: "/admin",
        steps: [
          {
            es: "Edita planes (nombre, precio MXN/USD, features, límites) y ajustes (site_name, free_limits, calc_notice).",
            en: "Edit plans (name, MXN/USD price, features, limits) and settings (site_name, free_limits, calc_notice).",
          },
          {
            es: "Otorga owner/admin a quien necesite y rota passwords demo tras el seed en producción.",
            en: "Grant owner/admin to whoever needs it and rotate demo passwords after seeding production.",
          },
        ],
      },
      {
        title: { es: "Preparar staging y producción", en: "Prepare staging and production" },
        route: "/guia",
        steps: [
          {
            es: "Sigue /guia → pestaña Stripe por entorno: claves test vs live, endpoints y secretos whsec_... distintos.",
            en: "Follow /guia → Stripe tab per environment: test vs live keys, endpoints and distinct whsec_... secrets.",
          },
          {
            es: "Migra con DATABASE_URL del entorno (npx drizzle-kit push), haz seed una vez y pasa el smoke test.",
            en: "Migrate with that env's DATABASE_URL (npx drizzle-kit push), seed once and run the smoke test.",
          },
        ],
      },
    ],
    limits: [
      {
        es: "El poder conlleva backups: prod exige PG con PITR y secretos solo en el dashboard del hosting.",
        en: "Power requires backups: prod needs PG with PITR and secrets only in the hosting dashboard.",
      },
    ],
    verify: [
      {
        es: "Cambia un precio en /admin → /pricing lo refleja; cambia free_limits → el límite free cambia.",
        en: "Change a price in /admin → /pricing reflects it; change free_limits → the free limit changes.",
      },
    ],
  },
];
