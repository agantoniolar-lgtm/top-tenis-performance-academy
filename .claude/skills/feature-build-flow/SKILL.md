---
name: feature-build-flow
description: >-
  Usa este skill cada vez que vayas a construir una feature nueva o modificar una existente en la plataforma Top Tennis Performance Academy — cualquier pieza que toque más de una capa (UI + datos, UI + lógica, o un flujo completo como un formulario nuevo, una pantalla nueva, un reporte nuevo). Es el flujo estándar end-to-end del proyecto: task en kanban → doc de scoping (si no es trivial) → schema/RLS (si hay datos nuevos) → componente React → función pura + test (si hay lógica) → lint+test → commit. Actívalo también cuando la feature involucre un prompt/LLM/agent (Edge Functions con OpenAI, generación de texto, evaluación automática) — ahí el flujo se ramifica a evals en vez de solo unit tests deterministas. Úsalo incluso si Marco no menciona "feature" explícitamente pero describe algo que hay que construir o cambiar en el producto. No lo uses para fixes de una sola línea, cambios puramente de copy/texto, o typos — para eso el flujo completo es más ceremonia de la que vale la pena.
---

# Rebanada de feature — Top Tennis Performance Academy

Este es el flujo que se repite cada vez que se construye una pieza nueva de la plataforma (reportes, PTF, planning+measurement, etc.). Existe para que el orden de los pasos no se re-derive cada sesión, y para que ninguna feature llegue a commit habiendo saltado un paso que sí le aplicaba.

Compañeros de este skill:
- **`schema-rls-verification`** — se invoca en los pasos de schema y RLS (abajo). No dupliques esa lógica aquí; solo referencia cuándo aplica.
- **`session-open-close`** — el task en kanban del paso 1 normalmente ya existe si abriste la sesión correctamente con ese skill.

## El flujo, paso a paso

### 1. Task en kanban (obligatorio, sin excepción)

Antes de tocar cualquier archivo, confirma que existe un task en el kanban de Notion (`collection://c10a7056-b245-4eaa-9be3-24f94466692d`) con `Category` (Dev/Team) y `Type` asignados. Si no existe, créalo primero. Esto no es burocracia — es lo que le permite a Marco ver en qué está trabajado el proyecto sin tener que preguntarte.

### 2. Doc de scoping — condicional

Pregúntate: **¿esta feature tiene ambigüedad real, o el camino es obvio?**

- Si es obvia (ej. "agrega un campo X a un formulario que ya existe, la tabla ya tiene la columna"), sáltate este paso — escribir un doc para eso es ceremonia sin valor.
- Si no es obvia (arquitectura por decidir, variantes de falla conocidas de intentos previos, una decisión que si se equivoca cuesta cara deshacer), escribe un doc corto en `docs/scope-<nombre-feature>.md` antes de escribir código: qué es, por qué, variantes de falla/edge cases ya conocidos, arquitectura elegida y por qué. Sigue el patrón ya usado en el proyecto (`docs/scope-planning-measurement.md`, `docs/scope-rubrica-objetivos.md`, `docs/scope-rubrica-observaciones.md`) — ábrelos como referencia de tono y nivel de detalle si es tu primera vez escribiendo uno.

Antes de escribir el doc, pregúntale a Marco (o decide con criterio si es obvio por la regla de estructura de archivos de CLAUDE.md) dónde vive: por default `docs/` si es spec técnica, o `Top Tennis Performance Academy/` si es contenido no técnico para compartir con coaches/atletas/clientes. No asumas la ubicación en silencio — es justo el tipo de cosa que se pierde entre sesiones si no queda explícito.

**Alto obligatorio si escribiste el doc de scoping:** una vez terminado, preséntaselo a Marco y espera su autorización explícita antes de seguir a los pasos de construcción (3 en adelante) — no toques schema, no escribas RLS, no escribas código todavía. El doc de scoping es una propuesta para su revisión, no luz verde automática para construir lo que describe; "lo documenté" y "está aprobado" son dos cosas distintas, y este skill existe en parte para no confundirlas. Esto aplica solo cuando este paso sí generó un doc — si el camino era obvio y lo saltaste, el task del kanban más lo que Marco ya pidió es autorización suficiente para seguir sin pausa adicional.

### 3. Schema en Supabase — condicional

Pregúntate primero: **¿esta feature genera datos nuevos?**

- Si es una vista o pantalla sobre datos que ya existen (un dashboard, un filtro, una re-organización de algo que ya se guarda), **no** toques el schema.
- Si necesita una tabla nueva o columnas nuevas, diseña el schema. Consulta `docs/db-schema.md` para el modelo conceptual y las convenciones ya establecidas (nombres de columnas, tipos, cómo se documentan constraints) antes de inventar un patrón nuevo.
- Actualiza `docs/db-schema.md` con la tabla/columna nueva — si el doc no refleja el schema real, deja de ser la fuente de verdad.

### 4. RLS por rol — condicional, solo si hubo cambio de schema

Si el paso 3 aplicó, ahora define quién puede ver/editar los datos nuevos por rol (coach / atleta / admin). **Usa el skill `schema-rls-verification`** para esto — cubre el modelo de roles del proyecto, el patrón general de policies, y sobre todo la verificación activa (correr queries como cada rol) que no se debe saltar. No reinventes ese proceso aquí.

### 5. Componente React

El front end de la feature. Sigue los tokens y patrones de diseño ya establecidos en el proyecto (`src/index.css`, y si el cambio es de UI/UX no trivial, considera si aplica una revisión con los skills del plugin `design`).

### 6. Función pura en `src/lib` + test — condicional

El principio: **toda lógica pura** (cálculos, validaciones, transformaciones, valores derivados — scoring, normalización de fechas, agregaciones) se extrae a `src/lib` y se testea con Vitest. Pero una feature que es solo *fetch + render* (CRUD de display sin cálculo propio) puede no tener ninguna lógica pura que valga la pena extraer.

La pregunta que decide esto: **¿estás escribiendo lógica dentro del componente que recibe un input y devuelve un valor, sin side effects?** Si sí, sácala a `src/lib` y testéala — es exactamente el tipo de función que `athletics.test.js` ya cubre para otras partes del proyecto. Si no hay lógica pura real, salta el paso — pero sé honesto con la pregunta: no metas un cálculo dentro del JSX solo para evitar escribir el test. Esa es la trampa que este paso existe para prevenir.

### 7. ¿La feature involucra un LLM/agent? — ramifica aquí

Si la feature llama a un modelo (Edge Function con prompt, generación de texto, cualquier cosa donde el output no es 100% determinista), el paso 6 no alcanza. La validación cambia de naturaleza:

- No es determinista → no se valida con `toBe(exacto)` sino contra una **rúbrica** o conjunto de propiedades esperadas.
- Es *pass@k*, no un solo run → se corren *k* muestras y se mide tasa de aprobación contra un umbral, no un binario.
- Es más lenta y cara → **no debe bloquear cada commit** como lint+unit tests. Va en una suite de evals separada que corre on-demand, en schedule, o pre-release — no en el CI por-commit.

**Dos tiers:**
- **Tier A** — lógica pura determinista en `src/lib` → gate por-commit en CI, sin cambios respecto al paso 6.
- **Tier B** — evals de features LLM/agent → suite aparte: dataset de casos + grader (rúbrica o LLM-as-judge) + umbral pass@k, corre menos seguido, gatea antes de exponer la feature a coaches (no antes de cada commit).

**Esto todavía no está resuelto en el proyecto:** dónde viven los evals (¿carpeta `evals/`?), el formato exacto del dataset de casos, y quién/qué es el grader inicial son decisiones pendientes. Si esta es la primera vez que este paso aplica desde que se escribió este skill, **no inventes la convención en silencio** — para y scópealo con Marco antes de seguir, igual que se hizo con la rúbrica de planning+measurement (`docs/scope-planning-measurement.md`, `docs/agentic-fit-check-pm.md`). Una vez que exista una primera convención real, actualiza esta sección del skill para dejar de preguntar cada vez.

### 8. `npm run lint && npm test`

Debe pasar sin errores antes de commitear. Si falla, no hay commit — se arregla primero, no se documenta como pendiente.

### 9. Commit

Mensaje descriptivo con prefijo (`feat:` / `fix:` / `chore:` / `refactor:`) que explique qué se hizo — no genérico. Ver CLAUDE.md para ejemplos de mensajes buenos vs. malos.

## Resumen rápido (para no releer todo cada vez)

| Paso | ¿Siempre aplica? |
|---|---|
| 1. Task en kanban | Sí, sin excepción |
| 2. Doc de scoping | Solo si hay ambigüedad real — y si aplica, pausa obligatoria a esperar autorización de Marco antes de construir |
| 3. Schema | Solo si hay datos nuevos |
| 4. RLS | Solo si hubo paso 3 |
| 5. Componente React | Sí (si la feature tiene UI) |
| 6. Función pura + test | Solo si hay lógica pura extraíble |
| 7. Tier B evals | Solo si involucra LLM/agent |
| 8. Lint + test | Sí, sin excepción |
| 9. Commit | Sí, sin excepción |

La regla de fondo detrás de cada "condicional": el paso existe para atrapar un tipo de error real que ya pasó en este proyecto (schema innecesario, tests inflados, RLS silenciosa, ubicación de docs perdida). Si genuinamente no aplica, sáltalo sin culpa — pero si aplica y lo saltas para ir más rápido, el error que iba a prevenir probablemente va a pasar de todas formas, solo que más tarde y más caro de arreglar.
