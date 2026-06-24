import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
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

  if (loading) return <Shell><p className="text-[var(--ink-mute)] text-sm">Cargando…</p></Shell>;
  if (error)   return <Shell><p className="text-red-500 text-sm">Error: {error}</p></Shell>;

  return (
    <Shell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[28px] leading-none">Torneos</h1>
          <p className="text-[12px] font-mono text-[var(--ink-mute)] mt-1">
            {torneos.length} torneos · historial de participaciones y PTFs
          </p>
        </div>
        <Link
          to="/portal/torneos/registrar"
          className="px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white hover:opacity-90 transition"
          style={{ background: 'var(--accent)' }}
        >
          + Registrar torneo
        </Link>
      </div>

      {torneos.length === 0 ? (
        <div className="hairline bg-[var(--paper)] p-12 text-center">
          <p className="text-[13px] text-[var(--ink-mute)]">Sin torneos registrados.</p>
          <Link to="/portal/torneos/registrar"
                className="mt-3 inline-block text-[12px] font-semibold hover:underline"
                style={{ color: 'var(--accent)' }}>
            Registrar el primero
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {torneos.map((t) => {
            const total       = t.athlete_tournaments.length;
            const completados = t.athlete_tournaments.filter(at => at.post_tournament_forms?.length > 0).length;
            const meta = [
              t.tipo,
              t.categoria,
              t.fecha ? new Date(t.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
              t.sede,
            ].filter(Boolean).join(' · ');

            return (
              <div key={t.id} className="hairline bg-[var(--paper)]">
                {/* Header del torneo */}
                <div className="px-5 py-4 hairline-b flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display font-bold text-[16px]">{t.nombre}</div>
                    {meta && (
                      <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--ink-mute)' }}>
                        {meta}
                      </div>
                    )}
                  </div>
                  <span className="tag text-[10px] shrink-0"
                        style={{ background: 'var(--cream)', color: 'var(--ink-soft)' }}>
                    {completados}/{total} PTF
                  </span>
                </div>

                {/* Lista de atletas */}
                {total === 0 ? (
                  <p className="px-5 py-3 text-[12px]" style={{ color: 'var(--ink-mute)' }}>
                    Sin atletas registrados.
                  </p>
                ) : (
                  t.athlete_tournaments.map((at) => {
                    const ptfDone = at.post_tournament_forms?.length > 0;
                    return (
                      <div key={at.id} className="flex items-center justify-between px-5 py-3 hairline-t">
                        <span className="text-[13px]">
                          {at.athletes?.apellido}, {at.athletes?.nombre}
                        </span>
                        {ptfDone ? (
                          <span className="inline-flex items-center gap-1 tag text-[10px]"
                                style={{ background: 'rgba(22,163,74,.1)', color: 'var(--good)' }}>
                            <CheckCircle className="w-3 h-3" /> Completado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 tag text-[10px]"
                                style={{ background: 'rgba(234,179,8,.1)', color: '#92400e' }}>
                            <Clock className="w-3 h-3" /> Pendiente
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}
