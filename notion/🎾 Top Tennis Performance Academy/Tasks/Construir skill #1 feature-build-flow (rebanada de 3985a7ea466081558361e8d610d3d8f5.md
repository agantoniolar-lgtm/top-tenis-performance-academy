# Construir skill #1: feature-build-flow (rebanada de feature)

Category: Dev
Priority: High
Status: Done
Type: Chore

Skill construido con skill-creator, proceso completo de evals (3 casos de prueba con/sin skill, subagentes en paralelo, grading, benchmark, visor estático). Resultado: 100% pass rate con skill vs 87% sin skill. Diferenciador clave: en el caso de feature con LLM (resumen trimestral para papás), el skill evitó inventar la convención de evals (carpeta/dataset/grader) sin consultar a Marco, mientras que el baseline sin skill sí la diseñó por su cuenta. Marco aprobó el resultado explícitamente por ese guardrail. Fuente: .claude/skills/feature-build-flow/[SKILL.md](http://SKILL.md).