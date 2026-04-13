import Link from "next/link";
import { signOut } from "@/app/actions/auth";

const nav = [
  { href: "/#roster", label: "Models" },
  { href: "/#philosophy", label: "Philosophy" },
  { href: "/register", label: "Apply" },
];

type SiteHeaderProps = {
  /** Matches admin_panel_catwal: Models active (secondary), Client Login button */
  variant?: "default" | "admin";
  /** Logged-in admin: show Sign out instead of Client Login */
  adminSession?: boolean;
};

export function SiteHeader({
  variant = "default",
  adminSession = false,
}: SiteHeaderProps) {
  const isAdmin = variant === "admin";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b-[0.5px] border-primary/10 bg-surface">
      {/* Mobile header — admin pages use their own top bar */}
      {!isAdmin ? (
        <div className="flex w-full items-center justify-between px-6 py-4 md:hidden">
          <Link
            href="/"
            className="font-headline text-2xl font-black uppercase tracking-tighter text-primary"
          >
            Catwalk
          </Link>
        </div>
      ) : null}
      {/* Desktop header — admin_panel_catwal */}
      <div className="mx-auto hidden w-full max-w-[1440px] items-center justify-between px-12 py-8 md:flex">
        <Link
          href="/"
          className="font-headline text-3xl font-black uppercase tracking-tighter text-primary"
        >
          Catwalk
        </Link>
        <div className="flex items-center gap-12">
          {nav.map((item) => {
            const active = isAdmin && item.href === "/#roster";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "border-b-2 border-secondary pb-1 font-headline text-[0.6875rem] uppercase tracking-widest text-secondary transition-opacity duration-150 hover:opacity-100"
                    : "font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 transition-opacity duration-150 hover:opacity-100"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        {isAdmin ? (
          adminSession ? (
            <form action={signOut}>
              <button
                type="submit"
                className="border border-primary/20 px-6 py-3 font-headline text-[0.6875rem] uppercase tracking-widest text-primary transition-all duration-150 hover:bg-primary hover:text-white active:scale-95"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="border border-primary/20 px-6 py-3 font-headline text-[0.6875rem] uppercase tracking-widest text-primary transition-all duration-150 hover:bg-primary hover:text-white active:scale-95"
            >
              Client Login
            </Link>
          )
        ) : (
          <Link
            href="/login"
            className="border-b border-primary pb-0.5 font-headline text-[0.6875rem] uppercase tracking-widest text-primary transition-opacity duration-100 hover:opacity-60 active:scale-95"
          >
            Model login
          </Link>
        )}
      </div>
    </nav>
  );
}
