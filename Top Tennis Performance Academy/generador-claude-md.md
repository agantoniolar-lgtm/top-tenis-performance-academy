# Generador de CLAUDE.md — Prompt reutilizable

Pega el contenido de la sección **PROMPT** en un proyecto nuevo (en el chat de Cowork / Claude Code).
Claude te va a entrevistar y, al final, va a generar un `CLAUDE.md` a la medida de ese proyecto.

Está diseñado para reproducir el mismo *setup de trabajo* que usas hoy (tracking obligatorio por task, commits disciplinados, cierre de sesión con log, reglas de testing) sin arrastrar nada específico de un proyecto en particular.

---

## PROMPT

> Copia todo lo que está dentro de este bloque.

```
Eres un asistente que me va a ayudar a generar un archivo CLAUDE.md para un proyecto
nuevo. CLAUDE.md son las instrucciones de trabajo que tú vas a seguir siempre en ese
proyecto.

NO escribas el documento todavía. Primero entrevístame. Hazme las preguntas por
bloques (no todas de golpe), una respuesta a la vez si hace falta, y propón defaults
sensatos cuando yo no tenga una opinión clara. Cuando tengas todo, genera el CLAUDE.md
final como archivo .md.

Estos son los bloques que necesito que cubras:

## 1. Contexto del proyecto
- ¿Qué es el proyecto en una o dos frases? (qué construye, para quién)
- ¿Cómo se llama?
- ¿En qué idioma quieres que trabaje y escriba los documentos?

## 2. Herramienta de seguimiento de trabajo
- ¿Dónde se trackea el trabajo? (Notion, Linear, Jira, GitHub Issues, Trello, ninguno)
- Si aplica: pásame el link a la página/tablero principal y a la base de tasks.
- Regla por defecto a incluir: "Antes de empezar cualquier feature, bug, investigación
  o tarea, debe existir un task correspondiente en el tracker. Si no existe, crearlo
  antes de empezar."
- ¿Quieres clasificar los tasks por categoría? (ej. Dev / Team / Producto / Research).
  Si sí, dime las categorías y cuándo usar cada una.
- Regla por defecto: "Actualizar el estado del task cuando hay progreso, en el momento,
  no al final de la sesión."

## 3. Disciplina de commits
- ¿El proyecto usa git? ¿Quién hace el push (yo localmente, o tú)?
- Regla por defecto a incluir: "Hacer commit de todos los cambios antes de cerrar la
  sesión."
- Regla de mensajes de commit (incluir siempre): mensajes descriptivos, nunca genéricos
  ("update", "fix", "changes" están prohibidos). Usar prefijos convencionales: feat:,
  fix:, chore:, refactor:. Cada mensaje explica QUÉ se hizo y POR QUÉ importa.
- ¿Hay algún gotcha del entorno que deba recordar? (ej. borrar index.lock, archivos de
  lock que no se deben commitear, sandbox sin acceso de red).

## 4. Cierre de sesión con log
- ¿Quieres un comando explícito de fin de sesión? (ej. "let's end the session and log
  progress for today"). El cierre NUNCA es automático: solo ocurre cuando yo lo pido.
- Si quieres llevar un registro de sesiones, dime dónde vive (base de datos en Notion,
  un archivo CHANGELOG.md, etc.) y qué campos quieres capturar. Default sugerido:
    - Nombre de la sesión
    - Fecha (ISO-8601)
    - Qué se hizo (resumen narrativo, no lista)
    - Decisiones clave
    - Pendientes / follow-ups para la próxima sesión
- ¿Hay una "página principal" que deba actualizar en cada cierre con Last Session /
  Next Session? Si sí, pásame el link.
- Regla para varias sesiones el mismo día: no reemplazar el log del día, AGREGAR la
  sesión nueva al final.

## 5. Estructura de archivos
- ¿Cómo está organizado el repo? (carpeta de código, carpeta de documentos no técnicos,
  /docs, etc.)
- Default a incluir: una tabla de "dónde guardar cada tipo de archivo" — código vs.
  documentos para compartir (propuestas, contratos, presentaciones) vs. specs técnicas
  / ADRs.

## 6. Stack técnico
- Frontend / backend / DB / hosting.
- Linter, framework de tests, CI (ej. ESLint, Vitest, GitHub Actions).

## 7. Reglas de testing (solo si el proyecto tiene código)
- Comando que debo correr antes de cada commit (default: lint + tests, ambos deben
  pasar; si falla, no commitear, arreglar primero).
- ¿Cuándo escribir tests nuevos? Default sugerido: cada función pura nueva (recibe
  params, devuelve valor, sin side effects) lleva su test; casos de borde y null
  cubiertos.
- ¿Dónde viven los tests y qué NO se testea todavía? (ej. llamadas a la DB, componentes
  de UI, rutas — hasta que el MVP esté estable).
- ¿Qué pasa si CI falla? (ej. bloquea el deploy).

## Reglas de estilo del CLAUDE.md que generes
- Escríbelo en el idioma que te indiqué en el bloque 1.
- Usa títulos claros, tablas donde ayuden, y bloques de código para comandos exactos.
- Empieza con una sección de "Reglas de trabajo — seguir siempre" con las reglas
  numeradas y accionables.
- Omite cualquier bloque que yo haya dicho que no aplica (ej. si no hay tests, no
  inventes una sección de testing).
- Marca con un placeholder claro {{como_este}} cualquier dato que yo no te haya dado
  todavía, para que sea fácil de completar después.
- Al final, dame el archivo CLAUDE.md listo para guardar en la raíz del repo nuevo.

Empieza ahora con el bloque 1.
```

---

## Cómo usarlo

1. Crea/abre el proyecto nuevo y arranca una sesión de Claude.
2. Pega el bloque PROMPT de arriba.
3. Responde la entrevista (puedes decir "usa el default" en cualquier bloque).
4. Guarda el `CLAUDE.md` resultante en la raíz del repo nuevo.

## Qué es generalizable (y qué se quitó)

Se conservó el *andamiaje* de trabajo, independiente de cualquier proyecto:

- Un task en el tracker por cada acción, con categoría y actualización en tiempo real.
- Commits disciplinados con mensajes convencionales y descriptivos.
- Cierre de sesión explícito con log estructurado (qué se hizo, decisiones, pendientes).
- Convención de dónde vive cada tipo de archivo.
- Reglas de testing atadas a funciones puras + gate de CI.

Se quitó todo lo específico de Top Tennis: nombres, links de Notion concretos, IDs de
bases de datos, el stack puntual (React+Vite), y las categorías Dev/Team —
ahora son preguntas de la entrevista, no valores fijos.
