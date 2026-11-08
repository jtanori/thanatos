import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { solarCharts, subscriptions } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import PortalButton from "@/components/PortalButton";

export const dynamic = "force-dynamic";

export default async function Cuenta() {
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect("/login");
  const charts = await db.select().from(solarCharts).where(eq(solarCharts.userId, user.id));
  const subs = await db.select().from(subscriptions).where(eq(subscriptions.userId, user.id)).limit(5);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.22em] text-[#a32e0c]">Cuenta</p>
      <h1 className="font-serif-display text-5xl">{user.email.split("@")[0]}</h1>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-[#a32e0c]/10 pb-2 text-[15px]">
        {["Mi Perfil", "Suscripción", "Mis Cartas Guardadas", "Preferencias", "Seguridad"].map((t, i) => (
          <span key={t} className={`whitespace-nowrap px-4 py-2 ${i === 0 ? "border-b-2 border-[#a32e0c] font-semibold text-[#a32e0c]" : "text-[#6b5d51]"}`}>{t}</span>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif-display text-3xl">Información de la Cuenta</h2>
            <p className="mt-1 text-[#6b5d51]">Actualiza tus datos personales y ubicación para lecturas precisas.</p>
          </div>
          <form action="/api/account/update" method="post">
            <button className="btn-clay rounded-full px-8 py-3 font-semibold">Guardar</button>
          </form>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div><label className="text-xs uppercase tracking-widest text-[#c9bbaD]">Nombre</label><input defaultValue={user.name} type="text" name="name" autoComplete="name" className="input-warm mt-1 w-full rounded-2xl px-5 py-3" /></div>
          <div><label className="text-xs uppercase tracking-widest text-[#c9bbaD]">Correo electrónico</label><input defaultValue={user.email} type="email" name="email" autoComplete="email" disabled className="input-warm mt-1 w-full rounded-2xl px-5 py-3 opacity-70" /></div>
          <div><label className="text-xs uppercase tracking-widest text-[#c9bbaD]">Lugar de nacimiento</label><input defaultValue={user.birthPlace ?? ""} type="text" name="birthplace-note" autoComplete="off" className="input-warm mt-1 w-full rounded-2xl px-5 py-3" placeholder="mérida, yucatán" /></div>
          <div><label className="text-xs uppercase tracking-widest text-[#c9bbaD]">Hora de nacimiento</label><input defaultValue={user.birthTime ?? ""} type="text" name="birthtime-note" autoComplete="off" inputMode="numeric" className="input-warm mt-1 w-full rounded-2xl px-5 py-3" placeholder="12:00" /></div>
          <div className="md:col-span-2"><label className="text-xs uppercase tracking-widest text-[#c9bbaD]">Zona horaria</label><input defaultValue={user.birthTimezone ?? "America/Mexico_City"} type="text" name="timezone-note" autoComplete="off" className="input-warm mt-1 w-full rounded-2xl px-5 py-3" /></div>
        </div>
        <div className="mt-4 flex gap-3 text-sm">
          <span className="rounded-full bg-[#f6e8d7] px-3 py-1">Rol: <b>{user.role}</b></span>
          <span className="rounded-full bg-[#2b211b] px-3 py-1 text-white">Plan: <b>{user.plan}</b></span>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="font-serif-display text-3xl">Suscripción</h2>
        <p className="mt-1 text-[#6b5d51]">Plan actual: <b className="text-[#a32e0c]">{user.plan === "free" ? "Seeker · Gratis" : "Celestial · Premium"}</b> · Estado: Activa</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-[#f7ecdc] p-4">Cartas guardadas: {charts.length}/{user.plan === "free" ? 1 : "∞"}</div>
          <div className="rounded-2xl bg-[#f7ecdc] p-4">PDF Revolución Solar: {user.plan === "free" ? "🔒 disponible en Premium" : "✅ incluido"}</div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/pricing" className="rounded-full bg-[#2b211b] px-6 py-2 font-semibold text-white">Ver planes MXN/USD →</a>
          <PortalButton />
          <a href="/dashboard" className="rounded-full bg-[#f6e8d7] px-6 py-2">Mis cartas →</a>
        </div>
        <p className="mt-2 text-xs text-[#8a7a6e]">Moneda: {user.currency ?? "MXN"} · Idioma: {user.locale ?? "es"} · Stripe ID: {user.stripeCustomerId ? user.stripeCustomerId.slice(0, 12) + "…" : "— (modo demo si no hay claves)"}</p>
        {subs.length > 0 && <p className="mt-3 text-xs text-[#8a7a6e]">Historial: {subs.map((s) => `${s.planSlug} (${s.status})`).join(" · ")}</p>}
      </div>

      <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="font-serif-display text-3xl">🌐 Idioma</h2>
        <p className="mt-1 text-[#6b5d51]">Elige tu idioma preferido para la interfaz.</p>
        <p className="mt-3">🌐 Español ▾</p>
      </div>
    </main>
  );
}
