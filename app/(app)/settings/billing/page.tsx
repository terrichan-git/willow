"use client";

import { useEffect, useState } from "react";
import CheckoutButton from "@/app/components/CheckoutButton";

type Summary = {
  plan?: { name: string; price: string; status: string; lookupKey: string };
  card?: { brand: string; last4: string; exp_month: number; exp_year: number } | null;
  invoices?: { id: string; amount: number; currency: string; status: string; date: number; url: string | null }[];
  error?: string;
};

const PLANS = [
  { lookupKey: "willow_readiness", name: "Estate Readiness Report", price: "$9", blurb: "See where your estate is exposed today." },
  { lookupKey: "willow_will", name: "Digital Will Generator", price: "$19", blurb: "Generate a structured will from your profile." },
  { lookupKey: "willow_full", name: "Full Estate Plan + AI Companion", price: "$79", blurb: "Will, voice companion, full agent access." },
  { lookupKey: "willow_checklist", name: "Estate Checklist Pack", price: "$29", blurb: "Ready-to-use checklists for executors." },
  { lookupKey: "willow_family", name: "Family Protection Plan", price: "$149/yr", blurb: "Ongoing monitoring + multi-member access." },
];

export default function BillingPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/billing/summary").then((r) => r.json()).then(setData).catch((e) => setData({ error: String(e) }));
  }, []);

  async function manageBilling() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
    } finally {
      setPortalLoading(false);
    }
  }

  const currentKey = data?.plan?.lookupKey || "willow_full";

  return (
    <div className="space-y-8">
      {/* Current plan */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-stone-900">{data?.plan?.name || "Full Estate Plan + AI Companion"}</h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">{data?.plan?.status || "active"}</span>
            </div>
            <p className="mt-1 text-sm text-stone-500">{data?.plan?.price || "$79"} · started today · test mode</p>
          </div>
          <button onClick={manageBilling} disabled={portalLoading} className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:opacity-50">
            {portalLoading ? "Opening…" : "Manage billing"}
          </button>
        </div>
      </section>

      {/* Payment method + invoices */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-semibold text-stone-800">Payment method</h3>
          {data?.card ? (
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-stone-900 px-2.5 py-1 text-xs font-semibold uppercase text-white">{data.card.brand}</span>
              <span className="text-sm text-stone-700">•••• {data.card.last4}</span>
              <span className="text-xs text-stone-400">exp {data.card.exp_month}/{data.card.exp_year}</span>
            </div>
          ) : (
            <p className="text-sm text-stone-400">{data ? "No card on file." : "Loading…"}</p>
          )}
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-semibold text-stone-800">Recent invoices</h3>
          {data?.invoices && data.invoices.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {data.invoices.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between">
                  <span className="text-stone-600">{inv.currency} {inv.amount.toFixed(2)} · {inv.status}</span>
                  {inv.url && <a href={inv.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-emerald-700 hover:underline">view</a>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-400">{data ? "No invoices yet." : "Loading…"}</p>
          )}
        </section>
      </div>

      {/* Plans */}
      <section>
        <h3 className="mb-3 text-lg font-semibold text-stone-900">Plans</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const current = plan.lookupKey === currentKey;
            return (
              <div key={plan.lookupKey} className={"rounded-2xl border bg-white p-5 " + (current ? "border-emerald-400 ring-1 ring-emerald-200" : "border-stone-200")}>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-sm font-semibold text-stone-800">{plan.name}</h4>
                  <span className="text-sm font-semibold text-stone-900">{plan.price}</span>
                </div>
                <p className="mt-1 text-xs text-stone-500">{plan.blurb}</p>
                <div className="mt-4">
                  {current ? (
                    <span className="inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-800">Current plan</span>
                  ) : (
                    <CheckoutButton lookupKey={plan.lookupKey} className="rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-800">
                      {plan.lookupKey === "willow_family" ? "Subscribe" : "Upgrade"}
                    </CheckoutButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
