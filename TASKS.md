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

### T086-landing-reescribir-home-jsx — Landing — reescribir Home.jsx con nueva arquitectura
- category: Dev
- type: Feature
- epic: —
- priority: High
- status: in progress
- created: 2026-06-23

**Notas:**
10 secciones: Hero (nuevo copy, 1 CTA), Stats (4° stat = 15+ universidades), El método TTPA (4 pilares), Lo que medimos (mock SwingVision + UTR sparkline + eval coach), Portal preview (tabla de períodos), Armando (nombre real + bio real), Para cada persona (atletas/padres/recruiters), Sede, Testimonios (placeholder), CTA (sin cambios). También fix nombre Alejandro→Armando en Nosotros.jsx.

### T102-pm-v2-close-quarterly-plan — P&M v2 — close-quarterly-plan + retrospectives + handoff periodo→periodo
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: in progress
- created: 2026-06-26

**Notas:**
CONSTRUIDO en 4 rebanadas (14-15 Jul 2026, commits ed706c6/7c92db6/869d7a6/4a36e3a). Cierre manual por foco + wiring de prior_bundle + scores/notas del trimestre en el cierre (como palabras via OC_LABEL) + pre-seleccion de focos 'continua' + salto automatico a crear el plan siguiente. Retrospectiva del coach quitada de la UI por ahora. Dummy data de Test Athlete (2 trimestres) corregida. Lint+110 tests OK, todo comiteado. PRIMERA CORRIDA EN VIVO (15 Jul 2026, docs/scope-close-quarterly-plan.md §16): confirmados C1-C11 + A1-A6 de docs/qa-guia-cierre-plan-trimestral.md. Salieron 2 bugs/gaps reales: (1) mantenimiento nunca tiene outcome -- confirmado, no bug, ver §16.1/16.6; (2) carryover 'continua' no se propaga al draft siguiente si no se re-menciona en el dump nuevo -- bug real, ver §16.2. Decision grande de Marco: el modelo de outcome se separa en estado final (logrado/parcial/fallido) x carryover (continua/depriorizado) independientes -- hoy son excluyentes y no deberian serlo (§16.3). Este cambio + el fix del bug de carryover quedan como task nuevo separado ('P&M v2 -- separar outcome en estado + carryover'), igual que fechas de ciclo de vida del plan, botones 'mejorar' por objetivo, y el ajuste de prompt de anclas de tecnica -- todos Backlog, todos referenciados en §16. Fixes triviales de copy/UI (calco->copia directa, warnings en caja amarilla) ya aplicados directo, sin task aparte. Este task master se queda en In Progress -- no Done -- hasta que el nuevo modelo de outcome se construya, porque el bug de carryover es parte central del loop que este task prometia resolver.
