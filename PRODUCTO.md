# Top Tenis Performance Academy — Documento de Producto

> Este archivo es la fuente de verdad sobre qué se está construyendo, por qué, y en qué estado está.
> Vive en el repositorio para que no se desactualice. Actualízalo cuando cambie el scope o se tome una decisión importante.

---

## Visión de producto

Las academias de alto rendimiento en LatAm tienen el mismo problema: los coaches tienen el método, pero no tienen la evidencia. Sin evidencia, la academia no puede ser tomada en serio por universidades en USA, no puede justificar lo que cobra, y no puede atraer sponsors serios. Todo descansa en la palabra del coach.

Esta plataforma existe para resolver eso. No agrega datos que ya existen — los **crea**: observaciones técnicas y tácticas del coach, reportes de psicología, nutrición y fisioterapia, resultados de fitness, la propia voz del atleta sobre su proceso. El resultado es un expediente completo de cada atleta que convierte a la academia de "confíenos" a "aquí está la evidencia."

El resultado estratégico: la academia se convierte en **fuente confiable de talento para universidades en USA** — una categoría que hoy ninguna academia en LatAm ocupa.

**Top Tennis Performance Academy es el primer cliente y el laboratorio donde se prueba que el modelo funciona.** Si funciona aquí, la plataforma puede operar en cualquier academia de alto rendimiento en LatAm.

---

## El problema central

Un recruiter universitario en USA que recibe un atleta de una academia latinoamericana hoy solo tiene acceso a: el ranking AMTP, el perfil UTR, y la palabra de los coaches y la familia. Eso no es suficiente para tomar una decisión seria.

Lo que el recruiter necesita para decidir no son más estadísticas — UTR y AMTP ya existen. Lo que necesita son **señales del atleta completo**: su trayectoria de mejora, su mentalidad, su carácter, cómo reacciona a la derrota, qué dice de sí mismo. La academia que pueda entregar eso con evidencia documentada se diferencia completamente de cualquier club con buenos coaches.

Ese mismo vacío afecta a padres y sponsors: los padres pagan sin ver el progreso de forma estructurada, y los sponsors apoyan sin evidencia de retorno.

---

## Propuesta de valor por audiencia

| Audiencia | Qué necesita | Qué le da la plataforma |
|---|---|---|
| **Coach** | Visibilidad real del desarrollo de cada atleta para personalizar el entrenamiento | Expediente completo, reportes por dimensión, historial de progreso |
| **Atleta** | Entender su propio avance y construir su narrativa hacia USA | Dashboard personal, PTF, acceso a sus reportes y métricas |
| **Padre** | Ver el retorno real de su inversión de forma transparente | Vista de solo lectura del progreso, reportes del coach, estado general |
| **Sponsor** | Evidencia de impacto que justifique su apoyo a la academia | Reportes de desempeño del equipo, métricas de progresión, colocaciones |
| **Recruiter / Universidad** | Señales claras más allá del ranking para evaluar fit con su programa | Talent Card exportable con expediente completo del atleta |

---

## Estructura de la plataforma

La plataforma tiene tres capas:

- **Sitio público**: marketing y captación de familias interesadas.
- **Portal interno**: herramienta de operación diaria para coaches, atletas, padres y admins.
- **Capa de presentación externa**: paquetes exportables para recruiters y reportes para sponsors.

### Roles del sistema

| Rol | Acceso |
|---|---|
| **Atleta** | Su expediente, su PTF, sus reportes, sus ejercicios asignados, su progreso |
| **Coach** | Sus atletas: crear reportes, asignar ejercicios, revisar videos, ver progreso agregado |
| **Padre** | Vista de solo lectura del progreso de su hijo |
| **Especialista** (psico / nutri / fisio) | Ingresar reportes de su área para los atletas que atiende |
| **Admin** | Vista global de todos los atletas, actividad de la academia, reportes para sponsors |
| **Sponsor** | Vista de reportes de impacto de la academia (acceso externo controlado) |

---

## Dimensiones de evaluación (MVP)

El expediente de cada atleta se construye sobre 5 dimensiones. Cada dimensión tiene un owner responsable de capturar la información.

**Rúbrica compartida:** todo campo = calificación 1–5 + una anécdota escrita.

### 1. On-court — juego técnico y táctico

**Owner:** Head coach

| Campo | Descripción |
|---|---|
| Rúbrica de calidad de golpes | Serve, forehand, backhand, volley, return — cada uno calificado 1–5 |
| Rúbrica de toma de decisiones tácticas | Calificación 1–5 de la inteligencia táctica en juego |
| Resumen de partido | 3–5 clips de video enlazados + snapshot de UTR al momento del reporte |

### 2. Physical — cuerpo, capacidad y durabilidad

**Owners:** Preparador físico (S&C) + Fisio + Nutriólogo

| Campo | Descripción |
|---|---|
| Antropometría | Altura, peso, envergadura |
| Batería de fitness | Sprint, agilidad, vertical, resistencia |
| Timeline de lesiones | Registro cronológico de lesiones y recuperaciones |

### 3. Mental — psicología del rendimiento

**Owner:** Psicólogo deportivo

| Campo | Descripción |
|---|---|
| Respuesta al estrés | Calificación 1–5 |
| Foco / atención | Calificación 1–5 |
| Mentalidad de crecimiento / coachabilidad | Calificación 1–5 |

### 4. Character & Leadership — conducta, ética de trabajo y mentoría

**Owner:** Head coach (con input opcional de pares)

| Campo | Descripción |
|---|---|
| Ética de trabajo | Calificación 1–5 con anécdota |
| Registro de conducta | Violaciones de código + momentos positivos notables |
| Evidencia de liderazgo / mentoría | Mentoría a jugadores menores, liderazgo en sesiones grupales |

### 5. Athlete Voice — reflexión en primera persona

**Owner:** Atleta

| Campo | Descripción |
|---|---|
| PTF post-torneo | Reflexión personal después de cada torneo |
| Metas para los próximos 6 meses | Declaradas por el atleta |
| Auto-calificación | El atleta se evalúa contra las otras 4 dimensiones (1–5) |

---

## Épicas

### 1. Sitio público / Marketing
**Objetivo**: atraer y convertir familias con atletas de alto rendimiento interesados en el camino a USA.

Páginas: Home, Nosotros, Programas, Camino USA, Torneos, Alianzas, Contacto.

La sección **Camino USA** es el eje narrativo del sitio: muestra el proceso, los resultados, y la metodología que diferencia a la academia de un club con buenos coaches. A medida que la plataforma genere datos reales, el sitio público puede alimentarse con resultados y métricas verídicas.

**Estado**: estructura base implementada con datos dummy.

---

### 2. Autenticación y roles
**Objetivo**: controlar quién entra al portal y qué puede ver cada rol.

Incluye login, sesión persistente, y rutas protegidas por rol. Es prerequisito de todo el portal. Los roles de Especialista y Sponsor se suman a los ya implementados.

**Estado**: implementada con autenticación simulada (datos locales, sin backend).

**Decisión pendiente**: la auth actual es dummy. Antes de lanzar hay que conectar a un sistema real (Supabase o Firebase Auth son las opciones más directas con este stack).

---

### 3. Expediente del atleta
**Objetivo**: ser el repositorio central de todo lo que se sabe sobre un atleta — el núcleo de la plataforma.

Va más allá de una lista de alumnos. Es el lugar donde convergen todos los datos del atleta: métricas de ranking (UTR, AMTP), resultados de torneos, reportes del coach, reportes de especialistas, fitness tests, PTFs, y videos. Cualquier rol con acceso al atleta parte de aquí.

Incluye:
- Datos de identidad y contacto
- Métricas competitivas (UTR, ranking AMTP, historial de torneos ITF)
- Progresión visual de métricas a lo largo del tiempo
- Resumen de reportes por dimensión
- Acceso a todos los documentos asociados al atleta

**Estado**: implementado con datos dummy (perfil individual con métricas básicas). Falta conexión a backend y las capas de especialistas y fitness.

---

### 4. Reportes del coach
**Objetivo**: documentar el desarrollo de cada atleta de forma estructurada y convertirlo en evidencia verificable.

El coach evalúa 5 dimensiones por alumno: **Técnica, Táctica, Físico, Mental, Torneos**. Cada dimensión tiene puntuación y notas cualitativas. El reporte incluye áreas de oportunidad y objetivos para el siguiente periodo.

Estos reportes son la voz del coach sobre el carácter y capacidad del atleta — la capa de señal humana que ningún ranking puede entregar. Son el insumo principal de la Talent Card.

El atleta y el padre pueden consultar sus reportes desde el portal.

**Estado**: estructura y vista de lectura implementadas. El formulario de creación (`NuevoReporte`) está en desarrollo.

---

### 5. Reportes de especialistas
**Objetivo**: integrar a psicólogo, nutriólogo, fisioterapeuta y preparador físico al expediente del atleta.

Cada especialista ingresa sus reportes periódicos desde su propia vista. El coach y el admin pueden consultarlos dentro del expediente del atleta. Esto cierra el loop entre los distintos ejes de desarrollo y evita que el conocimiento sobre el atleta quede fragmentado entre personas.

Incluye:
- Vista por especialista para ingresar reportes estructurados
- Campos configurables por tipo de especialista (psicología, nutrición, fisioterapia, fitness tests)
- Resultados de tests físicos estandarizados (velocidad, resistencia, fuerza, etc.)
- Visibles en el expediente del atleta para coach y admin

**Estado**: no implementado. Es una épica nueva de alta prioridad estratégica.

---

### 6. Torneos y competencia
**Objetivo**: registrar la participación y resultados en competencias, y capturar la reflexión del atleta.

Tiene dos caras:
- **Pública**: resultados del equipo visibles en el sitio de marketing.
- **Portal**: historial personal por atleta e inscripción a próximos torneos.

El componente más importante de esta épica es el **PTF (Post-Torneo Form)** — el formulario de reflexión que llena el atleta después de cada torneo. El PTF no es solo una herramienta pedagógica: es la voz del atleta hablando de sí mismo con el tiempo. Es uno de los datos más valiosos para un recruiter porque revela mentalidad, actitud ante la adversidad, y auto-conocimiento — señales que ningún ranking entrega.

**Estado**: estructura implementada con datos dummy. Los campos del PTF están por definir.

**Decisión pendiente**: diseñar los campos del PTF con los coaches para maximizar su valor como señal de carácter.

---

### 7. Ejercicios y entrenamiento asíncrono
**Objetivo**: mantener un loop de entrenamiento entre sesiones presenciales.

El coach asigna ejercicios con descripción e instrucciones. El atleta los completa y sube un video como evidencia. El coach revisa el video y deja comentario. Este flujo refuerza la disciplina del atleta fuera de cancha y genera más datos sobre su desarrollo técnico.

**Estado**: estructura implementada con datos dummy. El flujo de subida de video está pendiente.

---

### 8. Talent Card
**Objetivo**: generar el paquete de presentación del atleta para universidades y programas de reclutamiento en USA.

La Talent Card es un documento exportable (PDF o vista web con link) que consolida el expediente completo del atleta de forma presentable para un recruiter universitario. No es un perfil genérico — es evidencia estructurada que responde las preguntas que un recruiter realmente se hace: ¿cómo progresa este atleta? ¿Cómo reacciona a la derrota? ¿Qué dicen sus coaches sobre su carácter?

Incluye:
- Resumen de métricas competitivas (UTR, ranking, historial de torneos)
- Highlights de video
- Resumen de reportes del coach por dimensión
- Selección de PTFs representativos (con permiso del atleta)
- Reportes de especialistas (opcional, configurable)
- Carta de presentación del coach principal

El admin o coach genera la Talent Card y la comparte directamente con el recruiter o la universidad.

**Estado**: no implementado. Es una épica nueva de alto valor estratégico.

---

### 9. Portal de sponsors
**Objetivo**: dar a los patrocinadores de la academia visibilidad sobre el impacto de su apoyo.

Un sponsor hoy apoya a la academia sin evidencia de retorno. Esta épica cambia eso: el admin genera reportes periódicos que muestran resultados del equipo, progresión de atletas, colocaciones en torneos, y visibilidad de la academia. Con el tiempo, puede incluir métricas de audiencia del sitio público y redes.

Puede ser tan simple como un acceso de solo lectura a un dashboard de la academia, o tan elaborado como reportes PDF generados automáticamente.

**Estado**: no implementado. Prioridad media — se construye una vez que los datos internos sean reales.

---

### 10. Dashboard por rol
**Objetivo**: dar a cada usuario una vista de inicio que agregue lo más relevante para su rol.

El dashboard es la primera pantalla que ve cada usuario al entrar. Su utilidad real depende de que las demás épicas tengan datos reales — con datos dummy es solo una maqueta.

**Estado**: implementado con datos dummy para los 4 roles originales. Se actualizará cuando haya backend y datos reales.

---

## Dependencias entre épicas

```
Épica 2 (Auth)           → prerequisito de todo el portal
Épicas 3, 4, 5, 6, 7    → pueden desarrollarse en paralelo; alimentan el expediente
Épica 8 (Talent Card)   → depende de que 3, 4, 5 y 6 tengan datos reales
Épica 9 (Sponsors)      → depende de que haya datos reales en el sistema
Épica 10 (Dashboard)    → madura cuando las demás tienen datos reales
Épica 1 (Sitio público) → independiente del portal; puede conectarse a datos reales en una segunda fase
```

---

## Decisiones técnicas relevantes

| Decisión | Razón |
|---|---|
| React + Vite + Tailwind | Stack moderno, rápido de iterar |
| Datos dummy en `src/data/dummy.js` | Permite construir UI sin backend listo |
| Lazy loading de rutas | Performance: no carga todo al inicio |
| Roles manejados en frontend | Solución temporal; en producción los roles deben venir del backend |
| Backend pendiente de definir | Supabase y Firebase Auth son las opciones más directas con este stack |

---

## Próximos pasos (sin priorizar)

- [ ] Conectar a backend / base de datos real
- [ ] Implementar autenticación real
- [ ] Diseñar los campos del PTF con los coaches
- [ ] Completar formulario `NuevoReporte`
- [ ] Diseñar e implementar épica de Reportes de especialistas
- [ ] Flujo de subida de video en Ejercicios
- [ ] Diseñar e implementar la Talent Card
- [ ] Validar diseño en mobile
- [ ] Definir estrategia de hosting / deploy
