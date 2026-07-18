
-- 1. Foto de perfil para coaches
ALTER TABLE public.coaches ADD COLUMN IF NOT EXISTS foto_url text;

-- 2. Tabla de media por atleta (highlights: fotos curadas + videos por golpe)
CREATE TABLE public.athlete_media (
  id           uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  athlete_id   uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  type         text NOT NULL CHECK (type IN ('photo', 'video')),
  category     text NOT NULL,
  -- photos:  'photo_1'..'photo_5'
  -- videos:  'forehand' | 'backhand' | 'servicio' | 'volea' | 'devolucion'
  url          text,
  caption      text,
  sort_order   smallint DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  uploaded_by  uuid REFERENCES auth.users(id),
  -- un slot por golpe por atleta (video), y una posición por atleta (foto)
  UNIQUE (athlete_id, type, category)
);

ALTER TABLE public.athlete_media ENABLE ROW LEVEL SECURITY;

-- Lectura: coaches y atletas pueden leer (para cuando se construya la vista del atleta)
CREATE POLICY "athlete_media_read"
  ON public.athlete_media FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.coaches  WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.athletes WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.content_managers WHERE user_id = auth.uid())
  );

-- Escritura: solo content managers
CREATE POLICY "athlete_media_content_manager_write"
  ON public.athlete_media FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.content_managers WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.content_managers WHERE user_id = auth.uid())
  );

-- Trigger updated_at
CREATE TRIGGER athlete_media_updated_at
  BEFORE UPDATE ON public.athlete_media
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
