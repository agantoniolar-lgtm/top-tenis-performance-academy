# Scope — Rúbrica/skill: objetivos alineados a la filosofía de la academia

**Estado:** Borrador para revisión de Marco. No construir hasta aprobar.
**Fecha:** 8 Jul 2026
**Task Notion:** P&M — Rúbrica/skill: objetivos alineados a la filosofía de la academia (Team, Phase 2 — Analytics, Priority High) — movido a In Progress al abrir este doc.
**Contexto previo:** `docs/scope-planning-measurement.md` §16 (hueco original, Caso Mariana) y §19 (Caso Diego, 4 fallas adicionales).
**Relacionado:** `docs/scope-rubrica-observaciones.md` (rúbrica hermana, ya cerrada — pm-v2.9, deployada). Esa rúbrica evalúa el **insumo** (la observación del coach); esta evalúa la **salida** (el objetivo generado). Si la observación es débil, esta rúbrica hereda el problema sin poder resolverlo por sí sola — por eso esa rúbrica se construyó primero.

---

## 1. Problema

`generate-quarterly-plan` puede producir un objetivo que cumple la gramática esperada (sujeto implícito, verbo de acción, estándar de cierre — §4 de `scope-planning-measurement.md`) y aun así fallar sustancialmente. Los live tests expusieron cuatro variantes distintas de esta falla, no una sola:

**(a) Calco de la observación (Caso Mariana, `transferencia_partido`).** Observación: *"en set de práctica o torneo el nivel de ejecución baja notoriamente comparado con el entrenamiento controlado"*. Objetivo generado: *"Mantener el nivel de ejecución del entrenamiento controlado durante sets de práctica y torneo"*. El objetivo es la negación literal del síntoma, no una prescripción — no dice **qué hacer distinto**, solo repite que debería ser distinto.

**(b) Anti-invención violada en el objetivo (Caso Diego).** Observaciones delgadas generan detalle no dicho por el coach: *"la volea es muy floja"* → diagnóstico agrega *"y carece de potencia"*; *"la devolución necesita mejorar bastante"* → diagnóstico agrega *"en precisión y agresividad"*. Ya existe una regla anti-invención en `GENERATE_SYSTEM`, y aun así falla — mismo patrón que ya vimos en la rúbrica de observaciones (regla simple, cumplimiento no confiable sin ejemplos concretos).

**(c) Vínculo causal no fiel al diagnóstico (Caso Diego).** Para "volea floja sin potencia", el objetivo prescribe *"una correcta preparación y ejecución del golpeo"* como si esa fuera LA causa — pero pudo ser falta de paso cruzado, brazo libre sin estabilizar, raqueta preparada abajo, etc. El coach nunca especificó cuál. El objetivo inventa causalidad, no solo detalle.

**(d) Objetivo institucional, no conducta del atleta (Caso Diego, `liderazgo`).** Observación: *"está callado y le falta liderazgo y comunicación"*. Objetivo generado: *"Fomentar la comunicación y el liderazgo en el grupo mediante intervenciones activas durante los entrenamientos"* — esto suena a algo que **la academia** debe hacer, no a una conducta que **el atleta** debe mostrar.

**(e) Límite objetivo vs. acción confuso (Caso Diego, `fuerza_inferior`).** *"Desarrollar la fuerza en las piernas mediante ejercicios específicos de resistencia y potencia"* se lee más como un plan de entrenamiento (acción) que como un objetivo medible (estado a alcanzar). Conecta con la idea de backlog "Acciones" (feature separada, sin scope, prioridad baja — ver §18 de `scope-planning-measurement.md`) — el objetivo y la acción son cosas distintas y esta rúbrica necesita trazar la línea.

Ninguna de estas cinco se resuelve con una regla suelta más en el prompt — es exactamente el mismo diagnóstico que motivó la rúbrica de observaciones: hace falta una anatomía verificable de qué hace a un objetivo "sustancial" según la filosofía de la academia, no solo gramaticalmente correcto.

## 2. Qué NO es esta rúbrica

- No reescribe el objetivo por su cuenta. Guardrail **advisory**, mismo principio que la rúbrica de observaciones (§13 de `scope-planning-measurement.md`): flaggea, el coach decide.
- No es la rúbrica de observaciones. Esta evalúa la salida (§3, abajo); aquella evalúa el insumo.
- No es la feature de "Acciones". El límite entre objetivo y acción (problema (e)) es parte de esta rúbrica porque hay que **detectar** cuándo un objetivo se disfraza de acción — pero generar acciones concretas es una feature aparte, todavía sin scope.
- No decide el contenido específico del objetivo. Decide si el objetivo generado tiene material y forma suficiente para ser una prescripción sustancial y fiel, no inventada.

## 3. Anatomía de un objetivo bien formado (draft — pendiente de confirmar con Marco)

Cada fila corresponde a uno de los cinco problemas de §1.

| Componente | Obligatorio | Ejemplo bueno | Ejemplo malo |
|---|---|---|---|
| **1. Prescripción sustancial (no calco)** — el objetivo agrega algo más allá de negar el síntoma | Sí | Objetivo distinto de "mantener/mejorar X" cuando la observación ya dice "falta X" | "Mantener el nivel de ejecución en partido" para "baja el nivel en partido" — es la misma frase en espejo |
| **2. Fidelidad anti-invención** — ningún detalle del objetivo aparece si no está en la observación o el diagnóstico | Sí | Objetivo que solo prescribe sobre lo que el diagnóstico ya estableció | "Carece de potencia" cuando el coach solo dijo "es muy floja" |
| **3. Vínculo causal fiel** — si el objetivo nombra una causa/mecanismo, esa causa está en el diagnóstico, no inventada | Sí | Objetivo que prescribe sobre el mecanismo que el coach sí describió | "Corregir la preparación y ejecución del golpeo" cuando el coach nunca especificó qué falla en la preparación |
| **4. Sujeto = el atleta, no la academia/coach** — la conducta a lograr es del atleta | Sí | "Tomar la iniciativa de comunicarse con el equipo durante los entrenamientos" | "Fomentar la comunicación... mediante intervenciones activas" (sujeto implícito = el coach/la academia) |
| **5. Objetivo, no acción** — describe un estado/conducta medible a alcanzar, no una lista de ejercicios/método | Sí | "Sostener el ritmo de piernas en el tercer set" | "Desarrollar la fuerza... mediante ejercicios específicos de resistencia y potencia" (es un plan de entrenamiento) |

**Nota metodológica:** a diferencia de la rúbrica de observaciones (que evalúa el *insumo* aislado), esta rúbrica necesariamente compara el objetivo **contra** la observación y el diagnóstico que lo originaron — no puede evaluarse el objetivo en el vacío. Esto probablemente cambia el "shape" del guardrail: no es un check sobre un string suelto, es un check relacional (objetivo vs. diagnóstico vs. observación).

## 4. Decisiones confirmadas por Marco (8 Jul 2026)

1. **Nombres de los 5 componentes:** confirmados tal cual quedaron en la tabla de §3.
2. **Los 5 componentes son correctos.** (2) Fidelidad anti-invención y (3) Vínculo causal fiel se mantienen separados a propósito — se complementan sin empalmarse: (2) mide que el modelo no invente detalle de la nada; (3) mide que la prescripción sea la correcta para la causa observada (no solo "no inventada", sino "apuntada a lo correcto").
3. **Ningún componente es bloqueante por sí solo, por ahora.** A diferencia de "Mecanismo" en la rúbrica de observaciones, aquí los 5 quedan con el mismo peso mientras se corre la primera regresión — se revisita la jerarquía con más data real.
4. **Corrección de arquitectura (no eran 3 funciones separadas):** `generate-quarterly-plan` es una sola Edge Function con un switch por `mode` (`identify` | `generate` | `regenerate` | legacy). No existe `validate-quarterly-plan`. `IDENTIFY_SYSTEM` y `GENERATE_SYSTEM` son dos constantes de texto completamente separadas — el switch no las mezcla, cada modo solo ve su propio prompt. La rúbrica de observaciones vive únicamente dentro de `IDENTIFY_SYSTEM`; hoy `GENERATE_SYSTEM` no tiene ninguna rúbrica de objetivos, solo la caja estática `RubricaBox` en el paso 4 de la UI (texto fijo, no calculado por foco).

## 5. Decisión de arquitectura: opción 1 — self-eval dentro de `GENERATE_SYSTEM`

Dos opciones evaluadas:

- **Opción 1 (elegida):** concatenar una nueva constante `RUBRICA_OBJETIVOS` dentro de `GENERATE_SYSTEM` (mismo patrón que `RUBRICA_OBSERVACIONES` dentro de `IDENTIFY_SYSTEM`). El modelo agrega un campo nuevo al JSON que ya devuelve por foco — una sola llamada, mismo costo/latencia de hoy.
- **Opción 2 (descartada por ahora):** segunda llamada independiente, con su propio prompt chico enfocado solo en juzgar (no en escribir), después de que `generate`/`regenerate` ya produjeron el objetivo. Más confiable en teoría (el juicio no compite por atención con la redacción), pero +1 llamada a OpenAI por plan.

**Por qué la 1 por ahora:** el switch no contamina prompts entre modos (confirmado en §4.4) — el riesgo real de la opción 1 no es contaminación cruzada, es densidad *dentro* de `GENERATE_SYSTEM` (ya es un prompt largo: gramática, anti-invención, ejemplos, prescripción estructural, tono, ejes de anclas). Se acepta ese riesgo y se valida empíricamente corriendo los 5 casos sintéticos — si aparece el mismo patrón de incumplimiento que tomó 2-3 vueltas resolver en la rúbrica de observaciones (§15-18 de `scope-rubrica-observaciones.md`), se escala a la opción 2.

**Contrato de salida (propuesta):** cada foco en `focos[]` agrega:
```json
"objetivo_suficiente": true,
"objetivo_motivo": "<qué componente falla, cadena vacía si pasa>"
```
**Consecuencia en UI:** este campo sustituye el texto fijo de `RubricaBox` (línea 1041, `PlanesCoach.jsx`) por un aviso condicional por `FocoCard`, igual patrón que el aviso de `observacion_suficiente` en el paso 3 (línea 968).

## 6. Módulo de rúbrica — draft de `RUBRICA_OBJETIVOS`

Borrador del texto a concatenar dentro de `GENERATE_SYSTEM`, calibrado con los casos reales ya documentados (Mariana, Diego). Pendiente de aprobación antes de tocar código.

```
RÚBRICA — ¿ES EL OBJETIVO UNA PRESCRIPCIÓN SUSTANCIAL Y FIEL? (rubrica-objetivos-v1-2026-07-08)
Antes de responder, evalúa CADA objetivo que generes contra esta anatomía, comparándolo contra el
"read_corto"/diagnóstico que lo originó (no lo evalúes en el vacío):

1. Prescripción sustancial (no calco) — el objetivo debe agregar algo más allá de negar el síntoma.
   Si la observación dice "falta X", el objetivo NO puede ser simplemente "mantener/mejorar X" en espejo.
2. Fidelidad anti-invención — todo detalle del objetivo debe rastrearse al read_corto/diagnóstico.
   Ya existe esta regla en general; aquí se evalúa específicamente sobre el objetivo final.
3. Vínculo causal fiel — si el objetivo nombra una causa o mecanismo, esa causa debe estar explícita
   en el diagnóstico. Si el coach no especificó la causa, el objetivo no puede asumir una.
4. Sujeto = el atleta, no la academia/coach — la conducta prescrita es algo que EL ATLETA hace,
   nunca algo que la academia/coach debe hacer "para" o "con" el atleta.
5. Objetivo, no acción — el objetivo describe un estado o conducta medible a alcanzar, no un método
   o lista de ejercicios para llegar ahí.

REGLA DE SUFICIENCIA: "objetivo_suficiente": true solo si el objetivo pasa los 5 componentes.
Si falla cualquiera, "objetivo_suficiente": false y "objetivo_motivo" indica cuál(es) falla(n).

EJEMPLOS DE CALIBRACIÓN — casos reales que deben marcarse false:
- Obs: "en set de práctica o torneo el nivel de ejecución baja notoriamente comparado con el
  entrenamiento controlado" → objetivo "Mantener el nivel de ejecución del entrenamiento controlado
  durante sets de práctica y torneo": falla (1) — es la negación literal del síntoma, no dice QUÉ
  hacer distinto.
- Obs: "la volea es muy floja" → diagnóstico "y carece de potencia": falla (2) — "carece de potencia"
  no está en la observación, es invención.
- Obs: "la volea es muy floja, sin potencia" → objetivo "una correcta preparación y ejecución del
  golpeo": falla (3) — asume que la causa es la preparación, cuando el coach nunca especificó qué
  falla en el mecanismo (¿paso cruzado? ¿brazo libre? ¿raqueta baja?).
- Obs: "está callado y le falta liderazgo y comunicación" → objetivo "Fomentar la comunicación y el
  liderazgo en el grupo mediante intervenciones activas durante los entrenamientos": falla (4) — el
  sujeto implícito es el coach/la academia ("fomentar... mediante intervenciones"), no el atleta.
- Obs: "le falta fuerza en las piernas, se le nota" → objetivo "Desarrollar la fuerza en las piernas
  mediante ejercicios específicos de resistencia y potencia": falla (5) — es un plan de entrenamiento
  (qué ejercicios hacer), no un objetivo medible (qué conducta/estado alcanzar).

CONTRASTE — estos SÍ pasan los 5 componentes:
- "Reducir el tiempo de preparación de la volea para llegar atacando de frente, en situaciones de
  punto" — agrega prescripción concreta (1), no inventa detalle no dado (2), no asume causa no dicha
  (3), sujeto es el atleta (4), describe conducta medible no un método (5).
- "Tomar la iniciativa de comunicarse con el equipo durante los entrenamientos" — sujeto es el
  atleta, no la academia (4), y es conducta medible, no un programa de intervenciones (5).
```

**Nota:** este draft reusa el ejemplo de volea de Diego en dos calibraciones distintas ((2) y (3)) a propósito, porque son la misma observación fallando en dos componentes distintos — ilustra por qué se mantienen separados (decisión de §4.2).

## 8. Regresión de los 5 casos sintéticos (8 Jul 2026) — `pm-v3.0-2026-07-08` (v14, deployado)

Corrida de `identify` + `generate` sobre los 5 casos de `docs/dumps-test-planning-edge-cases.md` (misma metodología que la rúbrica de observaciones: invocación vía extensión Postgres `http`, instalada y removida solo para la corrida — no queda como dependencia). Para Sofía y Diego (cuyas observaciones ya salieron `observacion_suficiente: false` en `identify`) se generó objetivo de todas formas, simulando que el coach elige avanzar pese a la advertencia — es el caso más importante de probar porque es donde el modelo tiene más incentivo a inventar.

| Caso | Foco | Objetivo generado | Veredicto real (anatomía §3/§6) | `objetivo_suficiente` reportado |
|---|---|---|---|---|
| Mariana | serve | "Aumentar la efectividad del segundo saque con mayor kick..." *(nota: texto real fue sobre velocidad/efecto)* | Pasa | **true (correcto)** |
| Mariana | puntos_clave | "Ejecutar el patrón de juego habitual en puntos clave..." | Pasa | **true (correcto)** |
| Mariana | transferencia_partido | "Mantener la intensidad y nivel de ejecución del entrenamiento controlado durante sets de práctica y torneo" | **FALLA (1) — calco casi textual del ejemplo real que motivó todo este doc (§1a)** | **true (INCORRECTO)** |
| Mariana | beep_test | "Aumentar la resistencia en el tercer set..." | Pasa | **true (correcto)** |
| Mariana | coachabilidad | "Consolidar las correcciones aplicadas en cada sesión..." | Pasa | **true (correcto)** |
| Emilio | forehand | "Reducir la apertura de la preparación..." | Pasa | **true (correcto)** |
| Emilio | manejo_riesgo | "Establecer una selección intermedia de riesgo..." | Pasa | **true (correcto)** |
| Sofía | forehand | "Ajustar el ángulo de golpeo en la derecha..." (diagnóstico: "está bien, aunque puede mejorar") | **FALLA (2)+(3) — "ángulo de golpeo" es invención total, el diagnóstico no menciona ningún mecanismo** | **true (INCORRECTO)** |
| Sofía | fuerza_inferior | "Incrementar la fuerza en las piernas mediante ejercicios específicos de resistencia" | **FALLA (5) — reproduce casi textual el ejemplo de calibración que enseñamos como malo** | **true (INCORRECTO)** |
| Sofía | etica_trabajo | "Mantener la concentración durante los puntos críticos..." | Pasa (consistente con la decisión de Marco de aceptar esta observación, §16 de la rúbrica de observaciones) | **true (correcto)** |
| Sofía | coachabilidad | "Aumentar la regularidad en la ejecución de golpes..." (diagnóstico: "más constante en general") | **FALLA (2) — "ejecución de golpes" no está en el diagnóstico, es invención** | **true (INCORRECTO)** |
| Diego | volea | "Aumentar la potencia de la volea mediante una correcta preparación y ejecución del golpeo" | **FALLA (3) — reproduce CASI TEXTUAL el ejemplo de calibración que enseñamos como malo** | **true (INCORRECTO)** |
| Diego | devolucion | "Mejorar la ejecución de la devolución para lograr un contacto más sólido..." | **FALLA (2) + usa el verbo "mejorar" que la gramática ya prohíbe explícitamente** | **true (INCORRECTO)** |
| Diego | manejo_riesgo | "Establecer una estrategia de selección de golpes más equilibrada..." | Dudoso — "selección de golpes" no está explícito en el diagnóstico (falla (3) parcial) | **true (dudoso/incorrecto)** |
| Diego | fuerza_inferior | "Incrementar la fuerza en las piernas mediante ejercicios específicos de resistencia y potencia" | **FALLA (5) — reproduce TEXTUALMENTE el ejemplo de calibración que enseñamos como malo** | **true (INCORRECTO)** |
| Diego | liderazgo | "Tomar la iniciativa de comunicarse con el equipo durante los entrenamientos..." | Pasa (coincide con nuestro ejemplo de calibración bueno) | **true (correcto)** |
| Kevin | serve | "Aumentar la efectividad del segundo saque con mayor kick..." | Pasa | **true (correcto)** |
| Kevin | devolucion | "Atacar la devolución del segundo saque para lograr un contacto más agresivo..." | Pasa | **true (correcto)** |
| Kevin | seleccion_golpe | "Mantener una selección de golpe más estratégica..." | Pasa | **true (correcto)** |
| Kevin | beep_test | "Incrementar la resistencia física para mantener el rendimiento en el tercer set..." | Pasa | **true (correcto)** |
| Kevin | liderazgo | "Fomentar la comunicación activa y la regulación emocional... para mejorar el liderazgo en el grupo" | **FALLA (4) — "Fomentar... para mejorar el liderazgo en el grupo" es casi el mismo patrón institucional del ejemplo de calibración malo** | **true (INCORRECTO)** |

### Lectura de conjunto — la opción 1 (self-eval) NO pasa la regresión

**21 objetivos generados, 10 incorrectamente marcados `objetivo_suficiente: true` (~48%).** El patrón es mucho peor que cualquier cosa vista en la rúbrica de observaciones:

1. **El modelo reprodujo, casi palabra por palabra, 3 de los ejemplos que le dimos explícitamente como "esto está mal"** (Mariana/`transferencia_partido`, Diego/`volea`, Diego/`fuerza_inferior` — este último es una reproducción textual completa del ejemplo de calibración) — y aun así los marcó `objetivo_suficiente: true`. No es un caso límite ambiguo: es el modelo generando el ejemplo exacto que le enseñamos como incorrecto, en el mismo aliento en que se supone que debía auditarse contra esa regla.
2. **El miss es peor exactamente donde más importa.** En Sofía y Diego (las observaciones ya marcadas `observacion_suficiente: false` en `identify` — el escenario de mayor riesgo de invención) el objetivo falla 3/4 y 4/5 veces respectivamente. En Emilio y Kevin (observaciones ricas) el objetivo pasa limpio casi siempre. Es decir: la rúbrica funciona bien quieta cuando no la necesitas, y falla casi siempre cuando sí la necesitas.
3. Confirma la hipótesis de §5: la densidad de `GENERATE_SYSTEM` (ya trae gramática, anti-invención, ejemplos, prescripción estructural, tono, ejes de anclas) diluye la atención sobre la rúbrica nueva — el modelo "escribe" el objetivo con toda esa atención y le queda poco para "juzgarlo" en la misma respuesta.

**Decisión:** la opción 1 no es viable tal cual. Se escala a la **opción 2** (pasada aparte, prompt chico y enfocado solo en juzgar, ver §5) antes de exponer esto a coaches. Antes de implementarla, confirmar con Marco si (a) se construye ya la opción 2, o (b) se intenta primero un ajuste de opción 1 (ej. mover la rúbrica al inicio del prompt en vez del final, o repetir la instrucción de autochequeo como se hizo con el fix de tono en pm-v2.9) para no gastar la llamada extra si un ajuste barato resuelve el problema.

## 9. Ajuste barato v2 (`pm-v3.1-2026-07-08`, v15) — mismo patrón que el fix de tono, no funcionó igual

Antes de escalar a la opción 2, se intentó un ajuste barato a la opción 1, mismo patrón que resolvió el fix de tono en la rúbrica de observaciones (§18 de `scope-rubrica-observaciones.md`, 1/4 → 4/4):

1. **Reposicionar la rúbrica** — de estar pegada al final del prompt (justo antes de "Responde ÚNICAMENTE...") a integrarse dentro del flujo de escritura, después de "PRESCRIPCIÓN ESTRUCTURAL" y antes de "TONO Y REFERENCIA AL ATLETA".
2. **Quitar los ejemplos malos literales y completos** — la hipótesis (igual que con el fix de tono) es que mostrar la frase mala completa ("Aumentar la potencia de la volea mediante una correcta preparación y ejecución del golpeo") le da al modelo una plantilla que termina reproduciendo, en vez de solo evitarla. Se reemplazaron por "SEÑALES DE ALERTA" en abstracto (patrones a vigilar, sin frase completa copiable).
3. **Autochequeo obligatorio con instrucción de reescribir**, no solo de cambiar la bandera — "si detectas que falla, reescribe el objetivo... no te limites a marcar false".

**Deploy v15, re-corrida de los mismos focos de Mariana, Sofía, Diego y Kevin:**

| Caso/foco | Antes (v14) | Ahora (v15) |
|---|---|---|
| Mariana/`transferencia_partido` | Calco, `true` (incorrecto) | Calco con matiz agregado ("...para asegurar la transferencia efectiva"), **sigue siendo esencialmente el mismo calco, `true` (sigue incorrecto)** |
| Sofía/`forehand` | Invención ("ángulo de golpeo"), `true` | Invención distinta ("inconsistencia", "precisión y potencia"), **`true` (sigue incorrecto)** |
| Sofía/`fuerza_inferior` | Reproducía el ejemplo malo literal, `true` | Ya no reproduce la frase exacta, pero sigue inventando detalle ("estabilidad y desplazamiento"), **`true` (mejora de forma, sigue incorrecto de fondo)** |
| Sofía/`coachabilidad` | Invención ("ejecución de golpes"), `true` | Invención distinta ("técnicas aprendidas", "adaptabilidad"), **`true` (sigue incorrecto)** |
| Diego/`volea` | Reproducía el ejemplo malo literal, `true` | Ya no reproduce la frase exacta, pero sigue sin sustancia real más allá de "aumentar potencia", **`true` (mejora de forma, sigue incorrecto de fondo)** |
| Diego/`devolucion` | Usaba el verbo prohibido "mejorar", `true` | Ya no usa el verbo prohibido, pero sigue inventando ("oportunidades de ataque"), **`true` (mejora de forma, sigue incorrecto de fondo)** |
| Diego/`manejo_riesgo` | Invención parcial, `true` (dudoso) | "Establecer un enfoque equilibrado..." — ahora se deriva razonablemente del patrón descrito, **`true` (mejora real, ahora defendible)** |
| Diego/`fuerza_inferior` | Reproducía el ejemplo malo literal, `true` | Ya no reproduce la frase exacta, sigue inventando ("estabilidad y potencia en los golpes"), **`true` (mejora de forma, sigue incorrecto de fondo)** |
| Diego/`liderazgo` | Pasa limpio, `true` | Sigue pasando limpio, `true` (sin cambio) |
| Kevin/`liderazgo` | "Fomentar... para mejorar el liderazgo en el grupo", `true` | **"Desarrollar la regulación emocional... y fomentar el liderazgo en el grupo"** — reproduce casi textual la "señal de alerta" que la misma rúbrica describe como sospechosa ("Empieza con Fomentar/Desarrollar... en el grupo"), **`true` (sigue incorrecto, el modelo ignora su propia señal de alerta)** |
| Kevin/serve, devolucion, seleccion_golpe, beep_test | Pasan limpio | Siguen pasando limpio, con detalle ligeramente más específico |

**Lectura: el ajuste barato mejora la *forma* del texto generado (deja de copiar literalmente los ejemplos malos y los verbos prohibidos) pero no mejora la *precisión de la bandera*.** De los 9 focos que fallaban en v14, solo 1 (Diego/`manejo_riesgo`) pasa a ser un acierto real en v15. Los otros 8 siguen marcados `objetivo_suficiente: true` de forma incorrecta — el modelo evita repetir la frase exacta que le dijimos que era mala, pero sigue sin aplicar el criterio de fondo a su propio texto, incluso cuando ese texto encaja con una "señal de alerta" que la misma rúbrica acaba de describirle (Kevin/`liderazgo` es el caso más claro: el objetivo que escribió calza casi palabra por palabra con la señal de alerta de "Fomentar/Desarrollar... en el grupo", y aun así se autocalificó `true`).

**Diferencia con el fix de tono:** ahí la tarea era mecánica (evitar una palabra: el nombre propio) — fácil de auto-verificar con un `find`. Aquí la tarea es de juicio (evaluar si una prescripción es sustancial y fiel a un diagnóstico) — el mismo tipo de tarea donde ya vimos, en la rúbrica de observaciones, que el modelo necesita ejemplos concretos y aun así comete errores sistemáticos en ciertas categorías (manejo_riesgo, character). El patrón se repite aquí, pero peor: no es una categoría específica la que falla, es la mayoría de los casos que deberían fallar.

**Decisión:** el ajuste barato no resuelve el problema de fondo. Se escala a la **opción 2** (pasada aparte, ver §5) — construirla es el siguiente paso.

## 10. Siguiente paso

1. Marco revisa y aprueba (o ajusta) el draft de §6.
2. Al aprobar: implementar `RUBRICA_OBJETIVOS` en `generate-quarterly-plan/index.ts`, deployar.
3. Correr `identify` + `generate` de los 5 casos sintéticos (`docs/dumps-test-planning-edge-cases.md`) contra la versión nueva — validar los objetivos generados contra la rúbrica, igual formato de tabla que §11/§14 de `scope-rubrica-observaciones.md`. Nota: a diferencia de esa regresión, aquí no hay resultados previos documentados para los Casos 2 (Emilio), 3 (Sofía) y 5 (Kevin) a nivel de objetivo — solo Mariana y Diego tienen ejemplos de objetivo ya vistos en vivo. Los otros 3 se corren por primera vez contra esta rúbrica.
4. Actualizar UI (`PlanesCoach.jsx`) para el aviso condicional por `FocoCard` y retirar/ajustar `RubricaBox`.
5. `npm run lint && npm test` antes de commit — commit con mensaje descriptivo, push lo hace Marco.
6. Mover task de Notion a Done cuando la regresión reproduzca lo esperado, igual criterio que la rúbrica de observaciones.
