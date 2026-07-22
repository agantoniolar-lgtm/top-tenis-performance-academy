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

### T171-verificar-envio-real-digest-onboarding — Verificar envío real del digest de onboarding (T161 Parte 2)
- category: Dev
- type: Chore
- epic: Phase 1 — Core Features
- priority: Medium
- status: in progress
- created: 2026-07-22
- branch: direct-to-main

**Notas:**
- 2026-07-22: T161 (flags en-app) ya confirmado y archivado por Marco. Queda pendiente el último paso de la Parte 2 (digest): nunca se probó un envío real por Resend (solo dry-run contra sandbox). Marco pidió mandar un envío de prueba real a `mdamian.aguilar@gmail.com` en vez de a todos los coaches.
  - Agregado `DIGEST_TEST_TO` (env var) a `scripts/onboarding_digest.mjs` — si está seteada, el digest se manda solo a esa dirección en vez de a todos los coaches. Nuevo input `test_to` en `.github/workflows/onboarding-digest-cron.yml` (`workflow_dispatch`), pasado como `DIGEST_TEST_TO`. `.env.example` documentado.
  - Se dispara vía GitHub Actions (no tengo `RESEND_API_KEY` en local) con `test_to=mdamian.aguilar@gmail.com`, `dry_run=false` — un envío real, a un solo destinatario, con permiso explícito de Marco.

