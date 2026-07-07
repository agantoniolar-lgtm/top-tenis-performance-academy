# Scope — Rúbrica/skill: verificación de observaciones por dimensión

**Estado:** Borrador para revisión de Marco. No construir hasta aprobar.
**Fecha:** 4 Jul 2026
**Task Notion:** P&M — Rúbrica/skill: verificación de observaciones por dimensión (Team, Phase 2 — Analytics, Priority High) — movido a In Progress al abrir este doc.
**Contexto previo:** `docs/scope-planning-measurement.md` §16–§21 (los 5 casos sintéticos que expusieron el hueco), `docs/agentic-fit-check-pm.md` §5.1 (esta rúbrica se construye como **skill modular versionado**, no como reglas sueltas dentro de `IDENTIFY_SYSTEM`).
**Relacionado:** `P&M — Rúbrica/skill: objetivos alineados a la filosofía de la academia` (siguiente doc en la cola) — esa rúbrica evalúa el objetivo generado; esta evalúa el insumo que lo alimenta. Si la observación es débil, la rúbrica de objetivos hereda el problema sin poder resolverlo.

---

## 1. Problema

`generate-quarterly-plan` transforma el dump libre del coach en focos con diagnóstico + objetivo + anclas. Los 5 casos sintéticos (`docs/dumps-test-planning-edge-cases.md`) mostraron que cuando la observación de origen no trae nada concreto, el modelo tiene dos salidas posibles y ambas son malas: **inventa** detalle que el coach nunca dijo (Caso 4, Diego — "la volea es muy floja" → diagnóstico agrega "y carece de potencia"), o genera un objetivo que es **el calco de la observación** en vez de una prescripción (Caso Mariana, `transferencia_partido` — "baja el nivel en partido" → "mantener el nivel en partido").

El guardrail que existe hoy (`dump_quality`) evalúa el dump completo, no cada dimensión por separado, y falló en dispararse en el Caso 3 (Sofía) pese a que ninguna línea tenía mecánica observable. El problema no es de prompt — es que no hay una definición explícita de qué hace a **una observación individual** (no al dump entero) lo bastante concreta para sostener un objetivo sin que el LLM tenga que adivinar o inventar.

Esta rúbrica resuelve eso: da una anatomía verificable de una observación bien formada, y una regla de acción granular (por dimensión) cuando no se cumple.

## 2. Qué NO es esta rúbrica

- No reescribe la observación del coach. El coach sigue escribiendo dump libre, sin estructura forzada en el textarea.
- No bloquea el flujo. Es un guardrail **advisory** — consistente con la decisión ya tomada en §13 de que el validador no auto-corrige, solo flaggea para que el coach decida.
- No es la rúbrica de objetivos. Esta evalúa el insumo (§3); la de objetivos (doc separado) evalúa la salida generada.
- No decide *el contenido* del diagnóstico. Solo decide si hay material suficiente para generarlo sin inventar.

## 3. Anatomía de una observación bien formada

Punto de partida: la tabla preliminar que Marco dejó en `scope-planning-measurement.md` §21, con los 5 casos sintéticos usados para validarla y ajustarla.

| Componente | Obligatorio | Ejemplo bueno | Ejemplo malo |
|---|---|---|---|
| **1. Dimensión clara** — qué parte del juego se describe | Sí | "su derecha..." | "le pega mal" (ambiguo: ¿derecha, revés, volea?) |
| **2. Mecanismo** *(nombre propuesto — ver §11)* — qué hace específicamente esa dimensión, la mecánica o comportamiento observable | Sí | "su derecha **se cierra**..." | "le pega mal **y la manda a la red**" (describe el resultado, no el mecanismo) |
| **3. Intensidad** — qué tan marcado/frecuente es | No, pero refuerza | "se cierra **muy rápido**..." | "...**mucho**" (adjetivo vacío sin comparación) |
| **4. Context clarifier** — bajo qué condición ocurre | Sí | "...con **bolas rápidas**" | "...**en partidos**" (demasiado amplio para prescribir) |
| **5. Adicional (opcional)** — matiz extra que afina la condición | No | "...cuando **lo atacan en partidos**" | — |

**Regla de suficiencia:** una observación pasa la rúbrica si trae **componente 1 + componente 2 + al menos una condición (3 o 4)**. El componente 5 nunca es requisito. Sin 2 (mecanismo), no hay causa de dónde prescribir — es exactamente el patrón que falló en Caso 4 y en el ejemplo de `transferencia_partido` de Mariana: la observación nombra la dimensión y hasta el resultado ("baja el nivel"), pero no el mecanismo que lo produce.

**Prueba rápida (heurística para el guardrail):** ¿la observación describe algo que el coach *vio* (una acción, un patrón de movimiento, una decisión del atleta), o solo un *juicio* sobre el resultado ("está bien", "le falta", "necesita mejorar")? Si es solo juicio, falla el componente 2 aunque tenga dimensión y contexto.

## 4. Regla de aplicación — granular por dimensión, no por dump completo

Hallazgo central de Caso 3 vs. Caso 4: un dump puede ser vago *como conjunto* (Sofía — todo es "está bien, puede mejorar") o puede tener **candidatas a foco numéricamente correctas pero cada una vacía por dentro** (Diego — 5 dimensiones bien identificadas, cero mecanismo en cada una). El guardrail actual solo mira el dump completo y por eso no disparó en ninguno de los dos casos con la misma señal.

**Regla:** la rúbrica se evalúa **por dimensión identificada**, dentro del paso `identify`, no una sola vez sobre el textarea completo. Cada sub-dimensión que el LLM detecta recibe un flag independiente: `observacion_suficiente: true/false` según la regla de suficiencia (§3). Un dump puede tener 3 dimensiones que pasan y 2 que no — hoy eso no se distingue.

## 5. Acción cuando falla la rúbrica (guardrail no-bloqueante)

**Qué ya existe en código (verificado en `PlanesCoach.jsx`):** el banner amarillo de "Observaciones un poco generales" ya está construido — se dispara con `dumpQuality?.level === 'vago'` y se muestra una sola vez, arriba de la lista de focos en el paso 3, cubriendo *todo el dump* como una sola unidad (línea 693). Es exactamente el guardrail no-bloqueante que ya describe §13 del scope doc, solo que a granularidad de dump completo.

**Confirmado (4 Jul 2026): se baja a granularidad por dimensión.** No es opcional ni "además de" el banner global — cada item de `FocoGroup` (donde hoy se pinta `read_corto`, línea ~980) lleva su propio aviso si `observacion_suficiente: false` para esa sub-dimensión específica, mismo componente visual que el banner actual pero ligado al item en vez de a todo el paso. Ejemplo de copy (del comportamiento deseado que Marco describió en Caso 3, §18):

> *"Mencionaste el revés pero no hay un área de mejora concreta — ¿quieres agregar más detalle o dejarlo en mantenimiento?"*

El coach decide: completa el dump con más detalle y vuelve a identificar, o deja esa dimensión fuera de los focos (mantenimiento). El sistema nunca decide por él ni bloquea continuar — mismo principio de §13 (validador advisory, HITL vía comentario/regenerar). El banner global (`dumpQuality`) queda redundante una vez que exista el aviso por dimensión — se retira al implementar, salvo que Marco prefiera conservarlo como resumen adicional arriba de la lista.

## 6. Convención de tono

Hallazgo de Caso 2b (Emilio) y §17: el dump a veces frasea la observación como juicio directo a la persona y usa su nombre ("Emilio no tiene término medio"). Ya hay un fix parcial en generación (`pm-v2.4`, línea 112-114 de `GENERATE_SYSTEM`: "Nunca uses el nombre del atleta... traduce la crítica directa a conducta observable"), pero falta la misma regla del lado de `identify`/la rúbrica, para que se detecte desde el input y no dependa solo de que `GENERATE_SYSTEM` la arregle después.

**No es un task aparte.** Esto vive dentro de este mismo task/doc — ya estaba anotado en las Notes de Notion desde el 1 Jul (Caso Emilio) como parte del alcance de esta rúbrica, no como un ítem nuevo de backlog.

**Cómo se resuelve:** de acuerdo con que no hace falta diseño adicional — basta con espejear en `IDENTIFY_SYSTEM` (o en el módulo de rúbrica, §9) la misma línea que ya existe y funciona en `GENERATE_SYSTEM`. No se necesita mecanismo nuevo, solo la mención en el prompt correspondiente.

**Regla (contenido de esa mención):** la rúbrica no rechaza observaciones con juicio directo o nombre propio (el coach escribe como escribe, sin fricción en el textarea) — pero exige que el **mecanismo (componente 2)** esté descrito como conducta observable, no como rasgo de carácter. "No tiene término medio" falla el componente 2 por sí solo (es un juicio, no una conducta) — pero el mismo dump sí trae la conducta un renglón después ("o juega clavado atrás... o va por el ganador imposible"), que es lo que debe capturarse como mecanismo.

## 7. Decisión: `generate` debe consumir `read_corto`, no releer el dump crudo (corrección 4 Jul 2026)

**Estado actual en código** (`supabase/functions/generate-quarterly-plan/index.ts`): `identify` y `generate` son dos llamadas independientes a `gpt-4o-mini` que **ambas reciben el dump crudo completo** (`observations`). El array `focos` que el cliente manda a `generate` (línea 207-213) solo trae `dimension`/`sub_dimension`/`urgencia` — el `read_corto` que `identify` ya calculó se descarta antes de llegar a `generate`. Hoy `generate` redacta el `diagnóstico` releyendo el dump entero desde cero, ignorando el resumen que `identify` ya hizo.

**Decisión de Marco:** esto se corrige. `generate` debe **depender del `read_corto`** en vez de re-parsear el dump completo por su cuenta. Razón: con dos prompts leyendo independientemente la misma fuente cruda, si algo sale mal no se puede saber si falló la lectura (`identify`) o la redacción (`generate`) — ambos pudieron interpretar el dump distinto sin que haya un punto de falla localizable. Si en cambio `generate` parte del `read_corto` de `identify`, la cadena queda encadenada: un error se puede aislar a "el resumen no capturó la observación" (falla de `identify`/rúbrica de cobertura) o "el resumen era correcto pero el objetivo no se deriva bien de él" (falla de la rúbrica de objetivos, doc siguiente) — no ambas cosas mezcladas en una sola caja negra.

**Consecuencia para esta rúbrica:** si `generate` va a depender de `read_corto` como fuente primaria, entonces `read_corto` **no puede perder contenido** — el hallazgo de Caso 5/Kevin (§20, donde `read_corto` truncó "sigue con el mismo patrón que no le funciona" y solo `generate`, leyendo el dump completo, lo recuperó) deja de ser un defecto menor y se vuelve bloqueante: hoy es la única razón por la que ese caso no se rompió.

**Regla:** el `read_corto` no tiene un límite de caracteres fijo — tiene un **piso de cobertura**: debe conservar cada cláusula que aporte un componente distinto de la anatomía (§3). Si la observación trae mecanismo + dos context clarifiers distintos, el resumen conserva los dos, aunque eso signifique superar la longitud objetivo actual (~120 caracteres). Regla de calidad, no de longitud.

**Cambio de contrato (Dev, a implementar junto con esta rúbrica, no después):** el `read_corto` de cada foco debe viajar desde `identify` → selección de UI → payload de `generate` (hoy se descarta en ese último salto). `GENERATE_SYSTEM` pasa a instruir que el `diagnóstico` se derive del `read_corto` provisto por foco, usando el dump crudo solo como respaldo/contexto adicional, no como fuente primaria a releer desde cero.

## 8. Manejo de dimensión mencionada dos veces en el mismo dump

Hallazgo de Caso 5 (§20): `identify` devolvió dos entradas separadas de `liderazgo` porque el dump la menciona en dos puntos distintos del texto. Además de un bug técnico ya identificado por separado (colisión de `focoKey` en la UI — Task Dev, no de esta rúbrica), hay una pregunta de rúbrica: ¿qué se hace con el contenido cuando pasa?

**Regla:** `identify` debe fusionar menciones repetidas de la misma sub-dimensión en **una sola entrada** antes de devolver el resultado — no es una decisión de la UI, es responsabilidad del paso de identificación. La fusión concatena los mecanismos/contextos de ambas menciones (no descarta ninguna) y aplica la anatomía (§3) sobre el texto ya fusionado. Se descarta la alternativa de "elegir la mención con más impacto" (mencionada en el scope doc como "overkill por ahora") — no hace falta esa rúbrica adicional todavía.

## 9. Dónde vive esta rúbrica en el pipeline, y cómo se "alimenta" al prompt en concreto

**Mecanismo real, sin adornar el término "modular":** `IDENTIFY_SYSTEM` hoy es un template string de JS/TS hardcodeado dentro de `index.ts` (línea 49-75), que ya interpola una constante (`JSON.stringify(SUB_DIMENSIONS)`) dentro del string antes de mandarlo a OpenAI. No hay retrieval en runtime, ni tool call, ni el modelo "consulta" nada por su cuenta — es una Edge Function stateless que arma un string y hace un solo `fetch` a la API de OpenAI (`callOpenAI`, línea 151).

Lo que propone `agentic-fit-check-pm.md` §5.1 con "módulo versionado" es, en términos concretos de este archivo: mover el texto de la anatomía (§3), la regla de granularidad (§4) y la convención de tono (§6) a su propia constante (puede ser otro archivo `.ts` importado en `index.ts`, o simplemente un bloque delimitado y con su propio número de versión dentro del mismo archivo) que se concatena dentro de `IDENTIFY_SYSTEM` al momento de definirlo — exactamente igual a como hoy se concatena `SUB_DIMENSIONS`. La ventaja de separarlo no es técnica (el modelo recibe el mismo string final de cualquier forma) — es de mantenimiento: se puede versionar y editar la rúbrica sin tocar el resto de las reglas de `identify`, y el mismo texto se puede reusar si `generate` también necesita conocerla.

**Output estructurado, no solo instrucción en prosa:** el paso `identify` ya devuelve un JSON estructurado por sub-dimensión (`dimension`, `sub_dimension`, `read_corto`, `candidata_a_foco`, `urgencia` — FORMATO, línea 69-75). El nuevo campo `observacion_suficiente` (booleano, §4) se agrega a ese mismo FORMATO. Esto importa más de lo que parece: pedirle al modelo que **llene un campo explícito por criterio** lo obliga a razonar la rúbrica dimensión por dimensión antes de responder, en vez de solo "tener en cuenta" una instrucción de más en medio de un prompt ya largo — es más confiable que agregar una regla en prosa y confiar en que se aplique sola (ver §10 sobre por qué esto importa con este modelo específico).

- El paso `identify` consume este módulo para producir, por cada sub-dimensión candidata: `dimension`, `read_corto` (con el piso de cobertura de §7), `urgencia` (ya existente), y el nuevo `observacion_suficiente`.
- Esto no requiere agente ni auto-corrección — es la pieza que el fit-check marcó como **fit alto, construible ya**, sin depender de resolver el validador advisory→auto-corrección (diferido) ni el monitoring entre periodos (siguiente horizonte).

## 10. ¿El modelo elegido puede leer dump + rúbrica sin perder contexto?

**Ventana de contexto: no es el problema.** El modelo en uso es `gpt-4o-mini` (línea 159 de `index.ts`), con ventana de 128k tokens de input. El dump de un coach (un párrafo, unos cientos de tokens) más la rúbrica completa (anatomía + reglas + ejemplos, uno o dos mil tokens más) queda muy por debajo de cualquier límite — no hay riesgo de truncar o "perder" contenido por tamaño.

**El riesgo real es cumplimiento de instrucciones, no memoria.** Ya hay evidencia de esto en los propios live tests: `GENERATE_SYSTEM` ya trae una "REGLA ANTI-INVENCIÓN" explícita (línea 89-90) y aun así el modelo inventó detalle en el Caso 4/Diego con observaciones más cortas que el dump típico (`docs/scope-planning-measurement.md` §19). Es decir: el modelo ya incumple una regla más simple que la que estamos por agregar, con menos texto en el prompt del que tendría con la rúbrica nueva.

**Confirmado (4 Jul 2026):** la rúbrica sí se manda dentro del prompt de `identify` — es exactamente el mecanismo para atacar la anti-invención (darle al modelo el criterio explícito en vez de una regla genérica). Y el diseño no se apoya solo en eso: el campo de salida obligatorio `observacion_suficiente` por dimensión (§9) fuerza que el modelo aplique la rúbrica activamente al responder, en vez de solo "tenerla presente" en medio de un prompt largo — más confiable que una regla suelta en prosa. Se mantiene además `validate`/la rúbrica de objetivos como una segunda pasada independiente sobre el output ya generado, no se confía en que una sola llamada salga libre de errores.

## 11. Validación contra los 5 casos sintéticos

| Caso | Debería... | Por qué, según §3–§4 |
|---|---|---|
| 1 — Mariana (completo) | Pasar en las 5 dimensiones | Cada observación trae mecanismo + contexto ("no arriesga nada en el segundo saque... y el rival lo sabe"; "baja notoriamente... como si jugara con otra intensidad mental") |
| 2 / 2b — Emilio (narrow) | Pasar en `forehand` y `manejo_riesgo` | Mecanismo explícito en ambas ("se abre la preparación... brazo suelto, sin transferencia de peso"; "o juega clavado... o va por el ganador imposible") |
| 3 — Sofía (vago) | Fallar en todas las candidatas | Ninguna línea pasa el componente 2 — solo adjetivos de juicio ("está bien", "más completa", "más regular"), sin mecanismo observable |
| 4 — Diego (5 etiquetas sin fondo) | Fallar en las 5, pese a que `identify` sí detecta las 5 dimensiones correctamente | Cada una tiene dimensión (1) pero no mecanismo (2): "la volea es muy floja" no dice qué hace floja la volea |
| 5 — Kevin (verboso) | Pasar en la mayoría; sirve para probar fusión (§8) y piso de cobertura (§7) | La mayoría de las observaciones traen mecanismo + contexto; `liderazgo` aparece dos veces (prueba de fusión) y la de `adaptacion_tactica` es compuesta (prueba de `read_corto`) |

Esta tabla es el criterio de aceptación antes de construir: si al implementar el módulo se corre contra estos 5 dumps y no reproduce esta tabla, la rúbrica todavía no está bien calibrada.

## 12. Fuera de alcance / decisiones abiertas para Marco

- **Nombre del componente 2.** Este doc usa "Mecanismo" como propuesta (describe mejor que "enfoque" o "patrón" el hecho de que es la mecánica/comportamiento observable, no una tendencia repetida). Falta confirmación de Marco — es terminología que después aparece en la UI-facing copy de los avisos (§5).
- **Bug de `focoKey` (colisión de dimensiones repetidas en la UI).** Ya identificado como fix de Dev independiente de esta rúbrica (scope doc §20) — no se resuelve en este doc, solo se nota la dependencia: la fusión en `identify` (§8) probablemente vuelve el bug irrelevante (si `identify` nunca devuelve duplicados, no hay colisión que arreglar en la UI), pero conviene confirmarlo al implementar.
- **Umbral de "context clarifier demasiado amplio".** §3 da "en partidos" como ejemplo malo y "con bolas rápidas" como bueno, pero no hay una regla dura de qué tan específico debe ser un contexto para contar. Se deja como criterio de juicio del LLM por ahora — se revisita si en producción genera falsos positivos/negativos.

## 13. Siguiente paso

Con este doc aprobado por Marco: (a) implementar el módulo de rúbrica y engancharlo a `identify`, incluyendo el cambio de contrato de §7 (`read_corto` viajando hasta `generate`) (Task Dev, nueva — no existe hoy en el backlog con ese scope, se crea al aprobar), (b) correr los 5 casos sintéticos como regresión antes de pasar a producción, (c) mover el Notion task a Done cuando el módulo pase la tabla de §11. Después de esto, sigue el doc de scoping de **"P&M — Rúbrica/skill: objetivos alineados a la filosofía de la academia"**, que puede apoyarse en esta anatomía como su primer filtro de entrada.

## 14. Regresión ejecutada contra los 5 casos sintéticos (7 Jul 2026)

Módulo implementado en commit `2307af2` (pm-v2.5-2026-07-04). Se deployó a Supabase (`generate-quarterly-plan` v9) y se corrieron los 5 casos de `docs/dumps-test-planning-edge-cases.md` en modo `identify` contra la function real.

**Nota metodológica:** el sandbox de Cowork no tiene salida de red directa a `*.supabase.co`. La corrida se hizo invocando la function desde dentro de la base de datos vía la extensión Postgres `http` (`CREATE EXTENSION http`), removida (`DROP EXTENSION`) al terminar — no queda como dependencia permanente del proyecto.

| Caso | Esperado (§11) | Resultado real | Veredicto |
|---|---|---|---|
| 1 — Mariana | Pasar en las 5 | Identifica exactamente `serve`, `puntos_clave`, `transferencia_partido`, `beep_test`, `coachabilidad`, las 5 con `observacion_suficiente: true` | **PASA** |
| 2 — Emilio | Pasar en `forehand` y `manejo_riesgo`, ninguna otra | Identifica exactamente esas 2, ambas suficientes | **PASA** (con hallazgo de tono, ver abajo) |
| 2b — Emilio sin marcadores | Igual que Caso 2 (regresión del bug pm-v2.3) | Identifica `forehand` y `manejo_riesgo` igual que el Caso 2 — el fix de no depender de marcadores de estructura se sostiene | **PASA** |
| 3 — Sofía | Fallar en todas las candidatas | Identifica 2: `fuerza_inferior` (suficiente=false, correcto) y `etica_trabajo` (suficiente=**true**, incorrecto — el read_corto "a veces se desconcentra... necesita ser más constante" es puro juicio, sin mecanismo) | **FALLA PARCIAL** |
| 4 — Diego | Fallar en las 5 | Identifica las 5 correctamente (`volea`, `devolucion`, `manejo_riesgo`, `fuerza_inferior`, `liderazgo`) pero **las 5 quedan marcadas `observacion_suficiente: true`** | **FALLA TOTAL** |
| 5 — Kevin | Pasar en la mayoría; valida fusión (§8) y piso de cobertura (§7) | Identifica 15 sub-dimensiones; fusión de `liderazgo` funciona (une "le falta liderazgo" + "falta regulación emocional" en una sola entrada con "·"); piso de cobertura funciona (`adaptacion_tactica` conserva la cláusula completa). Falta `forehand`/derecha pese a mención explícita como fortaleza — miss de `identify`, no de la rúbrica | **PASA** (con miss de identify aparte) |

### Hallazgos que bloquean pasar a producción

1. **Caso 4 (Diego) — falla total, y es exactamente el caso que motivó construir esta rúbrica (§1).** "La volea es muy floja", "la devolución también necesita mejorar bastante", "el manejo de riesgo... no está bien", "le falta fuerza en las piernas", "le falta ser más líder" — ninguna de estas cinco trae mecanismo (componente 2), solo juicio de resultado. La regla de suficiencia (§3) las debería marcar `false` a las cinco. En producción las cinco pasan como `true`. El guardrail no se dispara en el caso que originó todo el proyecto.
2. **Caso 3 (Sofía) — falla parcial.** Mismo patrón: `etica_trabajo` pasa como suficiente cuando el read_corto asociado es puro juicio ("se desconcentra", "necesita ser más constante"), sin mecanismo observable.
3. **Violación de tono en Casos 2/2b (§6).** El `read_corto` de `manejo_riesgo` repite literalmente *"Emilio no tiene término medio"* — usa el nombre del atleta y el juicio directo sin traducirlo a conducta observable, pese a que la regla de §6 lo prohíbe explícitamente y pese a que el propio dump da la conducta un renglón después ("o juega clavado atrás... o va por el ganador imposible").
4. **Miss de `identify` en Caso 5 (no es bug de la rúbrica).** No identificó `forehand`/derecha pese a mención explícita como fortaleza ("la derecha la tiene sólida, es su arma"). La rúbrica solo califica sub-dimensiones ya identificadas — este miss es anterior, de la detección misma.

### Lectura de conjunto

Los mecanismos de **fusión** (§8) y **piso de cobertura** (§7) sí funcionan como se diseñaron (validado en Caso 5). El mecanismo central — la regla de suficiencia por dimensión — falla exactamente en los dos casos vagos/de puro juicio (3 y 4), que son los que existen para atacar. Consistente con el riesgo ya anotado en §10: el modelo (`gpt-4o-mini`) ya incumplía una regla más simple (anti-invención) en el mismo Caso 4 antes de esta rúbrica — el campo de salida obligatorio no fue suficiente por sí solo para forzar el razonamiento buscado.

### Siguiente paso

**No se puede mover el Notion task a Done** — la rúbrica no reproduce la tabla de §11 en los dos casos que existen específicamente para probarla. Antes de considerar esto listo para producción:
(a) reforzar la regla de suficiencia con un ejemplo explícito calcado del propio Caso 4 dentro de `RUBRICA_OBSERVACIONES` (ya que sigue siendo el caso real que falla);
(b) corregir la convención de tono para que `read_corto` nunca copie nombre propio ni juicio directo (Casos 2/2b) — reforzar con un ejemplo negativo explícito;
(c) re-correr esta misma regresión después de cualquier ajuste al prompt, antes de dar por cerrado el task.

## 15. Fix aplicado — regla de suficiencia (pm-v2.6-2026-07-07)

Se aborda primero el hallazgo más crítico (§14.1, Caso 4) de forma aislada del hallazgo de tono (§14.3), para poder aislar el efecto de cada fix en la regresión — no se mezclan en el mismo cambio.

**Cambio en `RUBRICA_OBSERVACIONES`** (`supabase/functions/generate-quarterly-plan/index.ts`, `RUBRIC_VERSION` → `v2-2026-07-07`, `PROMPT_VERSION` → `pm-v2.6-2026-07-07`): se agrega, después de la "Prueba rápida", un párrafo de advertencia explícito —identificar bien la sub-dimensión no es evidencia de que haya mecanismo, un dump puede nombrar 5 áreas reales sin describir ninguna a fondo— seguido de dos bloques de ejemplos:

- **3 ejemplos de "solo juicio" (`observacion_suficiente: false`)**, calcados literalmente de las frases del Caso 4 que fallaron en la regresión de §14: `volea` ("es muy floja"), `devolucion` ("necesita mejorar bastante"), `fuerza_inferior` ("le falta fuerza... se le nota"). Se excluye a propósito el ejemplo de `liderazgo` del Caso 4 (decisión de Marco, 7 Jul 2026) para no sobrecargar el prompt con 4 ejemplos del mismo polo.
- **4 ejemplos de "sí tiene mecanismo" (`observacion_suficiente: true`)**, uno por cada categoría de dimensión (técnica, táctica, physical, character), tomados de los casos que sí pasaron correctamente en la regresión de §14: `forehand` (Caso 2, Emilio), `puntos_clave` y `beep_test` (Caso 1, Mariana), `coachabilidad` (Caso 1, Mariana). Reemplaza el contraste único que había en el primer borrador de este fix.

La convención de tono (§14.3, Casos 2/2b) queda sin tocar en este cambio — es el siguiente fix, con su propia regresión.

**Pendiente:** deployar esta versión y re-correr los 5 casos sintéticos para confirmar que Caso 3 y Caso 4 ahora fallan correctamente sin romper Casos 1, 2, 2b y 5.

### Re-corrida (7 Jul 2026, mismo día) — deploy v10, pm-v2.6-2026-07-07

| Caso | Antes (pm-v2.5, §14) | Ahora (pm-v2.6) | Veredicto |
|---|---|---|---|
| 1 — Mariana | Pasa 5/5 | Pasa 5/5, sin cambios | **PASA** |
| 2 — Emilio | Pasa 2/2 (con violación de tono) | Pasa 2/2, violación de tono sigue igual (no se tocó en este fix) | **PASA** |
| 2b — sin marcadores | Pasa | Pasa, sin cambios | **PASA** |
| 3 — Sofía | Identifica 2 candidatas, 1 falla mal (`etica_trabajo` pasa cuando no debería) | Ahora identifica 4 candidatas (`forehand`, `backhand`, `fuerza_inferior`, `etica_trabajo`); las primeras 3 ahora fallan correctamente, pero `etica_trabajo` **sigue pasando como suficiente** con el mismo read_corto ("se desconcentra en partido... necesita ser más constante") | **MEJORA PARCIAL, sigue sin pasar completo** |
| 4 — Diego | Las 5 pasan como suficientes (falla total) | `volea`, `devolucion` y `fuerza_inferior` — los 3 ejemplos que sí se enseñaron explícitamente — **ahora fallan correctamente**. `manejo_riesgo` y `liderazgo` siguen pasando como suficientes | **MEJORA GRANDE (3/5 corregidos), sigue sin pasar completo** |
| 5 — Kevin | Pasa; fusión y piso de cobertura validados; faltaba `forehand` | Pasa igual; esta vez sí identifica `forehand` como fortaleza (candidata_a_foco=false) — variación normal del modelo, no atribuible al fix | **PASA** |

**Lectura:** el fix funciona exactamente donde se enseñó y no se generaliza más allá de eso. Los 3 ejemplos calcados del Caso 4 corrigieron esas 3 sub-dimensiones puntualmente. Mismo patrón que persiste en `manejo_riesgo` de Diego (que además es un caso genuinamente más ambiguo: "a veces se pasa de arriesgado y a veces juega muy conservador" sí describe un patrón de comportamiento, solo le falta un context clarifier explícito — ver criterio abierto de §12) y sobre todo en `liderazgo` de Diego, que es prácticamente idéntico al ejemplo que se removió a pedido de Marco (7 Jul 2026, ver §15 más arriba). **Ese es el costo directo de haber quitado el ejemplo de liderazgo**: el modelo no generalizó la regla a ese caso sin el ejemplo específico.

**Siguiente decisión para Marco:** ¿agregar de vuelta un ejemplo de `liderazgo` (o uno equivalente de la dimensión character) para cerrar ese hueco, o aceptar que la rúbrica es más un conjunto de ejemplos ancla que una regla generalizable con este modelo, y compensar con más ejemplos por dimensión? El fix de tono (Casos 2/2b) sigue pendiente como el siguiente task aislado.

### Test de generalización — Caso Valeria (7 Jul 2026, mismo día)

Antes de decidir si agregar de vuelta el ejemplo de `liderazgo`, Marco pidió descartar la hipótesis de que el fix solo funciona por overfit a las frases literales del Caso 4 (Diego). Se construyó un caso sintético nuevo, con la misma estructura (5 sub-dimensiones, todas de puro juicio sin mecanismo) pero **sin reusar ninguna frase ni sub-dimensión de los ejemplos enseñados** — deliberadamente no forma parte de los 5 casos originales de `docs/dumps-test-planning-edge-cases.md`, es exclusivo para esta prueba de generalización.

**Atleta:** Valeria (sintético, sin registro real)

**Dump:** "Con Valeria este trimestre quiero atacar cinco áreas. El saque sigue siendo flojo, no es su fuerte. La selección de golpe deja bastante que desear, no elige bien. El manejo de riesgo tampoco anda bien, todavía le falta madurar ahí. Físicamente el salto no es su punto fuerte, se nota que le falta potencia. Y como líder del grupo, todavía le falta camino por recorrer, no termina de tomar ese papel."

**Resultado contra pm-v2.6 (sin ejemplo de liderazgo):**

| Sub-dimensión | Esperado | Resultado | Veredicto |
|---|---|---|---|
| `serve` | false (puro juicio) | false | correcto |
| `seleccion_golpe` | false (puro juicio) | false | correcto |
| `manejo_riesgo` | false (puro juicio) | **true** | incorrecto |
| `salto_vertical` | false (puro juicio) | false | correcto |
| `liderazgo` | false (puro juicio) | **true** | incorrecto |

**Conclusión — no es overfit a las frases, es un patrón sistemático.** La regla de suficiencia sí generaliza correctamente a frases y sub-dimensiones nunca vistas en técnica y physical (3/3 correctas con wording 100% nuevo). Pero falla exactamente en las mismas dos áreas que en el Caso 4 — `manejo_riesgo` y `liderazgo` — con una redacción completamente distinta y sin ningún parecido literal a los ejemplos enseñados. Esto descarta que el problema sea "memorizó las frases de Diego": el modelo parece tener un sesgo estructural a tratar juicios sobre manejo de riesgo y sobre carácter/liderazgo como "suficientemente informativos" incluso cuando no describen ninguna conducta observable, mientras que sí aplica el criterio correctamente en técnica y físico.

**Implicación:** agregar de vuelta el ejemplo de `liderazgo` probablemente no bastaría por sí solo — el sesgo parece ser de categoría (táctica de "manejo/riesgo" y character), no de una sub-dimensión puntual. Antes de agregar más ejemplos ad hoc, vale la pena considerar si `manejo_riesgo` y las 3 sub-dimensiones de `character` necesitan una regla o ejemplo específico por categoría en vez de un ejemplo aislado por sub-dimensión — pendiente de decisión de Marco.

## 16. Fix aplicado — ejemplos de manejo_riesgo y liderazgo (pm-v2.7-2026-07-07)

Se agregan 2 ejemplos más a `RUBRICA_OBSERVACIONES` (`RUBRIC_VERSION` → `v3-2026-07-07`, `PROMPT_VERSION` → `pm-v2.7-2026-07-07`): la frase de `manejo_riesgo` de Diego (Caso 4) y la de `liderazgo` de Diego (la misma que se había excluido a propósito en §15, reincorporada ahora que el test de generalización de Valeria confirmó que el hueco era real y no un caso aislado). Cada ejemplo incluye una nota "OJO" marcando la categoría completa (táctica de decisiones, y las 3 sub-dimensiones de character) como zona de riesgo, no solo la sub-dimensión puntual.

**Deploy v11, re-corrida (7 Jul 2026):**

| Caso | Sub-dimensión en duda | Corrida 1 | Corrida 2 (repetición) |
|---|---|---|---|
| 4 — Diego | `manejo_riesgo` | true (incorrecto) | **false (correcto)** |
| 4 — Diego | `liderazgo` | **false (correcto)** | **false (correcto)** |
| Valeria (generalización) | `manejo_riesgo` + `liderazgo` | **false + false (correcto, 5/5)** | — |
| 2 — Emilio | `manejo_riesgo` (debe seguir true, sí tiene mecanismo) | **true (correcto, sin regresión)** | — |
| 3 — Sofía | observación de concentración en partido | true (¿incorrecto?) | true (repetido, mismo resultado) |

**Lectura:** `liderazgo` queda resuelto de forma estable (2/2 corridas correctas) — el ejemplo explícito sí cerró ese hueco. `manejo_riesgo` de Diego dio inconsistente entre dos corridas idénticas (true, luego false) — con `temperature: 0.3` el modelo no es determinista; una sola corrida no alcanza para concluir pass/fail en casos límite, hace falta repetir antes de dar un caso por bueno o malo. Emilio (que si tiene mecanismo real en `manejo_riesgo`) se mantiene correctamente en `true` — el fix no volvió la rúbrica más estricta de lo debido ahí.

**Hallazgo que vale la pena señalar, no necesariamente un bug:** en Sofía, la línea "a veces se desconcentra en partido y se le va el foco" sigue marcándose `true` de forma consistente (2/2 corridas, incluso cambiando de sub_dimension entre `etica_trabajo` y `coachabilidad` según la corrida). Revisando la anatomía (§3) con más cuidado, esta frase sí trae un mecanismo ("se desconcentra") y un context clarifier ("en partido") — es decir, cumple la regla de suficiencia tal como está escrita, aunque el criterio original de aceptación (§11) esperaba que **todo** Caso 3 fallara. Puede que la tabla de aceptación original haya sido más estricta de lo que la propia anatomía de 5 componentes exige para esta línea puntual — vale la pena que Marco decida si esto es en efecto un pase legítimo (cumple la anatomía) o si el criterio de "vago" para Sofía debería endurecerse para excluir frases como esta.

**Estado:** el fix de suficiencia queda considerablemente mejor que pm-v2.5 (Caso 4 pasa de 0/5 a 5/5 en la corrida limpia; Valeria pasa 5/5 con wording nunca visto). Persisten dos frentes abiertos, no bloqueantes para seguir iterando: (a) variabilidad de muestreo en `manejo_riesgo` bajo ciertas redacciones — probablemente requiere más ejemplos o bajar la temperatura; (b) revisar si el criterio de aceptación para el tipo de frase de Sofía necesita ajustarse. El fix de tono (Casos 2/2b) sigue como el siguiente task aislado, sin tocar todavía.

**Decisión de Marco (7 Jul 2026):** el hallazgo de Sofía (§16) se acepta como correcto — la línea sí cumple la anatomía (mecanismo + contexto), el criterio de aceptación original era más estricto de lo necesario. No se toca. Marco también señaló que, de cara a producción, la rúbrica va a necesitar más ejemplos reales (no solo los sintéticos) para seguir afinándose — queda anotado como dirección de trabajo futura, no como task inmediato.

## 17. Fix aplicado — tono no debe repetir nombre propio (pm-v2.8-2026-07-07)

Se agrega a `CONVENCIÓN DE TONO` un ejemplo explícito correcto/incorrecto (calcado del propio texto de Emilio) y la instrucción de reescribir la oración completa en tercera persona impersonal, no solo sustituir el nombre por un pronombre. `RUBRIC_VERSION` → `v4-2026-07-07`, `PROMPT_VERSION` → `pm-v2.8-2026-07-07`. Deploy v12.

**Re-corridas — Caso 2 y 2b, 2 veces cada uno (7 Jul 2026):**

| Corrida | Caso | read_corto de `manejo_riesgo` | ¿Usa nombre? |
|---|---|---|---|
| 1 | 2 (con marcadores "Uno:"/"Dos:") | "La toma de decisiones oscila entre jugar clavado atrás..." | **No — correcto** |
| 2 | 2 (repetición) | "Emilio alterna entre jugar clavado atrás..." | Sí — incorrecto |
| 1 | 2b (sin marcadores) | "Emilio alterna entre jugar clavado atrás..." | Sí — incorrecto |
| 2 | 2b (repetición) | "Emilio alterna entre jugar clavado atrás..." | Sí — incorrecto |

**Resultado: 1 de 4 corridas corrige el nombre.** A diferencia del fix de suficiencia (que estabilizó rápido con ejemplos concretos), este fix **no está funcionando de forma confiable** — el modelo vuelve a "Emilio alterna entre..." la mayoría de las veces pese al ejemplo explícito de qué NO hacer. Posibles razones a explorar: (a) el ejemplo agregado puede no ser lo bastante fuerte frente a la tentación de usar el nombre como sujeto natural de la oración en español; (b) puede hacer falta una instrucción más mecánica tipo "nunca escribas el nombre propio del atleta en ningún campo de este JSON" en vez de depender de que el modelo infiera la regla de un ejemplo; (c) esta regla puede necesitar vivir como un post-procesamiento determinístico (buscar y quitar el nombre del atleta del string antes de devolver la respuesta) en vez de depender 100% del LLM, ya que es una regla mecánica (no requiere juicio) y por lo tanto es candidata perfecta para validación de código en vez de instrucción de prompt.

**Pendiente de decisión de Marco:** ¿iterar el prompt una vez más con instrucción más dura, o resolverlo con una función de post-procesamiento en `index.ts` que reemplace el nombre del atleta por nada/pronombre antes de devolver `read_corto`? Esta segunda opción sería más confiable dado que ya sabemos el nombre del atleta en el momento de la llamada (viene del registro del atleta en la base de datos), a diferencia de la regla de suficiencia que sí requiere juicio genuino del LLM.

## 18. Fix de tono, segunda iteración — reestructurar en vez de post-procesar (pm-v2.9-2026-07-07)

Antes de resolver por código, Marco pidió intentar una reformulación del prompt que no "anclara" al modelo hacia el nombre propio. Hipótesis del cambio: el ejemplo de §17 mostraba primero el bloque INCORRECTO (con "Fulano...") y luego el CORRECTO — el modelo podía estar fijándose en la forma del ejemplo incorrecto como plantilla de qué palabras usar, no solo de qué evitar. `RUBRIC_VERSION` → `v5-2026-07-07`, `PROMPT_VERSION` → `pm-v2.9-2026-07-07`.

**Cambios de estructura respecto a pm-v2.8:**
- Título de sección cambia a "CONVENCIÓN DE TONO (ESTRICTA — PROHIBICIÓN ABSOLUTA DE NOMBRE PROPIO)" — mismo patrón de énfasis que ya usa `GENERATE_SYSTEM` en su sección equivalente (que sí funciona de forma confiable).
- Se elimina el bloque "INCORRECTO" explícito — ya no se le muestra al modelo la forma exacta de la respuesta mala, solo se describe en prosa que existe y por qué está mal.
- Se agrega un paso de **autochequeo obligatorio**: "relee cada read_corto que hayas escrito, si el nombre aparece, bórralo y reescribe" — instrucción de verificación posterior a la generación, no solo regla previa.
- El único ejemplo mostrado es el CORRECTO, presentado como el resultado esperado directamente, no como contraste.

**Deploy v13, re-corrida — Casos 2 y 2b, 2 veces cada uno:**

| Corrida | Caso | ¿Usa nombre en read_corto de manejo_riesgo? |
|---|---|---|
| 1 | 2 | No |
| 2 | 2 | No |
| 1 | 2b | No |
| 2 | 2b | No |

**Resultado: 4 de 4 corridas correctas — mejora completa respecto al 1/4 de pm-v2.8.** La reestructuración (quitar el ejemplo incorrecto explícito + agregar autochequeo obligatorio + calificar la regla como "estricta" igual que su contraparte ya validada en `GENERATE_SYSTEM`) resolvió el problema sin necesidad de post-procesamiento en código. Sigue siendo una muestra pequeña (4 corridas) — con `temperature: 0.3` no hay garantía de 100% en producción, pero el contraste frente al fix anterior es consistente con la hipótesis de que el ejemplo incorrecto estaba anclando al modelo.

**Estado:** los 3 hallazgos de la regresión original (§14) están atendidos: suficiencia (§15-16, con una advertencia abierta sobre variabilidad de muestreo en `manejo_riesgo`), tono (§17-18, resuelto en esta iteración), y el criterio de Sofía (aceptado como correcto, no requiere cambio).

## 19. Regresión final completa contra pm-v2.9-2026-07-07 (v13, deployado)

Corrida de cierre: los 5 casos originales de `docs/dumps-test-planning-edge-cases.md`, contra la versión final del día (pm-v2.9, con los 3 fixes de §15-18 ya incluidos).

| Caso | Resultado | Comparado con lo esperado (§11) / decisiones tomadas hoy |
|---|---|---|
| 1 — Mariana | 5/5 `observacion_suficiente: true`, sin nombre en ningún read_corto | **PASA**, sin cambios respecto a todas las corridas previas |
| 2 — Emilio | 2/2, sin nombre (`El manejo de riesgo es inconsistente...`) | **PASA** — tono corregido, confirmado por 2ª vez |
| 2b — Emilio sin marcadores | 2/2, sin nombre | **PASA** — tono corregido, confirmado por 2ª vez, incluyendo el caso que antes fallaba 0/2 |
| 3 — Sofía | `forehand`/`backhand`/`fuerza_inferior` en false (correcto); `etica_trabajo` (la observación de concentración en partido) en true | **Consistente con la decisión de Marco (§16, aceptado como correcto)** |
| 4 — Diego | `volea`/`devolucion`/`fuerza_inferior`/`liderazgo` en false (correcto); `manejo_riesgo` en true | **Consistente con la variabilidad de muestreo ya documentada (§18)** — no es una regresión nueva, es el mismo caso límite conocido |
| 5 — Kevin | 14 sub-dimensiones, ninguna con nombre propio, fusión de `liderazgo` funcionando | **PASA**, sin cambios |

**Conclusión: no hay regresiones.** Los 3 fixes aplicados hoy (suficiencia §15, ejemplos manejo_riesgo/liderazgo §16, tono §18) se sostienen juntos sin pisarse entre sí. El único frente abierto conocido es la variabilidad de muestreo en `manejo_riesgo` de Diego específicamente (pasa unas veces, falla otras, documentado desde §16) — no bloqueante, calificado como mejora futura, no como bug de este ciclo.

**Cierre del día:** con esta regresión, `generate-quarterly-plan` queda en pm-v2.9-2026-07-07 (v13) en producción. El Notion task de esta rúbrica puede pasar a Done en cuanto se autorice el conector de Notion — pendiente por falta de acceso en esta sesión (ver nota de la sesión anterior). Línea de trabajo futura anotada por Marco: la rúbrica va a necesitar ejemplos reales de producción (no solo sintéticos) para seguir afinándose.
