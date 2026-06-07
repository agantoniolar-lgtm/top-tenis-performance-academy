# Top Tennis Performance Academy — Instrucciones de Trabajo

## Contexto del proyecto

App de alto desempeño para una academia de tenis en México. El seguimiento del trabajo vive en Notion:
- **Página principal:** [🎾 Top Tennis Performance Academy](https://www.notion.so/3685a7ea466081f1b19ff96798d6497a)
- **Kanban de tasks:** base de datos embebida en esa página (Tasks)

---

## Reglas de trabajo — seguir siempre

### 1. Toda acción debe tener un Task en el kanban

Antes de empezar a trabajar en cualquier feature, bug, investigación o tarea, debe existir un task correspondiente en el kanban de Notion. Si no existe, crearlo antes de comenzar.

**Propiedad Category — obligatoria en cada task:**

| Valor | Cuándo usarlo |
|---|---|
| `Dev` | Código, infraestructura técnica, integraciones, diseño de schema, deploy |
| `Team` | Dependencias no técnicas: definiciones con coaches, documentos de producto, set up operativo, investigación, decisiones de negocio |

El kanban tiene dos vistas: **Board** (todos los tasks) y **Team Tasks** (filtrada por Category = Team). Al crear un task, siempre asignar la categoría correcta.

### 2. Actualizar el kanban cuando hay progreso

Cuando una tarea esté en progreso o se complete, actualizar su estado en el kanban de Notion en ese momento, no al final.

### 3. Cerrar sesión con el comando de fin de sesión

Cuando Marco dé la instrucción **"let's end the session and log progress for today"** (o equivalente), hacer lo siguiente:

1. **Agregar una entrada en Session Logs** — base de datos en Notion (`collection://31a5a7ea-4660-8388-b8fa-07ca342f9791`). Campos:
   - **Session** (title): nombre descriptivo de la sesión, ej. "Session N — Tema principal"
   - **Date**: fecha del día en ISO-8601
   - **Status**: "Complete"
   - **What we did**: resumen narrativo (no lista) de todo lo trabajado — qué se construyó, qué se decidió, qué se descartó. Mencionar items de Notion completados con contexto, no solo sus nombres.
   - **Key decisions**: decisiones importantes tomadas en la sesión que afectan el rumbo del proyecto.
   - **Open items / follow-ups**: pendientes que quedan abiertos para la próxima sesión.

2. **Actualizar la página principal** — en [🎾 Top Tennis Performance Academy](https://www.notion.so/3685a7ea466081f1b19ff96798d6497a):
   - **Last Session:** fecha y resumen breve de lo trabajado
   - **Next Session:** foco de la próxima sesión y deadline si aplica

No hacer esto de manera automática — esperar el comando explícito de Marco.

Si hay más de una sesión en el mismo día: no reemplazar el contenido de Last Session en la página principal — **agregar** lo nuevo al final del campo **What we did** existente. Next Session sí se puede actualizar si el foco cambió. Agregar también una nueva entrada en la tabla de Session Logs, indicando en **What we did** que es una sesión adicional del mismo día.

---

## Estructura de archivos del proyecto

El repositorio tiene dos carpetas principales:

- **`/top-tenis-performance-academy/`** — código fuente de la plataforma (React + Vite, ESLint, etc.)
- **`/top-tenis-performance-academy/Top Tennis Performance Academy/`** — documentos no técnicos

### Dónde guardar cada tipo de archivo

| Tipo de archivo | Carpeta |
|---|---|
| Código fuente, componentes, configuración | Raíz del repo (`/top-tenis-performance-academy/`) |
| Propuestas, contratos, presentaciones (.docx, .pdf, .pptx) | `Top Tennis Performance Academy/` |
| Documentos para compartir con coaches, atletas o clientes | `Top Tennis Performance Academy/` |
| Guías, plantillas, recursos de producto | `Top Tennis Performance Academy/` |
| Diseño de plataforma, evals, specs técnicas, ADRs | Raíz del repo o `/docs/` |

Cuando se cree un documento no técnico, guardarlo siempre en `Top Tennis Performance Academy/`, no en la raíz del repo.

---

## Stack técnico

- Frontend: React + Vite
- Linting: ESLint
