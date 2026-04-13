-- ============================================================
-- Catwalk — Storage bucket for model photos
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1) Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('model-photos', 'model-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2) Allow authenticated users to upload their own photos
CREATE POLICY "Models upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'model-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3) Allow authenticated users to update/replace their own photos
CREATE POLICY "Models update own photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'model-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4) Allow authenticated users to delete their own photos
CREATE POLICY "Models delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'model-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5) Public read access (photos are public for the portfolio)
CREATE POLICY "Public read model photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'model-photos');
