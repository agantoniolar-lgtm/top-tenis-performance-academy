# Guía de prueba en vivo — Cierre de plan trimestral (P&M v2)

**Fecha:** 15 Jul 2026
**Task Notion:** P&M v2 — close-quarterly-plan + retrospectives + handoff periodo→periodo (In Review)
**Objetivo:** correr el flujo completo de cierre — coach y atleta — para confirmar que conecta bien de punta a punta antes de mover el task a Done. Punto de partida: los 2 trimestres dummy ya sembrados para Test Athlete (no se puede avanzar el reloj, así que el trimestre `active` mayo–jul 2026 es el que se cierra hoy).
**Detalle técnico completo:** `docs/scope-close-quarterly-plan.md` (especialmente §11, §13–15).

---

## 1. Punto de partida (datos ya sembrados)

| Plan | Periodo | Status | Focos | Notas |
|---|---|---|---|---|
| T1 | feb–abr 2026 | `completed` | `backhand` (parcial), `manejo_riesgo` (continúa), `liderazgo` (logrado, sin score), `forehand` y `puntos_clave` (logrado, llegan a Superado) | + mantenimiento `serve`. Tiene `coach_retrospective` con las 3 preguntas respondidas (dato viejo, sembrado antes de quitar esa pregunta de la UI). |
| T2 | may–jul 2026 | `active` — **este es el que se cierra hoy** | `manejo_riesgo` (carryover de T1, se deja en 0 — sin mejora, contraste realista), `volea` (mayo → Superado), `seleccion_golpe` (foco nuevo, junio → Superado) | `backhand` pasó a mantenimiento (con carryover) en este trimestre. |

`period_end` de T2 es fin de julio 2026 — **todavía no pasa** (hoy es 15 Jul), así que el aviso de "cierre anticipado" debería aparecer al abrir la vista de cierre. Es esperado, no es un bug.

---

## 2. Setup

Dos ventanas/navegadores en paralelo:
- **Coach:** login normal → `/portal/planes`.
- **Test Athlete:** login → `/portal/mi-plan`.

---

## 3. Pasos — lado Coach

| # | Acción | Qué verificar |
|---|---|---|
| C1 | `/portal/planes` → localizar el plan `active` de Test Athlete (may–jul 2026) → abrir su detail | Se ven los 3 focos + `backhand` como mantenimiento, anclas visibles |
| C2 | Click **"Cerrar periodo →"** | Entra a la vista "Cerrar periodo — [nombre]" |
| C3 | Revisar el aviso ámbar | Debe decir algo como "Este trimestre termina el [fecha] — todavía no se cumple. Puedes cerrar antes de tiempo, pero revisa que no te falte la medición de algún mes." |
| C4 | Por cada foco (`manejo_riesgo`, `volea`, `seleccion_golpe`): revisar el bloque "Scores del trimestre" (en palabras: Estancado/Rezagado/Por buen camino/Adelantado/Superado) + "Último comentario" | Los scores deben coincidir con lo sembrado — `volea` y `seleccion_golpe` deberían mostrar Superado, `manejo_riesgo` algo estancado/neutro |
| C5 | Elegir **outcome** por foco (Logrado / Parcial / Continúa / Depriorizado) | El chip se resalta al elegir; se autoguarda de inmediato (no hace falta salir de la vista) |
| C6 | Si el outcome no es "Depriorizado", escribir `final_assessment` (textarea) y sacar el foco (blur) | Se autoguarda al perder el foco |
| C7 | Probar marcar un foco como "Depriorizado" | El textarea de `final_assessment` debe desaparecer y limpiarse |
| C8 | Dejar a propósito un foco sin outcome antes de continuar | Debe aparecer aviso ámbar: "N foco(s) sin resultado asignado todavía — puedes confirmar el cierre igual y volver después" — y el botón de confirmar **no** debe bloquearse |
| C9 | Asignar outcome a todos los focos y click **"Confirmar cierre"** | El plan pasa a `completed`, se llena `closed_at` |
| C10 | Verificar el salto automático | Debe abrir directo el wizard de **"Nuevo plan"** con Test Athlete + el periodo siguiente (ago–oct 2026) ya prellenados, aterrizando en el paso de Observaciones (no en el paso 1) |
| C11 | Volver a `/portal/planes`, abrir el plan may–jul (ahora `completed`) | Debe mostrar el `outcome` y `final_assessment` que acabas de guardar, por foco, de forma persistente |
| C12 | En el wizard nuevo (del paso C10): escribir observaciones → "Identificar focos →" | En "Continúan del trimestre anterior" deberían aparecer preseleccionados los focos que cerraste como **Continúa** en el plan may–jul |

---

## 4. Pasos — lado Atleta (Test Athlete)

Ejecutar en paralelo o justo después de que el coach llegue a C9.

| # | Acción | Qué verificar |
|---|---|---|
| A1 | `/portal/mi-plan`, **antes** de que el coach cierre (durante C1–C8) | "Plan activo" muestra may–jul 2026 con sus focos, anclas y `backhand` como mantenimiento — sin ningún outcome visible |
| A2 | Refrescar `/portal/mi-plan` **después** de C9 (coach confirmó el cierre) | El plan may–jul ya no aparece como "Plan activo" — debe aparecer en "Planes anteriores" |
| A3 | Expandir may–jul en "Planes anteriores" | Cada foco muestra su chip de outcome (mismo color/label que vio el coach) + el `final_assessment` en cursiva debajo |
| A4 | Revisar si aparece "Retrospectiva del periodo" en el plan may–jul recién cerrado | **No debería aparecer nada** — `coach_retrospective` ya no se escribe desde la UI (se quitó, §15 del scope). Si aparece algo, es un bug. |
| A5 | Expandir T1 (feb–abr), ya `completed` desde antes | Aquí **sí** debería verse la sección "Retrospectiva del periodo → Tu coach" con las 3 respuestas — es dato viejo sembrado antes del recorte, sirve de contraste con A4 |
| A6 | Si el coach llegó a publicar el plan ago–oct (tras C12 en adelante) | Refrescar `/portal/mi-plan` — debería aparecer como el nuevo "Plan activo" |

---

## 5. Puntos abiertos a observar especialmente (docs/scope-close-quarterly-plan.md §13–15)

Esto es lo que Marco todavía no ha decidido y esta corrida en vivo debería ayudar a resolver:

- **Anclas vs. outcome:** ¿el coach traduce bien mentalmente entre la escala de anclas (Estancado…Superado) y el vocabulario de outcome (Logrado/Parcial/Continúa/Depriorizado), o hace falta un puente visual?
- **Formato de "Scores del trimestre":** hoy es texto plano (`Estancado · Rezagado · Superado`). ¿Comunica bien o necesita otro formato (badges, mini-gráfica)?
- **Pre-selección de "Continúa" en el wizard nuevo (C12):** ¿se siente natural o confunde?
- **Salto automático al plan siguiente (C10):** ¿es el comportamiento correcto o se siente abrupto / debería ser opcional?
- **Mobile:** el task de mobile-first ya se cerró como Done — aprovechar esta corrida para confirmar que el flujo de cierre en particular (que es nuevo) también se ve bien en viewport móvil.

---

## 6. Captura de observaciones

| # | Paso (ej. C5, A4) | Rol | Qué pasó | Qué esperabas | ¿Bug o solo observación? |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
