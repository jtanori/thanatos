// i18n ES/EN — MXN default, currency switchable
// Cookie: locale=es|en, currency=MXN|USD

export type Locale = "es" | "en";
export type Currency = "MXN" | "USD";

export const LOCALES: Locale[] = ["es", "en"];
export const CURRENCIES: Currency[] = ["MXN", "USD"];

export const USD_MXN_RATE = 17.2; // demo rate, configurable in /admin settings

export function formatPrice(cents: number, currency: Currency, locale: Locale): string {
  const amount = cents / 100;
  try {
    return new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

type Dict = Record<string, string>;

const ES: Dict = {
  "nav.chart": "Mi Carta",
  "nav.library": "Biblioteca",
  "nav.architecture": "Arquitectura",
  "nav.pricing": "Precios",
  "nav.login": "Entrar",
  "nav.create": "Crear mi carta →",
  "nav.account": "Cuenta",
  "nav.logout": "Salir",
  "nav.admin": "Admin",
  "nav.editor": "Editor",
  "hero.kicker": "Tu revolución solar personalizada",
  "hero.title": "Descubre lo que el cielo dice sobre tu año.",
  "hero.sub":
    "Tu fecha, hora y lugar de nacimiento crean un mapa único. Calculamos el retorno exacto del Sol a su grado natal y te entregamos tu blueprint de 12 meses.",
  "hero.cta": "Calcular mi Revolución Solar",
  "hero.how": "Cómo lo construimos",
  "hero.trial": "✨ Gratis: lectura esencial",
  "hero.premium": "👑 Premium: lectura completa",
  "pricing.title": "Gratis para empezar. Premium para tu año completo.",
  "pricing.sub":
    "El plan gratuito es tu trial: 1 Revolución con lo esencial. Premium desbloquea la lectura profunda.",
  "pricing.free.cta": "Empezar gratis",
  "pricing.paid.cta": "Pagar con Stripe →",
  "pricing.demo": "Sin claves de Stripe: modo demo (te sube a Premium al instante para probar).",
  "pricing.secure": "Pago seguro con Stripe · Cancela cuando quieras · MXN por defecto",
  "onboarding houses": "Sistema de casas",
  "pdf.download": "Descargar PDF editorial ↓",
  "pdf.generating": "Generando PDF…",
  "houses.equal.name": "Casas Iguales (recomendado)",
  "houses.placidus.name": "Placidus (cuadrantes)",
  "houses.whole.name": "Signo Entero (Whole Sign)",
  "common.back": "← Atrás",
  "common.continue": "Continuar",
  "common.save": "Guardar",
  "map.title": "Ajusta con el mapa",
  "map.hint": "Busca una ciudad o toca el mapa. Arrastra el pin para afinar. La precisión de las casas depende de esto.",
  "map.search": "Buscar ciudad… (geocodificación real vía OpenStreetMap)",
  "map.lat": "Lat",
  "map.lon": "Lon",
  "placidus.what": "¿Qué es Placidus?",
};

const EN: Dict = {
  "nav.chart": "My Chart",
  "nav.library": "Library",
  "nav.architecture": "Architecture",
  "nav.pricing": "Pricing",
  "nav.login": "Log in",
  "nav.create": "Create my chart →",
  "nav.account": "Account",
  "nav.logout": "Sign out",
  "nav.admin": "Admin",
  "nav.editor": "Editor",
  "hero.kicker": "Your personalized solar return",
  "hero.title": "Discover what the sky says about your year.",
  "hero.sub":
    "Your birth date, time and place create a unique map. We compute the exact return of the Sun to its natal degree and deliver your 12-month blueprint.",
  "hero.cta": "Calculate my Solar Return",
  "hero.how": "How we built it",
  "hero.trial": "✨ Free: essential reading",
  "hero.premium": "👑 Premium: full reading",
  "pricing.title": "Free to start. Premium for your full year.",
  "pricing.sub": "The free plan is your trial: 1 Return with the essentials. Premium unlocks the deep reading.",
  "pricing.free.cta": "Start free",
  "pricing.paid.cta": "Pay with Stripe →",
  "pricing.demo": "No Stripe keys: demo mode (upgrades you to Premium instantly for testing).",
  "pricing.secure": "Secure payment with Stripe · Cancel anytime · MXN by default",
  "onboarding houses": "House system",
  "pdf.download": "Download editorial PDF ↓",
  "pdf.generating": "Generating PDF…",
  "houses.equal.name": "Equal Houses (recommended)",
  "houses.placidus.name": "Placidus (quadrant)",
  "houses.whole.name": "Whole Sign",
  "common.back": "← Back",
  "common.continue": "Continue",
  "common.save": "Save",
  "map.title": "Fine-tune with the map",
  "map.hint": "Search a city or tap the map. Drag the pin to refine. House accuracy depends on this.",
  "map.search": "Search city… (real geocoding via OpenStreetMap)",
  "map.lat": "Lat",
  "map.lon": "Lon",
  "placidus.what": "What is Placidus?",
};

export const DICTS: Record<Locale, Dict> = { es: ES, en: EN };

export function t(locale: Locale, key: string): string {
  return DICTS[locale]?.[key] ?? DICTS.es[key] ?? key;
}

export function getLocaleFromCookies(cookieHeader: string | null): Locale {
  if (!cookieHeader) return "es";
  const m = cookieHeader.match(/(?:^|;\s*)locale=(es|en)/);
  return (m?.[1] as Locale) ?? "es";
}

export function getCurrencyFromCookies(cookieHeader: string | null): Currency {
  if (!cookieHeader) return "MXN";
  const m = cookieHeader.match(/(?:^|;\s*)currency=(MXN|USD)/);
  return (m?.[1] as Currency) ?? "MXN";
}

// ---- Contenido editorial EN (fallback para PDF/lectura bilingüe) ----
export const SIGNS_EN = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export function signName(signEs: string, locale: Locale): string {
  if (locale === "es") return signEs;
  const idx = [
    "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
    "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis",
  ].indexOf(signEs);
  return idx >= 0 ? SIGNS_EN[idx] : signEs;
}
