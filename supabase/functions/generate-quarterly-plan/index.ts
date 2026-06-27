import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const PROMPT_VERSION = 'pm-v2.2-2026-06-27';

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

const IDENTIFY_SYSTEM = `Eres un asistente especializado en tenis de alto rendimiento.
A partir de las observaciones libres de un coach, identificas QUÉ sub-dimensiones del desarrollo del atleta están presentes, explícita o implícitamente.

SUB-DIMENSIONES DISPONIBLES (usa el key exacto):
${JSON.stringify(SUB_DIMENSIONS, null, 2)}

REGLAS:
- Solo incluye sub-dimensiones realmente mencionadas o claramente implicadas por el texto. No inventes.
- "read_corto": una sola línea (máx ~120 caracteres) que resuma lo que el coach observó sobre esa sub-dimensión, en sus propias palabras.
- "candidata_a_foco": true si lo observado describe algo a TRABAJAR (un problema, una intención de mejora); false si solo describe algo que el atleta ya sostiene bien (candidata a mantenimiento).
- "urgencia": "alta" | "media" | "baja" — magnitud del problema observado. alta = problema claro que le limita el juego hoy; media = mejora relevante pero no crítica; baja = detalle menor o fortaleza (las no-candidatas usan "baja"). Sirve para priorizar qué se vuelve foco.
- Responde ÚNICAMENTE con JSON válido, sin markdown ni texto extra.

FORMATO:
{
  "identified": [
    { "dimension": "tecnica|tactica|physical|character", "sub_dimension": "<key>", "read_corto": "<1 línea>", "candidata_a_foco": true, "urgencia": "alta|media|baja" }
  ]
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
      const identified = (parsed.identified ?? [])
        .filter((o) => ALL_DIMS.has(o.dimension) && ALL_KEYS.has(o.sub_dimension))
        .map((o) => ({ ...o, urgencia: URG.has(o.urgencia) ? o.urgencia : 'media' }));
      return jsonResponse({ mode, prompt_version: PROMPT_VERSION, identified });
    }

    if (mode === 'generate' || mode === 'regenerate') {
      const focos = (body.focos ?? [])
        .filter((f) => ALL_DIMS.has(f.dimension) && ALL_KEYS.has(f.sub_dimension));
      if (focos.length === 0) return jsonResponse({ error: 'focos is required for generate' }, 400);
      if (focos.length > 5) return jsonResponse({ error: 'máximo 5 focos' }, 400);

      let userMsg = `Observaciones del coach:\n\n${observations}\n\n`;
      userMsg += `Focos seleccionados (genera un objetivo completo por cada uno):\n${JSON.stringify(focos, null, 2)}\n`;

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
