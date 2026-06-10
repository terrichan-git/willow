"use client";

import { useState } from "react";

type Research = {
  notificationProcess?: {
    summary?: string;
    channels?: string[];
    contact?: { phone?: string | null; department?: string | null; url?: string | null };
    steps?: string[];
  };
  requiredDocuments?: string[];
  timeline?: { notificationDeadline?: string | null; processingTime?: string | null; followUp?: string | null };
  financialImplications?: { accountFrozen?: boolean | null; fundsRelease?: string | null; fees?: string | null };
  notes?: string[];
  sources?: { title: string; url: string }[];
  confidence?: string;
  needsManualResearch?: boolean;
  meta?: Record<string, unknown>;
  error?: string;
};

const PRESETS = [
  { institutionName: "DBS Bank", type: "bank", jurisdiction: "Singapore" },
  { institutionName: "AIA", type: "insurer", jurisdiction: "Singapore" },
  { institutionName: "Netflix", type: "subscription", jurisdiction: "Singapore" },
];

export default function ResearchPage() {
  const [form, setForm] = useState(PRESETS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Research | null>(null);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      setResult(await res.json());
    } catch (err) {
      setResult({ error: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  const r = result;
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Institution Researcher</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Real-time research (Exa) → structured by Claude on AWS Bedrock → saved as a task.
      </p>

      <form onSubmit={run} className="mt-8 grid gap-3 sm:grid-cols-[1fr_140px_160px_auto]">
        <input
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Institution"
          value={form.institutionName}
          onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
        />
        <input
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <input
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Jurisdiction"
          value={form.jurisdiction}
          onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Researching…" : "Research"}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.institutionName}
            onClick={() => setForm(p)}
            className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
          >
            {p.institutionName}
          </button>
        ))}
      </div>

      {loading && <p className="mt-10 animate-pulse text-sm text-neutral-500">Calling Exa + Bedrock on AWS…</p>}

      {r?.error && (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{r.error}</div>
      )}

      {r && !r.error && (
        <div className="mt-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {r.confidence && (
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-700">
                confidence: {r.confidence}
              </span>
            )}
            {r.needsManualResearch && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-800">
                needs manual research
              </span>
            )}
            {typeof r.meta?.exaResultCount === "number" && (
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-600">
                {String(r.meta.exaResultCount)} sources
              </span>
            )}
            {r.meta?.model != null && (
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-600">
                {String(r.meta.model)}
              </span>
            )}
          </div>

          {r.notificationProcess && (
            <Section title="Notification process">
              <p className="text-sm">{r.notificationProcess.summary}</p>
              {!!r.notificationProcess.channels?.length && (
                <p className="mt-2 text-xs text-neutral-500">Channels: {r.notificationProcess.channels.join(", ")}</p>
              )}
              {r.notificationProcess.contact && (
                <p className="mt-1 text-xs text-neutral-500">
                  {[
                    r.notificationProcess.contact.phone,
                    r.notificationProcess.contact.department,
                    r.notificationProcess.contact.url,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              {!!r.notificationProcess.steps?.length && (
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
                  {r.notificationProcess.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              )}
            </Section>
          )}

          {!!r.requiredDocuments?.length && (
            <Section title="Required documents">
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {r.requiredDocuments.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </Section>
          )}

          {r.timeline && (
            <Section title="Timeline">
              <dl className="grid gap-1 text-sm">
                <Row k="Notification deadline" v={r.timeline.notificationDeadline} />
                <Row k="Processing time" v={r.timeline.processingTime} />
                <Row k="Follow up" v={r.timeline.followUp} />
              </dl>
            </Section>
          )}

          {r.financialImplications && (
            <Section title="Financial implications">
              <dl className="grid gap-1 text-sm">
                <Row k="Account frozen" v={fmtBool(r.financialImplications.accountFrozen)} />
                <Row k="Funds release" v={r.financialImplications.fundsRelease} />
                <Row k="Fees" v={r.financialImplications.fees} />
              </dl>
            </Section>
          )}

          {!!r.notes?.length && (
            <Section title="Notes">
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {r.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </Section>
          )}

          {!!r.sources?.length && (
            <Section title="Sources">
              <ul className="space-y-1 text-sm">
                {r.sources.map((s, i) => (
                  <li key={i}>
                    <a className="text-blue-600 underline" href={s.url} target="_blank" rel="noreferrer">
                      {s.title || s.url}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-neutral-200 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>
      {children}
    </section>
  );
}

function Row({ k, v }: { k: string; v?: string | null }) {
  return (
    <div className="flex gap-2">
      <dt className="w-44 shrink-0 text-neutral-500">{k}</dt>
      <dd>{v || "—"}</dd>
    </div>
  );
}

function fmtBool(b?: boolean | null) {
  return b === true ? "Yes" : b === false ? "No" : null;
}
