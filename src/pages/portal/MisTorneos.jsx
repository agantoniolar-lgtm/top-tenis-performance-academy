import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
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

  if (loading) return <Shell><p className="text-[var(--ink-mute)] text-sm">Cargando…</p></Shell>;
  if (error)   return <Shell><p className="text-red-500 text-sm">Error: {error}</p></Shell>;

  return (
    <Shell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[28px] leading-none">Torneos</h1>
          <p className="text-[12px] font-mono text-[var(--ink-mute)] mt-1">
            {torneos.length} registrados · historial y PTFs
          </p>
        </div>
        <Link
          to="/portal/torneos/nuevo"
          className="px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white hover:opacity-90 transition"
          style={{ background: 'var(--accent)' }}
        >
          + Subir resultado
        </Link>
      </div>

      {torneos.length === 0 ? (
        <div className="hairline bg-[var(--paper)] p-12 text-center">
          <p className="text-[13px] text-[var(--ink-mute)]">Aún no has registrado ningún torneo.</p>
        </div>
      ) : (
        <div className="hairline bg-[var(--paper)]">
          <table className="w-full text-[13px]">
            <thead className="eyebrow text-[10px]" style={{ background: 'var(--cream)', color: 'var(--ink-mute)' }}>
              <tr>
                <th className="text-left px-5 py-3">Torneo</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Fecha</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Ronda</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Resultado</th>
                <th className="text-right px-5 py-3">PTF</th>
              </tr>
            </thead>
            <tbody>
              {torneos.map((t) => {
                const ptfDone = t.post_tournament_forms?.length > 0;
                return (
                  <tr key={t.id} className="hairline-t hover:bg-[var(--cream)] transition">
                    <td className="px-5 py-4">
                      <div className="font-display font-bold text-[14px]">{t.tournaments?.nombre}</div>
                      {(t.tournaments?.tipo || t.tournaments?.categoria || t.tournaments?.sede) && (
                        <div className="text-[10px] font-mono text-[var(--ink-mute)] mt-0.5">
                          {[t.tournaments?.tipo, t.tournaments?.categoria, t.tournaments?.sede].filter(Boolean).join(' · ')}
                        </div>
                      )}
                      {/* Info extra solo en mobile */}
                      <div className="sm:hidden text-[10px] font-mono mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                        {t.tournaments?.fecha && (
                          <span style={{ color: 'var(--ink-mute)' }}>
                            {new Date(t.tournaments.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                        {t.ronda && (
                          <span style={{ color: 'var(--ink-mute)' }}>{t.ronda}</span>
                        )}
                        {t.victoria !== null && (
                          <span style={{ color: t.victoria ? 'var(--good)' : 'var(--bad)' }}>
                            {t.victoria ? 'Victoria' : 'Derrota'}{t.resultado ? ` ${t.resultado}` : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell font-mono text-[11px] text-[var(--ink-mute)]">
                      {t.tournaments?.fecha
                        ? new Date(t.tournaments.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      {t.ronda || '—'}
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      {t.victoria !== null ? (
                        <span className="tag text-[10px]" style={{
                          background: t.victoria ? 'rgba(22,163,74,.1)' : 'rgba(220,38,38,.08)',
                          color: t.victoria ? 'var(--good)' : 'var(--bad)',
                        }}>
                          {t.victoria ? 'Victoria' : 'Derrota'}{t.resultado ? ` ${t.resultado}` : ''}
                        </span>
                      ) : (
                        <span className="text-[11px]" style={{ color: 'var(--ink-mute)' }}>{t.resultado || '—'}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {ptfDone ? (
                        <Link to={`/portal/post-torneo/${t.id}`}
                              className="inline-flex items-center gap-1 tag text-[10px]"
                              style={{ background: 'rgba(22,163,74,.1)', color: 'var(--good)' }}>
                          <CheckCircle className="w-3 h-3" /> Completado
                        </Link>
                      ) : (
                        <Link to={`/portal/post-torneo/${t.id}`}
                              className="inline-flex items-center gap-1 tag text-[10px] animate-pulse"
                              style={{ background: 'rgba(234,179,8,.1)', color: '#92400e' }}>
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
      )}
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}
