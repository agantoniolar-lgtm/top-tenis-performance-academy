---
name: schema-rls-verification
description: Retirado el 2026-07-18 — reemplazado por el skill genérico verify-rls. Usa verify-rls para cualquier creación/cambio de tabla o política de acceso, o reporte de bug de acceso.
---

# Retirado — usa `verify-rls` en su lugar

El procedimiento de este skill se generalizó en `verify-rls` (kit AE v0.7), que lee el modelo de roles de este proyecto desde `docs/db-schema.md` y sus convenciones de Git/stack desde `CLAUDE.md`, en vez de tener los datos de este proyecto hardcodeados en el texto del skill. No se perdió nada al retirarlo: el modelo de roles real siempre vivió en `docs/db-schema.md`, no aquí — este archivo solo tenía un extracto ilustrativo y ya remitía a ese doc como fuente de verdad. Los project refs de Supabase (prod `rrrwhwciggohwxslqlho`, sandbox `xchdawwajmnnhkncikig`) ya están en `SETUP_CHECKLIST.md`.

Si esta carpeta sigue aquí es porque una sesión de Cowork no puede borrar una carpeta de skill. Bórrala (`.claude/skills/schema-rls-verification/`) la próxima vez que se abra este proyecto en Claude Code o una terminal nativa.
