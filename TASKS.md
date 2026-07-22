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

### T161-notificaciones-onboarding-incompleto — Notificaciones de onboarding incompleto (perfil, reclutamiento, datos de papás, post-torneo)
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: in review
- created: 2026-07-21
- updated: 2026-07-22
- branch: direct-to-main

**Notas:**
- 2026-07-21: Creado en backlog a partir de la junta de Top Tennis (20 Jul 2026) — notificar a atletas/coaches si no completaron los pasos de onboarding: perfil, reclutamiento (si aplica), datos de padres, llenar post-torneo. Prioridad subida a pedido de Marco.
- 2026-07-22: Promovido a `TASKS.md`, `scope` cerrado con blueprint aprobado por Marco. Fusionado con **T166** (backlog, baseline físico pendiente en onboarding) — mismo patrón de UI, ya desbloqueado por T152. Blueprint:
  - **Parte 1 — flags en-app del coach** (`Equipo.jsx`, `AlumnoDetalle.jsx`): mismo patrón que el badge "Reclutamiento pendiente" ya existente. Nuevos: perfil físico incompleto, papás/tutor pendiente (menores), PTF post-torneo pendiente (join `athlete_tournaments`↔`post_tournament_forms`), baseline físico pendiente (join con `report_physical`, T166). Función pura nueva `onboardingGaps()` en `src/lib/athletics.js` (+ tests), reusada también por `Inicio.jsx` (refactor de la lógica inline existente, sin cambiar su comportamiento visible al atleta).
  - **Parte 2 — digest semanal por email**: nuevo script (`scripts/onboarding_digest.{py,mjs}`, mismo patrón que `scripts/amtp_scraper.py`) + `.github/workflows/onboarding-digest-cron.yml` (cron semanal, lunes). Enviado a **todos los coaches activos** (no solo el asignado — ya no hay ownership real desde T140), leyendo su email desde `auth.users` (no existe columna `email` en `coaches`) con la service key. Reglas de aparición en el digest: perfil físico → inmediato (mismo gate que ya bloquea su dashboard); PTF post-torneo → 3 días después de la `fecha` del torneo elegida por el coach al darlo de alta; reclutamiento / papás-tutor / baseline físico → 5 días después de `fecha_ingreso` del atleta. Envío vía Resend — Marco ya agregó `RESEND_API_KEY` como secret de GitHub Actions.
  - **Fuera de alcance, confirmado por Marco:** notificar directo a papás (rompería la confianza atleta-coach); expandir el digest a atletas (se evalúa después de probarlo con coaches); 2FA/WhatsApp (T043) sigue sin prioridad, sin cuenta de WhatsApp Business.
  - Orden de build acordado: Parte 1 (flags en-app) primero, Parte 2 (digest email) después.
  - Pasa a `design` (Parte 1 — cambia UI en dos componentes de coach).
- 2026-07-22: `design` cerrado (solo UI, sin schema nuevo — todo lectura sobre tablas existentes). Skills `design-system`/`ux-copy`/`accessibility-review` no están instalados en este proyecto; diseño hecho siguiendo directamente el patrón visual ya existente.
  - Reuso exacto del tag ámbar (`background:'#FFF6D6'`, `color:'#8A6D00'`, clase `tag`) ya usado por "Reclutamiento pendiente" — mismo lenguaje visual de "atención no bloqueante" en toda la app.
  - `AthleteCard`/`TeamTable` (vista lista): máximo **2 badges visibles**, priorizados por urgencia; si sobran más, indicador discreto `+N más`. Evita saturar la card en mobile (~375px, ya usa `flex-wrap`).
  - `AlumnoDetalle.jsx` (vista de un solo atleta): desglose **completo**, sin cap — hay espacio.
  - Orden de prioridad: Perfil incompleto (bloquea dashboard) → PTF pendiente (ligado a torneo, sensible al tiempo) → Baseline físico pendiente → Papás/tutor pendiente → Reclutamiento pendiente (ya el más soft).
  - Copy nuevo: "Perfil incompleto", "PTF pendiente", "Baseline físico pendiente", "Papás/tutor pendiente" (mismo tono que "Reclutamiento pendiente").
  - Pasa a `build`.
- 2026-07-22: `build` de Parte 1 completo.
  - **`src/lib/athletics.js`**: nuevas funciones puras `daysSince`, `hasPendingPTF` (con `graceDays` opcional — default 0/inmediato para los flags en-app; `PTF_GRACE_DAYS=3` queda exportado listo para el digest de Parte 2), y `onboardingGaps()` — single source of truth de los 5 gaps (perfil, PTF, baseline físico, papás/tutor, reclutamiento), en orden de prioridad. También `ONBOARDING_GRACE_DAYS=5`, constante para Parte 2. 22 tests nuevos, 149/149 en verde.
  - **Fix de correctness encontrado al construir**: el badge "Reclutamiento pendiente" en `Equipo.jsx` usaba antes solo *existencia* de fila en `athlete_recruitment_profile` (podía marcar "completo" con una fila de campos vacíos). Se migró a la misma regla de completitud por campo que ya usaba `Inicio.jsx` (`division_objetivo`+`grad_year`+`english_level` si aplica) — ahora las 3 vistas (atleta, Equipo, AlumnoDetalle) comparten exactamente la misma definición vía `onboardingGaps()`.
  - **`Equipo.jsx`**: query extendida — perfil físico/papás ya venían en la tabla `athletes` (agregado al SELECT), nuevas queries batched a `athlete_tournaments` (join `tournaments(fecha)`+`post_tournament_forms(id)`, PTF pendiente) y `report_physical` (existencia de baseline, sobre el historial completo del atleta, no solo los últimos 3 reportes que se muestran). `AthleteCard`/`TeamTable` renderizan `GapBadges` (componente nuevo, compartido): máximo 2 badges + "+N más".
  - **`AlumnoDetalle.jsx`**: mismas 3 queries nuevas (reclutamiento con campos reales, torneos+PTF, baseline físico sobre historial completo vía un query aparte — la página solo carga los últimos 6 reportes). Bloque nuevo "Onboarding pendiente" bajo el header, con el desglose completo sin cap.
  - **`Inicio.jsx`**: refactorizado para usar `onboardingGaps()` en vez de la lógica inline duplicada — mismo comportamiento visible confirmado (149/149 tests + lint + build limpios).
  - `npm run lint`, `npm test` (149/149) y `npm run build` limpios. Pasa a `verify-tests`/`verify-ui`.
- 2026-07-22: `verify-tests` — sin fixes necesarios, ya verde desde `build` (149/149, lint y build limpios).
- 2026-07-22: `verify-ui` — walkthrough real en sandbox (`xchdawwajmnnhkncikig`) como coach, `npm run dev`.
  - **Flujo Equipo → AlumnoDetalle**: logueado como `tlaca@toptenis.mx`, `/portal/equipo` muestra los 5 atletas seed con badges nuevos junto al ya existente. Escenario de prueba armado a propósito (torneo+`athlete_tournaments` temporal para Valentina, sin PTF, limpiado después de verificar): Valentina mostró "Perfil incompleto", "PTF pendiente", "+2 más" (cap de 2 + indicador funcionando); clic en la card lleva a `/portal/alumnos/:id`, donde el bloque "Onboarding pendiente" mostró el desglose completo sin cap: Perfil incompleto, PTF pendiente, Baseline físico pendiente, Papás/tutor pendiente.
  - **Bug real encontrado en este paso** (no de este build, ver **T168** arriba — fix ya aplicado a sandbox durante esta misma verificación): Santiago/Fernanda/Camila mostraban "Baseline físico pendiente" incorrectamente por un gap de RLS heredado de T140. Confirmado antes/después con screenshots: antes del fix de T168 mostraban el badge incorrecto, después de aplicarlo en sandbox ya no.
  - **Mobile (~375px): mismo gap de herramienta ya documentado en T152** — `resize_window` reporta éxito pero `window.innerWidth` se queda en 1512px (confirmado con dos tabs distintos, incluyendo uno nuevo desde cero). No se insistió más para evitar el loop que ya se documentó la vez pasada. En su lugar, revisión de código: `GapBadges` reutiliza exactamente las clases `flex flex-wrap`/`tag text-[9px]` que ya usaba el badge "Reclutamiento pendiente" (cero clases de layout nuevas); el bloque "Onboarding pendiente" de `AlumnoDetalle.jsx` usa el mismo patrón `flex flex-wrap gap-2` + `hairline p-4` que ya existe en ese archivo (ej. el header). Sin anchos fijos ni overflow nuevo introducido.
  - **Marco: si querés confirmación visual real en mobile, falta hacerla a mano** (mismo pedido que quedó pendiente y luego confirmaste en T152).
  - Datos de prueba (torneo temporal, password reseteada de `tlaca@toptenis.mx`) limpiados/documentados — ver nota de T168 sobre la password nueva.
  - Status pasa a `in review` — falta: (a) confirmación visual mobile de Marco, (b) que Marco confirme aplicar T168 a producción, (c) Parte 2 (digest email) sigue sin arrancar.

### T167-actualizar-generate-quarterly-plan-taxonomia-rac — Actualizar generate-quarterly-plan a la taxonomía RAC de physical (deuda técnica post-T152)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: in progress
- created: 2026-07-22
- branch: direct-to-main

**Notas:**
- 2026-07-22: Creado a partir de la deuda técnica identificada durante `build` de T152 (2026-07-21, ya `done`): `supabase/functions/generate-quarterly-plan/index.ts` sigue generando objetivos de `dimension='physical'` con el esquema viejo de sub-dimensiones (`sprint_20m`, `beep_test`, `fuerza_inferior`, etc.), no con el protocolo real de 7 pruebas RAC migrado en T152. Como parche temporal, `MiPlan.jsx`/`PlanesCoach.jsx`/`NuevoReporte.jsx` hoy soportan ambos esquemas de labels en paralelo. Objetivo: que la Edge Function genere objetivos cuantitativos de `physical` usando las keys reales (`velocidad_2377m`, `agilidad_5_lineas_seg`, `abdominales_30s`, `salto_vertical_cm`, `lanzamiento_balon_mts`, `flexibilidad_banco_pass`, `tiempo_1km_seg`). Nota: esto toca el output de un modelo LLM (`SUB_DIMENSIONS.physical` es parte del prompt) — al llegar a `verify-evals`, la convención Tier B todavía no está definida en este proyecto (ver T150); no inventarla en silencio, parar y scopear con Marco. Arranca `scope`.
