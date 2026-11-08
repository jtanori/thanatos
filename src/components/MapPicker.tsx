"use client";
import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

// Selector de mapa real con Leaflet + OpenStreetMap.
// Sin API key. Click para mover el pin, drag para afinar.
export default function MapPicker({
  lat,
  lon,
  onChange,
  locale = "es",
}: {
  lat: number;
  lon: number;
  onChange: (lat: number, lon: number) => void;
  locale?: Locale;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;
    let map: any = null;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (!divRef.current || cancelled) return;
      // Fix iconos por defecto (CDN)
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      map = L.map(divRef.current).setView([lat, lon], 6);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const marker = L.marker([lat, lon], { draggable: true, icon }).addTo(map);
      (markerRef as { current: unknown }).current = marker;
      (mapRef as { current: unknown }).current = map;
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        marker.setLatLng(e.latlng);
        onChangeRef.current(
          Math.round(e.latlng.lat * 10000) / 10000,
          Math.round(e.latlng.lng * 10000) / 10000
        );
      });
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        onChangeRef.current(Math.round(p.lat * 10000) / 10000, Math.round(p.lng * 10000) / 10000);
      });
    })();
    return () => {
      cancelled = true;
      try {
        (mapRef.current as { remove?: () => void } | null)?.remove?.();
      } catch { /* noop */ }
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincroniza vista cuando cambian props desde búsqueda
  useEffect(() => {
    const map = mapRef.current as { setView?: (c: [number, number], z: number) => void } | null;
    const marker = markerRef.current as { setLatLng?: (c: [number, number]) => void; getLatLng?: () => { lat: number; lng: number } } | null;
    if (map?.setView) {
      map.setView([lat, lon], 8);
      const cur = marker?.getLatLng?.();
      if (cur && Math.abs(cur.lat - lat) > 0.0001) marker?.setLatLng?.([lat, lon]);
    }
  }, [lat, lon]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">🗺️ {t(locale, "map.title")}</span>
        <span className="font-mono text-xs text-[#8a7a6e]">
          {t(locale, "map.lat")}: {lat.toFixed(4)} · {t(locale, "map.lon")}: {lon.toFixed(4)}
        </span>
      </div>
      <div ref={divRef} className="z-0 h-56 w-full overflow-hidden rounded-2xl border border-[#a32e0c]/20" />
      <p className="mt-2 text-xs text-[#8a7a6e]">{t(locale, "map.hint")}</p>
    </div>
  );
}
