# Project status — Top Tennis Performance Academy

maturity: pre-users

<!--
Solo Marco cambia el campo de arriba, y solo cuando el estado real del proyecto cambia.
Cada skill lee este campo para decidir cuánto rigor de sandbox/evals aplica. Ver CLAUDE.md.
-->

## Last session (2026-07-18, sesión b)
`TASKS.md` quedó vacío: los dos tasks que seguían `in progress` resultaron estar ya terminados. T086 (Landing — reescribir Home.jsx) ya estaba comiteado desde el 2026-06-22 (commit `ff343bf`), verificado contra el scope y confirmado por Marco sin cambios de código. T102 (P&M v2 — close-quarterly-plan) tenía su bloqueo (bug de carryover, §16.2) ya resuelto por T156; se confirmó que el resto de los hallazgos de la primera corrida en vivo (§16 del scope doc) ya estaban repartidos en tasks de backlog independientes o ya construidos (badges de scores, §16.9 — nota del doc corregida). Ambos archivados como `done`. De paso se corrigió una colisión de IDs (`T157` usado dos veces) renumerando el de backlog a `T158`. Con el tracker de tasks activos vacío, se hizo una limpieza completa de `BACKLOG.md` (71→62 filas): 7 ítems eliminados por estar ya construidos o superados (verificado contra código/git, no solo la nota), 2 fusionados en uno (T098+T121 → dentro de T152, gap de physical+liderazgo), varios recortados/repriorizados (T033, T103, T078, T126). Detalle completo en `/logs/session-2026-07-18-b.md`.

## Pending / next session priority
1. `TASKS.md` está vacío — decidir qué se promueve primero. Candidato natural: **T152** (backlog — catálogo de métricas físicas + score de liderazgo en `report_character`), dado que Marco ya confirmó tener la información necesaria para arrancar la parte de physical.
2. T116 (CMS↔sitio público, backlog) sigue en pausa hasta la junta con marketing — confirmar si ya sucedió.
3. Backlog no bloqueante, sin fecha: 8 warnings de Supabase Advisors, decisión de branch-per-task, decisión de typing (JSDoc/PropTypes vs. dejarlo como está) — ver `SETUP_CHECKLIST.md`.
4. Backlog no bloqueante, sin fecha: evaluar si `TASKS.md` necesita separar "backlog de largo plazo" en un archivo aparte antes de que `BACKLOG.md` crezca demasiado.

## Decided / deferred
- El kit de skills se auto-orquesta (cada skill declara a quién le entrega después) — se descarta un skill "director" central; `feature-build-flow` ya no se referencia desde ningún archivo activo (decisión de Marco, 2026-07-18).
- `feature-build-flow/SKILL.md` y `schema-rls-verification/SKILL.md` se borraron del repo — superseded por el kit genérico y por `verify-rls` respectivamente (decisión explícita de Marco, 2026-07-18).
- `TASKS.md` es la fuente de verdad de tasks de aquí en adelante (decisión explícita de Marco, 2026-07-17) — reemplaza al kanban de Notion, que queda como archivo histórico.
- Warnings de Supabase Advisors, branch-per-task, y decisión de typing quedan como backlog de seguridad/proceso sin fecha — documentados en `SETUP_CHECKLIST.md`, a propósito no convertidos en tasks de `TASKS.md` todavía (decisión explícita de Marco, 2026-07-17).
- T152 (physical + liderazgo) se deja deliberadamente en backlog esta sesión pese a que Marco ya tiene la info para arrancarlo — se priorizó terminar la limpieza del backlog antes de abrir trabajo nuevo (decisión de Marco, 2026-07-18).
- T078 (SwingVision) confirmado depriorizado por Marco (2026-07-18) — sin acción esperada, solo documentado.
