import { useState } from 'react';
import { ChevronDown, ChevronUp, Send, CheckCircle } from 'lucide-react';

function ScaleButtons({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
            value === n
              ? 'bg-[#1B3A2A] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {n}
        </button>
      ))}
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
  const [expanded, setExpanded] = useState({ A: true, B: false, C: false, D: false, E: false });
  const [submitted, setSubmitted] = useState(false);

  // A - Técnica
  const [derecha, setDerecha] = useState(0);
  const [reves, setReves] = useState(0);
  const [servicio, setServicio] = useState(0);
  const [volea, setVolea] = useState(0);
  const [comentarioTecnica, setComentarioTecnica] = useState('');
  const [mejoraTecnica, setMejoraTecnica] = useState('');

  // B - Táctica
  const [siguioPlan, setSiguioPlan] = useState('');
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
  const [dolorDonde, setDolorDonde] = useState('');
  const [nutricion, setNutricion] = useState('');

  // E - Reflexión
  const [hiceBien, setHiceBien] = useState('');
  const [mejorar, setMejorar] = useState('');
  const [aprendizaje, setAprendizaje] = useState('');
  const [proximoTorneo, setProximoTorneo] = useState('');
  const [satisfaccion, setSatisfaccion] = useState(5);

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e) => {
    e.preventDefault();
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
        {/* A — Técnica */}
        <Section title="Técnica" letter="A" expanded={expanded.A} onToggle={() => toggle('A')}>
          <div>
            <label className={labelClass}>Derecha (1-5)</label>
            <ScaleButtons value={derecha} onChange={setDerecha} />
          </div>
          <div>
            <label className={labelClass}>Revés (1-5)</label>
            <ScaleButtons value={reves} onChange={setReves} />
          </div>
          <div>
            <label className={labelClass}>Servicio (1-5)</label>
            <ScaleButtons value={servicio} onChange={setServicio} />
          </div>
          <div>
            <label className={labelClass}>Volea (1-5)</label>
            <ScaleButtons value={volea} onChange={setVolea} />
          </div>
          <div>
            <label className={labelClass}>Comentarios sobre tu técnica</label>
            <textarea className={textareaClass} rows={3} value={comentarioTecnica} onChange={(e) => setComentarioTecnica(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Aspecto técnico a mejorar</label>
            <textarea className={textareaClass} rows={2} value={mejoraTecnica} onChange={(e) => setMejoraTecnica(e.target.value)} />
          </div>
        </Section>

        {/* B — Táctica */}
        <Section title="Táctica" letter="B" expanded={expanded.B} onToggle={() => toggle('B')}>
          <div>
            <label className={labelClass}>¿Seguiste el plan de juego?</label>
            <div className="flex gap-4 mt-1">
              {['Sí', 'Parcialmente', 'No'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="siguioPlan"
                    value={opt}
                    checked={siguioPlan === opt}
                    onChange={(e) => setSiguioPlan(e.target.value)}
                    className="accent-[#1B3A2A]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Comentarios sobre el plan</label>
            <textarea className={textareaClass} rows={3} value={comentarioPlan} onChange={(e) => setComentarioPlan(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>¿Qué tácticas funcionaron?</label>
            <textarea className={textareaClass} rows={3} value={tacticaFunciono} onChange={(e) => setTacticaFunciono(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>¿Qué cambiarías tácticamente?</label>
            <textarea className={textareaClass} rows={3} value={tacticaCambiar} onChange={(e) => setTacticaCambiar(e.target.value)} />
          </div>
        </Section>

        {/* C — Mental */}
        <Section title="Mental" letter="C" expanded={expanded.C} onToggle={() => toggle('C')}>
          <div>
            <label className={labelClass}>Manejo de presión (1-5)</label>
            <ScaleButtons value={presion} onChange={setPresion} />
          </div>
          <div>
            <label className={labelClass}>¿Cómo estuvo tu concentración?</label>
            <textarea className={textareaClass} rows={3} value={concentracion} onChange={(e) => setConcentracion(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Nivel de confianza (1-5)</label>
            <ScaleButtons value={confianza} onChange={setConfianza} />
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
            <label className={labelClass}>Nivel físico general (1-5)</label>
            <ScaleButtons value={nivelFisico} onChange={setNivelFisico} />
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
              <label className={labelClass}>¿Dónde?</label>
              <input
                value={dolorDonde}
                onChange={(e) => setDolorDonde(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
              />
            </div>
          )}
          <div>
            <label className={labelClass}>¿Cómo fue tu alimentación e hidratación?</label>
            <textarea className={textareaClass} rows={3} value={nutricion} onChange={(e) => setNutricion(e.target.value)} />
          </div>
        </Section>

        {/* E — Reflexión */}
        <Section title="Reflexión" letter="E" expanded={expanded.E} onToggle={() => toggle('E')}>
          <div>
            <label className={labelClass}>¿Qué hiciste bien?</label>
            <textarea className={textareaClass} rows={3} value={hiceBien} onChange={(e) => setHiceBien(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>¿Qué puedes mejorar?</label>
            <textarea className={textareaClass} rows={3} value={mejorar} onChange={(e) => setMejorar(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>¿Cuál fue tu mayor aprendizaje?</label>
            <textarea className={textareaClass} rows={3} value={aprendizaje} onChange={(e) => setAprendizaje(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>¿Qué harás diferente en el próximo torneo?</label>
            <textarea className={textareaClass} rows={3} value={proximoTorneo} onChange={(e) => setProximoTorneo(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Satisfacción general (1-10): <span className="font-bold text-[#1B3A2A]">{satisfaccion}</span></label>
            <input
              type="range"
              min={1}
              max={10}
              value={satisfaccion}
              onChange={(e) => setSatisfaccion(Number(e.target.value))}
              className="w-full accent-[#1B3A2A]"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        </Section>

        <button
          type="submit"
          className="w-full bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Enviar análisis al coach
        </button>
      </form>
    </div>
  );
}
