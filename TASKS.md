# Tasks — Top Tennis Performance Academy

Active work only — status `in progress` or `in review`. Not-yet-started ideas live in `BACKLOG.md`; completed tasks live in `TASKS_ARCHIVE.md` (older ones split into dated files, tracked in `TASKS_ARCHIVE_INDEX.md`). This file should stay short by construction.

**2026-07-18 restructure:** this file, `BACKLOG.md`, `TASKS_ARCHIVE.md`, and `TASKS_ARCHIVE_INDEX.md` were split out of the single flat `TASKS.md`/`TASKS_ARCHIVE.md` pair created by the 2026-07-17 Notion migration (157 tasks total), per the kit's v0.6 redesign. The original two files, unmodified, are kept at `TASKS_pre-split-2026-07-18-backup.md` and `TASKS_ARCHIVE_pre-split-2026-07-18-backup.md` if anything here needs cross-checking against the source.

<!--
### {{task-id}} — {{short title}}
- category: {{feature | fix | doc | decision | research | bug-bash | review}}
- status: {{in progress | in review}}
- created: {{YYYY-MM-DD}}
- updated: {{YYYY-MM-DD}}
- branch: {{ai/{{task-id}}-{{slug}} or none yet, or "direct-to-main"}}

**Description (accumulates as work happens — what, when, how):**
- {{YYYY-MM-DD}}: {{what happened}}
-->

## In Progress

### T160-ambiente-pruebas-app-y-migraciones-schema-only — Ambiente de pruebas air-tight: app apunta a sandbox por default, migraciones solo-schema, log de pushes a prod
- category: Dev
- type: Chore
- epic: Infra / seguridad
- priority: High
- status: in review
- created: 2026-07-20
- updated: 2026-07-20

**Notas:**
- 2026-07-20: Abierto a partir de una pregunta de Marco sobre cómo está conectada la plataforma al sandbox. Encontrado: `src/lib/supabase.js` tenía la URL/key de **producción** hardcodeadas — correr `npm run dev` local, o cualquier `verify-ui` walkthrough, siempre hablaba contra producción real (10 atletas ya subidos). Además, se confirmó que varias migraciones históricas mezclan DDL con DML de datos reales hardcodeados (`.../20260608213016_reassign_all_remove_marco_reyes.sql`, `.../20260630185839_add_coach_profile_fields.sql`, `.../20260715233355_split_outcome_state_and_carryover.sql`, entre otras) — riesgo concreto: una migración probada contra sandbox (con datos distintos a prod) puede comportarse distinto/destructivamente al aplicarse a prod si mezcla schema y datos.
- 2026-07-20: Construido. (a) `src/lib/supabase.js` ahora lee `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` de `import.meta.env`, sin fallback hardcodeado — lanza error explícito si faltan. `.env.local` apunta al sandbox (`xchdawwajmnnhkncikig`) por default; verificado con `npm run build` que el bundle resultante solo contiene la ref del sandbox, cero rastro de la ref de producción. (b) `scripts/check-migrations-schema-only.mjs` — bloquea DML top-level en migraciones nuevas (filtra correctamente DML dentro de cuerpos de función/trigger y sintaxis de `CREATE POLICY ... FOR UPDATE/INSERT/...`, con escape hatch `-- ALLOW-DML: <razón>`); modo `--staged` en `.husky/pre-commit` (probado: bloquea y permite según corresponda), modo `--diff-against <ref>` como backstop en `.github/workflows/ci.yml` (diffea contra el commit anterior en push, o el merge-base en PR — no re-escanea el historial completo, así que las migraciones viejas con DML no rompen CI). (c) `supabase/PROD_MIGRATIONS_LOG.md` creado con el procedimiento (sandbox → verificación → confirmación de Marco → prod → fila en el log en el momento). Regla documentada en `CLAUDE.md` (regla 7 nueva) y referencia corregida en `verify-rls/SKILL.md` (citaba "rule 10 in CLAUDE.md", que no existía con esa numeración en este proyecto). `.env.example` actualizado para reflejar la conexión por env vars. `npm run lint && npm test` pasan (112 tests).
- **Pendiente, bloqueante para producción:** Marco debe agregar `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` en Vercel → Settings → Environment Variables, con las credenciales de **producción** (`rrrwhwciggohwxslqlho`), antes de este cambio se pushee — si no, el próximo deploy de Vercel se rompe (la app ahora falla fuerte sin esas variables, a propósito). También pendiente, no bloqueante: `SUPABASE_DB_PASSWORD_SANDBOX` no está en `.env.local` — solo hace falta si Marco quiere correr el CLI de Supabase localmente contra el sandbox (hoy no se necesitó, todo se hizo vía MCP). Ver detalle completo del hallazgo original en `SETUP_CHECKLIST.md` → "Ambiente de pruebas — gap encontrado".
