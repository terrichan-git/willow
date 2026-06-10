import Link from "next/link";
import { getProfile, getTasks, readinessScore, inProgressSections, TASK_CATEGORIES, type Task } from "@/lib/estate";
import DisbursementPanel from "@/app/components/DisbursementPanel";

export const dynamic = "force-dynamic"; // reads DynamoDB per request

export default async function Dashboard() {
  const [profile, tasks] = await Promise.all([getProfile(), getTasks()]);
  const p = profile;
  const pi = p.personalInfo || {};
  const readiness = readinessScore(p);
  const inProgress = inProgressSections(p);

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Your estate</p>
          <h1 className="font-display text-[34px] font-normal leading-tight text-onyx sm:text-[40px]">
            Good afternoon, {pi.name || "there"}.
          </h1>
          <p className="mt-2 text-[15px] text-ink-muted">
            Your estate in {pi.jurisdiction || "—"} · executor {pi.executor || "—"}
          </p>
        </div>
        <Link href="/companion" className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-chalk transition hover:bg-teal-deep">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a4 4 0 014 4v3a4 4 0 01-8 0V7a4 4 0 014-4zM6 11a6 6 0 0012 0M12 17v4" /></svg>
          Talk to Maria
        </Link>
      </div>

      {/* Readiness */}
      <section className="rounded-2xl border border-hairline bg-paper p-6 shadow-[0_1px_3px_rgba(28,58,46,0.05)]">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Estate readiness</p>
            <p className="font-display mt-1 text-4xl font-normal text-onyx">{readiness}%</p>
          </div>
          <p className="max-w-xs text-right text-xs text-ink-faint">
            {inProgress.length > 0
              ? `${inProgress.length} section${inProgress.length > 1 ? "s" : ""} in progress: ${inProgress.join(", ")}.`
              : "Well prepared — your family won't be left with chaos."}
          </p>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-chalk-deep">
          <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${readiness}%` }} />
        </div>
      </section>

      {/* Estate cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Family & executor" items={[...family, pi.executor && `Executor: ${pi.executor}`].filter(Boolean)} href="/setup" />
        <Card title="Financial accounts" items={accounts} href="/setup" />
        <Card title="Insurance policies" items={insurance} href="/setup" />
        <Card title="Will & legal" items={willLines} href="/setup" inProgress={inProgress.includes("Will & legal")} />
        <Card title="Property & assets" items={property} href="/setup" inProgress={inProgress.includes("Property & assets")} />
        <Card title="Digital accounts" items={digital} href="/setup" />
      </section>

      {/* Settle & disburse (executor) */}
      <DisbursementPanel />

      {/* Task timeline */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-[23px] font-medium text-onyx">After they pass — task timeline</h2>
          <Link href="/tasks" className="text-sm font-medium text-teal hover:text-teal-deep">View all →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TASK_CATEGORIES.map((cat) => {
            const items = tasks.filter((t) => t.category === cat.key);
            return (
              <div key={cat.key} className="rounded-2xl border border-hairline bg-paper p-4">
                <p className="eyebrow mb-3 !text-ink-muted">{cat.label}</p>
                <ul className="space-y-3">
                  {items.length === 0 && <li className="text-sm text-ink-faint">—</li>}
                  {items.map((t: Task) => (
                    <li key={t.taskId} className="text-sm">
                      <p className="text-ink">{t.action}</p>
                      {t.deadline && <p className="mt-0.5 text-xs text-ink-faint">{t.deadline}</p>}
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

function Card({ title, items, href, inProgress }: { title: string; items: string[]; href: string; inProgress?: boolean }) {
  return (
    <Link href={href} className="group rounded-2xl border border-hairline bg-paper p-5 transition hover:border-sage hover:shadow-[0_2px_8px_rgba(28,58,46,0.08)]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-onyx">{title}</h3>
        {inProgress ? (
          <span className="shrink-0 rounded-full bg-pending-soft px-2 py-0.5 text-xs font-medium text-pending">In progress</span>
        ) : (
          <span className="text-xs text-ink-faint opacity-0 transition group-hover:opacity-100 group-hover:text-teal">edit →</span>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-ink-faint">Not added yet</p>
      ) : (
        <ul className="space-y-1.5 text-sm text-ink-muted">
          {items.slice(0, 4).map((it, i) => (
            <li key={i} className="truncate">{it}</li>
          ))}
          {items.length > 4 && <li className="text-xs text-ink-faint">+{items.length - 4} more</li>}
        </ul>
      )}
    </Link>
  );
}
