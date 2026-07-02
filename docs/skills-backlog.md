# Skills internos — Backlog y diseño

> Documento vivo. Rastrea los **skills** que vamos a construir para sacar conocimiento
> procedimental repetido fuera de la conversación y reducir *context rot* / sesiones largas.
> Cada vez que un patrón se repite lo suficiente, se vuelve candidato aquí.
>
> **Origen:** análisis de los ~20 Session Logs (28 Jun 2026). Más allá de abrir/cerrar
> sesión, estos son los flujos que se repiten.

## Leyenda de estado

- `idea` — identificado, sin diseñar
- `diseñado` — preguntas resueltas, listo para construir con `skill-creator`
- `construido` — skill creado y en uso
- `descartado` — se evaluó y no vale la pena

---

## Tabla resumen

| # | Skill | Prioridad | Estado | Notas |
|---|---|---|---|---|
| 1 | Rebanada de feature (build flow) | Alta | diseñado | El loop más repetido |
| 2 | Schema + RLS (diseño + verificación) | Alta | diseñado | Companion de #1, no duplica |
| 3 | QA end-to-end pre-presentación | Media | idea | Ya existe `qa-guia-flujos-end-to-end.md` como base |
| 4 | Design polish / mobile-first | Media | idea | Apoyarse en plugin `design` existente |
| 5 | Escalas de medición (-2/+2) | Baja | documentar, no skill | Ya resuelto; solo dejar referencia |
| 6 | Scraper de rankings AMTP | Alta (fácil) | diseñado | Skill + scheduled task |

---

## 1. Rebanada de feature (build flow)

**Qué es:** el loop que repetimos cada vez que construimos una pieza nueva (S8, S10, S19, S20, Reportes, PTF, planning+measurement). Encapsula el orden estándar para que no se re-derive cada sesión.

**Pasos del flujo:**

1. **Task en kanban** (Notion) con `Category` (Dev/Team) y `Type`. Obligatorio antes de empezar.
2. **Schema en Supabase** — *condicional*. Solo si la feature necesita datos nuevos: tabla nueva o columnas nuevas. Una feature que solo es una vista/pantalla sobre datos existentes **no** crea schema. → ver Skill #2.
3. **RLS por rol** — políticas según quién puede ver/editar (todos / coach / atleta / admin). Solo aplica si hubo cambio de schema en el paso 2. → ver Skill #2.
4. **Componente React** — el front end de la feature.
5. **Función pura en `src/lib` + test** — *condicional* (ver decisión abajo).
6. **`npm run lint && npm test`** — debe pasar antes del commit.
7. **Commit** con mensaje descriptivo (`feat:` / `fix:` / `chore:` / `refactor:`).

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

---

## 2. Schema + RLS (diseño + verificación)

**Qué es:** módulo enfocado en la capa de datos y su seguridad. Aparece como setup (S7) y reaparece como **bugs silenciosos** (S11 "RLS/timezone", S6 fixes).

### Diferencia con el Skill #1

- **#1 es la orquestación end-to-end** ("construir una rebanada completa"): toca kanban, schema, RLS, React, lib, test, commit.
- **#2 es el módulo profundo de la capa de datos**: el modelo de roles (coach/atleta/admin), los patrones de RLS, y **la verificación de que las policies se comportan**. El Skill #1 *invoca/referencia* al #2 en sus pasos 2–3. No se duplican: #1 es el flujo, #2 es la profundidad de un sub-paso.

### ¿Tiene sentido un skill de verificación? — Sí

Los bugs de RLS son **silenciosos y peligrosos**: un atleta viendo datos de otro atleta, o un coach bloqueado sin querer. No truenan, se filtran. Un skill de verificación = checklist + **queries reales corridas como cada rol** para confirmar que las policies hacen lo que deben. Es justo el tipo de cosa que se debe automatizar porque a mano se olvida.

**Forma del skill:** referencia el modelo de roles + patrones de RLS de `docs/db-schema.md`, y al crear/cambiar una tabla corre una verificación por rol (¿el atleta ve solo lo suyo? ¿el coach ve a su equipo? ¿admin ve todo? ¿algún rol está bloqueado de más?). Incluye la trampa de **timezone** que ya nos mordió.

---

## 3. QA end-to-end pre-presentación

**Qué es:** S12 ("QA tour") y fixes pre-presentación dispersos. Probar el flujo crítico de cada rol antes de mostrarle a coaches/inversionistas.

### Respuesta a "¿no es por naturaleza front end UI?"

Sí es UI, y por eso el skill tiene **dos mitades**:

1. **Checklist** (lo que ya empezamos en `docs/qa-guia-flujos-end-to-end.md`): el flujo crítico por rol + la lista de trampas conocidas (RLS, timezone, overflow móvil, 404 de Vercel en rutas). Esta mitad es texto y se reutiliza tal cual.
2. **Automatización opcional**: el skill *sí* puede manejar la UI usando el MCP de **Claude in Chrome** (o computer-use) para recorrer cada flujo, hacer login como cada rol, y reportar hallazgos — no se queda solo en checklist. Esa es la parte que convierte "QA manual cada vez" en "corre el QA tour".

**Decisión:** vale la pena. Base ya existe (`qa-guia-flujos-end-to-end.md` + `qa-hallazgos-2026-06-11.md`). Falta envolverlo como skill que (a) cargue el checklist y (b) opcionalmente maneje Chrome para ejecutarlo.

---

## 4. Design polish / mobile-first  *(explicación para Marco)*

**Qué es esto (lo que no se entendió):** en varias sesiones hicimos "pasadas de pulido" donde se repitieron *los mismos tipos de arreglo*: hacer que un layout funcione en móvil (tablas anchas → cards, S21), arreglar overflow horizontal (S21), aplicar spacing/colores/tipografía consistentes (S22 "Design Polish P1–P4"), y la landing (S23). Como cada pasada aplica **los mismos criterios**, hoy los re-decidimos a mano cada vez.

**Por qué sería skill:** encapsular esos criterios estables → los design tokens (colores, spacing, escala tipográfica), las reglas mobile-first (tabla→cards bajo cierto breakpoint, cero overflow horizontal, tamaño mínimo de touch target), y un checklist para correr sobre cualquier pantalla nueva. Así "pulí esta pantalla" carga estándares consistentes en vez de re-improvisar.

**Nota:** ya tenemos instalado el plugin `design` con skills (`design-critique`, `accessibility-review`, `design-system`). En vez de construir de cero, conviene **extender/configurar** esos con nuestros tokens y reglas. A evaluar antes de construir.

---

## 5. Escalas de medición (-2/+2)  — documentar, no skill

Fue un back-and-forth (S6 "fix escala -2/+2 en todo el sistema", S8, S9) pero **ya se resolvió y está fijo**. Marco considera que no volverá a ser problema.

**Decisión:** no construir skill. Solo dejar la definición canónica documentada (dónde viven las escalas, qué significa cada valor) como referencia para que no se vuelva a desincronizar. Candidato a una sección en `docs/db-schema.md` o un `docs/escalas.md` corto.

---

## 6. Scraper de rankings AMTP  — construir

**Qué es:** S17. Si los rankings se refrescan periódicamente, esto **no debe ser conversación** — es un script + un scheduled task que lo corre solo.

**Decisión:** construir. Marco confirmó: es sencillo y se puede cargar periódicamente.

**Forma:** skill que envuelve el scraper existente (de S17) + un *scheduled task* que lo dispara con la cadencia que definamos (¿semanal?). Pendiente: revisar cómo quedó el scraper de S17 (`scripts/`) para envolverlo, y definir cadencia.

---

## Orden sugerido de construcción

1. **#6 (scraper)** — el más fácil y de valor inmediato; arranca el hábito.
2. **#1 (rebanada de feature)** — el de mayor impacto en context rot.
3. **#2 (schema + RLS)** — companion de #1; juntos cubren el grueso del trabajo dev.
4. **#3 (QA e2e)** — cuando #1/#2 estén estables.
5. **#4 (design)** — evaluar extender el plugin `design` antes de construir.
6. **#5** — solo documentar.
