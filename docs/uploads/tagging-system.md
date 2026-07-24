# Sistema de Tagging — Diseño y Arquitectura

> Extraído del proyecto **m-brain** (sistema de memoria personal de Marco). Documenta el patrón de tagging tal como está implementado, para poder reutilizarlo en otro proyecto.

## 1. Filosofía

El tagging no es una lista plana de etiquetas libres. Es un **modelo cerrado y jerárquico**: un vocabulario fijo de valores posibles, con reglas explícitas de cuándo cada uno aplica, cuáles pueden coexistir y cuáles son mutuamente excluyentes. La regla de oro del proyecto es:

> **Las definiciones viven en un solo lugar y se renderizan literalmente en todos los prompts que las necesitan.** Nunca se duplican a mano en distintos archivos.

Esto evita el problema clásico de tener la definición de una etiqueta ligeramente distinta en el prompt de análisis, en el prompt del "juez" (ver más abajo) y en la documentación — que con el tiempo se desincroniza.

## 2. Modelo de datos

Tres categorías de tag conviven en la misma tabla, distinguidas por un campo `category`:

| Categoría | Qué captura | Cardinalidad por entrada | Confidence |
|---|---|---|---|
| `moment_type` | qué tipo de momento fue | 1–2 (rankeados, el primero es la etiqueta principal) | siempre 1.0 |
| `theme` | de qué trata la entrada | 2–5, se reutilizan entre entradas | null (no aplica) |
| `emotion` | qué se sintió | hasta 5, top-N por confidence | 0.0–1.0, real |

Esquema (Drizzle/SQLite, pero el patrón es agnóstico de stack):

```ts
tags: { id, name, category: 'emotion' | 'theme' | 'moment_type' }
entry_tags: { entryId, tagId, confidence } // PK compuesta (entryId, tagId)
```

El campo `confidence` es lo que permite ordenar emociones por relevancia y truncar a un top-N en la capa de servicio (no en la base de datos — la base de datos no impone el límite, la aplicación sí).

## 3. Taxonomía de `moment_type`

Es la categoría más compleja porque no es un set plano: tiene una **escalera de reflexión** y una **familia de eventos**, más un valor comodín.

### 3.1 La escalera reflexiva (ladder)

Un mismo hilo de pensamiento avanza por rangos; solo se tagea el rango más alto alcanzado por ese hilo:

```
open_question → insight → breakthrough
(pregunta sin       (una respuesta      (la respuesta
 responder)          aterrizó, nada      movió algo)
                      cambió todavía)
```

- `open_question`: la pregunta importa (no es trivial) y queda abierta. Una respuesta **tentativa/hedged** ("tal vez", "no estoy seguro") NO cierra la pregunta — sigue siendo `open_question`, nunca `open_question` + `insight` a la vez.
- `insight`: el "por qué" aterriza (conecta observación con causa/patrón/creencia) pero nada se mueve todavía a raíz de eso.
- `breakthrough`: la comprensión **mueve algo** — desbloquea, cambia de rumbo. `insight` y `breakthrough` son mutuamente excluyentes para el mismo hilo; en caso de duda, gana `insight` (hay que ganarse el `breakthrough` con evidencia positiva de que algo cambió).

Dos rangos pueden coexistir solo si son **hilos genuinamente distintos** (un insight en un frente + una pregunta abierta en otro frente) — nunca como cobertura de una misma cosa incierta.

### 3.2 Tipos de evento (event-types)

Describen qué pasó, no qué hizo la mente con eso. **Rankean primero** cuando coexisten con un tipo reflexivo (el evento es la etiqueta principal, la reflexión es la secundaria):

- `failure` — la agencia fue tuya, salió mal (te equivocaste).
- `setback` — fue externo, salió mal (no fue tu culpa).
- `win` — la agencia fue tuya, salió bien. Completa la grilla 2×2 con `failure`/`setback`. La suerte que simplemente te ocurrió (sin agencia) NO es `win`, es `event` o `casual`. Aprender algo de un mal resultado tampoco es `win` — sigue siendo `setback`/`event` + `insight`.
- `show_of_bravery` — una acción concreta con algo real en juego, que costó tomar. No aplica a demoras sin costo real ni a nervios pasajeros.
- `notable_exchange` — un intercambio/conversación que **de hecho ocurrió** con otra persona. Pensar en una conversación pasada o futura no cuenta.
- `event` — una ocurrencia concreta y acotada en el tiempo donde el evento mismo es el sujeto de la entrada (no el telón de fondo de una reflexión).
- `intention` — compromiso o permiso hacia adelante ("quiero...", "decidí que voy a..."), énfasis en decidir, no en actuar (eso sería `show_of_bravery`) ni en haberlo entendido (eso sería `breakthrough`). Una creencia afirmada o gratitud NO es una dirección elegida.

### 3.3 El comodín

- `casual` — momento ordinario sin significado particular. Regla estricta: **`casual` solo aparece solo**. Si cualquier otro tipo aplica genuinamente, la entrada deja de ser `casual`. Nunca es un tag "de compañía".

### 3.4 Retiros de taxonomía

`deep_thought` fue retirado porque, al ser ~90% del corpus, no aportaba señal — se dividió en `open_question` + `insight`. Lección general: **si una categoría cubre la mayoría de los casos, no está discriminando nada; hay que partirla**.

## 4. Reglas de tageo (cómo se combinan los tags)

Reglas aplicadas en el prompt de análisis, en este orden de prioridad:

1. Etiquetar por el momento más significativo de la entrada — narración casual alrededor de una pregunta o insight real NO vuelve casual la entrada.
2. `casual` nunca coexiste con otro tipo.
3. La escalera (`open_question`→`insight`→`breakthrough`) es de un solo hilo: se tagea el rango más alto, nunca dos rangos del mismo hilo.
4. Dos rangos pueden coexistir solo para hilos genuinamente distintos.
5. Si un event-type aplica Y la entrada también reflexiona sobre él, se tagean ambos, con el event-type primero.
6. Nunca usar un segundo tipo como cobertura ("hedge") entre dos candidatos para el mismo momento — dos tags implican dos aspectos genuinamente distintos.
7. Máximo 2 `moment_types` por entrada (impuesto también en el parseo, no solo en el prompt).

## 5. Capa de "juez" (resolución de conflictos)

Aunque las reglas de arriba viven en el prompt, el modelo de análisis a veces las viola y devuelve un par de tags que el sistema considera mutuamente excluyentes (conflicto). En vez de confiar ciegamente en la primera pasada, hay una segunda llamada enfocada:

**Fuente única de conflictos** (`conflicts.ts`): una lista de pares `[tipoA, tipoB]` con la razón de por qué son incompatibles (p. ej. `casual` + `insight`, o `insight` + `breakthrough`). Un helper `findConflict()` detecta si el set de tags de una entrada matchea algún par.

**Flujo de arbitraje** (`judge.ts`):
1. Si no hay conflicto, los tags pasan sin tocar.
2. Si hay conflicto, se arma un prompt de juez que muestra **las definiciones exactas que vio el primer analizador** (nunca una versión resumida) y pide elegir un solo ganador entre los dos tipos en conflicto — nada más (no puede introducir un tercer tipo, no toca temas/emociones/resumen/título).
3. Se reintenta hasta 2 veces contra el modelo. Si falla (error de API, JSON inválido, ganador fuera del par permitido), se usa un **fallback determinístico**: en pares con `casual`, gana el otro; en `insight` vs `breakthrough`, gana `insight`.
4. El juez **nunca bloquea el pipeline** — siempre hay un ganador, real o por fallback.
5. Cada decisión (real o fallback) se persiste en un log JSONL de auditoría (`entryId`, `pair`, `winner`, `reason`, `fallback: bool`, `model`, `durationMs`, `createdAt`) — separado de la base de datos, para poder revisar después sin tocar el esquema.

Modelo usado para el juez: uno más barato/rápido que el analizador principal (el proyecto usa `o4-mini` vs `gpt-4.1` para el análisis) — el arbitraje es una decisión binaria acotada, no requiere el modelo más caro.

## 6. Themes y emotions (las otras dos categorías)

- **Themes**: 2 a 5 por entrada, sustantivos o frases cortas, siempre en el idioma de trabajo del sistema (en este proyecto, inglés, aunque el contenido de origen esté en español) para que sean reutilizables como vocabulario controlado. Se le pasan al prompt los themes ya existentes para que el modelo reutilice en vez de inventar sinónimos.
- **Emotions**: hasta 5, cada una con un `confidence` 0.0–1.0. Se filtran y truncan al top-5 por confidence **en la capa de servicio**, no en el prompt ni en la base — la función `trimEmotions()` es pura y testeable por separado.

## 7. Patrón de prompts

Dos prompts (análisis y juez) comparten literalmente el mismo texto de definiciones vía una función `renderMomentTypeDefinitions()` que itera el diccionario `MOMENT_TYPE_DEFINITIONS` (`Record<MomentType, string>`). Cada definición sigue el mismo formato interno:

```
"<tipo>": <definición en una frase, con el criterio de decisión explícito>
   BAD: "<ejemplo que parece calificar pero no>" (razón → tipo correcto)
   GOOD: "<ejemplo real que sí califica>"
```

Este patrón BAD/GOOD por definición es lo que le da al modelo un ancla concreta contra la ambigüedad — las definiciones abstractas solas no bastan para discriminar entre tipos vecinos como `insight` vs `breakthrough` o `casual` vs `open_question`.

El prompt de análisis pide salida JSON estricta:

```json
{
  "moment_types": ["type1", "type2"],
  "themes": ["theme1", "theme2"],
  "emotions": [{ "name": "emotion", "confidence": 0.85 }],
  "summary": "...",
  "title": "..."
}
```

## 8. Validación y parseo (defensivo, del lado de la aplicación)

El parser (`parseAnalysisResponse`) nunca confía en que el modelo respetó el esquema:

- Limpia code fences de markdown antes de `JSON.parse`.
- Filtra `moment_types` contra el set válido (`VALID_MOMENT_TYPES`), descarta lo desconocido, trunca a 2. Si queda vacío, cae a `casual` por default.
- `themes`: solo strings no vacíos, normalizados a minúsculas, truncado a 5.
- `emotions`: normalizadas a `{name, confidence}`, filtradas por rango válido, truncadas a 5 por confidence.

Este parseo defensivo es lo que hace seguro invocar el juez y escribir a la base incluso cuando el modelo alucina un campo — nunca hay una escritura corrupta porque la validación pasa por un esquema estricto antes de tocar la DB.

## 9. Principios reutilizables para otro proyecto

1. **Vocabulario cerrado, no tags libres.** Un `Record<Tipo, definicion>` tipado es la fuente de verdad; todo lo demás (prompts, UI, validación) deriva de ahí, nunca se re-escribe a mano.
2. **Definir por el criterio de decisión, no por la etiqueta.** Cada definición debe responder "¿cuál es el test para decidir si esto aplica?" y darlo explícitamente (p. ej. "¿algo se movió después?").
3. **Pares BAD/GOOD por cada tipo**, especialmente contra sus vecinos más confundibles — es lo que evita que el modelo mezcle categorías adyacentes.
4. **Declarar conflictos explícitos** en una lista aparte, no dejar que la ambigüedad se resuelva implícitamente en el prompt.
5. **Capa de arbitraje barata y acotada** para conflictos: un segundo modelo (más barato) que solo elige entre dos opciones ya finalistas, nunca reabre el análisis completo.
6. **Fallback determinístico que nunca bloquea el pipeline.** Un juez que puede fallar sin fallback es un punto único de fallo.
7. **Auditar cada decisión de arbitraje** en un log aparte (JSONL u otro) para poder revisar patrones de conflicto después, sin acoplarlo al esquema principal.
8. **Validación defensiva en el parseo**, no solo confiar en las instrucciones del prompt — todo output de modelo se trata como no confiable hasta que pasa el parser.
9. **Revisar la taxonomía cuando una categoría domina el corpus.** Si un tipo cubre la mayoría de los casos, no está discriminando — hay que partirlo (como pasó con `deep_thought`).
10. **Categorías separadas por función** (qué tipo de momento / de qué trata / qué se sintió) en vez de una sola bolsa de tags — cada categoría tiene su propia cardinalidad y reglas de confidence.
