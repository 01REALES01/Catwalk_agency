import Link from "next/link";
import { LoginForm } from "./login-form";
import { PageBack } from "@/components/page-back";

export const metadata = {
  title: "Login — Catwalk",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-outline-variant/20 bg-surface/95 backdrop-blur-sm supports-[backdrop-filter]:bg-surface/85">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-2 px-4 sm:px-6">
          <PageBack href="/" label="Inicio" />
          <span className="h-5 w-px shrink-0 bg-outline-variant/35" aria-hidden />
          <Link
            href="/"
            className="min-w-0 truncate font-headline text-lg font-black uppercase tracking-tighter text-primary sm:text-xl"
          >
            Catwalk
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 pb-12 pt-8 sm:px-6 md:px-8 md:pt-12">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <p className="font-label text-[0.6875rem] uppercase tracking-[0.2em] text-secondary">
            Model access
          </p>
          <h1 className="mt-2 font-headline text-3xl font-black uppercase tracking-tighter text-primary sm:text-4xl">
            Iniciar sesión
          </h1>
          <div className="mt-10 flex-1">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
