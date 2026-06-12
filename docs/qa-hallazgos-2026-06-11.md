# Hallazgos de QA — 11 Jun 2026

Tour de la plataforma previo a la presentación al equipo (12 Jun). 10 bugs y 8 features.
Todos tienen task en el kanban de Notion (IDs B1–B10, F1–F8).

## Bugs

| ID | Prioridad | Dónde | Descripción | Hipótesis / nota |
|---|---|---|---|---|
| B1 | 🔴 High | Expediente + Talent Card | W/L record no se actualiza con los resultados de torneos | Probablemente no agrega desde `athlete_tournaments.victoria` |
| B3 | 🔴 High | Expediente | Inicio del atleta dice jun 2026 con reportes de abr/may | Acción: cambiar inicio de Marco a abril + validación: ningún reporte anterior al mes de registro |
| B4 | 🔴 High | Reportes | Falta el reporte de junio; el último es mayo — posible corrimiento de un mes al guardar | Típico bug de timezone: `new Date('YYYY-MM')` se interpreta UTC y al formatear local se va al mes anterior |
| B5 | 🔴 High | Talent Card | Sección percepción sin datos cuando hay 2+ PTFs | Está comparando PTFs; debe comparar reportes de periodo (coach vs athlete voice) |
| B2 | 🟡 Medium | Expediente | No se ve la evolución periodo a periodo de ética de trabajo y coachabilidad | |
| B7 | 🟡 Medium | PTF | Ronda "Campeón" duplica "Final" + victoria | Quitar "Campeón" |
| B8 | 🟡 Medium | Inicio atleta | Sigue diciendo "llena tu primer PTF" después de llenarlo | Empty state no consulta `post_tournament_forms` |
| B9 | 🟡 Medium | Athlete Voice | No indica qué periodo está disponible cuando el coach llena el NR; solo registra si llenó uno | |
| B10 | 🟡 Medium | Mi rendimiento | Box de UTR de últimos dos periodos vacío | ¿Falta data o el componente no la lee? |
| B6 | ⚪ Low | Login | Autofill de Google se borra la primera vez | |

## Features

| ID | Prioridad | Descripción | Categoría |
|---|---|---|---|
| F1 | 🔴 High | Auth de coaches (sign up / log in) — hoy solo existe para atletas; bloquea invitar coaches | Dev |
| F7 | 🔴 High | Vista de PTFs por torneo para el coach: tabla por atleta según métricas del PTF + abrir cada uno. Post-MVP: AI summary por torneo | Dev |
| F3 | 🟡 Medium | Expediente: sub-dimensiones de táctica con sección propia (hoy salen dentro del box de técnica como "por buen camino") | Dev |
| F5 | 🟡 Medium | Explicación corta en cada dimensión de táctica + threshold de pass/fail en el FMS de Nuevo Reporte | Dev |
| F2 | 🟡 Medium | Definir con coaches el flujo de alta de atletas (hoy no existe por diseño) | Team |
| F4 | ⚪ Low | Box de técnica se ve vacío — faltan dimensiones para llenar la tabla | Dev |
| F6 | ⚪ Low | Talent card: números en los nodos de la gráfica del coach por periodo | Dev |
| F8 | ⚪ Low | Dobles: campo de llenado adicional si juega singles y dobles — definir post-MVP | Team |

## Notas del tour

- Auth de coaches no existe aún → los pasos 1.1–1.4 de la guía de QA quedan parcialmente bloqueados.
- "Crear nuevo atleta" no existe **por diseño**; decisión pendiente con coaches (F2).
- Post-MVP explícitos: AI summary de PTFs por torneo (F7) y registro de dobles (F8).

## Orden de fixes propuesto antes de la presentación

1. **Integridad de datos** (lo que se ve mal en demo y corrompe data): B4, B3, B5, B1
2. **Quick wins de UI**: B7, B8, B9, B10
3. **Después de la presentación**: B2, B6, F3, F4, F5, F6
4. **Requiere definición**: F1 (alcance del auth), F2, F7, F8
