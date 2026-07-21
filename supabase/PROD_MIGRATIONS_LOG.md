# Log de migraciones aplicadas a producción

Registro append-only: una fila por cada vez que una migración de `supabase/migrations/` se aplica al proyecto de **producción** (`rrrwhwciggohwxslqlho`), nunca al sandbox. El sandbox no necesita log — ahí se prueba libremente.

**Las 55 migraciones existentes hasta el 2026-07-20 no están listadas acá** — ya estaban aplicadas a producción desde antes de que este log existiera (ver `SETUP_CHECKLIST.md` sección 3b/4, verificado: 21 tablas en ambos proyectos, mismos nombres, RLS habilitado). Este log arranca con la primera migración pusheada a prod después de esa fecha.

## Procedimiento antes de agregar una fila (ver `verify-rls` skill sección 2 y `CLAUDE.md`)

1. Migración escrita como archivo en `supabase/migrations/`, pasa `node scripts/check-migrations-schema-only.mjs` (solo-schema, o con `-- ALLOW-DML: <razón>` explícito y revisado).
2. Aplicada primero al proyecto **sandbox** (`xchdawwajmnnhkncikig`).
3. Verificada ahí — si toca RLS/acceso, corridas las queries reales por rol (`verify-rls` sección 3); si es un cambio de schema puro, confirmado que no rompe nada existente.
4. Confirmación explícita de Marco de que está lista para producción — nunca automático, nunca por un merge o push.
5. Aplicada a producción, y **en el mismo momento** (no después) se agrega la fila correspondiente abajo.

## Log

| fecha | migración | aplicó | verificado en sandbox | confirmó Marco | notas |
|---|---|---|---|---|---|
| 2026-07-21 | `20260721205436_physical_protocol_rac_and_liderazgo_score.sql` | Claude (MCP) | Sí — schema confirmado igual a lo diseñado; policies de `report_physical`/`report_character` verificadas idénticas byte-a-byte antes/después (ninguna referencia los campos tocados por nombre); grants de columna uniformes en las 15/13 columnas de cada tabla, sin restricción por columna | Sí | T152. Verificación activa por rol (queries reales como coach/atleta) **no se pudo correr** — el sandbox no tiene ningún `auth.users` real, los coaches/atletas seed tienen `user_id = NULL`. Gap preexistente, no introducido por esta migración — ver T165 (backlog) para sembrar un coach/atleta real en sandbox y poder hacer esta verificación de verdad a futuro. |
