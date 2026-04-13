import Link from "next/link";
import { signOut } from "@/app/actions/auth";

type NavItem = { href: string; label: string };

type UserRole = "admin" | "model" | "client" | null;

type SiteHeaderProps = {
  role?: UserRole;
};

function navItems(role: UserRole): NavItem[] {
  if (role === "admin") {
    return [
      { href: "/admin", label: "HQ Control" },
      { href: "/admin#models", label: "Models" },
      { href: "/admin#bookings", label: "Bookings" },
    ];
  }
  if (role === "model") {
    return [
      { href: "/dashboard", label: "My Dashboard" },
      { href: "/#roster", label: "Models" },
    ];
  }
  if (role === "client") {
    return [
      { href: "/client", label: "My Bookings" },
      { href: "/#roster", label: "Browse Models" },
    ];
  }
  return [
    { href: "/#roster", label: "Models" },
    { href: "/register", label: "Apply" },
  ];
}

function dashboardHref(role: UserRole): string {
  if (role === "admin") return "/admin";
  if (role === "client") return "/client";
  return "/dashboard";
}

function rightAction(role: UserRole) {
  if (role) {
    return (
      <form action={signOut}>
        <button
          type="submit"
          className="border border-primary/20 px-6 py-3 font-headline text-[0.6875rem] uppercase tracking-widest text-primary transition-all duration-150 hover:bg-primary hover:text-white active:scale-95"
        >
          Sign out
        </button>
      </form>
    );
  }
  return (
    <Link
      href="/login"
      className="border border-primary/20 px-6 py-3 font-headline text-[0.6875rem] uppercase tracking-widest text-primary transition-all duration-150 hover:bg-primary hover:text-white active:scale-95"
    >
      Login
    </Link>
  );
}

export function SiteHeader({ role = null }: SiteHeaderProps) {
  const items = navItems(role);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b-[0.5px] border-primary/10 bg-surface">
      {/* Mobile header */}
      <div className="flex w-full items-center justify-between px-6 py-4 md:hidden">
        <Link
          href={role ? dashboardHref(role) : "/"}
          className="font-headline text-2xl font-black uppercase tracking-tighter text-primary"
        >
          Catwalk
        </Link>
        {role ? (
          <form action={signOut}>
            <button
              type="submit"
              className="material-symbols-outlined text-primary/60"
              aria-label="Sign out"
            >
              logout
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="font-label text-[10px] font-semibold uppercase tracking-widest text-secondary"
          >
            Login
          </Link>
        )}
      </div>

      {/* Desktop header */}
      <div className="mx-auto hidden w-full max-w-[1440px] items-center justify-between px-12 py-8 md:flex">
        <Link
          href={role ? dashboardHref(role) : "/"}
          className="font-headline text-3xl font-black uppercase tracking-tighter text-primary"
        >
          Catwalk
        </Link>
        <div className="flex items-center gap-12">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 transition-opacity duration-150 hover:opacity-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
        {rightAction(role)}
      </div>
    </nav>
  );
}
