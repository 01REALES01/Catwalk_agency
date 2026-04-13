import Link from "next/link";

const nav = [
  { href: "/#roster", label: "Models" },
  { href: "/#philosophy", label: "Philosophy" },
  { href: "/register", label: "Apply" },
];

export function SiteHeader() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b-[0.5px] border-primary/10 bg-surface">
      {/* Mobile header */}
      <div className="flex w-full items-center justify-between px-6 py-4 md:hidden">
        <Link
          href="/"
          className="font-headline text-2xl font-black uppercase tracking-tighter text-primary"
        >
          Catwalk
        </Link>
      </div>
      {/* Desktop header */}
      <div className="mx-auto hidden w-full max-w-[1440px] items-center justify-between px-12 py-8 md:flex">
        <Link
          href="/"
          className="font-headline text-3xl font-black uppercase tracking-tighter text-primary"
        >
          Catwalk
        </Link>
        <div className="flex items-center gap-12">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary opacity-60 transition-opacity duration-150 hover:opacity-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/login"
          className="border-b border-primary pb-0.5 font-headline text-[0.6875rem] uppercase tracking-widest text-primary transition-opacity duration-100 hover:opacity-60 active:scale-95"
        >
          Model login
        </Link>
      </div>
    </nav>
  );
}
