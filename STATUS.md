# Project status — Top Tennis Performance Academy

maturity: live-users

<!-- Cambiado de pre-users a live-users el 2026-07-20 (confirmado por Marco): 10 atletas ya se subieron a la plataforma. -->

<!--
Solo Marco cambia el campo de arriba, y solo cuando el estado real del proyecto cambia.
Cada skill lee este campo para decidir cuánto rigor de sandbox/evals aplica. Ver CLAUDE.md.
-->

## Last session (2026-07-23)
Sesión larga, casi toda en **T148 — servicio de notas de voz/texto por atleta** (context feed para reportes y planes). Marco lo pidió como build grande por fases con su propio PRD (`docs/prd-notas-voz-contexto-atleta.md`, fases 0–4). Se construyó de punta a punta la **fase 1** (notas de texto) y **toda la fase 2** (voz), todo en producción:
- **Fase 1:** tabla `athlete_notes` (`supabase/migrations/20260723000000_create_athlete_notes.sql`) con segmentación general/entrenamiento/torneo y RLS cross-coach con DELETE del autor; sección "Notas" en `src/pages/portal/coach/AlumnoDetalle.jsx` (composer + timeline). RLS verificada por rol en sandbox (8 casos), 175 tests, verify-ui.
- **Fase 2a:** grabación con `MediaRecorder` (mime real, **sin tope de duración** pero guardando `audio_duration_seconds`), bucket privado `athlete-notes-audio` (migración `20260723120000_athlete_notes_audio.sql`), guardado durable en 4 pasos. Post-prueba de Marco se agregaron confirmación de borrado en 2 pasos y persistencia del torneo al cambiar de segmento.
- **Fase 2b:** Edge Function `supabase/functions/transcribe-note/index.ts` (Whisper, español, service role, 1 reintento inmediato) — desplegada a sandbox y prod. Marco creó una API key de OpenAI dedicada al sandbox para verificar ahí. Confirmado en compu (sandbox) e iPhone Safari + Chrome (prod).
- **Fase 2c:** barrida diaria (`scripts/transcription_sweep.mjs` + `.github/workflows/transcription-sweep-cron.yml`), calcada del cron del digest. Verificada end-to-end sin micrófono (audio con `say`/`afconvert` → nota `failed` → recuperada a `done`) y con `workflow_dispatch --dry-run` contra prod (verde).

Housekeeping al arranque: se sacó `.claude/settings.local.json` de git (capa personal que se reescribe sola, causaba falsos positivos de gitleaks). **T169** (modelo de anclas de `physical`) se scopeó pero se difirió: Marco va a migrar la medición física a una **matriz normativa por edad/sexo** (nuevo **T173**, category Team, bloquea a T169). Al cierre se confirmó que el AMTP Rankings Scraper funciona (última corrida post-fix T170 en success). Detalle completo en `/logs/session-2026-07-23.md`.

## Pending / next session priority
1. **T148 fase 3** (foco de la próxima sesión): curación/edición del bundle — vista en el flujo de notas (`AlumnoDetalle.jsx` / posiblemente `PlanesCoach.jsx`) donde el coach revisa, agrupa y edita las notas de un atleta de un periodo para dejar un bundle curado listo para alimentar un plan. Es el **antídoto al mega-dump** (`docs/prd-notas-voz-contexto-atleta.md §4/§6`, `scope-close-quarterly-plan.md §132`). **Decisión de diseño a scopear:** ¿la primera agrupación la hace el coach a mano, o la sugiere un modelo? — si es modelo, cae en fase 4.
2. **T148 fase 4** (después de fase 3): wiring del bundle curado a `generate-quarterly-plan` (expandir `buildPriorBundle` / `body.prior_bundle`). **BLOQUEADA por T150** — primera feature LLM/agent que toca `verify-evals` de verdad; hay que definir la convención de evals con Marco antes.
3. **T173** (matriz normativa de pruebas físicas, Team) bloquea a **T169** — Marco ya le escribió al coach, esperando respuesta.
4. **T172** (backlog, Medium): verificar un dominio propio en Resend — bloquea el digest semanal de onboarding a todos los coaches. **Pendiente confirmar si `toptenis.mx` ya está comprado como dominio** (se usa como convención de correos); si sí, T172 se destraba sin comprar nada.
5. T116 (CMS↔sitio público, backlog) sigue en pausa hasta la junta con marketing — confirmar si ya sucedió.
6. No bloqueante: check "Supabase Preview" en GitHub sigue en rojo (`Remote migration versions not found in local migrations directory`) — preexistente desde el 21 Jul, no bloquea el deploy de Vercel, sin task todavía.
7. Backlog no bloqueante, sin fecha: 8 warnings de Supabase Advisors, decisión de branch-per-task, decisión de typing — ver `SETUP_CHECKLIST.md`.
8. Fixtures dejados en **sandbox** (inofensivos, sandbox es libre): password de prueba de Tlaca (`TestNotas2026!`), una nota de texto en Santiago, una nota de voz `done` con audio real.

## Decided / deferred
- **`.claude/settings.local.json` deja de estar versionado** (2026-07-23) — es la capa personal de permisos de Claude Code, se reescribe sola cada sesión; venía acumulando comandos `curl` con la publishable key de Supabase embebida, que disparaba gitleaks. La key es pública por diseño (sin exposición real); la capa compartida sería `settings.json`. Movido a `.gitignore`.
- **Forma física migra a una matriz normativa por edad/sexo** (2026-07-23, T173) — reemplaza el modelo de baseline propio de T152 como forma de medir forma física y redefine los peldaños de las anclas de `physical`. **T169** (revisar anclas de physical) se difiere hasta tener esa matriz; Marco ya le escribió a un coach. Hallazgos del scope de T169 preservados en `BACKLOG.md` (query de `openClosing` sin `report_physical`; ref colgada a T166; focos físicos huérfanos de taxonomía vieja).
- **Notas de voz sin tope de duración por ahora** (2026-07-23, T148) — Marco prefiere medir cuánto graban los coaches en la práctica y elegir un decil de corte después; por eso se guarda `audio_duration_seconds` en cada nota. Costo/subida no preocupan al volumen actual.
- **T148 storage = Supabase Storage, STT = Whisper/OpenAI** (2026-07-23) — ambos reutilizan infra existente (bucket privado nuevo con el patrón de RLS del CMS; `OPENAI_API_KEY` ya usada por `generate-quarterly-plan`), sin vendor nuevo. Se descartó Google Drive (T162 sigue exploratorio) y ElevenLabs.
- **La curación de notas → bundle (T148 fase 4) es la primera feature LLM/agent que tocará `verify-evals` de verdad** (2026-07-23) — GATED por T150 (convención de evals sin definir): dónde viven, formato del dataset, quién es el grader. No inventar la convención en silencio; scopear con Marco al llegar ahí.
- **Sembrar datos en el sandbox es libre** (2026-07-23, feedback de Marco) — no hace falta pedir permiso ni limpiar obsesivamente cada fixture; el único límite es que nunca lleguen a una migración versionada ni a prod. Guardado en memoria (`sandbox-seed-libre.md`).
- El AMTP Rankings Scraper quedó **confirmado funcionando** (2026-07-23) — última corrida post-fix de T170 en success; las fallas del 22 jul fueron durante la depuración.
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
- Notificaciones directas a padres quedan fuera de alcance del digest de onboarding (2026-07-22, decisión explícita de Marco) — rompería la confianza atleta-coach. El digest es de equipo, no personalizado por coach individual (no hay ownership real desde T140).
- Notificaciones WhatsApp/2FA (T043) siguen sin prioridad (reconfirmado 2026-07-22) — no hay cuenta de WhatsApp Business todavía.
- Wiring numérico real de baseline/target en las anclas de `physical` dentro de `generate-quarterly-plan` queda deliberadamente fuera de T167 (2026-07-22) — es un rediseño aparte del modelo de anclas completo, ver T169 en backlog.
- Convención de sufijos `_SANDBOX` en `.env.local`/`.env.example` aplicada de una vez (2026-07-22) — los nombres sin sufijo (`SUPABASE_URL`/`SUPABASE_SERVICE_KEY`) quedan vacíos a propósito, reservados solo para uso transitorio y deliberado contra producción, nunca guardados de forma permanente.
- El skill `commit` verifica el deploy/CI remoto después de cada push antes de seguir a otra tarea (2026-07-22, a partir del incidente de deploy roto de esta sesión) — script dedicado `.claude/skills/commit/scripts/check-deploy-status.sh`, primer script de ese skill (decisión de Marco: que fuera script, no prosa embebida en el `.md`).
- Duplicado de "Ian Kleiman" en `athletes` (producción, 2026-07-22): desactivada (`activo=false`) la fila vacía sin datos, nunca `DELETE` — mismo patrón que T140. La fila con datos reales (2 quarterly_plans + ranking) se conservó intacta.
