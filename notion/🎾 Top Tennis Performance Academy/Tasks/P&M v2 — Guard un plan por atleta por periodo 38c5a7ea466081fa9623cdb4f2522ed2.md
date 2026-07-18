# P&M v2 — Guard: un plan por atleta por periodo

Category: Dev
Epic: Phase 2 — Analytics
Notes: CONSTRUIDO. Unique index (athlete_id, period_start) WHERE status <> 'archived' en quarterly_plans (migración aplicada) + check en UI al continuar paso 1: si existe plan activo/completado para ese atleta+periodo, bloquea con mensaje y link al plan; si existe un draft, reanuda automático. Nota: la excepción de 'pasar la fecha del 3er reporte' mencionada en el scope NO se implementó (ambigua/baja prioridad) — hoy la única salida es archivar/borrar el plan existente. Lint+65 tests OK. Ref §14. Cerrado en barrido de kanban (13 Jul 2026, confirmado por Marco) — el commit 8e7560c ya incluía este guard; el bloqueo de .git/index.lock quedó resuelto sin reportarse por texto, confirmado ahora vía git log.
Priority: High
Status: Done
Type: Feature