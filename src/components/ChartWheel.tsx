"use client";
import { SIGN_GLYPHS, PLANET_GLYPHS } from "@/lib/astro";

export default function ChartWheel({
  ascLon,
  planets,
  size = 360,
}: {
  ascLon: number;
  planets: Array<{ planet: string; longitude: number }>;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 8;
  const rOuter = R;
  const rInner = R - 34;
  const rPlanet = R - 62;

  const polar = (lon: number, r: number) => {
    // 0° Aries a la izquierda (Asc a la izquierda): rotamos para que Asc quede a 180°
    const angle = ((lon - ascLon + 180) * Math.PI) / 180;
    // SVG: 0° = este, antihorario. Convertimos:
    const a = Math.PI - angle; // espejo para sentido zodiacal
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="chart-ring rounded-full border border-[#a32e0c]/20">
      <circle cx={cx} cy={cy} r={rOuter} fill="#fffdf7" stroke="#3a2d24" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={rInner} fill="none" stroke="#3a2d24" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={rPlanet + 18} fill="none" stroke="#a32e0c33" strokeWidth={1} strokeDasharray="3 4" />
      {/* 12 signos */}
      {Array.from({ length: 12 }).map((_, i) => {
        const lon = i * 30;
        const p1 = polar(lon, rOuter);
        const p2 = polar(lon, rInner);
        const mid = polar(lon + 15, rOuter - 17);
        return (
          <g key={i}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#3a2d24" strokeWidth={1} />
            <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="central" fontSize={15}>
              {SIGN_GLYPHS[i]}
            </text>
          </g>
        );
      })}
      {/* casas */}
      {Array.from({ length: 12 }).map((_, i) => {
        const c = polar(ascLon + i * 30, rInner);
        const o = polar(ascLon + i * 30, 26);
        return <line key={i} x1={c.x} y1={c.y} x2={o.x} y2={o.y} stroke="#a32e0c55" strokeWidth={0.8} />;
      })}
      {/* planetas */}
      {planets.map((p, idx) => {
        const pos = polar(p.longitude, rPlanet - (idx % 3) * 12);
        return (
          <g key={p.planet}>
            <circle cx={pos.x} cy={pos.y} r={13} fill="white" stroke="#a32e0c66" />
            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={13}>
              {PLANET_GLYPHS[p.planet] ?? p.planet[0]}
            </text>
            <text x={pos.x} y={pos.y + 22} textAnchor="middle" fontSize={8} fill="#5b4d42">
              {p.planet.slice(0, 3)}
            </text>
          </g>
        );
      })}
      {/* ASC marker */}
      {(() => {
        const a = polar(ascLon, rOuter + 2);
        return (
          <text x={a.x} y={a.y} fontSize={11} fontWeight={700} fill="#a32e0c" textAnchor="middle">
            ASC
          </text>
        );
      })()}
      <circle cx={cx} cy={cy} r={22} fill="#fff8f1" stroke="#a32e0c55" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={18}>☉</text>
    </svg>
  );
}
