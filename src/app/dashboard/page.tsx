import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { solarCharts } from "@/db/schema";
import { getSessionUser, isPremiumUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect("/login?next=/dashboard");
  const charts = await db.select().from(solarCharts).where(eq(solarCharts.userId, user.id)).orderBy(desc(solarCharts.targetYear)).limit(20);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.22em] text-[#a32e0c]">Cuenta</p>
      <h1 className="font-serif-display text-5xl">Hola, {user.name.split(" ")[0]}.</h1>
      <p className="mt-2 text-[#6b5d51]">Tus Revoluciones Solares guardadas · Plan <b>{user.plan}</b> · Rol <b>{user.role}</b> {isPremiumUser(user) ? "👑" : "✨"}</p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Link href="/empezar" className="card-soft rounded-3xl p-6 hover:shadow-lg">
          <div className="text-3xl">✨</div>
          <div className="mt-2 font-serif-display text-2xl">Nueva Revolución</div>
          <p className="mt-1 text-sm text-[#6b5d51]">Calcula el retorno exacto del Sol para el próximo cumpleaños.</p>
          <span className="btn-clay mt-4 inline-block rounded-full px-5 py-2 text-sm font-semibold">Calcular →</span>
        </Link>
        <Link href="/cuenta" className="rounded-3xl border border-[#a32e0c]/15 bg-white p-6">
          <div className="text-3xl">👤</div>
          <div className="mt-2 font-serif-display text-2xl">Mi perfil</div>
          <p className="mt-1 text-sm text-[#6b5d51]">Datos natales, idioma, zona horaria y seguridad.</p>
        </Link>
        <Link href="/pricing" className="rounded-3xl bg-[#2b211b] p-6 text-white">
          <div className="text-3xl">👑</div>
          <div className="mt-2 font-serif-display text-2xl">{isPremiumUser(user) ? "Ya eres Premium" : "Desbloquea Premium"}</div>
          <p className="mt-1 text-sm opacity-80">Luna, stelliums, aspectos RS vs natal y PDF completo.</p>
        </Link>
      </div>

      <h2 className="font-serif-display mt-10 text-3xl">Mis Cartas Guardadas ({charts.length})</h2>
      {charts.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-[#a32e0c]/30 bg-white/60 p-8 text-center text-[#6b5d51]">
          Aún no tienes cartas. <Link href="/empezar" className="font-semibold text-[#a32e0c]">Crea tu primera Revolución Solar →</Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {charts.map((c) => (
            <Link key={c.id} href={`/revolucion/${c.id}`} className="rounded-3xl border border-[#a32e0c]/10 bg-white p-6 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#f6e8d7] px-3 py-1 text-sm font-bold">☉ {c.targetYear}</span>
                <span className="text-xs text-[#8a7a6e]">{new Date(c.returnMomentUtc).toUTCString().slice(0, 22)}</span>
              </div>
              <div className="mt-3 font-serif-display text-2xl">Asc {c.ascSign} · Sol en Casa {c.sunHouse}</div>
              <div className="mt-1 text-sm text-[#6b5d51]">Luna en {c.moonSign} (Casa {c.moonHouse}) · {c.birthPlace} → {c.returnPlace}</div>
              <div className="mt-3 text-sm font-semibold text-[#a32e0c]">Abrir lectura →</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
