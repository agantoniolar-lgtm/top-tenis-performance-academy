# Scope — Abrir la relación coach↔atleta (Equipo único, sin "Mis Atletas")

Fecha: 9 Jul 2026. Task en kanban: [Quitar constraint de asignación coach↔atleta (libre para cualquier coach)](https://app.notion.com/p/3925a7ea466081689715ca778cf9c560).

## 1. Problema

Hoy la plataforma trata a cada atleta como propiedad de un solo coach (`athletes.coach_id`), tanto en el alta como en el día a día: quién ve al atleta, quién le puede crear reportes, quién le puede armar un plan trimestral. En la práctica varios coaches rotan por entrenamientos y torneos distintos — forzar a un solo coach a cargar con todo el seguimiento de un atleta no es como opera la academia.

Marco quiere tres cambios, en este orden:

1. **Equipo se queda como la única vista** — cualquier coach ve a cualquier atleta, sus reportes, PTFs, etc. "Mis Atletas" (`Alumnos.jsx`) se elimina por completo.
2. **Cualquier coach puede crear planes (y reportes) para cualquier atleta** — no solo el "suyo".
3. **En el alta ya no se elige/asigna un coach** — se quita ese paso por completo.

Un cuarto pilar (feature de notas de voz/texto que alimenta reportes y planes) queda fuera de este doc a propósito — depende de que esto se resuelva primero. Tiene su propio task en el kanban.

## 2. Cómo funciona hoy (confirmado en código + RLS real de Supabase, no solo en `docs/db-schema.md` que está desactualizado)

### 2.1 Hay dos flujos de alta, no uno

- **`src/pages/public/Signup.jsx`** — autoregistro. El atleta crea su propia cuenta (`supabase.auth.signUp`) y en el paso 1 del formulario hay un select **obligatorio** "Tu coach en Top Tenis *", poblado desde `SELECT id, nombre, apellido FROM coaches`. Sin elegir uno, el formulario no avanza al paso 2. Este es el flujo real de alta — es el que hay que cambiar.
- **`src/pages/portal/coach/NuevoAtleta.jsx`** — alta manual desde el portal del coach. No tiene selector de coach: automáticamente guarda `coach_id: user.coach_id` (el coach que está llenando el formulario). Ya no requiere elegir nada porque nunca lo pidió — el "problema" del selector solo existe en `Signup.jsx`.

### 2.2 `athletes.coach_id` es `NOT NULL` en la base de datos hoy

Es columna requerida, FK a `coaches.id`, y aparece referenciada en 9 tablas (`reports`, `quarterly_plans`, `athlete_utr_history`, `athlete_profile_snapshots`, `athlete_recruitment_profile`, etc. — todas vía `athlete_id`, no directamente, pero sus políticas de lectura sí dependen de `athletes.coach_id` en 3 casos, ver 2.4).

### 2.3 Los reportes y planes YA NO dependen de `athletes.coach_id` — tienen su propio dueño

Este es el hallazgo más importante: `reports.coach_id`, `quarterly_plans.coach_id`, y los `completed_by` de `report_on_court` / `report_physical` / `report_character` se llenan con el coach que efectivamente crea o completa esa fila — no con `athletes.coach_id`. La RLS de esas tablas ya compara contra el dueño del artefacto, no contra el dueño del atleta:

- `coaches_all_their_reports` → `reports.coach_id = auth coach`
- `coaches_own_plans` → `quarterly_plans.coach_id = auth coach`

O sea: **crear un reporte o un plan para cualquier atleta ya es técnicamente posible hoy a nivel de base de datos.** Lo que lo bloquea es la capa de UI (siguiente punto).

### 2.4 Dónde sí pega `athletes.coach_id` hoy

**RLS (Supabase, verificado con `pg_policies`):**

| Tabla | Policy | Qué hace |
|---|---|---|
| `athletes` | `coaches_all_their_athletes` (ALL) | Solo el coach dueño puede editar/borrar |
| `athletes` | `coaches_select_all_athletes` (SELECT) | Cualquier coach ya puede **leer** a todos — esto es lo que hace posible Equipo hoy |
| `athlete_utr_history` | `coaches_read_utr_history` (SELECT) | Solo el coach dueño puede leer — **sin política abierta**, gap real |
| `athlete_profile_snapshots` | `coaches_read_profile_snapshots` (SELECT) | Igual — sin política abierta |
| `athlete_recruitment_profile` | `recruitment_coach_select` (SELECT) | Igual — sin política abierta |
| `quarterly_plans` / `quarterly_plan_objectives` | solo `coaches_own_plans` / `coaches_own_objectives` | **Sin ninguna política de lectura "cualquier coach"** — hoy un coach no puede ver el plan que otro coach le armó a un atleta |

Para contraste, `reports`, `report_on_court`, `report_character`, `athlete_media`, `athlete_tournaments` y `post_tournament_forms` **ya tienen** su policy `coaches_select_all_*` / equivalente — ya son legibles por cualquier coach hoy. No hay que tocarlas.

**Frontend (filtros `.eq('coach_id', user.coach_id)` que blindan "mis atletas"):**

| Archivo | Qué filtra |
|---|---|
| `Alumnos.jsx` | Toda la página — la lista de atletas (se elimina la página completa) |
| `NuevoReporte.jsx` | El picker de atleta al crear un reporte nuevo |
| `ReportesPorPeriodo.jsx` | El filtro de atleta al navegar reportes por periodo |
| `PlanesCoach.jsx` | El picker de atleta al crear un plan (línea ~166) **y** la lista de "mis planes" (línea ~154) |
| `AlumnoDetalle.jsx` | Flag `isOwn = athlete.coach_id === user.coach_id` (línea 104) — oculta el botón "+ Nuevo reporte" y muestra un badge "Solo lectura" a cualquier coach que no sea el dueño |

`Equipo.jsx` no filtra por `coach_id` — ya muestra a todos los atletas y sus últimos 3 reportes. Es la base correcta para quedarse como única vista; solo le falta sumar PTFs y planes al detalle (hoy no los trae).

## 3. Qué implica cada pieza del cambio

### 3.1 Quitar el coach del alta (`Signup.jsx`)

Se quita el select "Tu coach en Top Tenis *", el estado `coachId`, y el campo `coach_id: coachId` del insert. Al no tener ya un valor que escribir en ese paso, **`athletes.coach_id` tiene que dejar de ser `NOT NULL`** — no hay forma de mantenerlo requerido sin pedirle al atleta que elija algo. Esto sí es una migración de schema (`ALTER TABLE athletes ALTER COLUMN coach_id DROP NOT NULL`), pero es de bajo riesgo: no toca las 9 FKs existentes, no borra datos, solo relaja el constraint.

**Resuelto (9 Jul 2026):** `NuevoAtleta.jsx` (alta manual del coach) confirmado sin uso — no tiene ningún link/botón que apunte a `/portal/alumnos/nuevo` en todo el código, es una ruta huérfana. El task "F2 — Definir con coaches el alta de atletas" (que dejaba esto pendiente) se marca Done: el autoregistro es el único flujo de alta. `NuevoAtleta.jsx` y su ruta se **borran** como parte de este cambio (ver §4) en vez de mantenerse sin usar.

#### 3.1.1 Campos de padre/tutor para atletas menores de 18 años

Marco quiere portar la sección "Padre / Tutor" que hoy solo existe en `NuevoAtleta.jsx` (huérfano, se borra) hacia `Signup.jsx` — pero condicionada: solo se piden esos campos (nombre, teléfono, email del padre/tutor) cuando el atleta que se está registrando es menor de edad. Ya existe `calcEdad(fechaNac)` en `src/lib/athletics.js` (con tests en `athletics.test.js`) — se reutiliza para decidir si mostrar la sección, no hace falta escribir una función nueva. Mecánica: en el paso 1 de `Signup.jsx`, en cuanto `fechaNac` está llena, si `calcEdad(fechaNac) < 18` se revela la sección Padre/Tutor (mismos 3 campos que ya existen como columnas en `athletes`: `nombre_padre`, `email_padre`, `telefono_padre` — no hay que tocar schema, ya existen).

**Asunción a confirmar:** si es menor, esos 3 campos pasan a ser obligatorios (no solo visibles) — sin contacto de un adulto responsable no tiene sentido dejar avanzar el registro de un menor. Avisar si Marco los quiere opcionales incluso siendo menor.

#### 3.1.2 Reclutamiento como paso siguiente, obligatorio antes del primer PTF

Después del alta, "Reclutamiento" (`Reclutamiento.jsx`, ya existe — llena `athlete_recruitment_profile`: división objetivo, grad year, GPA, nivel de inglés, área de estudio) pasa a ser el paso siguiente sugerido — y se vuelve un requisito duro antes de poder crear el primer PTF (`PostTorneo.jsx`, ya existe, hoy no tiene ningún gate). Mecánica: al entrar a crear un PTF, se checa si existe una fila en `athlete_recruitment_profile` para ese `athlete_id`; si no existe, se redirige a `Reclutamiento.jsx` con un mensaje explicando por qué, en vez de dejar avanzar al formulario del PTF. No es parte del wizard de `Signup.jsx` (no bloquea terminar el registro) — el gate vive específicamente en el punto de entrada a crear un PTF.

### 3.2 Abrir Equipo (lectura para todos)

Tres nuevas policies `SELECT` tipo "cualquier coach" (mismo patrón que `coaches_select_all_athletes`) en `athlete_utr_history`, `athlete_profile_snapshots`, `athlete_recruitment_profile`. Y una nueva policy de lectura abierta en `quarterly_plans` + `quarterly_plan_objectives` (hoy no existe ninguna). Sin esto, aunque se abra todo lo demás, Equipo seguiría sin poder mostrar el historial de UTR, el perfil de reclutamiento o los planes de atletas que no son "tuyos".

### 3.3 Eliminar "Mis Atletas"

Borrar `Alumnos.jsx` y su ruta (`/portal/alumnos`) en `App.jsx`. `Equipo.jsx` exporta el componente `<TabBar>` que hoy usa `Alumnos.jsx` para su tab "Mis" — hay que quitar ese tab. Repasar los `navigate(...)` que hoy apuntan a `/portal/alumnos` (ej. `NuevoAtleta.jsx` al cancelar o al crear) para que apunten a `/portal/equipo` o a `/portal/alumnos/:id` (el detalle, que puede seguir viviendo en esa ruta aunque la lista se mueva).

### 3.4 Cualquier coach crea reportes y planes para cualquier atleta

Quitar el `.eq('coach_id', user.coach_id)` en los pickers de `NuevoReporte.jsx`, `ReportesPorPeriodo.jsx` y `PlanesCoach.jsx` (picker de creación) — pasan a listar todos los atletas activos. Quitar también el filtro en la lista de planes de `PlanesCoach.jsx` (línea ~154) para que muestre los planes de todos, no solo los que ese coach creó — esto depende de que 3.2 (la nueva policy de lectura en `quarterly_plans`) ya esté aplicada, si no, la query no traerá nada aunque se quite el filtro. Quitar el flag `isOwn` de `AlumnoDetalle.jsx` — el botón "+ Nuevo reporte" y el badge "Solo lectura" dejan de existir; todos ven la misma vista.

### 3.5 `DELETE` — resuelto (9 Jul 2026)

`coaches_all_their_athletes` es una policy `ALL` — hoy cubre SELECT/INSERT/UPDATE/DELETE, restringida al dueño. Si se reemplazaba tal cual por una policy abierta a "cualquier coach", cualquier coach hubiera podido borrar el registro de cualquier atleta, no solo editarlo.

**Decisión de Marco:** ningún coach tiene `DELETE` sobre `athletes`, punto. La policy abierta nueva cubre solo SELECT/INSERT/UPDATE. Dar de baja a un atleta se hace con `activo = false` (ya existe, reversible, no rompe reportes/planes/historial ligados). Si alguna vez hace falta borrar un registro de verdad, lo hace Marco manualmente (Supabase dashboard/SQL) — no es una acción que la app exponga. Tiene sentido además porque el único escenario que hubiera justificado que un coach borrara "su" atleta (alta manual por `NuevoAtleta.jsx`) ya no existe — ver §3.1.

Qué hacer con atletas que se gradúan o dejan la academia (¿se desactivan y ya, se archivan distinto, se les da un estado tipo "egresado"?) queda como decisión de producto aparte — task nuevo en el kanban, sin bloquear este cambio.

## 4. Plan de ejecución (una vez aprobado este doc)

1. Migración: `athletes.coach_id` → nullable.
2. RLS: nuevas policies "cualquier coach" (SELECT/INSERT/UPDATE, sin DELETE — §3.5) en `athletes`, `athlete_utr_history`, `athlete_profile_snapshots`, `athlete_recruitment_profile`, `quarterly_plans`, `quarterly_plan_objectives`. Verificación activa corriendo queries como cada rol (`schema-rls-verification`), no solo revisar que la policy "se vea bien".
3. `Signup.jsx`: quitar el select de coach; agregar sección Padre/Tutor condicional a `calcEdad(fechaNac) < 18` (§3.1.1).
4. Gate de Reclutamiento antes del primer PTF: check en el punto de entrada a `PostTorneo.jsx` (§3.1.2).
5. Borrar `NuevoAtleta.jsx` y su ruta (`/portal/alumnos/nuevo`) — confirmado sin uso (§3.1).
6. `Alumnos.jsx` + ruta: eliminar. `Equipo.jsx`: quitar tab "Mis".
7. `NuevoReporte.jsx`, `ReportesPorPeriodo.jsx`, `PlanesCoach.jsx`: quitar filtros por `coach_id`.
8. `AlumnoDetalle.jsx`: quitar `isOwn` y todo lo que dependía de él.
9. Repasar `navigate()` que apuntaban a `/portal/alumnos`.
10. `npm run lint && npm test`, commit.

## 5. Fuera de alcance de este doc

- El servicio de notas de voz/texto que alimenta reportes y planes — task separado en el kanban, depende de que esto cierre primero.
- Rediseño visual de Equipo para sumar PTFs/planes al detalle de cada atleta — hoy solo trae reportes; sumar esas dos fuentes es trabajo de UI aparte, no bloqueante para los puntos 1–3 de este doc.
- Qué hacer con atletas que se gradúan o dejan la academia — task nuevo en el kanban ("Decidir qué hacer con atletas que se van de la academia o se gradúan"), decisión de producto sin resolver, no bloquea este cambio.

## 6. Decisiones confirmadas por Marco (9 Jul 2026)

- `NuevoAtleta.jsx` no se conserva ni como metadata — se borra por completo, autoregistro es el único flujo de alta (§3.1).
- Ningún coach tiene `DELETE` sobre atletas. Baja = `activo = false`. Si algún día hace falta borrar de verdad, lo hace Marco manualmente, fuera de la app (§3.5).
- Los campos de tutor/padre en `Signup.jsx` se muestran solo si el atleta es menor de edad (§3.1.1) — **pendiente de confirmar:** ¿obligatorios u opcionales cuando aplica?
- El gate de Reclutamiento aplica antes del primer PTF, no antes de terminar el registro (§3.1.2).
