import { useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle, Loader2, Globe } from 'lucide-react';

const niveles = [
  'Principiante',
  'Intermedio',
  'Avanzado',
  'Competitivo (AMTP / UTR)',
  'Alto rendimiento (ITF Junior)',
];

const turnosOptions = ['Matutino (9-12)', 'Vespertino (16-19)'];
const sedesOptions = ['Casa Blanca Lomas Verdes'];

const initialForm = {
  nombreJugador: '',
  edad: '',
  anosJugando: '',
  nivel: '',
  turnos: [],
  sedes: [],
  nombrePadre: '',
  whatsapp: '',
  email: '',
  mensaje: '',
};

export default function Contacto() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative w-full h-[300px] bg-[#1B3A2A] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-6">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold text-white">
            Contacto
          </h1>
          <p className="text-gray-300 mt-4 text-lg">Agenda tu evaluaci&oacute;n en cancha.</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form — 2 cols */}
            <div className="lg:col-span-2">
              {success ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
                  <CheckCircle size={56} className="text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                    &iexcl;Recibimos tu solicitud!
                  </h2>
                  <p className="text-gray-600">
                    Te contactaremos en menos de 24 horas por WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1A1A1A] mb-2">
                    Solicitud de evaluaci&oacute;n
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Completa el formulario y te contactaremos por WhatsApp.
                  </p>

                  {/* Nombre jugador */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                      Nombre del jugador
                    </label>
                    <input
                      type="text"
                      name="nombreJugador"
                      value={form.nombreJugador}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
                    />
                  </div>

                  {/* Edad + Anos jugando */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                        Edad
                      </label>
                      <input
                        type="number"
                        name="edad"
                        value={form.edad}
                        onChange={handleChange}
                        required
                        min="5"
                        max="25"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                        A&ntilde;os jugando tenis
                      </label>
                      <input
                        type="number"
                        name="anosJugando"
                        value={form.anosJugando}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
                      />
                    </div>
                  </div>

                  {/* Nivel */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                      Nivel actual
                    </label>
                    <select
                      name="nivel"
                      value={form.nivel}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] bg-white"
                    >
                      <option value="">Selecciona un nivel</option>
                      {niveles.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Turnos */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                      Turno de inter&eacute;s
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {turnosOptions.map((t) => (
                        <label
                          key={t}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition text-sm ${
                            form.turnos.includes(t)
                              ? 'bg-[#1B3A2A] text-white border-[#1B3A2A]'
                              : 'bg-white text-[#1A1A1A] border-gray-300 hover:border-[#1B3A2A]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={form.turnos.includes(t)}
                            onChange={() => handleCheckbox('turnos', t)}
                            className="sr-only"
                          />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sedes */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                      Sede
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {sedesOptions.map((s) => (
                        <label
                          key={s}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition text-sm ${
                            form.sedes.includes(s)
                              ? 'bg-[#1B3A2A] text-white border-[#1B3A2A]'
                              : 'bg-white text-[#1A1A1A] border-gray-300 hover:border-[#1B3A2A]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={form.sedes.includes(s)}
                            onChange={() => handleCheckbox('sedes', s)}
                            className="sr-only"
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Nombre padre */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                      Nombre del padre/madre/tutor
                    </label>
                    <input
                      type="text"
                      name="nombrePadre"
                      value={form.nombrePadre}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
                    />
                  </div>

                  {/* WhatsApp + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={form.whatsapp}
                        onChange={handleChange}
                        required
                        placeholder="56 1234 5678"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
                      />
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                      Mensaje adicional (opcional)
                    </label>
                    <textarea
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Cu&eacute;ntanos m&aacute;s sobre los objetivos del jugador..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto rounded-md px-8 py-3 font-semibold transition bg-[#8B4513] text-white hover:bg-[#A0522D] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {loading ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                </form>
              )}
            </div>

            {/* Info sidebar */}
            <div>
              <div className="bg-[#F8F6F2] rounded-xl p-8 sticky top-24">
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-6">
                  Informaci&oacute;n de contacto
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-[#1A1A1A]">Sede</p>
                      <p className="text-gray-600 text-sm">
                        Casa Blanca, Lomas Verdes, Naucalpan, Estado de M&eacute;xico
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-[#1A1A1A]">WhatsApp</p>
                      <a
                        href="https://wa.me/5256400804070"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8B4513] text-sm hover:underline"
                      >
                        56 4008 0470
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-[#1A1A1A]">Email</p>
                      <a
                        href="mailto:info@toptenispa.mx"
                        className="text-[#8B4513] text-sm hover:underline"
                      >
                        info@toptenispa.mx
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe size={20} className="text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-[#1A1A1A]">Redes sociales</p>
                      <a
                        href="https://instagram.com/toptenismx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8B4513] text-sm hover:underline"
                      >
                        @toptenismx
                      </a>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-gray-200" />

                <p className="text-gray-500 text-xs leading-relaxed">
                  Respondemos todas las solicitudes en menos de 24 horas por WhatsApp. Si prefieres, escr&iacute;benos directamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
