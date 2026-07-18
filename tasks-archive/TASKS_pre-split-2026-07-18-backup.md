# Tasks — Top Tennis Performance Academy

Active tasks only. Completed tasks move to `TASKS_ARCHIVE.md`. One entry por task, en el formato de abajo. Status values: `backlog`, `in progress`, `in review`, `done`.

Migrado desde el kanban de Notion el 2026-07-17 (157 tasks totales migradas: 74 activas aquí, 83 done en `TASKS_ARCHIVE.md`). El id de cada task (`T###`) es consecutivo en orden de creación original en Notion; el kanban de Notion deja de ser la fuente de verdad a partir de esta migración.

<!--
### {{task-id}} — {{short title}}
- category: {{feature | fix | doc | decision | research | bug-bash | review}}
- status: {{backlog | in progress | in review | done}}
- created: {{YYYY-MM-DD}}
- updated: {{YYYY-MM-DD}}
- branch: {{ai/{{task-id}}-{{slug}} or none yet}}

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

## In Review

### T156-pm-v2-separar-outcome-carryover — P&M v2 — separar outcome en estado (logrado/parcial/fallido) + carryover (continúa/depriorizado)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: High
- status: in review
- created: 2026-07-15

**Notas:**
CONSTRUIDO 15 Jul 2026, todo comiteado (29f0f07 + aad9365). Migracion outcome/carryover + UI de 2 controles + fix de carryover (29f0f07). Fix de 4 bugs de la revision en vivo con Marco Damian: placeholder de 'Logrado' corregido, bloque de scores/anclas con fallback explicito cuando no hay datos, formatObjetivoMotivo robusto a separador (aad9365). Lint+112 tests OK en ambos commits. Detalle en docs/scope-close-quarterly-plan.md §16.3/§16.3.1. PENDIENTE: Marco hace git push, y probar en vivo con Test Athlete (que si tiene reportes) para confirmar highlight/badges con datos reales antes de Done.

## Backlog

### T001-portal-de-sponsors — Diseñar e implementar Portal de Sponsors
- category: Dev
- type: Feature
- epic: Phase 3 — Academy Tools
- priority: Medium
- status: backlog
- created: 2026-05-22

**Notas:**
Dar a sponsors visibilidad del impacto de su apoyo. Puede ser dashboard de solo lectura o reportes PDF automáticos. Prioridad media — construir una vez que haya datos reales en el sistema.

### T003-estrategia-hosting-deploy — Definir estrategia de hosting y deploy
- category: Dev
- type: Infra
- epic: Phase 1 — Core Features
- priority: High
- status: backlog
- created: 2026-05-22

**Notas:**
Evaluar opciones para producción con React + Vite. Considerar Vercel, Netlify u otras. Definir junto con decisión de backend.

### T004-expediente-atleta-backend-real — Conectar Expediente del atleta a backend real
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: backlog
- created: 2026-05-22

**Notas:**
Actualmente funciona con datos dummy. Requiere backend definido. Incluye capas de especialistas y fitness tests.

### T007-subida-video-ejercicios — Implementar flujo de subida de video en Ejercicios
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: Low
- status: backlog
- created: 2026-05-22

**Notas:**
Post-MVP. No bloquea el piloto. La subida de video es infraestructura compleja (storage, transcoding) que no aporta valor hasta que los flujos de captura de reportes y PTF estén funcionando con datos reales.

### T008-validar-diseno-mobile — Validar diseño en mobile
- category: Dev
- type: Chore
- epic: Phase 1 — Core Features
- priority: High
- status: backlog
- created: 2026-05-22

**Notas:**
TOP PRIORITY — hacer el portal mobile-friendly antes de continuar con otros features. Si hay que parar todo para resolverlo, se hace en la siguiente sesión. (Antes era Post-MVP; promovido a top priority el 2026-06-07.)

### T010-reportes-especialistas — Diseñar e implementar épica de Reportes de Especialistas
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Low
- status: backlog
- created: 2026-05-22

**Notas:**
Post-MVP. Estratégicamente valioso pero no necesario para validar el piloto con coaches y atletas. Construir una vez que los flujos de reporte del coach y PTF tengan datos reales y el sistema esté probado.

### T015-ptf-voice-interview — PTF Voice Interview — Entrevista conversacional de voz post-partido
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: Low
- status: backlog
- created: 2026-05-29

**Notas:**
Iteración 2 del PTF. Integrar ElevenLabs Conversational AI como modo alternativo de llenado del formulario. El agente conduce la entrevista por voz cubriendo los 8 campos del PTF, transcribe las respuestas y las estructura automáticamente via LLM. Incluye análisis de tono emocional como dato adicional. El schema de BD no cambia. Bloqueado por: PTF modo escritura (iteración 1).

### T016-investigar-api-utr — Investigar API de UTR — acceso, crawler, o update manual
- category: Team
- type: Chore
- epic: Phase 1 — Core Features
- priority: Low
- status: backlog
- created: 2026-05-29

**Notas:**
Opciones en orden de preferencia: (1) API oficial de UTR — contactar para acceso. (2) Crawler si no hay API. (3) Update manual por el coach desde la app de UTR (mensual, no es crítico). El UTR se captura una vez al mes por atleta en el NuevoReporte.

### T017-evaluar-swing-vision — Evaluar integración Swing Vision — On-Court & On-Tournament
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: Low
- status: backlog
- created: 2026-05-29

**Notas:**
STAND-BY — Confirmado por PTF/NR (Jun 2026). SwingVision sí mide potencia de golpes; esa métrica se integrará en el task de Pruebas Físicas. La evaluación táctica algorítmica queda en pausa hasta definir el roadmap de Phase 2. Revisar cuando NuevoReporte modo escritura esté en producción.

### T023-analytics-uso-plataforma — Diseñar analytics de uso de plataforma y página web
- category: Team
- type: Feature
- epic: —
- priority: Low
- status: backlog
- created: 2026-05-29

**Notas:**
Definir qué métricas de uso se van a trackear (engagement por módulo, frecuencia de llenado de PTF/NuevoReporte, atletas activos, etc.) y qué herramienta se usa. Los reportes quincenales de la plataforma van a depender de esto.

### T024-estrategia-planes-entrenamiento — Definir estrategia de planes de entrenamiento (builder en app vs workflow externo)
- category: Team
- type: Feature
- epic: —
- priority: Low
- status: backlog
- created: 2026-05-29

**Notas:**
Por ahora existe una carpeta en Drive para planes de entrenamiento, pero la estrategia de cómo se crean y asignan por atleta no está definida. Opciones: (1) builder dentro de la app, (2) workflow externo que genere planes a escala. Decidir antes de implementar. Post-MVP.

### T025-registro-de-asistencia — Diseñar e implementar registro de asistencia
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: backlog
- created: 2026-06-02

**Notas:**
Nueva feature. Objetivo: registrar días efectivos de entrenamiento por atleta para cruzar rendimiento vs. asistencia real. Pregunta de diseño abierta: ¿debería vivir en un view exclusivo de coaches donde dan click a los atletas que llegaron cada día, o integrarse en el flujo de sesión existente? Definir UX antes de construir.

### T026-protocolo-pruebas-fisicas — Definir protocolo de pruebas físicas — schema, cadencia y métricas SV
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-02

**Notas:**
Tlaca confirmó que las pruebas core están bien (Jun 2026). Cadencia: cada 3 meses. Apoyo de fisios para algunas pruebas.

Pruebas core (7 en total):
1. Sprint 20m — Velocidad / Aceleración
2. Beep test — Resistencia aeróbica
3. Salto vertical (CMJ) — Potencia de piernas
4. Spider drill — Agilidad en cancha
5. FMS simplificado — Movilidad / control postural
6. Sentadillas en 1 minuto — Fuerza de tren inferior
7. Lagartijas en 1 minuto — Fuerza de tren superior

SwingVision mide potencia de golpes — integrar como métrica en el schema de BD: promedio por partido y promedio por sesión de entrenamiento. Esto alimenta la sección Physical del NuevoReporte en Supabase.

### T027-checklist-torneos-entrenamientos — Definir checklist de torneos y entrenamientos — frecuencia y owner
- category: Team
- type: Chore
- epic: Phase 1 — Core Features
- priority: Medium
- status: backlog
- created: 2026-06-02

**Notas:**
PTF/NR aprobaron el checklist. Pendiente: definir cuándo se aplica (antes de torneo, después de cada sesión, semanal), quién lo llena (coach, atleta, ambos) y si vive dentro del NuevoReporte o es un flujo separado.

### T028-evaluacion-conducta-liderazgo — Definir evaluación de conducta y liderazgo — frecuencia y campos
- category: Team
- type: Feature
- epic: Phase 1 — Core Features
- priority: Medium
- status: backlog
- created: 2026-06-02

**Notas:**
PTF/NR aprobaron la sección de conducta y liderazgo. Pendiente: definir si la evaluación es mensual o trimestral. Una vez decidida la frecuencia, mapear campos al schema del NuevoReporte.

### T031-api-utr-resultados-partidos — Integración de API de UTR para resultados de partidos
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-06

**Notas:**
Conectar API de UTR Sports para jalar resultados de partidos por atleta. Depende de aprobación del formulario de developer. Los resultados se mostrarán en el perfil del atleta.

### T032-solicitud-acceso-api-utr — Solicitud de acceso a API de UTR Sports
- category: Team
- type: Chore
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-06

**Notas:**
Llenar el formulario de aplicación de developer en https://www.utrsports.net/pages/api-developer-application. Necesitamos acceso para obtener resultados de partidos de los atletas.

### T033-publicacion-plan-trimestral-notif — [Post-MVP] Publicación del plan trimestral y notificaciones a atleta y papás
- category: Dev
- type: Feature
- epic: Phase 3 — Academy Tools
- priority: Low
- status: backlog
- created: 2026-06-06

**Notas:**
Post-MVP. Una vez que el coach aprueba el plan, publicarlo en el portal del atleta y enviar notificación (push/email) al atleta y sus papás.

### T035-estructura-campos-plan-trimestral — [Post-MVP] Definir estructura y campos del plan trimestral
- category: Team
- type: Feature
- epic: Phase 3 — Academy Tools
- priority: Low
- status: backlog
- created: 2026-06-06

**Notas:**
Post-MVP. Definir qué campos componen un plan trimestral: objetivos por dimensión, métricas target, carga semanal, etc. Input para diseñar el flujo de ingestion con AI.

### T036-flujo-ingestion-plan-trimestral-ai — [Post-MVP] Flujo de ingestion del plan trimestral para coaches con AI
- category: Dev
- type: Feature
- epic: Phase 3 — Academy Tools
- priority: Low
- status: backlog
- created: 2026-06-06

**Notas:**
Post-MVP. UI + backend para que el coach ingrese los parámetros del período, la IA genere el plan trimestral por atleta, y el coach lo revise y edite antes de publicarlo.

### T039-admin-dashboard-engagement — [Post-MVP] Admin dashboard — métricas de engagement
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-08

**Notas:**
Métricas de uso de la plataforma: qué se llena, qué no, qué tarda en llenarse, qué se usa más/menos. Trabajar después de que el MVP esté definido y antes de abrir prod a usuarios reales.

### T041-error-logs-dashboard — [Post-MVP] Error logs y dashboard de errores
- category: Dev
- type: Infra
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-08

**Notas:**
Registrar cada interacción relevante en Supabase. Dashboard para monitorear errores que afectan la experiencia. Trabajar antes de abrir prod a usuarios reales.

### T043-2fa-notificaciones-whatsapp — Investigar y definir 2FA + notificaciones por WhatsApp
- category: Team
- type: Feature
- epic: Phase 1 — Core Features
- priority: Medium
- status: backlog
- created: 2026-06-08

**Notas:**
Dos objetivos ligados: (1) 2FA en el login — evaluar si se hace por email (Supabase lo soporta nativo) o por WhatsApp/SMS (requiere API externa). (2) Notificaciones a atletas por WhatsApp — ej: 'tu coach subió un nuevo reporte', 'tienes un PTF pendiente'.

APIs a investigar:
- WhatsApp Business API (Meta oficial) — requiere cuenta de business verificada, buena para volúmenes altos
- Twilio — soporta WA + SMS + 2FA en un solo SDK, fácil de integrar con Supabase Edge Functions
- MessageBird / Bird.com — alternativa a Twilio con precios más flexibles en LatAm
- Respond.io / Wati — más orientados a CRM sobre WA, no tanto para notificaciones programmáticas

Preguntas clave a responder:
- ¿Qué tipos de mensajes permite WA Business sin ser bloqueado? (solo plantillas aprobadas para outbound)
- ¿La academia tiene número de WA Business ya registrado?
- ¿Qué volumen de mensajes se espera? (determina si Twilio vs Meta directo)
- ¿El 2FA es bloqueante o solo recomendado?

Decisión esperada: servicio elegido + estimado de costo por mensaje + plan de integración con Supabase Edge Functions. Trabajar antes de abrir el registro a usuarios reales.

### T044-progreso-escolar-transcripts — [Post-MVP] Conectar progreso escolar con transcripts por ciclo
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: Low
- status: backlog
- created: 2026-06-08

**Notas:**
El campo escuela/grado se actualiza manualmente cada verano. Post-MVP: conectar con transcripts reales por ciclo escolar para validar que el atleta efectivamente avanzó. Si un atleta reprueba un ciclo, actualizarlo sin evidencia no tiene sentido. Requiere definir: qué documento se sube, quién lo sube (atleta/padre), con qué frecuencia, y cómo afecta el perfil de reclutamiento si hay un ciclo sin progreso.

### T045-recordatorio-grado-escolar — [Post-MVP] Recordatorio automático de actualizar grado escolar en agosto
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Low
- status: backlog
- created: 2026-06-08

**Notas:**
Cada agosto, enviar notificación al atleta/padre para que actualicen el grado escolar manualmente. NO hacer update automático: si el atleta reprueba un ciclo, el sistema lo subiría de grado igualmente. El update lo debe confirmar una persona. Requiere: canal de notificación definido (email o WhatsApp, ver task de 2FA/WA) + scheduled task via Supabase Edge Function + pg_cron.

### T049-auditar-capa-display-escalas — Auditar y blindar la capa de display de escalas (-2/+2 vs 1-5)
- category: Dev
- type: —
- epic: —
- priority: —
- status: backlog
- created: 2026-06-09

**Notas:**
(sin notas)

### T054-f8-registro-dobles-post-mvp — F8 — Registro y monitoreo de dobles (post-MVP)
- category: Team
- type: Feature
- epic: —
- priority: Low
- status: backlog
- created: 2026-06-12

**Notas:**
QA 11-jun. Si el atleta juega singles y dobles en un torneo, se necesita otro campo de llenado para dobles. Definir post-MVP cómo registrar y monitorear dobles.

### T058-b6-autocomplete-google-login — B6 — Autocomplete de Google se borra en el login
- category: Dev
- type: Bug
- epic: —
- priority: Low
- status: backlog
- created: 2026-06-12

**Notas:**
QA 11-jun. Al usar autofill de usuario/contraseña se borra la primera vez y hay que hacerlo dos veces.

### T066-f7-vista-ptfs-por-torneo — F7 — Vista de PTFs por torneo para el coach
- category: Dev
- type: Feature
- epic: —
- priority: High
- status: backlog
- created: 2026-06-12

**Notas:**
QA 11-jun. El portal de torneos no deja al coach revisar los PTFs. Crear view tipo tabla con cada atleta del torneo según las métricas del PTF + poder abrir y leer cada PTF completo. Post-MVP: AI summary por torneo (serán muchos atletas).

### T072-f9-grafica-trayectoria-ancho — F9 — Gráfica de trayectoria global a todo el ancho en Talent Card
- category: Dev
- type: Feature
- epic: —
- priority: Medium
- status: backlog
- created: 2026-06-12

**Notas:**
QA 11-jun. La gráfica de trayectoria global ocupa ~45% del espacio del bloque; debe crecer para ocupar todo el ancho disponible.

### T074-revisar-claude-design-atleta-coach — Revisar Claude Design para atleta y coach
- category: Team
- type: Chore
- epic: —
- priority: Medium
- status: backlog
- created: 2026-06-12

**Notas:**
Revisar las propuestas de Claude Design para las vistas de atleta y coach.

### T075-planes-trimestrales-views-atleta-coach — Planes trimestrales + views de atleta y coach
- category: Dev
- type: Feature
- epic: —
- priority: High
- status: backlog
- created: 2026-06-12

**Notas:**
Incluir en el MVP: planes trimestrales por atleta y sus views correspondientes para atleta y coach. Definir alcance (qué contiene el plan, quién lo crea/edita, cómo se da seguimiento).

### T077-landing-page — Landing page
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: backlog
- created: 2026-06-20

**Notas:**
Landing pública necesaria antes del lanzamiento con usuarios reales (coaches y atletas). Pendiente definir contenido y diseño. Prerequisito: bugs resueltos, mobile first, auth de coaches completo, pruebas finales.

### T078-swingvision-revisar-output — SwingVision: revisar output, exportable y data disponible para tracking de atletas
- category: Team
- type: Feature
- epic: —
- priority: Low
- status: backlog
- created: 2026-06-20

**Notas:**
Marco tiene prueba de un mes activa. Revisar juntos: qué exporta SwingVision, en qué formato, y qué métricas son útiles para tracking de performance de atletas. Definir cómo integrarlo a la plataforma. BLOQUEADO HASTA: bugs In Review resueltos + mobile first + auth real + pruebas finales de lanzamiento + landing.

### T079-ptf-tecnica-a-golpes-bajo-presion — PTF: cambiar campo 'técnica' → 'golpes bajo presión'
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: High
- status: backlog
- created: 2026-06-20

**Notas:**
La técnica no es útil como dimensión de evaluación en el PTF. Reemplazar por 'golpes bajo presión' — misma lógica de comparación y display, solo se cambia el label. Hacer antes del lanzamiento con atletas reales para que los datos capturados tengan el nombre correcto desde el inicio.

### T081-mfa-email-confirmation-coaches — Revisar MFA / email confirmation para atletas y coaches
- category: Dev
- type: Feature
- epic: Phase 1 — Core Features
- priority: Low
- status: backlog
- created: 2026-06-22

**Notas:**
El flow de signup de atletas asume session inmediata (email confirmation deshabilitado). Si se habilita email confirmation, el INSERT del atleta falla porque está después del check de sesión. Fix: guardar datos del atleta en user_metadata durante signUp y hacer el INSERT via onAuthStateChange cuando el usuario confirma. También evaluar Supabase MFA (TOTP) para coaches.

### T082-landing-quotes-testimonials — Landing — pedir quotes reales de atletas y papás para testimonials
- category: Team
- type: Chore
- epic: —
- priority: Medium
- status: backlog
- created: 2026-06-23

**Notas:**
La sección de testimoniales actualmente tiene una cita anónima sin foto. Para que convierta necesita al menos 2-3 testimoniales con nombre, foto y contexto (qué nivel tiene el alumno, cuánto lleva en la academia). Coordinar con Marco quién puede dar el quote.

### T083-landing-seccion-camino-a-usa — Landing — definir sección Camino a USA con el equipo
- category: Team
- type: Feature
- epic: —
- priority: Medium
- status: backlog
- created: 2026-06-23

**Notas:**
La sección Camino a USA de la landing necesita ser discutida con el equipo antes de redactarla en detalle. Por ahora aparece como aspiracional (card o bloque ligero). Requiere: qué promesas se hacen, qué proceso se describe, quién es responsable de qué.

### T084-landing-acceso-recruiters — Landing — acceso diferenciado para recruiters universitarios
- category: Dev
- type: Feature
- epic: —
- priority: Low
- status: backlog
- created: 2026-06-23

**Notas:**
Ya existe TalentCard.jsx en el portal. La landing podría tener un botón 'Ver atletas disponibles' que lleve a un área pública o con login separado para recruiters NCAA/NAIA. No está listo para la camada actual — dejar en backlog.

### T085-landing-video-hero-cms — Landing — video hero (Content Management System)
- category: Dev
- type: Feature
- epic: —
- priority: Medium
- status: backlog
- created: 2026-06-23

**Notas:**
El hero de la landing tiene un VideoPlaceholder. Necesita un admin panel (CMS) en el portal para que la persona de diseño/marketing pueda subir y actualizar el video sin tocar código. Supabase Storage + UI en portal.

### T091-cds-bloque4-paginas-publicas-db — CDS — Bloque 4: Páginas públicas consumen DB
- category: Dev
- type: Feature
- epic: Phase 3 — Academy Tools
- priority: Medium
- status: backlog
- created: 2026-06-23

**Notas:**
Home, CaminoUSA, Nosotros, Programas leen content_blocks y media_assets. Fallback a valores hardcodeados.

### T095-amtp-widget-ranking-perfil — AMTP — Widget de ranking en perfil del atleta
- category: Dev
- type: Feature
- epic: —
- priority: Medium
- status: backlog
- created: 2026-06-24

**Notas:**
Mostrar posición AMTP del atleta en su perfil. Solo es un número (ej. '#12 Varonil AMTP'). Prerequisito: similarity search implementado para matchear nombres entre la plataforma y AMTP (ej. 'Marco Damián' → 'Marco A. Damián Aguilar'). Ver open item de sesión 2026-06-23.

### T098-pm-v2-catalogo-metricas-fisicas — P&M v2 — Catálogo de métricas físicas, unidades, protocolos de test + baselines
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: Low
- status: backlog
- created: 2026-06-26

**Notas:**
OPEN ITEM / bloqueante de Physical. No existe hoy. Definir métricas (ej. sprint 20m), unidades, protocolos de test y de dónde salen los baselines. El resto de v2 (técnica/táctica/carácter) NO depende de esto. Ref §13 open items.

### T099-pm-v2-validate-quarterly-plan-v2 — P&M v2 — validate-quarterly-plan v2 + captura de logs (semilla eval set)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-26

**Notas:**
Validador ADVISORY (como warnings amarillos), NO auto-regenera. Rubrica de anclas: monotonia, mutuamente excluyentes, observable, semantica de escala (0=por buen camino vs plan, +2=superado, -2=estancado, NO 'estado actual'), gramatica §4. CRITERIO NUEVO: horizonte trimestral -> cada objetivo medible en 3 meses, NO resultado de largo plazo (ranking/Top 100 ITF quedan fuera salvo alcanzables en el periodo, ej. top120->100). El coach escribe observaciones, no planes; estructurar el horizonte es trabajo del sistema. TABLA objective_generation_log con linaje (root_id/parent_id, etc). Ref §13.

### T100-pm-v2-medicion-mensual-subdimension — P&M v2 — Medición mensual -2..+2 por sub-dimensión (focos + mantenimiento)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-26

**Notas:**
Captura del valor direccional -2..+2 en report_on_court/physical/character por sub-dimensión. Mantenimiento también se mide: -1/-2 en mantenimiento = candidata a foco del siguiente trimestre. Aplicar ventana del calendario de evals. Ref §6, §13.

### T101-pm-v2-calendario-evaluaciones — P&M v2 — Calendario de evaluaciones mensuales + recordatorio de cierre
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-26

**Notas:**
Definir ventanas operativas: evaluación mensual permitida hasta ~1 semana después del cierre de mes; cierre de periodo al final de la semana posterior al trimestre. Input para el recordatorio y la lógica de medición. Ref §13.

### T103-pm-v2-rubrica-calidad-anclas — P&M v2 — Rúbrica de calidad de anclas + set de estándares de cierre
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-26

**Notas:**
Documentar para coaches y para el validador: la rúbrica de anclas (monotonía/excluyentes/observable/anclado/gramática) y el set de estándares de cierre — 'de forma consistente', 'bajo presión', 'sin recordatorio'. Cuándo aplica cada estándar. Ref §4, §13.

Actualización (live test 5, Caso Sofía, 1 Jul 2026): confirmado en el Caso 3 — las anclas generadas se sienten genéricas en su redacción actual. Ref §18.

Actualización (live test 6, Caso Diego, 1 Jul 2026): se repite en Caso 4. Marco: 'hay que definir muy bien cómo nombrarlas'. Ref §19.

### T108-pm-v2-voz-revision-regeneracion — P&M v2 — Voz: revisión/regeneración por voz + summary de notas en el dump
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-27

**Notas:**
EPIC VOZ (3/3). Comentarios de regeneracion dictados por voz -> texto. El dump puede incorporar el summary de las notas de voz (task 2/3) para 'endulzar' el contenido y generar mejores focos. Ref §14.

### T109-pm-v2-edicion-plan-mitad-trimestre — P&M v2 — Edición de plan a mitad de trimestre
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Low
- status: backlog
- created: 2026-06-27

**Notas:**
BACKLOG. Permitir ajustar el plan dentro del periodo si hace falta. No vale la pena complicarlo ahora. Ref §14.

### T110-pm-v2-voz-dump-observaciones — P&M v2 — Voz: dump de observaciones por voz (transcripción)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-27

**Notas:**
EPIC VOZ (1/3). El input del plan (observaciones antes de identify) se puede dictar por voz y se transcribe a texto. Ref §14.

### T111-pm-v2-voz-log-anotaciones-atleta — P&M v2 — Voz: log de anotaciones por atleta (grabaciones + transcripts)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-06-27

**Notas:**
EPIC VOZ (2/3). Coaches graban notas de entrenamiento/partido en cualquier momento (ej. mitad del 2o set), ligadas al atleta del lado del coach. Transcripts procesados y acumulados como record de observaciones por atleta; insumo para seguimiento y generacion de planes. Ref §14.

### T116-conectar-cms-con-sitio-publico — Conectar el CMS (Content Delivery System) con el sitio público
- category: Dev
- type: Bug
- epic: —
- priority: High
- status: backlog
- created: 2026-06-30

**Notas:**
El panel de contenido escribe en content_blocks/media_assets/athlete_media pero ninguna página pública lee esas tablas: todo el contenido del sitio está hardcodeado. Además los slots del CMS no coinciden con la estructura real de las páginas (p.ej. video en camino-usa, hero_imagen en home no tienen destino) y ya hay 3 fotos de coaches subidas que no se muestran. Crear capa de lectura (usePublicContent) y cablear Home/Nosotros/Programas/CaminoUSA + perfiles/highlights, con RLS para lectura anónima. Movido a Backlog (13 Jul 2026, Marco) — en espera de junta con el equipo de marketing el 20 Jul 2026 antes de retomar. Nota: el git log ya muestra commits relevantes conectando CMS con landing/coaches (402585b, eed1e7d, 1dd1a21) — confirmar con Marco el alcance real pendiente vs. lo ya resuelto al retomar.

### T118-scopear-sincronizacion-cms-landing — Scopear sincronización CMS ↔ landing (registro único de slots editables)
- category: Dev
- type: Feature
- epic: —
- priority: High
- status: backlog
- created: 2026-06-30

**Notas:**
DECISIÓN (Marco): el CMS se queda en modelo de slots ESTÁTICOS con deploys ad hoc — meter/quitar slots o páginas = cambio de código + deploy (lo hacemos Marco + Claude), NO page-builder dinámico. El scoping del registro único de slots lo vemos juntos después.

Problema raíz: los slots editables se definen en DOS lugares (constantes del panel PanelContenido + llamadas text()/asset() en cada página), que pueden desincronizarse (ya pasó: slots sin destino y labels equivocados). Objetivo del scoping: (a) registro único de slots (src/lib/contentSlots.js) como fuente de verdad que importen tanto el panel como las páginas; el panel genera sus tabs desde ahí. (b) Auditar TODA la landing y registrar cada pieza editable (textos/imágenes/videos hoy hardcodeados) para que exista en el CMS. (c) Flujo: la ESTRUCTURA la edita Marco con Claude (código+deploy); el CONTENIDO ya en prod debe existir en el CMS.

### T121-pm-observaciones-dimensiones-physical — P&M — Definir observaciones/objetivos de dimensiones numéricas (physical) + doc de scoping
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-07-01

**Notas:**
Reconfirmado en live test 3: physical (beep_test, spider_drill, sprint_20m, salto_vertical, fuerza_inferior, fuerza_superior, fms) no tiene catálogo de baselines/targets/unidades, así que sus objetivos quedan cualitativos mientras técnica/táctica/carácter ya son medibles. Ya estaba señalado como fuera de alcance en §11 del scope doc; este task es para scopearlo formalmente con su propio doc antes de construir. Ref docs/scope-planning-measurement.md §16.

### T126-fix-diagnostico-no-abrir-la-atleta — Fix: diagnóstico/objetivo no debe abrir con "la atleta/el atleta"
- category: Dev
- type: Bug
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-07-02

**Notas:**
Encontrado en live test 5 (Caso Sofía, 1 Jul 2026): el diagnóstico generado abre con "la atleta presenta..." en vez de ir directo a la conducta observada ("presenta una fuerza inferior que podría ser más completa..."). Ajustar GENERATE_SYSTEM (regla de tono, junto al fix de nombre del atleta) para prohibir abrir con el sustantivo del atleta. Ref docs/scope-planning-measurement.md §18.

### T127-feature-acciones-post-objetivo — Feature (backlog, sin scope): "Acciones" — pasos concretos post-objetivo
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: Low
- status: backlog
- created: 2026-07-02

**Notas:**
Idea de Marco (1 Jul 2026): después de confirmar objetivo + anclas de un foco, generar "acciones" — qué debe hacer el atleta concretamente para cumplir el objetivo. Sin scope todavía, prioridad baja. Ref docs/scope-planning-measurement.md §18.

Actualización (live test 6, Caso Diego, 1 Jul 2026): evidencia de por qué hace falta — el objetivo generado para fuerza de piernas ('Desarrollar la fuerza en las piernas mediante ejercicios específicos de resistencia y potencia') se lee más como una acción que como el objetivo medible en sí. El redesign necesita distinguir con claridad objetivo (qué se mide, -2..+2) vs. acciones (cómo se llega ahí). Ref §19.

### T130-pm-consistencia-determinismo-identify — P&M — Evaluar consistencia (determinismo) de identify entre corridas repetidas
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-07-02

**Notas:**
Encontrado en live test 5 (Caso Sofía, 1 Jul 2026): corriendo identify varias veces sobre el mismo dump, el número de focos varió (3→2) y coachabilidad reapareció de forma inconsistente entre corridas. Con temperature 0.3 hay variación esperada, pero conviene medir consistencia como parte del framework de evals (Tier B, docs/skills-backlog.md #1) antes de exponer a coaches. Ref §18.

### T131-bug-focos-no-persisten-al-volver — Bug: focos identificados no persisten al volver (Caso 3)
- category: Dev
- type: Bug
- epic: Phase 2 — Analytics
- priority: High
- status: backlog
- created: 2026-07-02

**Notas:**
Encontrado en live test 5 (Caso Sofía, 1 Jul 2026): en el UI los focos identificados parecieron regenerarse en vez de reusar el cache, pese al fix de re-identificación del mismo día (pm-v2.4, §16). Necesita repro: confirmar si el texto del dump cambió entre pasos, o si el cache (lastIdentifiedObs) se invalida de más al recargar o retomar un draft. Ref §18.

### T133-feature-mostrar-cambios-regenerar — Feature: mostrar qué cambió al regenerar objetivos con feedback del coach
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-07-02

**Notas:**
Encontrado en live test 6 (Caso Diego, 1 Jul 2026): al mandar 'Regenerar con mi comentario', si el coach se distrae mientras corre la llamada, pierde de vista qué cambio pidió y no hay forma de comparar qué se ajustó. No hace falta mostrar el texto anterior verbatim, pero sí debe quedar claro (antes de cada caja de dimensión, si hubo cambio) qué se hizo de acuerdo al comentario del coach. Necesita diseño, no es trivial. Ref §19.

### T134-feature-cache-focos-generados — Feature: cache de focos generados en revisión (no regenerar todo al cambiar selección)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-07-02

**Notas:**
Encontrado en live test 7 (Caso Kevin, 1 Jul 2026): si el coach ya generó/revisó objetivos y anclas para varios focos y vuelve al paso 3 a cambiar la selección (quitar uno, agregar otro), el botón 'Generar' vuelve a llamar al modelo para TODOS los focos seleccionados, no solo el que cambió — se pierde lo ya revisado y se reintroduce variabilidad (no determinismo, §18). Esperado: quitar una selección solo la quita de revisión; agregar una nueva selección solo genera esa, sin tocar lo ya generado. Relacionado con el bug de cache de identify de §18 (mismo problema de fondo: el wizard no distingue 'cambió el input' de 'cambió la selección'). Ref §20.

### T135-feature-chip-en-buen-estado — Feature: chip "en buen estado" para sub-dimensiones que no son candidatas a foco
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Low
- status: backlog
- created: 2026-07-02

**Notas:**
Encontrado en live test 7 (Caso Kevin, 1 Jul 2026): en el paso de selección de focos, UrgenciaChip solo se renderiza cuando candidata_a_foco es true (urgente/a trabajar/menor). Las sub-dimensiones que el coach describe como que van bien no tienen ningún indicador visual — ambiguo entre 'no se detectó' y 'está bien'. Agregar chip verde tipo 'en buen estado' o 'de mantenimiento' para esos casos. Ref §20.

### T136-redesign-merge-dimension-repetida — Redesign — política de merge cuando una dimensión se menciona 2+ veces en el dump
- category: Team
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-07-02

**Notas:**
Encontrado en live test 7 (Caso Kevin, 1 Jul 2026): identify devolvió dos entradas separadas de 'liderazgo' (una mencionada al inicio del dump, otra a la mitad). Pregunta abierta: ¿se destilan en una sola entrada (intuición de Marco), o se decide cuál mención tiene mayor impacto en el juego (requeriría su propia rúbrica, overkill por ahora)? Bug técnico asociado: la UI usa focoKey(dimension, sub_dimension) como key de React Y como llave del Set de selección — dos entradas con la misma sub-dimensión colisionan (seleccionar una selecciona ambas visualmente). El fix correcto es que identify nunca devuelva dos entradas para la misma sub-dimensión (mergear en el prompt), no un parche de UI. Ref docs/scope-planning-measurement.md §20.

### T139-formato-cierre-compartido-atleta — Formato de cierre compartido para atleta / papá / coach
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Low
- status: backlog
- created: 2026-07-03

**Notas:**
Idea de Marco (2 Jul 2026, docs/scope-planning-measurement.md §21): cuando el plan trimestral se cierra (status completed), generar un formato tipo cards o documento presentable que puedan tener el atleta, el papá y el coach. Prioridad baja explícita de Marco ('no importa ahorita') — sin scoping todavía.

### T141-pm-outcome-deprioritized — P&M — agregar outcome 'deprioritized' + deprioritized_at
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-07-03

**Notas:**
Gap detectado por Marco en revisión de scope (2 Jul 2026, ver docs/scope-planning-measurement.md §21): ninguno de los 3 outcomes existentes (logrado/parcial/continua) cubre el caso de un foco que el coach decide NO llevar a carryover al cerrar el periodo, sin que haya sido logrado ni esté parcial. Se agrega 4to valor 'deprioritized' al enum de outcome + columna deprioritized_at (timestamptz, nullable). Confirmado por Marco (2 Jul 2026): deprioritized NO requiere final_assessment, a diferencia de los otros 3 outcomes — basta con deprioritized_at. Ya reflejado en §3, §9 y §21 del scope doc.

### T148-servicio-notas-voz-texto-atleta — Servicio de notas de voz/texto por atleta (context feed para reportes y planes)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-07-10

**Notas:**
Idea de Marco (9 Jul 2026): servicio al que todos los coaches suban notas de voz y texto por atleta a lo largo del tiempo. Para atletas nuevos, el initial assessment (hoy el text box libre de PlanesCoach.jsx al crear el primer plan, sujeto a cambiar con el scoping) sería la única entrada inicial. Esa información se agrupa/analiza para alimentar (a) los reportes mensuales — pasan de redacción desde cero a trabajo de review — y (b) el contexto del siguiente plan trimestral. Objetivo: que el coach se enfoque en observar y el sistema arme el resto. Depende de que primero se cierre 'Quitar constraint de asignación coach↔atleta' (task hermano, ampliado 9 Jul) — sin eso no está claro quién puede subir notas de qué atleta. Marco fue explícito: es la pieza más pesada y se hace hasta el final, después de todo lo demás. Necesita su propio doc de scoping (arquitectura de captura de voz, pipeline de análisis/agrupación, qué modelo/prompt, cómo conecta con generate-quarterly-plan) — sigue el patrón agentic ya usado en P&M (docs/scope-planning-measurement.md, docs/agentic-fit-check-pm.md).

### T149-decidir-atletas-se-van-graduan — Decidir qué hacer con atletas que se van de la academia o se gradúan (ej. se van a USA)
- category: Team
- type: Feature
- epic: Phase 1 — Core Features
- priority: Low
- status: backlog
- created: 2026-07-10

**Notas:**
Surgió 9 Jul 2026 al decidir que ningún coach tendrá DELETE sobre atletas (docs/scope-coach-atleta-libre.md §3.5) — la baja se hace con activo=false, pero eso no distingue 'se fue a media temporada' de 'se graduó y se fue a jugar/estudiar a USA'. Falta decidir: ¿se necesita un estado distinto a activo/inactivo (ej. 'egresado')? ¿se conserva el expediente completo visible en Equipo o se archiva aparte? ¿hay algo que exportar/entregar al atleta o a la familia al salir? Es decisión de producto, no depende de ningún cambio técnico pendiente.

### T150-scopear-skill-9-llm-feature-flow — Scopear + diseñar skill #9: LLM/agent feature build flow
- category: Dev
- type: Chore
- epic: Phase 2 — Analytics
- priority: High
- status: backlog
- created: 2026-07-14

**Notas:**
Skill compañero de #1 (feature-build-flow) — el paso 7 de #1 hoy solo dice "para y scopea con Marco", sin flujo propio. Necesita doc de scoping antes de diseñarse con skill-creator. 5 preguntas a resolver (determinan si evals/ se construye): dónde viven los evals, formato del dataset de casos, quién/qué es el grader (ya hay precedente real: modo validate de generate-quarterly-plan pm-v4.0), cuándo corre la suite, cómo se versiona el prompt. Detalle completo en docs/skills-backlog.md #9.

### T152-repensar-liderazgo-physical-pm — Repensar liderazgo (score -2..+2 en report_character) y physical como dimensión de P&M
- category: Team
- type: Feature
- epic: —
- priority: Medium
- status: backlog
- created: 2026-07-14

**Notas:**
(sin notas)

### T154-pm-botones-mejorar-por-objetivo — P&M — botones 'mejorar' por objetivo en revision (reemplaza box único de feedback)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-07-15

**Notas:**
docs/scope-close-quarterly-plan.md §16.7. El box unico '¿Algo no cuadra?' del paso 4 regenera TODO el plan con un solo comentario -- volvio vagos objetivos que no se querian tocar. Idea: boton 'Mejorar' por objetivo/observacion (patron tipo comentarios de IA en Google Docs), quitando la caja fija del fondo y agregando una caja de instrucciones corta debajo de la barra de progreso. Probablemente cambia el contrato de regenerate en la edge function (feedback por-objetivo en vez de string global). Necesita su propio scoping antes de construir.

### T155-pm-ciclo-vida-fechas-plan — P&M — ciclo de vida de fechas del plan (closed_at / inicio de borrador / fecha de publicación)
- category: Dev
- type: Feature
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-07-15

**Notas:**
docs/scope-close-quarterly-plan.md §16.4. Hoy period_start del plan siguiente se elige a mano en el paso 1 = primer dia del mes siguiente al cierre. Propuesta de Marco: separar 3 fechas (closed_at, inicio del borrador, fecha de publicacion) y que el periodo real de 3 meses se cuente desde que el coach PUBLICA el plan, no desde que crea el draft -- asi los planes duran 3 meses de uso real. Necesita su propia sesion de scoping antes de tocar codigo (toca startPlanCreation, periodEndFor, paso 1 del wizard, posible columna nueva en schema).

### T157-pm-prompt-anclas-tecnica — P&M — prompt de anclas de técnica: no debe asentarse en 'consistente en entrenamiento'
- category: Dev
- type: Bug
- epic: Phase 2 — Analytics
- priority: Medium
- status: backlog
- created: 2026-07-15

**Notas:**
docs/scope-close-quarterly-plan.md §16.8. La plantilla generica de anclas (generate-quarterly-plan/index.ts linea ~193) usa 'consistente en entrenamiento' como nivel 0 -- para tecnica, la transferencia deberia apuntar siempre a partido, nunca quedarse en drill/entrenamiento como referencia. Es un ajuste de prompt (Tier B, no determinista) -- decidir si tecnica necesita su propia plantilla de anclas separada de tactica/caracter. Requiere revision con Marco viendo ejemplos generados antes de tocar el prompt en produccion.
