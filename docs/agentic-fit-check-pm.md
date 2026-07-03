# Fit check — ¿Necesita P&M una arquitectura de agent + skills?

**Estado:** Borrador para discutir con Marco (no es decisión final).
**Fecha:** 2 Jul 2026
**Task Notion:** Agentic system P&M — fit check (Dev, Phase 2 — Analytics)
**Contexto previo:** `docs/scope-planning-measurement.md` (todo el scope de P&M v2, §16–§20 los hallazgos de los 5 casos sintéticos que exponen los huecos de rúbrica).

---

## 1. Pregunta que resuelve este doc

Marco quiere convertir el redesign de P&M en dos cosas a la vez: (a) resolver el problema real de la academia y (b) un POC de un patrón de **agentic system** generalizable a cualquier empresa de servicios. Explícitamente no quiere forzar la arquitectura de "agent + skills" si el problema no la necesita.

Este doc responde: **¿qué parte de P&M se beneficia genuinamente de una arquitectura agent+skills, y qué parte ya está resuelta con el pipeline que se scopeó en `scope-planning-measurement.md`?** El objetivo es evitar dos errores simétricos: sobre-construir infraestructura de agente donde un pipeline de prompts alcanza, o subestimar dónde sí hace falta autonomía real y perder la oportunidad de showcase.

## 2. Dos sentidos de "skill" en este proyecto — hay que desambiguar

`docs/skills-backlog.md` ya usa la palabra "skill" para algo distinto: **skills de Claude Code para el propio flujo de trabajo de Marco** (rebanada de feature, schema+RLS, QA e2e, scraper AMTP) — herramientas internas para reducir *context rot* en las sesiones de build. Son skills *del ingeniero*, invocadas por Marco/Claude durante el desarrollo.

Lo que Marco propone ahora es distinto: **skills que forman parte del producto**, invocadas por un agente que ayuda a los *coaches* a construir planes trimestrales — no reducen context rot de una sesión de código, encapsulan la rúbrica/filosofía de evaluación de la academia y corren en producción. Incluso el "agente" mismo es distinto: no es Claude ayudando a Marco a programar, es un sistema (con o sin Claude API de por medio en runtime) ayudando al coach a diagnosticar y planear.

**Recomendación de nomenclatura** para no pisarse con el backlog existente: llamar a estos **"skills de P&M"** o **"rubric skills"** en la documentación, y dejar "skills internos" para lo que ya vive en `skills-backlog.md`.

## 3. Qué hace a algo genuinamente "agentic" (marco de referencia corto)

No todo sistema que usa LLMs es "agentic". Cuatro propiedades que sí lo distinguen de un pipeline de prompts fijo:

1. **Autonomía de decisión.** El sistema decide *qué hacer después* en vez de seguir un guion fijo — elige qué skill invocar, si iterar de nuevo, o si escalar a un humano.
2. **Selección dinámica de herramientas/skills.** No hay un orden hardcodeado de pasos; el agente elige cuáles aplican según el input.
3. **Auto-corrección iterativa.** El agente evalúa su propio output contra un criterio y se corrige *antes* de mostrarlo, no solo señala advertencias para que otro (el coach) decida.
4. **Memoria/contexto persistente con juicio propio.** El sistema no solo recibe contexto — lo acumula, lo mantiene, y actúa proactivamente sobre él (no solo cuando alguien pregunta).

Un pipeline de N llamadas a un LLM con pasos fijos, prompts especializados por paso, y un humano que aprueba cada salida **no es agentic** aunque use varios prompts sofisticados — es una *feature bien diseñada con LLMs*. Eso no es un insulto: la mayoría del valor de producto sale de ahí. Pero si el objetivo declarado es "hacer reps en agentic systems", vale la pena ser honesto sobre cuál de las dos cosas se está construyendo en cada pieza.

## 4. Diagnóstico — ¿qué es P&M v2 hoy, tal como está scopeado?

Según `scope-planning-measurement.md` §7, §8, §10, §13, el flujo es:

```
identify (LLM) → selección de focos (humano) → generate (LLM) → validate (LLM, advisory)
   → coach revisa → [si no conforme: comenta + regenerate (LLM)] → guardar → cierre (LLM asistido)
```

Con las reglas explícitas de §13: la generación es de un solo tiro, **no hay auto-regeneración**, el validador es *advisory* (muestra flags, no corrige nada por su cuenta), y el único que dispara una nueva corrida es el coach con un comentario obligatorio.

**Esto es un pipeline de LLM calls con HITL, no un agente.** No decide dinámicamente qué paso tomar (el orden es fijo), no se auto-corrige (el validador solo advierte), y el "loop" existe porque el humano lo dispara, no porque el sistema decida iterar. Es exactamente el tipo de "feature LLM bien estructurada" que la sección 3 distingue de agentic.

Esto no es un defecto del scope — las decisiones de §13 (advisory no auto-regenera, regenerar exige comentario humano) fueron tomadas deliberadamente para mantener control de calidad humano sobre un artefacto sensible (el plan que el coach discute con el atleta). Pero si la meta es un POC de agentic system, hay que ser explícitos: **el pipeline de generación en sí no es donde vive la oportunidad de showcase.**

## 5. Evaluación de fit, pieza por pieza

### 5.1 Rúbrica como skill modular — fit alto, construible ya

Hoy la rúbrica vive implícita, repartida entre `GENERATE_SYSTEM`, `IDENTIFY_SYSTEM` y las reglas sueltas de `validate-quarterly-plan` (regla anti-invención, gramática §4, ejes de anclas §5, tono/nombre del atleta). Los hallazgos de §16–§20 muestran que esa dispersión es justo el problema: reglas sueltas no bastan para casos como Diego (§19, causa arbitraria) o Sofía (§18, guardrail de especificidad que no dispara).

**Fit alto** porque encapsular la rúbrica como una unidad versionada y reusable (criterios + ejemplos + contraejemplos, como el patrón que ya usa `skill-creator`) es exactamente lo que resolvería la dispersión — sin que esto requiera todavía un "agente" que decida dinámicamente nada. Es modularidad, no autonomía. Se puede construir esta pieza sin resolver aún si hace falta un orquestador tipo agente encima.

**No confundir modularidad con agencia:** que la rúbrica esté en un módulo separado no vuelve agentic al sistema. Sigue siendo el mismo pipeline, solo mejor factorizado.

### 5.2 Validador de advisory → auto-corrección — fit medio, decisión de producto antes que técnica

Aquí sí hay una oportunidad real de agencia: hoy `validate-quarterly-plan` es advisory (muestra flags al coach). Un agente podría, antes de mostrarle nada al coach, evaluarse contra la rúbrica y **auto-regenerar internamente** hasta pasar un umbral de calidad — el coach vería un output ya filtrado, no crudo.

Pero §13 decidió *deliberadamente* lo contrario ("no hay auto-regeneración... el validador es advisory") con una razón de producto explícita: mantener el control humano visible y evitar que el coach pierda la noción de qué está aprobando. Cambiar esto no es solo una decisión técnica — es reabrir una decisión de producto ya tomada.

**Recomendación:** no tocar esta decisión todavía. Es la pieza más "agentic" en potencial, pero también la más sensible (el plan es material de conversación con el atleta — inventar o auto-corregir sin que el coach lo vea tiene costo de confianza). Vale la pena revisitarla *después* de tener la rúbrica modularizada (5.1) y datos reales de cuánto falla el validador advisory en producción — no antes.

### 5.3 Monitoring + contexto entre periodos — fit más alto, y es la pieza sin scopear

Esta es la parte que Marco ya identificó como el siguiente horizonte (arco (c)) y es, con diferencia, donde el patrón agentic tiene el mejor fit real:

- El handoff periodo→periodo (§7.1) ya diseña *qué* contexto se acarrea (focos previos, trayectoria de 3 scores, retrospectives) pero no *quién* actúa sobre él proactivamente.
- Un agente con memoria persistente que **monitorea** la trayectoria de scores y actúa sin que nadie se lo pida — "esta dimensión de mantenimiento lleva 2 periodos en −1, standard de alerta para promoverla a foco" (mencionado como posibilidad en §13, "mantenimiento también se mide") — es autonomía + memoria + juicio proactivo: las cuatro propiedades de la sección 3, no solo una.
- A diferencia de 5.1 (modularidad) y 5.2 (decisión de producto ya tomada), aquí no hay una decisión previa que reabrir — es territorio nuevo.

**Fit alto y sin conflicto con decisiones existentes.** Es también la pieza que mejor generaliza fuera de tenis: cualquier negocio de servicios con ciclos de diagnóstico→plan→ejecución→revisión (consultoría, terapia, coaching ejecutivo, sales enablement) tiene el mismo problema de "mantener contexto longitudinal y actuar proactivamente sobre tendencias", no solo generar un documento una vez.

### 5.4 Orquestador dinámico (agente que elige qué skill correr) — fit bajo hoy, riesgo de sobre-construcción

El flujo identify → generate → validate → regenerate tiene un orden conocido y estable; no hay ambigüedad sobre qué paso sigue. Construir un orquestador que "decida" dinámicamente cuál skill invocar sería añadir una capa de indirección sin necesidad real — el pipeline fijo ya es la respuesta correcta para esta parte. Esto es exactamente el riesgo que Marco quería evitar: nombrar "agente" algo que en realidad es un `if/else` con buenos prompts.

**Recomendación:** no construir un orquestador dinámico para el pipeline de generación. Si en 5.3 (monitoring) se necesita un agente que decida entre varias acciones posibles (alertar, sugerir foco, no hacer nada), *ese* es el lugar natural para un orquestador — no aquí.

## 6. Recomendación — qué construir ahora, qué diferir

| Pieza | Fit agentic | Decisión |
|---|---|---|
| Rúbrica modular (skills de observaciones + objetivos) | Alto, pero es *modularidad*, no agencia | Construir ahora — es la base y no depende de resolver 5.2/5.3 |
| Validador advisory → auto-corrección | Medio, choca con decisión de producto ya tomada (§13) | Diferir — revisitar con datos reales de producción |
| Monitoring + contexto entre periodos | Alto, sin conflicto con decisiones previas | **Este es el POC real de agentic system** — scopear después de que la rúbrica modular esté construida y haya al menos un periodo de datos reales para monitorear |
| Orquestador dinámico del pipeline de generación | Bajo, riesgo de sobre-construir | No construir — el pipeline fijo ya es correcto aquí |

**Secuencia sugerida:** primero cerrar los dos docs de scoping de rúbrica ya en Backlog (tratándolos como *skills modulares*, sección 5.1, sin agente todavía) → construir y correr en producción un periodo real → scopear el agente de monitoring (5.3) con datos reales de trayectorias de scores como insumo, que es donde vive el showcase genuino de agentic system.

## 7. El ángulo showcase — qué documentar como patrón reusable

Si el objetivo doble se sostiene (resolver P&M + mostrar el patrón), el entregable de showcase no es "P&M tiene un agente" — es el **patrón del evaluation loop** documentado de forma separable de tenis:

1. Encapsular criterios de calidad tácitos (la filosofía de la academia) como rúbricas modulares y versionadas.
2. Loop de generación con revisión humana obligatoria antes de auto-regenerar (control de confianza en dominios sensibles).
3. Contexto longitudinal estructurado desde el primer ciclo, aunque no se consuma hasta el segundo (§7.1, "cold-start es requisito de captura, no solo de consumo").
4. Un agente de monitoring con memoria que actúa proactivamente sobre tendencias, no solo responde a queries.

Esos cuatro puntos generalizan a cualquier empresa de servicios con ciclos diagnóstico→plan→ejecución→revisión. Vale la pena, cuando llegue el momento, escribir ese patrón como doc separado de la implementación específica de tenis — es el artefacto que se enseña, no el código de P&M en sí.

## 8. Próximos pasos

1. Marco confirma o ajusta la tabla de la sección 6.
2. Con eso resuelto, retomar los dos docs de scoping de rúbrica ya en Backlog en Notion, escritos explícitamente como *skills modulares* (sección 5.1) — no como partes de un agente todavía.
3. Dejar anotado en el doc de scoping de cada rúbrica que el agente de monitoring (5.3) es el siguiente horizonte, para no perder el hilo del arco completo.
