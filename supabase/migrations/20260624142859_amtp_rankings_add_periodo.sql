
-- Añadir columna periodo (YYYY-MM) para soportar historial
ALTER TABLE amtp_rankings ADD COLUMN IF NOT EXISTS periodo text;

-- Unique constraint: un jugador no puede tener dos filas para el mismo período
ALTER TABLE amtp_rankings
  ADD CONSTRAINT amtp_rankings_nombre_genero_periodo_key
  UNIQUE (nombre, genero, periodo);

-- Index para queries por período
CREATE INDEX IF NOT EXISTS amtp_rankings_periodo_idx ON amtp_rankings (periodo);
