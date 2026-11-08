import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { solarCharts, interpretations } from "@/db/schema";
import { getSessionUser, isPremiumUser } from "@/lib/auth";
import { getAscFallback, getHouseFallback, MOON_CONTENT } from "@/lib/content";
import { getLocaleFromCookies, signName, type Locale } from "@/lib/i18n";
import ChartWheel from "@/components/ChartWheel";
import PdfButton from "@/components/PdfButton";

export const dynamic = "force-dynamic";

function fmtUtc(d: Date) {
  return new Date(d).toUTCString().replace("GMT", "UTC");
}

export default async function Revolucion({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const h = await headers();
  const locale: Locale = getLocaleFromCookies(h.get("cookie"));
  const es = locale === "es";
  const rows = await db.select().from(solarCharts).where(eq(solarCharts.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const chart = rows[0];
  const user = await getSessionUser().catch(() => null);
  const premium = isPremiumUser(user) || user?.role === "owner" || user?.role === "admin" || user?.role === "editor";

  const interpRows = await db.select().from(interpretations).limit(200).catch(() => []);
  const find = (cat: string, key: string) => interpRows.find((r) => r.category === cat && r.key === key);

  const ascDb = find("ascendant", `ASC_${chart.ascSign.toUpperCase()}`);
  const ascFb = getAscFallback(chart.ascSign);
  const houseDb = find("sun_house", `SUN_HOUSE_${chart.sunHouse}`);
  const houseFb = getHouseFallback(chart.sunHouse);
  const moonDb = find("moon", `MOON_${chart.moonSign.toUpperCase()}`);
  const moonTxt = moonDb?.contentFull ?? MOON_CONTENT[chart.moonSign] ?? "";

  const planetsReturn = (chart.planetsReturn as Array<{ planet: string; longitude: number; sign: string; house: number; degreeInSign: number }>) ?? [];
  const aspects = (chart.aspects as Array<{ srPlanet: string; natalPlanet: string; aspect: string; orb: number }>) ?? [];
  const stelliums = (chart.stelliums as Array<{ kind: string; where: string; planets: string[]; count: number }>) ?? [];
  const houseSystem = chart.houseSystem ?? "equal";
  const houses = (chart.houses as number[]) ?? [];

  return (
    <main className="bg-[#fff8f1]">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Link href="/dashboard" className="text-sm text-[#8a7a6e] hover:text-[#a32e0c]">{es ? "← Mis cartas" : "← My charts"}</Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-serif-display text-4xl md:text-5xl">{es ? "Revolución Solar" : "Solar Return"} {chart.targetYear}</h1>
          {premium ? <span className="rounded-full bg-[#2b211b] px-3 py-1 text-xs font-bold text-white">👑 PREMIUM</span> : <span className="rounded-full bg-[#f6e8d7] px-3 py-1 text-xs font-bold text-[#a32e0c]">✨ {es ? "GRATIS · trial" : "FREE · trial"}</span>}
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#5b4d42] shadow-sm">🏠 {houseSystem}{houseSystem === "placidus" ? " · " + (es ? "cuadrantes desiguales" : "unequal quadrants") : ""}</span>
        </div>
        <p className="mt-2 text-[#6b5d51]">
          {chart.guestName} · {chart.birthDate} {chart.birthTime} {es ? "en" : "in"} {chart.birthPlace} · {es ? "cumpleaños en" : "birthday in"} {chart.returnPlace}
        </p>
        <p className="mt-1 text-sm text-[#6b5d51]">{es ? "Retorno exacto" : "Exact return"}: <b>{fmtUtc(new Date(chart.returnMomentUtc))}</b> · Sol natal {Number(chart.natalSunLongitude).toFixed(2)}°</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <PdfButton id={chart.id} locale={locale} premium={premium} />
          <Link href={`/api/charts/${chart.id}/pdf?locale=${locale}`} className="rounded-full border border-[#a32e0c]/30 px-4 py-2 text-sm text-[#5b4d42]">
            {es ? "Abrir en pestaña ↗" : "Open in tab ↗"}
          </Link>
          {!premium && <Link href="/pricing" className="rounded-full bg-[#2b211b] px-4 py-2 text-sm font-bold text-white">{es ? "👑 Premium: PDF completo + Luna + aspectos" : "👑 Premium: full PDF + Moon + aspects"}</Link>}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="card-soft rounded-3xl p-6 text-center">
            <ChartWheel ascLon={Number(chart.ascLongitude)} planets={planetsReturn.map((p) => ({ planet: p.planet, longitude: p.longitude }))} size={360} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-2xl bg-[#fff6ea] p-3"><div className="text-xs uppercase text-[#8a7a6e]">Asc RS</div><b>{signName(chart.ascSign, locale)}</b><div className="text-xs">{Number(chart.ascLongitude).toFixed(1)}°</div></div>
              <div className="rounded-2xl bg-[#fff6ea] p-3"><div className="text-xs uppercase text-[#8a7a6e]">{es ? "Sol en" : "Sun in"}</div><b>{es ? "Casa" : "House"} {chart.sunHouse}</b><div className="text-xs">MC {Number(chart.mcLongitude).toFixed(1)}°</div></div>
              <div className="rounded-2xl bg-[#fff6ea] p-3"><div className="text-xs uppercase text-[#8a7a6e]">{es ? "Luna en" : "Moon in"}</div><b>{signName(chart.moonSign, locale)}</b><div className="text-xs">{es ? "Casa" : "House"} {chart.moonHouse}</div></div>
            </div>
            {houses.length === 12 && (
              <div className="mt-3 grid grid-cols-4 gap-1 text-[11px]">
                {houses.map((c, i) => <div key={i} className="rounded-lg bg-white px-1 py-1">H{i + 1} {Number(c).toFixed(0)}°</div>)}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a32e0c]">{es ? "Tono del año · Ascendente" : "Tone · Rising"}</p>
              <h2 className="font-serif-display mt-2 text-2xl">{ascDb?.title ?? ascFb.title}</h2>
              <p className="mt-3 leading-relaxed text-[#3d332c]">{ascDb?.contentShort ?? ascFb.short}</p>
              <p className="mt-3 leading-relaxed text-[#5b4d42]">{ascDb?.contentFull ?? ascFb.full}</p>
              {premium ? <p className="mt-3 rounded-2xl bg-[#2b211b] p-4 text-sm leading-relaxed text-[#ffe8c8]">👑 {ascDb?.contentPremium ?? ascFb.premium}</p>
                : <div className="mt-3"><p className="blur-lock rounded-2xl bg-[#f6e8d7] p-4 text-sm">{ascFb.premium}</p><Link href="/pricing" className="btn-clay mt-3 inline-block rounded-full px-5 py-2 text-sm font-semibold">Premium →</Link></div>}
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a32e0c]">{es ? "Escenario · Casa del Sol" : "Stage · Sun house"} ({houseSystem})</p>
              <h2 className="font-serif-display mt-2 text-2xl">{houseDb?.title ?? houseFb.title}</h2>
              <p className="mt-3 text-[#3d332c]">{houseDb?.contentShort ?? houseFb.short}</p>
              <p className="mt-2 text-[#5b4d42]">{houseDb?.contentFull ?? houseFb.full}</p>
              {premium ? <p className="mt-3 rounded-2xl bg-[#fff6ea] p-4 text-sm">👑 {houseDb?.contentPremium ?? houseFb.premium}</p>
                : <div className="mt-3"><p className="blur-lock rounded-2xl bg-[#f6e8d7] p-4 text-sm">{houseFb.premium}</p></div>}
            </section>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a32e0c]">Luna</p>
            <h3 className="font-serif-display mt-2 text-2xl">{signName(chart.moonSign, locale)} · {es ? "Casa" : "House"} {chart.moonHouse}</h3>
            {premium ? <p className="mt-3 leading-relaxed">{moonTxt}</p>
              : <div><p className="blur-lock mt-3">{moonTxt}</p><Link href="/pricing" className="btn-clay mt-3 inline-block rounded-full px-5 py-2 text-sm font-semibold">Premium →</Link></div>}
          </section>
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a32e0c]">Stelliums</p>
            {stelliums.length === 0 ? <p className="mt-3 text-[#5b4d42]">{es ? "Sin stelliums: energía repartida." : "No stelliums: spread energy."}</p>
              : <ul className="mt-3 space-y-2">{stelliums.map((s, i) => <li key={i} className="rounded-2xl bg-[#fff6ea] p-3 text-sm"><b>{s.count} planetas en {s.kind} {s.where}:</b> {s.planets.join(", ")}</li>)}</ul>}
          </section>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a32e0c]">{es ? "Aspectos RS vs Natal" : "SR vs Natal aspects"}</p>
          {premium ? (
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {aspects.map((a, i) => <div key={i} className="rounded-2xl bg-[#fff6ea] p-3 text-sm"><b>{a.srPlanet} (RS) en {a.aspect} a {a.natalPlanet} (natal)</b> · orbe {a.orb}°</div>)}
            </div>
          ) : (
            <div className="mt-4"><div className="blur-lock grid gap-2 md:grid-cols-2">{aspects.slice(0, 4).map((a, i) => <div key={i} className="rounded-2xl bg-[#fff6ea] p-3 text-sm"><b>{a.srPlanet} en {a.aspect} a {a.natalPlanet}</b></div>)}</div>
              <Link href="/pricing" className="btn-clay mt-4 inline-block rounded-full px-6 py-2 text-sm font-semibold">Premium →</Link></div>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a32e0c]">{es ? "Posiciones" : "Positions"}</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[#8a7a6e]"><th className="p-2">Planeta</th><th className="p-2">Longitud</th><th className="p-2">Signo</th><th className="p-2">Casa ({houseSystem})</th></tr></thead>
              <tbody>{planetsReturn.map((p) => <tr key={p.planet} className="border-t border-[#a32e0c]/10"><td className="p-2 font-semibold">{p.planet}</td><td className="p-2">{Number(p.longitude).toFixed(2)}°</td><td className="p-2">{signName(p.sign, locale)} {Number(p.degreeInSign).toFixed(1)}°</td><td className="p-2">{p.house}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#8a7a6e]">
            {es
              ? `Motor Meeus + casas ${houseSystem} (Placidus por arco semidiurno simplificado; a |lat|>66° usa Iguales como respaldo). El retorno minimiza |Sol tránsito − Sol natal|.`
              : `Meeus engine + ${houseSystem} houses (simplified Placidus by semiarc; Equal fallback beyond |lat|>66°). Return minimizes |transit Sun − natal Sun|.`}
          </p>
        </section>
      </div>
    </main>
  );
}
