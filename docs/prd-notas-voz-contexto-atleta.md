# PRD — Servicio de notas de voz/texto por atleta (context feed para reportes y planes)

- **Task:** T148
- **Autor:** Marco + Claude
- **Creado:** 2026-07-23
- **Estado:** borrador — pendiente de decisiones bloqueantes (ver §7)
- **Docs relacionados:** `docs/scope-planning-measurement.md` (§14 EPIC VOZ, §21), `docs/scope-close-quarterly-plan.md` (§132 riesgo mega-dump, "Notas de voz — cruce entre 3 piezas")

---

## 1. Problema

Hoy el único momento en que el contexto de un atleta entra al sistema es cuando el coach se sienta a escribir el "dump" de observaciones al crear un plan trimestral, o al llenar un reporte mensual. Todo lo que el coach observa **entre** esos momentos —a mitad del 2º set de un torneo, al salir de un entrenamiento— se pierde o se reconstruye de memoria semanas después.

El resultado: el dump que alimenta `generate-quarterly-plan` depende de la memoria puntual del coach ese día, no de un registro acumulado de lo que de verdad pasó en el trimestre. Y el `prior_bundle` que pasa contexto al plan siguiente hoy es deliberadamente angosto (solo focos + outcome + retrospectivas del plan anterior; ver `buildPriorBundle` en `athletics.js:536`).

## 2. Objetivo

Un servicio donde **cualquier coach** captura notas —por texto o por voz— sobre un atleta, en cualquier momento, segmentadas por contexto (torneo / entrenamiento / general). Esas notas se acumulan como un **record de observaciones por atleta** a lo largo del tiempo, y se curan en un bundle editable que alimenta:

1. El dump de entrada de `generate-quarterly-plan` (contexto más rico que la memoria puntual del coach).
2. El `prior_bundle` del plan siguiente (histórico real, no solo el resumen del plan anterior).

## 3. No-objetivos (fuera de alcance de T148)

- **Notas visibles al atleta o a los padres.** Estas notas son del lado del coach, insumo interno — mismo principio que mantuvo el digest de onboarding como cosa de equipo (T161). Si algún día se comparten, es un task aparte con su propia decisión de privacidad.
- **Reemplazar el reporte mensual o el dump del plan.** Este servicio los **alimenta**, no los sustituye.
- **2FA / WhatsApp** (T043) — sin relación.
- **Transcripción en tiempo real / streaming.** La nota se graba y se transcribe asincrónicamente; no hay dictado en vivo.

## 4. Principio rector: evitar el mega-dump

Riesgo ya identificado por Marco (`scope-close-quarterly-plan.md §132`): si se concatena todo el contexto sin curar —bundle estructurado + trayectoria de scores + todas las notas de voz del periodo + comentarios de cierre— el input a `generate`/`regenerate` se vuelve un mega-dump que **degrada** la calidad del output en vez de mejorarla.

Por eso la curación no es opcional ni un "nice to have" de fase tardía: es el corazón del producto. El coach debe poder **revisar, agrupar y editar** el bundle antes de que alimente un plan — no se manda crudo. Esto es lo que la junta del 21 Jul llamó "edición del bundle para que se agrupe y quede preparado para el plan siguiente".

## 5. Modelo de datos (propuesto)

Tabla nueva `athlete_notes`:

| columna | tipo | nota |
|---|---|---|
| `id` | uuid PK | |
| `athlete_id` | uuid FK → athletes | de quién es la nota |
| `coach_id` | uuid FK → coaches | quién la capturó |
| `kind` | text enum `voice` \| `text` | origen de la nota |
| `segment` | text enum `tournament` \| `training` \| `general` | contexto de captura |
| `tournament_id` | uuid FK → tournaments, nullable | solo si `segment='tournament'` |
| `body` | text | la nota en texto (el transcript si `kind='voice'`, lo escrito si `kind='text'`) |
| `audio_path` | text, nullable | ruta al audio original si `kind='voice'` |
| `transcribed_at` | timestamptz, nullable | cuándo se completó la transcripción (null = pendiente/fallida) |
| `created_at` / `updated_at` | timestamptz | |

Notas de diseño:
- **Segmentación por entrenamiento = etiqueta, no FK.** No existe tabla de sesiones de entrenamiento y crear una es un proyecto aparte; `segment='training'` sin más granularidad es suficiente para agrupar.
- **Segmentación por torneo = FK real** a `tournaments` (existe), vía `athlete_tournaments` para saber qué atletas están en qué torneo.
- El **transcript vive en `body`** para que voz y texto sean la misma cosa aguas abajo (la curación y el bundle no distinguen origen). El audio (`audio_path`) es respaldo/reproducción.

**RLS:** cualquier coach lee y crea notas de cualquier atleta (mismo modelo cross-coach de `reports` desde T140 — no hay ownership); el atleta **no tiene acceso** (mismo patrón que `report_character`). Se verifica con `verify-rls` contra sandbox antes de construir la UI (regla de este proyecto: capa de datos verificada primero).

## 6. Fases

El orden de-riesga: cada fase entrega valor por sí sola y no depende de que la siguiente exista.

### Fase 0 — Scope + decisiones (este doc)
Cerrar las decisiones bloqueantes de §7, la convención de evals (T150), y aprobar el modelo de datos. Sin esto no arranca la fase 1.

### Fase 1 — Captura de texto + timeline por atleta
- Tabla `athlete_notes` + migración (solo schema) + RLS verificada.
- UI del coach: capturar una nota de **texto** sobre un atleta, con selector de segmento (y torneo si aplica).
- Timeline por atleta: lista cronológica de sus notas, filtrable por segmento.
- **Sin voz, sin transcripción, sin LLM todavía** — es el esqueleto que prueba el modelo de datos y el flujo de captura con el menor riesgo.
- Verificación: `verify-rls` + `verify-tests` + `verify-ui` (móvil, el coach captura en cancha).

### Fase 2 — Captura de voz + transcripción
**Decisiones de arranque (23 Jul 2026, Marco):** Storage = Supabase Storage (bucket `athlete-notes-audio`); STT = Whisper/OpenAI (reutiliza `OPENAI_API_KEY`). **Sin tope de duración** por ahora — Marco quiere ver cuánto graban los coaches en la práctica y después analizar la distribución para elegir un decil donde cortar; costo/subida no preocupan hoy (volumen bajo). **Implicación:** se guarda `audio_duration_seconds` en cada nota desde la captura, para tener los datos que ese análisis necesita. La UI muestra un contador en vivo pero no corta.

**Sub-fases (cada una verificable y commiteable sola, como fase 1):**
- **2a** — bucket + RLS + grabación en el navegador + upload + guardado durable. La nota de voz se guarda y el audio se reproduce; `transcription_status='pending'` (aún sin transcribir). Columna nueva `audio_duration_seconds`.
- **2b** — Edge Function `transcribe-note` (Whisper) + estados de transcripción en el timeline.
- **2c** — reintento (1 inmediato + barrida diaria vía GitHub Actions) + tope de `transcription_attempts`.

- Grabación de audio desde el navegador (coach en cancha, móvil). `MediaRecorder` — tomar el mime real (`audio/mp4` en Safari iOS, `audio/webm` en Chrome), no asumir uno.
- Subida del audio a Supabase Storage, bucket privado `athlete-notes-audio`, path `{note_id}.{ext}`.
- Transcripción asíncrona (Whisper) → llena `body` + `transcribed_at`, `transcription_status='done'`.
- **Garantía de durabilidad + reintento (requisito de Marco, 23 Jul 2026):**
  - La nota de voz se **guarda siempre**, aunque la transcripción falle — el audio nunca se pierde por un fallo de STT. (El schema ya lo permite: `body` nullable, `audio_path` guarda el audio.)
  - Al fallar la transcripción: `transcription_status='failed'`, se registra `transcription_error`, y se hace **1 reintento inmediato**.
  - Si el reintento también falla, la nota queda `failed` y se recupera por una **barrida diaria** (cron / Edge Function) que busca `transcription_status IN ('pending','failed')` —vía el index parcial `idx_athlete_notes_transcription_pending`— y las vuelve a intentar. `transcription_attempts` cuenta intentos para poder poner un tope y no reintentar infinito.
  - Estados en el schema (creados ya en la migración de fase 1): `pending` → `done` | `failed`.
- Verificación: `verify-tests` (lógica pura de estados/reintento) + `verify-ui`. La transcripción en sí no es evaluable con un test determinista pero **tampoco es Tier B** (no es output generativo que juzgamos por calidad — es un servicio externo de STT; se verifica que el pipeline funcione, no la "calidad" del modelo).

### Fase 3 — Curación / edición del bundle
- Vista donde el coach **revisa y agrupa** las notas de un atleta de un periodo: seleccionar cuáles entran, agruparlas por tema/foco, editar/condensar.
- El output es un bundle curado, editable, listo para alimentar un plan — **el antídoto al mega-dump** (§4).
- Esta fase puede ser mayormente manual (el coach cura a mano) **antes** de meter LLM — decisión de diseño a validar: ¿la primera versión de la agrupación la hace el coach, o la sugiere un modelo?
- Verificación: `verify-tests` + `verify-ui`. Si la agrupación la sugiere un modelo → cae en fase 4.

### Fase 4 — Wiring al plan (LLM) — **GATED por T150**
- Expandir `buildPriorBundle` / el input de `generate-quarterly-plan` para incorporar el bundle curado de notas.
- Si hay resumen/agrupación asistida por modelo, **esto es una feature LLM/agent con output no determinista** → primera vez que el proyecto llega a `verify-evals` de verdad.
- **CLAUDE.md manda parar aquí:** la convención de evals (dónde viven, formato del dataset, quién es el grader) está sin definir (T150). No se inventa en silencio — se scopea con Marco primero, como se hizo con la rúbrica de planning+measurement.
- Verificación: `verify-evals` (una vez exista la convención) + `verify-tests`.

## 7. Decisiones

**Resueltas (23 Jul 2026, Marco):**
1. **Orden de fases: texto primero.** ✅ Fase 1 = texto + timeline + modelo de datos + RLS (COMPLETADA, en prod, commit `3802930`); voz en fase 2.
2. **Storage del audio: Supabase Storage.** ✅ (decidido al arrancar fase 2, 23 Jul). Ya existe en el proyecto (buckets + policies del CMS, `20260623224807_cds_storage_policies.sql`) — mismo patrón de RLS, cero acoplamiento nuevo. Bucket privado nuevo `athlete-notes-audio`. Se descarta Google Drive (T162 sigue exploratorio, acoplarse ahí sería prematuro).
3. **Proveedor de transcripción (STT): Whisper (OpenAI).** ✅ (decidido al arrancar fase 2, 23 Jul). El proyecto YA usa OpenAI (`OPENAI_API_KEY`) en `generate-quarterly-plan` — reutiliza key y proveedor, sin vendor ni secret nuevos. Se descarta ElevenLabs (introduciría un proveedor nuevo sin necesidad).

**Pendiente:**
4. **Convención de evals (T150) — bloquea la fase 4, no las anteriores.** Antes de que cualquier agrupación/resumen asistida por modelo entre al plan, hay que definir la convención (dónde viven los evals, formato del dataset, quién es el grader). Se puede diferir hasta cerrar fase 3, pero debe resolverse antes de fase 4.

## 8. Plan de verificación (resumen)

| Fase | verify-rls | verify-tests | verify-ui | verify-evals |
|---|---|---|---|---|
| 1 | ✅ (tabla + RLS nuevas) | ✅ | ✅ (captura móvil) | — |
| 2 | — | ✅ (estados) | ✅ | — |
| 3 | — | ✅ | ✅ | — |
| 4 | — | ✅ | — | ✅ (gated por T150) |

## 9. Dependencias y relaciones

- **Expande, no reemplaza:** `buildPriorBundle` (`athletics.js:536`) y el contrato `body.prior_bundle` de `generate-quarterly-plan` (index.ts:356) ya existen y funcionan.
- **T150** (convención de evals) — bloquea la fase 4.
- **T162** (Google Drive como DB de highlights) — relacionado por la decisión de storage (§7.3), pero se puede desacoplar.
- **`report_athlete_voice`** ya existe como tabla — es la voz del **atleta** en un reporte, NO este servicio (que es del coach). No confundir.
