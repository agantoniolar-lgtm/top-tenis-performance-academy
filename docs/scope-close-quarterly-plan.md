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
