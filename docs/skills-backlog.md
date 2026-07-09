# Skills internos — Backlog y diseño

> Documento vivo. Rastrea los **skills** que vamos a construir para sacar conocimiento
> procedimental repetido fuera de la conversación y reducir *context rot* / sesiones largas.
> Cada vez que un patrón se repite lo suficiente, se vuelve candidato aquí.
>
> **Origen:** análisis de los ~20 Session Logs (28 Jun 2026). Más allá de abrir/cerrar
> sesión, estos son los flujos que se repiten.
>
> **Actualización 9 Jul 2026:** revisión con Marco. Se descartan #3, #5 y #6. Se agrega
> #7 (apertura/cierre de sesión) — confirmado que sí vale la pena construirlo. #1 se
> actualiza con un paso de doc de scoping. #2 y #4 quedan pendientes de explicar a Marco
> antes de decidir si se construyen.

## Leyenda de estado

- `idea` — identificado, sin diseñar
- `diseñado` — preguntas resueltas, listo para construir con `skill-creator`
- `construido` — skill creado y en uso
- `descartado` — se evaluó y no vale la pena

---

## Tabla resumen

| # | Skill | Prioridad | Estado | Notas |
|---|---|---|---|---|
| 1 | Rebanada de feature (build flow) | Alta | **construido** (9 Jul 2026) | El loop más repetido; incluye definir dónde vive el doc de scoping |
| 2 | Schema + RLS (diseño + verificación) | Alta | **construido** (9 Jul 2026) | Companion de #1, no duplica |
| 3 | QA end-to-end pre-presentación | — | **descartado** (9 Jul 2026) | Marco: no es necesaria |
| 4 | Design polish / mobile-first | Media | idea, pendiente explicar a Marco | Apoyarse en plugin `design` existente |
| 5 | Escalas de medición (-2/+2) | — | **descartado** (9 Jul 2026) | Ya resuelto; no vale ni documentar aparte |
| 6 | Scraper de rankings AMTP | — | **descartado** (9 Jul 2026) | Marco: no es necesario |
| 7 | Apertura/cierre de sesión | Alta | diseñado, en construcción | Nuevo — encapsula CLAUDE.md reglas 2 y 5 |

---

## 1. Rebanada de feature (build flow)

**Qué es:** el loop que repetimos cada vez que construimos una pieza nueva (S8, S10, S19, S20, Reportes, PTF, planning+measurement). Encapsula el orden estándar para que no se re-derive cada sesión.

**Pasos del flujo:**

1. **Task en kanban** (Notion) con `Category` (Dev/Team) y `Type`. Obligatorio antes de empezar.
2. **Doc de scoping** — *condicional*, para features no triviales. Un doc corto en `docs/scope-<nombre-feature>.md`: qué es, por qué, variantes de falla/edge cases ya conocidos, arquitectura elegida y por qué. Sigue el patrón ya usado (`docs/scope-planning-measurement.md`, `docs/scope-rubrica-objetivos.md`, `docs/scope-rubrica-observaciones.md`). El skill pregunta explícitamente dónde vive este doc antes de escribir código — por default `docs/`, salvo que sea contenido no técnico (→ `Top Tennis Performance Academy/`, por la regla de estructura de archivos en CLAUDE.md).
3. **Schema en Supabase** — *condicional*. Solo si la feature necesita datos nuevos: tabla nueva o columnas nuevas. Una feature que solo es una vista/pantalla sobre datos existentes **no** crea schema. → ver Skill #2.
4. **RLS por rol** — políticas según quién puede ver/editar (todos / coach / atleta / admin). Solo aplica si hubo cambio de schema en el paso 3. → ver Skill #2.
5. **Componente React** — el front end de la feature.
6. **Función pura en `src/lib` + test** — *condicional* (ver decisión abajo).
7. **`npm run lint && npm test`** — debe pasar antes del commit.
8. **Commit** con mensaje descriptivo (`feat:` / `fix:` / `chore:` / `refactor:`).

### Decisiones (respuestas a las preguntas de Marco)

- **¿El schema siempre crea tabla?** No. Es condicional: tabla nueva, columnas nuevas, o nada si reutiliza datos existentes. El skill debe preguntar primero "¿esta feature genera datos nuevos?" antes de tocar el schema.

- **¿Siempre hay función en `src/lib`?** **No, es condicional.** El principio: *toda lógica pura* (cálculos, validaciones, transformaciones, valores derivados como las escalas, scoring, normalización de fechas) se extrae a `src/lib` y se testea. Pero una feature que es solo *fetch + render* (CRUD de display) puede no tener ninguna lógica pura que valga la pena extraer. Regla del skill: **"¿estás escribiendo lógica dentro del componente que recibe input y devuelve un valor sin side effects? Si sí → sácala a `src/lib` y testéala. Si no hay lógica pura → salta el paso, pero sé honesto: no inlinees lógica testeable dentro del JSX para evitar el test."**

- **Tests hoy vs. evals mañana (LLM features):** hoy todo es determinista (Vitest, igualdad exacta) y bloquea el commit vía `lint && test`. Cuando empecemos features con agents/LLM (ya hay Edge Functions con prompts: `generate-quarterly-plan`, `validate-quarterly-plan`), la validación cambia de naturaleza:
  - Es **no determinista** → no se valida con `toBe(exacto)` sino contra una **rúbrica** o conjunto de propiedades esperadas.
  - Es **pass@k**, no un solo run → se corren *k* muestras y se mide tasa de aprobación contra un umbral, no un binario.
  - Es **más lenta y cara** → **no debe bloquear cada commit** como lint+unit tests. Va en una **suite de evals separada**, que corre on-demand, en schedule, o pre-release (gate antes de exponer a coaches), no en el CI por-commit.
  - **Dos tiers de validación a partir de aquí:**
    - **Tier A — unit tests deterministas** (lógica pura en `src/lib`) → gate por-commit en CI. Sin cambios.
    - **Tier B — evals de features LLM** (prompts, agents) → suite aparte, basada en dataset de casos + grader (rúbrica o LLM-as-judge) + umbral pass@k. Corre menos seguido.
  - El skill #1 debe ramificar: si la feature es código programático → Tier A. Si la feature es LLM/agent → además registrar casos de eval y correr Tier B antes del gate de buy-in. (`skill-creator` ya trae capacidad de evals; se puede reutilizar el patrón.)

**Pendiente de definir antes de construir:** dónde viven los evals (carpeta `evals/`?), formato del dataset de casos, y quién/qué es el grader inicial.

**Decisión (9 Jul 2026):** construido con `skill-creator`, proceso completo de evals. 3 casos de prueba (cambio de schema menor, vista sin datos nuevos, feature con LLM) corridos con subagentes con/sin skill en paralelo: 100% pass rate con skill vs. 87% sin skill. En los casos simples no hubo diferencia — ambos agentes, con buen criterio propio, llegan al mismo resultado. La diferencia real apareció en el caso LLM: sin skill, el baseline diseñó por su cuenta una convención de evals (carpeta, rúbrica, grader) nunca antes fijada en el proyecto; con skill, el agente se negó explícitamente a inventarla y marcó que hay que pausar y escoparla con Marco — citando la instrucción del propio SKILL.md. Marco aprobó el resultado explícitamente por ese guardrail. Fuente: `.claude/skills/feature-build-flow/SKILL.md`.

---

## 2. Schema + RLS (diseño + verificación)

**Qué es:** módulo enfocado en la capa de datos y su seguridad. Aparece como setup (S7) y reaparece como **bugs silenciosos** (S11 "RLS/timezone", S6 fixes).

### Diferencia con el Skill #1

- **#1 es la orquestación end-to-end** ("construir una rebanada completa"): toca kanban, doc de scoping, schema, RLS, React, lib, test, commit.
- **#2 es el módulo profundo de la capa de datos**: el modelo de roles (coach/atleta/admin), los patrones de RLS, y **la verificación de que las policies se comportan**. El Skill #1 *invoca/referencia* al #2 en sus pasos 3–4. No se duplican: #1 es el flujo, #2 es la profundidad de un sub-paso.

### ¿Tiene sentido un skill de verificación? — Sí

Los bugs de RLS son **silenciosos y peligrosos**: un atleta viendo datos de otro atleta, o un coach bloqueado sin querer. No truenan, se filtran. Un skill de verificación = checklist + **queries reales corridas como cada rol** para confirmar que las policies hacen lo que deben. Es justo el tipo de cosa que se debe automatizar porque a mano se olvida.

**Forma del skill:** referencia el modelo de roles + patrones de RLS de `docs/db-schema.md`, y al crear/cambiar una tabla corre una verificación por rol (¿el atleta ve solo lo suyo? ¿el coach ve a su equipo? ¿admin ve todo? ¿algún rol está bloqueado de más?). Incluye la trampa de **timezone** que ya nos mordió.

**Decisión (9 Jul 2026):** construido. Marco confirmó después de que se le explicó. Fuente: `.claude/skills/schema-rls-verification/SKILL.md`, empaquetado y presentado.

---

## 3. QA end-to-end pre-presentación — descartado

**Qué era:** S12 ("QA tour") y fixes pre-presentación dispersos. Probar el flujo crítico de cada rol antes de mostrarle a coaches/inversionistas. Base existente: `docs/qa-guia-flujos-end-to-end.md` + `docs/qa-hallazgos-2026-06-11.md`.

**Decisión (9 Jul 2026):** descartado. Marco: no es necesario.

---

## 4. Design polish / mobile-first  *(explicación para Marco)*

**Qué es esto (lo que no se entendió):** en varias sesiones hicimos "pasadas de pulido" donde se repitieron *los mismos tipos de arreglo*: hacer que un layout funcione en móvil (tablas anchas → cards, S21), arreglar overflow horizontal (S21), aplicar spacing/colores/tipografía consistentes (S22 "Design Polish P1–P4"), y la landing (S23). Como cada pasada aplica **los mismos criterios**, hoy los re-decidimos a mano cada vez.

**Por qué sería skill:** encapsular esos criterios estables → los design tokens (colores, spacing, escala tipográfica), las reglas mobile-first (tabla→cards bajo cierto breakpoint, cero overflow horizontal, tamaño mínimo de touch target), y un checklist para correr sobre cualquier pantalla nueva. Así "pulí esta pantalla" carga estándares consistentes en vez de re-improvisar.

**Nota:** ya tenemos instalado el plugin `design` con skills (`design-critique`, `accessibility-review`, `design-system`). En vez de construir de cero, conviene **extender/configurar** esos con nuestros tokens y reglas. A evaluar antes de construir.

**Pendiente:** explicar esto a Marco (no lo entendió) antes de decidir si se construye (9 Jul 2026).

---

## 5. Escalas de medición (-2/+2) — descartado

Fue un back-and-forth (S6 "fix escala -2/+2 en todo el sistema", S8, S9) pero ya se resolvió y está fijo.

**Decisión (9 Jul 2026):** descartado. Marco: no es necesario, ni siquiera como referencia aparte.

---

## 6. Scraper de rankings AMTP — descartado

**Qué era:** S17. Si los rankings se refrescan periódicamente, esto no debía ser conversación — un script + un scheduled task.

**Decisión (9 Jul 2026):** descartado. Marco: no es necesario.

---

## 7. Apertura/cierre de sesión

**Qué es:** el flujo que se repite en cada sesión sin excepción — hoy vive solo como texto en CLAUDE.md (reglas 2 y 5). Encapsularlo como skill reduce el riesgo de saltarse un paso cuando la sesión arranca directo a resolver algo, y estandariza cómo se llenan Session Logs y la página principal.

**Al abrir:** lee Last Session + Next Session de la página principal de Notion (incluyendo el campo **Dónde**), revisa el kanban de Tasks por ítems en progreso, y confirma que el foco de la sesión tiene su task correspondiente (si no, lo crea).

**Al cerrar:** llena una entrada en Session Logs (Session, Date, Status, **Dónde**, What we did, Key decisions, Open items/follow-ups), reemplaza Last Session y Next Session en la página principal (incluyendo Dónde / Dónde retomar), y recuerda el commit final si quedó pendiente.

**Decisión (9 Jul 2026):** construir. Marco confirmó que le gusta la idea al proponerla.

---

## Orden sugerido de construcción

_Actualizado 9 Jul 2026 tras decisión de Marco: #3, #5 y #6 descartados; #7, #2 y #1 construidos._

1. ~~**#7 (apertura/cierre de sesión)**~~ — construido.
2. ~~**#2 (schema + RLS)**~~ — construido.
3. ~~**#1 (rebanada de feature)**~~ — construido, con evals completos. Ver detalle arriba.
4. **#4 (design)** — en discusión: Marco preguntó qué tanto se usaría dado que el design system ya está documentado en `Top Tennis Performance Academy/design-review-prompt.md` + tokens CSS en `src/index.css`. Pendiente de decisión final. Único skill del backlog original sin resolver.
