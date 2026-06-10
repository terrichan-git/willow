"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" },
  { href: "/setup", label: "My Estate", icon: "M4 7h16M4 12h16M4 17h10" },
  { href: "/companion", label: "Companion", icon: "M12 3a4 4 0 014 4v3a4 4 0 01-8 0V7a4 4 0 014-4zM6 11a6 6 0 0012 0M12 17v4" },
  { href: "/legal-tax", label: "Legal & Tax", icon: "M12 3l8 4-8 4-8-4 8-4zM4 11l8 4 8-4M4 15l8 4 8-4" },
  { href: "/tasks", label: "Tasks", icon: "M5 12l4 4L19 6" },
  { href: "/settings/billing", label: "Settings", icon: "M12 8a4 4 0 100 8 4 4 0 000-8zM3 12h3M18 12h3M12 3v3M12 18v3" },
];

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" opacity="0.9" />
      <path d="M5 19C9 13 13 9 19 5" stroke="white" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition " +
              (active ? "bg-emerald-100 text-emerald-900" : "text-stone-600 hover:bg-stone-100 hover:text-stone-900")
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 px-1">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white">
        <Leaf className="h-5 w-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-stone-900">Willow</span>
    </Link>
  );
}

function UserChip() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">M</span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-stone-800">Maria Chen</p>
        <p className="truncate text-xs text-stone-500">Full Estate Plan</p>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 md:border-r md:border-stone-200 md:bg-white md:px-4 md:py-5">
        <Brand />
        <div className="mt-8 flex-1">
          <NavLinks pathname={pathname} />
        </div>
        <UserChip />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-20 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
        <Brand />
        <button onClick={() => setOpen((o) => !o)} aria-label="Menu" className="rounded-lg p-2 text-stone-600 hover:bg-stone-100">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"} />
          </svg>
        </button>
      </header>
      {open && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 py-3">
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          <div className="mt-3">
            <UserChip />
          </div>
        </div>
      )}
    </>
  );
}
