export interface Place { name: string; country: string; lat: number; lon: number; tz: string }
export const PLACES: Place[] = [
  { name: "Mexicali, Baja California", country: "México", lat: 32.6393, lon: -115.4747, tz: "America/Tijuana" },
  { name: "Mérida, Yucatán", country: "México", lat: 20.9674, lon: -89.5926, tz: "America/Merida" },
  { name: "Ciudad de México", country: "México", lat: 19.4326, lon: -99.1332, tz: "America/Mexico_City" },
  { name: "Guadalajara", country: "México", lat: 20.6597, lon: -103.3496, tz: "America/Mexico_City" },
  { name: "Monterrey", country: "México", lat: 25.6866, lon: -100.3161, tz: "America/Mexico_City" },
  { name: "Cancún", country: "México", lat: 21.1619, lon: -86.8515, tz: "America/Cancun" },
  { name: "Tijuana", country: "México", lat: 32.5149, lon: -117.0382, tz: "America/Tijuana" },
  { name: "Madrid", country: "España", lat: 40.4168, lon: -3.7038, tz: "Europe/Madrid" },
  { name: "Barcelona", country: "España", lat: 41.3874, lon: 2.1686, tz: "Europe/Madrid" },
  { name: "Valencia", country: "España", lat: 39.4699, lon: -0.3763, tz: "Europe/Madrid" },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816, tz: "America/Buenos_Aires" },
  { name: "Bogotá", country: "Colombia", lat: 4.711, lon: -74.0721, tz: "America/Bogota" },
  { name: "Lima", country: "Perú", lat: -12.0464, lon: -77.0428, tz: "America/Lima" },
  { name: "Santiago", country: "Chile", lat: -33.4489, lon: -70.6693, tz: "America/Santiago" },
  { name: "Nueva York", country: "EE.UU.", lat: 40.7128, lon: -74.006, tz: "America/New_York" },
  { name: "Los Ángeles", country: "EE.UU.", lat: 34.0522, lon: -118.2437, tz: "America/Los_Angeles" },
  { name: "Londres", country: "Reino Unido", lat: 51.5074, lon: -0.1278, tz: "Europe/London" },
];

export function searchPlaces(q: string): Place[] {
  const s = q.trim().toLowerCase();
  if (!s) return PLACES.slice(0, 5);
  return PLACES.filter((p) => `${p.name} ${p.country}`.toLowerCase().includes(s)).slice(0, 6);
}
