import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Login — Catwalk",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-24 md:px-12">
      <div className="mx-auto w-full max-w-md pt-12">
        <Link
          href="/"
          className="font-headline text-2xl font-black uppercase tracking-tighter text-primary"
        >
          Catwalk
        </Link>
        <p className="mt-8 font-label text-[0.6875rem] uppercase tracking-[0.2em] text-secondary">
          Model access
        </p>
        <h1 className="mt-2 font-headline text-4xl font-black uppercase tracking-tighter text-primary">
          Iniciar sesión
        </h1>
        <div className="mt-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
