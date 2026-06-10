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
      <h1 className="font-display text-[30px] font-normal leading-tight text-onyx">Settings</h1>
      <div className="flex gap-1 border-b border-hairline">
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition " +
                (active ? "border-teal text-teal-deep" : "border-transparent text-ink-muted hover:text-onyx")
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
