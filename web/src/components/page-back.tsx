import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type PageBackProps = {
  href: string;
  label?: string;
  className?: string;
};

/** Mobile-first back navigation (auth, inner pages, portfolio). */
export function PageBack({ href, label = "Volver", className }: PageBackProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center gap-1 rounded-none border border-transparent px-2 py-2 font-label text-[0.6875rem] font-semibold uppercase tracking-widest text-primary opacity-80 transition-colors hover:border-outline-variant/40 hover:opacity-100 hover:text-secondary active:scale-[0.98]",
        className,
      )}
    >
      <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden />
      <span className="max-w-[9rem] truncate sm:max-w-none">{label}</span>
    </Link>
  );
}
