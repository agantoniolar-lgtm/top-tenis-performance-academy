---
name: commit-kanban-sync
description: >-
  Usa este skill cada vez que vayas a comitear cambios en el proyecto Top Tennis Performance Academy a media sesión — sin cerrar la sesión todavía. Corre lint+test, hace el commit con mensaje descriptivo, y actualiza en el momento el Status del task correspondiente en el kanban de Notion (Done / In Review / sigue In Progress). Actívalo cuando Marco diga "comitea esto", "guarda este avance", "ya quedó, comitea", o al llegar al paso 9 (Commit) de feature-build-flow. También sirve solo para sincronizar el kanban sin commit de código, cuando se completó un task de Category=Team (doc, decisión, research) que no toca el repo. No dispara el cierre de sesión completo (Session Logs, Last/Next Session) — para eso usa session-open-close. Úsalo las veces que haga falta en una sesión, no solo una vez al final.
---

# Commit + sincronización del kanban — Top Tennis Performance Academy

Este skill existe porque el cierre de sesión y el registro de progreso en el kanban son cosas de frecuencia distinta: el cierre pasa una vez por sesión, pero el trabajo se completa varias veces dentro de la misma sesión. Cuando la actualización del kanban solo pasaba en el cierre, los tasks se quedaban en "In Progress" o "In Review" mucho después de haberse terminado — ese es exactamente el problema que este skill corrige.

Compañero de este skill: **`session-open-close`** — ese skill cubre apertura y cierre completo de sesión (Session Logs, Last/Next Session) y, al cerrar, hace un barrido de *todo* el kanban. Este skill (`commit-kanban-sync`) es el que corre *dentro* de la sesión, tantas veces como haga falta, y nunca dispara ese cierre completo.

## Cuándo se usa

- Cada vez que termines una rebanada de trabajo comiteable (feature, fix, chore) — normalmente al llegar al paso 9 de `feature-build-flow`.
- Cuando Marco pida explícitamente comitear ("comitea esto", "guarda el avance").
- Cuando se completa un task de `Category = Team` que no genera commit (una decisión, un doc, una sesión de definición con coaches) — en ese caso se salta el bloque de git y se va directo a actualizar el kanban.

**No uses este skill para el cierre de sesión completo.** Un commit a media sesión nunca debe disparar Session Logs ni el reemplazo de Last Session/Next Session — eso solo pasa con el comando explícito de cierre, vía `session-open-close`.

## Flujo

### 1. Lint + test (solo si hubo cambios de código)

```bash
npm run lint && npm test
```

Debe pasar limpio. Si falla, no se commitea — se arregla primero, no se documenta como pendiente.

### 2. Commit

```bash
git add -A
git restore --staged "Top Tennis Performance Academy/.~lock.*" 2>/dev/null || true
git commit -m "mensaje descriptivo con prefijo feat:/fix:/chore:/refactor:"
```

Mensaje descriptivo, no genérico — ver ejemplos en CLAUDE.md. El push lo hace Marco desde su terminal local; el sandbox de Cowork no tiene acceso de red a GitHub.

> Nota `.git/index.lock`: si bloquea el commit, Marco debe borrarlo manualmente (`rm .git/index.lock`) — el sandbox no tiene permiso para hacerlo.

### 3. Actualizar el kanban — el paso que no se puede saltar

Identifica el (o los) task(s) en el kanban de Notion (`collection://c10a7056-b245-4eaa-9be3-24f94466692d`) que corresponden al trabajo recién comiteado o completado, y actualiza su `Status` **en este momento**, no lo dejes para el cierre de sesión:

- **Done** — el trabajo del task quedó terminado y probado.
- **In Review** — quedó implementado pero pendiente de que Marco lo pruebe/revise antes de darlo por cerrado (ej. "falta que Marco corra la app y confirme", o "falta git push + revisión").
- **Sigue In Progress** — el commit fue solo un avance parcial y falta más trabajo en esta sesión o en una futura. Si se queda así, dilo explícitamente para que quede claro que es intencional, no un olvido.

Si el trabajo reveló un pendiente nuevo que no estaba planeado (un bug encontrado, una feature derivada), créalo como task nuevo en el kanban con su `Category` — no lo dejes flotando solo en la conversación (regla 1 de CLAUDE.md).

### 4. Confirma con Marco antes de seguir

Un one-liner basta: "Comiteado `<resumen>`, task `<nombre>` movido a `<Status>`." No hace falta ceremonia — el punto es que el kanban nunca se desincronice de la realidad del código o del trabajo hecho.
