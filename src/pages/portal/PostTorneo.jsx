import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Send, CheckCircle } from 'lucide-react';
import { RONDAS_TORNEO } from '../../data/torneoOpciones';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

// ─── Escalas PTF ────────────────────────────────────────────────────────────
// Percepción del atleta relativa al plan de torneo (verbal por ahora,
// documentado en plataforma post-MVP con integración Swing Vision).
// 1 = muy por debajo del plan · 5 = superó expectativas

const TECNICA_LABELS = {
  1: 'No lo ejecuté',
  2: 'Por debajo de lo esperado',
  3: 'Cumplí el plan',
  4: 'Mejor de lo esperado',
  5: 'Superé mis expectativas',
};

const MENTAL_LABELS = {
  1: 'No lo manejé',
  2: 'Me costó mantenerlo',
  3: 'Lo mantuve',
  4: 'Estuve sólido',
  5: 'En mi mejor nivel',
};

const FISICO_LABELS = {
  1: 'Sin energía',
  2: 'Por debajo de lo normal',
  3: 'Normal',
  4: 'Buena condición',
  5: 'Excelente condición',
};

const SATISFACCION_RANGES = [
  { min: 1, max: 2, label: 'No di lo que tenía' },
  { min: 3, max: 5, label: 'Por debajo de lo que esperaba' },
  { min: 6, max: 8, label: 'Satisfecho con mi desempeño' },
  { min: 9, max: 10, label: 'Superé mis expectativas' },
];

function getSatisfaccionLabel(value) {
  return SATISFACCION_RANGES.find(r => value >= r.min && value <= r.max)?.label ?? '';
}

// ─── Placeholders aleatorios por campo ──────────────────────────────────────
// Se elige uno al azar por sesión para no sesgar con un solo ejemplo.

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const PH = {
  comentarioTecnica: [
    'Mi derecha cruzada salió más limpia que en práctica, pero el servicio en segunda bola lo sentí diferente bajo presión de torneo.',
    'El revés slice lo usé más seguro de lo que esperaba — pero el saque plano se fue largo más de lo normal.',
    'Sentí mis golpes más tensos que en práctica, como si no terminara de soltar el brazo — especialmente en los puntos importantes.',
  ],
  mejoraTecnica: [
    'Empecé a apurar los golpes cuando el marcador se puso en contra — algo que no me pasa cuando entreno.',
    'Mi saque segundo se acortó mucho cuando estaba nervioso — en práctica lo pego con más confianza.',
    'Cuando el rival me presionaba empujaba la bola en vez de pegarla — en entrenamiento eso casi no me pasa.',
  ],
  comentarioPlan: [
    'El plan funcionó bien en los primeros partidos, pero cuando el nivel subió tuve que improvisar más de lo esperado.',
    'El plan era mantener la pelota en juego, pero los rivales eran más agresivos de lo que anticipaba y tuve que cambiar.',
    'Seguí bastante bien el plan — la única excepción fue cuando enfrenté rivales que sacaban muy fuerte.',
  ],
  tacticaFunciono: [
    'Los rivales usaron mucho el slice bajo, algo que no habíamos trabajado — me costó encontrar el ritmo al principio.',
    'Varios rivales cambiaban el ritmo constantemente — no tenía un plan para eso y me tomó tiempo adaptarme.',
    'El viento afectó mucho el juego — no tenía contemplado cómo ajustar mi saque en esas condiciones.',
  ],
  tacticaCambiar: [
    'Sería más agresivo desde el primer punto en vez de esperar a estar cómodo para atacar.',
    'Atacaría más la red — tuve situaciones donde me quedé en el fondo cuando debía avanzar.',
    'Usaría más el slice de revés para cambiar ritmo — me lo guardé todo el torneo y creo que hubiera funcionado.',
  ],
  concentracion: [
    'Cuando el torneo se puso difícil me repetía "juega tu juego" — a veces lo lograba, otras me perdía pensando en el resultado.',
    'En los momentos clave me bloqueaba pensando en no fallar en vez de pensar en qué hacer.',
    'Me mantuve bastante enfocado — cuando me distraía era fácil volver porque tenía claro el plan.',
  ],
  nutricion: [
    'Los primeros partidos me sentí bien, pero hacia el final noté que me faltaba energía — creo que no tomé suficiente líquido.',
    'Me sentí físicamente bien todo el torneo — el calentamiento antes de cada partido ayudó mucho.',
    'En los partidos largos me empezaron a agarrar calambres — probablemente necesito ajustar lo que como antes de jugar.',
  ],
  hiceBien: [
    'En el partido más difícil logré mantener la calma cuando iba perdiendo — eso no lo hubiera hecho antes.',
    'Gané un partido que iba perdiendo en el tercer set — me mantuve creyendo cuando fue más fácil rendirse.',
    'Mi nivel físico se mantuvo constante durante todo el torneo — no me vi limitado por el cansancio.',
  ],
  mejorar: [
    'Soltaría más el juego desde el inicio en vez de esperar a estar cómodo para atacar.',
    'Trabajaría más mi cabeza antes de los puntos importantes — me ponía nervioso y eso afectaba mi ejecución.',
    'Planearía mejor mi descanso entre partidos — a veces llegué cansado porque no calculé bien los tiempos.',
  ],
  aprendizaje: [
    'Necesito trabajar más la segunda bola bajo presión — es donde más puntos perdí en momentos clave.',
    'Quiero trabajar los puntos de quiebre — bajo el nivel exactamente cuando más importa.',
    'Tengo que entrenar más en condiciones de viento y sol — el ambiente me afectó más de lo que debería.',
  ],
  proximoTorneo: [
    'Confía más en tu revés, lo tienes mejor de lo que crees.',
    'Relájate desde el primer punto — cuando intentas demasiado fuerte es cuando más te trabas.',
    'El entrenamiento que has hecho está ahí — suéltalo y juega sin miedo al error.',
  ],
};

// ─── Componentes UI ──────────────────────────────────────────────────────────

// Colores por valor 1-5 — estado normal y seleccionado
const SCALE_COLORS = {
  1: { bg: 'rgba(220,38,38,.08)',  color: '#b91c1c', selectedBg: '#991b1b' },
  2: { bg: 'rgba(220,38,38,.04)',  color: '#dc2626', selectedBg: '#dc2626' },
  3: { bg: 'rgba(249,250,251,1)', color: '#6b7280', selectedBg: '#374151' },
  4: { bg: 'rgba(22,163,74,.04)', color: '#16a34a', selectedBg: '#16a34a' },
  5: { bg: 'rgba(22,163,74,.08)', color: '#15803d', selectedBg: '#166534' },
};

function ScaleButtons({ value, onChange, labels }) {
  return (
    <div className="flex gap-0 overflow-hidden text-[10px] leading-tight" style={{ border: '0.5px solid #e5e7eb', borderRadius: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const selected = value === n;
        const { bg, color, selectedBg } = SCALE_COLORS[n];
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="flex-1 text-center py-1.5 px-1 transition-colors"
            style={{
              background: selected ? selectedBg : bg,
              color: selected ? '#fff' : color,
              borderRight: n < 5 ? '0.5px solid #e5e7eb' : 'none',
              fontWeight: selected ? 700 : 400,
            }}
          >
            <div className="font-bold text-[11px]">{n}</div>
            {labels && <div style={{ opacity: selected ? 1 : 0.85 }}>{labels[n]}</div>}
          </button>
        );
      })}
    </div>
  );
}

function Section({ title, letter, expanded, onToggle, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-[#1B3A2A] text-white flex items-center justify-center text-sm font-bold">
            {letter}
          </span>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {expanded && <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  );
}

export default function PostTorneo() {
  const { user } = useAuth();
  const { torneoId: athleteTournamentId } = useParams();
  const [expanded, setExpanded] = useState({ A: true, B: false, C: false, D: false, E: false });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Metadata del partido
  const [matchDate, setMatchDate] = useState('');
  const [tournamentName, setTournamentName] = useState('');

  // Resultado del partido (se guarda también en athlete_tournaments)
  const [rondaAlcanzada, setRondaAlcanzada] = useState('');
  const [resultadoPartido, setResultadoPartido] = useState('');
  const [victoriaPartido, setVictoriaPartido] = useState('');
  const [modalidad, setModalidad] = useState('Individual');
  const [partidosJugados, setPartidosJugados] = useState('');
  // Si ya existe un PTF para este torneo, se actualiza en vez de duplicar
  const [existingPtfId, setExistingPtfId] = useState(null);

  const linkedToTournament = athleteTournamentId && athleteTournamentId !== 'new';

  // Pre-cargar datos desde athlete_tournaments si hay ID en URL
  useEffect(() => {
    if (!linkedToTournament) return;
    supabase
      .from('athlete_tournaments')
      .select('ronda, resultado, victoria, modalidad, partidos_jugados, tournaments (nombre, fecha)')
      .eq('id', athleteTournamentId)
      .single()
      .then(({ data }) => {
        if (data?.tournaments?.nombre) setTournamentName(data.tournaments.nombre);
        if (data?.tournaments?.fecha) setMatchDate(data.tournaments.fecha);
        if (data?.ronda) setRondaAlcanzada(data.ronda);
        if (data?.resultado) setResultadoPartido(data.resultado);
        if (data?.victoria !== null && data?.victoria !== undefined) setVictoriaPartido(String(data.victoria));
        if (data?.modalidad) setModalidad(data.modalidad);
        if (data?.partidos_jugados) setPartidosJugados(String(data.partidos_jugados));
      });
  }, [athleteTournamentId, linkedToTournament]);

  // Placeholders elegidos al azar una vez por sesión
  const [ph] = useState(() => Object.fromEntries(Object.entries(PH).map(([k, v]) => [k, pick(v)])));

  // A - Golpes bajo presión
  const [derecha, setDerecha] = useState(0);
  const [reves, setReves] = useState(0);
  const [servicio, setServicio] = useState(0);
  const [volea, setVolea] = useState(0);
  const [comentarioTecnica, setComentarioTecnica] = useState('');
  const [mejoraTecnica, setMejoraTecnica] = useState('');

  // B - Táctica (siguioPlan pendiente de conectar a Supabase)
  const [_siguioPlan, setSiguioPlan] = useState(''); // eslint-disable-line no-unused-vars
  const [comentarioPlan, setComentarioPlan] = useState('');
  const [tacticaFunciono, setTacticaFunciono] = useState('');
  const [tacticaCambiar, setTacticaCambiar] = useState('');

  // C - Mental
  const [presion, setPresion] = useState(0);
  const [concentracion, setConcentracion] = useState('');
  const [confianza, setConfianza] = useState(0);
  const [reaccionError, setReaccionError] = useState('');

  // D - Físico
  const [nivelFisico, setNivelFisico] = useState(0);
  const [dolor, setDolor] = useState('');
  const [dolorZonas, setDolorZonas] = useState([]);
  const [nutricion, setNutricion] = useState('');

  // E - Reflexión
  const [hiceBien, setHiceBien] = useState('');
  const [mejorar, setMejorar] = useState('');
  const [aprendizaje, setAprendizaje] = useState('');
  const [proximoTorneo, setProximoTorneo] = useState('');
  const [satisfaccion, setSatisfaccion] = useState(5);

  // Pre-llenar el PTF completo si ya existe, para que editar no borre lo capturado
  useEffect(() => {
    if (!linkedToTournament) return;
    supabase
      .from('post_tournament_forms')
      .select('*')
      .eq('athlete_tournament_id', athleteTournamentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setExistingPtfId(data.id);
        if (data.match_date) setMatchDate(data.match_date);
        setDerecha(data.tecnica_derecha ?? 0);
        setReves(data.tecnica_reves ?? 0);
        setServicio(data.tecnica_servicio ?? 0);
        setVolea(data.tecnica_volea ?? 0);
        setComentarioTecnica(data.tecnica_comentario ?? '');
        setMejoraTecnica(data.tecnica_mejora ?? '');
        setComentarioPlan(data.tactica_comentario_plan ?? '');
        setTacticaFunciono(data.tactica_funciono ?? '');
        setTacticaCambiar(data.tactica_cambiar ?? '');
        setPresion(data.mental_presion ?? 0);
        setConcentracion(data.mental_concentracion ?? '');
        setConfianza(data.mental_confianza ?? 0);
        setReaccionError(data.mental_reaccion_error ?? '');
        setNivelFisico(data.fisico_nivel ?? 0);
        setDolor(data.fisico_dolor === true ? 'Sí' : data.fisico_dolor === false ? 'No' : '');
        setDolorZonas(data.fisico_dolor_zonas ?? []);
        setNutricion(data.fisico_nutricion ?? '');
        setHiceBien(data.reflexion_hice_bien ?? '');
        setMejorar(data.reflexion_mejorar ?? '');
        setAprendizaje(data.reflexion_aprendizaje ?? '');
        setProximoTorneo(data.reflexion_proximo_torneo ?? '');
        if (data.reflexion_satisfaccion != null) setSatisfaccion(data.reflexion_satisfaccion);
      });
  }, [athleteTournamentId, linkedToTournament]);

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matchDate) { setSaveError('Indica la fecha del partido.'); return; }
    // B11: si el PTF está ligado a un torneo, el resultado es obligatorio
    if (linkedToTournament) {
      if (!rondaAlcanzada)  { setSaveError('Indica la ronda alcanzada.'); return; }
      if (victoriaPartido !== 'true' && victoriaPartido !== 'false') { setSaveError('Indica si ganaste el último partido.'); return; }
      if (!resultadoPartido) { setSaveError('Indica el resultado del último partido.'); return; }
      if (!partidosJugados || Number(partidosJugados) < 1) { setSaveError('Indica cuántos partidos jugaste en el torneo.'); return; }
    }
    setSaving(true);
    setSaveError('');

    const ptfPayload = {
      athlete_id:            user?.athlete_id,
      athlete_tournament_id: linkedToTournament ? athleteTournamentId : null,
      match_date:            matchDate,
      tournament_name:       tournamentName || null,
      // A – Técnica
      tecnica_derecha:          derecha   || null,
      tecnica_reves:            reves     || null,
      tecnica_servicio:         servicio  || null,
      tecnica_volea:            volea     || null,
      tecnica_comentario:       comentarioTecnica || null,
      tecnica_mejora:           mejoraTecnica     || null,
      // B – Táctica
      tactica_comentario_plan:  comentarioPlan  || null,
      tactica_funciono:         tacticaFunciono || null,
      tactica_cambiar:          tacticaCambiar  || null,
      // C – Mental
      mental_presion:           presion     || null,
      mental_concentracion:     concentracion || null,
      mental_confianza:         confianza   || null,
      mental_reaccion_error:    reaccionError || null,
      // D – Físico
      fisico_nivel:             nivelFisico || null,
      fisico_dolor:             dolor === 'Sí',
      fisico_dolor_zonas:       dolorZonas.length ? dolorZonas : null,
      fisico_nutricion:         nutricion || null,
      // E – Reflexión
      reflexion_hice_bien:      hiceBien      || null,
      reflexion_mejorar:        mejorar       || null,
      reflexion_aprendizaje:    aprendizaje   || null,
      reflexion_proximo_torneo: proximoTorneo || null,
      reflexion_satisfaccion:   satisfaccion,
    };

    // Reenviar actualiza el PTF existente en vez de duplicarlo
    const { error } = existingPtfId
      ? await supabase.from('post_tournament_forms')
          .update({ ...ptfPayload, updated_at: new Date().toISOString() }).eq('id', existingPtfId)
      : await supabase.from('post_tournament_forms').insert(ptfPayload);

    if (error) { setSaving(false); setSaveError(error.message); return; }

    // Actualizar athlete_tournament con el resultado del partido
    if (linkedToTournament) {
      const { error: updError } = await supabase
        .from('athlete_tournaments')
        .update({
          ronda: rondaAlcanzada || null,
          resultado: resultadoPartido || null,
          victoria: victoriaPartido === 'true' ? true : victoriaPartido === 'false' ? false : null,
          modalidad: modalidad || null,
          partidos_jugados: partidosJugados ? Number(partidosJugados) : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', athleteTournamentId);
      if (updError) {
        setSaving(false);
        setSaveError(`Tu reflexión se guardó, pero el resultado del torneo no: ${updError.message}`);
        return;
      }
    }

    setSaving(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Tu análisis fue enviado a tu coach.</h2>
        <p className="text-gray-500 text-sm">Recibirás retroalimentación pronto.</p>
      </div>
    );
  }

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const textareaClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] resize-none';

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Formulario Post-Torneo</h1>
        <p className="text-gray-500 text-sm">Analiza tu desempeño en cada dimensión.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Metadata del partido */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Partido</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Fecha *</label>
              <input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
              />
            </div>
            <div>
              <label className={labelClass}>Torneo</label>
              <input
                type="text"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                placeholder="ej. Torneo Nacional Junior"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ronda alcanzada{linkedToTournament && ' *'}</label>
              <select
                value={rondaAlcanzada}
                onChange={(e) => setRondaAlcanzada(e.target.value)}
                required={linkedToTournament}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
              >
                <option value="">Seleccionar...</option>
                {RONDAS_TORNEO.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Resultado último partido{linkedToTournament && ' *'}</label>
              <input
                type="text"
                value={resultadoPartido}
                onChange={(e) => setResultadoPartido(e.target.value)}
                placeholder="6-4 3-6 6-3"
                required={linkedToTournament}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>¿Cuántos partidos jugaste en el torneo?{linkedToTournament && ' *'}</label>
            <input
              type="number"
              min="1"
              max="15"
              value={partidosJugados}
              onChange={(e) => setPartidosJugados(e.target.value)}
              placeholder="ej. 4 (incluye qualy)"
              required={linkedToTournament}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
            />
            <p className="text-[11px] text-gray-400 mt-1">Incluye rondas de qualy. Con esto calculamos tu récord de partidos ganados/perdidos.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>¿Ganaste el último partido?</label>
              <div className="flex gap-4 mt-1">
                {[{ value: 'true', label: 'Sí' }, { value: 'false', label: 'No' }].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="victoriaPartido"
                      value={value}
                      checked={victoriaPartido === value}
                      onChange={(e) => setVictoriaPartido(e.target.value)}
                      className="accent-[#1B3A2A]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Modalidad</label>
              <div className="flex gap-4 mt-1">
                {['Individual', 'Dobles', 'Ambas'].map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="modalidad"
                      value={m}
                      checked={modalidad === m}
                      onChange={(e) => setModalidad(e.target.value)}
                      className="accent-[#1B3A2A]"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* A — Golpes bajo presión */}
        <Section title="Golpes bajo presión" letter="A" expanded={expanded.A} onToggle={() => toggle('A')}>
          <div>
            <label className={labelClass}>Derecha</label>
            <ScaleButtons value={derecha} onChange={setDerecha} labels={TECNICA_LABELS} />
          </div>
          <div>
            <label className={labelClass}>Revés</label>
            <ScaleButtons value={reves} onChange={setReves} labels={TECNICA_LABELS} />
          </div>
          <div>
            <label className={labelClass}>Servicio</label>
            <ScaleButtons value={servicio} onChange={setServicio} labels={TECNICA_LABELS} />
          </div>
          <div>
            <label className={labelClass}>Volea</label>
            <ScaleButtons value={volea} onChange={setVolea} labels={TECNICA_LABELS} />
          </div>
          <div>
            <label className={labelClass}>¿Qué diferencia notaste entre cómo ejecutas tus golpes en entrenamiento y cómo lo hiciste en este torneo?</label>
            <textarea className={textareaClass} rows={3} value={comentarioTecnica} onChange={(e) => setComentarioTecnica(e.target.value)}
              placeholder={ph.comentarioTecnica} />
          </div>
          <div>
            <label className={labelClass}>¿Qué notaste en tu ejecución durante el torneo que normalmente no aparece en entrenamiento?</label>
            <textarea className={textareaClass} rows={2} value={mejoraTecnica} onChange={(e) => setMejoraTecnica(e.target.value)}
              placeholder={ph.mejoraTecnica} />
          </div>
        </Section>

        {/* B — Táctica */}
        <Section title="Táctica" letter="B" expanded={expanded.B} onToggle={() => toggle('B')}>
          <div>
            <label className={labelClass}>¿Cómo se relacionó tu plan de juego con lo que realmente pasó en el torneo?</label>
            <textarea className={textareaClass} rows={3} value={comentarioPlan} onChange={(e) => setComentarioPlan(e.target.value)}
              placeholder={ph.comentarioPlan} />
          </div>
          <div>
            <label className={labelClass}>¿Qué pasó en el torneo que no tenías contemplado en tu plan?</label>
            <textarea className={textareaClass} rows={3} value={tacticaFunciono} onChange={(e) => setTacticaFunciono(e.target.value)}
              placeholder={ph.tacticaFunciono} />
          </div>
          <div>
            <label className={labelClass}>¿Qué cambiarías tácticamente de cómo competiste en este torneo?</label>
            <textarea className={textareaClass} rows={3} value={tacticaCambiar} onChange={(e) => setTacticaCambiar(e.target.value)}
              placeholder={ph.tacticaCambiar} />
          </div>
        </Section>

        {/* C — Mental */}
        <Section title="Mental" letter="C" expanded={expanded.C} onToggle={() => toggle('C')}>
          <div>
            <label className={labelClass}>Manejo de presión</label>
            <ScaleButtons value={presion} onChange={setPresion} labels={MENTAL_LABELS} />
          </div>
          <div>
            <label className={labelClass}>¿Qué pasaba por tu cabeza en los momentos más intensos del torneo?</label>
            <textarea className={textareaClass} rows={3} value={concentracion} onChange={(e) => setConcentracion(e.target.value)}
              placeholder={ph.concentracion} />
          </div>
          <div>
            <label className={labelClass}>Nivel de confianza</label>
            <ScaleButtons value={confianza} onChange={setConfianza} labels={MENTAL_LABELS} />
          </div>
          <div>
            <label className={labelClass}>¿Cómo reaccionaste ante errores?</label>
            <select
              value={reaccionError}
              onChange={(e) => setReaccionError(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
            >
              <option value="">Seleccionar...</option>
              <option value="Me recuperé rápido">Me recuperé rápido</option>
              <option value="Me costó un poco">Me costó un poco</option>
              <option value="Me afectó mucho">Me afectó mucho</option>
              <option value="Perdí el control">Perdí el control</option>
            </select>
          </div>
        </Section>

        {/* D — Físico */}
        <Section title="Físico" letter="D" expanded={expanded.D} onToggle={() => toggle('D')}>
          <div>
            <label className={labelClass}>Nivel físico general</label>
            <ScaleButtons value={nivelFisico} onChange={setNivelFisico} labels={FISICO_LABELS} />
          </div>
          <div>
            <label className={labelClass}>¿Sentiste dolor o molestia?</label>
            <div className="flex gap-4 mt-1">
              {['Sí', 'No'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="dolor"
                    value={opt}
                    checked={dolor === opt}
                    onChange={(e) => setDolor(e.target.value)}
                    className="accent-[#1B3A2A]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          {dolor === 'Sí' && (
            <div>
              <label className={labelClass}>¿En qué zona(s)?</label>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-1">
                {[
                  'Hombro der.', 'Hombro izq.',
                  'Codo der.',   'Codo izq.',
                  'Muñeca der.', 'Muñeca izq.',
                  'Espalda alta','Espalda baja (lumbar)',
                  'Cadera',      'Muslo / Isquiotibiales',
                  'Rodilla der.','Rodilla izq.',
                  'Tobillo der.','Tobillo izq.',
                  'Pantorrilla', 'Cuello',
                ].map((zona) => (
                  <label key={zona} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dolorZonas.includes(zona)}
                      onChange={(e) =>
                        setDolorZonas((prev) =>
                          e.target.checked ? [...prev, zona] : prev.filter((z) => z !== zona)
                        )
                      }
                      className="w-4 h-4 accent-[#1B3A2A]"
                    />
                    {zona}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className={labelClass}>¿Cómo respondió tu cuerpo conforme avanzó el torneo?</label>
            <textarea className={textareaClass} rows={3} value={nutricion} onChange={(e) => setNutricion(e.target.value)}
              placeholder={ph.nutricion} />
          </div>
        </Section>

        {/* E — Reflexión */}
        <Section title="Reflexión" letter="E" expanded={expanded.E} onToggle={() => toggle('E')}>
          <div>
            <label className={labelClass}>¿De qué momento de este torneo te sientes más orgulloso?</label>
            <textarea className={textareaClass} rows={3} value={hiceBien} onChange={(e) => setHiceBien(e.target.value)}
              placeholder={ph.hiceBien} />
          </div>
          <div>
            <label className={labelClass}>¿Qué cambiarías de cómo compites si volvieras a jugar este torneo?</label>
            <textarea className={textareaClass} rows={3} value={mejorar} onChange={(e) => setMejorar(e.target.value)}
              placeholder={ph.mejorar} />
          </div>
          <div>
            <label className={labelClass}>¿Qué te llevas de este torneo al siguiente entrenamiento?</label>
            <textarea className={textareaClass} rows={3} value={aprendizaje} onChange={(e) => setAprendizaje(e.target.value)}
              placeholder={ph.aprendizaje} />
          </div>
          <div>
            <label className={labelClass}>¿Qué le dirías a tu yo de antes del torneo si pudieras?</label>
            <textarea className={textareaClass} rows={3} value={proximoTorneo} onChange={(e) => setProximoTorneo(e.target.value)}
              placeholder={ph.proximoTorneo} />
          </div>
          <div>
            <label className={labelClass}>
              Satisfacción general: <span className="font-bold text-[#1B3A2A]">{satisfaccion}</span>
              {' '}<span className="font-normal text-gray-500 italic">— {getSatisfaccionLabel(satisfaccion)}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={satisfaccion}
              onChange={(e) => setSatisfaccion(Number(e.target.value))}
              className="w-full accent-[#1B3A2A]"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1 — No di lo que tenía</span>
              <span>Superé mis expectativas — 10</span>
            </div>
          </div>
        </Section>

        {saveError && (
          <p className="text-sm text-red-600 px-1">{saveError}</p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1B3A2A] hover:bg-[#2D5A3D] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {saving ? 'Guardando…' : 'Enviar análisis al coach'}
        </button>
      </form>
    </div>
  );
}
