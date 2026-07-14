---
name: session-open-close
description: Usa este skill al ABRIR una sesión de trabajo en el proyecto Top Tennis Performance Academy (antes de empezar cualquier tarea nueva) para orientarte con el estado real del proyecto, y al CERRAR una sesión cuando Marco dé el comando "let's end the session and log progress for today" o equivalente ("cerremos por hoy", "logueemos el progreso", "hagamos el cierre de sesión"). Cubre leer/escribir los bloques Last Session y Next Session, la base Session Logs en Notion, y — al cerrar — un barrido completo de TODO el kanban (no solo lo tocado hoy) para que nunca queden tasks fantasma en In Progress o In Review. No uses este skill para un commit a media sesión ni para actualizar un solo task — eso es commit-kanban-sync.
---

# Apertura y cierre de sesión — Top Tennis Performance Academy

Este skill encapsula las reglas 2 y 5 de CLAUDE.md. Existe para que abrir o cerrar una sesión no dependa de recordar los pasos a mano — y para que el contexto de dónde se quedó el trabajo nunca se pierda entre sesiones.

Compañero de este skill: **`commit-kanban-sync`** — cubre commits y actualización del kanban *dentro* de la sesión, cada vez que se termina una rebanada de trabajo. Ese skill puede correr muchas veces por sesión; este (`session-open-close`) corre exactamente dos veces (abrir y cerrar). Un commit a media sesión nunca debe disparar este skill — solo el comando explícito de cierre lo hace.

## Al abrir sesión

Antes de empezar cualquier tarea nueva en este proyecto, y sin necesidad de que Marco lo pida (es solo lectura, hazlo proactivamente):

1. Fetch la página principal de Notion — 🎾 Top Tennis Performance Academy (`https://www.notion.so/3685a7ea466081f1b19ff96798d6497a`) — y lee los bloques **Last Session** y **Next Session**. Presta atención especial al campo **Dónde**: son los archivos/carpetas/módulos concretos donde quedó el trabajo. Es lo que te permite retomar sin releer todo el resumen narrativo.
2. Consulta el kanban de Tasks (`collection://c10a7056-b245-4eaa-9be3-24f94466692d`) filtrando por Status = "In Progress" **o "In Review"** — ¿hay algo que quedó a medias o pendiente de revisión de una sesión anterior? Menciónaselo a Marco en vez de asumir que sigue vigente: un task puede llevar días estancado ahí sin que nadie lo haya movido.
3. Verifica que el foco descrito en Next Session tenga su task correspondiente en el kanban. Si no existe, créalo antes de empezar (regla 1 de CLAUDE.md).
4. Si vas a trabajar en algo distinto a lo que dice Next Session, está bien — los planes cambian — pero dilo explícitamente en la conversación con Marco, para que quede reflejado al cerrar.

## Al cerrar sesión

Dispara este flujo cuando Marco dé la instrucción de cierre — literal ("let's end the session and log progress for today") o equivalente en español/casual. **No lo hagas de forma automática ni proactiva, y no lo confundas con un commit a media sesión** — eso es `commit-kanban-sync`, no esto.

1. **Repasa qué se hizo en la sesión**: qué se construyó, qué se decidió, qué se descartó, y en qué archivos/carpetas/módulos concretos se trabajó — esto alimenta el campo **Dónde**. Sé específico: paths reales (`src/pages/portal/PlanesCoach.jsx`), nombres de Edge Functions (`generate-quarterly-plan`), tablas de Supabase — no solo el nombre de la feature en abstracto.

2. **Si queda algo sin comitear o sin reflejar en el kanban de lo que se hizo hoy**, corre `commit-kanban-sync` primero. Así el kanban ya refleja el trabajo de esta sesión antes de hacer el barrido general del punto 3.

3. **Barrido completo del kanban — obligatorio, sin excepción.** Consulta TODOS los tasks con Status = "In Progress" o "In Review" en `collection://c10a7056-b245-4eaa-9be3-24f94466692d`, **no solo los que se tocaron en esta sesión**. Para cada uno, reconcilia con Marco su estado real:
   - ¿Ya se terminó y nadie lo movió a Done? Muévelo.
   - ¿Sigue genuinamente abierto? Déjalo, y que quede reflejado en Open items/follow-ups.
   - ¿Quedó obsoleto o reemplazado por otro trabajo? Dilo explícitamente y decide con Marco si se mueve a Done (con nota de qué lo reemplazó) o vuelve a Backlog.

   **Verificación cruzada con `git log` antes de preguntar — no asumas que un bloqueo local sigue vigente.** Si las Notes de un task dicen que está bloqueado por algo que le tocaba a Marco desde su terminal (`.git/index.lock`, "falta que Marco corra X", "pendiente push") corre `git log --oneline` (rango de fechas desde que se anotó el bloqueo) y busca un commit cuyo mensaje o archivos coincidan con la descripción del task. Si encuentras evidencia de que ya se resolvió, dilo con el hash del commit como evidencia y trátalo como candidato a Done/In Review sin esperar a que Marco lo reporte por texto — varios tasks de este proyecto se quedaron parados semanas en In Review con nota de `index.lock` porque el bloqueo se resolvió localmente y nunca se avisó por chat (ver Session Log de esta fecha para el caso real que originó esta regla). Sigue pidiéndole a Marco que confirme el move final, pero la evidencia de git basta para proponerlo activamente en vez de dejarlo estancado por default.

   Este paso es la razón de ser del skill actualizado: si `commit-kanban-sync` se usa consistentemente durante la sesión, este barrido debería encontrar poco o nada fuera de lugar — pero se corre siempre, porque es la única red de seguridad contra tasks que se quedan colgados de sesiones anteriores.

4. **Crea una entrada nueva en Session Logs** (`collection://31a5a7ea-4660-8388-b8fa-07ca342f9791`) con estos campos:
   - **Session** (title): "Session N — Tema principal"
   - **Date**: fecha de hoy, ISO-8601
   - **Status**: "Complete"
   - **Dónde**: los paths concretos tocados esta sesión (ver punto 1)
   - **What we did**: resumen narrativo en prosa (no lista) — qué se construyó, qué se decidió, qué se descartó. Menciona items de Notion completados con contexto, no solo sus nombres. Incluye también los movimientos del barrido del punto 3, especialmente cualquier task cerrado por evidencia de `git log` en vez de confirmación explícita de Marco — es la forma en la que ese hallazgo queda registrado para el futuro, no solo en el kanban.
   - **Key decisions**: decisiones que afectan el rumbo del proyecto
   - **Open items / follow-ups**: pendientes que quedan abiertos para la próxima sesión

   Si es la segunda (o más) sesión del mismo día, esto se agrega como una entrada **nueva** en Session Logs indicando en "What we did" que es sesión adicional del mismo día — nunca se fusiona con la entrada anterior del mismo día.

5. **Reemplaza por completo** los bloques Last Session y Next Session en la página principal de Notion:
   - **Last Session**: Fecha + **Dónde** (los mismos paths que pusiste en Session Logs) + Qué hicimos. Se reemplaza entero — nunca acumula sesiones anteriores. El historial completo vive en Session Logs, esta página es solo el snapshot más reciente.
   - **Next Session**: Foco + **Dónde retomar** (los mismos paths de Last Session si el trabajo continúa ahí, o los paths nuevos si el foco cambia de área) y deadline si aplica — se actualiza siempre para reflejar la prioridad correcta de cara a lo que sigue.

No hacer esto de manera automática — esperar el comando explícito de Marco.

## Por qué importa el campo "Dónde"

Antes de este skill, Last Session decía qué se había hecho pero no dónde, y Next Session no heredaba esa ubicación — cada apertura de sesión tenía que re-derivar en qué archivos se había trabajado, releyendo el resumen narrativo completo con la esperanza de que mencionara paths. El campo Dónde existe para que abrir una sesión sea: leer dos líneas, abrir esos archivos, seguir trabajando. No lo trates como un campo opcional — sin él, el skill pierde su propósito principal.

## Por qué importa el barrido completo del punto 3

Antes de esta versión del skill, el cierre solo actualizaba el/los task(s) de la sesión en curso — no había ningún mecanismo que revisara los tasks que quedaron "In Progress" o "In Review" de sesiones anteriores y nunca se cerraron. Eso llevó a que el kanban acumulara tasks fantasma (trabajo ya terminado hace días, pero que seguía apareciendo como abierto). El barrido completo es lo que evita que eso se repita — trátalo como un paso obligatorio del cierre, no como limpieza opcional.
