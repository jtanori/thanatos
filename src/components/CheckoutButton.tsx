"use client";
import { useState } from "react";
import type { Currency } from "@/lib/i18n";

export default function CheckoutButton({
  planSlug,
  currency,
  label,
  dark = false,
}: {
  planSlug: string;
  currency: Currency;
  label: string;
  dark?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  async function pay() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug, currency }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/register";
          return;
        }
        throw new Error(data.error ?? "checkout");
      }
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <button
        onClick={pay}
        disabled={loading}
        className={`w-full rounded-full py-3 text-center font-semibold disabled:opacity-60 ${dark ? "bg-[#c9481a] text-white" : "border border-[#a32e0c] text-[#a32e0c]"}`}
      >
        {loading ? "…" : label}
      </button>
      {msg && <p className="mt-2 text-xs text-red-600">{msg}</p>}
    </div>
  );
}
