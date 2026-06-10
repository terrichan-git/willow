"use client";

import { useState } from "react";

export default function CheckoutButton({
  lookupKey = "willow_readiness",
  children,
  className = "",
}: {
  lookupKey?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lookupKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Could not start checkout.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button onClick={go} disabled={loading} className={className}>
        {loading ? "Starting checkout…" : children}
      </button>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
