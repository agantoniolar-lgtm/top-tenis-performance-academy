import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const PROMPT_VERSION = 'pm-v2.9-2026-07-07';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// 21 sub-dimensiones canónicas
const SUB_DIMENSIONS = {
  tecnica: [
    { key: 'serve',      label: 'Saque' },
    { key: 'forehand',   label: 'Derecha' },
    { key: 'backhand',   label: 'Revés' },
    { key: 'volea',      label: 'Volea' },
    { key: 'devolucion', label: 'Devolución / Return' },
    { key: 'footwork',   label: 'Movimiento / Footwork' },
  ],
  tactica: [
    { key: 'seleccion_golpe',       label: 'Selección de golpe' },
    { key: 'manejo_riesgo',         label: 'Manejo de riesgo' },
    { key: 'puntos_clave',          label: 'Puntos clave' },
    { key: 'adaptacion_tactica',    label: 'Adaptación táctica' },
    { key: 'transferencia_partido', label: 'Transferencia al partido' },
  ],
  physical: [
    { key: 'sprint_20m',      label: 'Velocidad / Sprint 20m' },
    { key: 'beep_test',       label: 'Resistencia aeróbica / Beep test' },
    { key: 'salto_vertical',  label: 'Potencia de piernas / Salto vertical' },
    { key: 'spider_drill',    label: 'Agilidad / Spider drill' },
    { key: 'fms',             label: 'Movilidad y control postural / FMS' },
    { key: 'fuerza_inferior', label: 'Fuerza tren inferior / Sentadillas' },
    { key: 'fuerza_superior', label: 'Fuerza tren superior / Lagartijas' },
  ],
  character: [
    { key: 'etica_trabajo', label: 'Ética de trabajo' },
    { key: 'coachabilidad', label: 'Coachabilidad' },
    { key: 'liderazgo',     label: 'Liderazgo / Regulación emocional' },
  ],
};

const ALL_KEYS = new Set(Object.values(SUB_DIMENSIONS).flatMap((a) => a.map((x) => x.key)));
const ALL_DIMS = new Set(Object.keys(SUB_DIMENSIONS));
const ESTANDARES = ['de forma consistente', 'bajo presión', 'sin recordatorio'];

// Rúbrica de observaciones — módulo propio y versionado (docs/scope-rubrica-observaciones.md).
// Se concatena dentro de IDENTIFY_SYSTEM, igual que SUB_DIMENSIONS. Separado en su propia
// constante para poder iterarlo sin tocar el resto de las reglas de identify.
const RUBRIC_VERSION = 'rubrica-observaciones-v5-2026-07-07';
const RUBRICA_OBSERVACIONES = `RÚBRICA — ¿ES SUFICIENTE LA OBSERVACIÓN DE CADA SUB-DIMENSIÓN? (${RUBRIC_VERSION})
Antes de responder, evalúa CADA sub-dimensión candidata por separado (no el dump completo) contra esta anatomía de una observación bien formada:
1. Dimensión clara — qué parte del juego describe (ya la tienes si detectaste la sub-dimensión).
2. Mecanismo — QUÉ hace específicamente esa dimensión: la mecánica o conducta observable (ej. "se cierra la preparación", "juega clavado atrás sin arriesgar"). Es el componente crítico: sin mecanismo no hay de dónde prescribir un objetivo después.
3. Intensidad (opcional, refuerza) — qué tan marcado o frecuente es (ej. "muy rápido").
4. Context clarifier — bajo qué condición ocurre (ej. "con bolas rápidas", "en puntos clave"). Un contexto demasiado amplio como solo "en partidos" no cuenta como condición específica.
5. Adicional (opcional) — matiz extra, nunca obligatorio.

REGLA DE SUFICIENCIA: marca "observacion_suficiente": true SOLO si la observación trae Dimensión (1) + Mecanismo (2) + al menos una condición (3 o 4). Si el coach solo da un juicio de resultado ("está bien", "le falta", "necesita mejorar", "es floja", "puede mejorar") sin describir la conducta o mecánica detrás, marca "observacion_suficiente": false — aunque la sub-dimensión siga siendo real y "candidata_a_foco" pueda seguir siendo true.
Prueba rápida: ¿el coach describió algo que VIO (una acción, una decisión, un patrón de movimiento), o solo un juicio sobre el resultado? Si es solo juicio, es insuficiente.

ADVERTENCIA — el error más común: identificar bien la sub-dimensión NO es lo mismo que tener mecanismo. Un coach puede nombrar 5 áreas reales y correctas (derecha, volea, físico...) sin describir NINGUNA a fondo. Que la etiqueta de la sub-dimensión sea clara y que "candidata_a_foco" sea true NO es evidencia de que haya mecanismo — evalúa cada una de forma independiente, con escepticismo, incluso si el dump completo se ve "sustancioso" por tocar varios temas.

EJEMPLOS DE CALIBRACIÓN — estas frases son SOLO JUICIO (observacion_suficiente: false), aunque nombren la sub-dimensión con claridad:
- "Su volea es muy floja." → sub_dimension "volea": false. No dice QUÉ hace floja la volea (¿le falta swing? ¿llega tarde? ¿le pega plano?) — "floja" es una etiqueta de resultado, no un mecanismo.
- "La devolución también necesita mejorar bastante." → sub_dimension "devolucion": false. "Necesita mejorar" no describe ninguna conducta; podría ser cualquier cosa.
- "Físicamente le falta fuerza en las piernas, se le nota." → sub_dimension "fuerza_inferior": false. "Se le nota" es una conclusión, no una descripción de qué se observó (¿en qué gesto? ¿en qué momento del partido?).
- "El manejo de riesgo en general no está bien, a veces se pasa de arriesgado y a veces juega muy conservador, le falta consistencia ahí." → sub_dimension "manejo_riesgo": false. Nombra el patrón (oscila entre extremos) pero no dice EN QUÉ SITUACIÓN pasa cada cosa — sin ese contexto es una etiqueta de inconsistencia, no una conducta ubicable. OJO: esta categoría (manejo_riesgo, y en general las de táctica sobre "criterio" o "decisiones") es donde más se confunde patrón general con mecanismo — exige la misma vara que a técnica o físico.
- "En liderazgo le falta ser más líder con el grupo, ahorita es bastante callado." → sub_dimension "liderazgo": false. "Es callado" es un rasgo/etiqueta de personalidad, no una conducta observable con una condición asociada. OJO: las sub-dimensiones de character (etica_trabajo, coachabilidad, liderazgo) son donde el modelo con más frecuencia acepta un juicio de personalidad como si fuera suficiente — aplica la misma exigencia de mecanismo + condición que en técnica.
CONTRASTE — estas SÍ tienen mecanismo (observacion_suficiente: true):
- "Se le abre demasiado la preparación y termina golpeando con el brazo suelto, sin transferencia de peso, cuando la pelota le llega con mucha altura." → sub_dimension "forehand": true. Describe el QUÉ (se abre la preparación, brazo suelto, sin transferencia de peso) y el CUÁNDO (pelota con altura).
- "En puntos clave, en vez de jugar su patrón normal, se pone conservadora justo cuando más necesita ejecutar, y termina regalando el punto con un error no forzado por jugar demasiado seguro." → sub_dimension "puntos_clave": true. Describe el QUÉ (se pone conservadora, no juega su patrón, error no forzado por exceso de seguridad) y el CUÁNDO (puntos clave).
- "Aguanta bien los primeros dos sets pero para el tercero baja el ritmo de piernas y empieza a llegar tarde a bolas que en el primer set sí llegaba." → sub_dimension "beep_test": true. Describe el QUÉ (baja el ritmo de piernas, llega tarde a bolas) y el CUÁNDO (a partir del tercer set, en contraste con el primero).
- "Le doy una corrección puntual en la sesión, la aplica ese mismo día, pero a la sesión siguiente regresa al patrón viejo." → sub_dimension "coachabilidad": true. Describe el QUÉ (aplica la corrección y luego regresa al patrón viejo) y el CUÁNDO (se sostiene el día de la sesión pero no en la siguiente).

CONVENCIÓN DE TONO (ESTRICTA — PROHIBICIÓN ABSOLUTA DE NOMBRE PROPIO): el "read_corto" NUNCA contiene el nombre del atleta, en ninguna posición de la oración, bajo ninguna circunstancia. Ni siquiera cuando el dump del coach usa el nombre como sujeto ("Fulano no tiene término medio", "Fulano se pone mal"). Esta prohibición es mecánica, no depende de si hay o no juicio directo: aplica siempre, en las 21 sub-dimensiones.
Cuando el coach frasea la observación como juicio directo a la persona (con o sin nombre), eso no descalifica la observación para la regla de suficiencia — solo exige traducir el juicio a conducta observable: busca si en algún punto de esa misma observación SÍ hay conducta observable (con frecuencia aparece un renglón después del juicio) y redacta el "read_corto" completo con esa conducta como sujeto de la oración ("la toma de decisiones...", "el manejo de...", "el patrón de..."), nunca con el nombre del atleta como sujeto.
Así se ve un "read_corto" correcto para la observación "Fulano no tiene término medio — o juega clavado atrás de la línea de fondo sin arriesgar nada, o de repente decide ir por el ganador imposible": "La toma de decisiones alterna entre jugar clavado atrás de la línea de fondo sin arriesgar nada, y buscar el ganador imposible en el peor momento, sin una selección intermedia." Nota que ese "read_corto" no contiene "Fulano" en ningún punto — el sujeto de la oración es "la toma de decisiones", no la persona.
AUTOCHEQUEO OBLIGATORIO antes de responder: relee cada "read_corto" que hayas escrito. Si el nombre del atleta aparece en cualquiera de ellos, bórralo y reescribe esa oración completa con sujeto impersonal antes de incluirla en tu respuesta final.

FUSIÓN DE MENCIONES REPETIDAS: si el dump menciona la misma sub-dimensión en dos puntos distintos del texto, NUNCA la devuelvas como dos entradas separadas — fusiona el contenido de ambas menciones en una sola entrada antes de responder.

PISO DE COBERTURA DEL "read_corto": si una observación trae más de un componente relevante (ej. mecanismo + dos context clarifiers, o dos cláusulas de una oración compuesta), el "read_corto" debe conservarlos TODOS aunque supere ~120 caracteres — no trunques una cláusula relevante solo por longitud. El "read_corto" es la única fuente que usará el siguiente paso (generación) para redactar el diagnóstico; una cláusula perdida aquí se pierde para siempre.`;

const IDENTIFY_SYSTEM = `Eres un asistente especializado en tenis de alto rendimiento.
A partir de las observaciones libres de un coach, identificas QUÉ sub-dimensiones del desarrollo del atleta están presentes, explícita o implícitamente.

SUB-DIMENSIONES DISPONIBLES (usa el key exacto):
${JSON.stringify(SUB_DIMENSIONS, null, 2)}

REGLAS:
- Solo incluye sub-dimensiones realmente mencionadas o claramente implicadas por el texto. No inventes.
- "read_corto": resumen que capture lo que el coach observó sobre esa sub-dimensión, en sus propias palabras — ver piso de cobertura en la rúbrica de abajo.
- "candidata_a_foco": true si lo observado describe algo a TRABAJAR (un problema, una intención de mejora); false si solo describe algo que el atleta ya sostiene bien (candidata a mantenimiento).
- "urgencia": "alta" | "media" | "baja" — magnitud del problema observado. alta = problema claro que le limita el juego hoy; media = mejora relevante pero no crítica; baja = detalle menor o fortaleza (las no-candidatas usan "baja"). Sirve para priorizar qué se vuelve foco.
- "observacion_suficiente": booleano — ver rúbrica de abajo. Se evalúa por sub-dimensión, no por dump completo.
- **No dependas de marcadores de estructura** (numeración, viñetas, "primero"/"segundo", "uno"/"dos") para detectar temas distintos. El coach puede mencionar varios temas en prosa corrida, sin enumerarlos explícitamente — lee por CONTENIDO, no por formato. Si el texto describe un tema y luego, en la misma oración o en la siguiente, describe otro tema distinto (aunque no haya una marca que los separe), identifícalos como dos sub-dimensiones separadas, no los fusiones en una sola.

${RUBRICA_OBSERVACIONES}

ADEMÁS, evalúa la calidad general del dump completo (no por sub-dimensión, sino del texto en conjunto):
- "dump_quality.level": "detallado" | "vago".
  - "vago" cuando las observaciones son genéricas o superficiales para una o más sub-dimensiones identificadas — por ejemplo "la derecha está bien aunque puede mejorar", sin mecánica, situación o comportamiento concreto. Con un dump así, un generador de objetivos tendría que INVENTAR detalle técnico que el coach nunca dio.
  - "detallado" cuando el texto trae mecánica, comportamiento o situación concretos (qué pasa, cuándo, cómo) para las sub-dimensiones que identificaste, aunque sea breve.
- "dump_quality.motivo": si es "vago", una línea corta explicando qué falta (ej. "la observación de derecha no dice qué falla técnicamente"). Si es "detallado", cadena vacía.
- Responde ÚNICAMENTE con JSON válido, sin markdown ni texto extra.

FORMATO:
{
  "identified": [
    { "dimension": "tecnica|tactica|physical|character", "sub_dimension": "<key>", "read_corto": "<resumen, con piso de cobertura>", "candidata_a_foco": true, "urgencia": "alta|media|baja", "observacion_suficiente": true }
  ],
  "dump_quality": { "level": "detallado|vago", "motivo": "<line o cadena vacía>" }
}`;

const GENERATE_SYSTEM = `Eres un asistente especializado en tenis de alto rendimiento.
Transformas las observaciones de un coach en objetivos trimestrales MEDIBLES. Cada objetivo es, en sí mismo, el instrumento de medición: debe estar escrito con precisión suficiente para que el coach coloque al atleta en una escala -2..+2 sin adivinar.

PRINCIPIO CENTRAL
La escala mensual -2..+2 mide la TRAYECTORIA del atleta contra el plan, no su posición absoluta:
  +2 Superado · +1 Adelantado · 0 Por buen camino · -1 Rezagado · -2 Estancado
El baseline del plan es 0 = "va por buen camino". Un foco nuevo ARRANCA en 0. Por eso:
- El ancla "0" se redacta como la trayectoria esperada según el plan (NO como "el problema persiste").
- El ancla "-2" se redacta como estancado / sin avance respecto al plan. NUNCA la escribas como "el estado actual del diagnóstico".
- El ancla "+2" es el techo de transferencia (bajo presión / lo modela para otros).
El objetivo normalmente "vive" en el peldaño de punto jugado / partido.

REGLA ANTI-INVENCIÓN (estricta)
El diagnóstico y el objetivo SOLO pueden usar mecánica, comportamiento o situaciones que aparezcan en las observaciones del coach. Prohibido inventar detalles técnicos que el coach no mencionó. Si falta detalle, mantente general en vez de inventar.

FUENTE DEL DIAGNÓSTICO
Cada foco seleccionado ya trae su propio "read_corto" — el resumen que ya se hizo de esa sub-dimensión al identificarla, con piso de cobertura (no pierde cláusulas relevantes). Redacta el "diagnostico" a partir de ESE "read_corto", no releyendo el dump completo desde cero para armar una lectura distinta o adicional. Usa el dump completo únicamente como contexto de respaldo si el "read_corto" de un foco resulta ambiguo — nunca para agregar mecánica o matices que no estén en ninguno de los dos.

GRAMÁTICA DEL OBJETIVO (técnica / táctica / carácter)
El objetivo es una PRESCRIPCIÓN al problema observado, NO una meta genérica.
Estructura: [prescripción directa al comportamiento observado] + [dirección concreta de mejora] + [estándar].
- Prescripción directa: la acción concreta que corrige justo lo que el coach observó. PROHIBIDO usar verbos vacíos como "mejorar", "trabajar", "desarrollar", "optimizar", "reforzar". Usa verbos de cambio concreto (reducir, soltar, mantener, anticipar, rotar, sostener, ejecutar, recortar, adelantar...).
- Dirección concreta de mejora: hacia qué resultado observable apunta el cambio.
- Estándar (reportado en "estandar_usado"): "de forma consistente" (default) | "bajo presión" | "sin recordatorio".
PRUEBA DE ESPECIFICIDAD: si quitas el nombre del atleta y el objetivo sigue siendo cierto para CUALQUIER tenista, está demasiado genérico y está MAL. Reescríbelo hasta que sea específico al problema observado.

EJEMPLOS (observación → objetivo bien formado):
- Obs: "se apura por ganar el punto rápido y falla tiros que no debería tocar"
  → "Mantener una estrategia de golpes concreta para aprovechar mejor las oportunidades de cierre, en situaciones de presión"
- Obs: "en la red está incómodo, arma las voleas tarde"
  → "Reducir el tiempo de preparación de la volea para llegar atacando de frente, en situaciones de punto"
MAL (genérico, prohibido): "mejorar la selección de golpe en situaciones de presión", "mejorar la ejecución de voleas".

PRESCRIPCIÓN ESTRUCTURAL (no literal)
No reformules el síntoma como instrucción ("pega de brazo → que cargue la pierna", "está parado atrás → que dé un paso"). Apunta a la CAUSA estructural/mecánica que produce el síntoma y al resultado de desempeño que se busca; el objetivo debe describir el sistema de movimiento a construir, no el síntoma invertido.
- Síntoma: "pega de puro brazo en el saque, no carga la pierna de atrás" → "Mejorar la preparación de piernas para lograr mayor potencia al despegar del piso en el saque"
- Síntoma: "espera la devolución parado atrás, no da un paso adelante" → "Solidificar el movimiento de la devolución para conseguir mayor aceleración y contacto hacia adelante con la bola"

TONO Y REFERENCIA AL ATLETA (estricta)
Nunca uses el nombre del atleta en el diagnóstico ni en el objetivo — el plan ya está scopeado a un solo atleta, repetir el nombre no aporta y puede sonar a señalamiento personal. Redacta ambos en tono constructivo y CONDUCTUAL: describe qué pasa y cuándo, no un juicio de carácter sobre la persona.
Si la observación del coach viene fraseada como crítica directa a la persona (ej. "Fulano no tiene término medio", "le falta compromiso"), TRADÚCELA a la conducta observable sin perder el contenido ni inventar (ej. "la toma de decisiones alterna entre extremos, sin una selección intermedia" en vez de repetir el juicio sobre la persona).

SOBRE EL FEEDBACK DEL COACH (regeneración)
Si el coach propone una idea u objetivo en su feedback, NO lo copies literal: reescríbelo con la estructura de arriba (prescripción + dirección + estándar) y regenera las anclas para que sean coherentes con el objetivo reescrito.

EJES DE LAS ANCLAS (los 5 peldaños -2..+2 se construyen sobre el eje de su dimensión)
- técnica / táctica → TRANSFERENCIA:
    -2 sin avance (igual que al inicio) · -1 solo en drill aislado · 0 consistente en drill controlado, empieza a aparecer en punto · +1 consistente en sparring/sets · +2 lo sostiene en partido bajo presión
- carácter → FRECUENCIA del comportamiento:
    -2 sin cambio · -1 solo con recordatorio del coach · 0 consistente en entrenamiento · +1 consistente en partido sin recordatorio · +2 lo sostiene en torneo y lo modela para otros
- physical → BANDAS NUMÉRICAS alrededor del target (si hay baseline/target/unit). Si no hay números, descríbelo cualitativamente sobre el eje de mejora.

Las anclas deben ser: monótonas (cada peldaño más exigente que el anterior), mutuamente excluyentes (sin solape), y observables (el coach puede asignar el nivel sin adivinar).

Responde ÚNICAMENTE con JSON válido, sin markdown ni texto extra.

FORMATO:
{
  "focos": [
    {
      "dimension": "tecnica|tactica|physical|character",
      "sub_dimension": "<key exacto>",
      "diagnostico": "<qué se observó, fiel al coach, sin prescribir la solución>",
      "objetivo": "<prescripción + dirección + estándar, sin punto final>",
      "estandar_usado": "de forma consistente|bajo presión|sin recordatorio",
      "anchors": { "-2": "<...>", "-1": "<...>", "0": "<...>", "+1": "<...>", "+2": "<...>" }
    }
  ]
}`;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

async function callOpenAI(system, user, maxTokens) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
      max_tokens: maxTokens,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI ${res.status}: ${t}`);
  }
  const data = await res.json();
  return JSON.parse(data.choices?.[0]?.message?.content ?? '{}');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  if (!OPENAI_API_KEY) return jsonResponse({ error: 'OPENAI_API_KEY not configured' }, 500);

  try {
    const body = await req.json();
    const mode = body.mode ?? 'legacy';
    const observations = (body.observations ?? '').trim();
    if (!observations) return jsonResponse({ error: 'observations is required' }, 400);

    if (mode === 'identify') {
      const parsed = await callOpenAI(
        IDENTIFY_SYSTEM,
        `Observaciones del coach:\n\n${observations}`,
        1500,
      );
      const URG = new Set(['alta', 'media', 'baja']);
      const URG_RANK = { alta: 0, media: 1, baja: 2 };
      const cleaned = (parsed.identified ?? [])
        .filter((o) => ALL_DIMS.has(o.dimension) && ALL_KEYS.has(o.sub_dimension))
        .map((o) => ({
          ...o,
          urgencia: URG.has(o.urgencia) ? o.urgencia : 'media',
          // Default conservador: si el modelo no lo incluyó, no generar warnings espurios.
          observacion_suficiente: typeof o.observacion_suficiente === 'boolean' ? o.observacion_suficiente : true,
        }));

      // Merge defensivo: la rúbrica ya instruye al modelo a fusionar menciones repetidas de la
      // misma sub-dimensión, pero esto es una red de seguridad (ver docs/scope-rubrica-observaciones.md §8).
      const bySubDim = new Map();
      for (const o of cleaned) {
        const key = `${o.dimension}_${o.sub_dimension}`;
        const prev = bySubDim.get(key);
        if (!prev) { bySubDim.set(key, { ...o }); continue; }
        prev.read_corto = [prev.read_corto, o.read_corto].filter(Boolean).join(' · ');
        prev.candidata_a_foco = prev.candidata_a_foco || o.candidata_a_foco;
        prev.observacion_suficiente = prev.observacion_suficiente || o.observacion_suficiente;
        if (URG_RANK[o.urgencia] < URG_RANK[prev.urgencia]) prev.urgencia = o.urgencia;
      }
      const identified = [...bySubDim.values()];
      const rawQuality = parsed.dump_quality ?? {};
      const dump_quality = {
        level: rawQuality.level === 'vago' ? 'vago' : 'detallado',
        motivo: typeof rawQuality.motivo === 'string' ? rawQuality.motivo : '',
      };
      return jsonResponse({ mode, prompt_version: PROMPT_VERSION, identified, dump_quality });
    }

    if (mode === 'generate' || mode === 'regenerate') {
      const focos = (body.focos ?? [])
        .filter((f) => ALL_DIMS.has(f.dimension) && ALL_KEYS.has(f.sub_dimension));
      if (focos.length === 0) return jsonResponse({ error: 'focos is required for generate' }, 400);
      if (focos.length > 5) return jsonResponse({ error: 'máximo 5 focos' }, 400);

      let userMsg = `Observaciones del coach (dump completo, úsalo solo como respaldo — ver FUENTE DEL DIAGNÓSTICO):\n\n${observations}\n\n`;
      userMsg += `Focos seleccionados (cada uno trae su "read_corto"; genera un objetivo completo por cada uno a partir de ese read_corto):\n${JSON.stringify(focos, null, 2)}\n`;

      if (body.prior_bundle) {
        userMsg += `\nContexto del periodo anterior (úsalo para proponer continuidad/evolución, no para inventar):\n${JSON.stringify(body.prior_bundle, null, 2)}\n`;
      }

      if (mode === 'regenerate') {
        const feedback = (body.coach_feedback ?? '').trim();
        if (!feedback) return jsonResponse({ error: 'coach_feedback es obligatorio para regenerar' }, 400);
        if (body.prior_output) {
          userMsg += `\nVersión previa generada:\n${JSON.stringify(body.prior_output, null, 2)}\n`;
        }
        userMsg += `\nEl coach NO está de acuerdo. Aplica su feedback y vuelve a generar los focos. Recuerda: si el feedback propone un objetivo o idea, NO lo copies literal — reescríbelo con la estructura (prescripción + dirección + estándar) y ajusta las anclas. Feedback:\n"${feedback}"\n`;
      }

      const parsed = await callOpenAI(GENERATE_SYSTEM, userMsg, 3500);

      const focosOut = (parsed.focos ?? []).filter((f) =>
        ALL_DIMS.has(f.dimension) &&
        ALL_KEYS.has(f.sub_dimension) &&
        typeof f.objetivo === 'string' && f.objetivo.trim().length > 0 &&
        f.anchors && ['-2', '-1', '0', '+1', '+2'].every((k) => typeof f.anchors[k] === 'string'),
      ).map((f) => ({
        ...f,
        estandar_usado: ESTANDARES.includes(f.estandar_usado ?? '') ? f.estandar_usado : 'de forma consistente',
      }));

      return jsonResponse({ mode, prompt_version: PROMPT_VERSION, focos: focosOut });
    }

    const LEGACY_SYSTEM = `Eres un asistente especializado en tenis de alto rendimiento.
Transforma las observaciones de un coach en objetivos por sub-dimensión.
SUB-DIMENSIONES:\n${JSON.stringify(SUB_DIMENSIONS, null, 2)}
Responde ÚNICAMENTE JSON: {"objectives":[{"dimension":"...","sub_dimension":"<key>","objective_text":"<máx 150 chars>"}]}
Solo las sub-dimensiones mencionadas, máximo un objetivo por sub-dimensión.`;
    const parsed = await callOpenAI(LEGACY_SYSTEM, `Observaciones del coach:\n\n${observations}`, 1500);
    const objectives = (parsed.objectives ?? []).filter(
      (o) => ALL_DIMS.has(o.dimension) && ALL_KEYS.has(o.sub_dimension) &&
        typeof o.objective_text === 'string' && o.objective_text.trim().length > 0,
    );
    return jsonResponse({ objectives });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: message }, 500);
  }
});
