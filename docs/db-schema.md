# DB Schema — Top Tennis Performance Academy

Stack: Supabase (PostgreSQL + Auth + RLS)

Versión: 1.0 — Phase 1 (Jun 2026)

> Este archivo documenta la conexión pero **nunca debe contener la contraseña real** — vive solo en `.env.local` (`SUPABASE_DB_PASSWORD_PROD`, gitignored). Ver `.env.example`.

## Conexión

| Campo | Valor |
|---|---|
| Project ID | `rrrwhwciggohwxslqlho` |
| Organización | `agantoniolar-lgtm-org` |
| Región | `us-east-1` (Virginia) |
| DB Password | ver `SUPABASE_DB_PASSWORD_PROD` en `.env.local` (rotada 2026-07-17, la anterior quedó expuesta en este archivo desde el commit `bd7632f` — ver `SETUP_CHECKLIST.md` sección 4b) |

---
Alcance: NuevoReporte con 4 secciones activas (On-Court, Physical, Character & Leadership, Athlete Voice). Mental y Nutrición se agregan en iteración posterior.

---

## Modelo conceptual

Un `report` es el contenedor mensual por atleta. Dentro de él viven 4 secciones independientes. Cada sección tiene su propio responsable, su propio `completed_at`, y puede llenarse en momentos distintos sin bloquear las demás.

Athlete Voice es la excepción: el coach debe abrirla explícitamente (`athlete_voice_unlocked_at`) cuando considera que las otras secciones están listas para que el atleta pueda comparar.

```
coaches ────┐
            ↓
athletes ←──── reports ────→ report_on_court
               (athlete_id      ├──────→ report_physical
                coach_id        ├──────→ report_character
                period)         └──────→ report_athlete_voice
```

---

## Tablas

---

### `users`

Gestionada por Supabase Auth. No se crea manualmente. Sirve de base para `athletes` y `coaches`.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid | PK — auth.users.id |
| email | text | |
| created_at | timestamptz | |

---

### `coaches`

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| nombre | text | |
| apellido | text | |
| created_at | timestamptz | |

---

### `athletes`

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → auth.users — nullable (el atleta puede no tener cuenta aún; requerido cuando se active Athlete Voice) |
| coach_id | uuid | FK → coaches, nullable (9 Jul 2026) — ya no es "dueño"/gate de acceso, solo metadata histórica (quién dio de alta, si aplica). Ver docs/scope-coach-atleta-libre.md. |
| nombre | text | |
| apellido | text | |
| fecha_nacimiento | date | |
| foto_url | text | Nullable — URL al storage de Supabase |
| mano_dominante | text | `'derecha'` o `'zurda'` — CHECK constraint |
| fecha_ingreso | date | Fecha en que el atleta entró a la academia |
| categoria | text | **Generado** — calculado desde `fecha_nacimiento` en la app (12U, 14U, 16U, 18U). No se guarda en BD; se computa al momento de leer. |
| utr_actual | numeric(4,2) | Se actualiza automáticamente con el `utr` del último `report_on_court` completado (trigger o función en Supabase). |
| activo | boolean | Default true — permite desactivar atletas sin borrarlos |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

### `reports`

Contenedor del reporte mensual. El estado de cada sección se infiere desde las tablas de sección (via `completed_at`).

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| athlete_id | uuid | FK → athletes |
| coach_id | uuid | FK → coaches — coach que abre el reporte |
| period | date | Primer día del mes (ej. 2026-06-01). Unique por (athlete_id, period). |
| athlete_voice_unlocked_at | timestamptz | Nullable — el coach lo abre manualmente cuando las demás secciones están listas |
| athlete_voice_unlocked_by | uuid | FK → coaches — quien lo desbloqueó |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Constraint:** `UNIQUE (athlete_id, period)` — un solo reporte por atleta por mes.

---

### `report_on_court`

Una fila por reporte. Responsable: coach.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| report_id | uuid | FK → reports. UNIQUE. |
| — Técnica — | | |
| serve | smallint | 1–5 |
| forehand | smallint | 1–5 |
| backhand | smallint | 1–5 |
| volea | smallint | 1–5 |
| return | smallint | 1–5 |
| footwork | smallint | 1–5 |
| tecnica_nota | text | Reflexión cualitativa del coach |
| — Táctica — | | |
| seleccion_golpe | smallint | 1–5 |
| manejo_riesgo | smallint | 1–5 |
| puntos_clave | smallint | 1–5 |
| adaptacion_tactica | smallint | 1–5 |
| tactica_nota | text | Reflexión cualitativa del coach |
| — Transferencia — | | |
| transferencia_partido | smallint | 1–5 |
| — Campos comunes — | | |
| utr | numeric(4,2) | UTR al momento del reporte |
| highlights | text[] | Hasta 3 URLs (Swing Vision, grabación propia, etc.) |
| — Metadata — | | |
| completed_at | timestamptz | Nullable — se llena cuando el coach marca la sección como completa |
| completed_by | uuid | FK → coaches |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Check constraints:**
- Todos los campos de escala: `CHECK (col BETWEEN 1 AND 5)`
- `highlights`: `CHECK (array_length(highlights, 1) <= 3)`

---

### `report_physical`

Una fila por reporte. Responsable: coach (con apoyo de fisioterapeuta).
Frecuencia real de llenado: cada 3 meses. El campo se crea con el reporte pero puede quedar vacío los meses intermedios — solo `completed_at` confirma que se hizo la evaluación.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| report_id | uuid | FK → reports. UNIQUE. |
| — Velocidad / Aceleración — | | |
| sprint_20m | numeric(4,2) | Segundos. Alternativa: sprint_10m. |
| — Resistencia aeróbica — | | |
| beep_test_nivel | smallint | Nivel alcanzado |
| beep_test_rep | smallint | Repetición en ese nivel |
| — Potencia de piernas — | | |
| salto_vertical_cm | numeric(4,1) | Centímetros. Countermovement jump. |
| — Agilidad — | | |
| spider_drill_seg | numeric(4,2) | Segundos. 5 conos. |
| — Movilidad / control postural (FMS simplificado) — | | |
| fms_squat | boolean | Pass = true |
| fms_lunge_izq | boolean | Pass = true |
| fms_lunge_der | boolean | Pass = true |
| fms_hombro_izq | boolean | Pass = true |
| fms_hombro_der | boolean | Pass = true |
| — Fuerza de tren inferior — | | |
| sentadillas_1min | smallint | Repeticiones completas en 1 minuto |
| — Fuerza de tren superior — | | |
| lagartijas_1min | smallint | Repeticiones completas en 1 minuto |
| — Potencia de golpes (Swing Vision) — | | |
| sv_potencia_prom_partido | numeric(5,1) | km/h o unidad de SV. Opcional. |
| sv_potencia_prom_sesion | numeric(5,1) | km/h o unidad de SV. Opcional. |
| — Metadata — | | |
| completed_at | timestamptz | Nullable |
| completed_by | uuid | FK → coaches |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

### `report_character`

Una fila por reporte. Responsable: coach. **Visible solo para coaches (RLS).**

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| report_id | uuid | FK → reports. UNIQUE. |
| etica_trabajo | smallint | 1–5 |
| etica_trabajo_nota | text | Nullable |
| coachabilidad | smallint | 1–5 |
| coachabilidad_nota | text | Nullable |
| liderazgo_nota | text | Texto libre. Nullable. |
| conducta_log | text | Log narrativo del periodo — incidentes y momentos positivos. Nullable. |
| — Metadata — | | |
| completed_at | timestamptz | Nullable |
| completed_by | uuid | FK → coaches |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

### `report_athlete_voice`

Una fila por reporte. Responsable: atleta.
Solo se puede crear si `reports.athlete_voice_unlocked_at IS NOT NULL` — enforced en RLS.

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| report_id | uuid | FK → reports. UNIQUE. |
| — On-Court (auto-evaluación) — | | |
| serve | smallint | 1–5 |
| forehand | smallint | 1–5 |
| backhand | smallint | 1–5 |
| volea | smallint | 1–5 |
| return | smallint | 1–5 |
| footwork | smallint | 1–5 |
| seleccion_golpe | smallint | 1–5 |
| manejo_riesgo | smallint | 1–5 |
| puntos_clave | smallint | 1–5 |
| adaptacion_tactica | smallint | 1–5 |
| transferencia_partido | smallint | 1–5 |
| — Physical (auto-evaluación) — | | |
| velocidad | smallint | 1–5 |
| resistencia | smallint | 1–5 |
| potencia | smallint | 1–5 |
| agilidad | smallint | 1–5 |
| movilidad | smallint | 1–5 |
| fuerza_tren_inferior | smallint | 1–5 |
| fuerza_tren_superior | smallint | 1–5 |
| — Character (auto-evaluación) — | | |
| etica_trabajo | smallint | 1–5 |
| coachabilidad | smallint | 1–5 |
| liderazgo | smallint | 1–5 |
| — Reflexión — | | |
| reflexion_mes | text | Obligatorio |
| — Metadata — | | |
| completed_at | timestamptz | Nullable |
| completed_by | uuid | FK → athletes |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## RLS — Row Level Security (resumen)

**Actualizado 9 Jul 2026** (docs/scope-coach-atleta-libre.md): la relación coach↔atleta dejó de ser un gate de acceso. Cualquier coach ve y edita a cualquier atleta — nadie tiene `DELETE` sobre `athletes` (baja = `activo = false`; borrar de verdad es manual, fuera de la app).

| Tabla | Coach | Atleta | Notas |
|---|---|---|---|
| `athletes` | Lee, crea (autoregistro del atleta) y edita a cualquiera. **Sin DELETE.** | Lee y edita su propio perfil | |
| `athlete_utr_history` / `athlete_profile_snapshots` / `athlete_recruitment_profile` | Lee de cualquier atleta | Lee/edita el suyo | Antes solo el coach "asignado" — abierto 9 Jul 2026 |
| `reports` | Lee de cualquiera, crea/edita los que él mismo abrió | Lee el suyo | `reports.coach_id` = quien lo abrió, no depende de `athletes.coach_id` |
| `report_on_court` | Lee de cualquiera, edita los de sus propios reportes | Lee el suyo | Solo si `completed_at IS NOT NULL` para el atleta |
| `report_physical` | Lee de cualquiera, edita los de sus propios reportes | Lee el suyo | |
| `report_character` | Lee de cualquiera, edita los de sus propios reportes | **Sin acceso** | Solo coaches |
| `report_athlete_voice` | Lee de cualquiera | Lee y edita el suyo | Solo si `athlete_voice_unlocked_at IS NOT NULL` |
| `quarterly_plans` / `quarterly_plan_objectives` | Lee, crea y edita cualquier plan de cualquier atleta. **Sin DELETE.** | Lee el suyo | Solo si `status IN ('active', 'completed')` — ampliado 10 Jul 2026 para la vista "Mi plan" del atleta (`docs/scope-mis-planes-atleta.md`); antes solo `active`. `draft` y `archived` siguen sin acceso para el atleta. |

> **`quarterly_plan_objectives` — cambio de schema 15 Jul 2026** (`docs/scope-close-quarterly-plan.md` §16.3, migración `split_outcome_state_and_carryover`): `outcome` pasó de 4 valores (`logrado`/`parcial`/`continua`/`deprioritized`) a 3 (`logrado`/`parcial`/`fallido`) — es el estado final del objetivo. Se agregó columna nueva `carryover` (boolean, nullable) — decisión independiente de si el foco se lleva al draft del periodo siguiente (`true` = continúa, `false` = depriorizado, junto con `deprioritized_at` que ya existía). RLS sin cambios, no hubo policy nueva. Sin tabla propia documentada arriba en "## Tablas" todavía — pendiente si se necesita una sección dedicada.

---

## Decisiones pendientes

| Decisión | Estado |
|---|---|
| ¿Los campos de On-Court son visibles para el atleta antes de que llene su Athlete Voice, o solo después? | Pendiente |
| Unidad de potencia de golpes en Swing Vision (km/h, mph, otra) | Pendiente — confirmar con SV |
| ¿`user_id` en `athletes` es requerido desde el arranque o se agrega después? | Pendiente — define si el atleta tiene cuenta propia en MVP |

---

## Open items (fuera del scope Phase 1)

- `report_mental` — pendiente formato de psicóloga
- `report_nutricion` — pendiente formato de nutrióloga
- `ptf_entries` — schema del Post-Tournament Form (ya documentado en ptf-post-tournament-form.md)
- `attendance` — registro de asistencia (feature en backlog)
- `physical_tests` — tabla separada para historial de pruebas físicas trimestrales (hoy viven dentro del reporte mensual; a futuro puede convenir separarlo)
