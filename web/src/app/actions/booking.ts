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

  const hours = parseFloat(String(formData.get("hours") ?? "")) || null;
  const budget = parseFloat(String(formData.get("budget") ?? "")) || null;

  const { error } = await supabase.from("bookings").insert({
    client_id: user.id,
    model_id,
    client_name,
    client_email,
    event_type,
    event_date,
    event_location,
    hours,
    budget,
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

  const isAdmin = profile?.role === "admin";

  // Models can only accept/decline bookings assigned to them
  if (!isAdmin) {
    const { data: booking } = await supabase
      .from("bookings")
      .select("model_id, status")
      .eq("id", bookingId)
      .maybeSingle();

    if (!booking || booking.model_id !== user.id) {
      return { error: "No tienes permiso para modificar este booking." };
    }
    if (booking.status !== "pending") {
      return { error: "Solo puedes aceptar o rechazar bookings pendientes." };
    }
    if (status !== "confirmed" && status !== "declined") {
      return { error: "Solo puedes confirmar o rechazar." };
    }
  }

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
