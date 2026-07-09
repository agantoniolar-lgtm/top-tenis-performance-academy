---
name: session-open-close
description: Usa este skill al ABRIR una sesión de trabajo en el proyecto Top Tennis Performance Academy (antes de empezar cualquier tarea nueva) para orientarte con el estado real del proyecto, y al CERRAR una sesión cuando Marco dé el comando "let's end the session and log progress for today" o equivalente ("cerremos por hoy", "logueemos el progreso", "hagamos el cierre de sesión"). Cubre leer/escribir los bloques Last Session y Next Session y la base Session Logs en Notion, revisar el kanban de Tasks, y recordar el commit final. Actívalo siempre al inicio de una sesión nueva en este proyecto, y siempre que Marco pida cerrar/loguear el día — incluso si no usa las palabras exactas.
---

# Apertura y cierre de sesión — Top Tennis Performance Academy

Este skill encapsula las reglas 2 y 5 de CLAUDE.md. Existe para que abrir o cerrar una sesión no dependa de recordar los pasos a mano — y para que el contexto de dónde se quedó el trabajo nunca se pierda entre sesiones.

## Al abrir sesión

Antes de empezar cualquier tarea nueva en este proyecto, y sin necesidad de que Marco lo pida (es solo lectura, hazlo proactivamente):

1. Fetch la página principal de Notion — 🎾 Top Tennis Performance Academy (`https://www.notion.so/3685a7ea466081f1b19ff96798d6497a`) — y lee los bloques **Last Session** y **Next Session**. Presta atención especial al campo **Dónde**: son los archivos/carpetas/módulos concretos donde quedó el trabajo. Es lo que te permite retomar sin releer todo el resumen narrativo.
2. Consulta el kanban de Tasks (`collection://c10a7056-b245-4eaa-9be3-24f94466692d`) filtrando por Status = "In Progress" — ¿hay algo que quedó a medias de una sesión anterior?
3. Verifica que el foco descrito en Next Session tenga su task correspondiente en el kanban. Si no existe, créalo antes de tocar código o documentos — por la regla 1 de CLAUDE.md: toda acción necesita un task, con `Category` (Dev/Team) asignada.
4. Si vas a trabajar en algo distinto a lo que dice Next Session, está bien — los planes cambian — pero dilo explícitamente en la conversación con Marco, para que quede reflejado cuando cierres la sesión y no se pierda por qué se desvió el foco.

## Al cerrar sesión

Dispara este flujo cuando Marco dé la instrucción de cierre — literal ("let's end the session and log progress for today") o equivalente en español/casual. **No lo hagas de forma automática ni proactiva** — solo cuando Marco lo pida explícitamente.

1. **Repasa qué se hizo en la sesión**: qué se construyó, qué se decidió, qué se descartó, y en qué archivos/carpetas/módulos concretos se trabajó — esto alimenta el campo **Dónde**. Sé específico: paths reales (`src/pages/portal/PlanesCoach.jsx`), nombres de Edge Functions (`generate-quarterly-plan`), tablas de Supabase — no solo el nombre de la feature en abstracto.

2. **Crea una entrada nueva en Session Logs** (`collection://31a5a7ea-4660-8388-b8fa-07ca342f9791`) con estos campos:
   - **Session** (title): "Session N — Tema principal"
   - **Date**: fecha de hoy, ISO-8601
   - **Status**: "Complete"
   - **Dónde**: los paths concretos tocados esta sesión (ver punto 1)
   - **What we did**: resumen narrativo en prosa (no lista) — qué se construyó, qué se decidió, qué se descartó. Menciona items de Notion completados con contexto, no solo sus nombres.
   - **Key decisions**: decisiones que afectan el rumbo del proyecto
   - **Open items / follow-ups**: pendientes que quedan abiertos para la próxima sesión

   Si es la segunda (o más) sesión del mismo día, esto se agrega como una entrada **nueva** en Session Logs indicando en "What we did" que es sesión adicional del mismo día — nunca se fusiona con la entrada anterior del mismo día.

3. **Reemplaza por completo** los bloques Last Session y Next Session en la página principal de Notion:
   - **Last Session**: Fecha + **Dónde** (los mismos paths que pusiste en Session Logs) + Qué hicimos. Se reemplaza entero — nunca acumula sesiones anteriores. El historial completo vive en Session Logs, esta página es solo el snapshot más reciente.
   - **Next Session**: Foco + **Dónde retomar** (los mismos paths de Last Session si el trabajo continúa ahí, o los paths nuevos si el foco cambia de área) + deadline si aplica.

4. **Recuerda el commit si quedó pendiente** (reglas 3/4 de CLAUDE.md). Si hubo cambios de código, corre lint + tests antes:
   ```bash
   npm run lint && npm test   # solo si hubo cambios de código
   git add -A
   git restore --staged "Top Tennis Performance Academy/.~lock.*" 2>/dev/null || true
   git commit -m "mensaje descriptivo con prefijo feat:/fix:/chore:/refactor:"
   ```
   El mensaje de commit debe ser descriptivo, no genérico (ver ejemplos en CLAUDE.md). El push lo hace Marco desde su terminal local — el commit es lo único que te toca a ti.

5. **Actualiza el Status del task correspondiente** en el kanban de Tasks (Done / In Review / se queda In Progress si de verdad sigue abierto).

## Por qué importa el campo "Dónde"

Antes de este skill, Last Session decía qué se había hecho pero no dónde, y Next Session no heredaba esa ubicación — cada apertura de sesión tenía que re-derivar en qué archivos se había trabajado, releyendo el resumen narrativo completo con la esperanza de que mencionara paths. El campo Dónde existe para que abrir una sesión sea: leer dos líneas, abrir esos archivos, seguir trabajando. No lo trates como un campo opcional — sin él, el skill pierde su propósito principal.
