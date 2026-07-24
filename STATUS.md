# Project status — Top Tennis Performance Academy

maturity: live-users

<!-- Cambiado de pre-users a live-users el 2026-07-20 (confirmado por Marco): 10 atletas ya se subieron a la plataforma. -->

<!--
Solo Marco cambia el campo de arriba, y solo cuando el estado real del proyecto cambia.
Cada skill lee este campo para decidir cuánto rigor de sandbox/evals aplica. Ver CLAUDE.md.
-->

## Last session (2026-07-24)
Sesión enteramente de **scope + diseño de PRD, sin build**. Se abrió para retomar **T148 fase 3** (curación del bundle de notas) y al scopearla se tomó una decisión de rumbo: la agrupación de fase 3 la hace **el coach a mano** con un **tagging system manual**, y ese tagging es en realidad el cimiento de un **context & tagging engine** (RAG + manejo de contexto) para todo el sistema de IA del producto. Por su alcance y por estar gated por T150, se elevó a su **propio task y PRD, T174** (`docs/prd-context-tagging-engine.md`), linkeado desde el PRD de notas.
- **Dónde:** `docs/prd-context-tagging-engine.md` (nuevo, T174), `docs/prd-notas-voz-contexto-atleta.md` (§6 fase 3), `docs/uploads/tagging-system.md` (referencia de m-brain, versionada), `TASKS.md` (T174 nuevo + nota en T148), `BACKLOG.md` (T175). Commit `5cf5db8` en `main` (docs-only, lint + 195 tests verdes, gitleaks limpio; push lo hace Marco).
- **Qué quedó definido:** taxonomía **facetada** de vocabulario cerrado reusando `SUB_DIMENSIONS` del plan (`dimension` 1–3 + `sub_dimension` 0–3); `note_type` v0 = observacion/failure/setback/intencion/progreso/hito; `player_archetype` a nivel atleta; **`valence` descartada**; **tabla nueva `note_tags`** aislada; **módulo compartido** `supabase/functions/_shared/taxonomy.ts` importado por el front en build; **manual primero → LLM (auto-tagger) después, gated por T150** con umbral de 50 notas; tendencias = capa derivada futura; RAG estructurado por tags antes que embeddings. Detalle completo en `/logs/session-2026-07-24.md` y en la nota de T174 en `TASKS.md`.

## Pending / next session priority
1. **T148 fase 3 + T174 — `design` + `build` del slice manual de tagging/curación** (foco de la próxima sesión, **sin bloqueos de diseño pendientes**): UI de tagging (chips/dropdowns del vocabulario cerrado) en `src/pages/portal/coach/AlumnoDetalle.jsx`; migración de tabla **`note_tags`** + **`verify-rls`** en sandbox *antes* de la UI (regla del proyecto); módulo compartido **`supabase/functions/_shared/taxonomy.ts`** (consolidar `SUB_DIMENSIONS`, hoy duplicado a medias con `athletics.js`); y la vista de curación manual del bundle. Ver `docs/prd-context-tagging-engine.md` y la nota de T174 en `TASKS.md`.
2. **En cancha de Marco antes del build:** validar con coaches el vocabulario de `note_type` y la lista de `player_archetype` (§3.4/§3.7 del PRD del engine).
3. **T148 fase 4** (wiring del bundle curado a `generate-quarterly-plan`): sigue **BLOQUEADA por T150** (convención de evals) — no cambia.
4. **T173** (matriz normativa de pruebas físicas, Team) bloquea a **T169** — Marco ya le escribió al coach, esperando respuesta.
5. **T172** (backlog, Medium): verificar dominio propio en Resend — bloquea el digest semanal de onboarding. **Pendiente confirmar si `toptenis.mx` ya está comprado**; si sí, se destraba sin comprar nada.
6. **T175** (backlog, Low, nuevo): dashboards de uso/engagement — revisar primero si Supabase trae algo nativo. No crítico.
7. T116 (CMS↔sitio público, backlog) sigue en pausa hasta la junta con marketing — confirmar si ya sucedió.
8. No bloqueante: check "Supabase Preview" en GitHub sigue en rojo (`Remote migration versions not found in local migrations directory`) — preexistente desde el 21 Jul, no bloquea el deploy de Vercel, sin task todavía.
9. Backlog no bloqueante, sin fecha: 8 warnings de Supabase Advisors, decisión de branch-per-task, decisión de typing — ver `SETUP_CHECKLIST.md`.
10. Fixtures en **sandbox** (inofensivos, sandbox es libre): password de prueba de Tlaca (`TestNotas2026!`), una nota de texto en Santiago, una nota de voz `done` con audio real.

## Decided / deferred
- **T148 fase 3 = tagging + curación MANUAL, sin LLM** (2026-07-24) — no toca `verify-evals` ni depende de T150, enviable a prod. El auto-tagging LLM se difiere a fase 4+ (gated por T150). Los tags manuales se vuelven el eval dataset de T150 y el índice de recuperación estructurada (RAG v0).
- **Tagging system elevado a su propio engine/task, T174** (2026-07-24) — infra transversal de contexto (RAG), sobrevive a T148; PRD `docs/prd-context-tagging-engine.md`. Se descartó inflar el PRD de notas.
- **`valence` descartada como faceta** (2026-07-24) — sería nullable y se traslapaba con `note_type` sin definición clara; la polaridad va vía `note_type` y como tendencia derivada.
- **Modelo de datos de tags = tabla nueva `note_tags`** (2026-07-24) — aislada de `athlete_notes` para no arriesgar corrupción; se descartó guardar arrays en `athlete_notes`.
- **Módulo compartido de taxonomía = `supabase/functions/_shared/taxonomy.ts`, importado por el front en build (no fetch runtime)** (2026-07-24) — fuente única, cero duplicación; plan B = guard test de drift en CI.
- **Tendencias (fortaleza/debilidad) = capa derivada futura, en producción** (2026-07-24) — recurrencia de failure/setback sobre una sub-dimensión a lo largo de periodos; no es tag a mano ni parte del v0.
- **`confidence`/severidad en tags: diferido** (2026-07-24) — buena idea, sin lugar claro aún.
- **Salud/lesión NO es faceta** (2026-07-24) — salud = estado default sin taggear; lesión = `note_type: setback`.
- **Inferencia "qué plan sirve para qué arquetipo" = juego largo, hipótesis no prueba** (2026-07-24) — N=10 es chico; lo accionable hoy es capturar `player_archetype` (lectura del coach, para contrastar contra inferencia futura) y mantener la ligadura objetivo→outcome limpia, para que la inferencia algún día sea solo una query. Embeddings (pgvector) diferidos hasta que la recuperación estructurada por tags no alcance.
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
