import { db } from "@/db";
import { interpretations } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function Biblioteca() {
  let items: Array<typeof interpretations.$inferSelect> = [];
  try {
    items = await db.select().from(interpretations).limit(100);
  } catch { items = []; }

  const groups: Record<string, typeof items> = {};
  for (const it of items) {
    groups[it.category] = [...(groups[it.category] ?? []), it];
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-[#a32e0c]">Biblioteca · Base de conocimiento</p>
      <h1 className="font-serif-display text-5xl">El lenguaje que produce tu Revolución.</h1>
      <p className="mt-3 max-w-2xl text-[#6b5d51]">Cada lectura combina estas fichas editoriales. El rol <b>Editor</b> puede reescribirlas desde /editor sin tocar código. Si la tabla está vacía, ejecuta el Seed en /admin.</p>
      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-[#a32e0c]/40 bg-white p-8 text-center">
          Sin contenido aún. Ve a <a href="/admin" className="font-semibold text-[#a32e0c]">/admin → Sembrar base demo</a>
        </div>
      ) : (
        Object.entries(groups).map(([cat, arr]) => (
          <section key={cat} className="mt-10">
            <h2 className="font-serif-display text-3xl capitalize">{cat.replace("_", " ")}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {arr.slice(0, 8).map((it) => (
                <div key={it.id} className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#a32e0c]">{it.key}</div>
                  <div className="mt-1 font-semibold">{it.title}</div>
                  <p className="mt-2 text-sm text-[#5b4d42]">{it.contentShort}</p>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
