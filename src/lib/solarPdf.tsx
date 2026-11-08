import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { signName, type Locale } from "./i18n";

const CLAY = "#A32E0C";
const INK = "#2B211B";
const MUTED = "#8A7A6E";
const CREAM = "#FFF6EA";
const DARK = "#2B211B";

const styles = StyleSheet.create({
  page: { backgroundColor: "#FFFDF7", color: INK, fontFamily: "Helvetica", padding: 0 },
  cover: { backgroundColor: DARK, color: "#FFF3E2", padding: 48, height: "100%" },
  brand: { fontSize: 11, letterSpacing: 3, color: "#E8A06A" },
  title: { fontSize: 34, marginTop: 18, lineHeight: 1.1, fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 12, marginTop: 12, color: "#E9D9C4", lineHeight: 1.6 },
  metaBox: { marginTop: 24, backgroundColor: "#3A2D24", borderRadius: 10, padding: 16 },
  metaRow: { fontSize: 10, color: "#F6E3C8", marginBottom: 4 },
  body: { padding: 40 },
  kicker: { fontSize: 9, letterSpacing: 2.5, color: CLAY, fontFamily: "Helvetica-Bold" },
  h1: { fontSize: 22, marginTop: 6, fontFamily: "Helvetica-Bold", lineHeight: 1.2 },
  h2: { fontSize: 15, marginTop: 18, fontFamily: "Helvetica-Bold", color: CLAY },
  p: { fontSize: 10.5, marginTop: 6, lineHeight: 1.65, color: INK },
  premiumBox: { marginTop: 10, backgroundColor: DARK, color: "#FFE8C8", borderRadius: 8, padding: 12, fontSize: 10, lineHeight: 1.6 },
  table: { marginTop: 10, borderWidth: 1, borderColor: "#E5D5BE", borderRadius: 6 },
  tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F0E2CC" },
  th: { flex: 1, fontSize: 8, padding: 6, color: MUTED, fontFamily: "Helvetica-Bold" },
  td: { flex: 1, fontSize: 9, padding: 6 },
  chip: { backgroundColor: CREAM, borderRadius: 6, padding: 8, marginTop: 6, fontSize: 9.5, lineHeight: 1.6 },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, fontSize: 8, color: MUTED, flexDirection: "row", justifyContent: "space-between" },
  badge: { fontSize: 9, backgroundColor: CLAY, color: "white", borderRadius: 10, padding: 4 },
});

export interface PdfChartInput {
  guestName: string;
  targetYear: number;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  returnPlace: string;
  returnMomentUtc: string;
  natalSunLongitude: number;
  ascSign: string;
  ascLongitude: number;
  mcLongitude: number;
  sunHouse: number;
  moonSign: string;
  moonHouse: number;
  houseSystem: string;
  placidusFallback?: boolean;
  stelliums: Array<{ kind: string; where: string; planets: string[]; count: number }>;
  aspects: Array<{ srPlanet: string; natalPlanet: string; aspect: string; orb: number }>;
  planetsReturn: Array<{ planet: string; longitude: number; sign: string; degreeInSign: number; house: number }>;
  texts: { ascTitle: string; ascShort: string; ascFull: string; ascPremium?: string; houseTitle: string; houseShort: string; houseFull: string; housePremium?: string; moon: string };
}

export function SolarPDF({ chart, locale, full }: { chart: PdfChartInput; locale: Locale; full: boolean }) {
  const es = locale === "es";
  const houseLabel =
    chart.houseSystem === "placidus"
      ? "Placidus"
      : chart.houseSystem === "whole"
        ? es ? "Signo Entero" : "Whole Sign"
        : es ? "Casas Iguales" : "Equal Houses";
  return (
    <Document
      title={es ? `Revolución Solar ${chart.targetYear} — ${chart.guestName}` : `Solar Return ${chart.targetYear} — ${chart.guestName}`}
      author="Carta Natal"
    >
      {/* Portada */}
      <Page size="A4" style={styles.page}>
        <View style={styles.cover}>
          <Text style={styles.brand}>CARTA NATAL · REVOLUCIÓN SOLAR</Text>
          <Text style={styles.title}>
            {es ? `Tu año ${chart.targetYear}` : `Your year ${chart.targetYear}`}{"\n"}
            {signName(chart.ascSign, locale)} · {es ? `Sol en Casa ${chart.sunHouse}` : `Sun in House ${chart.sunHouse}`}
          </Text>
          <Text style={styles.subtitle}>
            {es
              ? `Blueprint anual para ${chart.guestName}: Ascendente ${signName(chart.ascSign, locale)}, Luna en ${signName(chart.moonSign, locale)} y el escenario de tu Sol. Calculado con el retorno exacto del Sol a su grado natal.`
              : `Yearly blueprint for ${chart.guestName}: ${signName(chart.ascSign, locale)} Rising, Moon in ${signName(chart.moonSign, locale)} and your Sun's stage. Computed at the exact return of the Sun to its natal degree.`}
          </Text>
          <View style={styles.metaBox}>
            <Text style={styles.metaRow}>☉ {es ? "Retorno exacto (UTC)" : "Exact return (UTC)"}: {chart.returnMomentUtc}</Text>
            <Text style={styles.metaRow}>↑ ASC {chart.ascLongitude.toFixed(1)}° · MC {chart.mcLongitude.toFixed(1)}° · {es ? "Casas" : "Houses"}: {houseLabel}</Text>
            <Text style={styles.metaRow}>� birth {chart.birthDate} {chart.birthTime} — {chart.birthPlace}</Text>
            <Text style={styles.metaRow}>✦ birthday in {chart.returnPlace} · Sol natal {chart.natalSunLongitude.toFixed(2)}°</Text>
          </View>
          <Text style={{ ...styles.subtitle, marginTop: 20, fontSize: 10 }}>
            {es
              ? "No es un horóscopo genérico. Es tu mapa personal del año: tono (Ascendente), escenario (Casa del Sol), necesidad (Luna), foco (stelliums) y puentes (aspectos RS vs natal)."
              : "Not a generic horoscope. Your personal map of the year: tone (Rising), stage (Sun house), need (Moon), focus (stelliums) and bridges (SR vs natal aspects)."}
          </Text>
          {!full && (
            <Text style={{ marginTop: 16, fontSize: 10, color: "#FFD9A8" }}>
              {es ? "✨ Versión trial — desbloquea la lectura completa con Premium." : "✨ Trial version — unlock the full reading with Premium."}
            </Text>
          )}
        </View>
      </Page>

      {/* Ascendente + Casa del Sol */}
      <Page size="A4" style={styles.page}>
        <View style={styles.body}>
          <Text style={styles.kicker}>{es ? "TONO DEL AÑO · ASCENDENTE" : "TONE OF THE YEAR · RISING"}</Text>
          <Text style={styles.h1}>{chart.texts.ascTitle}</Text>
          <Text style={styles.p}>{chart.texts.ascShort}</Text>
          <Text style={styles.p}>{chart.texts.ascFull}</Text>
          <Text style={{ ...styles.kicker, marginTop: 16 }}>{es ? "ESCENARIO · CASA DEL SOL" : "STAGE · SUN HOUSE"}</Text>
          <Text style={styles.h1}>{chart.texts.houseTitle}</Text>
          <Text style={styles.p}>{chart.texts.houseShort}</Text>
          <Text style={styles.p}>{chart.texts.houseFull}</Text>
          {chart.placidusFallback && (
            <Text style={styles.chip}>
              {es
                ? "Nota Placidus: latitud extrema — se usó Casas Iguales como respaldo estable."
                : "Placidus note: extreme latitude — Equal Houses used as stable fallback."}
            </Text>
          )}
          <View style={styles.footer}>
            <Text>Carta Natal · {chart.targetYear}</Text>
            <Text>2</Text>
          </View>
        </View>
      </Page>

      {full ? (
        <>
          <Page size="A4" style={styles.page}>
            <View style={styles.body}>
              <Text style={styles.kicker}>{es ? "PREMIUM · PROFUNDIDAD" : "PREMIUM · DEPTH"}</Text>
              <Text style={styles.h1}>{es ? "Tu estrategia del año" : "Your yearly strategy"}</Text>
              {chart.texts.ascPremium && (
                <View>
                  <Text style={styles.h2}>↑ {es ? "Ascendente" : "Rising"}</Text>
                  <View style={styles.premiumBox}>
                    <Text>{chart.texts.ascPremium}</Text>
                  </View>
                </View>
              )}
              {chart.texts.housePremium && (
                <View>
                  <Text style={styles.h2}>☉ {es ? "Casa del Sol" : "Sun house"}</Text>
                  <Text style={styles.p}>{chart.texts.housePremium}</Text>
                </View>
              )}
              <Text style={styles.h2}>☽ Luna — {signName(chart.moonSign, locale)} · Casa {chart.moonHouse}</Text>
              <Text style={styles.p}>{chart.texts.moon}</Text>
              <Text style={styles.h2}>✦ Stelliums</Text>
              {chart.stelliums.length === 0 ? (
                <Text style={styles.p}>
                  {es ? "Sin stelliums: energía repartida. Equilibrio sobre obsesión." : "No stelliums: spread energy. Balance over obsession."}
                </Text>
              ) : (
                chart.stelliums.map((s, i) => (
                  <Text key={i} style={styles.chip}>
                    {s.count} planetas en {s.kind} {s.where}: {s.planets.join(", ")}
                  </Text>
                ))
              )}
              <View style={styles.footer}>
                <Text>Carta Natal · Premium</Text>
                <Text>3</Text>
              </View>
            </View>
          </Page>
          <Page size="A4" style={styles.page}>
            <View style={styles.body}>
              <Text style={styles.kicker}>{es ? "PUENTES RS VS NATAL · ASPECTOS" : "SR VS NATAL BRIDGES · ASPECTS"}</Text>
              <Text style={styles.h1}>{es ? "Cómo dialoga tu año con tu raíz" : "How your year talks to your roots"}</Text>
              {chart.aspects.map((a, i) => (
                <Text key={i} style={styles.chip}>
                  {a.srPlanet} (RS) en {a.aspect} a {a.natalPlanet} (natal) · orbe {a.orb}°
                </Text>
              ))}
              <Text style={styles.h2}>{es ? "Posiciones calculadas (RS)" : "Computed positions (SR)"}</Text>
              <View style={styles.table}>
                <View style={styles.tr}>
                  <Text style={styles.th}>Planeta</Text>
                  <Text style={styles.th}>Long.</Text>
                  <Text style={styles.th}>Signo</Text>
                  <Text style={styles.th}>Casa</Text>
                </View>
                {chart.planetsReturn.map((p) => (
                  <View key={p.planet} style={styles.tr}>
                    <Text style={styles.td}>{p.planet}</Text>
                    <Text style={styles.td}>{p.longitude.toFixed(2)}°</Text>
                    <Text style={styles.td}>{signName(p.sign, locale)} {p.degreeInSign.toFixed(1)}°</Text>
                    <Text style={styles.td}>{p.house}</Text>
                  </View>
                ))}
              </View>
              <Text style={{ ...styles.p, fontSize: 8.5, color: MUTED }}>
                {es
                  ? `Motor Meeus (precisión media) + casas ${houseLabel}. El retorno se busca minimizando |Sol tránsito − Sol natal|. Para rectificación profesional recomendamos Swiss Ephemeris.`
                  : `Meeus engine (mean precision) + ${houseLabel} houses. Return found by minimizing |transit Sun − natal Sun|. For professional rectification we recommend Swiss Ephemeris.`}
              </Text>
              <View style={styles.footer}>
                <Text>Carta Natal · {chart.targetYear} · {houseLabel}</Text>
                <Text>4</Text>
              </View>
            </View>
          </Page>
        </>
      ) : (
        <Page size="A4" style={styles.page}>
          <View style={styles.body}>
            <Text style={styles.kicker}>PREMIUM</Text>
            <Text style={styles.h1}>{es ? "Esto es solo el inicio…" : "This is just the beginning…"}</Text>
            <Text style={styles.p}>
              {es
                ? "La versión trial incluye Ascendente y Casa del Sol. Premium desbloquea: Luna emocional, stelliums, 8 aspectos RS vs natal, timeline de 12 meses y este PDF completo con diseño editorial."
                : "The trial includes Rising and Sun house. Premium unlocks: emotional Moon, stelliums, 8 SR vs natal aspects, 12-month timeline and this full editorial PDF."}
            </Text>
            <Text style={styles.chip}>👑 Celestial — $149 MXN/mes o $1,499 MXN/año (o USD). Pago seguro con Stripe.</Text>
            <View style={styles.footer}>
              <Text>Carta Natal · Trial</Text>
              <Text>3</Text>
            </View>
          </View>
        </Page>
      )}
    </Document>
  );
}
