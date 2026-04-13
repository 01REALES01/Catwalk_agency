-- Run this in Supabase SQL Editor to add role support

-- 1. Add role column to model_profiles
ALTER TABLE public.model_profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'model';

-- 2. Set admin@catwalk.agency as admin
UPDATE public.model_profiles
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@catwalk.agency'
);

-- 3. Allow the role column to be read publicly (already covered by existing SELECT policy)
-- No new policy needed since "Public can read model profiles" already allows SELECT on all columns.
