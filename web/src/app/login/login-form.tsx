"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type ActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, initial);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@agency.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
      </div>
      {state.error ? (
        <p className="font-body text-sm text-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="mt-auto flex flex-col gap-5 border-t border-outline-variant/25 pt-8">
        <Button type="submit" className="w-full" size="lg">
          Entrar
        </Button>
        <p className="text-center font-label text-[0.6875rem] uppercase tracking-widest text-primary opacity-60">
          ¿Sin cuenta?{" "}
          <Link href="/register" className="text-secondary hover:underline">
            Registrarse
          </Link>
        </p>
      </div>
    </form>
  );
}
