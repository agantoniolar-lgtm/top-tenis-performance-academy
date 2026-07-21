# Setup checklist — Top Tennis Performance Academy

Retrofit de un proyecto ya corriendo. Este archivo refleja el estado real detectado el 2026-07-16, y actualizado el 2026-07-20 al sincronizar con una versión más nueva del kit `ae-setup` (sección 0, 3b, y el backstop de gitleaks) — no un rubber stamp, cada casilla marcada fue verificada (leyendo el repo, git, y Supabase), no asumida.

## 0. Stack maturity — qué aplica hoy, qué está diferido

Todas las piezas opcionales del stack ya están construidas y en uso en este proyecto (no es un proyecto recién arrancado) — todo se marca `Active`.

- Base de datos / backend con persistencia: [x] Active — cuál: Supabase (Postgres)
- Control de acceso por usuario/rol (RLS o equivalente): [x] Active
- Lenguaje tipado / mecanismo de tipado estricto: [x] Active — cuál: ninguno todavía (JS puro + ESLint; ver sección 3, decisión pendiente sobre JSDoc/PropTypes)
- Framework de tests automatizados: [x] Active — cuál: Vitest
- UI: [x] Active
- Feature AI-nativa (model call): [x] Active — Edge Function `generate-quarterly-plan` (OpenAI)

## 1. Law and rules
- [x] `CLAUDE.md` generado y presente en la raíz — es un sistema **propio** con tracking en `TASKS.md` (migrado desde Notion el 2026-07-17). El flujo end-to-end de construcción usa los skills genéricos del kit (`scope`, `design`, `build`, `verify-tests`/`verify-evals`/`verify-ui`, `commit`, `session-log`), cada uno auto-encadenado — no hay un orquestador central. `feature-build-flow` (el skill a medida original) se queda en `.claude/skills/` sin que nada más lo referencie (decisión de Marco, 2026-07-18: dejarlo donde está pero quitar las referencias hacia él, ya que el kit se auto-orquesta sin necesitar un director de flujo aparte). Los skills a medida equivalentes de commit/sesión (`commit-kanban-sync`, `session-open-close`) se consolidaron dentro de los del kit el 2026-07-17 para no mantener dos versiones de lo mismo.
- [x] Regla de "task antes de trabajar" confirmada — regla 1 de `CLAUDE.md`, equivalente al plan-first de este kit. Actualizada el 2026-07-17: ya no vive en el kanban de Notion, sino en `TASKS.md` (activos) + `BACKLOG.md` (ideas sin empezar) + `TASKS_ARCHIVE.md`/`tasks-archive/` (terminados). Notion queda solo como respaldo histórico sin actualizarse (export crudo en `notion/`).
- [x] Patrón arquitectónico declarado: SPA React + Vite, backend Supabase (Postgres + RLS + Edge Functions Deno), scraper Python vía GitHub Actions cron.

## 2. Git discipline
- [x] Convención de commits confirmada como regla vigente — prefijos `feat:/fix:/chore:/refactor:` (no el formato WHAT/WHY/RISK del kit genérico; es la convención real del proyecto y funciona, se mantiene).
- [ ] Branch protection / un branch por task — **no implementado**. Hoy se trabaja directo sobre commits sin convención de branch-por-task.
- [x] Manejo de `.git/index.lock` documentado — está en CLAUDE.md y en `commit`.

## 3. Structure locks
- [ ] Strict typing — **no aplica tal cual**: proyecto es JS puro (sin TypeScript, sin `jsconfig.json`/`tsconfig.json`). El guardrail real hoy es ESLint. Decisión pendiente: ¿adoptar JSDoc/PropTypes o dejarlo como está?
- [x] Lint configurado y pasando en checkout limpio — `eslint.config.js` presente, corre en CI (`.github/workflows/ci.yml`).
- [x] Skill de verificación de RLS presente — `verify-rls` (genérico del kit) desde 2026-07-18, reemplaza a `schema-rls-verification` (retirado, ver `CLAUDE.md` → Skills retirados).
- [ ] RLS/seguridad activamente verificada — Supabase Advisors reporta 8 warnings abiertos (funciones con `search_path` mutable, bucket público `public-media` permite listing, función `sync_utr_to_athlete` es `SECURITY DEFINER` ejecutable por `anon`/`authenticated`, leaked password protection desactivada). No es bloqueante para cerrar setup, pero queda como backlog de seguridad — candidato a task en `BACKLOG.md`.

## 3b. Schema versioning (proyectos Supabase — prerequisito de la sección 4)
- [x] Carpeta `supabase/migrations/` y `config.toml` existen — 55 migraciones.
- [x] Migraciones reflejan el schema real de producción — reconstruidas y baseline hechas el 2026-07-17 (ver sección 4). Verificado: 21 tablas en ambos proyectos (prod y sandbox), mismos nombres, RLS habilitado.
- [x] Confirmado que todo cambio de schema desde entonces es un archivo de migración (`supabase migration new <nombre>`), nunca SQL directo a mano — regla escrita en `verify-rls` (sección 2, "Schema and policy changes are migration files, sandbox first") y en `CLAUDE.md` (particularidad del proyecto: `design` + `verify-rls` corren y cierran antes de construir la UI que depende de esos datos).

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
- [x] `maturity: live-users` — confirmado explícitamente por Marco 2026-07-20 (10 atletas ya se subieron a la plataforma), no inferido del código. Antes `pre-users` desde 2026-07-16. El cambio a `live-users` sube el rigor esperado de sandbox: ver la sección "Ambiente de pruebas — gap encontrado" al final de este archivo, abierta el mismo día por este motivo.

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
5. ~~Migrar Notion → `TASKS.md`~~ — **resuelto 2026-07-17** (sección 6).
6. ~~Gitleaks: scan de historial completo, hook de pre-commit, backstop de CI~~ — **resuelto 2026-07-20** (sección 4b). Historial escaneado con `gitleaks git .`: 3 hallazgos, los 3 ya conocidos y remediados (service_role/anon JWT legacy de producción, rotadas 2026-07-16; publishable key del sandbox, pública por diseño) — documentados con fingerprint en `.gitleaks.toml`. Hook instalado en `.husky/pre-commit` (probado: bloquea un secreto de prueba). CI en `.github/workflows/gitleaks.yml`.
7. **Abierto, prioridad alta ahora que `maturity: live-users`** — el ambiente de pruebas real de la app (no solo la DB) no existe todavía: ver "Ambiente de pruebas — gap encontrado" abajo.
8. Backlog no bloqueante, sin fecha: warnings de Supabase Advisors (sección 3), branch-per-task (sección 2), decisión de typing (sección 3).

**Setup queda cerrado en lo técnico salvo el punto 7** — es el único trabajo real pendiente del asistente; el resto (sección 8) es backlog sin fecha, a discreción de Marco.

## Ambiente de pruebas — gap encontrado (2026-07-20)

Al responder la pregunta de Marco sobre cómo está conectada la plataforma al sandbox, se encontró que **el sandbox de base de datos es real y está bien aislado a nivel DB/CLI, pero la app en sí no tiene manera de apuntar a él**:

- `src/lib/supabase.js` tiene la URL y la publishable key de **producción** (`rrrwhwciggohwxslqlho`) escritas directamente en el código fuente — no las lee de una variable de entorno.
- `supabase/config.toml` también tiene `project_id = "rrrwhwciggohwxslqlho"` (producción) como el proyecto vinculado por default.
- `.env.local` hoy solo tiene los invite codes y las variables de service key/db password para scripts — nada que la app use para elegir entre sandbox y producción.
- Consecuencia concreta: correr `npm run dev` localmente, o hacer un walkthrough de `verify-ui`, **siempre habla contra la base de producción real** — incluyendo los 10 atletas ya subidos. No hay forma de apuntar la app corriendo al sandbox sin editar el código fuente a mano (y arriesgar dejarlo así por error, o comitearlo).
- Lo que sí funciona bien y no cambia: los cambios de schema/RLS se prueban con migraciones aplicadas primero al proyecto sandbox vía Supabase CLI/MCP (`supabase/migrations/`, seed, reset script) — eso es real, reproducible, y ya lo confirma la sección 3b/4 de este archivo. El gap es específicamente la capa de la app (frontend + cualquier llamada desde ahí), no la capa de schema.

**Propuesta (pendiente de que Marco decida si se hace ahora o se scopea como task aparte):** mover `SUPABASE_URL`/`SUPABASE_ANON` de `src/lib/supabase.js` a variables `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` leídas de `import.meta.env` (mismo patrón que ya usan `VITE_COACH_INVITE_CODE`/`VITE_CONTENT_INVITE_CODE`), con `.env.local` apuntando al sandbox por default para desarrollo local, y las variables de producción configuradas solo en Vercel (deploy real) — nunca en un archivo del repo. Esto es justo el tipo de cambio que la regla de `CLAUDE.md` de "task antes de trabajar" exige scopear primero, dado que toca cómo arranca toda la app; no se implementó todavía como parte de este retrofit de `/setup`.
