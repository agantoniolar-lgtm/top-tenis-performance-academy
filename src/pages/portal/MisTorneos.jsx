import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Clock, CheckCircle, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function MisTorneos() {
  const { user } = useAuth();
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTorneos() {
      if (!user?.athlete_id) { setLoading(false); return; }

      const { data, error: err } = await supabase
        .from('athlete_tournaments')
        .select(`
          id,
          modalidad,
          ronda,
          resultado,
          victoria,
          created_at,
          tournaments (nombre, tipo, categoria, fecha, sede),
          post_tournament_forms (id)
        `)
        .eq('athlete_id', user.athlete_id)
        .order('created_at', { ascending: false });

      setLoading(false);
      if (err) { setError(err.message); return; }
      setTorneos(data || []);
    }
    fetchTorneos();
  }, [user?.athlete_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        Cargando torneos…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 px-1 py-4">Error: {error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Torneos</h1>
        <p className="text-gray-500">Historial de torneos y formularios post-torneo.</p>
      </div>

      {torneos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aún no has registrado ningún torneo.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Torneo</th>
                  <th className="text-left px-5 py-3 font-medium">Fecha</th>
                  <th className="text-left px-5 py-3 font-medium">Ronda</th>
                  <th className="text-left px-5 py-3 font-medium">Resultado</th>
                  <th className="text-left px-5 py-3 font-medium">PTF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {torneos.map((t) => {
                  const ptfCompletado = t.post_tournament_forms?.length > 0;
                  return (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-[#8B4513]" />
                          <span className="font-medium text-gray-800">{t.tournaments?.nombre}</span>
                        </div>
                        {t.tournaments?.tipo && (
                          <span className="text-xs text-gray-400 ml-6">{t.tournaments.tipo} · {t.tournaments.categoria}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {t.tournaments?.fecha
                          ? new Date(t.tournaments.fecha + 'T12:00:00').toLocaleDateString('es-MX', { month: 'short', year: 'numeric', day: 'numeric' })
                          : '—'}
                      </td>
                      <td className="px-5 py-4 text-gray-600">{t.ronda || '—'}</td>
                      <td className="px-5 py-4">
                        {t.victoria !== null ? (
                          <span
                            className={`inline-block text-xs font-semibold px-2.5 py-1 rounded ${
                              t.victoria ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {t.victoria ? 'Victoria' : 'Derrota'}{t.resultado ? ` ${t.resultado}` : ''}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">{t.resultado || '—'}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {ptfCompletado ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" /> Completado
                          </span>
                        ) : (
                          <Link
                            to={`/portal/post-torneo/${t.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-700 animate-pulse hover:bg-amber-200 transition-colors"
                          >
                            <Clock className="w-3 h-3" /> Pendiente
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {torneos.map((t) => {
              const ptfCompletado = t.post_tournament_forms?.length > 0;
              return (
                <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-[#8B4513]" />
                    <span className="font-medium text-gray-800">{t.tournaments?.nombre}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    {t.tournaments?.fecha
                      ? new Date(t.tournaments.fecha + 'T12:00:00').toLocaleDateString('es-MX', { month: 'short', year: 'numeric', day: 'numeric' })
                      : ''}
                    {t.ronda ? ` — ${t.ronda}` : ''}
                  </p>
                  <div className="flex items-center gap-2">
                    {t.victoria !== null && (
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded ${
                          t.victoria ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {t.victoria ? 'Victoria' : 'Derrota'}
                      </span>
                    )}
                    {ptfCompletado ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" /> PTF Completado
                      </span>
                    ) : (
                      <Link
                        to={`/portal/post-torneo/${t.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-700 animate-pulse"
                      >
                        <Clock className="w-3 h-3" /> PTF Pendiente
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* FAB */}
      <Link
        to="/portal/torneos/nuevo"
        className="fixed bottom-8 right-8 bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white rounded-full p-4 shadow-lg transition-colors flex items-center gap-2 z-10"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Subir resultado</span>
      </Link>
    </div>
  );
}
