import Link from "next/link";
import { headers } from "next/headers";
import ChartWheel from "@/components/ChartWheel";
import { getLocaleFromCookies, getCurrencyFromCookies, t, formatPrice } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Landing() {
  const h = await headers();
  const locale = getLocaleFromCookies(h.get("cookie"));
  const currency = getCurrencyFromCookies(h.get("cookie"));
  return (
    <main className="bg-[#fff8f1]">
      {/* HERO */}
      <section className="hero-desert relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="absolute text-[#e8a06a]" style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 45}%`,
              fontSize: `${10 + (i % 3) * 8}px`,
            }}>✦</span>
          ))}
          <div className="absolute right-[18%] top-[8%] text-7xl opacity-70">🪐</div>
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-36 pt-14 md:grid-cols-2 md:pt-20">
          <div>
            <p className="text-[12px] uppercase tracking-[0.22em] text-[#8a7a6e]">{t(locale, "hero.kicker")} · ES/EN · MXN/USD · PDF · Placidus</p>
            <h1 className="font-serif-display mt-4 text-5xl leading-[1.02] text-[#2b211b] md:text-6xl">
              {t(locale, "hero.title")}
            </h1>
            <p className="mt-5 max-w-md leading-relaxed text-[#6b5d51]">
              {t(locale, "hero.sub")}
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-[13px] text-[#5b4d42]">
              <span className="flex items-center gap-2">🧍 Personalizada para ti</span>
              <span className="flex items-center gap-2">🛰️ Cálculo astronómico preciso</span>
              <span className="flex items-center gap-2">🔒 Privacidad protegida</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/empezar" className="btn-clay rounded-full px-7 py-3 font-semibold">{t(locale, "hero.cta")}</Link>
              <Link href="/arquitectura" className="rounded-full border border-[#a32e0c] px-6 py-3 font-semibold text-[#a32e0c]">{t(locale, "hero.how")}</Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-[#f6e8d7] px-3 py-1 font-bold">🗺️ OpenStreetMap + 📍 {locale === "es" ? "mapa real" : "real map"}</span>
              <span className="rounded-full bg-[#2b211b] px-3 py-1 font-bold text-white">👑 {formatPrice(currency === "MXN" ? 14900 : 999, currency, locale)}/{locale === "es" ? "mes" : "mo"} · Stripe</span>
              <span className="rounded-full bg-white px-3 py-1 font-bold shadow-sm">🏠 Equal · Placidus · Whole</span>
              <span className="rounded-full bg-white px-3 py-1 font-bold shadow-sm">📄 PDF editorial</span>
            </div>
            <p className="mt-6 text-sm font-semibold text-[#5b7a8a]">No es un horóscopo convencional. Es tu mapa personal del año.</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="card-soft w-full max-w-[420px] rounded-3xl p-6 text-center">
              <ChartWheel ascLon={142} planets={[
                { planet: "Sol", longitude: 45 },
                { planet: "Luna", longitude: 210 },
                { planet: "Mercurio", longitude: 60 },
                { planet: "Venus", longitude: 30 },
                { planet: "Marte", longitude: 300 },
                { planet: "Júpiter", longitude: 150 },
                { planet: "Saturno", longitude: 320 },
              ]} size={300} />
              <p className="mt-4 font-semibold">Tu carta: Un mapa único, calculado con precisión astronómica.</p>
              <form action="/empezar" method="get" className="mt-4 space-y-3">
                <input name="nombre" type="text" autoComplete="name" placeholder="Escribe tu nombre para empezar" className="input-warm w-full rounded-2xl px-5 py-3 text-[15px]" />
                <button className="btn-clay w-full rounded-2xl py-3 font-semibold">Descubrir mi lectura preliminar</button>
              </form>
              <p className="mt-2 text-xs text-[#8a7a6e]">Te pediremos los detalles exactos en el siguiente paso.</p>
            </div>
          </div>
        </div>
        <div className="dune" />
      </section>

      {/* QUE REVELA */}
      <section id="como-funciona" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3">
        <div>
          <p className="text-[12px] uppercase tracking-[0.22em] text-[#8a7a6e]">No es solo tu signo</p>
          <h2 className="font-serif-display mt-3 text-4xl leading-tight">Tu Revolución revela mucho más.</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#6b5d51]">La posición exacta de los planetas en el retorno solar crea un mapa único de tu personalidad anual, tus relaciones y tu potencial.</p>
          <Link href="/empezar" className="mt-6 inline-block rounded-full border border-[#a32e0c] px-5 py-2 text-sm font-semibold text-[#a32e0c]">Ver un ejemplo de lectura →</Link>
        </div>
        <div className="flex justify-center">
          <ChartWheel ascLon={200} planets={[
            { planet: "Sol", longitude: 200 },
            { planet: "Luna", longitude: 90 },
            { planet: "Mercurio", longitude: 215 },
            { planet: "Venus", longitude: 180 },
            { planet: "Marte", longitude: 120 },
            { planet: "Júpiter", longitude: 250 },
            { planet: "Saturno", longitude: 300 },
          ]} size={320} />
        </div>
        <div className="space-y-6">
          {[
            ["☀️", "Tu personalidad anual", "Comprende el tono del Ascendente de Revolución y tu foco de identidad."],
            ["☽", "Tu mundo emocional", "Descubre cómo procesas lo que sientes y qué necesitas para sentirte bien según la Luna RS."],
            ["❤️", "Tus relaciones", "Explora aspectos RS vs natal: qué vínculos se activan y qué valoras en los demás."],
            ["⚡", "Tu potencial", "Identifica stelliums y la Casa del Sol: dónde concentrar tu energía este año."],
          ].map(([icon, t, d]) => (
            <div key={t} className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fdecd6] text-lg">{icon}</span>
              <div><div className="font-semibold">{t}</div><div className="text-sm text-[#6b5d51]">{d}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* EJEMPLO */}
      <section className="relative overflow-hidden bg-[#fdf1e0] py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2">
          <div>
            <p className="text-[12px] uppercase tracking-[0.22em] text-[#a32e0c]">Una lectura que habla de ti</p>
            <h2 className="font-serif-display mt-3 text-4xl md:text-5xl">Esto es lo que una Revolución puede revelar sobre ti.</h2>
            <p className="mt-4 text-[#6b5d51]">Cada interpretación conecta los elementos de tu carta para ofrecerte una visión profunda y personalizada.</p>
            <Link href="/empezar" className="btn-clay mt-6 inline-block rounded-2xl px-6 py-3 font-semibold">Explorar ejemplo →</Link>
          </div>
          <div className="card-soft grid overflow-hidden rounded-3xl md:grid-cols-2">
            <div className="p-6">
              <div className="font-serif-display text-xl">♉ Tu Sol en Tauro</div>
              <p className="mt-3 text-sm leading-relaxed text-[#5b4d42]">Tu naturaleza busca estabilidad, pero eso no significa que temas el cambio. Necesitas que aquello que construyes tenga valor y permanencia.</p>
              <p className="mt-3 text-sm leading-relaxed text-[#5b4d42]">Cuando algo realmente te importa, tu capacidad para mantenerte firme puede convertirse en una de tus mayores fortalezas.</p>
              <p className="mt-3 text-sm text-[#8a7a6e]">Esto puede manifestarse como:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="rounded-xl bg-[#f7ecdc] p-3">🌱 Constancia fértil en proyectos largos</li>
                <li className="rounded-xl bg-[#f7ecdc] p-3">💰 Enfoque en recursos que sostienen</li>
              </ul>
            </div>
            <div className="relative min-h-[320px] bg-gradient-to-b from-[#0f2233] to-[#4a6a7a] p-6 text-white">
              <div className="text-center text-6xl">♉</div>
              <div className="mt-2 text-center text-5xl">🐂</div>
              <div className="absolute inset-x-6 bottom-6 text-center text-xs opacity-80">Constelación de Tauro · Visualización simbólica</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif-display text-center text-3xl">Lo que dicen nuestros exploradores del cosmos</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["La lectura más precisa que he tenido. Me ayudó a entender mi año.", "Ana C., Madrid"],
            ["Nunca había leído algo que me describiera con tanta exactitud. Me sentí profundamente comprendida.", "Laura M., Barcelona"],
            ["Me dio claridad sobre patrones que llevaba años repitiendo. Totalmente recomendable.", "Carlos R., Valencia"],
          ].map(([q, a]) => (
            <div key={a} className="rounded-2xl border border-[#a32e0c]/10 bg-white p-6 shadow-sm">
              <div className="text-[#a32e0c]">☆ ☆ ☆ ☆ ☆</div>
              <p className="mt-3 text-[15px] font-medium">“{q}”</p>
              <p className="mt-4 text-sm text-[#8a7a6e]">👤 {a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fffdf7]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 md:grid-cols-2">
          <div>
            <h2 className="font-serif-display text-4xl md:text-5xl">Tu carta es única.<br />Descubre por qué.</h2>
            <p className="mt-4 text-[#6b5d51]">Crea tu Revolución Solar personalizada y empieza a explorar el mapa que te acompaña desde tu cumpleaños.</p>
          </div>
          <div className="text-center">
            <Link href="/empezar" className="btn-clay inline-block w-full max-w-md rounded-2xl py-4 font-semibold">Crear mi carta →</Link>
            <p className="mt-2 text-sm text-[#8a7a6e]">Solo necesitas tu fecha, hora y lugar de nacimiento.</p>
            <div className="mt-4 flex justify-center gap-3 text-sm">
              <Link href="/pricing" className="rounded-full bg-[#f6e8d7] px-4 py-2 font-semibold">✨ Gratis: lectura esencial</Link>
              <Link href="/pricing" className="rounded-full bg-[#2b211b] px-4 py-2 font-semibold text-white">👑 Premium: lectura completa</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
