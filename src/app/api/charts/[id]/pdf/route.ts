import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { db } from "@/db";
import { solarCharts, interpretations } from "@/db/schema";
import { getSessionUser, isPremiumUser } from "@/lib/auth";
import { getAscFallback, getHouseFallback, MOON_CONTENT } from "@/lib/content";
import { SolarPDF } from "@/lib/solarPdf";
import { getLocaleFromCookies } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const rows = await db.select().from(solarCharts).where(eq(solarCharts.id, id)).limit(1);
  if (rows.length === 0) return NextResponse.json({ error: "No encontrada." }, { status: 404 });
  const chart = rows[0];
  const user = await getSessionUser().catch(() => null);
  const premium =
    isPremiumUser(user) || user?.role === "owner" || user?.role === "admin" || user?.role === "editor";
  const cookie = req.headers.get("cookie");
  const url = new URL(req.url);
  const qLocale = url.searchParams.get("locale");
  const locale = qLocale === "en" || qLocale === "es" ? qLocale : getLocaleFromCookies(cookie);

  const interpRows = await db.select().from(interpretations).limit(200).catch(() => []);
  const find = (cat: string, key: string) => interpRows.find((r) => r.category === cat && r.key === key);
  const ascDb = find("ascendant", `ASC_${chart.ascSign.toUpperCase()}`);
  const ascFb = getAscFallback(chart.ascSign);
  const houseDb = find("sun_house", `SUN_HOUSE_${chart.sunHouse}`);
  const houseFb = getHouseFallback(chart.sunHouse);
  const moonDb = find("moon", `MOON_${chart.moonSign.toUpperCase()}`);

  const input = {
    guestName: chart.guestName ?? "Viajera/o",
    targetYear: chart.targetYear,
    birthDate: chart.birthDate,
    birthTime: chart.birthTime,
    birthPlace: chart.birthPlace,
    returnPlace: chart.returnPlace,
    returnMomentUtc: new Date(chart.returnMomentUtc).toUTCString(),
    natalSunLongitude: Number(chart.natalSunLongitude),
    ascSign: chart.ascSign,
    ascLongitude: Number(chart.ascLongitude),
    mcLongitude: Number(chart.mcLongitude),
    sunHouse: chart.sunHouse,
    moonSign: chart.moonSign,
    moonHouse: chart.moonHouse,
    houseSystem: chart.houseSystem ?? "equal",
    stelliums: (chart.stelliums as Array<{ kind: string; where: string; planets: string[]; count: number }>) ?? [],
    aspects: (chart.aspects as Array<{ srPlanet: string; natalPlanet: string; aspect: string; orb: number }>) ?? [],
    planetsReturn: (
      (chart.planetsReturn as Array<{ planet: string; longitude: number; sign: string; degreeInSign: number; house: number }>) ?? []
    ).map((p) => ({ ...p, longitude: Number(p.longitude), degreeInSign: Number(p.degreeInSign), house: Number(p.house) })),
    texts: {
      ascTitle: ascDb?.title ?? ascFb.title,
      ascShort: ascDb?.contentShort ?? ascFb.short,
      ascFull: ascDb?.contentFull ?? ascFb.full,
      ascPremium: ascDb?.contentPremium ?? ascFb.premium,
      houseTitle: houseDb?.title ?? houseFb.title,
      houseShort: houseDb?.contentShort ?? houseFb.short,
      houseFull: houseDb?.contentFull ?? houseFb.full,
      housePremium: houseDb?.contentPremium ?? houseFb.premium,
      moon: moonDb?.contentFull ?? MOON_CONTENT[chart.moonSign] ?? "",
    },
  };

  const full = premium;
  const el = React.createElement(SolarPDF, { chart: input, locale, full });
  const buf = (await (renderToBuffer as unknown as (e: unknown) => Promise<Buffer>)(el)) as Buffer;
  const body = new Uint8Array(buf);
  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="revolucion-solar-${chart.targetYear}-${full ? "completa" : "trial"}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
