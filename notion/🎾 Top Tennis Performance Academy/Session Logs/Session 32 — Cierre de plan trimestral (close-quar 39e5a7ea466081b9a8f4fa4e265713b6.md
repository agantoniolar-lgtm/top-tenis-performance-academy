# Session 32 — Cierre de plan trimestral (close-quarterly-plan) + handoff periodo→periodo

Date: July 14, 2026
Status: Complete

**Dónde:** `docs/scope-close-quarterly-plan.md` (nuevo, doc de scoping + 4 rebanadas documentadas); `src/pages/portal/coach/PlanesCoach.jsx`; `src/lib/athletics.js` + `src/lib/athletics.test.js`; Supabase (migración `add_deprioritized_outcome_and_deprioritized_at`, seed de datos dummy para Test Athlete).

**Qué hicimos:** Al abrir la sesión confirmamos que el commit de la sesión 31 ya se había hecho localmente, movimos a Done dos tasks estancados por `.git/index.lock` con evidencia de commit ya resuelta (guardrail dump quality, fix cache CMS), y revisamos `docs/scope-planning-measurement.md` incorporando lo construido en "Mi plan" del atleta — confirmando que el vacío de `athlete_retrospective`/`coach_retrospective` no era un bug de esa pantalla sino que `close-quarterly-plan` nunca se había construido, ni siquiera del lado del coach.

Con eso, Marco pidió abrir ese task. Escribimos el doc de scoping (`docs/scope-close-quarterly-plan.md`) que expuso dos gaps de schema/datos no documentados: el CHECK de `outcome` nunca incluía `deprioritized` (decisión de §21 del doc madre que se quedó solo en el doc, nunca migrada), y no hay una fuente uniforme de "3 scores del trimestre" por sub-dimensión entre las 4 dimensiones (liderazgo sin columna de score en `report_character`, physical con valores crudos sin banda). Con la autorización de Marco, construimos el cierre en 4 rebanadas: (1) cierre manual por foco (outcome/final_assessment autoguardado) + retrospectiva de 3 preguntas + wiring del `prior_bundle` a `generate`/`regenerate` (el contrato ya existía en la edge function, el cliente nunca lo llenaba); (2) aviso no-bloqueante de cierre anticipado + salto automático a crear el plan siguiente (prellenado, guardado como draft) al confirmar el cierre; (3) scores+último comentario del trimestre visibles en la vista de cierre (`monthlyScoresForFoco`), pre-selección de focos con `outcome: 'continua'` (`preselectFocos`), y unificación del carryover para que dependa de `priorBundle` (requiere plan anterior `completed`, ya no basta `active`); (4) correcciones tras revisión en vivo de Marco — quitamos las preguntas de retrospectiva de la UI (sin valor hasta que los coaches la usen; la lógica queda testeada en `athletics.js` sin wiring), cambiamos el formato de scores de números a palabras (`OC_LABEL`), y corregimos dos bugs reales en los datos dummy sembrados para Test Athlete: el rango completo de labels se había puesto en el plan `completed` (feb-abr) en vez del `active` (may-jul, el único donde el wizard de cierre es accesible), y las keys de `anchors` se sembraron como `"1"`/`"2"` en vez de `"+1"`/`"+2"` (`AnchorList` busca con el signo), dejando Adelantado/Superado sin texto. Ambos corregidos directo en Supabase.

Se sembraron datos dummy de 2 trimestres completos para Test Athlete (T1 feb-abr `completed` con outcomes variados + retrospectiva; T2 may-jul `active` con carryover explícito) para poder visualizar el flujo en vivo, reusando los 5 reportes mensuales que ya existían en BD. Se archivó un plan `active` huérfano de pruebas anteriores que interfería con la demo.

En el barrido de cierre de kanban: el task genérico "Planes trimestrales — generación con LLM y tracking en reportes mensuales" (sin notes, jun 24) se movió a Done por estar superado por los sub-tasks específicos de P&M v2. El resto de tasks In Progress/In Review revisados quedaron igual — ninguno se tocó esta sesión.

**Key decisions:**

- `close-quarterly-plan` se construye 100% manual esta rebanada (sin asistencia LLM) — bloqueado por el gap de datos de liderazgo/physical. Nuevo task de backlog (Team) para repensar ambas dimensiones antes de retomar la asistencia.
- Retrospectiva del coach queda fuera de la UI por ahora — decisión de Marco, sin valor claro hasta que los coaches usen el resto del flujo.
- El trigger automático "reporte de mes 3 → abre el cierre" se confirma **solo para el coach** (no adelanta `athlete_retrospective`), pero se pospone deliberadamente hasta resolver cómo se comportan las notas del coach + el `prior_bundle` con datos reales — secuenciado a propósito, no olvidado.
- El mapeo visual anclas↔outcome no se toca todavía — Marco quiere probarlo en vivo con datos reales antes de decidir si hace falta un puente.

**Open items / follow-ups:**

- `docs/scope-close-quarterly-plan.md` §13-15 tiene el detalle completo de lo pendiente: trigger de mes 3 (necesita definir relación `reports`↔`quarterly_plans`, hoy solo coinciden por fecha), mapeo anclas/outcome, pre-selección de continua ya construida.
- Task "P&M v2 — close-quarterly-plan..." se queda en **In Review** — Marco sigue probando en vivo con los datos de Test Athlete, no confirmado como Done todavía.
- Task nuevo en Backlog (Team): repensar liderazgo (score -2..+2 en `report_character`) y physical como dimensión de P&M.
- Servicio de notas de voz/texto (Backlog, sin scopear) necesita, cuando se scopee, cubrir explícitamente cómo se reconcilia con `prior_bundle` sin volverse mega-dump que degrade la calidad de `generate`/`regenerate` — hallazgo de esta sesión, anotado en el doc.