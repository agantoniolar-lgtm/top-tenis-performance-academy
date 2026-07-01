# Scope — Rediseño de Planning + Measurement

**Estado:** Propuesta acordada + decisiones de aterrizaje resueltas (26 Jun 2026). Build sujeto al gate de buy-in de coaches.
**Fecha:** 25 Jun 2026 — actualizado 26 Jun 2026 (§13)
**Task Notion:** Scope: rediseño de planning + measurement (Team, Phase 2 — Analytics)
**Reemplaza:** El comportamiento actual de `generate-quarterly-plan`, `validate-quarterly-plan` y el wizard de `PlanesCoach.jsx`.

---

## 1. Problema

El sistema actual transforma observaciones no estructuradas del coach en objetivos por sub-dimensión (`quarterly_plan_objectives.objective_text`, texto libre, máx 150 chars). El output sale vago: *"Mejorar la aceleración final de la derecha, asegurando un golpe fluido y sin frenar"*. Eso es una intervención sin criterio de éxito: nadie puede decir, tres meses después, si se logró.

El problema no es de prompt — es estructural. El campo único de texto mezcla dos cosas distintas: **qué trabajar** (la intervención) y **cómo sabremos que funcionó** (el criterio de éxito), y el segundo no tiene dónde vivir.

## 2. Principio central

La escala de medición mensual es **−2 a +2 evaluada contra el plan**: `+2 Superado`, `+1 Adelantado`, `0 Por buen camino`, `−1 Rezagado`, `−2 Estancado`. Por lo tanto:

> **El objetivo ES el instrumento de medición.** La escala no necesita un sensor; necesita que el objetivo esté escrito con precisión suficiente para que el coach coloque al atleta en uno de los cinco niveles sin adivinar.

Consecuencia de diseño: para técnica / táctica / carácter **no hace falta un target numérico** — hace falta una **rúbrica observable** (las anclas del −2..+2). Datos automatizados (SwingVision, UTR API, match stats) son un *enhancement* futuro del método de medición, no un prerrequisito. Physical es la excepción: ahí sí hay números objetivos hoy.

## 3. Anatomía de un objetivo

Cada foco se guarda como objeto estructurado, no como una oración:

| Campo | Descripción |
|---|---|
| `sub_dimension` | Una de las 21 sub-dimensiones existentes |
| `tipo` | `foco` o `mantenimiento` |
| `diagnostico` | Qué se observó, en lenguaje del coach. Sale de las observaciones no estructuradas. |
| `objetivo` | La meta del trimestre, con gramática estándar (§4) |
| `anchors` | Los 5 niveles del −2..+2 para esta sub-dimensión (§5) |
| `carryover_of` | Link al objetivo del trimestre anterior, si continúa |
| `outcome` | Al cierre: `logrado` / `parcial` / `continua` (§7) |
| `final_assessment` | Al cierre: texto narrativo del coach |

Para **physical** se agregan: `baseline` (número del último test), `target` (número meta), `unit`. El `objetivo` y las `anchors` se derivan de esos números.

### Ejemplos bien formados

**Técnica — Derecha**
- *Diagnóstico:* El brazo se encoge y frena antes del impacto en la derecha de ataque; pierde profundidad y peso de bola.
- *Objetivo:* Soltar la aceleración final de la derecha de ataque, con terminación completa por encima del hombro contrario, de forma consistente en peloteo de fondo.
- *Anclas:*
  - +2 Superado — lo sostiene en punto y en partido, incluso bajo presión
  - +1 Adelantado — consistente en sparring / sets de práctica
  - 0 Por buen camino — consistente en drill controlado, empieza a aparecer en punto
  - −1 Rezagado — solo en drill aislado, se pierde al subir el ritmo
  - −2 Estancado — sigue frenando igual que al inicio

**Táctica — Puntos clave**
- *Diagnóstico:* En break points se vuelve pasivo, espera el error del rival en vez de ejecutar su patrón.
- *Objetivo:* Ejecutar su patrón de saque+1 en los puntos clave, tomando la iniciativa, de forma consistente en sets de práctica y partido.
- *Anclas:*
  - +2 Superado — lo ejecuta bajo presión en torneo
  - +1 Adelantado — lo ejecuta en partido de práctica
  - 0 Por buen camino — lo ejecuta en punto jugado en entrenamiento
  - −1 Rezagado — lo intenta solo en drill dirigido
  - −2 Estancado — sigue pasivo en los puntos clave

**Carácter — Regulación emocional**
- *Diagnóstico:* Tira la raqueta y baja el lenguaje corporal tras el error no forzado; arrastra el error al siguiente punto.
- *Objetivo:* Mantener rutina de reset entre puntos tras el error, sosteniendo lenguaje corporal neutro, de forma consistente durante el partido.
- *Anclas (eje de frecuencia):*
  - +2 Superado — lo sostiene en torneo y lo modela para compañeros
  - +1 Adelantado — consistente en partido sin recordatorio
  - 0 Por buen camino — consistente en entrenamiento
  - −1 Rezagado — solo con recordatorio del coach
  - −2 Estancado — sin cambio respecto al inicio

**Physical — Velocidad / Sprint 20m**
- *Objetivo:* Sprint 20m: 3.45s → 3.30s.
- *Anclas (bandas numéricas, medición mensual con cronómetro):*
  - +2 Superado — ≤ 3.20s
  - +1 Adelantado — 3.21–3.29s
  - 0 Por buen camino — 3.30s
  - −1 Rezagado — 3.31–3.44s
  - −2 Estancado — ≥ 3.45s (sin mejora)

## 4. Gramática estándar del objetivo

Para que se lea y genere igual siempre.

**Técnica / táctica / carácter — el objetivo es una PRESCRIPCIÓN al problema observado, no una meta genérica** *(refinado 27 Jun tras el primer test en vivo):*
`[prescripción directa al comportamiento observado] + [dirección concreta de mejora] + [estándar]`

- **Prescripción directa:** la acción concreta que corrige justo lo observado. Prohibidos los verbos vacíos (*mejorar, trabajar, desarrollar, optimizar, reforzar*); usar verbos de cambio concreto (*reducir, soltar, mantener, anticipar, rotar, recortar, adelantar*).
- **Prueba de especificidad:** si quitas el nombre del atleta y el objetivo sigue siendo cierto para cualquier tenista, está demasiado genérico → mal.
- **Estándar:** del set cerrado (`de forma consistente` / `bajo presión` / `sin recordatorio`).

Ejemplos (observación → objetivo bien formado):
- *"se apura por ganar el punto rápido y falla tiros que no debería tocar"* → *"Mantener una estrategia de golpes concreta para aprovechar mejor las oportunidades de cierre, en situaciones de presión"*
- *"en la red está incómodo, arma las voleas tarde"* → *"Reducir el tiempo de preparación de la volea para llegar atacando de frente, en situaciones de punto"*

Mal (genérico, prohibido): *"mejorar la selección de golpe en situaciones de presión"*, *"mejorar la ejecución de voleas"*.

**Prescripción estructural, no literal** *(refinado 27 Jun, `pm-v2.2`):* el objetivo no debe ser el síntoma invertido como instrucción (*"pega de brazo → que cargue la pierna"*). Debe apuntar a la **causa estructural/mecánica** que produce el síntoma y al resultado de desempeño buscado:
- Síntoma: *"pega de puro brazo en el saque, no carga la pierna de atrás"* → *"Mejorar la preparación de piernas para lograr mayor potencia al despegar del piso en el saque"*
- Síntoma: *"espera la devolución parado atrás, no da un paso adelante"* → *"Solidificar el movimiento de la devolución para conseguir mayor aceleración y contacto hacia adelante con la bola"*

**Physical:**
`[métrica]: [baseline] → [target] [unidad]`

## 5. Ejes de progresión de las anclas

Las 5 anclas no se inventan cada vez: se construyen sobre un eje fijo por tipo de dimensión. El objetivo "vive" en uno de los peldaños (normalmente *punto / partido*) y las anclas son los peldaños alrededor. Así el −2..+2 significa lo mismo entre atletas y entre coaches.

| Dimensión | Eje | Peldaños (−2 → +2) |
|---|---|---|
| Técnica / Táctica | Transferencia | drill aislado → drill controlado → punto jugado → sparring/set → partido bajo presión |
| Carácter | Frecuencia del comportamiento | nunca → con recordatorio → consistente en entrenamiento → consistente en partido → lo modela para otros |
| Physical | Bandas numéricas | bandas alrededor del target |

## 6. Modelo de focos + mantenimiento

Un plan trimestral tiene **máximo 5 focos**, no 21 objetivos. Las demás sub-dimensiones que el coach mencione quedan como **mantenimiento** ("sostener nivel actual"). Esto da enfoque, hace el plan vendible en la junta con coaches, y deja claro a papás y stakeholders cómo ayudar cada trimestre. Los focos llevan diagnóstico + objetivo + anclas completas; el mantenimiento solo declara la intención de sostener.

## 7. Ciclo de vida del objetivo (incluye cierre del loop)

> El cierre del loop **no existe hoy** y es parte central de este scope. Sin él, planning + measurement no funciona como sistema.

1. **Observación.** El coach escribe sus observaciones en el textarea, sin estructura, con todo el detalle posible.
2. **Identificación.** El LLM identifica *todas* las sub-dimensiones mencionadas + un read corto de cada una.
3. **Selección.** El sistema separa las que fueron **foco del trimestre anterior** (candidatas a continuar, vía `carryover_of`) de las **nuevas identificadas**. El coach arma sus ≤5 focos — continuando anteriores, nuevos, o mezcla — y lo demás mencionado queda como mantenimiento.
4. **Generación.** El LLM genera el objetivo completo de cada foco: diagnóstico + objetivo (§4) + 5 anclas (§5). Physical va con target numérico.
5. **Validación / edición.** La función de validación revisa lo generado; el coach edita a mano o pide regenerar (§8).
6. **Medición mensual.** Durante el trimestre, 3 mediciones −2..+2 contra las anclas (physical = test numérico) + observaciones de lo que se necesita el siguiente mes. El score vive en `report_on_court` / `report_physical` / `report_character` por sub-dimensión; el enlace al objetivo es implícito por (atleta, periodo, sub-dimensión).
7. **Cierre a los 3 meses (retrospective del periodo).** El cierre no es solo un verdict por foco — es un **post-mortem del periodo** escrito por coach *y* atleta. Tiene dos capas:
   - **Por foco:** el coach (con asistencia del LLM) escribe `final_assessment` y marca `outcome` — `logrado`, `parcial` o `continua`. Cada foco se marca como cerrado (done).
   - **Por periodo:** `coach_retrospective` y `athlete_retrospective` — la reflexión global de ambos sobre el trimestre (el "final report" / retrospectiva).
   - Cuando todos los focos están cerrados y los dos retrospectives escritos, el plan pasa a status `completed`. **Ese status es el trigger** que vuelve disponible todo el bundle del periodo como contexto del siguiente plan (§7.1).

### 7.1 Handoff periodo → periodo (modelo core, no futuro)

Al generar el plan N+1, la generación ingiere el **bundle del periodo previo** — no solo el textarea nuevo:
- Las observaciones nuevas (textarea del coach).
- Los focos del plan N con su `objetivo`, `outcome` y `final_assessment`.
- La **trayectoria de los 3 scores −2..+2** de cada foco. Esto es input de primera clase: un foco que terminó en −2 casi seguro continúa; uno en +2 probablemente cierra. Permite que el LLM *proponga* continuar vs cerrar en vez de que el coach decida desde cero.
- `coach_retrospective` y `athlete_retrospective` del periodo previo.

Con eso, la generación arma una propuesta inteligente del siguiente plan (qué focos continúan/evolucionan, qué nuevo surgió, qué priorizó el atleta).

**Cold-start = requisito de captura, no solo de consumo.** Si es el primer plan del atleta no hay bundle que ingerir y la generación corre solo con observaciones (comportamiento actual). Pero el cierre de ese primer plan **se guarda en estructura desde el día uno** para que el plan #2 sí lo tenga. El dump de contexto se almacena siempre; el consumo arranca en el periodo 2. Si no se captura estructurado, se pierde el insumo del siguiente plan.

Esto es más angosto que el epic de ingesta de carrera completa (§11): aquí solo se usa el periodo inmediatamente anterior, y es construible ya.

## 8. Flujo de creación (UI)

Diferente al wizard actual de 3 pasos. Nuevo flujo con una compuerta de selección en medio:

1. **Atleta + período** (igual que hoy).
2. **Observaciones** — textarea libre.
3. **Selección de focos** *(nuevo)* — el LLM identifica sub-dimensiones; se muestran focos anteriores (carryover) vs nuevas, separados. El coach elige ≤5 focos; el resto mencionado = mantenimiento.
4. **Generación + revisión por feedback** — el LLM genera diagnóstico + objetivo + anclas de cada foco; la validación (self-check, §13) corre aquí. El coach **no edita a mano** (por ahora): revisa que el plan represente los objetivos que quiere proponer y, si no está de acuerdo, **deja comentarios de qué salió mal y regenera** — se vuelve a ejecutar la generación con ese feedback como input, en loop, hasta que esté conforme.
5. **Guardar.**

Default de producto: el coach observa y describe; el LLM estructura. *"El coach describe con tanto detalle como pueda, el LLM genera la estrategia trimestral, el coach la revisa y ajusta."*

## 9. Cambios de schema

`quarterly_plan_objectives` — agregar:

| Columna | Tipo | Notas |
|---|---|---|
| `tipo` | text check (`foco`,`mantenimiento`) | default `foco` |
| `diagnostico` | text | |
| `objetivo` | text | reemplaza el uso de `objective_text` como meta |
| `anchors` | jsonb | `{"-2":…,"-1":…,"0":…,"+1":…,"+2":…}` |
| `carryover_of` | uuid → `quarterly_plan_objectives.id` | nullable |
| `outcome` | text check (`logrado`,`parcial`,`continua`) | nullable hasta el cierre |
| `final_assessment` | text | nullable hasta el cierre |
| `baseline` | numeric | solo physical |
| `target` | numeric | solo physical |
| `unit` | text | solo physical |

`objective_text` (el texto que se generaba tras el dump de observaciones) se **depreca y se elimina**: queda redundante al partirse en `diagnostico` + `objetivo` + `anchors`. Solo existen dos planes dummy, así que no hay migración — se archivan o eliminan (§13).

`quarterly_plans` — agregar:

| Columna | Tipo | Notas |
|---|---|---|
| `status` | agregar valor `completed` | flujo: draft → active → completed → archived. `completed` = cierre hecho, dispara el handoff |
| `coach_retrospective` | text | post-mortem del periodo, lado coach; nullable hasta el cierre |
| `athlete_retrospective` | text | post-mortem del periodo, lado atleta; nullable, no bloquea |
| `closed_at` | timestamptz | cuándo se cerró el periodo |

No se tocan `report_on_court` / `report_physical` / `report_character` en esta fase — el score mensual ya existe ahí por sub-dimensión. La trayectoria de los 3 scores del periodo se lee de ahí por (atleta, periodo, sub-dimensión) para el handoff (§7.1).

## 10. Cambios en edge functions

- `generate-quarterly-plan` v3 — dos modos: (a) **identificar** sub-dimensiones mencionadas + read corto (paso 3); (b) **generar** diagnóstico + objetivo + anclas por foco, con la gramática (§4) y los ejes (§5), tratando physical aparte con target numérico.
  - **Contrato de input (§7.1):** además de `observations`, recibe el bundle del periodo previo cuando existe — `{ prior_focos: [{ sub_dimension, objetivo, outcome, final_assessment, monthly_scores: [s1, s2, s3] }], coach_retrospective, athlete_retrospective }`. Cold-start: bundle nulo → corre solo con observaciones. La trayectoria de scores se usa para proponer continuar vs cerrar cada foco anterior.
- `validate-quarterly-plan` — sigue como loop de revisión de calidad sobre lo generado; ajustar criterios para evaluar también que las anclas estén bien diferenciadas, no solo cobertura/vaguedad.
- **Nueva: `close-quarterly-plan`** *(o lógica equivalente)* — asistencia para el `final_assessment` y la sugerencia de `outcome` por foco al cierre, y para sintetizar/recoger los retrospectives del periodo. Marca el plan `completed`.

## 11. Fuera de alcance (futuro)

- Integración SwingVision, UTR automatizado, y match stats (first serve %, break points won) como `measurement_method` objetivos. El diseño del objetivo debe permitir que entren como método de verificación sin re-arquitectar.
- Planning forward-looking que ingiera **todo el historial** del atleta (todos los reportes, tests, UTR, torneos a lo largo de su carrera) para proponer baselines y targets automáticamente. Crítico, pero hoy no hay datos suficientes; se habilita conforme se acumulen reportes. **Nota:** el handoff del periodo *inmediatamente anterior* (§7.1) **no** es parte de este futuro — ya está en el modelo core.

## 12. Decisiones abiertas → resueltas

Las dos decisiones abiertas originales quedaron resueltas en la sesión del 26 Jun 2026 (§13): el set de estándares de cierre **sí** se adopta (no solo "consistente"), y `objective_text` se **depreca**. El detalle completo de aterrizaje vive en §13.

## 13. Decisiones de aterrizaje (resueltas 26 Jun 2026)

Resoluciones tomadas para hacer v2 construible. Esta sección es la fuente de verdad sobre el *cómo*; §1–§11 describen el *qué*.

### Anclas
- **Generadas por el LLM, no plantilla fija.** Cada ancla depende del objetivo de la sub-dimensión específica, así que el LLM recomienda las 5 descripciones (de `−2 Estancado` a `+2 Superado`) según el contexto del objetivo.
- **Peldaños hardcodeados, descripción variable.** El eje `−2..+2` y sus etiquetas (Estancado→Superado) son fijos; lo que cambia por objetivo es la *descripción* de cada peldaño. Las anclas son la representación objetiva del avance de ese objetivo.
- **El coach aprueba, lo discute con el atleta.** El LLM propone; el coach valida y lo conversa con el atleta. Esa aprobación es el control de calidad humano.

### Semántica de la escala (corrección 26 Jun)
- La escala `−2..+2` mide **trayectoria contra el plan**, no posición absoluta. El **baseline se define en el plan** y corresponde a `0 = por buen camino` (el default al crear el foco).
- `+1/+2` = adelantado/superado vs el plan; `−1/−2` = rezagado/estancado vs el plan.
- **Un foco nuevo arranca en `0`.** La única forma de que un foco *entre* en `−2` al crear el plan es por **carryover de un periodo anterior que terminó rezagado**.
- Consecuencia para la generación: las anclas describen la **trayectoria esperada y sus desviaciones**, no el estado-problema inicial. El `0` se redacta como "va por buen camino según el plan", **no** como "el problema persiste". `−2` se redacta como estancado/sin avance, no como "el estado actual del diagnóstico".

### Medición mensual
- **El reporte mensual captura el valor direccional `−2..+2`** por sub-dimensión. Esa es la medición.
- **Mantenimiento también se mide.** Que una dimensión sea de mantenimiento no significa que no se evalúe: si una de mantenimiento sale `−1` o `−2`, el atleta no sostuvo el nivel → candidata fuerte a foco del siguiente trimestre.
- **Calendario de evaluaciones.** Como aún no se lanza, no hay alineación previa: se define una ventana — evaluación mensual permitida hasta ~1 semana después del cierre de mes.

### Cierre del loop
- **El coach confirma el cierre; el sistema recomienda** el `outcome` por foco con base en el feedback de coach y atleta del trimestre.
- **`athlete_retrospective` con el mismo UI** (se reusa el de observaciones/AthleteVoice). El retrospective es único por trimestre: al completar la dimensión se "activa" el cierre de observaciones para que concluyan atleta y coach.
- **El retrospective del atleta NO bloquea el cierre.** El que cierra el periodo es el del coach.
- **Recordatorio de cierre.** Al final de la semana posterior al trimestre se dispara un recordatorio que cierra el periodo y abre el siguiente.

### Estándar del objetivo (§4)
- **Se adopta un set de estándares de cierre, no solo "de forma consistente".** `bajo presión` y `sin recordatorio` son estándares válidos (ej. usar rituales para calmar nervios entre puntos → `sin recordatorio`). El LLM elige el estándar según el objetivo.

### `objective_text` (§9)
- **Depreciar y eliminar.** Redundante. Solo hay dos planes dummy hechos por Marco → se archivan o eliminan, sin migración.

### HITL del coach (revisión por feedback, no edición)
- **El coach no edita el plan directamente** (por ahora). Solo puede **comentar qué salió mal y regenerar**: el comentario entra como input a una nueva corrida de generación, en loop, hasta que el plan le represente. Esto mantiene el objetivo y las anclas como artefacto generado/consistente, no editado a mano.
- **Framing en la UI:** nunca "revisa y evalúa para mejorar el modelo". El copy es *"revisa que el plan represente los objetivos que quieres proponer; si no estás de acuerdo, comenta qué cambiar y regenera"*. El propósito de mejora del modelo es interno, no se le pide al coach explícitamente.
- **La generación es de un solo tiro; la única regeneración la dispara el coach.** En v2 no hay auto-regeneración: el validador (`validate-quarterly-plan`) es **advisory** — muestra flags al coach (como los warnings amarillos actuales) para que sepa contra qué evaluar; no regenera nada por su cuenta. Flujo: generar → coach revisa → coach comenta → regenerar con su comentario → repetir hasta conforme.
- **Regenerar exige al menos un comentario (regla dura).** El coach no puede regenerar con feedback vacío. Un regenerar sin comentario equivaldría a decir "el modelo ya hizo bien su trabajo" y de ahí sale el drift. La UI bloquea el botón de regenerar hasta que haya ≥1 comentario.
- **Auto-regen = enhancement futuro.** Una vez que la tabla de feedback acumule algunas iteraciones, auto-regenerar contra la rúbrica se vuelve viable y útil. No es parte de v2, pero el diseño (validador + tabla de feedback) ya deja el camino listo.
- **El `diagnostico` lo genera el LLM, fiel al dump.** El coach escribe el dump libre; el LLM extrae el `diagnostico` de cada foco parafraseando fielmente, sin inventar (regla 5). El coach no lo escribe a mano.
- **Tabla de feedback (day-one), con linaje.** Cada generación y cada regeneración escribe **una fila con id nuevo**, ligada al `plan_id` y a la **versión inicial** de la que descienden las regeneraciones. Esquema propuesto `objective_generation_log`:
  - `id` — id propio de esta corrida.
  - `root_id` — id de la **generación inicial** del foco; todas las regeneraciones comparten el mismo `root_id`.
  - `parent_id` — id de la corrida inmediatamente anterior (nullable para la inicial).
  - `plan_id`, `objective_id` (nullable hasta guardar), `athlete_id`, `coach_id`, `period`.
  - `mode` — `identify` / `generate` / `regenerate`.
  - `prompt_version`, `model`.
  - `input_observations` — el dump del coach.
  - `input_bundle` (jsonb, nullable) — el **bundle del periodo previo** (§7.1): focos anteriores con `objetivo`, `outcome`, trayectoria de los 3 scores y retrospectives. En cold-start / primera rebanada es null.
  - `coach_feedback` (text, nullable) — el comentario del coach que disparó esta regeneración.
  - `validator_result` (jsonb) — resultado de la rúbrica por criterio.
  - `output` (jsonb) — el foco generado (diagnóstico + objetivo + anclas).
  - `created_at`.

  El par `(parent.output + coach_feedback) → output` es justo el ejemplo de entrenamiento para fine-tunear los prompts de generación y evaluación. No es el coach evaluando para nosotros; es el subproducto natural del loop.

### Calidad / eval set
- **No se construye pipeline HITL externo a baja escala.** A este volumen, un pipeline externo con judges es tunear contra casi cero datos. En su lugar:
  - La rúbrica corre **dentro de la generación** (`validate-quarterly-plan` / self-check) antes de mostrar al coach.
  - La rúbrica es **visible en el paso de revisión** del coach (para que sepa contra qué está revisando).
  - El **loop de comentario→regeneración ES el HITL**, y su registro alimenta el fine-tune.
- **El eval set se siembra con las muestras de los primeros planes reales** y con la tabla de feedback. Es el mecanismo de mantenimiento de calidad; el judge automático/híbrido se gana el derecho a existir cuando haya volumen.
- **Rúbrica de "anclas bien diferenciadas":** monotonía (cada peldaño más exigente que el anterior), mutuamente excluyentes, observable (el coach asigna sin adivinar), semántica de escala correcta (`0` = por buen camino vs plan, `+2` = superado, `−2` = estancado/rezagado vs plan — **no** "estado actual"), gramática §4 respetada.
- **Criterio de horizonte trimestral (validador).** El validador debe asegurar que cada objetivo sea **alcanzable y medible en 3 meses**, no un resultado de largo plazo. Razón: el coach escribe observaciones, no planes estructurados — mezcla corto plazo (técnica) con resultados de carrera (ranking, "Top 100 ITF", competir en Europa). El plan es trimestral por diseño, así que estructurar el horizonte es trabajo del sistema, no del coach.
  - Un **resultado** (posición de ranking, título) **no es un objetivo trimestral** salvo que sea alcanzable dentro del periodo (p. ej. atleta ya en top ~120 → top 100 sí es medible en el trimestre). Top 100 ITF para un U12 que recién entra es un resultado de carrera y debe quedar fuera del plan trimestral.
  - El validador flaggea (advisory) los objetivos que lean a largo plazo para que el coach los reformule o los baje a alcance trimestral.

### Secuencia de build
- **Paso por paso, no todo de un jalón.** El cierre + handoff se codifican pero solo se validan de verdad cuando ocurra el primer cierre real (a los 3 meses).
- **Primera rebanada:** transformación del dump de observaciones del coach → recomendación de dimensiones + anclas (§21 de la discusión = paso 3+4 del flujo §8).

### Open items (fuera de v2)
- **Trabajo "dentro" de un periodo.** Hoy todo es a 3 meses; qué hacer con una dimensión que urge atender a mitad de trimestre queda sin diseñar.
- **Catálogo físico + baselines.** No existe. Physical no es construible hasta definir métricas, unidades y protocolos de test. El resto de v2 (técnica/táctica/carácter) no depende de él.

## 14. Refinamientos del primer test en vivo (27 Jun 2026)

Marco corrió el flujo con dumps reales. Hallazgos y decisiones:

### Calidad de generación
- **Objetivos demasiado genéricos.** El modelo salía con "mejorar la selección de golpe…". Corregido con la **gramática de prescripción** (§4): el objetivo prescribe directamente sobre el comportamiento observado, con verbos de cambio concreto y prueba de especificidad. Few-shot con los dos ejemplos de Marco metido al prompt (`pm-v2.1`).
- **Regenerar copiaba el feedback verbatim.** Cuando el coach proponía un objetivo en su comentario, el modelo lo pegaba tal cual e ignoraba la estructura. Corregido: el prompt de regeneración ahora instruye **reescribir** la idea del coach con la estructura (prescripción + dirección + estándar) y reajustar las anclas — no copiar literal.

### Selección de focos
- **Priorización por urgencia.** `identify` ahora devuelve `urgencia` (alta/media/baja) por sub-dimensión; la UI ordena y pre-selecciona los focos más urgentes. Resuelve que a veces tomara una fortaleza (la derecha "es su arma") como foco. La urgencia = magnitud/percepción del problema, no solo presencia.

### UX / integridad (construible, pendientes)
- **Estado `draft` persistente.** Hoy si el coach va hacia atrás o sale, pierde el progreso. Debe guardarse un draft: el dump, los focos seleccionados, y los objetivos generados, para retomar después sin perder trabajo. (Task Dev.)
- **Un plan por atleta por periodo.** Hoy se pudieron crear dos planes para el mismo atleta/periodo. Debe bloquearse crear uno nuevo si ya existe para ese atleta+periodo, salvo que se borre el existente o pase la fecha del tercer reporte. (Task Dev.)
- **Edición de plan a mitad de trimestre.** Si necesitan ajustar el plan dentro del periodo, debe poderse — pero queda en **backlog**, no vale la pena complicarlo ahora. (Task Dev, baja prioridad.)

### Voz y grabaciones (epic priorizado)
Marco quiere priorizar voz en tres frentes:
1. **Dump por voz.** El input del plan (las observaciones antes de `identify`) se puede dictar por voz en vez de escribir, y se transcribe.
2. **Log de anotaciones por atleta.** Los coaches graban notas de entrenamiento/partido en cualquier momento (p. ej. a mitad del 2º set de un torneo), ligadas al atleta del lado del coach. Los transcripts se procesan y se acumulan como **record de observaciones por atleta**, insumo para seguimiento de planes y generación de nuevos.
3. **Revisión/regeneración por voz.** Los comentarios de regeneración se pueden dictar y se procesan a texto. Además, el dump puede incorporar el **summary de las notas de voz del punto 2** para "endulzar" el contenido y generar mejores focos.

## 15. Segundo test en vivo (27 Jun 2026) — 3 edge cases

- **Dump vago/superficial (edge case 1).** El modelo inventa cuando el dump no tiene mecánica (*"la derecha está bien aunque puede mejorar"* → *"reducir el margen de error…"*, que el coach nunca pidió). **Decisión:** agregar un **guardrail no-bloqueante** en el paso del dump: un warning que avise que las observaciones no son lo suficientemente detalladas/concretas para generar focos completos, sin impedir continuar. (Task Dev.)
- **Fortalezas + un foco urgente (edge case 2).** Funcionó bien y sin cambios. Confirmado como válido que un plan tenga **un solo foco** y el resto en mantenimiento (puede reflejar un avance importante que se quiere sostener). El patrón "mantener…" en las no-foco gustó.
- **Coach que prescribe (edge case 3).** Persiste el loro-repetidor: convierte el síntoma en instrucción literal. **Corregido con prescripción estructural** (§4, `pm-v2.2`): el objetivo apunta a la causa estructural/mecánica, no al síntoma invertido.

## 16. Tercer test en vivo (1 Jul 2026) — Caso 1 (Mariana), dumps sintéticos de edge cases

Marco construyó un set de 5 dumps sintéticos para cubrir edge cases de calidad de input (`docs/dumps-test-planning-edge-cases.md`) y corrió el Caso 1 (Mariana — completo y bien definido). Hallazgos:

### UX — re-identificación innecesaria (corregido)
- **Bug:** si el coach identificaba focos, volvía al paso 2 a editar el dump y regresaba sin haber cambiado el texto, el sistema volvía a llamar a `identify` de cero — recalculando (y potencialmente reordenando/perdiendo) la lista de focos ya revisada.
- **Fix:** se cachea el texto del dump al momento de identificar (`lastIdentifiedObs`). Si el coach vuelve a "Identificar focos →" con el mismo texto, se navega directo al paso 3 sin llamar al modelo. Si el texto cambió, sí se re-identifica. (Task Dev, resuelto en la misma sesión.)

### Rúbrica de objetivos — falta anclaje a la filosofía de la academia (hueco nuevo)
- **Problema.** El objetivo generado puede cumplir la gramática (§4) y aun así ser vago *sustantivamente*, porque la observación del coach ya viene con la solución implícita en vez de describir el síntoma. Ejemplo real (Mariana, `transferencia_partido`):
  - Observación: *"en set de práctica o torneo el nivel de ejecución baja notoriamente comparado con el entrenamiento controlado"*.
  - Objetivo generado: *"Mantener el nivel de ejecución del entrenamiento controlado durante sets de práctica y torneo, en situaciones de partido"*.
  - El objetivo es prácticamente un calco de la observación — "mantener el nivel de ejecución en partido" es la solución obvia a "baja el nivel en partido", no una prescripción concreta. La causa real (qué hace distinto en entrenamiento vs. partido) no está en la observación, así que el LLM no tiene de dónde sacar la prescripción concreta.
- **Segundo hueco relacionado (calidad de la observación misma):** el ejemplo anterior también expone que la observación no está lo bastante bien construida para la dimensión — describe el síntoma (baja el nivel) pero no el comportamiento observable de la causa. Contraste con una observación bien construida para `transferencia_partido`: *"juega con mucha energía y confianza en su derecha en entrenamiento, pero en partidos pierde esa energía y solo pasa la bola sin proponer"* — aquí sí hay algo concreto y accionable (la energía/confianza en la ejecución del golpe) del cual el LLM puede prescribir sin inventar.
- **Decisión:** esto no se resuelve con más reglas sueltas en el prompt — hace falta una **rúbrica explícita y un skill dedicado** (tanto para verificar observaciones como para generar/evaluar objetivos) que codifique la filosofía de la academia sobre qué hace a una observación y a un objetivo "sustanciales", no solo gramaticalmente correctos. Se agregan dos items de backlog (Team, Phase 2 — Analytics), ligados al rediseño de evals:
  1. **Rúbrica/skill — objetivos alineados a la filosofía de la academia.**
  2. **Rúbrica/skill — verificación de observaciones** (que cada dimensión identificada traiga algo concreto y accionable, no solo la etiqueta del síntoma).
  Ambos items necesitan su propio doc de scoping antes de construirse — no son ajuste de prompt, son trabajo de producto/filosofía primero.

### Dimensiones numéricas (physical) — sin definir (hueco ya conocido, reconfirmado)
- El Caso 1 tocó `beep_test` de forma cualitativa ("no es de fuerza, es de resistencia") porque no hay catálogo de baselines/targets/unidades para `physical` (ya señalado en §11 "Fuera de alcance"). Se reconfirma como bloqueante para que `physical` tenga objetivos tan medibles como técnica/táctica/carácter.
- **Decisión:** nuevo item de backlog (Team) — definir observaciones y objetivos esperados específicamente para las sub-dimensiones numéricas (`beep_test`, `spider_drill`, `sprint_20m`, `salto_vertical`, `fuerza_inferior`, `fuerza_superior`, `fms`), con su propio doc de scoping. No se resuelve dentro de este ciclo de build.

## 17. Cuarto test en vivo (1 Jul 2026) — Caso 2 (Emilio, narrow)

### Bug — `identify` dependía de marcadores de estructura (corregido)
- Con el dump enumerado ("Uno: la derecha... Dos: el manejo de riesgo...") `identify` detectaba las dos sub-dimensiones bien. Al quitar "Uno:"/"Dos:" y dejar el mismo contenido en prosa corrida, dejó de reconocer `manejo_riesgo` — solo detectaba `forehand`.
- **Fix (`pm-v2.4`):** regla explícita en `IDENTIFY_SYSTEM` de no depender de numeración/viñetas/marcadores para separar temas — leer por contenido. Caso de regresión agregado como **Caso 2b** en `docs/dumps-test-planning-edge-cases.md`.

### Aclaración — el estándar "sin recordatorio" no es un edge case, es un estándar válido
- Salió `estandar_usado: "sin recordatorio"` en un objetivo de `manejo_riesgo` (táctica). No es un bug: §13 ya definió `sin recordatorio` como uno de los tres estándares válidos ("bajo presión" y "sin recordatorio" además del default "de forma consistente"), elegido por el LLM según el objetivo — sin restricción de dimensión. Significa que el atleta sostiene el comportamiento sin que el coach se lo tenga que recordar en el momento (aplicable a táctica igual que a carácter, no es exclusivo de una dimensión).
- **Decidido (1 Jul 2026):** no se agrega tooltip por ahora. Queda como está — se revisita si vuelve a generar confusión, o cuando se construya la rúbrica/skill de objetivos (§16).

### Tono y nombre del atleta en diagnóstico/objetivo (corregido)
- El dump de Emilio frasea el manejo de riesgo como juicio directo a la persona ("Emilio no tiene término medio") y usa su nombre. Riesgo: si el `diagnostico` (que debe ser "fiel al dump", §13) hereda ese tono y nombre, se siente como un ataque cuando el coach lo discuta con el atleta — el diagnóstico/objetivo eventualmente son material de conversación con el atleta, no solo input interno.
- **Fix (`pm-v2.4`):** regla nueva en `GENERATE_SYSTEM` — nunca usar el nombre del atleta en diagnóstico/objetivo, y traducir crítica directa a la persona en conducta observable, sin inventar ni perder el contenido.
- **Decisión relacionada:** la convención de tono/nombre se agrega también a las notas del task de backlog "Rúbrica/skill — verificación de observaciones" (§16), porque el mismo criterio debe aplicar hacia atrás — cómo el coach redacta la observación, no solo cómo el LLM redacta la salida.
