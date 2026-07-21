# Project status — Top Tennis Performance Academy

maturity: live-users

<!-- Cambiado de pre-users a live-users el 2026-07-20 (confirmado por Marco): 10 atletas ya se subieron a la plataforma. -->

<!--
Solo Marco cambia el campo de arriba, y solo cuando el estado real del proyecto cambia.
Cada skill lee este campo para decidir cuánto rigor de sandbox/evals aplica. Ver CLAUDE.md.
-->

## Last session (2026-07-20)
Sesión arrancó con `/setup` en modo retrofit, que reveló trabajo sin terminar de una sesión previa (2026-07-19): `templates/` y `.claude/skills/setup/SKILL.md` ya tenían el contenido de una versión más nueva del kit `ae-setup`, sin commitear ni propagar a los archivos reales del proyecto. Se terminó esa sincronización (`SETUP_CHECKLIST.md`, `CLAUDE.md`), corrigiendo de paso dos referencias obsoletas (Notion en la regla de "task antes de trabajar"; "rule 10 in CLAUDE.md" citada por `verify-rls/SKILL.md`, numeración que nunca existió en este proyecto). Escaneo completo de secretos en el historial (`gitleaks git .`): 3 hallazgos, los 3 ya conocidos y remediados — documentados en `.gitleaks.toml`, con hook de pre-commit (`.husky/pre-commit`) y backstop de CI (`.github/workflows/gitleaks.yml`) instalados.

A mitad de sesión, una pregunta de Marco sobre la conexión al sandbox reveló un gap serio: `src/lib/supabase.js` tenía la URL/key de **producción** hardcodeadas — correr `npm run dev` local, o un walkthrough de UI, siempre hablaba contra datos reales (10 atletas ya subidos, confirmado por Marco → `maturity` pasa a `live-users`). Se abrió y construyó `T160` en la misma sesión: conexión de la app movida a `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` (falla fuerte si faltan, sandbox por default en local, producción solo en Vercel), guard `scripts/check-migrations-schema-only.mjs` que bloquea DML mezclado con schema en migraciones nuevas (hook local + backstop en CI), y `supabase/PROD_MIGRATIONS_LOG.md` para documentar cada push a producción. El primer push a producción reveló un bug real de versión en `gitleaks-action@v3` (default hardcodeado 8.24.3, no aplica allowlists globales correctamente — arreglado pinneando `GITLEAKS_VERSION: 8.30.1`). Marco confirmó las env vars de producción agregadas en Vercel y el sitio en vivo cargando bien; `T160` cerrado y archivado. Detalle completo en `/logs/session-2026-07-20.md`.

## Pending / next session priority
1. `TASKS.md` está vacío — decidir qué se promueve primero. Candidato natural, arrastrado de sesiones previas: **T152** (backlog — catálogo de métricas físicas + score de liderazgo en `report_character`), Marco ya confirmó tener la información necesaria.
2. T116 (CMS↔sitio público, backlog) sigue en pausa hasta la junta con marketing — confirmar si ya sucedió.
3. No bloqueante: `SUPABASE_DB_PASSWORD_SANDBOX` no está en `.env.local` — solo hace falta si Marco quiere correr el CLI de Supabase localmente contra el sandbox (hoy no hizo falta, todo vía MCP).
4. Backlog no bloqueante, sin fecha: 8 warnings de Supabase Advisors, decisión de branch-per-task, decisión de typing (JSDoc/PropTypes vs. dejarlo como está) — ver `SETUP_CHECKLIST.md`.
5. Backlog no bloqueante, sin fecha: evaluar si `TASKS.md` necesita separar "backlog de largo plazo" en un archivo aparte antes de que `BACKLOG.md` crezca demasiado.

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
