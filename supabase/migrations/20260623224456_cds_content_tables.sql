
-- ============================================================
-- CDS — Content Delivery System
-- ============================================================

-- 1. content_managers: determina rol 'Content' en useAuth
-- ============================================================
CREATE TABLE public.content_managers (
  id         uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id    uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre     text NOT NULL,
  apellido   text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.content_managers ENABLE ROW LEVEL SECURITY;

-- Solo el propio content manager puede leer su fila
CREATE POLICY "content_managers_self_select"
  ON public.content_managers FOR SELECT
  USING (auth.uid() = user_id);

-- Solo el propio content manager puede actualizar su fila
CREATE POLICY "content_managers_self_update"
  ON public.content_managers FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert abierto para signup (igual que coaches)
CREATE POLICY "content_managers_insert"
  ON public.content_managers FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- 2. content_blocks: texto editable por slot/página
-- ============================================================
CREATE TABLE public.content_blocks (
  id           uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  page         text NOT NULL,          -- 'home' | 'nosotros' | 'programas' | 'camino-usa'
  slot         text NOT NULL,          -- 'hero_titulo' | 'hero_subtitulo' | etc.
  value        text,                   -- el contenido actual
  updated_at   timestamptz NOT NULL DEFAULT now(),
  updated_by   uuid REFERENCES auth.users(id),
  UNIQUE (page, slot)
);

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

-- Lectura pública (el sitio público lee estos bloques sin auth)
CREATE POLICY "content_blocks_public_select"
  ON public.content_blocks FOR SELECT
  USING (true);

-- Solo content managers pueden escribir
CREATE POLICY "content_blocks_content_manager_write"
  ON public.content_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.content_managers
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content_managers
      WHERE user_id = auth.uid()
    )
  );


-- 3. media_assets: URLs de imágenes y videos por slot/página
-- ============================================================
CREATE TABLE public.media_assets (
  id           uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  page         text NOT NULL,          -- 'home' | 'nosotros' | etc.
  slot         text NOT NULL,          -- 'hero_imagen' | 'video_principal' | etc.
  url          text,                   -- URL pública de Storage o YouTube
  type         text NOT NULL CHECK (type IN ('image', 'video')),
  label        text,                   -- etiqueta legible: 'Hero — imagen principal'
  updated_at   timestamptz NOT NULL DEFAULT now(),
  updated_by   uuid REFERENCES auth.users(id),
  UNIQUE (page, slot)
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "media_assets_public_select"
  ON public.media_assets FOR SELECT
  USING (true);

-- Solo content managers pueden escribir
CREATE POLICY "media_assets_content_manager_write"
  ON public.media_assets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.content_managers
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content_managers
      WHERE user_id = auth.uid()
    )
  );

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER content_blocks_updated_at
  BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER media_assets_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
