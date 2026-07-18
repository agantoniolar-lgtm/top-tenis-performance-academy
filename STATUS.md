# Project status — Top Tennis Performance Academy

maturity: pre-users

<!--
Solo Marco cambia el campo de arriba, y solo cuando el estado real del proyecto cambia.
Cada skill lee este campo para decidir cuánto rigor de sandbox/evals aplica. Ver CLAUDE.md.
-->

## Last session (2026-07-18)
Migración del flujo de construcción a los skills genéricos del kit. Se corrigió el bloque pegado en Cowork Settings → Project Instructions (seguía describiendo Notion + skills viejos). Se detectó que el registro de skills de Cowork estaba desincronizado del repo (duplicados obsoletos `commit-kanban-sync`/`session-open-close`, y faltaban `build`/`design`/`verify-tests`/`verify-evals`/`verify-ui` que ya existían en `.claude/skills/`) — se empaquetaron esos 5 con `skill-creator`/`package_skill.py` y Marco los instaló vía "Save skill". Se confirmó que el kit se auto-orquesta (cada skill declara a quién le entrega después) sin necesitar un orquestador central, por lo que se quitaron las referencias activas a `feature-build-flow` en `CLAUDE.md`, `COWORK_PROJECT_INSTRUCTIONS.md` y `.claude/skills/commit/SKILL.md`, dejando el archivo donde estaba. Al cerrar, Marco confirmó dos borrados intencionales sin comitear: `feature-build-flow/SKILL.md` (ya no hace falta) y `schema-rls-verification/SKILL.md` (generalizado como `verify-rls`, mismo patrón). En el barrido de `TASKS.md`, T156 (P&M v2 — separar outcome/carryover) se confirmó probado en vivo y con push hecho — movido a done. Detalle completo en `/logs/session-2026-07-18.md`.

## Pending / next session priority
1. Confirmar que `build`, `design`, `verify-tests`, `verify-evals`, `verify-ui` y `verify-rls` sigan apareciendo consistentemente en el registro de skills de Cowork — la desincronización de esta sesión podría reaparecer.
2. Retomar T086 (Landing — reescribir Home.jsx) y T102 (P&M v2 — close-quarterly-plan, master task bloqueado por el bug de carryover) — ambos siguen in progress, sin cambios esta sesión.
3. Backlog no bloqueante, sin fecha: 8 warnings de Supabase Advisors, decisión de branch-per-task, decisión de typing (JSDoc/PropTypes vs. dejarlo como está) — ver `SETUP_CHECKLIST.md`.
4. Backlog no bloqueante, sin fecha: evaluar si `TASKS.md` necesita separar "backlog de largo plazo" en un archivo aparte antes de que `BACKLOG.md` crezca demasiado.

## Decided / deferred
- El kit de skills se auto-orquesta (cada skill declara a quién le entrega después) — se descarta un skill "director" central; `feature-build-flow` ya no se referencia desde ningún archivo activo (decisión de Marco, 2026-07-18).
- `feature-build-flow/SKILL.md` y `schema-rls-verification/SKILL.md` se borraron del repo — superseded por el kit genérico y por `verify-rls` respectivamente (decisión explícita de Marco, 2026-07-18).
- `TASKS.md` es la fuente de verdad de tasks de aquí en adelante (decisión explícita de Marco, 2026-07-17) — reemplaza al kanban de Notion, que queda como archivo histórico.
- Warnings de Supabase Advisors, branch-per-task, y decisión de typing quedan como backlog de seguridad/proceso sin fecha — documentados en `SETUP_CHECKLIST.md`, a propósito no convertidos en tasks de `TASKS.md` todavía (decisión explícita de Marco, 2026-07-17).
