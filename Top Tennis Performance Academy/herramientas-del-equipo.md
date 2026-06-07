# Herramientas del equipo — Top Tennis Performance Academy

Este documento describe dónde vive cada tipo de información del proyecto. Si no sabes dónde buscar algo o dónde guardarlo, este es el punto de partida.

---

## Google Drive — Top Tenis MX

Carpeta raíz: [Top Tenis MX](https://drive.google.com/drive/folders/16Ut5GSW-ExEuSGbWGhUFtj6pkFPmoUhW)

Drive es para archivos estáticos: documentos, imágenes, videos y materiales de referencia. No es donde se toman decisiones ni se trackean tareas — eso vive en Notion.

> **Nota:** La carpeta "Data Gathering" puede renombrarse a "Producto" — contiene los documentos técnicos de la plataforma (NuevoReporte schema, PTF schema).

### Estructura de carpetas

```
Top Tenis MX/
├── Scoping/
├── Research/
├── Data Gathering/          ← renombrar a "Producto"
├── Marca/
├── Legal/
├── Media/
│   ├── Fotos/
│   │   ├── Perfil/
│   │   └── En partido/
│   └── Videos/
│       ├── Partidos/
│       └── Entrenamientos/
├── Planes de entrenamiento/
├── Reportes de torneo — Archivo/
└── Reportes/
    ├── Avances de plataforma/
    ├── Facturas/
    └── Analytics y uso/
```

---

### Descripción de cada carpeta

**Scoping**
Documentos utilizados para definir el alcance del proyecto antes de la propuesta inicial y el roadmap. Referencia histórica — no se edita activamente.

**Research**
Investigación de alto nivel sobre IA aplicada al tenis y al deporte en general. Sirve como contexto para decisiones de producto. No se edita activamente.

**Data Gathering / Producto** *(pendiente renombrar)*
Documentos técnicos del producto:
- `ptf-post-tournament-form.md` — schema del formulario post-torneo del atleta
- `nuevoreporte-schema.md` — schema del reporte mensual del atleta (6 dimensiones)

**Marca**
Todos los activos de identidad visual de la academia. Documentos que deberían existir:

| Documento | Estado |
|---|---|
| Logo (versiones: color, blanco, negro, horizontal, vertical) | ✅ Disponible (TOP Identidad.pdf) |
| Paleta de colores (hex / RGB / CMYK) | ✅ Definida — ver abajo |
| Tipografías | ✅ Definidas — ver abajo |
| Manual de marca / Brand guidelines completo | Pendiente |
| Templates de presentación | Pendiente |
| Guía de fotografía (estilo, composición, tono) | Pendiente |

**Paleta de colores**

| Rol | Color | HEX |
|---|---|---|
| Primario | Verde oscuro | `#2e4026` |
| Primario | Terracota | `#994215` |
| Neutro | Blanco | `#ffffff` |
| Neutro | Negro | `#000000` |

**Tipografías**
Tenor Sans · HK Modular · Garuda · Luciole · League Spartan

**Legal**
Documentos legales de la plataforma y la academia. Documentos que deben existir antes del lanzamiento:

| Documento | Estado |
|---|---|
| Términos y condiciones de la plataforma | Pendiente |
| Política de privacidad (LFPDPPP — México) | Pendiente |
| Aviso de privacidad (requerido por LFPDPPP) | Pendiente |
| Términos y condiciones del sitio web | Pendiente |

> La LFPDPPP (Ley Federal de Protección de Datos Personales en Posesión de Particulares) es la ley de privacidad aplicable en México. Los documentos deben redactarse con un abogado antes de que la plataforma maneje datos de atletas menores de edad.

**Media / Fotos / Perfil**
Fotos de perfil oficial de cada atleta para usar en la plataforma y en materiales de comunicación.

**Media / Fotos / En partido**
Fotografías de atletas durante partidos o entrenamientos. Pueden usarse en reportes para sponsors o en la Talent Card.

**Media / Videos / Partidos**
Grabaciones de partidos. En el largo plazo estos vivirán en la BD de la plataforma; por ahora se guardan aquí mientras se define la integración con Swing Vision o el sistema de video propio.

**Media / Videos / Entrenamientos**
Clips de sesiones de entrenamiento. Misma dinámica que videos de partidos.

**Planes de entrenamiento**
Planes de entrenamiento por atleta o por milestone. La estructura definitiva de esta carpeta está pendiente de definir — depende de si los planes se generan dentro de la app o a través de un workflow externo. Por ahora: guardar aquí cualquier plan existente.

**Reportes de torneo — Archivo**
Reportes históricos de torneos (los que están en Gmail y otros). Estos datos eventualmente vivirán en la base de datos de la plataforma — esta carpeta es el archivo de referencia, no el sistema operativo.

**Reportes / Avances de plataforma**
Reportes quincenales de desarrollo de la plataforma: qué se construyó, qué decisiones se tomaron, qué viene.

**Reportes / Facturas**
Facturas emitidas al equipo / academia.

**Reportes / Analytics y uso**
Reportes de uso de la plataforma y del sitio web (métricas de adopción, engagement por módulo, etc.). Pendiente definir qué se trackea y con qué herramienta — ver task en Notion.

---

## Notion — Gestión del proyecto

Página principal: [🎾 Top Tennis Performance Academy](https://www.notion.so/3685a7ea466081f1b19ff96798d6497a)

Notion es el sistema operativo del proyecto. Aquí viven:

- **Tasks (kanban):** todas las tareas del proyecto. Hay dos vistas:
  - **Board** — vista general con todos los tasks
  - **Team Tasks** — filtrada solo por tasks de categoría Team (dependencias no técnicas, coordinación, producto)
- **Session Logs:** registro de cada sesión de trabajo — qué se hizo, qué se decidió, qué queda abierto.
- **Opportunity Backlog:** ideas y oportunidades que no son prioridad ahora pero vale la pena no perder.

### Cómo categorizar un task

Cada task tiene una propiedad **Category**:

| Valor | Cuándo usarlo |
|---|---|
| **Dev** | Código, infraestructura técnica, integraciones, diseño de schema, deploy |
| **Team** | Dependencias no técnicas: definiciones con coaches, documentos de producto, set up operativo, investigación, decisiones de negocio |

Si un task no tiene categoría asignada, asignarla al crearlo.

---

## WhatsApp

Un solo grupo con todo el equipo. 

> ⚠️ **Pendiente:** Definir normas de uso del grupo (qué tipo de comunicación va aquí vs otros canales) una vez que el equipo esté integrado.

---

*Última actualización: 29 mayo 2026*
