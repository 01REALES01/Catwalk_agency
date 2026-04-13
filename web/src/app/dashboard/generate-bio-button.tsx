"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function GenerateBioButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-bio", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error generando biografía");
        return;
      }
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={handleGenerate}
        disabled={loading}
        className="w-full md:w-auto"
      >
        {loading ? "Generando con IA…" : "Generar bio con IA"}
      </Button>
      {error && (
        <p className="font-body text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
