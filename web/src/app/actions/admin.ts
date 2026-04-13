"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleModelApproval(modelId: string, approved: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("model_profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") return;

  await supabase
    .from("model_profiles")
    .update({ approved })
    .eq("user_id", modelId);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function toggleModelFeatured(modelId: string, featured: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("model_profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") return;

  await supabase
    .from("model_profiles")
    .update({ featured })
    .eq("user_id", modelId);

  revalidatePath("/admin");
  revalidatePath("/");
}
