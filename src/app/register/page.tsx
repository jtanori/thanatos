"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const r = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const data = await res.json();
    if (!res.ok) setErr(data.error);
    else r.push("/empezar?nombre=" + encodeURIComponent(name));
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md px-5 py-14">
      <div className="card-soft rounded-3xl p-8">
        <h1 className="font-serif-display text-3xl">Crea tu cuenta</h1>
        <p className="mt-2 text-sm text-[#6b5d51]">Guarda tus cartas, accede a Premium y gestiona tu suscripción.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" autoComplete="name" placeholder="Tu nombre" className="input-warm w-full rounded-2xl px-5 py-3" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" autoComplete="email" inputMode="email" placeholder="correo@ejemplo.com" className="input-warm w-full rounded-2xl px-5 py-3" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="new-password" autoComplete="new-password" placeholder="mínimo 8 caracteres" className="input-warm w-full rounded-2xl px-5 py-3" />
          {err && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
          <button disabled={loading} className="btn-clay w-full rounded-2xl py-3 font-semibold">{loading ? "Creando…" : "Crear cuenta y empezar"}</button>
        </form>
        <p className="mt-4 text-sm">¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-[#a32e0c]">Entrar</Link></p>
      </div>
    </main>
  );
}
