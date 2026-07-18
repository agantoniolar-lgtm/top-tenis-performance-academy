# Servicio de notas de voz/texto por atleta (context feed para reportes y planes)

Category: Dev
Epic: Phase 2 — Analytics
Notes: Idea de Marco (9 Jul 2026): servicio al que todos los coaches suban notas de voz y texto por atleta a lo largo del tiempo. Para atletas nuevos, el initial assessment (hoy el text box libre de PlanesCoach.jsx al crear el primer plan, sujeto a cambiar con el scoping) sería la única entrada inicial. Esa información se agrupa/analiza para alimentar (a) los reportes mensuales — pasan de redacción desde cero a trabajo de review — y (b) el contexto del siguiente plan trimestral. Objetivo: que el coach se enfoque en observar y el sistema arme el resto. Depende de que primero se cierre 'Quitar constraint de asignación coach↔atleta' (task hermano, ampliado 9 Jul) — sin eso no está claro quién puede subir notas de qué atleta. Marco fue explícito: es la pieza más pesada y se hace hasta el final, después de todo lo demás. Necesita su propio doc de scoping (arquitectura de captura de voz, pipeline de análisis/agrupación, qué modelo/prompt, cómo conecta con generate-quarterly-plan) — sigue el patrón agentic ya usado en P&M (docs/http://scope-planning-measurement.md, docs/http://agentic-fit-check-pm.md).
Priority: Medium
Status: Backlog
Type: Feature