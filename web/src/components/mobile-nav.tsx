"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; icon: string };

const PUBLIC_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/#roster", label: "Models", icon: "groups" },
  { href: "/#philosophy", label: "Philosophy", icon: "auto_awesome" },
  { href: "/login", label: "Login", icon: "lock" },
];

const MODEL_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "dashboard" },
  { href: "/#roster", label: "Models", icon: "groups" },
  { href: "/#philosophy", label: "Philosophy", icon: "auto_awesome" },
];

const ADMIN_ITEMS: NavItem[] = [
  { href: "/admin", label: "HQ", icon: "dashboard" },
  { href: "/#roster", label: "Talent", icon: "groups" },
  { href: "/dashboard", label: "Profile", icon: "person" },
];

export function MobileBottomNav({ role }: { role?: "model" | "admin" | "public" }) {
  const pathname = usePathname();
  const items =
    role === "admin" ? ADMIN_ITEMS : role === "model" ? MODEL_ITEMS : PUBLIC_ITEMS;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t-[0.5px] border-primary/5 bg-surface/80 px-6 py-4 backdrop-blur-xl md:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${active ? "font-black italic text-secondary" : "text-primary/60"}`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-label text-[8px] uppercase tracking-tighter">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
