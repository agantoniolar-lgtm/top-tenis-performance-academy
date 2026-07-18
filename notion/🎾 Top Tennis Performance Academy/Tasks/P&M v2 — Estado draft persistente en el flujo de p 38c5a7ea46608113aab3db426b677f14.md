# P&M v2 — Estado draft persistente en el flujo de planes

Category: Dev
Epic: Phase 2 — Analytics
Notes: CONSTRUIDO. Columna draft_state (jsonb) en quarterly_plans (migración aplicada). PlanesCoach: crea draft al pasar paso 1→2, persiste dump/focos/objetivos en checkpoints (identify/generate/regenerate), guardar plan actualiza el draft (ya no inserta). Lista permite reanudar (click) o descartar borrador. Lint+65 tests OK. Ref §14. Cerrado en barrido de kanban (13 Jul 2026, confirmado por Marco) — comiteado junto con el guard de un plan por atleta/periodo en 8e7560c; el bloqueo de .git/index.lock quedó resuelto sin reportarse por texto, confirmado ahora vía git log.
Priority: High
Status: Done
Type: Feature