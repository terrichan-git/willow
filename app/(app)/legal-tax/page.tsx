"use client";

import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function LegalTaxPage() {
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/legal-guide")
      .then((r) => r.json())
      .then((d) => {
        if (d.result) setResult(d.result);
        else run();
      })
      .finally(() => setLoading(false));
  }, []);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/legal-guide", { method: "POST" });
      const d = await res.json();
      if (d.error) setError(d.error);
      else setResult(d.result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const r = result;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Legal &amp; Tax</h1>
          <p className="mt-1 text-sm text-stone-500">Cross-border estate research · Singapore → United States · live via Exa + Bedrock on AWS.</p>
        </div>
        <button onClick={run} disabled={loading} className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:opacity-50">
          {loading ? "Researching…" : "Re-run live analysis"}
        </button>
      </div>

      {loading && !r && <p className="animate-pulse text-sm text-stone-500">Researching two countries&apos; estate rules with Exa, structuring on Bedrock…</p>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {r && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-800">recommend professional review</span>
            {r.confidence && <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-600">confidence: {r.confidence}</span>}
            {r.meta?.model && <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-600">{r.meta.model}</span>}
            {typeof r.meta?.exaResultCount === "number" && <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-600">{r.meta.exaResultCount} sources</span>}
          </div>

          {r.summary && <p className="rounded-2xl border border-stone-200 bg-white p-5 text-sm text-stone-700">{r.summary}</p>}

          <div className="grid gap-4 md:grid-cols-2">
            <Panel title={`${r.deceasedCountry?.jurisdiction || "Deceased"} — estate tax`}>
              <p className="text-sm text-stone-700">{r.deceasedCountry?.inheritanceOrEstateTax}</p>
              <List items={r.deceasedCountry?.keyPoints} />
            </Panel>
            <Panel title={`${r.heirCountry?.jurisdiction || "Heir"} — situs & reporting`}>
              <p className="text-sm text-stone-700">{r.heirCountry?.taxOnInheritedAssets}</p>
              <p className="mt-2 text-sm text-stone-600">{r.heirCountry?.situsRules}</p>
              <List items={r.heirCountry?.reportingForms} />
            </Panel>
          </div>

          {r.recommendedRoute?.summary && (
            <Panel title="Most cost-efficient route">
              <p className="text-sm text-stone-800">{r.recommendedRoute.summary}</p>
              {r.recommendedRoute.rationale && <p className="mt-2 text-sm text-stone-500">{r.recommendedRoute.rationale}</p>}
            </Panel>
          )}

          {r.willVsTrust?.recommendation && (
            <Panel title="Will vs trust">
              <p className="text-sm text-stone-800">Recommendation: <span className="font-medium">{r.willVsTrust.recommendation}</span></p>
              <p className="mt-1 text-sm text-stone-600">{r.willVsTrust.why}</p>
            </Panel>
          )}

          {!!r.steps?.length && (
            <Panel title="Steps for the executor">
              <ol className="list-decimal space-y-1 pl-5 text-sm text-stone-700">{r.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}</ol>
            </Panel>
          )}

          {!!r.sources?.length && (
            <Panel title="Sources">
              <ul className="space-y-1 text-sm">
                {r.sources.slice(0, 8).map((s: any, i: number) => (
                  <li key={i}><a className="text-emerald-700 underline" href={s.url} target="_blank" rel="noreferrer">{s.title || s.url}</a></li>
                ))}
              </ul>
            </Panel>
          )}

          {r.disclaimer && <p className="text-xs italic text-stone-500">{r.disclaimer}</p>}
        </div>
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">{title}</h2>
      {children}
    </section>
  );
}

function List({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
}
