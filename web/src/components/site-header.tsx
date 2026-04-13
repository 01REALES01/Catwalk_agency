import Link from "next/link";

const nav = [
  { href: "/#roster", label: "Models" },
  { href: "/#philosophy", label: "Philosophy" },
  { href: "/register", label: "Apply" },
];

export function SiteHeader() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-surface">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <Link
          href="/"
          className="font-headline text-2xl font-black uppercase tracking-tighter text-primary md:text-3xl"
        >
          Catwalk
        </Link>
        <div className="hidden items-center gap-8 md:flex md:gap-12">
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
          className="font-headline text-[0.6875rem] uppercase tracking-widest text-primary border-b border-primary pb-0.5 transition-opacity duration-100 hover:opacity-60 active:scale-95"
        >
          Model login
        </Link>
      </div>
    </nav>
  );
}
