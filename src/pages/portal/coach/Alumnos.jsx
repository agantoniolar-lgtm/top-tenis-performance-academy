import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { calcCat } from '../../../lib/athletics.js';

export default function Alumnos() {
  const { user }           = useAuth();
  const navigate           = useNavigate();
  const [athletes, set]    = useState([]);
  const [loading, setLoad] = useState(true);
  const [error,   setErr]  = useState(null);

  useEffect(() => {
    if (!user?.coach_id) return;
    supabase
      .from('athletes')
      .select('id, nombre, apellido, fecha_nacimiento, mano_dominante, fecha_ingreso, utr_actual')
      .eq('coach_id', user.coach_id)
      .eq('activo', true)
      .order('utr_actual', { ascending: false })
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else set(data ?? []);
        setLoad(false);
      });
  }, [user?.coach_id]);

  if (loading) return <Shell><p className="text-[var(--ink-mute)] text-sm">Cargando…</p></Shell>;
  if (error)   return <Shell><p className="text-red-500 text-sm">Error: {error}</p></Shell>;

  return (
    <Shell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[28px] leading-none">Atletas</h1>
          <p className="text-[12px] font-mono text-[var(--ink-mute)] mt-1">
            {athletes.length} activos · {user?.nombre}
          </p>
        </div>
        <button
          onClick={() => navigate('/portal/reportes/nuevo')}
          className="px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition hover:opacity-90"
          style={{ background: 'var(--accent)' }}>
          + Nuevo reporte
        </button>
      </div>

      {athletes.length === 0 ? (
        <p className="text-[var(--ink-mute)] text-sm">Sin atletas registrados.</p>
      ) : (
        <div className="hairline bg-[var(--paper)]">
          <table className="w-full text-[13px]">
            <thead className="eyebrow text-[10px]" style={{ background: 'var(--cream)', color: 'var(--ink-mute)' }}>
              <tr>
                <th className="text-left px-5 py-3">Atleta</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Cat.</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Mano</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Ingreso</th>
                <th className="text-right px-5 py-3">UTR</th>
              </tr>
            </thead>
            <tbody>
              {athletes.map((a) => (
                <tr
                  key={a.id}
                  className="hairline-t hover:bg-[var(--cream)] cursor-pointer transition"
                  onClick={() => navigate(`/portal/alumnos/${a.id}`)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 court-bg shrink-0" />
                      <div>
                        <div className="font-display font-bold text-[14px]">{a.nombre} {a.apellido}</div>
                        <div className="text-[10px] font-mono text-[var(--ink-mute)] mt-0.5">{calcCat(a.fecha_nacimiento)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="tag" style={{ background: 'var(--cream)', color: 'var(--ink-soft)' }}>
                      {calcCat(a.fecha_nacimiento)}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-[12px] text-[var(--ink-soft)] capitalize">
                    {a.mano_dominante ?? '—'}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell font-mono text-[11px] text-[var(--ink-mute)]">
                    {a.fecha_ingreso
                      ? new Date(a.fecha_ingreso).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' })
                      : '—'}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="font-num font-black text-[22px] tnum leading-none">
                      {a.utr_actual ? Number(a.utr_actual).toFixed(1) : '—'}
                    </div>
                    <div className="text-[9px] eyebrow text-[var(--ink-mute)]">UTR</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="flex-1 p-8 portal-layout">{children}</div>;
}
