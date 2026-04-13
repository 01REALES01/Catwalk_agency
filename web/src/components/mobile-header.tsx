import Link from "next/link";

export function MobileHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between border-b-[0.5px] border-primary/10 bg-surface px-6 py-4 md:hidden">
      <Link
        href="/"
        className="font-headline text-2xl font-black uppercase tracking-tighter text-primary"
      >
        Catwalk
      </Link>
    </header>
  );
}
