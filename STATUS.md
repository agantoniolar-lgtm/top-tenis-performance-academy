# Project status — Top Tennis Performance Academy

maturity: pre-users

<!--
Solo Marco cambia el campo de arriba, y solo cuando el estado real del proyecto cambia.
Cada skill lee este campo para decidir cuánto rigor de sandbox/evals aplicar. Ver CLAUDE.md.
-->

## Last session (2026-07-17)
Cierre del retrofit de `/setup`, en varias rebanadas. **Seguridad:** se rotó el `SUPABASE_SERVICE_KEY` filtrado (migración a Default publishable/secret keys nuevas, legacy `anon`/`service_role` desactivadas), se sacó `.env` del tracking de git, y se encontró y remedió una segunda fuga — la contraseña real de Postgres estaba en texto plano en `docs/db-schema.md` desde el commit `bd7632f`; Marco la rotó y el doc ahora solo referencia `SUPABASE_DB_PASSWORD_PROD` en `.env.local`. **Sandbox:** se creó el proyecto `top-tennis-performance-academy-sandbox` (ref `xchdawwajmnnhkncikig`, free tier), se reconstruyeron las 55 migraciones de producción como archivos en `supabase/migrations/` y se aplicaron ahí, se sembró con 5 atletas de ejemplo en distintas etapas del producto (`supabase/seed.sql`), y se creó/probó `supabase/reset_sandbox.sql`. Se dejó escrita la regla de disciplina (migración → sandbox → verificación → producción, nunca una DB por git branch) en `.claude/skills/schema-rls-verification/SKILL.md`. **Task tracking:** se migraron las 157 tasks del kanban de Notion (74 activas a `TASKS.md`, 83 done a `TASKS_ARCHIVE.md`), verificado contra el export local sin pérdida de datos. Marco decidió que `TASKS.md` es la fuente de verdad de aquí en adelante — se reescribieron `CLAUDE.md` (reglas 1,2,3,5) y los skills `session-open-close`/`commit-kanban-sync` para trabajar sobre archivos locales en vez de Notion; Notion queda como respaldo histórico en `notion/`, sin actualizarse más.

## Pending / next session priority
1. Confirmar que los commits de esta sesión ya se hicieron `git push` (el sandbox de Cowork no tiene acceso de red a GitHub).
2. Borrar manualmente (Marco, desde terminal nativa) las carpetas `.claude/skills/commit-kanban-sync/` y `.claude/skills/session-open-close/` — quedaron con un stub de retiro porque el sandbox de Cowork no tuvo permiso de sistema para eliminarlas (solo para vaciar su contenido).
3. Backlog no bloqueante, sin fecha: 8 warnings de Supabase Advisors, decisión de branch-per-task, decisión de typing (JSDoc/PropTypes vs. dejarlo como está).
4. Backlog no bloqueante, sin fecha: evaluar si `TASKS.md` necesita separar "backlog de largo plazo" en un archivo aparte (ej. `BACKLOG_IDEAS.md`) antes de que el backlog activo crezca más allá de ~100 entradas — hoy tiene 71 y ya pesa ~900 líneas; no es urgente pero es donde el archivo empieza a sentirse pesado de leer sesión a sesión.

## Decided / deferred
- `TASKS.md` es la fuente de verdad de tasks de aquí en adelante (decisión explícita de Marco, 2026-07-17) — reemplaza al kanban de Notion, que queda como archivo histórico.
- Warnings de Supabase Advisors, branch-per-task, y decisión de typing quedan como backlog de seguridad/proceso sin fecha — documentados en `SETUP_CHECKLIST.md`, a propósito no convertidos en tasks de `TASKS.md` todavía (decisión explícita de Marco, 2026-07-17).
- **Skills de commit/sesión consolidados (2026-07-17):** se eliminó la duplicación entre los skills a medida (`commit-kanban-sync`, `session-open-close`) y los genéricos del kit (`commit`, `session-log`) — decisión explícita de Marco de quedarse solo con los del kit. Todo el contenido de valor de los skills a medida (convención `feat:/fix:/chore:/refactor:`, campo Dónde, verificación cruzada con `git log` para blockers de `index.lock`) se fusionó dentro de `commit`/`session-log`. Referencias actualizadas en `feature-build-flow` y `COWORK_PROJECT_INSTRUCTIONS.md`.
