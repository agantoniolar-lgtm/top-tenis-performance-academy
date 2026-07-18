# Setup checklist — Top Tennis Performance Academy

Retrofit de un proyecto ya corriendo. Este archivo refleja el estado real detectado el 2026-07-16, no un rubber stamp — cada casilla marcada fue verificada (leyendo el repo, git, y Supabase), no asumida.

## 1. Law and rules
- [x] `CLAUDE.md` generado y presente en la raíz — es un sistema **propio** con tracking en `TASKS.md` (migrado desde Notion el 2026-07-17). El flujo end-to-end de construcción usa los skills genéricos del kit (`scope`, `design`, `build`, `verify-tests`/`verify-evals`/`verify-ui`, `commit`, `session-log`), cada uno auto-encadenado — no hay un orquestador central. `feature-build-flow` (el skill a medida original) se queda en `.claude/skills/` sin que nada más lo referencie (decisión de Marco, 2026-07-18: dejarlo donde está pero quitar las referencias hacia él, ya que el kit se auto-orquesta sin necesitar un director de flujo aparte). Los skills a medida equivalentes de commit/sesión (`commit-kanban-sync`, `session-open-close`) se consolidaron dentro de los del kit el 2026-07-17 para no mantener dos versiones de lo mismo.
- [x] Regla de "task antes de trabajar" confirmada — existe, vía kanban de Notion (regla 1 de CLAUDE.md), equivalente al plan-first de este kit.
- [x] Patrón arquitectónico declarado: SPA React + Vite, backend Supabase (Postgres + RLS + Edge Functions Deno), scraper Python vía GitHub Actions cron.

## 2. Git discipline
- [x] Convención de commits confirmada como regla vigente — prefijos `feat:/fix:/chore:/refactor:` (no el formato WHAT/WHY/RISK del kit genérico; es la convención real del proyecto y funciona, se mantiene).
- [ ] Branch protection / un branch por task — **no implementado**. Hoy se trabaja directo sobre commits sin convención de branch-por-task.
- [x] Manejo de `.git/index.lock` documentado — está en CLAUDE.md y en `commit`.

## 3. Structure locks
- [ ] Strict typing — **no aplica tal cual**: proyecto es JS puro (sin TypeScript, sin `jsconfig.json`/`tsconfig.json`). El guardrail real hoy es ESLint. Decisión pendiente: ¿adoptar JSDoc/PropTypes o dejarlo como está?
- [x] Lint configurado y pasando en checkout limpio — `eslint.config.js` presente, corre en CI (`.github/workflows/ci.yml`).
- [x] Skill de verificación de RLS presente — `schema-rls-verification` ya existe en `.claude/skills/`.
- [ ] RLS/seguridad activamente verificada — Supabase Advisors reporta 8 warnings abiertos (funciones con `search_path` mutable, bucket público `public-media` permite listing, función `sync_utr_to_athlete` es `SECURITY DEFINER` ejecutable por `anon`/`authenticated`, leaked password protection desactivada). No es bloqueante para cerrar setup, pero queda como backlog de seguridad — candidato a task en el kanban.

## 4. Sandbox
- [x] **Segundo proyecto Supabase creado** (patrón free-tier, confirmado — la org está en plan free, Preview Branches no disponible). Nombre `top-tennis-performance-academy-sandbox`, ref `xchdawwajmnnhkncikig`, us-east-1, mismo org que producción, costo $0/mes.
- [x] **Schema replicado.** Las 55 migraciones de producción se reconstruyeron como archivos en `supabase/migrations/` (2026-07-17, ver sección de abajo) y se aplicaron en orden al sandbox. Verificado: 21 tablas en ambos proyectos, mismos nombres, RLS habilitado. 3 filas/inserts con IDs hardcodeados de producción se omitieron o no tuvieron efecto a propósito (no aplican a un proyecto vacío).
- [x] **Regla de disciplina escrita** (2026-07-17) — agregada a `.claude/skills/schema-rls-verification/SKILL.md` (sección "Flujo de migraciones — sandbox primero, producción después"): todo cambio de schema/RLS se escribe como archivo en `supabase/migrations/`, se aplica primero al sandbox, se verifica ahí, y solo después se aplica a producción como paso explícito y deliberado — nunca automático, nunca una DB distinta por git branch.
- [x] **Sandbox sembrado con datos falsos** (2026-07-17, `supabase/seed.sql`) — 5 atletas cubriendo distintas etapas del producto (recién ingresada; primer mes con torneos+PTFs; segundo mes con reporte+plan archivado+plan nuevo; tercer mes con 3 reportes; cuarto mes con ciclo de plan cerrado con outcomes/carryover + plan nuevo heredando esos carryovers). Verificado sin errores de constraint.
- [x] **Script de reset creado y probado** (`supabase/reset_sandbox.sql`, 2026-07-17) — vacía todas las tablas de la app (`TRUNCATE ... CASCADE`), re-siembra los 4 coaches base con los mismos IDs fijos (para que `seed.sql` siga siendo válido sin ajustes), y corre `seed.sql`. Probado de punta a punta contra el sandbox real: conteos idénticos antes y después del reset (4 coaches, 5 atletas, 14 torneos, 14 PTFs, 6 reportes, 4 planes, 12 objetivos).
- [x] `.env.example` actualizado con las credenciales del sandbox (ref `xchdawwajmnnhkncikig`, publishable key incluida) y con `SUPABASE_DB_PASSWORD_PROD`/`_SANDBOX` como variables separadas — ver sección 4b.

## 4b. Secrets hygiene
- [x] `.env.example` generado, a la medida de las variables reales del proyecto (`VITE_COACH_INVITE_CODE`, `VITE_CONTENT_INVITE_CODE`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `OPENAI_API_KEY`).
- [x] `.gitignore` actualizado — se agregó `.env` / `.env.*` (antes solo cubría `*.local`, lo cual dejaba `.env` sin proteger).
- [x] **Resuelto 2026-07-16.** `.env` sacado del tracking de git (commit `9636250`). Legacy `anon`/`service_role` desactivadas en Supabase Dashboard tras migrar a Default publishable/secret keys nuevas; los 3 consumidores (`src/lib/supabase.js`, GitHub Actions secret, `.env` local) actualizados y probados. La key vieja sigue en el historial de git pero ya está inerte (desactivada), no es explotable.
- [x] **Segunda fuga resuelta 2026-07-17.** `docs/db-schema.md` tenía la contraseña real de Postgres en texto plano, trackeada en git desde el commit `bd7632f`. Marco rotó la contraseña; el doc ahora solo referencia `SUPABASE_DB_PASSWORD_PROD` (en `.env.local`, gitignored), sin valores reales.

## 5. Verification
- [x] Al menos un test determinístico existe y pasa — `src/lib/athletics.test.js`, `content.test.js`, `validators.test.js`, corridos vía Vitest en CI.
- [x] Harness de evals — existe superficie AI-nativa (`generate-quarterly-plan`, Edge Function con `OPENAI_API_KEY`); `verify-evals` ya está en `.claude/skills/`. No confirmado si ya se corrió un eval real sobre esta función — queda como pendiente de verificación puntual, no de setup.
- [x] Paso de UI walkthrough confirmado — `verify-ui` presente, y la regla 6 de CLAUDE.md (mobile-first ~375px) ya cubre esto específicamente para este proyecto.

## 6. Task tracking
- [x] `TASKS.md` creado — arranca vacío (regla del kit: no migrar historial de Notion en este paso).
- [x] `TASKS_ARCHIVE.md` creado — vacío.
- [x] `/logs/` creado.
- [x] `STATUS.md` creado con `maturity: pre-users` (confirmado por Marco 2026-07-16, no inferido).
- [x] **Migración de Notion completada (2026-07-17).** Las 157 tasks del kanban se migraron: 74 activas a `TASKS.md`, 83 done a `TASKS_ARCHIVE.md`. Verificado contra el export local en `notion/` — conteos exactos, sin pérdida de datos (los únicos "mismatches" del diff automático fueron artefactos del export de Notion — auto-linkificación de `CLAUDE.md` — no datos reales). Decisión de Marco: `TASKS.md` es la fuente de verdad de aquí en adelante, Notion queda solo como respaldo histórico sin actualizarse más.
- [x] **`CLAUDE.md` y skills actualizados para reflejar el cambio de fuente de verdad** (2026-07-17): reglas 1, 2, 3 y 5 de `CLAUDE.md` reescritas para `TASKS.md`/`STATUS.md`/`/logs/` en vez de Notion; referencias sueltas a "kanban de Notion" corregidas en `feature-build-flow` y `schema-rls-verification`.
- [x] **Skills de commit/sesión consolidados (2026-07-17).** El contenido de `commit-kanban-sync` y `session-open-close` (ambos ya reescritos para `TASKS.md`) se fusionó dentro de los skills genéricos del kit `commit` y `session-log` — quedaba una duplicación real (dos skills haciendo lo mismo, uno del kit y uno a medida) que Marco pidió resolver quedándose solo con los del kit. `commit` ahora usa la convención `feat:/fix:/chore:/refactor:` real del proyecto (no el WHAT/WHY/RISK genérico) y no asume branch-per-task (no adoptado todavía). `session-log` incorporó el campo Dónde y la verificación cruzada con `git log` para blockers viejos de `index.lock`. Las carpetas viejas no se pudieron borrar por una restricción de permisos del sandbox (unlink bloqueado aunque el archivo es escribible) — quedaron con un `SKILL.md` de stub que redirige a los nuevos; Marco puede borrar `.claude/skills/commit-kanban-sync/` y `.claude/skills/session-open-close/` por completo cuando quiera desde su terminal.
- [x] **Skills genéricos del kit completados en Cowork (2026-07-18).** `build`, `design`, `verify-tests`, `verify-evals` y `verify-ui` no estaban disponibles como skills de Cowork aunque ya existían en `.claude/skills/` — se empaquetaron con el contenido exacto del repo y se presentaron para instalar vía "Save skill". `feature-build-flow` se deja donde está (project-local, sin registrar en Cowork) pero se removieron las referencias activas hacia él en `CLAUDE.md`, `COWORK_PROJECT_INSTRUCTIONS.md` y `.claude/skills/commit/SKILL.md` — el kit ya se auto-encadena (cada skill indica a quién le entrega después) sin necesitar un orquestador central.

## 7. Maturity
- [x] `maturity: pre-users` — confirmado explícitamente por Marco, no inferido del código.

## 8. Cowork native loading
- [x] `COWORK_PROJECT_INSTRUCTIONS.md` generado.
- [x] Pegado en Cowork Settings → Project Instructions — confirmado por Marco 2026-07-16.

---

## Resumen — lo que falta para cerrar setup

Orden de prioridad real:

1. ~~Rotar el `SUPABASE_SERVICE_KEY` y sacar `.env` del tracking de git~~ — **resuelto 2026-07-16**.
2. ~~Sandbox: proyecto, schema, seed, reset~~ — **resuelto 2026-07-17** (sección 4).
3. ~~`docs/db-schema.md` con contraseña real expuesta~~ — **resuelto 2026-07-17** (sección 4b).
4. ~~Pegar `COWORK_PROJECT_INSTRUCTIONS.md` en Cowork~~ — **resuelto** (sección 8).
5. Decidir si migrar Notion → `TASKS.md` ahora o después (sección 6) — pendiente, a propósito, decisión de Marco.
6. Backlog no bloqueante, sin fecha: warnings de Supabase Advisors (sección 3), branch-per-task (sección 2), decisión de typing (sección 3).

**Setup queda cerrado en lo técnico** — lo único abierto son decisiones de Marco (migración de Notion, y si vale la pena el backlog de la sección 6), no trabajo pendiente del asistente.
