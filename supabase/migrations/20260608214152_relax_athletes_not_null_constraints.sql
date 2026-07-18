
-- Campos opcionales al registrarse — el atleta los completa después en su perfil
ALTER TABLE athletes ALTER COLUMN fecha_nacimiento DROP NOT NULL;
ALTER TABLE athletes ALTER COLUMN mano_dominante  DROP NOT NULL;

-- Insertar row de mdamian
INSERT INTO athletes (user_id, coach_id, nombre, apellido, fecha_ingreso, activo)
VALUES (
  '92798761-9ba2-4d64-b596-1a187c86ea3f',
  'd64b1bfa-8fa2-4c03-9748-158bcdef4017',
  'Marco',
  'Damián',
  CURRENT_DATE,
  true
);
