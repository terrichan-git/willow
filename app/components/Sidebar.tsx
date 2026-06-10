"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" },
  { href: "/setup", label: "My Estate", icon: "M4 7h16M4 12h16M4 17h10" },
  { href: "/voice", label: "Record your voice", icon: "M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" },
  { href: "/companion", label: "Companion", icon: "M12 3a4 4 0 014 4v3a4 4 0 01-8 0V7a4 4 0 014-4zM6 11a6 6 0 0012 0M12 17v4" },
  { href: "/legal-tax", label: "Legal & Tax", icon: "M12 3l8 4-8 4-8-4 8-4zM4 11l8 4 8-4M4 15l8 4 8-4" },
  { href: "/tasks", label: "Tasks", icon: "M5 12l4 4L19 6" },
  { href: "/settings/billing", label: "Settings", icon: "M12 8a4 4 0 100 8 4 4 0 000-8zM3 12h3M18 12h3M12 3v3M12 18v3" },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition " +
              (active
                ? "bg-paper text-teal shadow-[0_1px_3px_rgba(28,58,46,0.08)]"
                : "text-ink-muted hover:bg-sage-mist hover:text-onyx")
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
    <Link href="/" className="flex items-center gap-2.5 px-2 py-1">
      <Image src="/willow-leaf-mark.png" alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
      <span className="font-display text-[22px] font-medium text-onyx">Willow</span>
    </Link>
  );
}

function UserChip() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-hairline bg-paper px-3 py-2.5">
      <span className="font-display flex h-8 w-8 items-center justify-center rounded-full bg-sage-soft text-[15px] font-medium text-onyx">M</span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-onyx">Maria Chen</p>
        <p className="truncate text-xs text-ink-muted">Full estate plan</p>
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
      <aside className="hidden md:flex md:w-[248px] md:flex-col md:fixed md:inset-y-0 md:border-r md:border-hairline md:bg-sunken md:px-4 md:py-5">
        <Brand />
        <div className="mt-8 flex-1">
          <NavLinks pathname={pathname} />
        </div>
        <UserChip />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-20 flex items-center justify-between border-b border-hairline bg-chalk px-4 py-3">
        <Brand />
        <button onClick={() => setOpen((o) => !o)} aria-label="Menu" className="rounded-lg p-2 text-ink-muted hover:bg-sage-mist">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"} />
          </svg>
        </button>
      </header>
      {open && (
        <div className="md:hidden border-b border-hairline bg-chalk px-4 py-3">
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          <div className="mt-3">
            <UserChip />
          </div>
        </div>
      )}
    </>
  );
}
