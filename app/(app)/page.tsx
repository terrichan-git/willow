import Link from "next/link";
import { getProfile, getTasks, readinessScore, TASK_CATEGORIES, type Task } from "@/lib/estate";
import DisbursementPanel from "@/app/components/DisbursementPanel";

export const dynamic = "force-dynamic"; // reads DynamoDB per request

export default async function Dashboard() {
  const [profile, tasks] = await Promise.all([getProfile(), getTasks()]);
  const p = profile;
  const pi = p.personalInfo || {};
  const readiness = readinessScore(p);

  const family = (pi.familyMembers || []).map((f: any) => `${f.name}${f.relationship ? ` (${f.relationship})` : ""}${f.location ? ` — ${f.location}` : ""}`);
  const accounts = (p.financialAccounts || []).map((a: any) => `${a.institution}${a.type ? ` · ${a.type}` : ""}${a.accountRef ? ` · ${a.accountRef}` : ""}`);
  const insurance = (p.insurancePolicies || []).map((i: any) => `${i.provider}${i.type ? ` · ${i.type}` : ""}${i.policyNumber ? ` · ${i.policyNumber}` : ""}`);
  const property = (p.propertyAssets || []).map((x: any) => `${x.description || x.type}${x.location ? ` — ${x.location}` : ""}`);
  const digital = (p.digitalAccounts || []).map((d: any) => d.platform);
  const willLines = p.will
    ? [p.will.exists ? "Will: in place" : "Will: not yet created", p.will.location && `Kept: ${p.will.location}`, p.will.executorOrLawyer && `Executor/lawyer: ${p.will.executorOrLawyer}`].filter(Boolean)
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Good afternoon, {pi.name || "there"}</h1>
          <p className="mt-1 text-sm text-stone-500">
            Your estate in {pi.jurisdiction || "—"} · executor {pi.executor || "—"}
          </p>
        </div>
        <Link href="/companion" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a4 4 0 014 4v3a4 4 0 01-8 0V7a4 4 0 014-4zM6 11a6 6 0 0012 0M12 17v4" /></svg>
          Talk to Maria
        </Link>
      </div>

      {/* Readiness */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-stone-500">Estate readiness</p>
            <p className="mt-1 text-3xl font-semibold text-stone-900">{readiness}%</p>
          </div>
          <p className="max-w-xs text-right text-xs text-stone-400">
            {readiness >= 80 ? "Well prepared — your family won't be left with chaos." : "A few sections still to complete."}
          </p>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
          <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${readiness}%` }} />
        </div>
      </section>

      {/* Estate cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Family & executor" items={[...family, pi.executor && `Executor: ${pi.executor}`].filter(Boolean)} href="/setup" />
        <Card title="Financial accounts" items={accounts} href="/setup" />
        <Card title="Insurance policies" items={insurance} href="/setup" />
        <Card title="Will & legal" items={willLines} href="/setup" />
        <Card title="Property & assets" items={property} href="/setup" />
        <Card title="Digital accounts" items={digital} href="/setup" />
      </section>

      {/* Settle & disburse (executor) */}
      <DisbursementPanel />

      {/* Task timeline */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">After they pass — task timeline</h2>
          <Link href="/tasks" className="text-sm font-medium text-emerald-700 hover:text-emerald-900">View all →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TASK_CATEGORIES.map((cat) => {
            const items = tasks.filter((t) => t.category === cat.key);
            return (
              <div key={cat.key} className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">{cat.label}</p>
                <ul className="space-y-3">
                  {items.length === 0 && <li className="text-sm text-stone-400">—</li>}
                  {items.map((t: Task) => (
                    <li key={t.taskId} className="text-sm">
                      <p className="text-stone-800">{t.action}</p>
                      {t.deadline && <p className="mt-0.5 text-xs text-stone-400">{t.deadline}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Card({ title, items, href }: { title: string; items: string[]; href: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-800">{title}</h3>
        <span className="text-xs text-stone-300 group-hover:text-emerald-500">edit →</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-stone-400">Not added yet</p>
      ) : (
        <ul className="space-y-1.5 text-sm text-stone-600">
          {items.slice(0, 4).map((it, i) => (
            <li key={i} className="truncate">{it}</li>
          ))}
          {items.length > 4 && <li className="text-xs text-stone-400">+{items.length - 4} more</li>}
        </ul>
      )}
    </Link>
  );
}
