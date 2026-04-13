-- ============================================================
-- Catwalk — Pricing migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1) Add hourly rate to model profiles
ALTER TABLE public.model_profiles
  ADD COLUMN IF NOT EXISTS tarifa_hora NUMERIC(10,2) DEFAULT NULL;

-- 2) Add hours and budget to bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS hours NUMERIC(5,1) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS budget NUMERIC(10,2) DEFAULT NULL;

-- 3) Allow models to update their own bookings (accept/decline)
CREATE POLICY "Models update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = model_id);
