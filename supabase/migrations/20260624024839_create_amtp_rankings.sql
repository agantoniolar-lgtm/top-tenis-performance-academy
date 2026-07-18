
-- Tabla de rankings AMTP scrapeados
-- Se actualiza periódicamente desde el scraper amtp_scraper.py
CREATE TABLE IF NOT EXISTS amtp_rankings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT NOT NULL,
  puntos      NUMERIC(10,2) NOT NULL DEFAULT 0,
  posicion    INTEGER NOT NULL,
  genero      TEXT NOT NULL CHECK (genero IN ('varonil', 'femenil')),
  fuente      TEXT NOT NULL DEFAULT 'api' CHECK (fuente IN ('api', 'dom')),
  scraped_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para búsqueda por nombre (coincidencia parcial)
CREATE INDEX IF NOT EXISTS amtp_rankings_nombre_idx ON amtp_rankings USING gin (to_tsvector('spanish', nombre));

-- Índice para filtrar por género y ordenar por puntos
CREATE INDEX IF NOT EXISTS amtp_rankings_genero_puntos_idx ON amtp_rankings (genero, puntos DESC);

-- RLS: lectura pública (los rankings son datos públicos de AMTP)
ALTER TABLE amtp_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "amtp_rankings_select_all"
  ON amtp_rankings FOR SELECT
  USING (true);

-- Solo service_role puede insertar/actualizar (el scraper usa la service key)
CREATE POLICY "amtp_rankings_insert_service"
  ON amtp_rankings FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "amtp_rankings_delete_service"
  ON amtp_rankings FOR DELETE
  USING (auth.role() = 'service_role');

-- Función helper: buscar ranking de un atleta por nombre (fuzzy)
CREATE OR REPLACE FUNCTION buscar_ranking_amtp(nombre_buscar TEXT)
RETURNS TABLE(posicion INTEGER, nombre TEXT, puntos NUMERIC, genero TEXT, scraped_at TIMESTAMPTZ)
LANGUAGE sql STABLE AS $$
  SELECT posicion, nombre, puntos, genero, scraped_at
  FROM amtp_rankings
  WHERE to_tsvector('spanish', amtp_rankings.nombre) @@ plainto_tsquery('spanish', nombre_buscar)
     OR amtp_rankings.nombre ILIKE '%' || nombre_buscar || '%'
  ORDER BY puntos DESC
  LIMIT 5;
$$;
