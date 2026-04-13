"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileActionState = { error?: string; ok?: boolean };

export async function upsertProfile(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesión no válida. Vuelve a iniciar sesión." };
  }

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) {
    return { error: "El nombre es obligatorio." };
  }

  const alturaRaw = String(formData.get("altura") ?? "").trim();
  const altura =
    alturaRaw === "" ? null : Number.parseFloat(alturaRaw.replace(",", "."));
  if (alturaRaw !== "" && (Number.isNaN(altura!) || altura! <= 0)) {
    return { error: "Altura inválida (usa centímetros, ej. 175)." };
  }

  const color_ojos = String(formData.get("color_ojos") ?? "").trim() || null;
  const medidas = String(formData.get("medidas") ?? "").trim() || null;
  const bio_profesional =
    String(formData.get("bio_profesional") ?? "").trim() || null;

  const { error } = await supabase.from("model_profiles").upsert(
    {
      user_id: user.id,
      nombre,
      altura,
      color_ojos,
      medidas,
      bio_profesional,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true };
}
