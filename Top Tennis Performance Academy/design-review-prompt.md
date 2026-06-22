# Prompt para Claude Design — Final Polish: Top Tenis Performance Academy

## Contexto del proyecto

Estoy construyendo una plataforma de alto desempeño para una academia de tenis en México. La app tiene dos tipos de usuarios: **coaches** y **atletas**. El stack es React + Vite + Tailwind CSS, con un design system de tokens CSS propios.

La plataforma está técnicamente funcional y mobile-first. El objetivo de este review es hacer un **final polish de diseño** antes del lanzamiento: encontrar inconsistencias, proponer mejoras de UX (especialmente en flujos de onboarding), y producir mocks de las pantallas revisadas para que yo pueda pasarlas a código.

---

## Design system actual (portal)

### Colores (CSS variables)
```
--green-deep:   #0E2419   /* fondo sidebar */
--green:        #1B3A2A   /* verde oscuro principal */
--green-mid:    #2D5A3D
--green-soft:   #A7C4B0
--paper:        #FFFFFF
--paper-2:      #FAFAF7   /* fondo general del portal */
--cream:        #F4F2EC   /* fondos de tabla, hover states */
--ink:          #14110D   /* texto principal */
--ink-soft:     #4A4842
--ink-mute:     #8A8780   /* texto secundario */
--accent:       #8B4513   /* cobre/terracota — CTAs, highlights */
--good:         #16A34A   /* verde estado completado */
--bad:          #DC2626   /* rojo estado pendiente/error */
--warn:         #D97706   /* amarillo advertencia */
```

### Tipografía del portal
- **Headings / display:** Bricolage Grotesque (bold, -0.02em tracking)
- **Body:** Manrope
- **Números / UTR / scores:** Big Shoulders Display (tabular-nums)
- **Código / etiquetas técnicas:** JetBrains Mono

### Componentes base
- **Cards:** borde 1px sólido (`hairline`), sin sombra, fondo `--paper` o `--cream`
- **Barra de color superior en cards de estado:** 3px de alto, verde (`--good`) si completo, gris (`--line`) si pendiente, cobre (`--accent`) si hay acción pendiente del atleta
- **Badges de texto:** eyebrow (todas caps, 10px, tracking 0.16em, Manrope 600)
- **Botones CTA:** fondo `--accent` (#8B4513), texto blanco, uppercase, tracking 0.08em, sin border-radius o con radius 4px

### Lo que NO usa el portal
- No hay shadows (`box-shadow`)
- No hay border-radius > 6px (excepto badges pequeños)
- No hay gradientes en el interior de pantallas
- El sidebar usa `--green-deep` (#0E2419)

---

## Estructura de la app

### Sitio público (landing)
Rutas: `/`, `/nosotros`, `/programas`, `/camino-usa`, `/torneos`, `/alianzas`, `/contacto`

Tiene su propio layout (`PublicLayout`) con `Navbar` y `Footer`. **No es parte del scope de este review** — enfócate en las pantallas de auth y el portal.

### Auth / onboarding (fuera del portal)

#### `/login` — Login
Diseño actual: pantalla split 50/50. Lado izquierdo: panel verde oscuro (#1B3A2A) con logo circular y tagline. Lado derecho: blanco con formulario de email + contraseña.

**Problema:** usa un sistema de diseño diferente al portal — inputs con `rounded-lg`, colores en hex hardcodeados, botones con `rounded-lg`. No hay coherencia con los tokens del portal.

#### `/registro` — Signup de atleta (2 pasos)
**Paso 1:** Nombre, apellido, fecha de nacimiento, mano dominante, selección de coach (dropdown con todos los coaches).
**Paso 2:** Email, contraseña, confirmar contraseña.

**Problemas:**
- Mismo sistema visual inconsistente que Login
- No hay contexto de qué es la plataforma ni qué esperar después
- El dropdown de selección de coach muestra a todos los coaches — para un atleta de primera vez, puede ser confuso si no saben quién es su coach

#### `/registro-coach` — Signup de coach
Formulario con nombre, apellido, email, contraseña, confirmación, y un código de invitación secreto.

**Problema:** La pantalla no explica la lógica del código de invitación — un coach nuevo podría no saber qué es.

#### `/registro-pendiente` — Pantalla de espera
Se muestra cuando Supabase requiere confirmación de email antes de activar la cuenta. Pantalla simple de "revisa tu correo". No la revisamos en detalle, pero debe ser coherente con el sistema visual.

---

### Portal — Coach

El portal usa un layout con sidebar fijo (224px) en desktop y hamburger en mobile. Fondo `--green-deep`. Navegación del coach:

```
Atletas           → /portal/alumnos
Seguimiento       → /portal/reportes        ← FOCO PRINCIPAL
Nuevo reporte     → /portal/reportes/nuevo
Torneos           → /portal/torneos
```

#### `/portal/alumnos` — Lista de atletas del coach
Tabla con: avatar placeholder (cuadrado verde), nombre + categoría ITF (U10/U12/U14/etc), mano dominante, fecha de ingreso, UTR (número grande). Click en fila navega al detalle del atleta. Botón "Nuevo reporte" en el header.

#### `/portal/alumnos/:id` — Detalle de atleta
Vista con expediente completo: historial de reportes por período, datos físicos, torneos, reclutamiento.

#### `/portal/reportes` — **PANTALLA PRINCIPAL DEL REVIEW** (Seguimiento por período)

Esta es la pantalla más importante para el coach. Muestra una **matriz de estado** de todos sus atletas en el período seleccionado (navegación mes a mes con flechas).

**Estructura actual:**
- Header: título "Seguimiento" + subtítulo con stats ("8 atletas · 5 con reporte · 3 Athlete Voice pendiente") + navegador de período (← Junio 2026 →)
- Tabla:

| Atleta | On-court | Physical | Character | Athlete Voice | [acción] |
|--------|----------|----------|-----------|---------------|----------|
| Nombre | Badge con score promedio (+0.3) | Badge con X/6 tests | Badge con score | "Pendiente" badge amarillo / ✓ verde | "+ Nuevo" / "Editar" |

Cuando no hay reporte creado para ese atleta en ese período, todas las celdas muestran `—`.

**On-court badge:** score promedio de 11 dimensiones técnicas en escala -2 a +2. Verde si > +0.4, rojo si < -0.4, amarillo si en el medio.
**Physical badge:** fracción de tests completados (ej: "3/6"). Verde si ≥ 4 tests, amarillo si 2-3, neutro si 0-1.
**Character badge:** promedio de Ética de trabajo + Coachabilidad, misma escala.
**Athlete Voice:** icono de checkmark verde si el atleta ya completó su auto-evaluación para ese reporte. Badge amarillo "Pendiente" con ícono de flag si el coach creó el reporte pero el atleta no ha respondido.

**Problemas de UX identificados:**
1. La acción más urgente para el coach (atletas sin reporte este mes) no tiene suficiente jerarquía visual — los botones "+ Nuevo" y "Editar" se ven igual de pequeños que el resto
2. El badge "Pendiente" de Athlete Voice está en una columna de la tabla — si hay varios pendientes, no hay una forma rápida de ver "¿qué me falta hacer?"
3. La navegación de período está en el header como una fila, pero en mobile necesita más espacio
4. No hay indicación visual de si el período actual es el presente, pasado, o futuro

#### `/portal/reportes/nuevo` — Crear/editar reporte
Formulario con 3 pestañas: **On-court** (11 dimensiones en escala -2/+2 con sliders), **Physical** (medidas físicas + FMS), **Character** (ética de trabajo + coachabilidad + notas).

Selección de atleta y período en el header. Guarda sección por sección (cada tab guarda independientemente).

#### `/portal/torneos` y `/portal/torneos/registrar`
Lista de torneos registrados + formulario para registrar un nuevo torneo con atletas participantes.

---

### Portal — Atleta

Navegación del atleta (sidebar):
```
Inicio            → /portal/inicio       ← FOCO PRINCIPAL
Mi rendimiento    → /portal/mi-rendimiento
Mis torneos       → /portal/mis-torneos
```

#### `/portal/inicio` — Home del atleta (2 estados)

**Estado A — Onboarding (perfil incompleto):**
Se muestra cuando el atleta no ha llenado su perfil físico (`altura_cm`, `peso_kg`, `escuela`) o su perfil de reclutamiento (`division_objetivo`, `grad_year`). Muestra:
- Saludo con nombre del atleta
- Barra de progreso (X de 2 completadas)
- 2 cards de onboarding:
  1. "Completa tu perfil" → navega a `/portal/mi-perfil`
  2. "Perfil de reclutamiento" → navega a `/portal/mi-reclutamiento`

Cada card tiene: barra de color en la parte superior (verde si completo, gris si pendiente), número/checkmark, título, descripción, badge "Completo" o "Pendiente", botón CTA.

**Problemas:**
- Un atleta recién registrado no tiene contexto de por qué necesita llenar estas cosas — no hay una frase que conecte "llenar tu perfil" con el valor que obtiene
- Las cards de onboarding se ven muy similares a las cards de estado del dashboard final, lo cual puede confundir si se mezclan

**Estado B — Dashboard (perfil completo):**
Muestra:
- Header con nombre, edad, categoría ITF, nombre del coach
- Card de información: grid 2 columnas con Perfil físico y Reclutamiento, con links para editar
- Card de PTF (Post Tournament Form): si ya tiene PTFs, "Llena tu siguiente PTF"; si no, invitación a llenar el primero. CTA: "Ir a torneos →"
- Card de Athlete Voice (solo se muestra si el coach ya creó un reporte): estado "Pendiente" con CTA "Evalúate →", o "Completo" con confirmación. La descripción le explica al atleta que su coach ya creó el reporte y que puede agregar su perspectiva.

**Problemas:**
- La card de información con dos columnas (Perfil físico + Reclutamiento) es densa — el atleta ve sus propios datos pero no tiene claro para qué sirven ahora mismo
- La card de Athlete Voice es la más urgente cuando está pendiente, pero visualmente no tiene más peso que la card de PTF

#### `/portal/mi-perfil` — Perfil del atleta
Formulario editable: altura, peso, escuela, grado escolar, tipo de revés.

#### `/portal/mi-reclutamiento` — Perfil de reclutamiento
Formulario editable: división objetivo (NAIA, D3, D2, D1), año de graduación, GPA, nivel de inglés, área de estudio, notas adicionales.

#### `/portal/mi-rendimiento` — Vista de rendimiento histórico
Historial de reportes del coach, con evolución de scores por dimensión a través del tiempo.

#### `/portal/mis-torneos` y flujo PTF
Lista de torneos registrados. Permite registrar un torneo nuevo y llenar el Post Tournament Form después de jugarlo.

#### `/portal/athlete-voice`
Formulario de auto-evaluación del atleta: cómo se sintió en cancha, físicamente, y en carácter durante el período del reporte. Corresponde a un reporte específico del coach.

---

## El flujo de UX que más duele

El flujo más crítico es el que va desde que alguien crea su cuenta hasta que la plataforma le genera valor. Hay dos variantes:

**Flujo del coach:**
1. Va a `/registro-coach`, llena el formulario con código de invitación
2. Confirma email (llega a `/registro-pendiente`)
3. Hace login → llega a `/portal/alumnos` (lista vacía si no tiene atletas aún)
4. No tiene una guía de qué hacer: ¿registrar atletas? ¿esperar a que ellos se registren? ¿crear un reporte?

**Flujo del atleta:**
1. Va a `/registro`, llena 2 pasos (datos + cuenta)
2. Confirma email o entra directo → llega a `/portal/inicio`
3. Ve el onboarding con 2 cards (Perfil + Reclutamiento)
4. Llena ambas → ve el dashboard
5. Espera a que el coach cree un reporte → recibe Athlete Voice

**El vacío más doloroso:** tanto el coach como el atleta llegan a una pantalla que no les dice claramente cuál es el primer paso que importa. El coach llega a una lista de atletas vacía. El atleta llega a cards de onboarding que no explican el "por qué".

---

## Lo que necesito de este review

### Prioridad 1 — Pantalla de Seguimiento (`/portal/reportes`)

Esta es la pantalla que el coach va a usar más frecuentemente. Necesito un mock que resuelva:

1. **Cómo mostrar claramente qué acciones están pendientes** — los atletas sin reporte este mes y los Athlete Voice pendientes deben ser fáciles de identificar de un vistazo
2. **Jerarquía de las acciones** — ¿dónde está el botón de "crear reporte"? ¿cómo se distingue de "editar"?
3. **El navegador de período** — cómo se comporta en mobile vs. desktop
4. **Indicador de período actual vs. pasado** — el coach necesita saber si está viendo el mes presente o uno anterior

El mock debe respetar el design system existente (tokens, tipografía, sin shadows, sin gradientes).

### Prioridad 2 — Onboarding del atleta (`/portal/inicio` en estado A)

Un mock del estado de onboarding que:
1. Explique brevemente el valor antes de pedir que llene el perfil
2. Deje claro cuál es el primer paso (si hay un orden recomendado)
3. Sea visualmente coherente con el dashboard que el atleta verá después de completarlo

### Prioridad 3 — Pantallas de auth (Login, Signup atleta, Signup coach)

Estas pantallas usan un sistema visual diferente al portal. El review debe:
1. Proponer si mantener el split-screen 50/50 o simplificarlo para mobile
2. Hacer que el formulario y sus elementos sean coherentes con los tokens del portal
3. Asegurarse de que la pantalla de "registro pendiente" (confirmación de email) tenga el contexto correcto

### Prioridad 4 — Revisión general del sidebar y navegación

El sidebar del coach tiene "Nuevo reporte" como ítem de navegación principal. Evaluar si tiene más sentido que sea una acción dentro de Seguimiento, o si tiene sentido dejarlo expuesto en el sidebar.

---

## Notas adicionales

- La plataforma es mobile-first: las pantallas más usadas deben funcionar perfectamente en 375px-430px
- Los usuarios son coaches y atletas adolescentes en México — el tono debe ser profesional pero no corporativo
- El nombre de la academia es **Top Tenis Performance Academy**
- El color cobre/terracota (`#8B4513`) es el color de acción principal — es la identidad visual más reconocible
- Cuando generes mocks, anota claramente qué estás cambiando y por qué — eso me ayuda a pasarlo a código con contexto

---

## Entregable esperado

Mocks de las pantallas prioritarias con:
- Anotaciones de los cambios propuestos vs. el estado actual
- Notas sobre qué tokens usar en cada elemento nuevo
- Si hay cambios al flujo de navegación o al sidebar, un diagrama simple del flujo propuesto
