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

## 16. Primera corrida en vivo (15 Jul 2026) — hallazgos y decisiones

Marco corrió el flujo completo (coach + atleta) siguiendo `docs/qa-guia-cierre-plan-trimestral.md` sobre los datos dummy de Test Athlete. Confirmó los pasos C1–C11 y A1–A6. Esto es lo que salió.

### 16.1 Confirmado — mantenimiento nunca pasa por `outcome`

Pregunta de Marco: si un foco hace carryover como mantenimiento, ¿se muestra solo el label, sin anclas, aunque su outcome haya sido "parcial"? Respuesta, verificada en código: `openClosing` filtra `objs` a `tipo === 'foco'` antes de armar `closingFocos` (línea 578-580) — los ítems `tipo === 'mantenimiento'` **nunca entran al flujo de cierre**, nunca tienen `outcome`, y tanto en `PlanesCoach.jsx` (detail) como en `MiPlan.jsx` se renderizan siempre como chip de texto plano, sin anclas ni outcome, sin importar el trimestre. No es un bug — es el comportamiento actual — pero confirma que "parcial" nunca aplica a mantenimiento porque mantenimiento no tiene outcome en absoluto. Ver 16.6 para la pregunta abierta de si esto debería cambiar.

### 16.2 Bug confirmado — el carryover de "Continúa" no aparece en el draft nuevo si no se menciona en el dump

Marco cerró mayo–jul con `manejo_riesgo` marcado como `continúa`, pero al crear el draft ago–oct ese foco no apareció como candidato — solo aparecieron sub-dimensiones que sí estaban mencionadas en el texto de observaciones nuevo.

Causa raíz, verificada en `src/lib/athletics.js`: `preselectFocos(identified, continuaSubs, maxFocos)` (línea 346) solo puede pre-seleccionar sub-dimensiones que **ya vienen dentro de `identified`** — y `identified` sale de la llamada `mode: 'identify'` al modelo, que identifica sub-dimensiones **a partir del texto nuevo que el coach acaba de escribir** (`handleIdentify`, `PlanesCoach.jsx` línea ~288). Si el coach no vuelve a mencionar "manejo de riesgo" en el dump de este trimestre, el modelo nunca lo identifica, `identified` no lo contiene, y `preselectFocos` no tiene nada que preseleccionar — aunque `continuaSubs` sí lo traiga correctamente desde `priorBundle`.

Esto contradice el modelo que Marco confirma en 16.3: un foco con `continúa` debe aparecer siempre en el draft siguiente, sin depender de que el coach lo vuelva a escribir. **Fix real:** los focos con carryover deben inyectarse directo desde `priorBundle.prior_focos` a la lista de candidatas del paso 3 (no pasar por `identify` en absoluto para estos), y el dump de observaciones nuevo solo debería aportar candidatas adicionales. Se resuelve junto con 16.3, no aparte — son el mismo cambio.

### 16.3 Decisión de Marco — el `outcome` de hoy mezcla dos decisiones que deberían ser independientes

Modelo actual: un solo campo `outcome` con 4 valores mutuamente excluyentes (`logrado` / `parcial` / `continua` / `deprioritized`). Problema real, con ejemplo de Marco: si un foco es "Parcial" pero el coach quiere que continúe el siguiente trimestre, **hoy no puede expresar las dos cosas a la vez** — elegir "Parcial" pierde el carryover, porque "Continúa" es una opción distinta y excluyente.

**Decisión — separar en dos ejes:**

1. **Estado final del objetivo** — `logrado` / `parcial` / `fallido` (nuevo, antónimo de logrado; reemplaza el uso de "continúa" como si fuera un estado). Se basa en el **ancla más reciente** registrada en el periodo para esa sub-dimensión (el último score de `report_on_court`/`report_character` dentro del rango del plan) — ese valor debe quedar **destacado/resaltado visualmente** en la vista de cierre, junto con la progresión completa de los scores mensuales (`monthlyScoresForFoco` ya trae esto), porque es lo último que el coach observó del atleta en esa dimensión antes de escribir el cierre narrativo. Si el plan se cierra antes de tiempo (`closingEarly`), se usa el ancla más reciente disponible para el highlight — si no hay ninguna, no bloquea.
   - El placeholder del `final_assessment` cambia según el estado elegido — ej. si el coach elige "Parcial", el placeholder pasa a algo como *"Describe por qué el objetivo se logró parcialmente"*.
2. **Decisión de carryover** — `continúa` (sí) / `depriorizado` (no), independiente del estado. Si es `depriorizado`, el foco **no** aparece como candidato en el draft del siguiente plan. Si es `continúa`, **sí** debe aparecer siempre como candidato en el paso 3 del wizard siguiente — corrige el bug de 16.2.
   - Un foco puede ser **Parcial + Continúa** a la vez (el caso que motivó esto), o **Logrado + Depriorizado** (ya no hace falta seguirle dando seguimiento dedicado), etc. — las dos decisiones son ortogonales.
   - Implicación para el scoping de notas de voz (todavía sin hacer): cuando un foco llega por carryover al periodo siguiente, y además hay notas de voz nuevas sobre esa misma sub-dimensión, el coach va a tener que elegir qué priorizar entre el carryover y lo nuevo — anotado como requisito para ese scoping, no se resuelve aquí.

**Implicación técnica (para cuando se construya, no construido todavía):**
- Migración: reemplazar el CHECK de 4 valores por `outcome` de 3 valores (`logrado`/`parcial`/`fallido`) + columna nueva `carryover boolean` (nullable). `deprioritized_at` se reinterpreta como "cuándo se decidió no dar carryover" en vez de depender de un valor de `outcome`.
- UI (`PlanesCoach.jsx`, vista `closing`): dos controles por foco en vez de 4 chips — 3 chips de estado + un toggle de carryover. Agregar el highlight del ancla más reciente + progresión de `monthlyScores`.
- `preselectFocos`/`handleIdentify`: dejar de depender de que el sub_dimension reaparezca en `identified` — inyectar directo desde `priorBundle.prior_focos` los que tengan `carryover === true` (fix de 16.2, mismo cambio).
- `buildPriorBundle`: mismo shape de `prior_focos`, cambia qué significa `outcome` (ahora 3 valores) y agrega `carryover`.
- `MiPlan.jsx` `OUTCOME_LABELS`: actualizar a los 3 estados nuevos — `continúa`/`depriorizado` deja de ser un chip de "outcome" visible al atleta (es metadata de decisión del coach, no un resultado del objetivo).

**Construido (15 Jul 2026, misma sesión).** Migración `split_outcome_state_and_carryover`: `outcome` CHECK a 3 valores (`logrado`/`parcial`/`fallido`), columna nueva `carryover boolean`. Backfill de datos existentes (todo dummy/test todavía, sin coaches reales usando el flujo): `continua` → `carryover=true` + `outcome=null`; `deprioritized` → `carryover=false` + `outcome=null` (conserva `deprioritized_at`); `logrado`/`parcial` se quedaron igual, `carryover` sin decidir (`null`). `docs/db-schema.md` actualizado.

`PlanesCoach.jsx` vista `closing`: dos bloques de chips por foco — "Estado" (`ESTADO_OPTIONS`, 3 valores) y "¿Sigue el siguiente trimestre?" (`CARRYOVER_OPTIONS`, continúa/depriorizado) — independientes, un foco puede tener cualquier combinación. El ancla que corresponde al score mensual más reciente se resalta visualmente en `AnchorList` (borde + fondo azul + negrita) — nuevo prop `highlightKey`. Placeholder de `final_assessment` cambia según el estado elegido (`ESTADO_PLACEHOLDER`). Scores del trimestre pasaron de texto plano a badges (§16.9, hecho junto con esto), con el más reciente marcado con borde. El detail de un plan `completed` también muestra ambos badges (estado + carryover) por foco.

Fix del bug de §16.2: `handleIdentify` ahora arma `carryoverSubs` desde `priorBundle.prior_focos.filter(f => f.carryover === true)` (antes leía `f.outcome === 'continua'`, que ya no existe) y **además** inyecta directo a la lista de candidatas cualquier foco con carryover que el modelo no haya vuelto a identificar en el dump nuevo — ya no depende de que el coach lo mencione de nuevo. `preselectFocos`/`buildPriorBundle` actualizados al nuevo shape (`outcome` + `carryover` como campos separados). `MiPlan.jsx`: `OUTCOME_LABELS` a los 3 estados nuevos — carryover ya no se le muestra al atleta como si fuera un resultado del objetivo.

`npm run lint && npm test` limpio (112 tests, 2 nuevos en `buildPriorBundle` para el shape de `carryover`). **Pendiente de que Marco lo pruebe en vivo** con los datos de Test Athlete antes de dar el task por Done — mismo criterio que el resto de este documento.

### 16.3.1 Bugs encontrados en la segunda revisión (15 Jul 2026) — corregidos

Marco probó cerrando el plan del atleta "Marco Damian" (jul–oct 2026, distinto de Test Athlete). 4 hallazgos:

1. **Highlight del ancla no se veía.** Investigado contra datos reales: este atleta tiene **cero reportes mensuales** en Supabase (`reports` vacío para su `athlete_id`) — el plan apenas empezó el 10 Jul. No es un bug de `highlightKey`/`toAnchorKey` — es la ausencia total de datos, comportamiento esperado dado que no hay scores que resaltar. El bug real era otro: el bloque entero de scores desaparecía en silencio cuando no había datos, indistinguible de "esto está roto".
2. **Placeholder no cambiaba en "Logrado".** Sí era un bug real — le había dado a `logrado` el mismo texto genérico que el fallback por defecto, así que visualmente parecía no funcionar. Corregido: placeholder propio ("Describe qué hizo que el objetivo se lograra…").
3. **Badges de scores "no visibles".** Mismo origen que el punto 1 — cero reportes para ese atleta, el bloque no renderizaba nada en vez de decir explícitamente que no hay datos.
4. **Warning "Revisa este objetivo antes de guardar: 1+2+3."** — bug real de parseo. `objetivo_motivo` (modo `validate`) se supone que el modelo lo devuelve separado por coma ("1, 3"), pero a veces usa "+" u otro separador; `formatObjetivoMotivo` solo hacía `split(',')`, así que "1+2+3" nunca se partía y se mostraba crudo. Corregido: ahora extrae los dígitos con regex (`match(/\d+/g)`), robusto a cualquier separador que use el modelo — no depende de que el prompt sea perfecto.

**Fix aplicado (mismo commit que el redesign de outcome, ver git log):** placeholder de "Logrado" corregido; bloque de scores/anclas ahora siempre muestra algo — badges si hay datos, o "Sin scores registrados este trimestre todavía" si no los hay; `formatObjetivoMotivo` robusto a separador. `npm run lint && npm test` limpio.

**Nota para la próxima corrida en vivo:** probar de nuevo con un atleta que sí tenga reportes mensuales dentro del periodo del plan (Test Athlete) para confirmar visualmente que el highlight y los badges sí aparecen cuando hay datos — con "Marco Damian" (cero reportes) no se puede verificar esa parte, solo el fallback.

### 16.4 Abierto — ciclo de vida de fechas del plan (no resuelto, necesita su propia sesión de scoping)

Hoy: al confirmar el cierre, el draft del periodo siguiente se crea con `period_start` = primer día del mes siguiente (elegido a mano en el paso 1 del wizard — esto era manual porque la lógica de carryover/`prior_bundle` todavía no existía cuando se diseñó ese paso).

Propuesta de Marco: separar tres fechas en vez de asumir que el cierre y el inicio del siguiente plan son el mismo evento:
1. `closed_at` — cuándo se cerró formalmente el periodo anterior (ya existe).
2. Fecha en la que empieza el **borrador** del periodo siguiente (hoy implícita, no se guarda aparte).
3. Fecha de **publicación** del plan siguiente — cuando el coach efectivamente confirma/guarda el plan (`handleSavePlan`). Esta sería la que debería fijar el `period_start` real (y por lo tanto `period_end`, hoy siempre `period_start + 3 meses - 1 día`), no una fecha elegida a mano en el paso 1. Mientras el coach escribe el draft, se mostraría un periodo de 3 meses "proyectado" tentativo, pero el periodo real se fija hasta publicar — así los planes sí duran 3 meses de uso real, en vez de 3 meses contados desde que se creó el draft (que puede quedarse sin publicar días o semanas).

**No construido, no scopeado a detalle todavía** — toca `startPlanCreation`, `periodEndFor`, el paso 1 del wizard, y probablemente separar `draft_created_at` de `period_start` en el schema. Necesita su propia sesión de scoping antes de tocar código — se anota aquí para no perderse, no se resuelve en esta sesión.

### 16.5 Hecho ahora — fixes de copy/UI triviales (sin ambigüedad, aplicados directo)

- `RUBRICA_OBJETIVOS_LABELS[1]` (`PlanesCoach.jsx`): "parece calco del diagnóstico" → "parece copia directa del diagnóstico" (se lee más claro).
- Aviso "Revisa este objetivo antes de guardar…" (paso 4, `FocoCard`) y el aviso "Mencionaste esto pero no hay un área de mejora concreta…" (paso 3, `FocoGroup`): ambos estaban en texto plano ámbar, poco visibles — ahora van dentro de una caja `hairline` con fondo ámbar (`rgba(234,179,8,.08)`), mismo patrón ya usado en el aviso de "cierre anticipado" y el de "focos sin resultado" de la vista de cierre.

### 16.6 Resuelto — mantenimiento se queda como está

Decisión de Marco (15 Jul 2026): mantenimiento **no** pasa a tener outcome. Se queda deliberadamente ligero — solo el chip de nombre, sin fricción de cierre. Si algo de mantenimiento se vuelve relevante, la vía es subirlo a foco en el plan del siguiente trimestre, no capturar su cierre in situ. No requiere cambios de código — es el comportamiento actual (§16.1), confirmado a propósito.

### 16.7 Pendiente de scopear — botones "mejorar" por objetivo en vez de un solo box de feedback

Observación de Marco tras ver que un feedback genérico en el box único de regeneración ("¿Algo no cuadra?", paso 4) volvió **todos** los objetivos vagos de nuevo, no solo el que quería corregir. Idea: en vez de un textarea único que regenera todo el plan, cada objetivo (y cada observación identificada en el paso 3) tendría un botón "Mejorar" que abre un mini-input local — mismo patrón que los comentarios de IA en Google Docs (seleccionas/haces click en el bloque específico, dices qué cambiar de eso puntualmente). Esto también resuelve el pedido puntual: **quitar la caja fija "¿Algo no cuadra?"** del fondo del paso 4 (manteniendo la regla de que hace falta un comentario para poder regenerar), y en su lugar poner una caja de instrucciones corta justo debajo de la barra de progreso (`StepBar`), antes de la lista de dimensiones, explicando que cada objetivo se puede afinar individualmente.

**No construido — es un cambio de interacción no trivial** (probablemente necesita que `regenerate` acepte feedback por-objetivo en vez de un solo string global, tocando el contrato de la edge function). Requiere su propio scoping antes de construir, se anota aquí para no perderse.

### 16.8 Bug de prompt, verificado contra datos reales — táctica se filtra al eje de carácter

Hipótesis inicial (antes de verificar): técnica y carácter comparten plantilla de anclas en el prompt. **Falsa** — verificado contra el prompt real (`supabase/functions/generate-quarterly-plan/index.ts` línea ~189-193): ya existen dos ejes separados y correctos:
- **técnica/táctica → TRANSFERENCIA**: `-2 sin avance · -1 solo en drill aislado · 0 consistente en drill controlado, empieza a aparecer en punto · +1 consistente en sparring/sets · +2 lo sostiene en partido bajo presión`.
- **carácter → FRECUENCIA**: `-2 sin cambio · -1 solo con recordatorio del coach · 0 consistente en entrenamiento · +1 consistente en partido sin recordatorio · +2 lo sostiene en torneo y lo modela para otros`.

Verificado contra `quarterly_plan_objectives.anchors` reales en Supabase (no solo el prompt): **el eje sí está bien diseñado, pero el modelo no lo respeta de forma consistente para táctica.** `backhand` (técnica) usa correctamente TRANSFERENCIA en las 4 veces que se generó. Pero varios focos de **táctica** (`seleccion_golpe`, `manejo_riesgo`, y una versión de `puntos_clave`) se generaron con el vocabulario de FRECUENCIA prestado de carácter — literalmente "consistente en entrenamiento" / "sostiene en torneo y lo modela para otros" — mientras otros focos de táctica generados en la misma sesión (`transferencia_partido`, `puntos_clave` en otra corrida, `serve` técnica) sí usaron TRANSFERENCIA correctamente. Es decir: **no es un problema de diseño de plantilla, es inconsistencia del modelo aplicando la instrucción** — un problema de adherencia al prompt, no de arquitectura del prompt.

**Fix propuesto (pendiente de aprobación de Marco antes de deployar):** agregar una regla explícita anti-mezcla justo después del bloque "EJES DE LAS ANCLAS" en el prompt: *"REGLA ANTI-MEZCLA DE EJES (estricta): las anclas de técnica y táctica NUNCA deben usar vocabulario del eje de carácter ('entrenamiento', 'sin recordatorio', 'torneo', 'lo modela para otros'). Usa siempre drill → sparring/sets → partido bajo presión."* Es un cambio de prompt (Tier B — no determinista), así que antes de deployar hace falta generar 3-4 ejemplos con el prompt ajustado y que Marco los revise, en vez de confiar en un solo caso.

### 16.9 UI — scores del trimestre en badges en vez de texto plano — construido

Confirmado por Marco: el formato actual (`"Scores del trimestre: Estancado · Rezagado · Superado"`, texto plano) pasa a badges — mismo lenguaje visual que ya usan `OUTCOME_OPTIONS`/`UrgenciaChip` en el resto del archivo. Construido junto con el redesign de outcome/carryover de §16.3 (ver ese build) — esta nota quedó desactualizada ("no construido todavía") hasta la corrección del 2026-07-18, verificada contra `PlanesCoach.jsx` líneas 1170-1197.

### 16.10 Mobile-first — no está gateado en `feature-build-flow`

Marco preguntó si el skill `feature-build-flow` ya obliga a revisar mobile-first al construir. Verificado: **no** — el paso 5 (Componente React) solo dice "sigue los tokens y patrones de diseño ya establecidos... considera si aplica una revisión con los skills del plugin `design`" — no menciona explícitamente viewport móvil, aunque el task "Mobile first en todo el portal" ya se cerró como Done en esta sesión. Sin un check explícito, features nuevas (como este flujo de cierre) pueden salir sin auditar mobile por default. `feature-build-flow` es un skill de solo-lectura en este entorno (no editable desde aquí) — si Marco quiere que quede gateado, la opción es (a) agregar una línea a `CLAUDE.md` bajo las reglas de testing/build, que sí es editable desde este proyecto, o (b) que Marco edite el skill directamente desde Settings → Capabilities. Pendiente de que Marco decida cuál prefiere.
