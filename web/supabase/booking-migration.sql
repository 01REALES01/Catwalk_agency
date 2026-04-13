-- ============================================================
-- Catwalk — Booking system migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1) Add approved / featured columns to model_profiles
ALTER TABLE public.model_profiles
  ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

-- Auto-approve existing models that have complete profiles
UPDATE public.model_profiles
SET approved = true
WHERE bio_profesional IS NOT NULL AND altura IS NOT NULL;

-- 2) Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  event_type  TEXT NOT NULL DEFAULT 'editorial',
  event_date  DATE,
  event_location TEXT,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','confirmed','declined','completed','cancelled')),
  admin_notes TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_model  ON public.bookings(model_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- 3) Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Clients can read their own bookings
CREATE POLICY "Clients read own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = client_id);

-- Models can read bookings assigned to them
CREATE POLICY "Models read own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = model_id);

-- Admins can read all bookings
CREATE POLICY "Admins read all bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.model_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can insert bookings (as clients)
CREATE POLICY "Clients create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Admins can update any booking (status, notes)
CREATE POLICY "Admins update bookings"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.model_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update model_profiles (approve/feature)
CREATE POLICY "Admins update profiles"
  ON public.model_profiles FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.model_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 4) Updated_at trigger for bookings
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
