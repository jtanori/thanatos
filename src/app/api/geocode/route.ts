import { NextResponse } from "next/server";
import { PLACES } from "@/lib/places";

export const dynamic = "force-dynamic";

// Geocodificación real vía Nominatim (OpenStreetMap, sin API key).
// Proxy server-side para no exponer User-Agent ni CORS al cliente.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&addressdetails=1&accept-language=es&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "CartaNatal-SolarReturn/1.0 (contacto@carta.natal)",
        Referer: "https://carta.natal/",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`nominatim ${res.status}`);
    const data = (await res.json()) as Array<{
      display_name: string;
      lat: string;
      lon: string;
      type?: string;
      class?: string;
      address?: Record<string, string>;
    }>;
    const results = data.slice(0, 6).map((d) => ({
      name: d.display_name.split(",").slice(0, 2).join(","),
      full: d.display_name,
      lat: Number(d.lat),
      lon: Number(d.lon),
      source: "osm" as const,
    }));
    if (results.length > 0) return NextResponse.json({ results, source: "osm" });
  } catch (e) {
    console.warn("geocode osm fallback", e);
  }
  // Fallback local
  const s = q.toLowerCase();
  const local = PLACES.filter((p) =>
    `${p.name} ${p.country}`.toLowerCase().includes(s)
  )
    .slice(0, 6)
    .map((p) => ({ name: p.name, full: `${p.name}, ${p.country}`, lat: p.lat, lon: p.lon, source: "local" as const }));
  return NextResponse.json({ results: local, source: "local" });
}
