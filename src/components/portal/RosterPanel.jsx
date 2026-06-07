import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROSTER } from '../../data/athletes';
import { usePortal } from '../../contexts/PortalContext';
import { Icon, Eyebrow } from './ui';

export default function RosterPanel() {
  const [q,    setQ]    = useState('');
  const [sort, setSort] = useState('utr');
  const { athleteId, setAthleteId } = usePortal();
  const navigate = useNavigate();

  const filtered = ROSTER.filter(a => a.nombre.toLowerCase().includes(q.toLowerCase()));
  filtered.sort((a, b) => sort === 'utr' ? b.utr - a.utr : a.nombre.localeCompare(b.nombre));

  const select = (id) => {
    setAthleteId(id);
    navigate(`/portal/alumnos/${id}`);
  };

  return (
    <aside
      className="w-[300px] shrink-0 bg-[var(--paper)] h-[calc(100vh-60px)] sticky top-[60px] overflow-y-auto"
      style={{ borderRight: '1px solid var(--line)' }}
    >
      {/* Header */}
      <div className="px-4 py-3 hairline-b sticky top-0 bg-[var(--paper)] z-10">
        <div className="flex items-center justify-between mb-2">
          <Eyebrow>
            Atletas <span className="font-mono text-[var(--ink)]">· {ROSTER.length}</span>
          </Eyebrow>
          <button className="text-[10px] font-mono uppercase text-[var(--accent)] hover:underline">
            + Nuevo
          </button>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 px-2 h-8 hairline text-[12px]">
          <Icon name="search" size={13} className="text-[var(--ink-mute)]" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar…"
            className="flex-1 outline-none placeholder:text-[var(--ink-mute)] bg-transparent"
          />
        </div>
        {/* Sort */}
        <div className="flex gap-1 mt-2">
          {[{ id: 'utr', label: 'UTR ↓' }, { id: 'name', label: 'A–Z' }].map(s => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className="text-[10px] font-mono uppercase px-2 py-1 transition"
              style={sort === s.id
                ? { background: 'var(--ink)', color: 'white' }
                : { background: 'var(--cream)', color: 'var(--ink-mute)' }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div>
        {filtered.map(a => {
          const active = a.id === athleteId;
          return (
            <button
              key={a.id}
              onClick={() => select(a.id)}
              className="w-full text-left flex items-center gap-3 px-4 py-3 hairline-b transition"
              style={active
                ? { background: 'var(--cream)', borderLeft: '2px solid var(--accent)' }
                : { borderLeft: '2px solid transparent' }}
            >
              <div className="w-10 h-10 court-bg shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-display font-bold text-[13px] truncate">{a.nombre}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-[var(--ink-mute)]">{a.id}</span>
                  <span className="text-[10px] font-mono text-[var(--ink-mute)]">·</span>
                  <span className="text-[10px] font-mono text-[var(--ink-mute)]">{a.cat}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div
                  className="font-num font-black text-[18px] leading-none tnum"
                  style={{ color: active ? 'var(--accent)' : 'var(--ink)' }}
                >
                  {a.utr.toFixed(1)}
                </div>
                <div className="text-[9px] eyebrow text-[var(--ink-mute)] mt-0.5">UTR</div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
