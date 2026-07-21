# Project status — Top Tennis Performance Academy

maturity: live-users

<!-- Cambiado de pre-users a live-users el 2026-07-20 (confirmado por Marco): 10 atletas ya se subieron a la plataforma. -->

<!--
Solo Marco cambia el campo de arriba, y solo cuando el estado real del proyecto cambia.
Cada skill lee este campo para decidir cuánto rigor de sandbox/evals aplica. Ver CLAUDE.md.
-->

## Last session (2026-07-21)
Sesión arrancó revisando prioridades a partir de una junta de Top Tennis del día anterior: `BACKLOG.md` actualizado con la nota nueva en T148 (notas de voz — segmentar por torneo/entrenamiento + editar el bundle), y 4 tasks nuevas — T161 (High, notificaciones de onboarding incompleto, sin scope), T162 (Google Drive como DB para highlights), T163 (landing YouTube→Supabase hosted), T164 (planes por torneo). Chore aparte: coach Jesús Luna eliminado de producción (hard delete, confirmado, sin rastro en el CMS).

El grueso de la sesión fue **T152** (catálogo de métricas físicas + score de liderazgo), llevado de punta a punta: `scope` → `design` → `verify-rls` → `build` → `verify-tests` → `verify-ui` → `commit`. Marco compartió el protocolo real de 7 pruebas físicas de la academia (`docs/uploads/`) y la regla de scoring por % de mejora contra un baseline fijo. Se migró `report_physical` al protocolo real (renombres, columnas nuevas, `DROP COLUMN` de 9 campos que no correspondían a ninguna prueba real — datos dummy, confirmado) y se agregó `report_character.liderazgo`; migración aplicada primero en sandbox (`xchdawwajmnnhkncikig`), verificada, y luego en producción (`rrrwhwciggohwxslqlho`) con confirmación explícita. Funciones puras nuevas `physicalTestScore`/`physicalScoreSeries` en `src/lib/athletics.js` (18 tests), UI de `NuevoReporte.jsx`/`MiPlan.jsx`/`PlanesCoach.jsx`/`ReportesPorPeriodo.jsx` actualizada. `generate-quarterly-plan` quedó deliberadamente fuera de alcance — sigue generando objetivos de `physical` con el esquema de sub-dimensiones viejo; se encontraron 4 objetivos reales en producción con esas keys viejas y se resolvió agregando las nuevas sin quitar las viejas en los labels. El walkthrough visual en mobile no se pudo hacer con la herramienta de browser automation (no respondía a resize) — se dejó documentado como gap y el task quedó en `in review`; más tarde Marco lo confirmó a mano usando una cuenta de coach sembrada directo por SQL en sandbox (técnica para saltar el rate limit de email de Supabase, documentada en T165), y T152 se cerró `done` y se archivó. Todo pusheado a `main` (3 commits). Detalle completo en `/logs/session-2026-07-21.md`.

## Pending / next session priority
1. `TASKS.md` está vacío de nuevo — decidir qué se promueve primero. Candidato natural por prioridad: **T161** (High, notificaciones de onboarding incompleto — perfil, reclutamiento, datos de papás, post-torneo), pero necesita `scope` completo antes de arrancar, no está listo para promoverse directo.
2. **T166** (backlog) quedó desbloqueado — depende de T152, que ya está hecho. Baseline de physical como task de onboarding del atleta + visibilidad para coaches de quién no lo tiene.
3. Deuda técnica sin task todavía: `generate-quarterly-plan/index.ts` sigue con la taxonomía vieja de `physical` — si se quiere que los objetivos nuevos usen el protocolo RAC, hace falta un task aparte para actualizarla.
4. T116 (CMS↔sitio público, backlog) sigue en pausa hasta la junta con marketing — confirmar si ya sucedió.
5. No bloqueante: `SUPABASE_DB_PASSWORD_SANDBOX` no está en `.env.local` — solo hace falta si Marco quiere correr el CLI de Supabase localmente contra el sandbox (hoy no hizo falta, todo vía MCP).
6. Backlog no bloqueante, sin fecha: 8 warnings de Supabase Advisors, decisión de branch-per-task, decisión de typing (JSDoc/PropTypes vs. dejarlo como está) — ver `SETUP_CHECKLIST.md`.
7. Backlog no bloqueante, sin fecha: evaluar si `TASKS.md` necesita separar "backlog de largo plazo" en un archivo aparte antes de que `BACKLOG.md` crezca demasiado.

## Decided / deferred
- El kit de skills se auto-orquesta (cada skill declara a quién le entrega después) — se descarta un skill "director" central; `feature-build-flow` ya no se referencia desde ningún archivo activo (decisión de Marco, 2026-07-18).
- `feature-build-flow/SKILL.md` y `schema-rls-verification/SKILL.md` se borraron del repo — superseded por el kit genérico y por `verify-rls` respectivamente (decisión explícita de Marco, 2026-07-18).
- `TASKS.md` es la fuente de verdad de tasks de aquí en adelante (decisión explícita de Marco, 2026-07-17) — reemplaza al kanban de Notion, que queda como archivo histórico.
- Warnings de Supabase Advisors, branch-per-task, y decisión de typing quedan como backlog de seguridad/proceso sin fecha — documentados en `SETUP_CHECKLIST.md`, a propósito no convertidos en tasks de `TASKS.md` todavía (decisión explícita de Marco, 2026-07-17).
- T152 (physical + liderazgo) se deja deliberadamente en backlog esta sesión pese a que Marco ya tiene la info para arrancarlo — se priorizó terminar la limpieza del backlog antes de abrir trabajo nuevo (decisión de Marco, 2026-07-18).
- T078 (SwingVision) confirmado depriorizado por Marco (2026-07-18) — sin acción esperada, solo documentado.
- Migraciones de Supabase son solo-schema (DDL) de aquí en adelante — un fix de datos de una sola vez va como script aparte, nunca mezclado en una migración versionada; se hace cumplir con `scripts/check-migrations-schema-only.mjs`, no solo con la instrucción escrita (decisión de Marco, 2026-07-20, ver `T160`).
- `gitleaks-action` queda pinneado a la versión `8.30.1` explícitamente en `.github/workflows/gitleaks.yml` — el default silencioso del action (8.24.3) tiene un bug real con allowlists globales (2026-07-20).
- `maturity` cambia de `pre-users` a `live-users` (2026-07-20, confirmado por Marco) — 10 atletas ya en la plataforma.
- T152 no toca `generate-quarterly-plan` (2026-07-21, decisión explícita de Marco) — la Edge Function sigue generando objetivos de `physical` con el esquema de sub-dimensiones viejo (sprint_20m, beep_test, etc.) hasta que se actualice en un task aparte; los labels en `MiPlan.jsx`/`PlanesCoach.jsx`/`NuevoReporte.jsx` soportan ambos esquemas mientras tanto.
- Los campos `sentadillas_1min`, `lagartijas_1min`, `beep_test_nivel`, `beep_test_rep` y los 5 de FMS se eliminaron (`DROP COLUMN`) de `report_physical` (2026-07-21, T152) — no forman parte del protocolo real de pruebas físicas de la academia; los datos que tenían en producción eran dummy, confirmado por Marco.
- Técnica para sembrar cuentas de coach en sandbox sin chocar con el rate limit de email de Supabase (2026-07-21): insertar directo por SQL en `auth.users`+`auth.identities` con `pgcrypto`, `email_confirmed_at` ya seteado, sin pasar por GoTrue. Usada para la cuenta de prueba `tlaca@toptenis.mx`, que Marco pidió mantener viva en sandbox.
