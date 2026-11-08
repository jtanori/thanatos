"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function PdfButton({ id, locale, premium }: { id: string; locale: Locale; premium: boolean }) {
  const [loading, setLoading] = useState(false);
  async function download() {
    setLoading(true);
    try {
      const res = await fetch(`/api/charts/${id}/pdf?locale=${locale}`);
      if (!res.ok) throw new Error("pdf");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `revolucion-solar-${premium ? "completa" : "trial"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }
  return (
    <button onClick={download} disabled={loading} className="btn-clay rounded-full px-6 py-2 text-sm font-semibold disabled:opacity-60">
      {loading ? t(locale, "pdf.generating") : `${premium ? "👑 " : "✨ "}${t(locale, "pdf.download")}${premium ? "" : " (trial)"}`}
    </button>
  );
}
