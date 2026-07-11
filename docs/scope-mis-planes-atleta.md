# Scope — "Mi plan" en el portal del atleta

**Fecha:** 10 Jul 2026
**Task Notion:** [Sección de "Mis Planes" en el portal del atleta](https://app.notion.com/p/3985a7ea466081c984aef13dc8c8959d) — Dev / Feature / In Progress
**Relacionado:** `docs/scope-planning-measurement.md` (modelo de focos/anclas), `docs/db-schema.md` (RLS actual)

---

## 1. Qué existe hoy

No hay pantalla dedicada. El único uso contextual de `quarterly_plans` del lado del atleta es `AthleteVoice.jsx`, que lee el plan `active` del periodo para mostrar el `objective_text` como referencia mientras el atleta llena su auto-evaluación — no es una vista de "mi plan".

Del lado del coach, `PlanesCoach.jsx` (vista `detail`) ya tiene todo el patrón visual que esta feature reutiliza: `StatusBadge`, `FocoCard`, `AnchorList`, agrupación por `DIM_ORDER` (`tecnica → tactica → physical → character`) y el bloque de mantenimiento como chips.

## 2. Alcance de datos — qué planes ve el atleta

Pedido de Marco (10 Jul 2026): el atleta ve su plan **activo** y sus planes **pasados que cumplieron su periodo** — no los que el coach archivó.

| Status | ¿Visible al atleta? |
|---|---|
| `draft` | No — nunca visible (es como hoy) |
| `active` | Sí — "Plan activo" |
| `completed` | Sí — "Planes anteriores" |
| `archived` | No |

Query: `quarterly_plans` filtrado por `athlete_id` + `status IN ('active', 'completed')`, ordenado por `period_start desc`. El activo (si existe) se muestra arriba, separado; el resto en la lista de anteriores.

## 3. ⚠️ Hallazgo — requiere cambio de RLS antes de construir

`docs/db-schema.md` (línea 264, actualizado 9 Jul 2026) documenta la policy actual:

> `quarterly_plans` / `quarterly_plan_objectives` — Atleta: Lee el suyo, **solo si `status = 'active'`**.

Eso bloquea hoy los planes `completed`. Es exactamente el tipo de cosa que este scoping debía sacar a la luz antes de construir: **hace falta una migración de RLS** que amplíe el `SELECT` del atleta a `status IN ('active', 'completed')` en ambas tablas, antes de que la pantalla pueda funcionar.

Al construir esto: correr el skill de `schema-rls-verification` y verificar con queries reales como atleta (no solo "se ve bien la policy") — mismo criterio que se usó el 9 Jul para el resto de la relación coach↔atleta.

## 4. Nivel de detalle por foco (decidido con Marco)

El atleta ve, por cada foco:

- **Dimensión** y **sub-dimensión** (mismos labels que `SUB_LABEL` en `PlanesCoach.jsx`)
- **Objetivo** (`objetivo`)
- **Las 5 anclas** −2..+2 (`anchors`), igual que el coach — coherente con que `AthleteVoice.jsx` ya le muestra anclas al autoevaluarse, así que no es un concepto nuevo para el atleta

**No** se muestra `diagnostico` — se redacta pensando en el coach ("el atleta pega de puro brazo…"), no en segunda persona para el atleta. Puede migrarse después si Marco lo pide, pero no es parte de este scope.

**Mantenimiento:** se muestra como lista simple de chips (nombre de sub-dimensión, sin objetivo ni anclas) — mismo patrón que ya existe en el detail del coach. Le da al atleta visibilidad de qué más está en el radar del coach este trimestre aunque no tenga objetivo dedicado.

## 5. Planes completados — decisión propuesta (confirmar con Marco)

Un plan `completed` trae campos que un plan `active` no tiene: `outcome` y `final_assessment` por foco, más `coach_retrospective` / `athlete_retrospective` / `closed_at` a nivel plan (`docs/scope-planning-measurement.md` §9).

**Propuesta:** en "Planes anteriores", cada foco cerrado muestra su `outcome` (logrado / parcial / continúa) junto al objetivo, y el `final_assessment` como cierre de esa línea. Si `coach_retrospective` y/o `athlete_retrospective` existen, se muestran debajo del plan. Si no existen (el mecanismo de captura del lado del atleta todavía no está construido — ver backlog "Formato de cierre compartido atleta/papá/coach"), simplemente no se renderiza esa sección — no bloquea.

Esta parte no estaba en la nota original del task; es un hallazgo de este scoping. Confirmar antes de construir si se incluye en el primer corte o se deja para una iteración 2.

## 6. Navegación y ruta

- Nuevo item en `ATLETA_NAV` (`src/components/portal/Sidebar.jsx`): `{ id: 'mi-plan', label: 'Mi plan', icon: 'target', path: '/portal/mi-plan' }` — mismo ícono que usa el coach para "Planes". Posición sugerida: después de "Mi rendimiento", antes de "Mis torneos".
- Nueva ruta protegida en `src/App.jsx`, bloque `allowedRoles={['Atleta']}`: `/portal/mi-plan → MiPlan.jsx` (nuevo archivo en `src/pages/portal/atleta/`).

## 7. Fuera de alcance de este corte

- Edición de cualquier campo por parte del atleta (el plan es de solo lectura para él, igual que hoy).
- Notificación push/email al publicarse un plan — ya existe como task separado: "[Post-MVP] Publicación del plan trimestral y notificaciones a atleta y papás".
- Captura del `athlete_retrospective` por el propio atleta (formulario dedicado) — depende de "Formato de cierre compartido atleta/papá/coach" (Backlog, baja prioridad).
- Vista para papás — no existe rol/portal de papá hoy.

## 8. Siguiente paso

Con esto confirmado por Marco, la construcción sigue el flujo estándar (`feature-build-flow`): migración RLS → `MiPlan.jsx` (componente) → entrada en `Sidebar.jsx` + `App.jsx` → lint + test → commit. No hay lógica pura nueva que requiera test en `src/lib/` — es lectura y presentación.
