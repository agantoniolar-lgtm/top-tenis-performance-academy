
-- RLS policies para storage.objects (bucket public-media)

-- Lectura pública
CREATE POLICY "public-media public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'public-media');

-- Solo content managers pueden subir
CREATE POLICY "public-media content manager insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'public-media'
    AND EXISTS (
      SELECT 1 FROM public.content_managers
      WHERE user_id = auth.uid()
    )
  );

-- Solo content managers pueden actualizar
CREATE POLICY "public-media content manager update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'public-media'
    AND EXISTS (
      SELECT 1 FROM public.content_managers
      WHERE user_id = auth.uid()
    )
  );

-- Solo content managers pueden borrar
CREATE POLICY "public-media content manager delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'public-media'
    AND EXISTS (
      SELECT 1 FROM public.content_managers
      WHERE user_id = auth.uid()
    )
  );
