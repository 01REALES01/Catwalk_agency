"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp, type ActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export function RegisterForm() {
  const [state, formAction] = useActionState(signUp, initial);
  const [role, setRole] = useState<"model" | "client">("model");

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="role" value={role} />

      {/* Role selector */}
      <div className="space-y-3">
        <Label>Tipo de cuenta</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("model")}
            className={`flex flex-col items-center gap-2 border px-4 py-5 text-center transition-all ${
              role === "model"
                ? "border-secondary bg-secondary/5"
                : "border-outline-variant/30 hover:border-primary/40"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">person</span>
            <span className="font-headline text-xs font-bold uppercase tracking-widest">
              Modelo
            </span>
            <span className="font-body text-[10px] leading-tight text-primary/50">
              Quiero ser representada
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`flex flex-col items-center gap-2 border px-4 py-5 text-center transition-all ${
              role === "client"
                ? "border-secondary bg-secondary/5"
                : "border-outline-variant/30 hover:border-primary/40"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              business_center
            </span>
            <span className="font-headline text-xs font-bold uppercase tracking-widest">
              Cliente
            </span>
            <span className="font-body text-[10px] leading-tight text-primary/50">
              Busco contratar talento
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            required
            placeholder="Tu nombre"
          />
        </div>
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
            autoComplete="new-password"
            required
            minLength={6}
          />
        </div>
      </div>
      {state.error ? (
        <p className="font-body text-sm text-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p className="font-body text-sm text-primary-fixed-dim" role="status">
          {state.message}
        </p>
      ) : null}
      <div className="mt-auto flex flex-col gap-5 border-t border-outline-variant/25 pt-8">
        <Button type="submit" className="w-full" size="lg" variant="secondary">
          Crear cuenta
        </Button>
        <p className="text-center font-label text-[0.6875rem] uppercase tracking-widest text-primary opacity-60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-secondary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </form>
  );
}
