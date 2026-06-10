"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/settings/billing", label: "Billing & plan" },
  { href: "/settings/profile", label: "Profile" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Settings</h1>
      <div className="flex gap-1 border-b border-stone-200">
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition " +
                (active ? "border-emerald-600 text-emerald-800" : "border-transparent text-stone-500 hover:text-stone-800")
              }
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
