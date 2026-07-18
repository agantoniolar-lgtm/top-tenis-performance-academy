# Tasks archive — Top Tennis Performance Academy

Completed tasks, movidos aquí desde `TASKS.md` para mantenerlo pequeño. Mismo formato de entrada, sin cambios — esto es un registro histórico, no un lugar para editar.

Migrado desde el kanban de Notion el 2026-07-17 (83 tasks Done, de un total de 157 migradas — ver `TASKS.md` para las 74 activas). Orden: por fecha de creación original en Notion, ascendente.

### T002-supabase-schema-auth-rls — Configurar Supabase: schema, auth y RLS
- category: Dev
- type: Infra
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-05-22

**Notas:**
No es solo auth — es el paso de infraestructura completo: crear proyecto Supabase, implementar el schema diseñado, configurar Row Level Security por rol (coach ve sus atletas, atleta ve su expediente, padre solo lectura), y auth. Se hace todo junto en una sola iteración. Depende de: schema de BD diseñado.

### T005-formulario-nuevoreporte — Completar formulario NuevoReporte
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-05-22

**Notas:**
Bloqueado por: 'Diseñar campos del NuevoReporte con coaches' + 'Diseñar schema de BD'. No se puede construir hasta tener los campos definidos y Supabase configurado. Es el flujo de captura core del MVP junto con el PTF.

### T006-campos-ptf-con-coaches — Diseñar campos del PTF con los coaches
- category: Team
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-05-22

**Notas:**
Definir junto con los coaches qué campos tendrá el Post-Torneo Form para maximizar su valor como señal de carácter para recruiters.

### T009-talent-card — Diseñar e implementar Talent Card
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: High
- status: done
- created: 2026-05-22

**Notas:**
MVP implementado. Secciones: 01 perfil reclutamiento (read-only, el atleta llena en registro), 02 rankings+resultados, 03 narrativa del coach (trayectoria global + notas por dimensión + señal de carácter), 04 coach vs atleta (placeholder), 05 especialistas (placeholder). Ruta: /portal/alumnos/:id/talent-card. Diferencia vs Expediente: Talent Card muestra QUÉ concluye el coach (narrativa), Expediente muestra CÓMO evalúa (sub-scores). Pendiente: tabla athlete_recruitment_profile en DB, conexión PTF para sección 04.

### T011-campos-nuevoreporte-con-coaches — Diseñar campos del NuevoReporte con coaches
- category: Team
- type: Chore
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-05-22

**Notas:**
PRE-CÓDIGO. Sesión con coaches para definir exactamente qué evalúan en cada dimensión (On-Court, Physical, Mental, Character, Athlete Voice): qué campos, qué escala, qué anécdota. El resultado es la especificación del formulario. Sin esto no se puede diseñar el schema de BD ni construir NuevoReporte.

### T012-schema-base-de-datos — Diseñar schema de base de datos
- category: Dev
- type: Infra
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-05-22

**Notas:**
PRE-CÓDIGO. Diseñar las tablas, relaciones y políticas de seguridad en papel antes de tocar Supabase. Depende de: campos del NuevoReporte y campos del PTF definidos. Tablas mínimas del MVP: users, athletes, coaches, reports (5 dimensiones), ptf_entries, tournaments.

### T013-formulario-ptf-funcional — Implementar formulario PTF funcional
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-05-22

**Notas:**
El atleta llena su reflexión post-torneo desde el portal. Form React conectado a Supabase. Depende de: campos del PTF definidos con coaches + schema de BD + Supabase configurado. Es uno de los dos flujos de captura core del MVP.

### T014-setup-herramientas-equipo — Set up de herramientas del equipo
- category: Team
- type: Infra
- epic: —
- priority: Medium
- status: done
- created: 2026-05-28

**Notas:**
Phase 0 — Infraestructura de colaboración del equipo (no dev). Stack propuesto: (1) Notion: página de Team separada de Dev Tasks, con kanban de tareas admin/operativas y sección de docs/recursos; (2) Google Drive compartido (cuentas Gmail personales) para archivos pesados: guías de marca, PDFs, templates, brand assets; (3) WhatsApp: definir grupos por tema (operaciones, coaches, etc.) para estructurar la comunicación; (4) Google Calendar compartido para clases, torneos y entrenamientos.

### T018-vision-mvp-alcance-producto — Definir visión, MVP y alcance del producto
- category: Team
- type: Chore
- epic: —
- priority: High
- status: done
- created: 2026-05-29

**Notas:**
Sesión 1 (22 mayo). Se estableció la visión de la plataforma, se redefinió el alcance del MVP a NuevoReporte + PTF + Talent Card, y se reorganizaron las prioridades del kanban. Todo lo que no es MVP pasó a Low/Backlog.

### T019-doc-nuevoreporte-schema — Crear documento nuevoreporte-schema.md
- category: Team
- type: Chore
- epic: —
- priority: High
- status: done
- created: 2026-05-29

**Notas:**
Sesión 2 (29 mayo). Schema del NuevoReporte definido con 6 dimensiones: On-Court, Physical, Mental (pendiente psicóloga), Character & Leadership, Athlete Voice, Nutrición (pendiente nutrióloga).

### T020-estructura-trabajo-claude-md — Configurar estructura de trabajo (CLAUDE.md, kanban Notion, carpetas del repo)
- category: Team
- type: Infra
- epic: —
- priority: High
- status: done
- created: 2026-05-29

**Notas:**
Sesión 1 (22 mayo). Se creó CLAUDE.md con reglas de trabajo, kanban en Notion como fuente de verdad, y estructura de carpetas del repositorio definida.

### T021-guia-definicion-campos-ptf-nr — Crear guía de definición de campos PTF y NuevoReporte para coaches
- category: Team
- type: Chore
- epic: —
- priority: High
- status: done
- created: 2026-05-29

**Notas:**
Sesión 1 (22 mayo). Se generó guia-sesion-campos-nuevoreporte-ptf.md con preguntas estructuradas para que el equipo definiera los campos antes de la siguiente sesión.

### T022-doc-ptf-post-tournament-form — Crear documento ptf-post-tournament-form.md
- category: Team
- type: Chore
- epic: —
- priority: High
- status: done
- created: 2026-05-29

**Notas:**
Sesión 2 (29 mayo). PTF rediseñado de 18 preguntas abiertas a 8 preguntas limpias, todas obligatorias, con metadata estructurada del partido. El modo voz (ElevenLabs) queda para iteración 2.

### T029-portal-expediente-atleta-frontend — Implementar Portal · Expediente del Atleta — frontend React
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-06-03

**Notas:**
Implementar el diseño completo del portal (shell, sidebar, topbar, roster, expediente con 8 tabs) en React + Vite a partir del design handoff de Claude Design. Cerrado en barrido de kanban (13 Jul 2026, confirmado por Marco) — el Expediente ya está en producción y se referencia como funcional en tasks posteriores (ej. Talent Card).

### T030-limpiar-portal-mvp-supabase — Limpiar portal MVP — conectar a Supabase real
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-06-03

**Notas:**
Migró auth a Supabase Auth, instaló @supabase/supabase-js, sembró 1 coach + 5 atletas, limpió sidebar a solo Atletas + Nuevo Reporte, conectó lista de atletas y NuevoReporte (on-court) a Supabase real. Eliminó rutas/features sin conexión (torneos, ejercicios, especialistas, perfil).

### T034-scraper-rankings-amtp — Scraper de rankings AMTP (amtp.mx)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: done
- created: 2026-06-06

**Notas:**
Scraper para https://amtp.mx/ que extraiga los rankings de la Asociación Mexicana de Tenis Profesional. Los datos se usan para mostrar el ranking nacional/regional de cada atleta en su perfil.

### T037-escalas-ptf-posttorneo — Implementar escalas PTF en PostTorneo.jsx
- category: Dev
- type: Feature
- epic: —
- priority: High
- status: done
- created: 2026-06-07

**Notas:**
(sin notas)

### T038-auth-coaches-y-atletas — Auth de coaches y atletas
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-06-08

**Notas:**
Supabase Auth para coaches (ya tiene user_id en coaches table?) y atletas (user_id ya existe en athletes table). Login diferenciado por rol. Protección de rutas. Después de completar el perfil del atleta.

### T040-perfil-del-atleta — Diseñar e implementar perfil del atleta
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-06-08

**Notas:**
Schema en Supabase + UI de creación y edición. Campos actuales en tabla athletes: nombre, apellido, fecha_nacimiento, foto_url, mano_dominante, fecha_ingreso, utr_actual. Faltan: tipo_reves, altura, peso, email, teléfono, contacto emergencia, escuela/grado, y tabla athlete_recruitment_profile (división objetivo, graduación, GPA, inglés, área de estudio).

### T042-reportes-pendientes-por-periodo-dup — Pantalla de reportes pendientes por periodo
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-06-08

**Notas:**
Vista para el coach: tabla de atletas asignados vs. secciones completadas por período (On-court, Physical, Character, Athlete Voice). Flag visible cuando el atleta no ha subido su Athlete Voice. Independiente del auth de atletas. Cerrado en barrido de kanban (13 Jul 2026, confirmado por Marco) — duplicado del task ya Done (37a5a7ea46608195b116c6c01e2d19b6), mismo alcance, ya implementado.

### T046-fix-404-rutas-spa-vercel — Fix 404 en rutas SPA (Vercel rewrite)
- category: Dev
- type: Bug
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-06-09

**Notas:**
Configurar Vercel para que sirva index.html en todas las rutas — fix para BrowserRouter (HTML5 history API). Sin esto, abrir /portal/inicio en nueva tab devuelve 404.

### T047-reportes-pendientes-por-periodo — Pantalla de reportes pendientes por periodo
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-06-09

**Notas:**
Vista para el coach: tabla de atletas asignados vs. secciones completadas por período (On-court, Physical, Character, Athlete Voice). Flag visible cuando el atleta no ha subido su Athlete Voice. Independiente del auth de atletas.

### T048-athlete-voice-autoevaluacion — Implementar Athlete Voice — auto-evaluación del atleta por período
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-06-09

**Notas:**
(sin notas)

### T050-tablas-tournaments-mistorneos — Crear tablas tournaments + athlete_tournaments y conectar MisTorneos / NuevoTorneo
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-06-09

**Notas:**
Migración Supabase: crear tournaments + athlete_tournaments con RLS. Migrar NuevoTorneo.jsx (localStorage→Supabase), MisTorneos.jsx (dummy→Supabase), y actualizar PostTorneo.jsx para linkear por athlete_tournament_id.

### T051-fix-rondas-q1-q2-q3-rls — Fix rondas Q1/Q2/Q3 + label fecha + NuevoTorneoCoach.jsx + RLS coaches
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-06-10

**Notas:**
Rondas Q1/Q2/Q3 agregadas. Label 'Fecha de inicio del torneo'. Constantes compartidas en torneoOpciones.js. NuevoTorneoCoach.jsx con selector de atleta en /portal/torneos/registrar. RLS actualizado: cualquier coach puede INSERT en athlete_tournaments para cualquier atleta + SELECT de todos los atletas.

### T052-guia-qa-checklist-flujos — Guía de QA: checklist de funcionalidades y mapa de flujos end-to-end (atleta + coach)
- category: Team
- type: —
- epic: —
- priority: —
- status: done
- created: 2026-06-11

**Notas:**
Documento para el tour de la plataforma previo a presentación al equipo: funcionalidades por rol, mapa de flujos conectados, tablas de Supabase a verificar, plantilla de bugs/sugerencias.

### T053-b9-athlete-voice-periodo — B9 — Athlete Voice no indica qué periodo está disponible
- category: Dev
- type: Bug
- epic: —
- priority: Medium
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. Cuando el coach llena el NR, el atleta debería ver cuál periodo tiene disponible para llenar su athlete voice; hoy solo registra si llenó uno, sin decir cuál ni si hay otro pendiente.

### T055-f2-alta-de-atletas — F2 — Definir con coaches el alta de atletas
- category: Team
- type: Feature
- epic: —
- priority: Medium
- status: done
- created: 2026-06-12

**Notas:**
Resuelto 9 Jul 2026, en el contexto del scoping de 'Quitar constraint de asignación coach↔atleta': se decidió NO construir alta manual por coach. Autoregistro (Signup.jsx) es y seguirá siendo el único flujo de alta. NuevoAtleta.jsx (que sí llegó a construirse pero nunca se enlazó a ningún botón/link — ruta huérfana /portal/alumnos/nuevo) se borra como parte de ese task. Ver docs/scope-coach-atleta-libre.md §3.1.

### T056-b3-fecha-inicio-atleta — B3 — Fecha de inicio del atleta inconsistente con sus reportes
- category: Dev
- type: Bug
- epic: —
- priority: High
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. Expediente de Marco Damián dice inicio jun 2026 pero hay reportes de abr y may. Fix inmediato: cambiar inicio de Marco a abril. Fix de fondo: validar que no se puedan generar reportes anteriores al mes de registro (si se registró el 20-abr, el primer reporte disponible es abril).

### T057-f5-explicaciones-tactica-fms — F5 — Explicaciones inline en dimensiones de táctica y FMS
- category: Dev
- type: Feature
- epic: —
- priority: Medium
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. Agregar descripción corta de cada dimensión de táctica (ni quien las definió las recuerda) y en el FMS de Nuevo Reporte indicar el threshold de pass/fail.

### T059-b1-wl-record-expediente — B1 — W/L record no se actualiza en expediente ni talent card
- category: Dev
- type: Bug
- epic: —
- priority: High
- status: done
- created: 2026-06-12

**Notas:**
Detectado en QA 11-jun. Fixed: W/L ahora es por partidos — el PTF pregunta cuántos partidos jugó (partidos_jugados en athlete_tournaments); si ganó el último gana todos, si no, pierde solo el último. Subtítulo mantiene 'x torneos con resultado'. Se reemplazará con data de UTR/ITF cuando se integren.

### T060-b8-inicio-atleta-ptf-empty-state — B8 — Inicio de atleta sigue diciendo 'llena tu primer PTF' tras llenarlo
- category: Dev
- type: Bug
- epic: —
- priority: Medium
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. El empty state de /portal/inicio no detecta PTFs existentes.

### T061-f6-numeros-nodos-grafica-coach — F6 — Talent card: números en los nodos de la gráfica del coach
- category: Dev
- type: Feature
- epic: —
- priority: Low
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. La gráfica de scores del coach por periodo no muestra el valor en cada nodo.

### T062-b7-ptf-quitar-ronda-campeon — B7 — PTF: quitar ronda 'Campeón' (duplica 'Final' + victoria)
- category: Dev
- type: Bug
- epic: —
- priority: Medium
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. Final con último partido ganado y Campeón son el mismo estado; permite data duplicada/inconsistente.

### T063-b2-diferencia-periodo-character — B2 — No se ve la diferencia periodo a periodo en ética de trabajo y coachabilidad
- category: Dev
- type: Bug
- epic: —
- priority: Medium
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. Los scores de character no muestran su evolución entre periodos.

### T064-f3-subdimensiones-tactica-tecnica — F3 — Expediente: mostrar sub-dimensiones de táctica separadas de técnica
- category: Dev
- type: Feature
- epic: —
- priority: Medium
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. La táctica solo aparece como parte del box de técnica ('por buen camino'); sus sub-dimensiones deberían tener su propia sección en el expediente.

### T065-b10-box-vacio-utr — B10 — Box vacío de UTR en mi-rendimiento
- category: Dev
- type: Bug
- epic: —
- priority: Medium
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. Aparece un box de UTR de los últimos dos periodos sin datos. Verificar si falta data o si el componente no la lee.

### T067-b4-off-by-one-mes-reportes — B4 — Posible off-by-one de mes al guardar reportes
- category: Dev
- type: Bug
- epic: —
- priority: High
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. A Marco Damián le falta el reporte de junio y el último es de mayo: sospecha de que el periodo se corre un mes hacia atrás al guardar (probable bug de timezone en el input type=month / slice de fecha). Integridad de datos.

### T068-f4-box-tecnica-vacio-expediente — F4 — Box de técnica se ve vacío en el expediente
- category: Dev
- type: Feature
- epic: —
- priority: Low
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. No hay suficientes dimensiones para llenar las cajas de la tabla; ajustar layout o contenido.

### T069-b5-talent-card-percepcion-ptfs — B5 — Talent card: sección percepción compara PTFs en vez de reportes de periodo
- category: Dev
- type: Bug
- epic: —
- priority: High
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. En atletas con 2+ PTFs la sección no muestra datos. Debe comparar reports de periodo (coach vs athlete voice), no post_tournament_forms.

### T070-f1-auth-de-coaches — F1 — Auth de coaches (sign up / log in)
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun. Hoy solo existe signup/login de atletas. Bloquea invitar coaches a producción.

### T071-b11-ptf-no-guardo-resultado — B11 — PTF no guardó ronda/resultado/victoria (Abierto La Hacienda)
- category: Dev
- type: Bug
- epic: —
- priority: High
- status: done
- created: 2026-06-12

**Notas:**
QA 11-jun (2a ronda). El PTF guardó las secciones A–E pero el bloque de resultado quedó null. Fix: ronda/victoria/resultado obligatorios cuando el PTF está ligado a un torneo, manejar el error del update (antes se ignoraba), y reenvío de PTF actualiza en vez de duplicar fila.

### T073-mover-data-demo-sofia-marco — Mover data demo de Sofía a Marco Damián
- category: Dev
- type: Chore
- epic: —
- priority: High
- status: done
- created: 2026-06-12

**Notas:**
Marco tiene la cuenta real registrada; Sofía es dummy. Mover los 5 periodos de reportes, 9 torneos con PTFs y ajustar fecha_ingreso/UTR.

### T076-mobile-first-todo-el-portal — Mobile first en todo el portal
- category: Dev
- type: Feature
- epic: —
- priority: High
- status: done
- created: 2026-06-12

**Notas:**
El portal debe funcionar mobile first: coaches lo usan en cancha y atletas llenan PTF/Athlete Voice desde el teléfono. Auditar todas las vistas (expediente, talent card, nuevo reporte, torneos, PTF) en viewport móvil y ajustar layouts.

### T080-design-polish-p1-seguimiento — F7 · Design polish P1 — Seguimiento: strip de pendientes, jerarquía visual, chip ACTUAL, sidebar limpio
- category: Dev
- type: Feature
- epic: —
- priority: High
- status: done
- created: 2026-06-22

**Notas:**
(sin notas)

### T087-coach-summary-view — Coach Summary View — vista de todos los atletas
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: done
- created: 2026-06-23

**Notas:**
Editable: solo los atletas asignados al coach. Viewable: todos los atletas de la academia. Discutir diseño detallado después del CDS.

### T088-cds-bloque2-auth-content — CDS — Bloque 2: Auth rol Content + /registro-content
- category: Dev
- type: Feature
- epic: Phase 3 — Academy Tools
- priority: High
- status: done
- created: 2026-06-23

**Notas:**
useAuth check content_managers → rol Content. Página /registro-content con código de acceso. Sidebar entry para Content.

### T089-cds-bloque1-db-storage — CDS — Bloque 1: DB + Storage migration
- category: Dev
- type: Feature
- epic: Phase 3 — Academy Tools
- priority: High
- status: done
- created: 2026-06-23

**Notas:**
Tablas: content_managers, content_blocks, media_assets. Bucket: public-media. RLS policies.

### T090-cds-bloque3-panel-contenido — CDS — Bloque 3: Panel de contenido
- category: Dev
- type: Feature
- epic: Phase 3 — Academy Tools
- priority: High
- status: done
- created: 2026-06-23

**Notas:**
3 tabs: Videos (pegar URL YT), Imágenes (upload a Storage), Texto (editor inline). Ruta /portal/contenido.

### T092-cds-bloque5-mosaico-fotos-perfil — CDS — Bloque 5: Mosaico de fotos de perfil (atletas y coaches)
- category: Dev
- type: Feature
- epic: Phase 3 — Academy Tools
- priority: High
- status: done
- created: 2026-06-23

**Notas:**
Migration: foto_url a coaches. Tab 'Perfiles' en CDS: grid de atletas y coaches, click para subir/reemplazar foto. Dimensiones: 600×800 px.

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
