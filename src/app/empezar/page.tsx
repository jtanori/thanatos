"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { PLACES, searchPlaces } from "@/lib/places";
import type { HouseSystem } from "@/lib/astro";
import { HOUSE_SYSTEMS } from "@/lib/astro";
import type { Locale } from "@/lib/i18n";

const TOTAL = 7;

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

interface GeoResult { name: string; full: string; lat: number; lon: number; source: string }

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export default function Empezar() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-6xl px-5 py-20">Cargando tu cielo… / Loading your sky…</main>}>
      <EmpezarInner />
    </Suspense>
  );
}

function EmpezarInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialName = params.get("nombre") ?? "";
  const [locale, setLocale] = useState<Locale>("es");
  useEffect(() => {
    const c = getCookie("locale");
    if (c === "en" || c === "es") setLocale(c);
  }, []);
  const es = locale === "es";

  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState(initialName);
  const [dia, setDia] = useState("16");
  const [mes, setMes] = useState("05");
  const [anio, setAnio] = useState("1984");
  const [hora, setHora] = useState("01");
  const [min, setMin] = useState("00");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const [tz, setTz] = useState("America/Mexico_City");

  // Lugares: búsqueda local + geocodificación real (OSM)
  const [birthQ, setBirthQ] = useState("Mexicali");
  const [birthName, setBirthName] = useState(PLACES[0].name);
  const [birthLat, setBirthLat] = useState(PLACES[0].lat);
  const [birthLon, setBirthLon] = useState(PLACES[0].lon);
  const [birthGeo, setBirthGeo] = useState<GeoResult[]>([]);
  const [birthLoading, setBirthLoading] = useState(false);

  const [returnQ, setReturnQ] = useState("");
  const [returnName, setReturnName] = useState<string | null>(null);
  const [returnLat, setReturnLat] = useState<number | null>(null);
  const [returnLon, setReturnLon] = useState<number | null>(null);
  const [returnGeo, setReturnGeo] = useState<GeoResult[]>([]);

  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear() + 1);
  const [houseSystem, setHouseSystem] = useState<HouseSystem>("equal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const localBirth = useMemo(() => searchPlaces(birthQ), [birthQ]);
  const effReturnLat = returnLat ?? birthLat;
  const effReturnLon = returnLon ?? birthLon;
  const effReturnName = returnName ?? birthName;

  // Debounced geocode
  useEffect(() => {
    if (birthQ.trim().length < 3) { setBirthGeo([]); return; }
    setBirthLoading(true);
    const id = setTimeout(async () => {
      try {
        const r = await fetch(`/api/geocode?q=${encodeURIComponent(birthQ)}`);
        const d = await r.json();
        setBirthGeo(d.results ?? []);
      } catch { /* noop */ } finally { setBirthLoading(false); }
    }, 450);
    return () => clearTimeout(id);
  }, [birthQ]);

  useEffect(() => {
    if (returnQ.trim().length < 3) { setReturnGeo([]); return; }
    const id = setTimeout(async () => {
      try {
        const r = await fetch(`/api/geocode?q=${encodeURIComponent(returnQ)}`);
        const d = await r.json();
        setReturnGeo(d.results ?? []);
      } catch { /* noop */ }
    }, 450);
    return () => clearTimeout(id);
  }, [returnQ]);

  const birthDateStr = `${anio.padStart(4, "0")}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  const h24 = (() => {
    let h = parseInt(hora || "1", 10);
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${min.padStart(2, "0")}`;
  })();

  async function generar() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/charts/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: nombre || "Jaime",
          birthDate: birthDateStr,
          birthTime: h24,
          birthPlace: birthName,
          birthLat, birthLon,
          birthTimezone: tz,
          returnPlace: effReturnName,
          returnLat: effReturnLat,
          returnLon: effReturnLon,
          targetYear,
          houseSystem,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.upgrade) { router.push("/pricing"); return; }
        throw new Error(data.error || "No se pudo calcular");
      }
      router.push(`/revolucion/${data.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  const titles: Record<number, [string, string]> = {
    1: [es ? `Hola, ${nombre || "viajera/o"}.` : `Hello, ${nombre || "traveler"}.`, es ? "Antes de descubrir tu Revolución, vamos a reconstruir el cielo exactamente como era cuando naciste." : "Before your Return, let's rebuild the sky exactly as it was when you were born."],
    2: [es ? "¿Cuándo naciste?" : "When were you born?", es ? "La fecha será el punto de partida de tu mapa astral." : "Your date is the starting point of your astral map."],
    3: [es ? "¿A qué hora?" : "At what time?", es ? "La precisión del cielo depende de los minutos exactos de tu llegada." : "Sky precision depends on the exact minutes of your arrival."],
    4: [es ? "¿Dónde naciste?" : "Where were you born?", es ? "Busca tu ciudad (geocodificación real) y afina con el mapa." : "Search your city (real geocoding) and fine-tune with the map."],
    5: [es ? "¿Qué año quieres explorar?" : "Which year to explore?", es ? "Elegimos el año + dónde pasarás tu cumpleaños (cambia las casas) + tu sistema de casas." : "We pick the year + where you'll spend your birthday (changes houses) + your house system."],
    6: [es ? "Sistema de casas" : "House system", es ? "¿Qué es Placidus? El sistema de casas más usado en astrología occidental: casas desiguales por horas temporales. Iguales = 30° estables. Signo Entero = un signo por casa." : "What is Placidus? The most used house system in Western astrology: unequal houses by temporal hours. Equal = stable 30°. Whole Sign = one sign per house."],
    7: [es ? "¿Todo está listo?" : "All set?", es ? "Tu mapa personal está preparado para ser revelado." : "Your personal map is ready to be revealed."],
  };

  return (
    <main className="hero-desert relative min-h-[92vh] overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 pb-32 pt-10 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="text-sm text-[#8a7a6e] hover:text-[#a32e0c]">{es ? "← Atrás" : "← Back"}</button>
            <div className="flex gap-1 text-xs">
              {(["es", "en"] as Locale[]).map((l) => (
                <button key={l} onClick={() => { setLocale(l); document.cookie = `locale=${l}; path=/; max-age=31536000`; }} className={`rounded-full px-2 py-0.5 ${locale === l ? "bg-[#a32e0c] text-white" : "bg-white/70"}`}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <h1 className="font-serif-display mt-4 text-5xl text-[#a32e0c] md:text-6xl">{titles[step][0]}</h1>
          <p className="mt-4 text-xl leading-relaxed text-[#6b5d51]">{titles[step][1]}</p>
          {step === 6 && (
            <div className="mt-4 space-y-2">
              {HOUSE_SYSTEMS.map((h) => (
                <div key={h.id} className={`rounded-2xl border p-3 text-sm ${houseSystem === h.id ? "border-[#a32e0c] bg-white" : "bg-white/60"}`}>
                  <b>{h.id === "equal" ? (es ? "Casas Iguales" : "Equal") : h.id === "placidus" ? "Placidus" : es ? "Signo Entero" : "Whole Sign"}</b>
                  <span className="text-[#6b5d51]"> — {es ? h.es : h.en}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-soft rounded-[28px] p-6 md:p-8">
          {step === 1 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a7a6e]">✨ {es ? "Tu momento de origen" : "Your origin moment"}</p>
              <label className="mt-6 block text-sm font-semibold">{es ? "Tu nombre" : "Your name"}</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" name="name" autoComplete="name" placeholder="Ej. Jaime Tanori" className="input-warm mt-2 w-full rounded-2xl px-5 py-3" />
              <button onClick={() => setStep(2)} className="btn-clay mt-6 w-full rounded-2xl py-4 font-semibold">{es ? "Continuar" : "Continue"}</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><div className="text-xs font-bold text-[#8a7a6e]">{es ? "DÍA" : "DAY"}</div><input value={dia} onChange={(e) => setDia(e.target.value)} type="text" name="bday-day" autoComplete="bday-day" inputMode="numeric" className="input-warm mt-1 w-full rounded-2xl px-2 py-3 text-center text-2xl" /></div>
                <div><div className="text-xs font-bold text-[#8a7a6e]">{es ? "MES" : "MO"}</div><input value={mes} onChange={(e) => setMes(e.target.value)} type="text" name="bday-month" autoComplete="bday-month" inputMode="numeric" className="input-warm mt-1 w-full rounded-2xl px-2 py-3 text-center text-2xl" /></div>
                <div><div className="text-xs font-bold text-[#8a7a6e]">{es ? "AÑO" : "YR"}</div><input value={anio} onChange={(e) => setAnio(e.target.value)} type="text" name="bday-year" autoComplete="bday-year" inputMode="numeric" className="input-warm mt-1 w-full rounded-2xl px-2 py-3 text-center text-2xl" /></div>
              </div>
              <button onClick={() => setStep(3)} className="btn-clay mt-6 w-full rounded-2xl py-4 font-semibold">{es ? "Continuar" : "Continue"}</button>
              <button onClick={() => setStep(1)} className="mt-3 w-full py-2 text-sm text-[#8a7a6e]">{es ? "Atrás" : "Back"}</button>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="flex items-center justify-center gap-3">
                <div className="text-center"><input value={hora} onChange={(e) => setHora(e.target.value)} type="text" name="birth-hour" autoComplete="off" inputMode="numeric" className="input-warm w-24 rounded-2xl py-3 text-center text-2xl" /><div className="mt-1 text-xs text-[#8a7a6e]">h</div></div>
                <span className="text-2xl">:</span>
                <div className="text-center"><input value={min} onChange={(e) => setMin(e.target.value)} type="text" name="birth-minute" autoComplete="off" inputMode="numeric" className="input-warm w-24 rounded-2xl py-3 text-center text-2xl" /><div className="mt-1 text-xs text-[#8a7a6e]">min</div></div>
                <div className="flex flex-col gap-2">
                  {(["AM", "PM"] as const).map((v) => (
                    <button key={v} onClick={() => setAmpm(v)} className={`rounded-2xl px-5 py-2 font-bold ${ampm === v ? "bg-[#a32e0c] text-white" : "bg-[#f7ecdc]"}`}>{v}</button>
                  ))}
                </div>
              </div>
              <label className="mt-3 block text-sm">Timezone</label>
              <select value={tz} onChange={(e) => setTz(e.target.value)} className="input-warm mt-1 w-full rounded-2xl px-4 py-3">
                <option>America/Mexico_City</option><option>America/Merida</option><option>America/Cancun</option><option>America/Tijuana</option><option>America/Bogota</option><option>America/Buenos_Aires</option><option>Europe/Madrid</option><option>UTC</option>
              </select>
              <button onClick={() => setStep(4)} className="btn-clay mt-6 w-full rounded-2xl py-4 font-semibold">{es ? "Continuar" : "Continue"}</button>
              <button onClick={() => setStep(2)} className="mt-3 w-full py-2 text-sm text-[#8a7a6e]">{es ? "Atrás" : "Back"}</button>
            </div>
          )}
          {step === 4 && (
            <div>
              <label className="font-semibold">{es ? "Ciudad de nacimiento (búsqueda real)" : "Birth city (real search)"}</label>
              <input value={birthQ} onChange={(e) => setBirthQ(e.target.value)} type="search" name="birth-city-search" autoComplete="off" placeholder={es ? "Escribe ciudad y país…" : "Type city and country…"} className="input-warm mt-2 w-full rounded-2xl border border-[#a32e0c] px-5 py-3" />
              <div className="mt-2 max-h-44 space-y-1 overflow-y-auto">
                {birthLoading && <p className="text-xs text-[#8a7a6e]">…</p>}
                {birthGeo.map((g, i) => (
                  <button key={i} onClick={() => { setBirthName(g.name); setBirthLat(g.lat); setBirthLon(g.lon); }} className="w-full rounded-xl bg-white p-2 text-left text-sm hover:bg-[#fff6ea]">
                    📍 {g.full.slice(0, 80)} <span className="text-xs text-[#8a7a6e]">· {g.lat.toFixed(2)}, {g.lon.toFixed(2)} [{g.source}]</span>
                  </button>
                ))}
                {birthGeo.length === 0 && localBirth.slice(0, 3).map((p) => (
                  <button key={p.name} onClick={() => { setBirthName(p.name); setBirthLat(p.lat); setBirthLon(p.lon); setTz(p.tz); }} className="w-full rounded-xl bg-[#fffaf3] p-2 text-left text-sm">
                    📍 {p.name} <span className="text-xs text-[#8a7a6e]">· {p.lat.toFixed(2)}, {p.lon.toFixed(2)}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 rounded-2xl bg-[#fff6ea] p-3 text-sm">📍 <b>{birthName}</b> · {birthLat.toFixed(4)}, {birthLon.toFixed(4)}</div>
              <div className="mt-3"><MapPicker lat={birthLat} lon={birthLon} locale={locale} onChange={(la, lo) => { setBirthLat(la); setBirthLon(lo); }} /></div>
              <button onClick={() => setStep(5)} className="btn-clay mt-4 w-full rounded-2xl py-4 font-semibold">{es ? "Continuar" : "Continue"}</button>
              <button onClick={() => setStep(3)} className="mt-3 w-full py-2 text-sm text-[#8a7a6e]">{es ? "Atrás" : "Back"}</button>
            </div>
          )}
          {step === 5 && (
            <div>
              <label className="font-semibold">{es ? "Año a explorar" : "Year to explore"}</label>
              <select value={targetYear} onChange={(e) => setTargetYear(Number(e.target.value))} className="input-warm mt-2 w-full rounded-2xl px-5 py-3 text-lg">
                {[2025, 2026, 2027, 2028].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <label className="mt-4 block font-semibold">{es ? "¿Dónde pasarás tu cumpleaños?" : "Where will you spend your birthday?"}</label>
              <input value={returnQ} onChange={(e) => setReturnQ(e.target.value)} type="search" name="return-city-search" autoComplete="off" placeholder={birthName} className="input-warm mt-2 w-full rounded-2xl px-5 py-3" />
              <div className="mt-2 max-h-36 space-y-1 overflow-y-auto">
                <button onClick={() => { setReturnName(null); setReturnLat(null); setReturnLon(null); }} className="w-full rounded-xl border border-[#a32e0c] bg-[#fff6ea] p-2 text-left text-sm">📍 {es ? "Misma que nacimiento" : "Same as birth"}: {birthName}</button>
                {returnGeo.map((g, i) => (
                  <button key={i} onClick={() => { setReturnName(g.name); setReturnLat(g.lat); setReturnLon(g.lon); }} className="w-full rounded-xl bg-white p-2 text-left text-sm">📍 {g.full.slice(0, 80)}</button>
                ))}
              </div>
              <div className="mt-3"><MapPicker lat={effReturnLat} lon={effReturnLon} locale={locale} onChange={(la, lo) => { setReturnLat(la); setReturnLon(lo); setReturnName(`${la.toFixed(3)}, ${lo.toFixed(3)}`); }} /></div>
              <button onClick={() => setStep(6)} className="btn-clay mt-4 w-full rounded-2xl py-4 font-semibold">{es ? "Continuar" : "Continue"}</button>
              <button onClick={() => setStep(4)} className="mt-3 w-full py-2 text-sm text-[#8a7a6e]">{es ? "Atrás" : "Back"}</button>
            </div>
          )}
          {step === 6 && (
            <div>
              <label className="font-semibold">🏠 {es ? "Sistema de casas" : "House system"}</label>
              <div className="mt-2 space-y-2">
                {(["equal", "placidus", "whole"] as HouseSystem[]).map((id) => (
                  <button key={id} onClick={() => setHouseSystem(id)} className={`w-full rounded-2xl border p-3 text-left text-sm ${houseSystem === id ? "border-[#a32e0c] bg-[#fff6ea]" : "bg-white"}`}>
                    <b>{id === "equal" ? (es ? "Casas Iguales (recomendado)" : "Equal (recommended)") : id === "placidus" ? "Placidus" : es ? "Signo Entero" : "Whole Sign"}</b>
                    <span className="block text-xs text-[#6b5d51]">{id === "placidus" ? (es ? "Casas desiguales por horas temporales. Estándar moderno; puede variar la Casa del Sol." : "Unequal houses by temporal hours. Modern standard; may shift the Sun's house.") : id === "equal" ? (es ? "12 casas de 30° desde el ASC. Estable en todas las latitudes." : "Twelve 30° houses from ASC. Stable everywhere.") : (es ? "Un signo = una casa. Tradición helenística." : "One sign = one house. Hellenistic.")}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(7)} className="btn-clay mt-4 w-full rounded-2xl py-4 font-semibold">{es ? "Continuar" : "Continue"}</button>
              <button onClick={() => setStep(5)} className="mt-3 w-full py-2 text-sm text-[#8a7a6e]">{es ? "Atrás" : "Back"}</button>
            </div>
          )}
          {step === 7 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a7a6e]">✨ {es ? "Confirmar" : "Confirm"} · {nombre || "viajera/o"}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="rounded-2xl bg-[#fff6ea] p-3">📅 {dia}/{mes}/{anio} · {h24} · {tz}</div>
                <div className="rounded-2xl bg-[#fff6ea] p-3">📍 {birthName} · {birthLat.toFixed(3)}, {birthLon.toFixed(3)}</div>
                <div className="rounded-2xl bg-[#fff6ea] p-3">🎂 {targetYear} → {effReturnName} · {effReturnLat.toFixed(3)}, {effReturnLon.toFixed(3)}</div>
                <div className="rounded-2xl bg-[#2b211b] p-3 text-[#ffe8c8]">🏠 {houseSystem} · {es ? "la Casa del Sol puede variar según el sistema" : "the Sun's house may vary by system"}</div>
              </div>
              {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button onClick={generar} disabled={loading} className="btn-clay mt-4 w-full rounded-2xl py-4 font-semibold disabled:opacity-60">{loading ? "…" : `✨ ${es ? "Generar" : "Generate"} ${targetYear}`}</button>
              <button onClick={() => setStep(6)} className="mt-1 w-full py-2 text-sm text-[#8a7a6e]">{es ? "Atrás" : "Back"}</button>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 w-[320px] -translate-x-1/2">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/70"><div className="h-full rounded-full bg-[#a32e0c] transition-all" style={{ width: `${(step / TOTAL) * 100}%` }} /></div>
        <p className="mt-2 text-center text-sm text-[#6b7a8a]">{es ? `Paso ${step} de ${TOTAL}` : `Step ${step} of ${TOTAL}`} · {houseSystem} · OSM 🗺️</p>
      </div>
    </main>
  );
}
