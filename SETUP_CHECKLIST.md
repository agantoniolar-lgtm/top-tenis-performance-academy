# Setup checklist — Top Tennis Performance Academy

Retrofit de un proyecto ya corriendo. Este archivo refleja el estado real detectado el 2026-07-16, no un rubber stamp — cada casilla marcada fue verificada (leyendo el repo, git, y Supabase), no asumida.

## 1. Law and rules
- [x] `CLAUDE.md` generado y presente en la raíz — pero es un sistema **propio** (kanban en Notion + skills a medida: `session-open-close`, `commit-kanban-sync`, `feature-build-flow`), no el genérico de este kit. Decisión de Marco (2026-07-16): mantenerlo así por ahora.
- [x] Regla de "task antes de trabajar" confirmada — existe, vía kanban de Notion (regla 1 de CLAUDE.md), equivalente al plan-first de este kit.
- [x] Patrón arquitectónico declarado: SPA React + Vite, backend Supabase (Postgres + RLS + Edge Functions Deno), scraper Python vía GitHub Actions cron.

## 2. Git discipline
- [x] Convención de commits confirmada como regla vigente — prefijos `feat:/fix:/chore:/refactor:` (no el formato WHAT/WHY/RISK del kit genérico; es la convención real del proyecto y funciona, se mantiene).
- [ ] Branch protection / un branch por task — **no implementado**. Hoy se trabaja directo sobre commits sin convención de branch-por-task.
- [x] Manejo de `.git/index.lock` documentado — está en CLAUDE.md y en `commit-kanban-sync`.

## 3. Structure locks
- [ ] Strict typing — **no aplica tal cual**: proyecto es JS puro (sin TypeScript, sin `jsconfig.json`/`tsconfig.json`). El guardrail real hoy es ESLint. Decisión pendiente: ¿adoptar JSDoc/PropTypes o dejarlo como está?
- [x] Lint configurado y pasando en checkout limpio — `eslint.config.js` presente, corre en CI (`.github/workflows/ci.yml`).
- [x] Skill de verificación de RLS presente — `schema-rls-verification` ya existe en `.claude/skills/`.
- [ ] RLS/seguridad activamente verificada — Supabase Advisors reporta 8 warnings abiertos (funciones con `search_path` mutable, bucket público `public-media` permite listing, función `sync_utr_to_athlete` es `SECURITY DEFINER` ejecutable por `anon`/`authenticated`, leaked password protection desactivada). No es bloqueante para cerrar setup, pero queda como backlog de seguridad — candidato a task en el kanban.

## 4. Sandbox
- [ ] **No existe sandbox.** Un solo proyecto Supabase (`top-tennis-performance-academy`, ref `rrrwhwciggohwxslqlho`) sirve como único ambiente — frontend, Edge Functions y el scraper de rankings apuntan todos a producción. El anon key está hardcodeado en `src/lib/supabase.js` (aceptable, es público por diseño) pero no hay separación dev/prod.
- [ ] Decisión pendiente con Marco: ¿segundo proyecto Supabase (patrón free-tier) o Preview Branches (si el plan de la organización lo permite — no confirmado)?
- [ ] Script de reset/seed de datos falsos — no existe.

## 4b. Secrets hygiene
- [x] `.env.example` generado, a la medida de las variables reales del proyecto (`VITE_COACH_INVITE_CODE`, `VITE_CONTENT_INVITE_CODE`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `OPENAI_API_KEY`).
- [x] `.gitignore` actualizado — se agregó `.env` / `.env.*` (antes solo cubría `*.local`, lo cual dejaba `.env` sin proteger).
- [ ] **CRÍTICO — acción de Marco requerida:** `.env` con el `SUPABASE_SERVICE_KEY` real está trackeado por git desde el commit `7cacbd4` (ya viejo, probablemente ya en GitHub). No se necesita — el cron de `amtp-rankings-cron.yml` ya usa GitHub Secrets, no este archivo. Pendiente, bloqueado por un `.git/index.lock` que el sandbox no tiene permiso de borrar:
  1. `rm .git/index.lock`
  2. `git rm --cached .env`
  3. Commit: `chore: sacar .env del tracking de git, ya vive solo local`
  4. **Rotar el service_role key en Supabase Dashboard → Settings → API** — quedó expuesto en el historial de git independientemente de que se saque del tracking ahora.

## 5. Verification
- [x] Al menos un test determinístico existe y pasa — `src/lib/athletics.test.js`, `content.test.js`, `validators.test.js`, corridos vía Vitest en CI.
- [x] Harness de evals — existe superficie AI-nativa (`generate-quarterly-plan`, Edge Function con `OPENAI_API_KEY`); `verify-evals` ya está en `.claude/skills/`. No confirmado si ya se corrió un eval real sobre esta función — queda como pendiente de verificación puntual, no de setup.
- [x] Paso de UI walkthrough confirmado — `verify-ui` presente, y la regla 6 de CLAUDE.md (mobile-first ~375px) ya cubre esto específicamente para este proyecto.

## 6. Task tracking
- [x] `TASKS.md` creado — arranca vacío (regla del kit: no migrar historial de Notion en este paso).
- [x] `TASKS_ARCHIVE.md` creado — vacío.
- [x] `/logs/` creado.
- [x] `STATUS.md` creado con `maturity: pre-users` (confirmado por Marco 2026-07-16, no inferido).
- [ ] **Decisión pendiente, explícita de Marco:** migrar el contenido del kanban de Notion a `TASKS.md`/`TASKS_ARCHIVE.md`. Marco mencionó tener el contenido listo para esto — es un paso aparte, no ejecutado todavía en este setup.

## 7. Maturity
- [x] `maturity: pre-users` — confirmado explícitamente por Marco, no inferido del código.

## 8. Cowork native loading
- [x] `COWORK_PROJECT_INSTRUCTIONS.md` generado.
- [ ] Pegarlo en Cowork Settings → Project Instructions — paso manual, pendiente de que Marco lo haga.

---

## Resumen — lo que falta para cerrar setup

Orden de prioridad real:

1. **Rotar el `SUPABASE_SERVICE_KEY`** y sacar `.env` del tracking de git (sección 4b) — es lo único que es una exposición de seguridad activa, no solo un gap de proceso.
2. Decidir sandbox (sección 4) — sin esto, cualquier prueba destructiva sigue corriendo contra producción.
3. Decidir si migrar Notion → `TASKS.md` ahora o después (sección 6).
4. Pegar `COWORK_PROJECT_INSTRUCTIONS.md` en Cowork (sección 8) — 2 minutos, cero riesgo.
5. Backlog no bloqueante: warnings de Supabase Advisors (sección 3), branch-per-task (sección 2), decisión de typing (sección 3).
