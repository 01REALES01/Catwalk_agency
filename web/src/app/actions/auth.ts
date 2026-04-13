"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/database";

export type ActionState = { error?: string; message?: string };

async function resolveRedirect(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string> {
  const { data } = await supabase
    .from("model_profiles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (data?.role === "admin") return "/admin";
  if (data?.role === "client") return "/client";
  return "/dashboard";
}

export async function signIn(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Email y contraseña son obligatorios." };
  }

  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.message };

  const dest = await resolveRedirect(supabase, authData.user.id);
  redirect(dest);
}

export async function signUp(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const role = (String(formData.get("role") ?? "model").trim() as UserRole);

  if (!email || !password) {
    return { error: "Email y contraseña son obligatorios." };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined,
      data: { role },
    },
  });
  if (error) return { error: error.message };

  if (!authData.user) {
    return { error: "No se pudo crear la cuenta. Intenta de nuevo." };
  }

  const profileData: Record<string, string> = {
    user_id: authData.user.id,
    nombre: nombre || email.split("@")[0],
    role,
  };

  await supabase.from("model_profiles").upsert(profileData, {
    onConflict: "user_id",
  });

  // Auto-login after registration
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    return {
      message:
        "Cuenta creada. Si necesitas confirmar tu email, revisa tu correo. Si no, inicia sesión.",
    };
  }

  const dest = await resolveRedirect(supabase, authData.user.id);
  redirect(dest);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
