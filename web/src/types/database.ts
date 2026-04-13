export type ModelProfile = {
  user_id: string;
  nombre: string;
  altura: number | null;
  color_ojos: string | null;
  medidas: string | null;
  bio_profesional: string | null;
  foto_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRole = "model" | "admin";

export type AppUser = {
  id: string;
  email: string;
  role: UserRole;
};
