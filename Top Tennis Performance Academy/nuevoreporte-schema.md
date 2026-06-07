# NuevoReporte — Schema del reporte mensual

El NuevoReporte es el expediente mensual del atleta. Lo construyen en conjunto el coach, la psicóloga, la nutrióloga, y el propio atleta. Cada uno llena su sección; el sistema los integra en un solo documento por atleta por mes.

---

## Metadata

| Campo | Tipo | Obligatorio |
|---|---|---|
| Atleta | Selección (lista de atletas) | Sí |
| Mes / Año | Fecha (mes) | Sí |
| Coach que reporta | Selección | Sí |

---

## Escala global 1–5

Aplica a todos los campos de calificación del reporte, en todas las dimensiones:

- **1** — Área crítica de trabajo. No se ejecuta con consistencia incluso en condiciones controladas.
- **3** — En desarrollo. Se ejecuta bien en entrenamiento pero de manera inconsistente. Presenta fallas bajo presión.
- **5** — Consistente en competencia. Lo que se trabaja en entrenamiento aparece en partido, incluso en momentos de alta presión.

> *Open question para los coaches: ¿estos tres anclajes son suficientes para que la escala sea clara y uniforme entre coaches, o quieren agregar definición para el 2 y el 4?*

---

## Dimensión 1 — On-Court

**Responsable:** Coach

### Técnica

Todos los objetos de evaluación son obligatorios mensualmente.

| Objeto de evaluación | Tipo |
|---|---|
| Serve | Escala 1–5 |
| Forehand | Escala 1–5 |
| Backhand | Escala 1–5 |
| Volea | Escala 1–5 |
| Return | Escala 1–5 |
| Footwork | Escala 1–5 |
| Nota cualitativa | Texto libre — reflexión del coach sobre la técnica del atleta a lo largo del periodo |

> *Open question para los coaches: ¿quieren definir un formato estándar para la nota cualitativa? Un formato consistente facilita comparar el feedback entre periodos y entre coaches.*

### Táctica

#### Sección 1 — Evaluación observacional *(coach en cancha, 30–60 min)*

| Objeto de evaluación | Tipo |
|---|---|
| Selección de golpe | Escala 1–5 |
| Manejo del riesgo | Escala 1–5 |
| Puntos clave | Escala 1–5 |
| Adaptación táctica | Escala 1–5 |
| Nota cualitativa | Texto libre — reflexión del coach sobre la toma de decisiones del atleta en el periodo |

> *Nota para los coaches: ¿quieren definir una checklist de situaciones mínimas a observar para que la evaluación táctica sea válida? Ejemplos: un tiebreak sacando, una situación de cierre de set devolviendo, 2–3 juegos consecutivos para ver desarrollo. La idea es que el coach marque qué situaciones alcanzó a ver, y la evaluación quede contextualizada. Esto sistematiza la observación cuando hay varios atletas y poco tiempo por cancha. Se puede dejar como open item para estructurar después.*

> *Nota para los coaches: ¿quieren definir un game plan escrito antes de cada partido o torneo? Si sí, esto se convierte en el referente para evaluar selección de golpe y manejo del riesgo — en lugar de evaluar contra un criterio abstracto, el coach evalúa contra lo que el atleta dijo que iba a hacer.*

#### Sección 2 — Evaluación con tecnología *(post-MVP, Swing Vision)*

| Objeto de evaluación | Qué mide |
|---|---|
| Efectividad de primer golpe | % de puntos ganados en los primeros 1–4 intercambios (Serve+1, Return+1) |
| Gestión del rally | Capacidad de extender rallies de forma segura para desgastar al rival |
| Transición a la red | Efectividad en approach shot + volea + tasa de éxito en red |

> *Nota: estos tres ítems requieren datos de partido completo procesados por Swing Vision. En el MVP solo se incluye la Sección 1. Open question para los coaches: ¿algún ítem de la Sección 2 justifica capturarse manualmente antes de tener la integración con Swing Vision?*

### Transferencia al partido

Mide el gap entre el nivel técnico en entrenamiento y lo que aparece en competencia.

| Campo | Tipo | Obligatorio |
|---|---|---|
| Transferencia al partido | Escala 1–5 | Sí |

Definición de la escala para esta evaluación:
- **1** — La técnica se deteriora significativamente en partido. El nivel de entrenamiento no aparece en competencia.
- **3** — Hay consistencia parcial. El atleta transfiere bien en situaciones de bajo estrés pero se contrae en puntos importantes.
- **5** — Lo que se ve en entrenamiento aparece en partido, incluso bajo presión.

### Campos comunes — On-Court

| Campo | Tipo | Obligatorio |
|---|---|---|
| UTR al momento del reporte | Número decimal | Sí |
| Highlights / video | Hasta 3 URLs — fuente a definir: Swing Vision, grabación propia u otro | No |

---

## Dimensión 2 — Physical

**Responsable:** Coach (por ahora)

Evaluación formal con pruebas medibles. Se recomienda dedicar un día de entrenamiento al mes para realizarlas. Involucrar fisioterapeuta o preparador físico para instruir correctamente la ejecución de cada prueba y garantizar que las mediciones sean comparables entre periodos.

> *Frecuencia confirmada: cada 3 meses. Apoyo de fisios para algunas pruebas. A futuro, si hay un preparador físico en el equipo, esta sección sería responsabilidad suya.*

### Pruebas core

**Frecuencia:** cada 3 meses. Un día de entrenamiento dedicado. Apoyo de fisioterapeuta o preparador físico para garantizar ejecución correcta y comparabilidad entre periodos.

| Capacidad | Prueba | Unidad | Alternativa |
|---|---|---|---|
| Velocidad / Aceleración | Sprint 20m | Segundos | Sprint 10m si el espacio no alcanza |
| Resistencia aeróbica | Beep test (20m shuttle run) | Nivel + repetición alcanzada | YoYo Test |
| Potencia de piernas | Salto vertical — countermovement jump | Centímetros | Broad jump (salto horizontal) |
| Agilidad en cancha | Spider drill (5 conos) | Segundos | T-test |
| Movilidad / control postural | FMS simplificado — squat, lunge, shoulder mobility | Pass / Fail por lado | A definir con fisioterapeuta |
| Fuerza de tren inferior | Sentadillas completas en 1 minuto | Repeticiones | — |
| Fuerza de tren superior | Lagartijas en 1 minuto | Repeticiones | — |

### Alternativas por capacidad

- **Velocidad:** Sprint 10m, 5-10-5 shuttle
- **Resistencia:** YoYo Test, Test de Cooper (12 min), 400m
- **Potencia:** Broad jump, lanzamiento de medicine ball, push-up máximo
- **Agilidad:** T-test, Illinois agility test, lateral shuffle en cancha
- **Movilidad:** Movilidad de hombro, dorsiflexión de tobillo, flexores de cadera

> *Nota: composición corporal (peso, altura, % grasa) se registra en la sección de Nutrición — la nutrióloga tiene el equipo para medirlo correctamente.*

---

## Dimensión 3 — Mental

**Responsable:** Psicóloga

> *Open ended — pendiente de recibir el formato de reporte de la psicóloga. Una vez que lo tengamos, definimos qué campos necesitamos que cubra mensualmente y cómo entra al sistema (el reporte se sube y un LLM extrae y estructura la información).*

---

## Dimensión 4 — Character & Leadership

**Responsable:** Coach

| Campo | Tipo | Obligatorio | Visibilidad |
|---|---|---|---|
| Ética de trabajo | Escala 1–5 + nota | Sí | A definir |
| Coachabilidad | Escala 1–5 + nota | Sí | A definir |
| Conducta | Log de texto con fecha — incidentes negativos y momentos positivos | No | Interno (solo coaches) |
| Liderazgo | Texto libre | No | Interno (solo coaches) por ahora |

> *Nota para los coaches: ¿cómo quieren evaluar conducta y liderazgo de manera más objetiva? ¿Con ejemplos concretos obligatorios, con una escala, con situaciones predefinidas? Definir con el equipo — una evaluación subjetiva sin anclajes va a producir datos difíciles de comparar entre atletas o entre periodos.*

---

## Dimensión 5 — Athlete Voice

**Responsable:** Atleta

Auto-evaluación en las mismas sub-dimensiones que evalúa el coach, para construir un vis-a-vis entre percepción del atleta y percepción externa.

### On-Court

| Objeto de evaluación | Tipo |
|---|---|
| Serve | Escala 1–5 |
| Forehand | Escala 1–5 |
| Backhand | Escala 1–5 |
| Volea | Escala 1–5 |
| Return | Escala 1–5 |
| Footwork | Escala 1–5 |
| Selección de golpe | Escala 1–5 |
| Manejo del riesgo | Escala 1–5 |
| Puntos clave | Escala 1–5 |
| Adaptación táctica | Escala 1–5 |
| Transferencia al partido | Escala 1–5 |

### Physical

| Objeto de evaluación | Tipo |
|---|---|
| Velocidad | Escala 1–5 |
| Resistencia | Escala 1–5 |
| Potencia | Escala 1–5 |
| Agilidad | Escala 1–5 |
| Movilidad | Escala 1–5 |
| Fuerza de tren inferior | Escala 1–5 |
| Fuerza de tren superior | Escala 1–5 |

### Mental

> *Open ended — se define cuando la psicóloga comparta su formato.*

### Character & Leadership

| Objeto de evaluación | Tipo |
|---|---|
| Ética de trabajo | Escala 1–5 |
| Coachabilidad | Escala 1–5 |
| Liderazgo | Escala 1–5 |

### Reflexión del mes

| Campo | Tipo | Obligatorio |
|---|---|---|
| ¿Cómo describirías tu mes como atleta? | Texto libre | Sí |

---

## Dimensión 6 — Nutrición

**Responsable:** Nutrióloga

> *Open ended — pendiente de recibir el formato de reporte de la nutrióloga. Esta sección incluye composición corporal (peso, altura, % grasa y otras métricas que la nutrióloga mida con su equipo). Misma mecánica que Mental: el reporte se sube y un LLM extrae y estructura la información.*

> *Nota: composición corporal en atletas adolescentes es un tema sensible. Definir con cuidado qué ve el atleta, qué ven los padres, y si hay datos que deban quedar solo entre nutrióloga y coach.*

---

## Nota — Planes de entrenamiento

Los planes de entrenamiento no forman parte del NuevoReporte, pero son parte del expediente del atleta. Por ahora existe una carpeta en Google Drive para guardarlos, pero la estrategia definitiva está pendiente de definir: ¿se construyen dentro de la app (builder por atleta o por milestone) o a través de un workflow externo que genere planes a escala?

> *Decisión pendiente — ver task en kanban: "Definir estrategia de planes de entrenamiento (builder en app vs workflow externo)". Post-MVP.*
