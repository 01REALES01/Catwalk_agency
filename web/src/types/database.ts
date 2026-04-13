export type UserRole = "model" | "admin" | "client";

export type ModelProfile = {
  user_id: string;
  nombre: string;
  altura: number | null;
  color_ojos: string | null;
  medidas: string | null;
  bio_profesional: string | null;
  foto_url: string | null;
  role?: UserRole;
  approved: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "completed"
  | "cancelled";

export type Booking = {
  id: string;
  client_id: string;
  model_id: string;
  client_name: string;
  client_email: string;
  event_type: string;
  event_date: string | null;
  event_location: string | null;
  message: string | null;
  status: BookingStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  /** Joined from model_profiles when needed */
  model_profiles?: Pick<ModelProfile, "nombre" | "foto_url"> | null;
};

export type AppUser = {
  id: string;
  email: string;
  role: UserRole;
};
