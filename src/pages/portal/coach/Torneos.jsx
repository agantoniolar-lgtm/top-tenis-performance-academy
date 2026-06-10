import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Plus, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function Torneos() {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('tournaments')
      .select(`
        id, nombre, tipo, categoria, fecha, sede,
        athlete_tournaments (
          id,
          athletes (nombre, apellido),
          post_tournament_forms (id)
        )
      `)
      .order('fecha', { ascending: false })
      .then(({ data, error: err }) => {
        setLoading(false);
        if (err) { setError(err.message); return; }
        setTorneos(data || []);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Cargando torneos…</div>;
  }
  if (error) {
    return <div className="text-sm text-red-600 px-1 py-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Torneos</h1>
          <p className="text-gray-500 text-sm">Historial de participaciones y estado de PTFs.</p>
        </div>
        <Link
          to="/portal/torneos/registrar"
          className="inline-flex items-center gap-2 bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Registrar torneo
        </Link>
      </div>

      {torneos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aún no hay torneos registrados.</p>
          <Link to="/portal/torneos/registrar" className="mt-3 inline-block text-sm font-medium text-[#1B3A2A] hover:underline">
            Registrar el primero
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {torneos.map((t) => {
            const completados = t.athlete_tournaments.filter(at => at.post_tournament_forms?.length > 0).length;
            const total = t.athlete_tournaments.length;
            return (
              <div key={t.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Cabecera del torneo */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-[#8B4513] shrink-0" />
                    <div>
                      <h2 className="font-semibold text-gray-800">{t.nombre}</h2>
                      <p className="text-xs text-gray-400">
                        {t.tipo && `${t.tipo} · `}{t.categoria && `${t.categoria} · `}
                        {t.fecha
                          ? new Date(t.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
                          : ''}
                        {t.sede ? ` · ${t.sede}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-600">
                    {completados}/{total} PTF
                  </span>
                </div>

                {/* Lista de atletas */}
                {total === 0 ? (
                  <p className="px-5 py-3 text-xs text-gray-400">Sin atletas registrados.</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {t.athlete_tournaments.map((at) => {
                      const ptfDone = at.post_tournament_forms?.length > 0;
                      return (
                        <div key={at.id} className="flex items-center justify-between px-5 py-3">
                          <span className="text-sm text-gray-700">
                            {at.athletes?.apellido}, {at.athletes?.nombre}
                          </span>
                          {ptfDone ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" /> PTF completado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-700">
                              <Clock className="w-3 h-3" /> PTF pendiente
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
