# Top Tennis Performance Academy — Instrucciones de Trabajo

## Contexto del proyecto

App de alto desempeño para una academia de tenis en México. El seguimiento del trabajo vive en archivos locales del repo desde 2026-07-17 (migrado desde un kanban de Notion — el export crudo de Notion queda en `notion/` como respaldo, sin actualizarse más). Restructurado el 2026-07-18 para que escale: antes era un solo `TASKS.md`/`TASKS_ARCHIVE.md` con las 157 tasks migradas; ahora se separa por estado:
- **Tasks activos (`in progress`/`in review`):** `TASKS.md` (raíz del repo)
- **Ideas sin empezar:** `BACKLOG.md` (raíz del repo, sin límite de tamaño — se promueven a `TASKS.md` recién cuando arranca el trabajo real)
- **Tasks terminados, lote actual:** `TASKS_ARCHIVE.md` (raíz del repo) — revisar acá primero
- **Tasks terminados, lotes viejos:** una vez que `TASKS_ARCHIVE.md` llega a 50 entradas, el lote viejo se mueve a `tasks-archive/TASKS_ARCHIVE_{fecha-inicio}_{fecha-fin}.md`, indexado en `TASKS_ARCHIVE_INDEX.md`
- **Estado del proyecto a la fecha:** `STATUS.md`
- **Historial de sesiones:** `/logs/session-YYYY-MM-DD.md`
- **Backups de la migración original (pre-split), sin actualizarse más:** `tasks-archive/TASKS_pre-split-2026-07-18-backup.md` y `tasks-archive/TASKS_ARCHIVE_pre-split-2026-07-18-backup.md`

---

## Reglas de trabajo — seguir siempre

### 1. Toda acción debe tener un Task en `TASKS.md`

Antes de empezar a trabajar en cualquier feature, bug, investigación o tarea, debe existir un task correspondiente en `TASKS.md`. Si no existe, crearlo antes de comenzar.

**Propiedad `category` — obligatoria en cada task:**

| Valor | Cuándo usarlo |
|---|---|
| `Dev` | Código, infraestructura técnica, integraciones, diseño de schema, deploy |
| `Team` | Dependencias no técnicas: definiciones con coaches, documentos de producto, set up operativo, investigación, decisiones de negocio |

Cada entrada de `TASKS.md` sigue el formato: `### {{id}} — {{título}}` seguido de `category`, `type`, `epic`, `priority`, `status`, `created`, y un bloque `**Notas:**` con el detalle narrativo (qué se hizo, qué se decidió, qué queda pendiente — se acumula con fechas conforme avanza el trabajo, no se sobreescribe). El `id` sigue el patrón `T{número consecutivo}-{slug}`.

### 2. Al abrir sesión

Antes de empezar a trabajar, orientarse con el estado real del proyecto:

1. Leer `STATUS.md` completo — la sección "Last session" (qué se hizo y **dónde**, archivos/carpetas/módulos concretos) y "Pending / next session priority" (foco acordado para esta sesión).
2. Leer el archivo más reciente en `/logs/` si hace falta más detalle narrativo que el resumen de `STATUS.md`.
3. Revisar `TASKS.md` — ¿hay tasks en `in progress` o `in review` que quedaron abiertos de una sesión anterior? ¿el foco de "Pending" en `STATUS.md` ya tiene su task correspondiente? Si no, crearlo antes de empezar (regla 1).
4. Si el foco de la sesión se desvía de lo que dice "Pending", está bien — pero decirlo explícitamente, para que quede reflejado al cerrar.

**Why:** sin este paso cada sesión arranca sin memoria del estado real del proyecto, y se re-deriva contexto que ya existe en estos archivos.

### 3. Actualizar `TASKS.md` cuando hay progreso

Cuando una tarea esté en progreso o se complete, actualizar su `status` en `TASKS.md` en ese momento, no al final. Cuando un task llega a `done`, mover su entrada completa a `TASKS_ARCHIVE.md` de inmediato — no esperar al cierre de sesión. Si ese movimiento lleva `TASKS_ARCHIVE.md` a 50 entradas, hacer el split: el lote más viejo se mueve a `tasks-archive/TASKS_ARCHIVE_{fecha-inicio}_{fecha-fin}.md` (creando esa carpeta la primera vez que pase), se agrega una fila en `TASKS_ARCHIVE_INDEX.md`, y `TASKS_ARCHIVE.md` vuelve a arrancar vacío para lo próximo que se complete. Ideas todavía no iniciadas (no un task real todavía) van en `BACKLOG.md` en vez de crearse directo en `TASKS.md`.

### 4. Hacer commit antes de cerrar la sesión

Antes de cerrar cualquier sesión, hacer commit de todos los cambios realizados durante ella:

```bash
git add -A
git restore --staged "Top Tennis Performance Academy/.~lock.*" 2>/dev/null || true
git commit -m "descripción de lo trabajado en la sesión"
```

**Regla de mensajes de commit:** cada commit debe tener un mensaje descriptivo que explique qué se hizo, no genérico. Ejemplos de mensajes malos: "update", "changes", "fix". Ejemplos de mensajes buenos: "feat: conectar PTF a Supabase con tabla post_tournament_forms", "fix: RLS en report_character bloqueaba a atletas", "chore: fix useEffect dependency warning en Reclutamiento.jsx". Usar prefijos: `feat:`, `fix:`, `chore:`, `refactor:`. Esto evita que el historial en GitHub se llene de commits sin contexto.

El push lo hace Marco desde su terminal local (`git push`). El sandbox de Cowork no tiene acceso de red a GitHub.

> **Nota sobre el index.lock:** si `git add -A` deja un `.git/index.lock` que bloquea el commit, Marco debe borrarlo manualmente: `rm .git/index.lock`

### 5. Cerrar sesión con el comando de fin de sesión

Cuando Marco dé la instrucción **"let's end the session and log progress for today"** (o equivalente, "cerremos por hoy", "logueemos el progreso"), hacer lo siguiente:

1. **Barrido completo de `TASKS.md`** — no solo lo tocado hoy: revisar todo lo que está en `in progress` o `in review`, confirmar con Marco si sigue vigente, se movió a `done`, o quedó obsoleto. Mover a `TASKS_ARCHIVE.md` todo lo que llegó a `done`.
2. **Escribir un archivo nuevo en `/logs/session-YYYY-MM-DD.md`** con:
   - **Dónde:** archivos, carpetas o módulos concretos que se tocaron esta sesión — paths reales, no solo el nombre de la feature. Ej. `docs/scope-rubrica-objetivos.md`, `src/pages/portal/PlanesCoach.jsx`, Edge Function `generate-quarterly-plan`. Este campo es lo que permite retomar sin releer todo el resumen narrativo.
   - **Qué se hizo:** resumen narrativo (no lista) de todo lo trabajado — qué se construyó, qué se decidió, qué se descartó. Mencionar tasks completados con contexto, no solo sus IDs.
   - **Decisiones clave:** decisiones importantes tomadas en la sesión que afectan el rumbo del proyecto.
   - **Pendientes / follow-ups:** lo que queda abierto para la próxima sesión.
3. **Actualizar `STATUS.md`:**
   - **Last session:** se reemplaza por completo con la fecha, el **dónde**, y el resumen de la sesión que se acaba de cerrar — nunca acumula sesiones anteriores. El historial completo vive en `/logs/`, no aquí; esta sección es solo el snapshot más reciente.
   - **Pending / next session priority:** foco de la próxima sesión, **dónde retomar** (mismos paths si se continúa el mismo trabajo, o los nuevos si el foco cambia) y deadline si aplica.
   - **Decided / deferred:** cualquier cosa que se decidió posponer explícitamente, para que no se vuelva a discutir sin contexto.
   - Nunca tocar el campo `maturity:` — eso lo cambia solo Marco.

No hacer esto de manera automática — esperar el comando explícito de Marco.

Si hay más de una sesión en el mismo día: se crea un archivo `/logs/` nuevo por cada sesión adicional (ej. `session-2026-07-17-b.md`), indicando que es sesión adicional del mismo día. `STATUS.md` igual se **reemplaza** con el resumen de la sesión que se acaba de cerrar, no se le agrega al texto anterior.

### 6. Mobile-first en toda UI nueva

Coaches usan el portal en cancha; atletas, desde el teléfono. No es un check automatizable como lint/test (no hay linter de responsive) — es una **verificación manual**, y como tal es un paso del proceso de construcción, no una regla de commit.

Se hace durante el paso `build` del componente React (ver la secuencia de skills abajo), **antes** de pasar a `verify-tests`+`commit`: cualquier componente React nuevo, o cambio visual no trivial a uno existente, se revisa en viewport móvil (~375px) — layout, botones alcanzables, texto sin desbordar — antes de considerar ese paso terminado. Si el cambio es puramente de lógica/datos sin superficie visual nueva, este paso no aplica.

### 7. Ambiente de pruebas air-tight — la app nunca habla con producción por accidente, y las migraciones nunca mezclan schema con datos

Agregada 2026-07-20 (`T160`), a partir de un gap real encontrado: hasta esa fecha `src/lib/supabase.js` tenía la URL/key de producción hardcodeadas, así que correr `npm run dev` local siempre tocaba datos reales de atletas.

- **Conexión de la app:** `src/lib/supabase.js` lee `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` de `import.meta.env`, sin fallback hardcodeado — si faltan, la app falla fuerte al arrancar en vez de conectarse silenciosamente a algo inesperado. En local, `.env.local` apunta siempre al proyecto **sandbox** (`xchdawwajmnnhkncikig`) por default. Producción (`rrrwhwciggohwxslqlho`) solo se configura como variable de entorno en Vercel — nunca en un archivo del repo.
- **Migraciones son solo schema (DDL), nunca datos (DML).** Un archivo en `supabase/migrations/` no debe mezclar `ALTER`/`CREATE` con `INSERT`/`UPDATE`/`DELETE`/`TRUNCATE` sobre filas reales — probar una migración así contra el sandbox no garantiza nada, porque el sandbox tiene datos distintos a producción (el mismo archivo puede no tener efecto ahí y sí ser destructivo en prod, o viceversa). Un fix de datos de una sola vez es un script aparte, fuera de `supabase/migrations/`, corrido explícitamente y confirmado por Marco — nunca agregado a una migración versionada que se puede re-aplicar. Se hace cumplir con `scripts/check-migrations-schema-only.mjs`, corrido en `.husky/pre-commit` (bloquea el commit) y como backstop en `.github/workflows/ci.yml` (bloquea el push/PR) — igual que el patrón de `gitleaks` para secretos. Escape hatch documentado: una línea `-- ALLOW-DML: <razón>` en el archivo, para el caso raro y revisado a propósito.
- **Todo push de una migración a producción se documenta en `supabase/PROD_MIGRATIONS_LOG.md`**, en el momento en que se aplica — no después. Ver ese archivo para el procedimiento completo (aplicar y verificar en sandbox primero, confirmación explícita de Marco, recién entonces producción).
- Esto es la misma disciplina que ya pedía `verify-rls` (sandbox primero, producción como paso deliberado) — esta regla la hace exigible con herramientas, no solo con la instrucción escrita.

---

## Convenciones de Git

- Branch policy: direct-to-main (no se adoptó branch-per-task; los commits van directo a `main`, ver regla 4 arriba)
- Formato de mensaje de commit: prefijos `feat:`/`fix:`/`chore:`/`refactor:` (ver regla 4 arriba para el detalle completo y ejemplos)

Esta sección es lo que leen los skills genéricos del kit AE (`commit`, `setup`, etc.) para saber la convención real de este proyecto, en vez de asumir el default del framework (branch-per-task, `WHAT/WHY/RISK`). Definida una sola vez; si la convención cambia de verdad, se edita acá explícitamente — no es una decisión que se re-litiga por task.

## Skills

### Secuencia de trabajo

La secuencia default para cualquier task no trivial es:

`scope → design → build → verify → commit`

`verify` se ramifica en `verify-tests` (siempre), `verify-evals` (solo si la feature llama a un modelo con output no determinista — ver Tier A/B abajo), `verify-ui` (solo si toca una superficie de UI), y `verify-rls` (solo si crea o cambia una tabla o una política de acceso). `session-log` corre al cierre de cada sesión sin importar qué más haya pasado. Ver cada `SKILL.md` para el detalle de cuándo dispara y qué produce.

**Particularidad de este proyecto:** cuando un task toca schema/RLS, corre `design` + `verify-rls` y ciérralos *antes* de construir el componente de UI que depende de esos datos — no dejes `verify-rls` para el final del flujo como sugiere el orden genérico de arriba. Construir la UI sobre una capa de datos ya verificada evita re-trabajo cuando una policy resulta mal diseñada; es más estricto que el default del framework, y es una decisión deliberada de este proyecto, no un descuido.

**Evals de features LLM/agent (Tier B) — convención todavía sin definir en este proyecto:** dónde viven los evals (¿carpeta `evals/`?), el formato del dataset de casos, y quién/qué es el grader inicial son decisiones pendientes (ver `T150` en `BACKLOG.md`). La primera vez que una feature LLM/agent llegue a `verify-evals`, no inventes la convención en silencio — para y scopea con Marco, igual que se hizo con la rúbrica de planning+measurement (`docs/scope-planning-measurement.md`, `docs/agentic-fit-check-pm.md`). Una vez que exista una convención real, documéntala acá y actualiza `T150`.

**`feature-build-flow` fue retirado (2026-07-18)** — era la versión de este proyecto de la secuencia genérica de arriba (task → scoping doc condicional → schema → RLS → componente → lógica pura+test → evals condicional → lint+test → commit), escrita antes de que esa secuencia existiera como parte genérica del kit. Sus pasos mapean 1:1 contra `scope`/`design`/`build`/`verify-*`/`commit`, y lo genuinamente específico de este proyecto (a dónde va cada tipo de doc, la nota de Tier B, la regla de mobile-first) ya vive en este archivo, no solo en ese skill. La carpeta `.claude/skills/feature-build-flow/` quedó con un `SKILL.md` de stub, ya que no se puede borrar desde Cowork.

### Namespace compartido de Cowork

Si este proyecto se trabaja en Cowork junto con otros proyectos (p. ej. `ae-setup`), la lista de skills de Cowork **no está aislada por proyecto**: invocar un skill por nombre resuelve a la copia que se sincronizó más recientemente en ese slot compartido, sin importar qué carpeta esté conectada en ese momento — confirmado directamente (invocar un skill de nombre compartido cargó el contenido de otro proyecto mientras este era el conectado). Por eso los skills genéricos de este proyecto (`setup`, `scope`, `design`, `build`, `verify-tests`, `verify-evals`, `verify-ui`, `verify-rls`, `commit`, `session-log`) leen sus particularidades de este archivo (`CLAUDE.md` → Convenciones de Git, Stack técnico, esta sección) y de `docs/db-schema.md` (para `verify-rls` → modelo de roles) en vez de tenerlas hardcodeadas. Con `feature-build-flow` retirado, este proyecto ya no tiene ningún skill genuinamente bespoke que necesite el prefijo `tt-` — si en el futuro aparece uno, dale ese prefijo para no colisionar con la copia de otro proyecto o del kit.

### Skills retirados

- **`schema-rls-verification`** (retirado 2026-07-18) — su procedimiento era prácticamente idéntico al del nuevo `verify-rls` genérico del kit (de hecho, `verify-rls` se generalizó a partir de este skill), y los datos realmente específicos de este proyecto (el modelo de roles por tabla, los project refs de Supabase) ya vivían en `docs/db-schema.md` y `SETUP_CHECKLIST.md` respectivamente, no en el skill mismo. Usar `verify-rls` en su lugar.
- **`feature-build-flow`** (retirado 2026-07-18) — ver arriba. Usar la secuencia `scope → design → build → verify → commit` en su lugar.

**Editar un skill:** en Claude Code, editar `.claude/skills/**` directo, sin restricción. En una sesión de Cowork en la nube (vía el device bridge a esta carpeta conectada), escribir en `.claude/` está bloqueado por política de la plataforma — no hay workaround dentro de la sesión. Si hace falta editar un skill desde Cowork en la nube, usar Claude Code para ese cambio, o pedir que Claude entregue el archivo actualizado como adjunto para copiarlo a mano.

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
