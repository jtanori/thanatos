"use client";
import { useEffect, useState } from "react";

interface Item { id: string; category: string; key: string; title: string; contentShort: string; contentFull: string; contentPremium?: string }

export default function Editor() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [msg, setMsg] = useState("");

  async function load() {
    const r = await fetch("/api/admin/knowledge");
    if (r.ok) setItems((await r.json()).items);
    else setMsg("Sin permiso. Entra como editor@carta.natal (password123). Si es la primera vez, ve a /admin y pulsa Seed.");
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    const r = await fetch("/api/admin/knowledge", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setMsg(r.ok ? "✅ Contenido actualizado — ya alimenta las lecturas." : "Error al guardar");
    setEditing(null);
    load();
  }

  const shown = items.filter((i) => !filter || `${i.category} ${i.key} ${i.title}`.toLowerCase().includes(filter.toLowerCase()));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.22em] text-[#a32e0c]">Contenido · Editor</p>
      <h1 className="font-serif-display text-5xl">Base de conocimiento</h1>
      <p className="mt-2 text-[#6b5d51]">Edita los textos que producen la Revolución Solar. Sin tocar código. Todo queda auditado.</p>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} type="search" name="knowledge-filter" autoComplete="off" placeholder="Filtrar: ASC_LEO, SUN_HOUSE_10, MOON…" className="input-warm mt-4 w-full max-w-md rounded-2xl px-5 py-3" />
      {msg && <p className="mt-3 rounded-2xl bg-[#fff6ea] p-3 text-sm">{msg}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {shown.slice(0, 30).map((it) => (
          <div key={it.id} className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-xs font-bold uppercase text-[#a32e0c]">{it.category} · {it.key}</div>
            <div className="mt-1 font-semibold">{it.title}</div>
            <p className="mt-2 line-clamp-3 text-sm text-[#5b4d42]">{it.contentShort}</p>
            <button onClick={() => setEditing(it)} className="mt-3 rounded-full bg-[#f6e8d7] px-4 py-1 text-sm font-semibold">Editar</button>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6">
            <h2 className="font-serif-display text-2xl">Editando {editing.key}</h2>
            <label className="mt-3 block text-sm font-semibold">Título</label>
            <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} type="text" name="entry-title" autoComplete="off" className="input-warm mt-1 w-full rounded-2xl px-4 py-2" />
            <label className="mt-3 block text-sm font-semibold">Resumen (gratis)</label>
            <textarea value={editing.contentShort} onChange={(e) => setEditing({ ...editing, contentShort: e.target.value })} rows={3} className="input-warm mt-1 w-full rounded-2xl px-4 py-2" />
            <label className="mt-3 block text-sm font-semibold">Completo</label>
            <textarea value={editing.contentFull} onChange={(e) => setEditing({ ...editing, contentFull: e.target.value })} rows={5} className="input-warm mt-1 w-full rounded-2xl px-4 py-2" />
            <label className="mt-3 block text-sm font-semibold">Premium 👑</label>
            <textarea value={editing.contentPremium ?? ""} onChange={(e) => setEditing({ ...editing, contentPremium: e.target.value })} rows={4} className="input-warm mt-1 w-full rounded-2xl bg-[#2b211b] px-4 py-2 text-[#ffe8c8]" />
            <div className="mt-4 flex gap-2">
              <button onClick={save} className="btn-clay rounded-full px-6 py-2 font-semibold">Guardar</button>
              <button onClick={() => setEditing(null)} className="rounded-full bg-[#f6e8d7] px-6 py-2">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
