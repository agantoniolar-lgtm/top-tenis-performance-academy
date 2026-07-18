# Tasks archive — Top Tennis Performance Academy

Completed tasks, moved here the moment a task reaches `done` (by the `commit` skill, not at session close). Always check this file first when looking for a recently completed task. Once it reaches 50 entries, it splits into a dated file (see `TASKS_ARCHIVE_INDEX.md`).

**2026-07-18:** starts with the 33 most recently created of the original 83 migrated `done` tasks (the other 50, created 2026-05-22 through 2026-06-23, were split immediately into `TASKS_ARCHIVE_2026-05-22_2026-06-23.md` — see the caveat there about creation- vs. completion-date). Going forward, new completions get a real `done:` date.

## Index (quick scan)

| id | title | category | created |
|---|---|---|---|
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
