# Dumps de prueba — edge cases de Planning (identify + generate)

Set de dumps de observaciones sintéticos para testear `generate-quarterly-plan` (pasos *identificar* y *generar*, `pm-v2.3`). Cada uno ataca un edge case distinto de calidad de input. Pegar el texto del bloque "Dump" directamente en el textarea de observaciones — el resto es solo anotación de QA, no forma parte del input.

Referencia — las 21 sub-dimensiones canónicas (`SUB_DIMENSIONS` en `generate-quarterly-plan/index.ts`):
- **Técnica:** saque, derecha, revés, volea, devolución, movimiento/footwork
- **Táctica:** selección de golpe, manejo de riesgo, puntos clave, adaptación táctica, transferencia al partido
- **Physical:** sprint 20m, beep test, salto vertical, spider drill, FMS, fuerza inferior, fuerza superior
- **Character:** ética de trabajo, coachabilidad, liderazgo/regulación emocional

---

## Caso 1 — Completo y bien definido (hasta 5 focos, sin métricas pero con problema claro)

**Atleta:** Mariana, 15 años

**Dump:**

> Con Mariana este trimestre veo varias cosas claras. El segundo saque sigue siendo el problema de siempre: le sale muy lento y sin nada de efecto, entonces el rival se para adentro de la cancha y se lo ataca directo, y ahí es donde se le van los break points en torneo — no es un tema de que no sepa sacar, es que en el segundo no arriesga nada y el rival lo sabe. En puntos clave le pasa algo parecido a la actitud: en vez de jugar su patrón normal, se pone conservadora justo cuando más necesita ejecutar, y termina regalando el punto con un error no forzado por jugar demasiado seguro. La transferencia al partido también me preocupa — en entrenamiento controlado ejecuta bien casi todo, pero en set de práctica o en torneo el nivel baja notoriamente, como si jugara con otra intensidad mental. Físicamente aguanta bien los primeros dos sets pero para el tercero ya se le nota que baja el ritmo de piernas y empieza a llegar tarde a bolas que en el primer set sí llegaba — no es de fuerza, es de resistencia. Y en coachabilidad: le doy una corrección puntual en la sesión, la aplica ese mismo día, pero a la sesión siguiente regresa al patrón viejo — no se le está quedando la corrección de una sesión a otra.

**QA — sub-dimensiones que debería identificar:** `serve`, `puntos_clave`, `transferencia_partido`, `beep_test`, `coachabilidad`.

---

## Caso 2 — Narrow (máximo 2 dimensiones, pero profundo)

**Atleta:** Emilio, 13 años

**Dump:**

> Esta vez me quiero enfocar solo en dos cosas con Emilio, el resto está estable y no quiero meter ruido. Uno: la derecha, que es su golpe principal, pero cuando la pelota le llega con mucha altura se le abre demasiado la preparación y termina golpeando con el brazo suelto, sin transferencia de peso, y la manda larga justo en los puntos donde más la necesita — contra rivales que le suben la pelota con topspin se le nota muchísimo más que contra rivales planos. Dos: el manejo de riesgo — Emilio no tiene término medio, o juega clavado atrás de la línea de fondo sin arriesgar nada, o de repente decide ir por el ganador imposible en el peor momento posible, no hay una selección intermedia de "juego con margen pero con intención". Eso me está costando partidos que debería ganar cómodo.

**QA — sub-dimensiones que debería identificar:** `forehand`, `manejo_riesgo` (ninguna otra — valida que el sistema no infiera focos de más).

---

## Caso 2b — Narrow, sin enumeración explícita (regresión, agregado 1 Jul 2026)

**Atleta:** Emilio, 13 años

Mismo contenido que el Caso 2, quitando los marcadores "Uno:" / "Dos:" para probar que `identify` no dependa de la estructura del texto para separar temas.

**Dump:**

> Esta vez me quiero enfocar solo en dos cosas con Emilio, el resto está estable y no quiero meter ruido. La derecha, que es su golpe principal, pero cuando la pelota le llega con mucha altura se le abre demasiado la preparación y termina golpeando con el brazo suelto, sin transferencia de peso, y la manda larga justo en los puntos donde más la necesita — contra rivales que le suben la pelota con topspin se le nota muchísimo más que contra rivales planos. El manejo de riesgo — Emilio no tiene término medio, o juega clavado atrás de la línea de fondo sin arriesgar nada, o de repente decide ir por el ganador imposible en el peor momento posible, no hay una selección intermedia de "juego con margen pero con intención". Eso me está costando partidos que debería ganar cómodo.

**QA — bug encontrado (1 Jul 2026, `pm-v2.3`):** sin los marcadores "Uno:"/"Dos:", `identify` solo detectaba `forehand` y no reconocía `manejo_riesgo` como sub-dimensión separada. **Corregido en `pm-v2.4`** con regla explícita de no depender de marcadores de estructura. Este caso queda como regresión — debe identificar `forehand` y `manejo_riesgo` igual que el Caso 2 original.

**QA — bono (tono):** el dump nombra al atleta y frasea el manejo de riesgo como juicio directo ("Emilio no tiene término medio"). Verificar que el `diagnostico`/`objetivo` generados NO usen el nombre del atleta ni repitan el juicio directo, aunque el dump del coach sí lo haga (fix `pm-v2.4`, ver scope doc §17).

---

## Caso 3 — Vago / superficial (sin foco específico)

**Atleta:** Sofía, 14 años

**Dump:**

> La verdad esta niña tiene buen nivel para su edad. Su derecha está bien aunque puede mejorar, el revés también anda bien. Le falta un poquito de todo, ¿no? Físicamente está bien pero podría estar mejor, más completa. Mentalmente a veces se desconcentra en partido y se le va el foco. Necesita ser más constante en general, más regular. Tiene mucho potencial, nada más hay que pulirla y que agarre ritmo de competencia.

**QA — comportamiento esperado:** debería disparar el guardrail no-bloqueante de "observaciones poco concretas" (§15 del scope doc) — no hay mecánica ni comportamiento observable en ningún renglón, solo adjetivos ("bien", "más completa", "más regular").

---

## Caso 4 — Completo en número (5), sin concreción de cómo mejorar

**Atleta:** Diego, 16 años

**Dump:**

> Con Diego este trimestre quiero tocar cinco cosas. Su volea es muy floja. La devolución también necesita mejorar bastante. El manejo de riesgo en general no está bien, a veces se pasa de arriesgado y a veces juega muy conservador, le falta consistencia ahí. Físicamente le falta fuerza en las piernas, se le nota. Y en liderazgo le falta ser más líder con el grupo, ahorita es bastante callado.

**QA — comportamiento esperado:** cubre 5 sub-dimensiones distintas (`volea`, `devolucion`, `manejo_riesgo`, `fuerza_inferior`, `liderazgo`) pero cada una es una etiqueta sin diagnóstico — sin causa, sin situación observada, sin dirección. Debería activar el mismo guardrail que el caso 3, pero por foco individual en vez de por dump completo (aquí sí hay candidatas a foco claras en cantidad, falta profundidad en cada una).

---

## Caso 5 — Muy verboso, específico, "all over the place" (casi todas las dimensiones)

**Atleta:** Kevin, 16 años

**Dump:**

> El primer saque pega fuerte pero el segundo le falta kick y se lo atacan; mete dobles cuando se pone nervioso. La derecha la tiene sólida, es su arma. El revés a una mano sufre con pelota alta, se le va largo. La devolución del segundo saque la deja corta, no la ataca. En la red está incómodo, arma las voleas tarde. El footwork en general es rápido para los primeros pasos pero se le complica el ajuste fino cerca de la pelota, llega bien pero se acomoda mal. Tácticamente le falta selección de golpe, se apura por ganar el punto rápido y falla tiros que no debería tocar; en puntos importantes se acelera y va al winner en vez de jugar con margen, y no ajusta el plan cuando el rival le cambia el ritmo del partido — sigue con el mismo patrón aunque no le esté funcionando. La transferencia al partido es rara: en entrenamiento se ve mejor que en competencia, algo se le pierde con el marcador encima. Físicamente es rápido pero le falta resistencia, en el tercer set se cae claramente; las piernas las tiene fuertes, el salto y la potencia no son el problema; en el spider drill se mueve bien lateral pero se traba en los cambios de dirección hacia atrás; de movilidad no he visto nada raro. Es muy trabajador, nunca se queja en entrenamiento, esa ética no es tema; pero le falta liderazgo, es callado con el grupo; y en coachabilidad va y viene — a veces aplica la corrección, a veces la ignora sin decir nada; y cuando comete un error fácil tira la raqueta y arrastra el enojo al siguiente punto, ahí se le nota que le falta regulación emocional, sobre todo en el tercer set cuando ya viene cansado y frustrado a la vez.

**QA — comportamiento esperado:** toca ~15 de las 21 sub-dimensiones (`serve`, `forehand`, `backhand`, `volea`, `devolucion`, `footwork`, `seleccion_golpe`, `puntos_clave`, `adaptacion_tactica`, `transferencia_partido`, `beep_test`, `salto_vertical`, `spider_drill`, `etica_trabajo`, `liderazgo`, `coachabilidad`). Valida que `identify` priorice por `urgencia` y que la UI en selección de focos no deje elegir más de 5 aunque casi todo califique como candidata.

---

## Nota — edge case adicional ya documentado, fuera de los 5 pedidos

El ejemplo de "coach que prescribe" (convierte el síntoma en instrucción literal, ej. *"tiene que cargar más la pierna de atrás en el saque"* en vez de describir el problema) ya está registrado como edge case 3 en `docs/scope-planning-measurement.md` §15, con su fix (prescripción estructural, `pm-v2.2`). No lo incluí como caso 6 porque no fue parte de los 5 que listaste, pero si quieres el dump para regresión te lo genero aparte.
