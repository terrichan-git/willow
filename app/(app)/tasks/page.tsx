import { getTasks, TASK_CATEGORIES, type Task } from "@/lib/estate";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[30px] font-normal leading-tight text-onyx">Tasks</h1>
        <p className="mt-1 text-sm text-ink-muted">Everything that needs to happen, sequenced by urgency — researched by Willow&apos;s agents.</p>
      </div>

      <div className="space-y-6">
        {TASK_CATEGORIES.map((cat) => {
          const items = tasks.filter((t) => t.category === cat.key);
          if (!items.length) return null;
          return (
            <section key={cat.key}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">{cat.label}</h2>
              <div className="space-y-3">
                {items.map((t: Task) => (
                  <div key={t.taskId} className="rounded-2xl border border-hairline bg-paper p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {t.institution && <p className="text-xs font-medium text-teal">{t.institution}</p>}
                        <p className="mt-0.5 text-sm text-onyx">{t.action}</p>
                        {t.requiredDocs && t.requiredDocs.length > 0 && (
                          <p className="mt-2 text-xs text-ink-muted">Bring: {t.requiredDocs.join(", ")}</p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        {t.deadline && <p className="text-xs text-ink-faint">{t.deadline}</p>}
                        <span className="mt-1 inline-block rounded-full bg-chalk-deep px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                          {t.status || "pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
