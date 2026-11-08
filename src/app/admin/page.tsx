"use client";
import { useEffect, useState } from "react";

interface UserRow { id: string; email: string; name: string; role: string; plan: string; createdAt: string }

export default function Admin() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [settings, setSettings] = useState<{ settings: Array<{ key: string; value: unknown }>; plans: Array<{ slug: string; name: string; priceCents: number; active: boolean }> }>({ settings: [], plans: [] });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [key, setKey] = useState("announcement");
  const [value, setValue] = useState('{"v":"Bienvenidos a la Revolución Solar 2027"}');

  async function load() {
    setErr("");
    const u = await fetch("/api/admin/users");
    if (u.ok) setUsers((await u.json()).users);
    else setErr("Sin permiso admin. Entra como owner@carta.natal / admin@carta.natal (password123) tras el Seed. Si es la primera vez, pulsa Seed.");
    const s = await fetch("/api/admin/settings");
    if (s.ok) setSettings(await s.json());
  }

  useEffect(() => { load(); }, []);

  async function seed() {
    setMsg("Sembrando…");
    const r = await fetch("/api/admin/seed", { method: "POST" });
    const d = await r.json();
    setMsg(d.message ?? d.error ?? "OK");
    load();
  }

  async function patchUser(id: string, role?: string, plan?: string) {
    const r = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, role, plan }) });
    const d = await r.json();
    setMsg(d.ok ? "Usuario actualizado" : d.error);
    load();
  }

  async function saveSetting() {
    try {
      const v = JSON.parse(value);
      const r = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value: v }) });
      setMsg(r.ok ? "Ajuste guardado (solo Owner)" : (await r.json()).error);
      load();
    } catch { setMsg("JSON inválido"); }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.22em] text-[#a32e0c]">Sistema · Owner / Admin</p>
      <h1 className="font-serif-display text-5xl">Administración del producto</h1>
      <p className="mt-2 text-[#6b5d51]">Owner configura todo · Admin gestiona el sistema · Editor edita el conocimiento en <a href="/editor" className="font-semibold text-[#a32e0c]">/editor</a></p>
      <div className="mt-4 flex gap-3">
        <button onClick={seed} className="btn-clay rounded-full px-6 py-2 font-semibold">🌱 Sembrar base demo</button>
        <button onClick={load} className="rounded-full border border-[#a32e0c] px-6 py-2 text-[#a32e0c]">Recargar</button>
      </div>
      {msg && <p className="mt-3 rounded-2xl bg-green-50 p-3 text-sm text-green-800">{msg}</p>}
      {err && <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="font-serif-display text-2xl">Usuarios ({users.length}) — roles y planes</h2>
        <div className="mt-4 space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-2 rounded-2xl bg-[#fff8f1] p-3 text-sm">
              <b>{u.name}</b><span className="text-[#6b5d51]">{u.email}</span>
              <span className="rounded-full bg-[#f6e8d7] px-2 py-0.5 text-xs font-bold">{u.role}</span>
              <span className="rounded-full bg-[#2b211b] px-2 py-0.5 text-xs font-bold text-white">{u.plan}</span>
              <span className="ml-auto flex gap-1">
                {["user", "editor", "admin", "owner"].map((r) => <button key={r} onClick={() => patchUser(u.id, r)} className="rounded-full bg-white px-2 py-1 text-xs hover:bg-[#f6e8d7]">{r}</button>)}
                <button onClick={() => patchUser(u.id, undefined, "free")} className="rounded-full bg-white px-2 py-1 text-xs">free</button>
                <button onClick={() => patchUser(u.id, undefined, "premium")} className="rounded-full bg-[#a32e0c] px-2 py-1 text-xs text-white">premium</button>
              </span>
            </div>
          ))}
          {users.length === 0 && <p className="text-sm text-[#8a7a6e]">Sin datos — pulsa Sembrar base demo.</p>}
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-serif-display text-2xl">Planes / Productos</h2>
          <div className="mt-3 space-y-2 text-sm">
            {settings.plans.map((p) => <div key={p.slug} className="rounded-2xl bg-[#f7ecdc] p-3"><b>{p.name}</b> · {(p.priceCents / 100).toFixed(2)} · {p.slug} · {p.active ? "activo" : "pausado"}</div>)}
            {settings.plans.length === 0 && <p className="text-[#8a7a6e]">Sin planes — ejecuta el Seed.</p>}
          </div>
          <p className="mt-3 text-xs text-[#8a7a6e]">Solo el Product Owner puede cambiar precios/planes (PATCH /api/admin/settings). Gratis = Seeker trial · Pago = Celestial.</p>
        </section>
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-serif-display text-2xl">Ajustes (solo Owner)</h2>
          <div className="mt-3 space-y-2 text-sm">
            {settings.settings.map((s) => <div key={s.key} className="rounded-2xl bg-[#fff8f1] p-2"><b>{s.key}:</b> <code className="text-xs">{JSON.stringify(s.value)}</code></div>)}
          </div>
          <input value={key} onChange={(e) => setKey(e.target.value)} type="text" name="setting-key" autoComplete="off" className="input-warm mt-3 w-full rounded-2xl px-4 py-2 text-sm" placeholder="clave" />
          <textarea value={value} onChange={(e) => setValue(e.target.value)} className="input-warm mt-2 w-full rounded-2xl px-4 py-2 font-mono text-xs" rows={3} />
          <button onClick={saveSetting} className="btn-clay mt-2 rounded-full px-5 py-2 text-sm font-semibold">Guardar ajuste</button>
        </section>
      </div>

      <section className="mt-6 rounded-3xl bg-[#2b211b] p-6 text-sm leading-relaxed text-[#ffe8c8]">
        <b>CI/CD & Seguridad (resumen operativo):</b> main protegida ← staging ← feature/* · CI: typegen + tsc + build + tests astro · CD: migrate → deploy → smoke /api/health · Auth scrypt + httpOnly · RBAC owner&gt;admin&gt;editor&gt;user · Auditoría en cada cambio. Detalle en <a href="/arquitectura" className="underline">/arquitectura</a>.
      </section>
    </main>
  );
}
