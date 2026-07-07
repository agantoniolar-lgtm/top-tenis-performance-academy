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
