"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type BookingActionState = { error?: string; ok?: boolean };

export async function createBooking(
  _prev: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para hacer un booking." };

  const model_id = String(formData.get("model_id") ?? "").trim();
  const client_name = String(formData.get("client_name") ?? "").trim();
  const client_email = String(formData.get("client_email") ?? "").trim();
  const event_type = String(formData.get("event_type") ?? "editorial").trim();
  const event_date = String(formData.get("event_date") ?? "").trim() || null;
  const event_location =
    String(formData.get("event_location") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!model_id || !client_name || !client_email) {
    return { error: "Nombre, email y modelo son obligatorios." };
  }

  const { error } = await supabase.from("bookings").insert({
    client_id: user.id,
    model_id,
    client_name,
    client_email,
    event_type,
    event_date,
    event_location,
    message,
  });

  if (error) return { error: error.message };

  revalidatePath(`/model/${model_id}`);
  revalidatePath("/client");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateBookingStatus(
  bookingId: string,
  status: string,
  adminNotes?: string,
): Promise<BookingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autorizado." };

  const { data: profile } = await supabase
    .from("model_profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") return { error: "Solo admin puede hacer esto." };

  const update: Record<string, string> = { status };
  if (adminNotes !== undefined) update.admin_notes = adminNotes;

  const { error } = await supabase
    .from("bookings")
    .update(update)
    .eq("id", bookingId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/client");
  return { ok: true };
}
