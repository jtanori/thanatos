"use client";
import { useState } from "react";

export default function PortalButton() {
  const [loading, setLoading] = useState(false);
  async function go() {
    setLoading(true);
    try {
      const r = await fetch("/api/stripe/portal", { method: "POST" });
      const d = await r.json();
      window.location.href = d.url ?? "/pricing";
    } finally {
      setLoading(false);
    }
  }
  return (
    <button onClick={go} disabled={loading} className="rounded-full border border-[#a32e0c] px-6 py-2 font-semibold text-[#a32e0c] disabled:opacity-60">
      {loading ? "…" : "Gestionar en Stripe →"}
    </button>
  );
}
