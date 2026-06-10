import { getProfile } from "@/lib/estate";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const p = await getProfile();
  const pi = p.personalInfo || {};
  const rows = [
    { label: "Name", value: "Maria Chen" },
    { label: "Jurisdiction", value: pi.jurisdiction },
    { label: "Executor", value: pi.executor },
    { label: "Email", value: "maria-demo@willow.test" },
    { label: "Voice companion", value: p.voiceCloneId ? "Active (cloned voice)" : "Not set up" },
    { label: "Plan status", value: p.status },
  ];
  return (
    <section className="max-w-lg rounded-2xl border border-hairline bg-paper p-6">
      <dl className="divide-y divide-hairline">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between py-3">
            <dt className="text-sm text-ink-muted">{r.label}</dt>
            <dd className="text-sm font-medium text-onyx">{r.value || "—"}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-ink-faint">Profile editing is managed through your estate conversation in My Estate.</p>
    </section>
  );
}
