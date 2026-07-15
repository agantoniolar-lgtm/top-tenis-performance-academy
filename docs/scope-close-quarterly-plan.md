# Scope — `close-quarterly-plan` + retrospectives + handoff periodo→periodo

**Fecha:** 14 Jul 2026
**Task Notion:** P&M v2 — close-quarterly-plan + retrospectives + handoff periodo→periodo (Dev, Phase 2 — Analytics, In Progress)
**Relacionado:** `docs/scope-planning-measurement.md` §7, §7.1, §9, §10, §13, §21 (modelo ya acordado); `docs/scope-mis-planes-atleta.md` (consumidor de `coach_retrospective`/`athlete_retrospective` en modo lectura)

---

## 1. Por qué ahora

Confirmado en la revisión de apertura de esta sesión (`scope-planning-measurement.md` §22): **el cierre del loop no existe para nadie.** `PlanesCoach.jsx` no tiene ningún código para `outcome`, `closed_at`, `coach_retrospective` ni `athlete_retrospective`. La edge function `close-quarterly-plan` (§10) nunca se escribió — solo `generate-quarterly-plan` existe en `supabase/functions/`. Un plan `active` no tiene ningún camino para llegar a `completed`. Esto bloquea:
- Que un plan trimestral se cierre formalmente.
- El handoff automático al plan N+1 (§7.1) — que depende de que el N anterior tenga `outcome`/`final_assessment`/retrospectives.
- La vista "Planes anteriores" de `MiPlan.jsx`, que ya está lista para mostrar `outcome`/`final_assessment`/retrospectives pero hoy nunca los recibe.

## 2. Lo que YA existe en el schema (verificado contra Supabase, no solo contra el doc)

`quarterly_plans`: `status` ya incluye `'completed'`, más `coach_retrospective` (text), `athlete_retrospective` (text), `closed_at` (timestamptz) — todos nullable, ya migrados.
`quarterly_plan_objectives`: `outcome` (text, CHECK) y `final_assessment` (text) ya existen.

**RLS:** el coach ya tiene UPDATE sin restricción sobre `quarterly_plans`/`quarterly_plan_objectives` de cualquier atleta (`docs/db-schema.md` línea 264) — no hace falta policy nueva para que el coach escriba `outcome`, `final_assessment`, `coach_retrospective`, `closed_at`. El atleta sigue en solo-lectura; escribir `athlete_retrospective` desde el lado del atleta sigue **fuera de este scope** (depende de "formato de cierre compartido atleta/papá/coach", Backlog, baja prioridad — decisión ya tomada, no se revisita aquí).

## 3. Gap nuevo — el CHECK de `outcome` no incluye `deprioritized`

`scope-planning-measurement.md` §21 (2 Jul 2026) decidió agregar el cuarto valor `deprioritized` al enum de `outcome`, más la columna `deprioritized_at`. **Eso nunca se migró.** El CHECK real en Supabase hoy es:

```sql
outcome = ANY (ARRAY['logrado'::text, 'parcial'::text, 'continua'::text])
```

Sin `deprioritized`, ni la columna `deprioritized_at`. Migración pendiente, parte de este build (§7 abajo).

## 4. Gap nuevo — no hay una fuente uniforme de "los 3 scores del periodo" por sub-dimensión

§7.1 dice: *"la trayectoria de los 3 scores −2..+2 de cada foco... es input de primera clase"* para sugerir `outcome` y para el handoff. Revisé de dónde saldría ese dato por dimensión y **no es uniforme**:

| Dimensión | Fuente | ¿Tiene score −2..+2 directo? |
|---|---|---|
| Técnica (`serve`, `forehand`, `backhand`, `volea`, `devolucion`, `footwork`) | `report_on_court` | Sí — columna por sub-dimensión |
| Táctica (`seleccion_golpe`, `manejo_riesgo`, `puntos_clave`, `adaptacion_tactica`, `transferencia_partido`) | `report_on_court` | Sí — columna por sub-dimensión |
| Carácter — `etica_trabajo`, `coachabilidad` | `report_character` | Sí |
| **Carácter — `liderazgo`** | `report_character` | **No** — la tabla solo tiene `liderazgo_nota` (texto libre), sin columna de score. El score de liderazgo solo existe en `report_athlete_voice` (autoevaluación del atleta, no del coach). |
| Physical (`sprint_20m`, `beep_test`, `salto_vertical`, `spider_drill`, `fms`, `fuerza_inferior`, `fuerza_superior`) | `report_physical` | **No** — son valores numéricos crudos (segundos, cm, nivel), no `−2..+2`. Convertir a banda requiere `baseline`/`target`/`unit` del objetivo (§3 del doc madre), y el catálogo de baselines físicos **sigue sin existir** (§11, §16 del doc madre — bloqueante ya conocido, no se resuelve aquí). |

**Consecuencia para este build:** no puedo construir "trayectoria de 3 scores" genérica y uniforme para las 4 dimensiones sin tocar huecos que no son de este task. Ver decisión propuesta en §6.

## 5. Gap operativo — el handoff nunca se conecta hoy, aunque la edge function ya lo soporta

`supabase/functions/generate-quarterly-plan/index.ts` (línea ~353) ya lee `body.prior_bundle` y lo mete al prompt de `generate`/`regenerate` si viene. Pero `PlanesCoach.jsx` (`handleGenerate`) **nunca envía `prior_bundle`** — llama con `{ mode: 'generate', observations, focos }`, sin ese campo. El contrato del lado del modelo existe; el lado del cliente que arma y envía el bundle nunca se escribió. Este build es lo que lo completa: al cerrar el plan N, queda `outcome`/`final_assessment`/retrospectives capturados; falta además que el paso de creación del plan N+1 arme `prior_bundle` desde el plan N cerrado más reciente y lo mande.

## 6. Propuesta de alcance — primera rebanada vs. lo que queda fuera

Dado el tamaño real (cierre + trigger de handoff + 2 gaps de schema/datos), propongo dividir así:

**Sí, en esta rebanada:**
1. Migración: agregar `deprioritized` al CHECK de `outcome` + columna `deprioritized_at` (§3 arriba).
2. Flujo de cierre en `PlanesCoach.jsx` (vista `detail`, solo si `status === 'active'`): botón "Cerrar periodo" → por cada foco, el coach ve el objetivo + anclas + (si hay score disponible, la trayectoria mensual) y elige `outcome` (`logrado`/`parcial`/`continua`/`deprioritized`) + escribe `final_assessment` (libre, sin asistencia LLM en esta rebanada — ver §6.1 sobre por qué se recorta el "asistido"). `deprioritized` no exige `final_assessment` (§21 del doc madre, ya decidido) — solo pide confirmar y llena `deprioritized_at`.
3. `coach_retrospective`: 3 preguntas de texto libre, ya definidas en §21 del doc madre (qué funcionó / qué no / qué priorizar el siguiente trimestre) — sin LLM, texto directo a la columna.
4. Al confirmar el cierre: transacción que actualiza cada `quarterly_plan_objectives` (`outcome`, `final_assessment` o `deprioritized_at`) + `quarterly_plans` (`coach_retrospective`, `status = 'completed'`, `closed_at = now()`).
5. Wiring del handoff: al pasar de paso 1→2 en la creación de un plan nuevo (`handleStep1Continue`), si existe un plan `completed` previo del mismo atleta, armar `prior_bundle` (focos + `objetivo` + `outcome` + `final_assessment` + `coach_retrospective`/`athlete_retrospective` si existen) y pasarlo a `handleGenerate`/`handleRegenerate`.
6. Migrar `docs/db-schema.md` con `deprioritized`/`deprioritized_at`.

**Fuera de esta rebanada (recortado a propósito):**
- **Sugerencia de `outcome` asistida por LLM** (§21 del doc madre menciona "outcome sugerido por foco, coach confirma"). Se recorta porque depende de la trayectoria de scores del §4, que no es uniforme entre dimensiones — construir la sugerencia ahora significa o (a) improvisar sobre datos que no existen para `liderazgo`/`physical`, o (b) resolver primero el catálogo físico y el score de liderazgo, que son harina de otro costal (§11/§16 del doc madre). El coach elige `outcome` a mano en esta rebanada; la asistencia se agrega cuando el catálogo físico y el score de liderazgo estén resueltos.
- **`final_assessment` asistido por LLM.** Mismo argumento — sin trayectoria confiable de scores, la asistencia no tiene mejor insumo que el diagnóstico/objetivo ya visibles, que el coach ya está viendo en pantalla. Texto libre por ahora.
- **Trayectoria de los 3 scores mensuales visible en el flujo de cierre.** Se muestra **si existe** para técnica/táctica/`etica_trabajo`/`coachabilidad` (fuente clara, `report_on_court`/`report_character`), y se omite silenciosamente para `liderazgo`/physical en vez de fabricar un dato que no existe.
- **Recordatorio automático de cierre** (§13 del doc madre: "al final de la semana posterior al trimestre"). Requiere infra de notificaciones/cron que no existe hoy — backlog aparte.
- **`athlete_retrospective`.** Confirmado fuera, depende de "formato de cierre compartido" (Backlog).

### 6.1 Por qué recortar la asistencia LLM en vez de construirla a medias
Ya pasó en este proyecto (rúbrica de objetivos, §16-20 de `scope-planning-measurement.md`) que una asistencia LLM construida sobre datos incompletos generó confianza falsa (el modelo "sonaba bien" con inputs pobres). Prefiero que el coach cierre el trimestre a mano con buena UI esta rebanada, y que la asistencia LLM llegue en una segunda pasada cuando el insumo (trayectoria de scores) sea real para las 4 dimensiones — no antes.

## 7. Cambios de schema (migración)

```sql
alter table quarterly_plan_objectives
  drop constraint quarterly_plan_objectives_outcome_check,
  add constraint quarterly_plan_objectives_outcome_check
    check (outcome = any (array['logrado','parcial','continua','deprioritized']));

alter table quarterly_plan_objectives
  add column deprioritized_at timestamptz;
```

(Nombre exacto del constraint a confirmar contra `pg_constraint` al aplicar — el de arriba es el nombre por convención de Postgres, puede diferir.)

## 8. UI — flujo de cierre (boceto)

Dentro de `PlanesCoach.jsx`, vista `detail`, cuando `activePlan.status === 'active'`:
- Botón nuevo junto a "Archivar": **"Cerrar periodo →"**.
- Nueva sub-vista (`view === 'closing'` o modal, a decidir en el componente) con, por foco: objetivo + anclas ya visibles (reusa `FocoCard`) + selector `outcome` (4 opciones) + textarea `final_assessment` (oculta/no requerida si `outcome === 'deprioritized'`).
- Al final: 3 textareas de `coach_retrospective`.
- Botón "Confirmar cierre" → transacción del §6.5. Tras confirmar, vuelve a `list` (o a `detail` ya en `completed`).

No hay lógica pura nueva evidente más allá de armar el `prior_bundle` (mapeo de filas a objeto) — candidato a función en `src/lib` con test (ej. `buildPriorBundle(plan, objectives)`).

## 9. Preguntas para Marco antes de construir

1. ¿De acuerdo con recortar la asistencia LLM (outcome sugerido / final_assessment asistido) de esta rebanada, dado el gap de datos del §4? ¿O prefieres que resuelva primero el score de `liderazgo` en `report_character` y el catálogo físico para no partir el trabajo en dos pasadas?
2. ¿El botón "Cerrar periodo" debe bloquear si no todos los focos tienen `outcome` asignado, o permitir guardar parcial e ir cerrando foco por foco en varias sesiones? (Precedente: `PlanesCoach.jsx` ya tiene draft persistente para creación — ¿el cierre necesita el mismo patrón, o de un tiro basta dado que es un formulario corto?)
3. `deprioritized` — ¿debe pedir confirmación extra en la UI (ej. "¿seguro que no le das seguimiento?") dado que es una decisión de priorización sin narrativa obligatoria, o un simple toggle basta?
4. Nombre de función/mode: ¿nuevo `mode: 'close'` dentro de `generate-quarterly-plan` (consistente con el patrón de modos ya usado) ya que en esta rebanada no hay llamada a LLM real (el cierre es todo capturado a mano), o el cierre no necesita edge function en absoluto y es directo Supabase client → tablas (más simple, ya que no hay generación de texto por ahora)?

## 10. Decisiones de Marco (14 Jul 2026) — construido con esto

1. **Cierre 100% manual esta rebanada.** Sin asistencia LLM. Marco confirmó además que `liderazgo` y `carácter` **sí deberían tener su score −2..+2** propio (hoy `liderazgo` solo tiene `liderazgo_nota` en `report_character`), y que **physical necesita repensarse como dimensión completa dentro de planes** — posible candidato a sacarse de ahí porque "no se conecta bien". Ninguna de las dos se resuelve en este build — quedan como task nuevo de backlog (§11).
2. **Cierre parcial permitido**, igual que el draft de creación: cada foco autoguarda su `outcome`/`final_assessment` al momento; la retrospectiva del coach vive en `draft_state` mientras el plan sigue `active` y se confirma (pasa a `coach_retrospective` + `status: 'completed'`) con un botón explícito. Ningún campo bloquea el "Confirmar cierre" — solo se muestra un aviso no-bloqueante con cuántos focos siguen sin `outcome`.
3. **Sin Edge Function.** El cierre es directo `supabase.from(...).update(...)` desde `PlanesCoach.jsx`, igual que ya hace `handleArchive`. No hay deploy nuevo.

## 11. Construido (14 Jul 2026)

- Migración `add_deprioritized_outcome_and_deprioritized_at`: `outcome` admite `deprioritized`; columna `deprioritized_at` (timestamptz, nullable) en `quarterly_plan_objectives`.
- `PlanesCoach.jsx`: botón "Cerrar periodo →" en el detail de un plan `active`; vista `closing` con outcome por foco (4 chips) + `final_assessment` (oculto si `deprioritized`) + 3 preguntas de retrospectiva del coach; autoguardado por foco; "Confirmar cierre" → `status: 'completed'`, `closed_at`, `coach_retrospective`, `draft_state: null`. Detail de un plan `completed` ahora también muestra el `outcome`/`final_assessment` por foco y la retrospectiva.
- Wiring del handoff (§5): `handleStep1Continue`/`resumeDraftFromList` cargan el `prior_bundle` del plan `completed` más reciente del atleta (`loadPriorBundle`) y se envía en `generate`/`regenerate` si existe.
- `src/lib/athletics.js` + tests: `formatCoachRetrospective`, `focosSinOutcome`, `buildPriorBundle`, `COACH_RETRO_QUESTIONS`.
- **No construido en esta rebanada (a propósito, ver §6):** sugerencia de `outcome`/`final_assessment` asistida por LLM, trayectoria de scores mensuales visible en el cierre, recordatorio automático de cierre. `monthly_scores` se omite del `prior_bundle` por el mismo motivo del §4.

## 12. Siguiente paso

Backlog nuevo (creado en el kanban): repensar `liderazgo` (agregar score −2..+2 a `report_character`, además de la nota) y `physical` como dimensión dentro de P&M — decisión de Marco, needs su propia conversación antes de scopear. Cuando eso se resuelva, retomar la asistencia LLM de este build (sugerencia de outcome + trayectoria de scores) como una segunda rebanada.

## 13. Hallazgos de la revisión de Marco (14 Jul 2026) — pendientes de decidir

Marco revisó el flujo construido (§11) y encontró huecos reales antes de darlo por terminado. Ninguno de estos se resolvió todavía — quedan registrados para no perderse.

### Gate de tiempo para cerrar — resuelto (no-bloqueante)
El botón "Cerrar periodo →" no tenía ningún chequeo contra `period_end`. Decisión de Marco: avisar si se cierra antes de que el trimestre termine, sin bloquear. **Construido:** aviso ámbar no-bloqueante en la vista de cierre si `period_end` todavía no pasó.

### `prior_bundle` — mismo objeto que "el bundle del periodo previo" (aclaración de términos)
Confirmado: lo que se construyó en §11 (`buildPriorBundle` → `{ prior_focos, coach_retrospective, athlete_retrospective }`) **es** `prior_bundle` — no son dos cosas distintas, es el mismo objeto descrito de dos formas en la conversación. Hoy es deliberadamente angosto (coincide con §7.1/§10 del doc madre, sin `monthly_scores` por el gap del §4).

### `prior_bundle` — riesgo de mega-dump al integrar scores + notas de voz (abierto)
Marco señala que el "contexto anterior" que debería alimentar el plan siguiente es más amplio que lo construido: el bundle estructurado (ya listo), la trayectoria de scores (bloqueada, ver task de liderazgo/physical), las notas de voz del periodo — sobre todo las del último mes — (servicio todavía sin construir), y comentarios adicionales del coach al cerrar. Preocupación explícita: si se concatena todo sin curar, se vuelve un mega-dump que degrada la calidad del output de `generate`/`regenerate`, no la mejora. **Sin resolver todavía** — decidir si esto se scopea dentro de "Servicio de notas de voz/texto por atleta" (que ya menciona conectar con `generate-quarterly-plan`) o aparte. Ver conversación de esta sesión para la discusión completa.

### Vista de cierre — falta contexto de scores/comentarios del periodo (abierto)
La vista de cierre muestra objetivo + anclas (la rúbrica -2..+2), pero **no muestra los scores reales que se capturaron mes a mes** durante el trimestre, ni el último comentario del coach (ej. `tecnica_nota`, `tactica_nota`, `etica_trabajo_nota`, `coachabilidad_nota` de `report_on_court`/`report_character`) — esto sí existe en BD para técnica/táctica/ética de trabajo/coachabilidad (no para liderazgo/physical, ver §4). Sin esto, el coach cierra "a ciegas" respecto a lo que él mismo capturó mes a mes, incluyendo su propio comentario más reciente. **Pendiente de construir**, condicionado a la pregunta de secuencia de abajo.

### Anclas vs. outcome — vocabularios no congruentes (abierto, pregunta de diseño)
Las anclas son una escala de progreso (`Estancado → Rezagado → Por buen camino → Adelantado → Superado`); `outcome` es un vocabulario de decisión distinto (`logrado`/`parcial`/`continúa`/`deprioritized`) sin mapeo definido entre ambos. Hoy el coach tiene que traducir mentalmente de un lenguaje al otro sin ninguna ayuda visual. Sin resolver — depende en parte de tener los scores reales visibles (punto anterior) para que el mapeo tenga sentido.

### Secuencia: ¿reporte del mes 3 y luego cierre, o el cierre lo reemplaza? (abierto, bloqueante para el punto de scores)
No estaba definido ni en el doc madre ni en este build. Necesita respuesta de Marco antes de construir la vista de scores en el cierre.

### Después de "Confirmar cierre" — resuelto y construido
Decisión de Marco: saltar directo a crear el plan del atleta que acaba de cerrar (atleta + periodo siguiente prellenados), guardándose como draft si no se completa en el momento — "esto ya debería estar construido" (el mecanismo de draft sí existía, solo faltaba dispararlo automáticamente). **Construido:** `handleConfirmClose` ahora calcula el periodo siguiente (`nextPeriodStartFor`, nuevo helper + test), y llama a `startPlanCreation` (refactor de lo que antes era `handleStep1Continue`, ahora parametrizado para poder llamarse tanto desde el botón del paso 1 como desde este salto automático). Queda pendiente, no construido todavía: pre-seleccionar en el paso 3 los focos que cerraron con `outcome: 'continua'` (hoy el carryover del paso 3 sigue mostrando cualquier foco del periodo anterior sin distinguir por outcome — mismo mecanismo de siempre, no lo tocué).

### Reportes mensuales conectados al cierre (nuevo, 14 Jul 2026 — no construido, necesita más definición)
Respuesta de Marco a la pregunta de secuencia: no quiere "reporte de mes 3, luego aparte el cierre" como dos cosas desconectadas — quiere que **completar el reporte del mes 3 sea el trigger que abre, tanto al coach como al atleta, el retrospective y el cierre de periodo**. Construir esto como pasos conectados desde ahora, aunque más adelante decidamos quitar el reporte de mes 3 como paso independiente.

Esto es más grande que lo que cubre esta rebanada y toca una decisión ya tomada que valdría la pena reabrir explícitamente antes de construir: `athlete_retrospective` está hoy fuera de alcance (depende de "formato de cierre compartido atleta/papá/coach", Backlog, baja prioridad — `docs/scope-mis-planes-atleta.md` §7). Si el trigger debe abrir el retrospective **también al atleta**, eso implica adelantar esa pieza, no solo conectar el cierre del coach a un evento. **No construido — pendiente de que Marco confirme si esto adelanta la captura del lado del atleta o si por ahora el trigger solo aplica al coach** (el atleta se queda como está: solo lectura, sin retrospective propio, hasta que el backlog de "formato de cierre compartido" se scopee aparte).

Detalle técnico adicional sin resolver: "completar el reporte del mes 3" requiere saber qué reporte mensual corresponde al mes 3 de un plan trimestral dado — hoy `reports` se relaciona por `(athlete_id, period)` sin ningún vínculo directo a `quarterly_plans`. Hace falta definir esa relación (¿por fecha? ¿por un FK nuevo?) antes de poder disparar nada automáticamente.

### Notas de voz — cruce entre 3 piezas (abierto, no bloquea esta rebanada)
Marco identifica que el servicio de notas de voz (Backlog, sin scopear) va a tocar simultáneamente: este cierre (notas de cierre / comentarios adicionales), `generate`/`regenerate` (contexto para el plan siguiente), y su propio doc de arquitectura (captura, pipeline, prompt). El task de backlog "Servicio de notas de voz/texto por atleta" ya menciona esta conexión de forma general — falta hacerla explícita para que su doc de scoping (cuando se escriba) la cubra directamente en vez de asumirla.

## 14. Segunda rebanada (14 Jul 2026) — construido

Decisiones de Marco tras ver §13 en vivo:

- **Trigger del reporte de mes 3 → cierre:** confirmado que abre **solo al coach** (el atleta se queda sin retrospective propio, sigue dependiendo de "formato de cierre compartido"). Marco prefiere definir primero cómo se comportan las notas del coach + el `prior_bundle` (con datos reales) antes de construir la conexión automática — **no construido todavía**, correctamente secuenciado después de esto.
- **Vista de cierre — scores + comentarios:** construido. `monthlyScoresForFoco` (nuevo, `src/lib/athletics.js` + tests) junta los scores -2..+2 de `report_on_court`/`report_character` dentro del periodo del plan + el último comentario no-nulo (nota compartida por dimensión en técnica/táctica, nota específica por sub-dimensión en carácter). `physical` devuelve vacío a propósito — no hay mapeo limpio a `report_physical` (mismo gap del §4). Primera versión deliberadamente simple: texto plano en la tarjeta de cada foco, "para ver cómo se ve antes de decidir el formato final".
- **Anclas vs. outcome:** sin cambios de diseño — Marco confirma que en principio sí hace sentido (anclas = avance, outcome = si el objetivo continúa) y prefiere probarlo en vivo con datos reales antes de decidir si hace falta un puente visual.
- **Pre-selección de `continua`:** construida. Nueva función pura `preselectFocos` (`src/lib/athletics.js` + tests) prioriza los sub_dimension con `outcome: 'continua'` del plan anterior por encima de las candidatas más urgentes del dump actual, respetando el límite de `MAX_FOCOS`. El carryover de `handleIdentify` ahora se deriva de `priorBundle` (ya cargado en el paso 1) en vez de una query aparte — esto también corrige una inconsistencia: antes el carryover se calculaba contra planes `active` **o** `completed`; ahora requiere que el plan anterior esté `completed`, consistente con el modelo del handoff (§7.1).
- **Datos dummy — Test Athlete, 2 trimestres:** sembrados directamente en Supabase (no vía migración — es data de prueba, no schema). Trimestre 1 (feb–abr 2026, `completed`): 5 focos — `backhand` (`parcial`), `manejo_riesgo` (`continua`), `liderazgo` (`logrado`, sin score), `forehand` y `puntos_clave` (`logrado`, ambos llegan a Superado) + mantenimiento `serve` + `coach_retrospective` con las 3 preguntas respondidas. Trimestre 2 (may–jul 2026, `active`): `manejo_riesgo` como carryover explícito (`carryover_of` apuntando al foco de T1), `volea` como foco nuevo, `backhand` como mantenimiento con carryover. Los 5 reportes mensuales (feb–jun) para este atleta ya existían en BD con scores/notas reales — se aprovecharon tal cual, editando solo el reporte de abril (`forehand`/`puntos_clave` a +2) para que el trimestre 1 demuestre el rango completo de labels. Se archivó un plan `active` huérfano de pruebas anteriores (periodo jul–oct, sin relación con esta narrativa) para que no interfiera con la demo.

## 15. Ajustes de Marco tras ver el flujo en vivo (15 Jul 2026)

- **Dummy data corregida:** ninguno de los focos originales de T1 llegaba a los labels `Adelantado`/`Superado` en técnica o táctica (backhand y manejo_riesgo se quedan en 0 o menos, liderazgo no tiene score). Se agregaron `forehand` y `puntos_clave` como focos `logrado` adicionales, editando el reporte de abril para que ambos lleguen a +2 — ahora T1 demuestra los 5 labels en las dos dimensiones con score.
- **Formato de scores — palabras, no números:** `fmtSign` (+1, 0) reemplazado por `OC_LABEL` (Estancado/Rezagado/Por buen camino/Adelantado/Superado) en la vista de cierre.
- **Retrospectiva del coach — quitada de la UI por ahora.** Sin valor claro hasta que los coaches usen el resto del flujo. Se removió el bloque de 3 preguntas de la vista de cierre, `retroAnswers`/`blurRetro`, y `handleConfirmClose` ya no escribe `coach_retrospective`. `formatCoachRetrospective`/`COACH_RETRO_QUESTIONS` siguen en `src/lib/athletics.js`, testeadas, listas para reconectar cuando haga falta — no se borró la lógica, solo el wiring a la UI.
- **Corrección de la corrección:** el rango completo de labels se había agregado al plan `completed` (feb–abr) — pero la vista de cierre (donde se ven los scores) solo es accesible desde el botón "Cerrar periodo →", que **solo aparece en planes `active`**. Un plan ya `completed` no tiene forma de reabrir ese wizard. Se movió/replicó la corrección al plan `active` (may–jul, el que sí se puede probar hoy): `volea` (mayo → Superado) y un foco nuevo `seleccion_golpe` (junio → Superado) — `manejo_riesgo` se deja como está (0, sin mejora clara) como contraste realista de un foco que sigue sin resolverse.
- **Pregunta: si el plan se cierra con los 3 reportes mensuales completos (sin cerrar antes de tiempo), ¿los scores del trimestre traen 3 valores?** Sí, con una precisión: `monthlyScoresForFoco` toma un valor por cada reporte mensual cuyo `period` cae dentro de `period_start`..`period_end` **y** cuya columna de esa sub-dimensión no sea null. Si los 3 reportes existen y el coach llenó esa sub-dimensión específica los 3 meses → 3 valores. Si un reporte existe pero esa sub-dimensión en particular quedó sin calificar ese mes (columna null) → ese mes no cuenta, salen menos de 3. La función no fuerza "exactamente 3" — simplemente cuenta lo que de verdad esté capturado en el rango de fechas del plan.
