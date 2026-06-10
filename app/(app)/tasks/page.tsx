import { getTasks, TASK_CATEGORIES, type Task } from "@/lib/estate";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Tasks</h1>
        <p className="mt-1 text-sm text-stone-500">Everything that needs to happen, sequenced by urgency — researched by Willow&apos;s agents.</p>
      </div>

      <div className="space-y-6">
        {TASK_CATEGORIES.map((cat) => {
          const items = tasks.filter((t) => t.category === cat.key);
          if (!items.length) return null;
          return (
            <section key={cat.key}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">{cat.label}</h2>
              <div className="space-y-3">
                {items.map((t: Task) => (
                  <div key={t.taskId} className="rounded-2xl border border-stone-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {t.institution && <p className="text-xs font-medium text-emerald-700">{t.institution}</p>}
                        <p className="mt-0.5 text-sm text-stone-800">{t.action}</p>
                        {t.requiredDocs && t.requiredDocs.length > 0 && (
                          <p className="mt-2 text-xs text-stone-500">Bring: {t.requiredDocs.join(", ")}</p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        {t.deadline && <p className="text-xs text-stone-400">{t.deadline}</p>}
                        <span className="mt-1 inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
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
