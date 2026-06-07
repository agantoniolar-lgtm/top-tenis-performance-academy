# Post-Tournament Form (PTF)

## ¿Para qué sirve el PTF?

El Post-Tournament Form tiene dos propósitos. El primero es que el atleta desarrolle el hábito de reflexionar sobre su desempeño después de cada encuentro, independientemente del resultado. La disciplina de hacer un debrief honesto — ganar o perder — es en sí misma una habilidad de alto rendimiento.

El segundo es construir un registro de la voz del atleta en primera persona a lo largo del tiempo. Cómo se describe a sí mismo después de un partido difícil, qué identifica como causa de sus errores, con qué se queda antes de volver a entrenar — esa información es imposible de recuperar retroactivamente y tiene un valor específico: permite ver cómo evoluciona la auto-percepción del atleta, cómo reacciona ante la adversidad, y si su lectura de los partidos se va alineando con lo que el coach observa desde afuera.

Para un recruiter universitario, el acumulado de PTFs no es un formulario más — es evidencia de madurez deportiva. Un atleta que pierde un partido duro, entiende por qué ocurrió, y lo articula con calma, muestra algo que el ranking no puede mostrar.

---

## Schema del formulario

### Metadata del partido

| Campo | Tipo | Obligatorio |
|---|---|---|
| Atleta | Selección (lista de atletas) | Sí |
| Fecha | Fecha | Sí |
| Torneo | Texto libre | Sí |
| Rival | Texto libre | Sí |
| Resultado | W / L + marcador (ej. 6-3, 7-5) | Sí |
| Superficie | Selección: Dura / Arcilla / Pasto / Alfombra | Sí |

---

### Estrategia del partido

**¿Jugaste este partido con una estrategia definida?** — Sí / No

*Si la respuesta es Sí, completar las siguientes tres secciones:*

**Saque + 1**
¿Cuál era tu plan al sacar? — Texto libre
*Hint: "Ej: primero abierto + forehand al espacio, primero al cuerpo + volea"*

**Devolución**
¿Qué buscabas al devolver? — Texto libre
*Hint: "Ej: profundo al revés, cruzado a la cancha abierta, devolución baja tipo kick"*

**Patrones en el rally**
¿Qué patrones buscabas usar? — Selección múltiple:
- Cambio de altura (topspin profundo → slice bajo)
- 2-1 (dos al mismo lado → cambio de dirección)
- Subir a la red
- Atacar el revés del rival
- Buscar el lado abierto
- Otro (texto libre)

---

### Preguntas de reflexión

Todas las preguntas son obligatorias. El formulario no se puede enviar con campos vacíos.

| # | Pregunta | Tipo de campo |
|---|---|---|
| 1 | ¿Cómo llegaste a este partido? | Texto libre |
| 2 | ¿Cómo te sentiste en cancha? | Escala 1–5 (1: Muy mal · 5: Muy bien) + texto libre |
| 3 | ¿Qué funcionó bien? | Texto libre |
| 4 | ¿Qué no funcionó como esperabas? | Texto libre |
| 5 | ¿Cuál fue el momento más decisivo del partido para ti? | Texto libre |
| 6 | ¿Cómo reaccionaste ante los errores o los momentos de presión? | Texto libre |
| 7 | ¿Con qué te quedas de este partido? | Texto libre |
| 8 | ¿En qué aspecto concreto vas a trabajar esta semana? | Texto libre |

---

### Cierre — Evaluación de la estrategia

*Esta sección aplica solo si el atleta declaró haber jugado con estrategia definida.*

| # | Pregunta | Tipo de campo |
|---|---|---|
| 9 | ¿Qué tan bien ejecutaste la estrategia que llevabas? | Escala 1–5 (1: No la ejecuté · 5: La ejecuté consistentemente) |
| 10 | ¿Por qué funcionó o por qué no? | Texto libre |

---

## Roadmap del PTF

**Iteración 1 — Modo escritura** *(MVP)*
El atleta llena el formulario directamente en la app respondiendo las 8 preguntas por escrito.

**Iteración 2 — Modo voz** *(post-MVP)*
El atleta puede optar por hacer una entrevista conversacional de voz en lugar de escribir. Un agente conduce la entrevista cubriendo los 8 campos de manera natural, transcribe las respuestas y las estructura automáticamente. El audio también permite capturar el estado emocional del atleta de manera objetiva — el tono de voz da información que el texto no puede dar. El schema de base de datos no cambia entre iteraciones.
