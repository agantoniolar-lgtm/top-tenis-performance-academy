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

### 3. Hacer commit antes de cerrar la sesión

Antes de cerrar cualquier sesión, hacer commit de todos los cambios realizados durante ella:

```bash
git add -A
git restore --staged "Top Tennis Performance Academy/.~lock.*" 2>/dev/null || true
git commit -m "descripción de lo trabajado en la sesión"
```

El push lo hace Marco desde su terminal local (`git push`). El sandbox de Cowork no tiene acceso de red a GitHub.

> **Nota sobre el index.lock:** si `git add -A` deja un `.git/index.lock` que bloquea el commit, Marco debe borrarlo manualmente: `rm .git/index.lock`

### 4. Cerrar sesión con el comando de fin de sesión

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
- Tests: Vitest (`npm test`)
- CI: GitHub Actions — corre lint + tests en cada push a `main`

---

## Reglas de testing — seguir siempre

### Antes de cada commit

Correr siempre antes de hacer `git add`:

```bash
npm run lint && npm test
```

Ambos deben pasar sin errores. Si alguno falla, no hacer commit — arreglar primero.

### Cuándo escribir tests nuevos

Cada vez que se agregue una función pura a `src/lib/`, agregar sus tests en el archivo `src/lib/*.test.js` correspondiente. Una función pura es cualquier función que: recibe parámetros, devuelve un valor, y no tiene side effects (no llama a Supabase, no modifica estado, no toca el DOM).

**Regla simple:** si una función tiene un `if (x == null)`, hay un test para `null`. Si tiene rangos o límites, hay tests para los extremos.

### Dónde viven los tests

- Funciones compartidas → `src/lib/athletics.test.js` (o el archivo que corresponda)
- Las llamadas a Supabase, componentes React y rutas **no se testean** hasta que el MVP esté estable

### Qué pasa si los tests fallan en CI

GitHub Actions corre lint + tests en cada push a `main`. Si fallan, el badge en GitHub queda en rojo. Vercel bloquea el deploy porque el `buildCommand` en `vercel.json` incluye `npm run lint && npm test && npm run build` — si cualquiera falla, el build cancela y el deploy no ocurre.

### Cómo agregar un test nuevo (patrón)

```js
import { describe, it, expect } from 'vitest';
import { miFuncion } from './athletics.js';

describe('miFuncion', () => {
  it('caso normal', () => {
    expect(miFuncion(valor)).toBe(resultado_esperado);
  });
  it('devuelve null si el input es null', () => {
    expect(miFuncion(null)).toBeNull();
  });
  it('clampea/maneja el extremo inferior', () => {
    expect(miFuncion(valorMínimo)).toBe(resultadoEsperado);
  });
});
```
