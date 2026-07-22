# Tasks archive — Top Tennis Performance Academy

Completed tasks, moved here the moment a task reaches `done` (by the `commit` skill, not at session close). Always check this file first when looking for a recently completed task. Once it reaches 50 entries, it splits into a dated file (see `TASKS_ARCHIVE_INDEX.md`).

**2026-07-18:** starts with the 33 most recently created of the original 83 migrated `done` tasks (the other 50, created 2026-05-22 through 2026-06-23, were split immediately into `TASKS_ARCHIVE_2026-05-22_2026-06-23.md` — see the caveat there about creation- vs. completion-date). Going forward, new completions get a real `done:` date.

## Index (quick scan)

| id | title | category | created |
|---|---|---|---|
| T168-fix-rls-report-physical-cross-coach | Fix: RLS de report_physical no permite lectura cross-coach (gap heredado de T140) | Dev | 2026-07-22 |
| T160-ambiente-pruebas-app-y-migraciones-schema-only | Ambiente de pruebas air-tight: app apunta a sandbox por default, migraciones solo-schema, log de pushes a prod | Dev | 2026-07-20 |
| T093-cds-bloque6-highlights-por-atleta | CDS — Bloque 6: Highlights por atleta (fotos + videos) | Dev | 2026-06-23 |
| T094-vista-equipo-summary-view | feat: vista Equipo — summary view multi-atleta para coaches | Dev | 2026-06-24 |
| T096-planes-trimestrales-generacion-llm | Planes trimestrales — generación con LLM y tracking en reportes mensuales | Dev | 2026-06-24 |
| T097-scope-planning-measurement | Scope: rediseño de planning + measurement (objetivos medibles vs plan) | Team | 2026-06-25 |
| T104-pm-v2-ui-planescoach-focos | P&M v2 — UI nuevo flujo PlanesCoach: compuerta de selección de focos + revisión | Dev | 2026-06-26 |
| T105-pm-v2-migracion-schema-v2 | P&M v2 — Migración schema v2 (objetivos + planes) y deprecar objective_text | Dev | 2026-06-26 |
| T106-pm-v2-generate-quarterly-plan-v3 | P&M v2 — generate-quarterly-plan v3: dump de observaciones → dimensiones + anclas | Dev | 2026-06-26 |
| T107-pm-v2-estado-draft-persistente | P&M v2 — Estado draft persistente en el flujo de planes | Dev | 2026-06-27 |
| T112-pm-v2-guard-un-plan-por-periodo | P&M v2 — Guard: un plan por atleta por periodo | Dev | 2026-06-27 |
| T113-pm-v2-guardrail-calidad-dump | P&M v2 — Guardrail no-bloqueante de calidad del dump | Dev | 2026-06-27 |
| T114-backlog-skills-internos-doc | Definir backlog de skills internos + crear docs/skills-backlog.md | Dev | 2026-06-29 |
| T115-limpiar-directorio-anidado | Limpiar directorio anidado top-tenis-performance-academy/ (leftover de movimiento de archivos) | Dev | 2026-06-30 |
| T117-fix-cms-cache-imagenes-relabel | Fix CMS: cache de imágenes al reemplazar + relabel slot sede en Programas | Dev | 2026-06-30 |
| T119-limpieza-datos-dummy-usuarios | Limpieza de datos dummy y usuarios (reset a trio de prueba) | Dev | 2026-06-30 |
| T120-pm-rubrica-objetivos-filosofia | P&M — Rúbrica/skill: objetivos alineados a la filosofía de la academia | Team | 2026-07-01 |
| T122-pm-rubrica-verificacion-observaciones | P&M — Rúbrica/skill: verificación de observaciones por dimensión | Team | 2026-07-01 |
| T123-pm-fix-diagnostico-sin-nombre-atleta | P&M — Fix: diagnóstico/objetivo nunca usan nombre del atleta ni tono crítico | Dev | 2026-07-01 |
| T124-pm-fix-no-reidentificar-focos | P&M — Fix: no re-identificar focos si el dump no cambió | Dev | 2026-07-01 |
| T125-pm-fix-identify-sin-enumeracion | P&M — Fix: identify no depende de enumeración explícita en el dump | Dev | 2026-07-01 |
| T128-bug-amtp-scraper-gh-actions | Bug: AMTP Rankings Scraper falla en GH Actions (exit code 1) | Dev | 2026-07-02 |
| T129-fix-carryover-planes-archivados | Fix: carryover incluye planes archivados (falta filtro de status) | Dev | 2026-07-02 |
| T132-fix-textarea-observaciones-chica | Fix: textarea de observaciones muy chica (paso 2, Nuevo plan) | Dev | 2026-07-02 |
| T137-agentic-system-pm-fit-check | Agentic system P&M — fit check: ¿agent + skills o pipeline ya scopeado? | Dev | 2026-07-02 |
| T138-fix-amtp-ranking-perfil-equipo | Fix: AMTP ranking no se muestra en perfil de atleta ni en Equipo | Dev | 2026-07-03 |
| T140-quitar-constraint-coach-atleta | Quitar constraint de asignación coach↔atleta (libre para cualquier coach) | Dev | 2026-07-03 |
| T142-reasignar-coach-ian-kleiman | Reasignar coach de Ian Kleiman a Armando Tlacaelel | Dev | 2026-07-06 |
| T143-pm-implementar-rubrica-observaciones | P&M — Implementar rúbrica/skill: verificación de observaciones por dimensión | Dev | 2026-07-07 |
| T144-presentacion-progreso-roadmap | Presentación de progreso + roadmap 6 meses para el equipo | Team | 2026-07-07 |
| T145-mejorar-claude-md-flujo-skills | Mejorar CLAUDE.md y flujo de skills (apertura/cierre de sesión, backlog) | Dev | 2026-07-09 |
| T146-skill-feature-build-flow | Construir skill #1: feature-build-flow (rebanada de feature) | Dev | 2026-07-09 |
| T147-seccion-mis-planes-portal-atleta | Sección de "Mis Planes" en el portal del atleta | Dev | 2026-07-09 |
| T151-revisar-scope-planning-measurement | Revisar scope-planning-measurement.md incorporando lo construido en Mi Plan | Dev | 2026-07-14 |
| T153-pm-mantenimiento-outcome-cierre | P&M — ¿mantenimiento deberia tener outcome al cerrar el plan? | Dev | 2026-07-15 |
| T156-pm-v2-separar-outcome-carryover | P&M v2 — separar outcome en estado (logrado/parcial/fallido) + carryover (continúa/depriorizado) | Dev | 2026-07-15 |
| T157-migrar-skills-kit-generico | Migrar flujo de construcción a skills genéricos del kit y limpiar referencias a feature-build-flow | Dev | 2026-07-18 |
| T086-landing-reescribir-home-jsx | Landing — reescribir Home.jsx con nueva arquitectura | Dev | 2026-06-23 |
| T102-pm-v2-close-quarterly-plan | P&M v2 — close-quarterly-plan + retrospectives + handoff periodo→periodo | Dev | 2026-06-26 |

## Full entries

### T093-cds-bloque6-highlights-por-atleta — CDS — Bloque 6: Highlights por atleta (fotos + videos)
- category: Dev
- type: Feature
- epic: Phase 3 — Academy Tools
- priority: High
- status: done
- created: 2026-06-23

**Notas:**
Tabla athlete_media. Tab 'Highlights' en CDS: selector de atleta → 5 fotos curadas (drag & drop) + slots de video por golpe (forehand, backhand, servicio, volea, devolución). Vista atleta: pendiente para después.

### T094-vista-equipo-summary-view — feat: vista Equipo — summary view multi-atleta para coaches
- category: Dev
- type: —
- epic: —
- priority: —
- status: done
- created: 2026-06-24

**Notas:**
(sin notas)

### T096-planes-trimestrales-generacion-llm — Planes trimestrales — generación con LLM y tracking en reportes mensuales
- category: Dev
- type: Feature
- epic: —
- priority: High
- status: done
- created: 2026-06-24

**Notas:**
Cerrado en barrido de kanban (15 Jul 2026, confirmado por Marco) — task genérico sin scope propio, superado por los sub-tasks específicos de P&M v2 (guardrail dump quality, draft persistente, guard un plan/atleta/periodo, schema v2, rúbrica de objetivos, UI PlanesCoach, close-quarterly-plan) ya construidos o en In Review.

### T097-scope-planning-measurement — Scope: rediseño de planning + measurement (objetivos medibles vs plan)
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-06-25

**Notas:**
Scope doc en docs/scope-planning-measurement.md. Cubre: objetivo como instrumento del -2..+2, gramática estándar, ejes de anclas, focos (≤5)+mantenimiento, ciclo de vida con cierre de loop, y handoff periodo→periodo (retrospective coach+atleta, status completed, trayectoria de scores como input, cold-start como captura). Modelo acordado, listo para build. Cerrado en barrido de kanban (13 Jul 2026, confirmado por Marco) — el modelo se construyó por completo (schema v2, EF generate/identify/regenerate, rúbrica de observaciones y objetivos, Mi Plan).

### T104-pm-v2-ui-planescoach-focos — P&M v2 — UI nuevo flujo PlanesCoach: compuerta de selección de focos + revisión
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: done
- created: 2026-06-26

**Notas:**
CONSTRUIDA (PlanesCoach.jsx reescrito): flujo 4 pasos - atleta/periodo, dump, seleccion de focos <=5 (carryover vs nuevas, pre-selecciona candidatas), generacion + revision por feedback con anclas -2..+2 visibles + rubrica corta. Regla dura: regenerar exige comentario. Captura objective_generation_log con linaje al guardar. Bridge: objective_text=objetivo para no romper NuevoReporte/AthleteVoice. Lint+tests+build OK. Ref §8, §13. Cerrado en barrido de kanban (13 Jul 2026, confirmado por Marco) — el test en vivo pendiente se completó en los live tests posteriores (Casos Diego/Kevin/Sofía/Emilio/Mariana), documentados en los tasks de rúbrica ya Done.

### T105-pm-v2-migracion-schema-v2 — P&M v2 — Migración schema v2 (objetivos + planes) y deprecar objective_text
- category: Dev
- type: Infra
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-06-26

**Notas:**
quarterly_plan_objectives: tipo, diagnostico, objetivo, anchors(jsonb), carryover_of, outcome, final_assessment, baseline/target/unit. quarterly_plans: status 'completed', coach_retrospective, athlete_retrospective, closed_at. Eliminar objective_text. Archivar/eliminar los 2 planes dummy. Ref §9 y §13.

### T106-pm-v2-generate-quarterly-plan-v3 — P&M v2 — generate-quarterly-plan v3: dump de observaciones → dimensiones + anclas
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-06-26

**Notas:**
DESPLEGADA v4 (mode identify + generate + regenerate, legacy preservado). Fuente versionada en supabase/functions/generate-quarterly-plan/index.ts. Pendiente: test en vivo (necesita JWT/UI) y wiring de objective_generation_log al llamar. PRIMERA REBANADA. EF v3 con dos modos: (a) identificar sub-dimensiones + read corto + candidata_a_foco; (b) generar diagnostico + objetivo (gramatica §4) + 5 anclas con semantica corregida (0=por buen camino, -2=estancado, NO estado actual). Contrato con bundle previo (cold-start=null). Ref §10 y §13. Cerrado en barrido de kanban (13 Jul 2026, confirmado por Marco) — superado por el trabajo de rúbrica P&M (commits 2307af2, 7a7212f, 15bc341, b441eaa) ya Done.

### T107-pm-v2-estado-draft-persistente — P&M v2 — Estado draft persistente en el flujo de planes
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-06-27

**Notas:**
CONSTRUIDO. Columna draft_state (jsonb) en quarterly_plans (migración aplicada). PlanesCoach: crea draft al pasar paso 1→2, persiste dump/focos/objetivos en checkpoints (identify/generate/regenerate), guardar plan actualiza el draft (ya no inserta). Lista permite reanudar (click) o descartar borrador. Lint+65 tests OK. Ref §14. Cerrado en barrido de kanban (13 Jul 2026, confirmado por Marco) — comiteado junto con el guard de un plan por atleta/periodo en 8e7560c; el bloqueo de .git/index.lock quedó resuelto sin reportarse por texto, confirmado ahora vía git log.

### T112-pm-v2-guard-un-plan-por-periodo — P&M v2 — Guard: un plan por atleta por periodo
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-06-27

**Notas:**
CONSTRUIDO. Unique index (athlete_id, period_start) WHERE status <> 'archived' en quarterly_plans (migración aplicada) + check en UI al continuar paso 1: si existe plan activo/completado para ese atleta+periodo, bloquea con mensaje y link al plan; si existe un draft, reanuda automático. Nota: la excepción de 'pasar la fecha del 3er reporte' mencionada en el scope NO se implementó (ambigua/baja prioridad) — hoy la única salida es archivar/borrar el plan existente. Lint+65 tests OK. Ref §14. Cerrado en barrido de kanban (13 Jul 2026, confirmado por Marco) — el commit 8e7560c ya incluía este guard; el bloqueo de .git/index.lock quedó resuelto sin reportarse por texto, confirmado ahora vía git log.

### T113-pm-v2-guardrail-calidad-dump — P&M v2 — Guardrail no-bloqueante de calidad del dump
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-06-27

**Notas:**
CONSTRUIDO. generate-quarterly-plan v pm-v2.3: modo identify ahora también devuelve dump_quality {level: 'detallado'|'vago', motivo}, evaluado por el mismo LLM sin llamada extra. Desplegada (v7). UI: banner ámbar no-bloqueante en paso 3 cuando level='vago', con motivo y atajo para volver a editar el dump; no impide continuar. Lint+65 tests OK. Ref §15. Cerrado en apertura de sesión (14 Jul 2026, confirmado por Marco) — el commit pendiente por .git/index.lock se resolvió sin reportarse por texto, confirmado vía git log (commit 8e7560c).

### T114-backlog-skills-internos-doc — Definir backlog de skills internos + crear docs/skills-backlog.md
- category: Dev
- type: Chore
- epic: —
- priority: Medium
- status: done
- created: 2026-06-29

**Notas:**
Documento vivo en docs/ que rastrea los skills candidatos para reducir context rot (feature-slice, schema+RLS, e2e QA, design polish, scraper rankings). Incluye decisiones de diseno de cada skill.

### T115-limpiar-directorio-anidado — Limpiar directorio anidado top-tenis-performance-academy/ (leftover de movimiento de archivos)
- category: Dev
- type: Chore
- epic: —
- priority: Low
- status: done
- created: 2026-06-30

**Notas:**
Diagnosticado y verificado. El sandbox de Cowork no puede borrar archivos en el mount (unlink = Operation not permitted), así que Marco debe correr la limpieza local: rm .git/index.lock && git rm -r top-tenis-performance-academy && git commit -m 'chore: eliminar dir anidado top-tenis-performance-academy/ sobrante de movimiento de archivos'. Confirmado: nada importa de ese path, lint+tests pasan, el src/ vivo es el de la raíz. Cerrado (13 Jul 2026) — Marco confirmó que ya borró el directorio anidado localmente.

### T117-fix-cms-cache-imagenes-relabel — Fix CMS: cache de imágenes al reemplazar + relabel slot sede en Programas
- category: Dev
- type: Bug
- epic: —
- priority: Medium
- status: done
- created: 2026-06-30

**Notas:**
(1) Fotos de perfil/coach usaban ruta fija en storage → misma URL → navegador servía la imagen vieja al reemplazar. Fix: cache-busting ?v=timestamp en ProfileCard y HighlightPhotoSlot. (2) Slot foto_programa estaba etiquetado 'Foto hero' pero la única imagen de Programas es la sede; renombrado a foto_sede / 'Foto de la sede (canchas)'. Cerrado en apertura de sesión (14 Jul 2026, confirmado por Marco) — el commit pendiente por .git/index.lock se resolvió sin reportarse por texto, confirmado vía git log (commits eed1e7d, 1dd1a21).

### T119-limpieza-datos-dummy-usuarios — Limpieza de datos dummy y usuarios (reset a trio de prueba)
- category: Dev
- type: Chore
- epic: —
- priority: Medium
- status: done
- created: 2026-06-30

**Notas:**
Reset de BD: queda Test Athlete (ex-Marco Damán, mdamian.aguilar@gmail.com) con sus datos, Test Coach/Head Coach (ex-Armando, tlaca@toptenis.mx) y CMs valerochi + agantoniolar. Borrados: 3 atletas dummy (Emiliano/Ian/Ricardo) + sus rankings/UTR/snapshots, 3 coaches (Jesús/Lalo/Miguel), CM marcotest, y 3 usuarios auth (marco@toptenispa.mx y dummy huérfanos + marcotest). Landing (9 media_assets) conservada. Ejecutado en transacción.

### T120-pm-rubrica-objetivos-filosofia — P&M — Rúbrica/skill: objetivos alineados a la filosofía de la academia
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-07-01

**Notas:**
Cerrado 9 Jul 2026 (Session 28). Opción 2 (pasada de validación aparte, modo validate en generate-quarterly-plan, pm-v4.0-2026-07-09 v16) implementada y validada: 0/20 objetivos inventados o calcados pasaron incorrectamente como 'suficiente' en la regresión de los 5 casos sintéticos (vs. 48% y 89% de misses con la opción 1 self-eval). UI conectada en PlanesCoach.jsx: aviso condicional por FocoCard usando el veredicto de validate, se retiró la caja fija RubricaBox. Lint + tests pasan. Commit b441eaa. Detalle completo en docs/scope-rubrica-objetivos.md §11-§12.

### T122-pm-rubrica-verificacion-observaciones — P&M — Rúbrica/skill: verificación de observaciones por dimensión
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-07-01

**Notas:**
Hueco compañero del anterior: la observación del coach a veces ya trae la solución implícita en vez de describir el síntoma/causa observable, lo que deja al LLM sin material real para prescribir (mismo ejemplo de transferencia_partido). Contraste bueno: 'juega con mucha energía y confianza en su derecha en entrenamiento, pero en partidos pierde esa energía y solo pasa la bola sin proponer' — sí trae algo concreto y accionable. Se necesita rúbrica/skill para verificar que cada dimensión identificada traiga algo concreto para trabajar, no solo la etiqueta del síntoma. Doc de scoping propio. Ref docs/scope-planning-measurement.md §16.

Actualización (live test 4, Caso Emilio, 1 Jul 2026): agregar convención de TONO a la rúbrica — el dump del coach a veces frasea observaciones como crítica directa a la persona y usa el nombre del atleta. La rúbrica debe incluir cómo escribir constructivamente (conducta observable, no juicio de carácter) y evitar nombrar al atleta. Ya hay un fix parcial del lado de generación (pm-v2.4), pero la convención de cómo el coach redacta la observación en primer lugar sigue pendiente de definir. Ref §17.

Actualización (live test 5, Caso Sofía, 1 Jul 2026): el guardrail actual (dump_quality vago/detallado a nivel de dump completo) NO se disparó pese a observaciones sin mecánica ni dirección de mejora. Falta granularidad por dimensión + una vía de intervención cuando la observación es ambigua. Ref §18.

Actualización (live test 7, Caso Kevin, 1 Jul 2026): el read_corto que resume cada sub-dimensión en el paso de identify puede perder parte del mensaje en observaciones compuestas. Ejemplo: obs original 'no ajusta el plan cuando el rival le cambia el ritmo del partido — sigue con el mismo patrón aunque no le esté funcionando' quedó truncada en read_corto a solo la primera cláusula, perdiendo 'sigue con el mismo patrón…'. generate sí recuperó el texto completo porque vuelve a leer el dump entero. La rúbrica debe ponerle un piso al read_corto para que no pierda cláusulas relevantes de una observación compuesta. Ref §20.

Actualización (revisión de scope, 2 Jul 2026, §21): estructura preliminar de Marco para una observación bien formada — 5 componentes: (1) Dimensión clara, (2) Enfoque/patrón/mecanismo (nombre pendiente), (3) Intensidad, (4) Context clarifier, (5) Adicional opcional. Ref §21.

Actualización (4 Jul 2026): doc de scoping completo en docs/scope-rubrica-observaciones.md — anatomía de 5 componentes (nombre propuesto para el componente 2: 'Mecanismo', pendiente de confirmar), regla de granularidad por dimensión (no por dump completo), guardrail no-bloqueante, convención de tono, piso de cobertura para read_corto, regla de fusión para dimensiones repetidas, ubicación como skill modular en el pipeline (per agentic-fit-check-pm §5.1), y tabla de validación contra los 5 casos sintéticos. Listo para revisión de Marco antes de mover a build.

### T123-pm-fix-diagnostico-sin-nombre-atleta — P&M — Fix: diagnóstico/objetivo nunca usan nombre del atleta ni tono crítico
- category: Dev
- type: Bug
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-07-01

**Notas:**
Encontrado en live test 4 (Caso Emilio): el dump nombraba al atleta y fraseaba una observación como juicio directo ('Emilio no tiene término medio'), con riesgo de que el diagnóstico generado heredara ese tono al discutirse con el atleta. Fix (pm-v2.4): regla nueva en GENERATE_SYSTEM — nunca usar el nombre del atleta en diagnóstico/objetivo, traducir crítica directa a conducta observable sin inventar. Desplegado v8. Relacionado con el task de rúbrica/skill de verificación de observaciones (convención de tono pendiente del lado del coach). Ref docs/scope-planning-measurement.md §17.

### T124-pm-fix-no-reidentificar-focos — P&M — Fix: no re-identificar focos si el dump no cambió
- category: Dev
- type: Bug
- epic: Phase 2 — Analytics
- priority: Medium
- status: done
- created: 2026-07-01

**Notas:**
Encontrado en live test 3 (Caso Mariana): volver al paso 2 sin editar el dump forzaba una nueva llamada a identify, perdiendo/reordenando la selección de focos ya revisada. Fix: se cachea el texto del dump identificado (lastIdentifiedObs); si coincide, navega directo al paso 3 sin llamar al modelo. Ref docs/scope-planning-measurement.md §16.

### T125-pm-fix-identify-sin-enumeracion — P&M — Fix: identify no depende de enumeración explícita en el dump
- category: Dev
- type: Bug
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-07-01

**Notas:**
Encontrado en live test 4 (Caso Emilio, narrow): con el dump enumerado ('Uno:'/'Dos:') identify detectaba las 2 sub-dimensiones bien; sin los marcadores, solo detectaba una (perdía manejo_riesgo). Fix (pm-v2.4): regla explícita en IDENTIFY_SYSTEM de leer por contenido, no por marcadores de estructura. Caso de regresión agregado como Caso 2b en docs/dumps-test-planning-edge-cases.md. Desplegado v8. Ref docs/scope-planning-measurement.md §17.

### T128-bug-amtp-scraper-gh-actions — Bug: AMTP Rankings Scraper falla en GH Actions (exit code 1)
- category: Dev
- type: Bug
- epic: Phase 2 — Analytics
- priority: Medium
- status: done
- created: 2026-07-02

**Notas:**
Primera corrida programada (1 Jul 2026, run #1) del cron mensual falló: job completo en ~8s, step "Run scraper" terminó con exit code 1. Hay también una anotación de "Node.js 20 is deprecated" (actions/checkout@v4, actions/setup-python@v5 forzados a Node 24) pero es un warning de plataforma no relacionado al fallo — no bloquea el run por sí solo. Causa real sin confirmar: no se pudo leer el log completo (requiere sign-in). Hipótesis por duración corta + código del scraper (scripts/amtp_scraper.py): la primera llamada a amtp.mx en get_anon_key() no está en try/except y puede estar fallando rápido (403/timeout/cambio de estructura del sitio). Pendiente: Marco revisa el log completo en GitHub (run 28507947517) y lo comparte, o se agrega manejo de errores más claro al script para el próximo run.

### T129-fix-carryover-planes-archivados — Fix: carryover incluye planes archivados (falta filtro de status)
- category: Dev
- type: Bug
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-07-02

**Notas:**
Encontrado en live test 5 (Caso Sofía, 1 Jul 2026): salió 'ética de trabajo' como foco de carryover del periodo anterior sin explicación clara en el dump sintético.

Actualización (live test 6, Caso Diego, 1 Jul 2026): se repite el patrón con 'devolución'.

CONFIRMADO por SQL (live test 7, Caso Kevin, 1 Jul 2026): la query de carryover en handleIdentify (PlanesCoach.jsx) NO filtra por status — solo hace .eq('athlete_id', selAthlete).lt('period_start', periodStart).order('period_start', desc).limit(1). El único atleta real en BD tiene un plan ARCHIVADO (id 2581c5b1…, creado 27 Jun) con focos serve/backhand/devolucion/seleccion_golpe/etica_trabajo — coincide exacto con los dos misterios anteriores. No es un bug de matching ni un artefacto del dump: el carryover toma el plan más reciente por period_start sin importar si está archivado. Cada caso sintético guardado contamina el carryover del siguiente. Fix concreto: agregar .eq('status','active') (o .in(['active','completed'])) a la query. Bug bien entendido, no depende del redesign — candidato a fix inmediato. Ref docs/scope-planning-measurement.md §20.

### T132-fix-textarea-observaciones-chica — Fix: textarea de observaciones muy chica (paso 2, Nuevo plan)
- category: Dev
- type: Chore
- epic: Phase 2 — Analytics
- priority: Low
- status: done
- created: 2026-07-02

**Notas:**
Encontrado en live test 6 (Caso Diego, 1 Jul 2026): la caja de texto donde el coach escribe las observaciones (step 2 del wizard de Nuevo plan, PlanesCoach.jsx) es muy chica para dumps largos. Aumentar rows/min-height. Fix de UI acotado, no depende del redesign. Ref docs/scope-planning-measurement.md §19.

### T137-agentic-system-pm-fit-check — Agentic system P&M — fit check: ¿agent + skills o pipeline ya scopeado?
- category: Dev
- type: Chore
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-07-02

**Notas:**
Antes de scopear las 2 rúbricas/skills en backlog (verificación de observaciones, objetivos alineados a la filosofía) como arquitectura agent+skills, validar si P&M realmente necesita esa estructura o si el pipeline ya scopeado en docs/scope-planning-measurement.md (identify → generate → validate advisory → HITL regenerate) ya es suficiente. Contexto: Marco enmarcó el redesign de P&M como POC de un patrón de agentic system generalizable (evaluation loop reusable para cualquier empresa de servicios), no solo como feature de la academia — doble objetivo: resolver el problema real + hacer reps/showcase en agentic systems. No quiere forzar la arquitectura sin fit real. Doc de fit-check: docs/agentic-fit-check-pm.md (2 Jul 2026). CERRADO 15 Jul 2026: es un proceso ongoing (fit-check se revisita, no es un entregable único) — se cierra como Done pero no es foco central del proyecto; retomar solo si surge necesidad concreta de scopear una skill/agent.

### T138-fix-amtp-ranking-perfil-equipo — Fix: AMTP ranking no se muestra en perfil de atleta ni en Equipo
- category: Dev
- type: Bug
- epic: Phase 2 — Analytics
- priority: Medium
- status: done
- created: 2026-07-03

**Notas:**
Commiteado en 6cd064e. AlumnoDetalle.jsx: setAmtp ya no se salta cuando el atleta no tiene reportes. Equipo.jsx: conectado a amtp_rankings (cards + tabla), mismo patron que Alumnos.jsx. Lint + test (65/65) verdes antes del commit. Pendiente: git push desde terminal de Marco.

### T140-quitar-constraint-coach-atleta — Quitar constraint de asignación coach↔atleta (libre para cualquier coach)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: done
- created: 2026-07-03

**Notas:**
Ampliado 9 Jul 2026 — Marco quiere rediseñar toda la relación coach↔atleta, no solo quitar el constraint. Alcance confirmado tras revisar código+RLS: (1) Equipo.jsx se queda como la única vista de 'todos los atletas' — coaches ya pueden ver athletes/reports/on_court/character/PTF de cualquiera (RLS coaches_select_all_* ya existen), falta abrir SELECT a todos los coaches en athlete_utr_history, athlete_profile_snapshots, athlete_recruitment_profile, y en quarterly_plans/quarterly_plan_objectives (hoy sin política de lectura entre coaches). (2) Eliminar Alumnos.jsx ('Mis Atletas') por completo — hoy filtra .eq('coach_id', user.coach_id); comparte <TabBar> con Equipo.jsx (quitar tab 'Mis'), y NuevoAtleta.jsx navega ahí al cancelar/crear. (3) Cualquier coach puede crear reportes/planes para cualquier atleta — hoy NuevoReporte.jsx, ReportesPorPeriodo.jsx y PlanesCoach.jsx (picker de creación + lista de planes) filtran por .eq('coach_id', user.coach_id); AlumnoDetalle.jsx tiene un flag isOwn (athlete.coach_id === user.coach_id) que oculta '+ Nuevo reporte' y muestra 'Solo lectura' a coaches no asignados — se elimina esa distinción. (4) En el alta (NuevoAtleta.jsx) deja de tener sentido asignar automáticamente coach_id = user.coach_id como 'dueño' del atleta. Decisión pendiente con Marco: ¿coach_id en athletes se hace nullable (se quita el ownership por completo) o se conserva solo como metadata de 'quién dio de alta' sin usarse en RLS/UI? Hoy athletes.coach_id es NOT NULL en DB y está en el FK de 9 tablas. (5) Fuera de este task, después de todo lo demás: feature de notas de voz/texto que alimenta contexto del atleta — ver task separado 'Servicio de notas de voz/texto por atleta'. Requiere doc de scoping propio (schema + RLS) antes de tocar código, patrón Skill #2 de docs/skills-backlog.md.

### T142-reasignar-coach-ian-kleiman — Reasignar coach de Ian Kleiman a Armando Tlacaelel
- category: Dev
- type: Chore
- epic: —
- priority: Low
- status: done
- created: 2026-07-06

**Notas:**
Update coach_id en tabla athletes: Ian Kleiman (iankleiman2009@icloud.com) pasa de Test Coach a Armando Tlacaelel López Chávez (tlacaelelarmando@hotmail.com).

### T143-pm-implementar-rubrica-observaciones — P&M — Implementar rúbrica/skill: verificación de observaciones por dimensión
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-07-07

**Notas:**
(sin notas)

### T144-presentacion-progreso-roadmap — Presentación de progreso + roadmap 6 meses para el equipo
- category: Team
- type: Chore
- epic: —
- priority: Medium
- status: done
- created: 2026-07-07

**Notas:**
(sin notas)

### T145-mejorar-claude-md-flujo-skills — Mejorar CLAUDE.md y flujo de skills (apertura/cierre de sesión, backlog)
- category: Dev
- type: Chore
- epic: —
- priority: Medium
- status: done
- created: 2026-07-09

**Notas:**
(sin notas)

### T146-skill-feature-build-flow — Construir skill #1: feature-build-flow (rebanada de feature)
- category: Dev
- type: Chore
- epic: —
- priority: High
- status: done
- created: 2026-07-09

**Notas:**
(sin notas)

### T147-seccion-mis-planes-portal-atleta — Sección de "Mis Planes" en el portal del atleta
- category: Dev
- type: Feature
- epic: —
- priority: High
- status: done
- created: 2026-07-09

**Notas:**
(sin notas)

### T151-revisar-scope-planning-measurement — Revisar scope-planning-measurement.md incorporando lo construido en Mi Plan
- category: Dev
- type: Chore
- epic: —
- priority: High
- status: done
- created: 2026-07-14

**Notas:**
(sin notas)

### T153-pm-mantenimiento-outcome-cierre — P&M — ¿mantenimiento deberia tener outcome al cerrar el plan?
- category: Dev
- type: Chore
- epic: Phase 2 — Analytics
- priority: Low
- status: done
- created: 2026-07-15

**Notas:**
Decidido 15 Jul 2026 (docs/scope-close-quarterly-plan.md §16.6): mantenimiento se queda como esta, deliberadamente ligero — sin outcome, sin friccion de cierre. Si algo relevante pasa ahi, se sube a foco en el plan del siguiente trimestre. Sin cambios de codigo, es el comportamiento actual confirmado a proposito.

### T156-pm-v2-separar-outcome-carryover — P&M v2 — separar outcome en estado (logrado/parcial/fallido) + carryover (continúa/depriorizado)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: High
- status: done
- done: 2026-07-18
- created: 2026-07-15

**Notas:**
CONSTRUIDO 15 Jul 2026, todo comiteado (29f0f07 + aad9365). Migracion outcome/carryover + UI de 2 controles + fix de carryover (29f0f07). Fix de 4 bugs de la revision en vivo con Marco Damian: placeholder de 'Logrado' corregido, bloque de scores/anclas con fallback explicito cuando no hay datos, formatObjetivoMotivo robusto a separador (aad9365). Lint+112 tests OK en ambos commits. Detalle en docs/scope-close-quarterly-plan.md §16.3/§16.3.1.
- 2026-07-18: Marco confirmó git push hecho y prueba en vivo con Test Athlete (que sí tiene reportes) exitosa — highlight/badges con datos reales OK. Movido a done.

### T157-migrar-skills-kit-generico — Migrar flujo de construcción a skills genéricos del kit y limpiar referencias a feature-build-flow
- category: Dev
- type: Chore
- epic: —
- priority: Medium
- status: done
- done: 2026-07-18
- created: 2026-07-18

**Notas:**
- 2026-07-18: Se detectó (vía `ListSkills`) que el registro de skills de Cowork estaba desincronizado del repo en ambas direcciones — mostraba duplicados obsoletos (`commit-kanban-sync`, `session-open-close`) y le faltaban skills genéricos del kit ya presentes en `.claude/skills/` (`build`, `design`, `verify-tests`, `verify-evals`, `verify-ui`). Refrescar la sesión movió el problema pero no lo resolvió limpio.
- 2026-07-18: Se empaquetaron (`skill-creator` + `package_skill.py`, sin reescribir contenido) los 5 skills genéricos ya existentes en `.claude/skills/` y se presentaron vía tarjeta "Save skill" — Marco los instaló a nivel cuenta.
- 2026-07-18: Se confirmó que el kit ya se auto-orquesta (cada skill declara a quién le entrega después: `scope`→`design`→`build`→`verify-tests`/`verify-evals`/`verify-ui`→`commit`), por lo que `feature-build-flow` como orquestador central dejó de ser necesario. Decisión de Marco: dejar `feature-build-flow/SKILL.md` donde estaba pero quitar las referencias activas hacia él. Se editaron `CLAUDE.md` (regla 6), `COWORK_PROJECT_INSTRUCTIONS.md` (paso 2, re-pegado por Marco en Cowork Settings) y `.claude/skills/commit/SKILL.md` (descripción + "Cuándo se usa"); `SETUP_CHECKLIST.md` actualizado para reflejar el estado nuevo. Historial (`docs/scope-*.md`, `BACKLOG.md`, `docs/skills-backlog.md`, `notion/`, backups, entradas ya escritas de `TASKS_ARCHIVE.md`/`STATUS.md`) dejado intacto a propósito — son registro de decisiones pasadas, no instrucciones vivas.
- 2026-07-18: Marco generalizó por su cuenta `schema-rls-verification` como `verify-rls` (mismo patrón, instalado en Cowork) y decidió borrar tanto `.claude/skills/feature-build-flow/SKILL.md` como `.claude/skills/schema-rls-verification/SKILL.md` del repo — confirmado explícitamente como intencional. Ambos borrados comiteados junto con el cierre de esta sesión.

### T086-landing-reescribir-home-jsx — Landing — reescribir Home.jsx con nueva arquitectura
- category: Dev
- type: Feature
- epic: —
- priority: High
- status: done
- done: 2026-07-18
- created: 2026-06-23

**Notas:**
10 secciones: Hero (nuevo copy, 1 CTA), Stats (4° stat = 15+ universidades), El método TTPA (4 pilares), Lo que medimos (mock SwingVision + UTR sparkline + eval coach), Portal preview (tabla de períodos), Armando (nombre real + bio real), Para cada persona (atletas/padres/recruiters), Sede, Testimonios (placeholder), CTA (sin cambios). También fix nombre Alejandro→Armando en Nosotros.jsx.
- 2026-07-18: Confirmado ya construido y comiteado — commit ff343bf (2026-06-22) implementa las 10 secciones exactas del scope, con iteraciones posteriores (4d681c4 design polish, 402585b CMS) sobre el mismo archivo. `Nosotros.jsx` verificado sin ningún rastro de "Alejandro". Marco confirmó en apertura de sesión que no falta nada — movido a done sin cambios de código.

### T102-pm-v2-close-quarterly-plan — P&M v2 — close-quarterly-plan + retrospectives + handoff periodo→periodo
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: done
- done: 2026-07-18
- created: 2026-06-26

**Notas:**
CONSTRUIDO en 4 rebanadas (14-15 Jul 2026, commits ed706c6/7c92db6/869d7a6/4a36e3a). Cierre manual por foco + wiring de prior_bundle + scores/notas del trimestre en el cierre (como palabras via OC_LABEL) + pre-seleccion de focos 'continua' + salto automatico a crear el plan siguiente. Retrospectiva del coach quitada de la UI por ahora. Dummy data de Test Athlete (2 trimestres) corregida. Lint+110 tests OK, todo comiteado. PRIMERA CORRIDA EN VIVO (15 Jul 2026, docs/scope-close-quarterly-plan.md §16): confirmados C1-C11 + A1-A6 de docs/qa-guia-cierre-plan-trimestral.md. Salieron 2 bugs/gaps reales: (1) mantenimiento nunca tiene outcome -- confirmado, no bug, ver §16.1/16.6; (2) carryover 'continua' no se propaga al draft siguiente si no se re-menciona en el dump nuevo -- bug real, ver §16.2. Decision grande de Marco: el modelo de outcome se separa en estado final (logrado/parcial/fallido) x carryover (continua/depriorizado) independientes -- hoy son excluyentes y no deberian serlo (§16.3). Este cambio + el fix del bug de carryover quedan como task nuevo separado (T156, ya done), igual que fechas de ciclo de vida del plan (T155), botones 'mejorar' por objetivo (T154), y el ajuste de prompt de anclas de tecnica (T158) -- todos Backlog, todos referenciados en §16. Fixes triviales de copy/UI (calco->copia directa, warnings en caja amarilla) ya aplicados directo, sin task aparte.
- 2026-07-18: Blocker resuelto — T156 (separar outcome en estado + carryover) confirmado done, con push y prueba en vivo exitosa. Verificado en apertura de sesión que el resto de §16 ya está cubierto: §16.9 (badges de scores) confirmado construido en el código (`PlanesCoach.jsx` líneas 1170-1197) pese a que la nota del scope doc decía "no construido todavía" — corregida esa nota. §16.4/§16.7/§16.8 ya estaban separados como tasks de backlog (no bloquean el cierre de este master). §16.10 (mobile-first) resuelto vía regla 6 de `CLAUDE.md`. Marco confirmó cerrar T102 como done — el loop de cierre de plan trimestral que este task prometía resolver está completo y probado en vivo.

### T160-ambiente-pruebas-app-y-migraciones-schema-only — Ambiente de pruebas air-tight: app apunta a sandbox por default, migraciones solo-schema, log de pushes a prod
- category: Dev
- type: Chore
- epic: Infra / seguridad
- priority: High
- status: done
- done: 2026-07-20
- created: 2026-07-20

**Notas:**
- 2026-07-20: Abierto a partir de una pregunta de Marco sobre cómo está conectada la plataforma al sandbox. Encontrado: `src/lib/supabase.js` tenía la URL/key de **producción** hardcodeadas — correr `npm run dev` local, o cualquier `verify-ui` walkthrough, siempre hablaba contra producción real (10 atletas ya subidos). Además, se confirmó que varias migraciones históricas mezclan DDL con DML de datos reales hardcodeados (`.../20260608213016_reassign_all_remove_marco_reyes.sql`, `.../20260630185839_add_coach_profile_fields.sql`, `.../20260715233355_split_outcome_state_and_carryover.sql`, entre otras) — riesgo concreto: una migración probada contra sandbox (con datos distintos a prod) puede comportarse distinto/destructivamente al aplicarse a prod si mezcla schema y datos.
- 2026-07-20: Construido. (a) `src/lib/supabase.js` lee `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` de `import.meta.env`, sin fallback hardcodeado — falla fuerte si faltan. `.env.local` apunta al sandbox (`xchdawwajmnnhkncikig`) por default; verificado con `npm run build` que el bundle solo contiene la ref del sandbox. (b) `scripts/check-migrations-schema-only.mjs` — bloquea DML top-level en migraciones nuevas (filtra correctamente DML dentro de cuerpos de función/trigger y sintaxis `CREATE POLICY ... FOR UPDATE/INSERT/...`, escape hatch `-- ALLOW-DML: <razón>`); `--staged` en `.husky/pre-commit`, `--diff-against <ref>` como backstop en `.github/workflows/ci.yml`. (c) `supabase/PROD_MIGRATIONS_LOG.md` creado. Regla documentada en `CLAUDE.md` (regla 7) y referencia rota corregida en `verify-rls/SKILL.md`. `.env.example` actualizado. gitleaks: escaneado el historial completo (3 hallazgos, los 3 ya remediados, documentados en `.gitleaks.toml`), hook de pre-commit + backstop en `.github/workflows/gitleaks.yml`.
- 2026-07-20: Push a producción (`ba2a013..f02d338`). Primer push reveló que `gitleaks-action@v3` usa 8.24.3 por default (hardcodeado, no "latest") — esa versión tiene un bug real donde un `[[allowlists]]` global no suprime hallazgos de reglas heredadas vía `extend.useDefault = true`, lo que hizo fallar el check de CI marcando la publishable key del sandbox pese a estar allowlisteada. Reproducido localmente contra el binario 8.24.3 real, confirmado arreglado en 8.30.1. Fix: `GITLEAKS_VERSION: 8.30.1` pinneado en el workflow (`9d6d456`). Ambos checks de CI (`CI` y `gitleaks`) verdes tras el fix. Marco agregó las env vars de producción en Vercel y confirmó que el sitio en vivo carga correctamente. Cerrado.

### T168-fix-rls-report-physical-cross-coach — Fix: RLS de report_physical no permite lectura cross-coach (gap heredado de T140)
- category: Dev
- type: Bug
- epic: Infra / seguridad
- priority: High
- status: done
- created: 2026-07-22
- done: 2026-07-22
- branch: direct-to-main

**Notas:**
- 2026-07-22: Encontrado haciendo `verify-ui` de T161 Parte 1 (flags de onboarding) — la card de Santiago Herrera mostraba "Baseline físico pendiente" en `Equipo.jsx` pese a tener 2 pruebas físicas completadas (confirmado por SQL directo). Causa raíz: `report_physical` nunca recibió la policy `coaches_select_all_*` (lectura abierta a cualquier coach autenticado) que sí se agregó a `report_on_court`, `report_character` y `report_athlete_voice` cuando T140 abrió la visibilidad "cualquier coach ve a cualquier atleta" — quedó con la policy vieja `coaches_all_physical`, que solo permite ver reportes que el propio coach abrió (`reports.coach_id`). `docs/db-schema.md` dice "Lee de cualquiera" para esta tabla, pero eso es incorrecto desde T140 — no se había notado porque nada leía `report_physical` cross-coach hasta este task.
  - Confirmado en sandbox (`xchdawwajmnnhkncikig`): logueado como `tlaca@toptenis.mx` (coach), Santiago (reportes abiertos por el coach "Jesús") no muestra sus 2 `report_physical.completed_at` — via service role sí se ven, via la sesión del coach (RLS real) no.
  - Fix: agregar la policy faltante, mismo patrón exacto ya usado 3 veces:
    ```sql
    CREATE POLICY "coaches_select_all_physical"
      ON public.report_physical FOR SELECT
      USING (EXISTS (SELECT 1 FROM coaches WHERE coaches.user_id = auth.uid()));
    ```
  - Solo agrega una policy `SELECT` nueva — no toca `coaches_all_physical` (que sigue gobernando INSERT/UPDATE/DELETE, sin cambios) ni la policy de atletas. Puramente aditivo, sin riesgo de exponer nada que las otras 3 tablas hermanas ya no expongan.
  - Migración `supabase/migrations/20260722214102_coaches_select_all_physical.sql` — pasa `check-migrations-schema-only.mjs`. Aplicada a sandbox (`xchdawwajmnnhkncikig`) vía MCP. Verificación estructural: la policy nueva quedó idéntica en forma a `coaches_select_all_on_court`/`_character`/`_voice`; `coaches_all_physical` y `athletes_select_completed_physical` sin cambios.
  - **Verificación activa por rol**: logueado en sandbox como coach `tlaca@toptenis.mx` (password reseteada temporalmente vía SQL para esta verificación, ver nota en T161), la card de Santiago Herrera pasó de mostrar "Baseline físico pendiente" (incorrecto) a no mostrarlo tras el fix — confirmado con screenshots antes/después. Fernanda y Camila (mismo caso) mostraron el mismo comportamiento correcto post-fix.
  - Marco confirmó aplicar a producción (`rrrwhwciggohwxslqlho`) — aplicada y verificada estructuralmente. Registrada en `supabase/PROD_MIGRATIONS_LOG.md`.

---

### T152-repensar-liderazgo-physical-pm — P&M — Catálogo de métricas físicas (baselines/unidades/protocolos) + score -2..+2 de liderazgo
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: done
- created: 2026-07-14
- updated: 2026-07-21
- done: 2026-07-21
- branch: direct-to-main

**Notas:**
- 2026-07-14: Creado en backlog.
- 2026-07-18: Fusionado con T098 (catálogo físico) y T121 (observaciones/objetivos de dimensiones numéricas) — mismo gap: hoy `physical` no tiene mapeo a -2..+2 (bloqueante de objetivos cuantitativos en esa dimensión) y `liderazgo` solo tiene `liderazgo_nota` (texto), sin score propio en `report_character`. Marco confirmó que ya tiene la información necesaria para arrancar la parte de physical.
- 2026-07-21: Promovido de `BACKLOG.md` a `TASKS.md`, categoría pasa de Team a Dev (la parte de definición con Marco ya está resuelta, queda trabajo técnico). Marco compartió el protocolo real de pruebas físicas (`docs/uploads/pruebas_fisicas_top_tennis_1.PNG`, `_2.PNG` — "Protocolo Pruebas Físicas Academia de Tenis RAC"): 7 pruebas — (1) Velocidad 23.77 mts, mejor de 3 intentos; (2) Agilidad 5 Líneas Singles, mejor de 2; (3) Abdominales 30 segundos, repeticiones, 1 intento; (4) Salto Vertical, cm, mejor de 3; (5) Lanzamiento Balón 3kg, distancia, mejor de 3; (6) Flexibilidad en banco, sostener 3 segundos, 1 intento; (7) 1000 mts (1Km), tiempo, 1 intento.
  - Regla de scoring definida por Marco: el baseline de cada prueba **no** viene de una observación del coach, sino de la primera vez que el atleta hace esa prueba (si nunca la ha hecho, se corre por primera vez para fijar baseline). A partir de ahí, cada corrida siguiente se compara contra el baseline (la prueba anterior, inicial, o la última hecha): mejora ≥15% = superado, mejora ≥10% = adelantado, mejora ≥5% = buen camino; empeora ≥5% = entre buen camino y rezagado, empeora >10% = rezagado.
  - Gaps detectados contra el schema actual de `report_physical` que hay que resolver en `scope`/`design`: (a) `sprint_20m` existe pero el protocolo mide 23.77m, no 20m — ¿se renombra/reinterpreta el campo o son pruebas distintas?; (b) no hay campos para abdominales 30s, lanzamiento de balón 3kg, flexibilidad en banco, ni 1000m; (c) `spider_drill_seg` — ¿es la misma prueba que "Agilidad 5 Líneas Singles" del protocolo, o son pruebas distintas?; (d) los campos FMS (`fms_squat`, `fms_lunge_izq/der`, `fms_hombro_izq/der`) no aparecen en este protocolo — ¿se mantienen aparte, se retiran, o se sustituyen?
  - Decisiones de Marco (21 Jul 2026), confirmadas después de verificar que las 5 filas actuales de `report_physical` en producción son datos dummy sembrados antes del setup de sandbox/migración (sin consecuencia real si se pisan — ver T165 en backlog para la limpieza general de esa data dummy): (a) `sprint_20m` se renombra a `velocidad_2377m` para reflejar el protocolo real; (c) `spider_drill_seg` se renombra a `agilidad_5_lineas_seg`; (d) los 5 campos FMS se eliminan con `DROP COLUMN` definitivo (no se preservan como histórico); flexibilidad en banco se registra pasa/no pasa (booleano), no una distancia en cm. Faltan por definir en `design`: nombres/tipos finales de las 4 columnas nuevas (abdominales, lanzamiento de balón, flexibilidad, 1000m) y el mecanismo de cálculo de baseline + score -2..+2 (dónde vive el baseline, cómo se recalcula, dirección de la métrica por prueba — en unas "menos tiempo es mejor", en otras "más distancia/repeticiones es mejor").
- 2026-07-21: Blueprint aprobado por Marco, pasa a `design`. Nota explícita: por ahora **no** se toca `generate-quarterly-plan` (la Edge Function que genera objetivos vía LLM) — exponer `dimension='physical'` como candidata a objetivo cuantitativo ahí queda como trabajo futuro, no parte de este alcance. Ver también T166 (backlog, nuevo) — una vez exista el baseline, debe integrarse a onboarding del atleta y a visibilidad del coach.
- 2026-07-21: `design` cerrado. Grep del repo antes de tocar schema confirmó referencias en `generate-quarterly-plan/index.ts` (no se toca, ver nota arriba), `src/lib/athletics.test.js`, `src/pages/portal/atleta/MiPlan.jsx`, `src/pages/portal/coach/NuevoReporte.jsx`, `src/pages/portal/coach/ReportesPorPeriodo.jsx`, `src/pages/portal/coach/PlanesCoach.jsx` — todas por actualizar en `build`. Gap adicional detectado (no estaba en el blueprint original): `sentadillas_1min`, `lagartijas_1min`, `beep_test_nivel`, `beep_test_rep` tampoco están en el protocolo de 7 pruebas — Marco confirmó el mismo trato que FMS (`DROP COLUMN`, mismos datos dummy).
  - **Migración escrita** (DDL-only, pasa `check-migrations-schema-only.mjs`): `supabase/migrations/20260721205436_physical_protocol_rac_and_liderazgo_score.sql` — renombra `sprint_20m`→`velocidad_2377m` y `spider_drill_seg`→`agilidad_5_lineas_seg`; agrega `abdominales_30s` (smallint), `lanzamiento_balon_mts` (numeric), `flexibilidad_banco_pass` (boolean), `tiempo_1km_seg` (numeric); elimina `sentadillas_1min`, `lagartijas_1min`, `beep_test_nivel`, `beep_test_rep` y los 5 campos FMS; agrega `report_character.liderazgo` (smallint -2..+2, CHECK, análogo a `etica_trabajo`/`coachabilidad` — `liderazgo_nota` se mantiene como narrativa aparte). Todavía no aplicada a sandbox/producción — pendiente de `verify-rls` antes de aplicar.
  - **Decisiones del mecanismo de score físico** (nuevo, no existía — `monthlyScoresForFoco` en `src/lib/athletics.js` hoy excluye `physical` a propósito, ver su JSDoc): baseline = primer registro cronológico no nulo por atleta/campo, sin columna extra "es_baseline". Comparación siempre contra ese baseline fijo (no rolling contra la última corrida). Bandas ya definidas por Marco: mejora ≥15%=superado(+2), ≥10%=adelantado(+1), ≥5%=buen camino(0); empeora ≥5%=entre buen camino y rezagado(-1), empeora >10%=rezagado(-2). Dirección por prueba: `velocidad_2377m`/`agilidad_5_lineas_seg`/`tiempo_1km_seg` → menos es mejor; `abdominales_30s`/`salto_vertical_cm`/`lanzamiento_balon_mts` → más es mejor; `flexibilidad_banco_pass` es especial (pasa=0, no pasa=-2, sin % — confirmado por Marco). Primera prueba del atleta (define baseline) = score 0. `liderazgo` no necesita este mecanismo — es un picker directo del coach como `etica_trabajo`/`coachabilidad`, y `monthlyScoresForFoco` ya lo soporta automático en cuanto exista la columna (esa rama del código es genérica).
  - **Diseño de UI** (`NuevoReporte.jsx`, tab Physical): los 7 campos reales reemplazan a `PHYSICAL_NUM`+`FMS_FIELDS` — 6 inputs numéricos (`velocidad_2377m`, `agilidad_5_lineas_seg`, `abdominales_30s`, `salto_vertical_cm`, `lanzamiento_balon_mts`, `tiempo_1km_seg`) más un toggle único pasa/no pasa para `flexibilidad_banco_pass` (reemplaza la grilla de 5 checkboxes FMS). Tab Character: se agrega "Liderazgo" al picker -2..+2 junto a ética de trabajo/coachabilidad (mismo componente `ScoreRow` ya existente), sin tocar el textarea narrativo de liderazgo. El bloque de preview "Objetivos Q · Physical" (líneas ~352-370) se actualiza a las nuevas keys, aunque no mostrará datos nuevos hasta que `generate-quarterly-plan` se actualice (fuera de este alcance). Labels espejo en `MiPlan.jsx`/`PlanesCoach.jsx`; query + hidratación de estado en `ReportesPorPeriodo.jsx` a actualizar con los nuevos nombres de columna.
  - Pasa a `build`.
- 2026-07-21: `verify-rls` cerrado. Migración aplicada a sandbox (`xchdawwajmnnhkncikig`) y confirmada estructuralmente sin cambio de comportamiento de acceso: las 4 policies de `report_physical`/`report_character` quedaron idénticas byte-a-byte (ninguna referencia los campos tocados por nombre), grants de columna uniformes. Verificación activa por rol no se pudo correr — sandbox sin `auth.users` reales (gap agregado a T165). Marco confirmó aplicar a producción (`rrrwhwciggohwxslqlho`) — aplicada y registrada en `supabase/PROD_MIGRATIONS_LOG.md`. Pasa a `build`.
- 2026-07-21: `build` — implementado:
  - **`src/lib/athletics.js`**: nuevas funciones puras `physicalTestScore(field, baseline, value)` y `physicalScoreSeries(field, rawValues)` (bandas de % con redondeo a 6 decimales para evitar bugs de punto flotante en los límites 5%/10%/15%). `monthlyScoresForFoco` extendida para soportar `dimension: 'physical'` — nota en su JSDoc: el baseline usado es el primer valor dentro del slice de `monthlyReports` que recibe, no necesariamente el baseline histórico completo del atleta (ver T166). `liderazgo` en `character` ya funciona automático (la rama es genérica). 18 tests nuevos en `athletics.test.js`, cubren los bordes exactos de banda (5%/10%/15%, la asimetría `>=`/`>` que pidió Marco), ambas direcciones, sin baseline, null, y el caso booleano. 132/132 tests pasan, lint limpio.
  - **`NuevoReporte.jsx`**: tab Physical con los 7 campos reales (6 numéricos + toggle único pasa/no pasa de flexibilidad, reemplaza la grilla de 5 checkboxes FMS); tab Character con `liderazgo` en el picker -2..+2 junto a ética de trabajo/coachabilidad. Query de precarga, hidratación de estado y `savePhysical` actualizados a los nuevos nombres de columna.
  - **Gap encontrado y corregido durante el build** (no estaba en el blueprint): ya hay **4 objetivos reales en producción** (`quarterly_plan_objectives`, dimension='physical') guardados con `sub_dimension` del esquema viejo (`beep_test` x3, `fuerza_inferior` x1) — porque `generate-quarterly-plan` sigue sin tocar (fuera de alcance). Reemplazar los labels/keys viejos por los nuevos sin más los habría dejado sin label o invisibles. Se resolvió agregando las keys nuevas **sin quitar las viejas** en `MiPlan.jsx`, `PlanesCoach.jsx` y el preview de `NuevoReporte.jsx` — ambos esquemas conviven hasta que `generate-quarterly-plan` se actualice (trabajo futuro, no de este task).
  - **`generate-quarterly-plan/index.ts` NO se tocó**, ni siquiera el label de la línea 30 — es la taxonomía canónica completa (`SUB_DIMENSIONS.physical`, de la que se derivan `ALL_KEYS`/`ALL_DIMS`) que usa el LLM, no una referencia aislada; cambiar una sola entrada la habría dejado a medias. Sigue generando objetivos de `physical` con las 7 keys viejas hasta que se actualice en un task aparte.
  - **`ReportesPorPeriodo.jsx`**: query y contador de tests completados actualizados a los 7 campos reales (antes 6/6, ahora 7/7, incluye flexibilidad en el conteo).
- 2026-07-21: `verify-tests` cerrado. `npm run lint` limpio, `npm test` 132/132 en verde (18 nuevos: bordes de banda 5%/10%/15% con la asimetría `>=`/`>`, ambas direcciones, sin baseline, null, booleano de flexibilidad, más los 2 casos actualizados de `monthlyScoresForFoco` para physical/liderazgo). Nada que agregar. Pasa a `verify-ui`.
- 2026-07-21: `verify-ui` cerrado. Se creó un coach de prueba en sandbox (ver nota en T165 sobre el rate limit de email de Supabase y el workaround por SQL) para hacer un walkthrough real de `NuevoReporte.jsx`. Confirmado en vivo: tab Physical muestra los 7 campos reales con los labels correctos, sin rastro de FMS ni de los campos viejos; tab Character muestra Liderazgo junto a ética de trabajo/coachabilidad. Guardado end-to-end verificado por SQL directo contra `report_physical`/`report_character` — los 7 valores (incluyendo `flexibilidad_banco_pass`) y el score de `liderazgo` persistieron y recargaron correctamente. Cuenta y reporte de prueba limpiados después. **Walkthrough mobile (~375px) no se pudo completar** — la herramienta de browser automation no respondió a `resize_window` (viewport se quedó en 1512px pese a reportar éxito, confirmado con `window.innerWidth` incluso tras recargar la página); no se insistió para evitar un loop. Se verificó en su lugar que el código nuevo reutiliza exactamente los mismos patrones responsive ya presentes en el archivo (`grid-cols-1 sm:grid-cols-2`, `Field` sin ancho fijo, `ScoreRow` con `flex-col sm:flex-row`) — cero clases de layout nuevas, mismo riesgo que el código que reemplazó (ya en producción). Marco: si querés una confirmación visual real en mobile, falta hacerla a mano o con otra herramienta.
- 2026-07-21: `commit` — status pasa a `in review` (no `done`) precisamente por el gap de arriba: la verificación visual en mobile queda pendiente de que Marco la confirme a mano. Todo lo demás (schema en sandbox+producción, RLS, tests, lint, funcional end-to-end) ya está verificado.
- 2026-07-21: Marco confirmó el walkthrough visual en mobile con la cuenta de coach creada en sandbox (`tlaca@toptenis.mx`, sembrada directo por SQL para saltar el rate limit de email de Supabase) — "se ve bien". Status pasa a `done`, se archiva.
