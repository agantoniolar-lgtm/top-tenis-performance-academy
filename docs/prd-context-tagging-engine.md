# PRD — Context & Tagging Engine (cimiento de RAG para el sistema de IA)

- **Task:** T174
- **Autor:** Marco + Claude
- **Creado:** 2026-07-24
- **Estado:** borrador vivo — **review-later, no bloqueante**. Se construye por capas; este doc es el norte, no un contrato cerrado. Prueba y error explícito (decisión de Marco, 24 Jul 2026).
- **Relación:** deriva de `docs/prd-notas-voz-contexto-atleta.md` (T148) — el servicio de notas es el **primer productor** de datos para este engine. Referencia de patrón: `docs/uploads/tagging-system.md` (sistema de tagging de m-brain). Consumidor futuro: `generate-quarterly-plan` (`buildPriorBundle` / `body.prior_bundle`).

---

## 0. Por qué este PRD existe (y por qué separado de T148)

T148 captura notas de coach (texto/voz) por atleta y las cura en un bundle para alimentar un plan. Eso es un **servicio de notas**. Este PRD es otra cosa y de otra altitud: la **capa de contexto transversal** — el vocabulario cerrado, el índice de recuperación, y (a futuro) el auto-tagging y el RAG — que va a sobrevivir a T148 y servir a **todo** el sistema de IA del producto, no solo a los planes trimestrales.

La distinción operativa que justifica el split:
- **T148 fase 3 es enviable hoy sin LLM** (tagging + agrupación manual). No debe quedar rehén de la infraestructura de este engine.
- El **auto-tagging de este engine es una feature LLM** gated por **T150** (convención de evals), igual que T148 fase 4.
- El **vocabulario** afecta a reportes y planes, no solo a notas — es una decisión de arquitectura de información, no de una pantalla.

**Insight rector:** *el tagging system ES el context engineering.* La calidad del contexto que le demos al modelo mañana está acotada por qué tan buena sea la taxonomía que diseñemos hoy. Por eso el corpus se construye **manual primero** (coach como ground truth) — no es un atajo, es el cimiento.

## 1. Principio: manual primero, LLM después (y por qué resuelve el gate T150)

En m-brain el tagging es 100% LLM desde el día 1. Aquí lo **invertimos a propósito**:

1. **Hoy (fase 3 de T148, sin LLM):** el coach asigna tags de un **vocabulario cerrado** a mano, vía UI. Es determinista → **no toca `verify-evals`**, no depende de T150, se envía a producción ya.
2. **Los tags manuales se acumulan como corpus etiquetado.** Ese corpus es, simultáneamente:
   - **(a) el eval dataset de T150** — ground truth contra el cual se evaluará el auto-tagger LLM cuando exista.
   - **(b) el índice de recuperación** — el RAG v0 es *filtrar notas por tag* (recuperación estructurada), sin embeddings.
3. **Después (gated por T150):** un auto-tagger LLM sugiere tags (patrón juez de m-brain), y el coach corrige. La corrección sigue alimentando el corpus. Embeddings/búsqueda semántica se agregan **solo si** los filtros estructurados dejan de alcanzar.

Esto es literalmente poner los cimientos ladrillo por ladrillo: cada nota que un coach tagea a mano hoy hace más medible y más recuperable el sistema de mañana.

## 2. Aclaración sobre RAG (para calibrar expectativas)

RAG no es sinónimo de "búsqueda por embeddings". Es un espectro de estrategias de recuperación. **A nuestro volumen (10 atletas, decenas de notas por atleta por trimestre) el problema de recuperación es chico:**

- **Recuperación estructurada** (filtrar por `athlete_id` + `segment` + `dimension`/`sub_dimension` + rango de fechas) resuelve el ~90% de los casos. Es determinista, barata, auditable, y **los tags SON ese índice**.
- **Embeddings / búsqueda semántica** (pgvector sobre Supabase — ya estamos ahí) valen la pena solo cuando el filtro estructurado no basta: p. ej. encontrar notas del *mismo problema de fondo* dichas con palabras distintas. Es una capa **posterior**, no el punto de partida.
- El riesgo real no es la calidad de recuperación, es el **mega-dump** (recuperar de más y ahogar al modelo — ya nombrado en `scope-close-quarterly-plan.md §132` y en el PRD de T148 §4). La curación + tagging es la palanca contra eso.

**Regla de secuencia:** tags primero (recuperación estructurada) → embeddings después si hacen falta. No construir pgvector especulativamente.

## 3. Modelo de tagging v0 (taxonomía facetada, vocabulario cerrado)

**Taxonomía facetada** (framing de Marco, 24 Jul 2026): cada faceta es un eje independiente con su propio vocabulario cerrado; una nota recibe valores en varias facetas a la vez. Adaptación del patrón de m-brain (categorías separadas por función, fuente única de verdad) al dominio de coaching de tenis.

### 3.1 Facetas (ejes de tag)

**Cardinalidad = cuántos valores de esa faceta puede llevar UNA nota.** Ej. `dimension: 1–3` = una nota toca al menos 1 y como mucho 3 dimensiones (normalmente 1; "le falla el revés y además se frustra" toca `tecnica` + `character`). `sub_dimension: 0–3` = de cero (habla de "lo técnico" en general) a tres. Los topes superiores son anti-ruido, no metas — **provisionales, a calibrar con el corpus real** (Marco, 24 Jul: no hay info suficiente para fijarlos ahora).

**Nivel nota:**

| Faceta | Qué captura | Cardinalidad | Fuente / valores | Estado |
|---|---|---|---|---|
| `segment` (contexto) | dónde se capturó | 1 (obligatorio) | `tournament` \| `training` \| `general` | **Ya existe** en `athlete_notes` (T148 fase 1). |
| `dimension` | qué área de desempeño toca | 1–3, **rankeadas** (la 1ª es la principal) | `tecnica` \| `tactica` \| `physical` \| `character` | **Reusa la taxonomía canónica del plan** (`SUB_DIMENSIONS`). |
| `sub_dimension` | precisión dentro de la dimensión | 0–3, jerárquica (bajo su `dimension` padre) | las **21 keys canónicas** (ver §3.3) | Nullable: puede tocar una dimensión sin sub precisable. |
| `note_type` | qué clase de nota/acto es | 1–2 | vocabulario cerrado (ver §3.4) | **Definido v0** (Marco, 24 Jul). Reemplaza a la faceta `valence` descartada — ver §3.5. |

**`valence` descartada** (Marco, 24 Jul): terminaría siendo nullable (no todo es fortaleza/debilidad) y se traslapaba con `note_type` sin una definición clara que todos entiendan. La polaridad fortaleza/debilidad se captura vía `note_type` (failure/setback vs progreso/hito) y, como **tendencia**, en la capa derivada (§11).

**Nivel atleta** (no es tag de nota — atributo del atleta, para el juego largo §11):

| Faceta | Qué captura | Cardinalidad | Fuente / valores | Estado |
|---|---|---|---|---|
| `player_archetype` | tipo de jugador | 1 (revisable) | lista cerrada sugerida (ver §3.7); los valores no usados se quedan disponibles mientras se taggea a mano | **Nueva** — captura a mano = *muestra etiquetada por el coach* (ver §11), no la clasificación autoritativa. |

- **`dimension` es el eje que conecta con el plan.** Un tag de dimensión/sub-dimensión hace que una nota sea recuperable *exactamente* como el plan razona sus focos → el bundle curado alimenta focos directo, sin traducción.
- **`sub_dimension` siempre pertenece a su `dimension`** (jerárquico, decisión de Marco 24 Jul): un `sub_dimension` solo es válido si está en `SUB_DIMENSIONS[dimension]`. Se valida, no se confía.

### 3.2 Fuente única de verdad (principio #1 de m-brain)

**El problema:** hoy la taxonomía de 21 sub-dimensiones (`SUB_DIMENSIONS`) está **escrita dentro** de la Edge Function `generate-quarterly-plan/index.ts`, y una parte está **copiada a mano otra vez** en `athletics.js` (`STROKE_KEYS`, `TACTIC_KEYS`, `*_LABELS`). Dos copias de la misma lista = el riesgo clásico que m-brain evita: se desincronizan (alguien agrega una sub-dimensión en un lado y no en el otro).

**"Módulo compartido"** = un **solo archivo** que exporta la lista **una vez**, del que importan todos los que la necesitan: (a) la UI de tagging, (b) la validación, (c) el prompt del plan. Un solo lugar donde editarla.

**Decisión (Marco, 24 Jul):** la fuente única vive **del lado back**, y el front la **importa en tiempo de build (no fetch en runtime)**. Concretamente:
- Autora la taxonomía **una sola vez** en `supabase/functions/_shared/taxonomy.ts`, como **datos planos** (`export const SUB_DIMENSIONS = {...}`, sin ninguna API de Deno adentro). `_shared` es la convención **soportada por Supabase** para código compartido entre Edge Functions (hoy no existe `_shared`; se crea aquí).
- La Edge Function importa `../_shared/taxonomy.ts`.
- El front (Vite) importa el mismo archivo por ruta relativa, reexportado limpio a través de `athletics.js` o un `src/lib/taxonomy.js`. Vite importa cualquier archivo dentro del repo, y un `.ts` de datos planos lo maneja nativo.
- **Cero duplicación, cero sincronización, cero drift.**

**Por qué import de build y no fetch en runtime:** la UI de tagging necesita la lista *sincrónicamente para renderizar* los chips/dropdowns. Un fetch por red para una lista estática que nunca cambia en runtime sería más lento y frágil; el import la mete al bundle sin red.

**Plan B** (si el front alcanzando dentro de `supabase/` da fricción real en el build): un solo archivo autoral + un **test guard en CI** que falla si la copia del front y la del back difieren — mismo estilo de enforcement que las guardas de migraciones/gitleaks. Pero el single-source real no tiene nada que sincronizar, así que se prefiere.

### 3.3 Taxonomía canónica (`dimension` → `sub_dimension`) — reusada tal cual

```
tecnica:   serve, forehand, backhand, volea, devolucion, footwork
tactica:   seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, transferencia_partido
physical:  velocidad_2377m, agilidad_5_lineas_seg, abdominales_30s, salto_vertical_cm,
           lanzamiento_balon_mts, flexibilidad_banco_pass, tiempo_1km_seg
character: etica_trabajo, coachabilidad, liderazgo
```

(21 sub-dimensiones. Los labels legibles ya existen en el código; ver `SUB_DIMENSIONS`.)

### 3.4 `note_type` v0 (definido con Marco, 24 Jul)

Modela el **arco de trabajo sobre algo**: se observa/detecta un problema → se decide qué hacer → se avanza → se consigue. Cardinalidad 1–2, la 1ª es la principal.

**El flujo:** `observación`/`problema` → `intención` → `progreso` → `hito`

| valor | qué es | criterio de decisión | análogo m-brain |
|---|---|---|---|
| `observacion` | describe algo que se vio, neutral | ¿descripción sin juicio de bueno/malo? | `event` |
| `failure` | algo salió mal **por agencia del atleta** (ejecutó/decidió mal) | ¿la falla fue suya? | `failure` |
| `setback` | algo salió mal **por causa externa** (no fue su culpa) — **incluye lesión** | ¿el revés vino de afuera? | `setback` |
| `intencion` | compromiso/plan hacia adelante ("vamos a trabajar X") | ¿es una dirección elegida, aún sin ejecutar? | `intention` |
| `progreso` | avance observable hacia el objetivo, aún sin conseguirlo (el intermedio entre `intencion` y `hito`) | ¿algo se movió a mejor, pero todavía no es el resultado final? | (escalón intermedio) |
| `hito` | el resultado se consiguió | ¿se logró de verdad, con agencia del atleta? | `win`/`breakthrough` |

**Notas de diseño (Marco, 24 Jul):**
- **`problema` se dividió en `failure` vs `setback`** — una lesión es un `setback`, no un `failure` (agencia externa vs propia, la grilla de m-brain). La distinción importa para no atribuirle al atleta lo que no controló.
- **`accion` se renombró a `intencion`** — es un compromiso hacia adelante, no un acto ya ejecutado.
- **`progreso` es el intermedio** entre `intencion` (decidir) y `hito` (conseguir) — captura el "va avanzando".
- **Salud = estado default, no se taggea. Lesión = `setback`.** No hay faceta de salud (descartada, §3.1).
- **`confidence`/severidad — DIFERIDO** (Marco: buena idea, pero aún no está claro dónde meterlo). No entra en v0; se retoma con uso real. Ver §13.

### 3.5 Nota vs tendencia (distinción crítica)

**Una nota suelta ≠ una debilidad.** Una nota con `note_type=failure` ("hoy falló el revés bajo presión") es *una observación puntual*, no una debilidad del atleta. Una **debilidad/fortaleza es una tendencia agregada** a través de muchas notas y periodos — ej. (Marco, 24 Jul): si a lo largo de varios periodos se ve que "le cuesta el segundo saque en partidos", **eso** ya cuenta como tendencia de debilidad. Consecuencia de diseño:
- **La "tendencia/patrón" es una capa DERIVADA a nivel atleta** (§11), computada de la recurrencia de `note_type` (failure/setback repetidos sobre la misma sub-dimensión → tendencia de debilidad; progreso/hito repetidos → fortaleza) — **nunca** un tag a mano sobre una nota.
- **Se construye en el futuro, cuando ya se esté taggeando en producción** (Marco, 24 Jul) — hace falta acumular notas a lo largo del tiempo para que un patrón sea real. No es parte del v0.
- Las queries tipo "player + weaknesses" (§9) consultan esa capa derivada, no las notas crudas — si consultaran las crudas, recuperarían cada error momentáneo y reintroducirían el mega-dump.

### 3.6 Reglas y conflictos v0 (patrón m-brain §4–5) — PROVISIONALES

**Marco (24 Jul): las reglas y conflictos hay que observarlos y calibrarlos con el tiempo — no hay info suficiente para fijarlos ahora.** Lo de abajo es un punto de partida, no un contrato:

- **Jerarquía:** `sub_dimension` ∈ `SUB_DIMENSIONS[dimension]`, siempre. (Esta sí es dura — es integridad referencial, no calibración.)
- **Exclusión (provisional):** `failure`/`setback` y `hito` sobre la misma sub-dimensión probablemente no coexisten en una nota — observar.
- **Topes (provisionales):** máx 3 dimensiones, 3 sub-dimensiones, 2 `note_type` por nota — ajustar con el corpus.
- **Revisar la taxonomía cuando una categoría domine el corpus** (lección `deep_thought` de m-brain): si el 90% de las notas caen en un solo valor, no discrimina — se parte o se colapsa. Medir con el corpus manual.

### 3.7 `player_archetype` — lista cerrada sugerida (a validar con coaches)

Punto de partida; los valores no usados se quedan disponibles mientras se taggea a mano (Marco, 24 Jul):

- `aggressive_baseliner` — domina desde el fondo con golpes potentes.
- `counterpuncher` — defensivo, consistente, hace fallar al rival.
- `all_court` — cómodo en fondo y red, versátil.
- `serve_and_volley` — sube a la red tras el saque.
- `big_server` — el saque es el arma dominante.
- `sin_definir` — default hasta que el coach tenga lectura clara.

Vocabulario cerrado, editable con coaches. Recordar (§11): es la **lectura del coach**, hipótesis para contrastar contra la inferencia futura, no la clasificación final.

## 4. Modelo de datos — **tabla nueva `note_tags`** (decidido, Marco 24 Jul)

**Decisión: tabla normalizada, no arrays en `athlete_notes`.** Razón de Marco: así los tags quedan **aislados** y no hay corrupción de la tabla de notas ni de sus datos. Es además el patrón `entry_tags` de m-brain.

Tabla `note_tags` (propuesta, se cierra en el `design` del build):
- `note_id` FK → `athlete_notes`
- `category` — `dimension` \| `sub_dimension` \| `note_type`
- `value` — el key del vocabulario cerrado (validado contra la fuente única §3.2)
- `rank` (int) — para el orden rankeado (ej. dimensión principal = 1)
- `source` — `manual` \| `llm` (distingue tag humano de sugerido; **clave para el corpus de evals**)
- (`confidence` numeric nullable — reservado, diferido §3.4)

`player_archetype` NO va aquí — es atributo a nivel atleta, va en `athletes` (o tabla propia), no es tag de nota.

**RLS:** hereda del modelo de `athlete_notes` (cross-coach lectura, autor edita) — se verifica con `verify-rls` en sandbox antes de construir la UI (regla del proyecto: capa de datos verificada primero).

## 5. Auto-tagging (fase futura) — GATED por T150

Cuando el corpus manual sea suficiente, el auto-tagger LLM sugiere tags. Patrón trasladado de m-brain, **completo**:

- **Vocabulario cerrado renderizado literalmente** en el prompt desde la fuente única (§3.2).
- **Definir por criterio de decisión + pares BAD/GOOD** por valor (especialmente vecinos confundibles: `failure` vs `setback`, `progreso` vs `hito`, `observacion` vs `failure`).
- **Conflictos explícitos** (lista aparte) + **juez barato y acotado** (segunda llamada, modelo más barato, solo elige entre finalistas) + **fallback determinista que nunca bloquea el pipeline**.
- **Parseo defensivo** (todo output de modelo es no confiable hasta pasar el validador contra el set válido).
- **Log JSONL de auditoría** de cada decisión de juez, separado del schema.
- **El corpus manual es el eval dataset.** `source='manual'` vs `source='llm'` permite medir acuerdo (accuracy/precision/recall por categoría) — ESE es el eval de T150 para esta feature.

**Umbral de "corpus suficiente" = 50 notas tagged a mano** (Marco, 24 Jul) — para darle tiempo a revisar las notas manuales antes de arrancar el auto-tagger. Provisional, ajustable con lo que se observe.

**No se construye nada de §5 sin cerrar T150 primero** (dónde viven los evals, formato del dataset, grader). Es la instrucción de CLAUDE.md; aquí queda anclada.

## 6. Cómo esto alimenta el plan (relación con T148 fase 4)

1. Coach captura notas (T148 f1/f2) → notas tagged a mano (T148 f3 + este engine).
2. Recuperación estructurada por tags → subconjunto relevante por atleta/periodo/dimensión.
3. Curación manual (T148 f3) → bundle curado, antídoto al mega-dump.
4. `buildPriorBundle` / `body.prior_bundle` se expande para incorporarlo (T148 f4, gated por T150).
5. (Futuro) auto-tagging + resumen asistido + embeddings si hacen falta.

## 7. Almacenamiento y recuperación (recomendación)

**Cada nota se guarda como una fila de tabla con columnas de verdad** (`athlete_id`, `segment`, `tournament_id`, `created_at`, …) — **no** apelmazada en un solo campo de texto JSON. Junto con la tabla `note_tags` (§4), eso te da la capacidad de hacer `WHERE athlete + periodo + tag` con SQL y sacar exactamente las notas que quieres. **Esa capacidad de consulta ES lo que llamamos "índice de recuperación"**: lo que consultas para *encontrar* las notas relevantes. (Un vector DB sería otro tipo de índice — por similitud semántica; ver abajo.)

El "JSON" aparece solo **al final**, como el **formato del payload** que le pasas al prompt una vez que ya recuperaste y armaste el contexto (§9) — es una serialización de salida, **no** cómo se almacena. Invertir esto (guardar la nota como JSON opaco) haría dolorosas justo las queries que queremos: un filtro por atleta/periodo/tag es trivial sobre columnas, penoso sobre JSON.

**Vector DB (pgvector en Supabase) — sí, pero diferido.** Supabase basta (sin vendor nuevo, RLS reusada, una sola DB). Es la capa de *cuando el filtro estructurado no alcanza* (buscar el mismo problema dicho con otras palabras). Se agrega como columna `embedding vector` sobre la fila (o tabla `note_embeddings`), **no** como store paralelo. **No se construye todavía** — ver §2: la recuperación estructurada por tags cubre el caso actual, y las queries de §9 no necesitan embeddings.

## 8. Document chunking — DIFERIDO (hoy prematuro)

Las notas de voz de coach son cortas (unas frases): **la nota YA es el chunk.** Partir una nota de 3 frases no gana nada y agrega superficie de fallo. Además el tagging ya da estructura sub-nota implícita (una nota con 3 dimensiones es candidata a split futuro) → chunking es un **refinamiento del tagging**, no infra aparte. **Disparador para revisitarlo:** aparecen notas largas (debriefs de torneo) o hace falta recuperar un span específico dentro de una nota multi-dimensión. No antes.

## 9. Ensamblado de contexto multi-part (consumidor aguas abajo)

Idea de Marco (24 Jul): en vez de un dump único, el contexto de un plan se arma con **N queries dirigidas**, cada una acotada y etiquetada, truncadas por periodo (trimestre/mes):

- `baseline` (identidad + arquetipo + scores actuales)
- `player + strengths` (tendencias de fortaleza — capa derivada §11: recurrencia de `progreso`/`hito`)
- `player + weaknesses` (tendencias de debilidad — recurrencia de `failure`/`setback`)
- `player + resultados tácticos` (dimensión `tactica`, outcomes)
- … cada una un slice acotado, no el corpus entero.

Es el **antídoto al mega-dump hecho concreto**: recuperación acotada y estructurada compuesta en un prompt multi-part. **Todas estas queries son SQL puro sobre filas + tags — cero embeddings** (refuerza §7). La recuperación/composición es **determinista y testeable** (no-LLM); solo el paso final de generación del plan es LLM (gated por evals, T150). Es un **consumidor de este engine, no parte de su build** — merece su propio task cuando el corpus tagged exista.

## 10. Alcance del engine (dónde para)

El **endpoint de ESTE engine** es: *datos estructurados + tagged + recuperables*. Explícitamente **fuera de alcance** (consumidores aguas abajo, cada uno su propio task/PRD futuro):
- El ensamblado multi-part de prompts (§9).
- La inferencia de outcomes / arquetipos (§11).
- Construirlos aquí rompería el "ladrillo por ladrillo".

## 11. El juego largo: outcome linkage + arquetipos (roadmap, con honestidad estadística)

Objetivo de Marco: ligar planes → dimensiones → objetivos → **resultados obtenidos**, y con el tiempo inferir qué sirve para qué tipo de atleta (ej. "para counterpunchers, planes de endurance sirven más que lo técnico").

**Honestidad estadística (importante):** con 10 atletas, N es *demasiado chico* para inferir eso por mucho tiempo, y la atribución causal de outcomes tiene muchos confounders. Trátese como **generación de hipótesis, no prueba** (mismo espíritu que T130 / determinismo). No se sobre-confía en señales tempranas.

**Sobre `player_archetype` — el arquetipo "real" debe emerger de la inferencia, no imponerse a mano** (Marco, 24 Jul). Pero capturar el arquetipo *que el coach percibe* desde ya tiene valor: cuando llegue la inferencia, tendremos una **muestra de ground truth de lo que los coaches dicen sobre sus jugadores** para contrastar (¿la data coincide con la lectura del coach, o la contradice?). O sea: la captura manual es una **hipótesis etiquetada**, no la verdad — y su valor es servir de comparación, no de clasificación final.

**Lo accionable HOY no es la inferencia — es que el schema PUEDA responderla después:**
- `player_archetype` a nivel atleta (§3.1), capturado a mano desde ya como la lectura del coach (arriba) — sin esto, la data futura no se puede segmentar por tipo de jugador ni contrastar contra la percepción del coach.
- Ligadura objetivo→outcome limpia — ya existe parcialmente (`quarterly_plan_objectives.outcome`, `focosSinOutcome` en `athletics.js`; scores en `report_*` en el tiempo). Auditar que quede consultable por dimensión + arquetipo + periodo.
- Con eso, la inferencia algún día es **solo una query** — no se construye la inferencia, se construye el schema que la vuelve una query futura.

## 12. Estado / próximos pasos

- **Hoy (24 Jul 2026):** este PRD + vocabulario v0 (§3). Sin build.
- **Próxima sesión:** `scope` + `design` del slice manual de fase 3 (T148) — UI de asignación de tags (chips/dropdowns del vocabulario cerrado), tabla `note_tags` (§4) + `verify-rls`, consolidación de `SUB_DIMENSIONS` a módulo compartido (§3.2), agrupación manual.
- **Bloqueado por T150:** todo §5 (auto-tagging). No arranca sin la convención de evals.
- **Dependencia Team:** validar con coaches el vocabulario de `note_type` (§3.4) y de `player_archetype` (§3.7) — Marco lidera.

## 13. Preguntas abiertas

1. `confidence`/severidad — buena idea pero **dónde meterlo aún no está claro** (Marco). Diferido; retomar con uso real (§3.4).
2. `player_archetype` — validar la lista sugerida (§3.7) con coaches. Captura manual = hipótesis para contrastar contra inferencia, no clasificación final (§11).
3. Topes de cardinalidad y reglas de conflicto (§3.6) — provisionales, calibrar con el corpus real.
4. ¿La consolidación de `SUB_DIMENSIONS` al módulo compartido (§3.2) entra en el slice de fase 3, o es un refactor previo aparte? (decidir en el `scope` del build).

**Ya decididos (24 Jul):** `valence` descartada (§3.1) · `note_type` v0 con failure/setback/intencion/progreso/hito (§3.4) · salud=default, lesión=setback (§3.4) · modelo de datos = tabla `note_tags` (§4) · umbral de evals = 50 notas (§5) · tendencias = capa derivada futura, en producción (§3.5, §11) · **módulo compartido = `supabase/functions/_shared/taxonomy.ts`, front importa en build** (§3.2).
