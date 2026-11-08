import { NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/db";
import { solarCharts, users, plans } from "@/db/schema";
import { getSessionUser, isPremiumUser } from "@/lib/auth";
import { calculateRevolution, localToUtc, signFromLongitude } from "@/lib/astro";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      guestName, birthDate, birthTime, birthPlace, birthLat, birthLon, birthTimezone,
      returnPlace, returnLat, returnLon, targetYear, houseSystem,
    } = body as Record<string, string | number>;
    const hs = (["equal", "placidus", "whole"] as const).includes((houseSystem as string) as "equal") ? (houseSystem as "equal" | "placidus" | "whole") : "equal";

    if (!birthDate || !birthTime || !birthLat || !birthLon || !targetYear) {
      return NextResponse.json({ error: "Faltan datos: fecha, hora, coordenadas y año son obligatorios." }, { status: 400 });
    }
    const y = Number(targetYear);
    if (!Number.isFinite(y) || y < 1900 || y > 2100) return NextResponse.json({ error: "Año inválido." }, { status: 400 });

    const tz = (birthTimezone as string) || "America/Mexico_City";
    const { utc: birthUtc, month, day } = localToUtc(String(birthDate), String(birthTime), tz);

    const result = calculateRevolution({
      birthUtc,
      birthLat: Number(birthLat),
      birthLon: Number(birthLon),
      returnLat: Number(returnLat ?? birthLat),
      returnLon: Number(returnLon ?? birthLon),
      targetYear: y,
      birthMonth: month,
      birthDay: day,
      houseSystem: hs,
    });

    const moonSignInfo = signFromLongitude(result.planetsReturn.find((p) => p.planet === "Luna")!.longitude);
    void moonSignInfo;

    const user = await getSessionUser().catch(() => null);

    // Límite free: 1 carta (si es usuario free). Owner/admin/premium ilimitado.
    if (user && !isPremiumUser(user) && user.role === "user") {
      const existing = await db.select().from(solarCharts).where(eq(solarCharts.userId, user.id)).limit(5);
      // permitimos recalcular mismo año (upsert), pero no más de 2 años distintos en free
      const years = new Set(existing.map((c) => c.targetYear));
      if (!years.has(y) && years.size >= 1) {
        return NextResponse.json({ error: "Tu plan gratuito incluye 1 Revolución Solar. Pasa a Premium para años ilimitados.", upgrade: true }, { status: 402 });
      }
      // si ya existe ese año, la actualizamos
      const same = existing.find((c) => c.targetYear === y);
      if (same) {
        const updated = await db
          .update(solarCharts)
          .set({
            birthDate: String(birthDate),
            birthTime: String(birthTime),
            birthPlace: String(birthPlace ?? ""),
            birthLat: Number(birthLat),
            birthLon: Number(birthLon),
            birthTimezone: tz,
            returnPlace: String(returnPlace ?? birthPlace ?? ""),
            returnLat: Number(returnLat ?? birthLat),
            returnLon: Number(returnLon ?? birthLon),
            houseSystem: hs,
            natalSunLongitude: result.natalSunLongitude,
            returnMomentUtc: result.returnMomentUtc,
            ascLongitude: result.ascLongitude,
            ascSign: result.ascSign,
            mcLongitude: result.mcLongitude,
            sunHouse: result.sunHouse,
            moonSign: result.moonSign,
            moonHouse: result.moonHouse,
            stelliums: result.stelliums,
            planetsNatal: result.planetsNatal,
            planetsReturn: result.planetsReturn,
            houses: result.houses,
            aspects: result.aspects,
          })
          .where(eq(solarCharts.id, same.id))
          .returning();
        return NextResponse.json({ id: updated[0].id, updated: true });
      }
    }

    const inserted = await db
      .insert(solarCharts)
      .values({
        userId: user?.id ?? null,
        guestName: String(guestName ?? user?.name ?? "Invitado"),
        targetYear: y,
        birthDate: String(birthDate),
        birthTime: String(birthTime),
        birthPlace: String(birthPlace ?? ""),
        birthLat: Number(birthLat),
        birthLon: Number(birthLon),
        birthTimezone: tz,
        returnPlace: String(returnPlace ?? birthPlace ?? ""),
        returnLat: Number(returnLat ?? birthLat),
        returnLon: Number(returnLon ?? birthLon),
        houseSystem: hs,
        natalSunLongitude: result.natalSunLongitude,
        returnMomentUtc: result.returnMomentUtc,
        ascLongitude: result.ascLongitude,
        ascSign: result.ascSign,
        mcLongitude: result.mcLongitude,
        sunHouse: result.sunHouse,
        moonSign: result.moonSign,
        moonHouse: result.moonHouse,
        stelliums: result.stelliums,
        planetsNatal: result.planetsNatal,
        planetsReturn: result.planetsReturn,
        houses: result.houses,
        aspects: result.aspects,
      })
      .returning();

    // Guarda perfil natal en usuario si está logueado
    if (user) {
      await db
        .update(users)
        .set({
          birthDate: String(birthDate),
          birthTime: String(birthTime),
          birthPlace: String(birthPlace ?? ""),
          birthLat: Number(birthLat),
          birthLon: Number(birthLon),
          birthTimezone: tz,
          returnPlace: String(returnPlace ?? ""),
          returnLat: Number(returnLat ?? birthLat),
          returnLon: Number(returnLon ?? birthLon),
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
    }

    return NextResponse.json({ id: inserted[0].id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "No se pudo calcular. Revisa los datos." }, { status: 500 });
  }
}

export async function GET() {
  const user = await getSessionUser().catch(() => null);
  if (!user) return NextResponse.json({ charts: [] });
  const rows = await db.select().from(solarCharts).where(eq(solarCharts.userId, user.id)).orderBy(desc(solarCharts.targetYear));
  return NextResponse.json({ charts: rows });
}
