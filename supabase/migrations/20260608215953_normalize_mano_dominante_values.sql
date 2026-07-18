
-- Normalizar valores históricos
UPDATE athletes SET mano_dominante = 'diestro' WHERE mano_dominante = 'derecha';
UPDATE athletes SET mano_dominante = 'zurdo'   WHERE mano_dominante = 'zurda';

-- Restaurar constraint con valores correctos
ALTER TABLE athletes
  ADD CONSTRAINT athletes_mano_dominante_check
  CHECK (mano_dominante IN ('diestro', 'zurdo'));
