"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const r = useRouter();
  const [email, setEmail] = useState("user@carta.natal");
  const [password, setPassword] = useState("password123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok) setErr(data.error);
    else r.push("/dashboard");
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md px-5 py-14">
      <div className="card-soft rounded-3xl p-8">
        <h1 className="font-serif-display text-3xl">Bienvenida/o de vuelta</h1>
        <p className="mt-2 text-sm text-[#6b5d51]">Entra para ver tus Revoluciones guardadas.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" autoComplete="email" inputMode="email" placeholder="correo" className="input-warm w-full rounded-2xl px-5 py-3" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="current-password" autoComplete="current-password" placeholder="contraseña" className="input-warm w-full rounded-2xl px-5 py-3" />
          {err && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
          <button disabled={loading} className="btn-clay w-full rounded-2xl py-3 font-semibold">{loading ? "Entrando…" : "Entrar"}</button>
        </form>
        <p className="mt-4 text-sm text-[#6b5d51]">¿Sin cuenta? <Link href="/register" className="font-semibold text-[#a32e0c]">Crear cuenta</Link></p>
        <div className="mt-6 rounded-2xl bg-[#fff6ea] p-4 text-xs leading-relaxed text-[#6b5d51]">
          <b>Cuentas demo</b> (tras ejecutar Seed en /admin):<br />
          owner@carta.natal · admin@carta.natal · editor@carta.natal · user@carta.natal<br />
          Contraseña: <code>password123</code>
        </div>
      </div>
    </main>
  );
}
