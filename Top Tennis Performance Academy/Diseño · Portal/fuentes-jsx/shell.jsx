// shell.jsx — Portal shell: sidebar, topbar, roster list

const { useState: useStateShell } = React;

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, role, user }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard',  icon: 'home',   role: ['coach','admin','atleta','padre','especialista'] },
    { id: 'atletas',   label: 'Atletas',    icon: 'users',  role: ['coach','admin','especialista'], count: 28 },
    { id: 'reportes',  label: 'Reportes',   icon: 'file',   role: ['coach','admin','atleta','padre','especialista'], count: 12 },
    { id: 'torneos',   label: 'Torneos',    icon: 'trophy', role: ['coach','admin','atleta','padre'] },
    { id: 'ejercicios', label: 'Ejercicios', icon: 'pulse', role: ['coach','admin','atleta'] },
    { id: 'talent',    label: 'Talent Cards', icon: 'sparkle', role: ['coach','admin'], count: 6 },
    { id: 'especialistas', label: 'Especialistas', icon: 'flask', role: ['coach','admin'] },
  ];
  return (
    <aside className="w-[224px] shrink-0 text-white flex flex-col h-screen sticky top-0"
           style={{ background: 'var(--green-deep)' }}>
      <div className="px-5 py-5 hairline-b" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
        <Logo />
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {items.filter(it => it.role.includes(role)).map(it => {
          const isActive = active === it.id;
          return (
            <button key={it.id} onClick={() => onNav(it.id)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13px] relative transition ${
                isActive ? 'text-white' : 'text-white/65 hover:text-white hover:bg-white/[0.03]'
              }`}>
              {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px]" style={{ background: 'var(--accent)' }} />}
              <Icon name={it.icon} size={16} />
              <span className="flex-1 text-left font-medium tracking-tight">{it.label}</span>
              {it.count != null && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: isActive ? 'var(--accent)' : 'rgba(255,255,255,.08)', color: 'white' }}>
                  {it.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      {/* Footer */}
      <div className="px-5 py-4 hairline-t" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 court-bg shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold truncate">{user.name}</div>
            <div className="text-[10px] eyebrow text-white/45 truncate" style={{ color: 'var(--green-soft)' }}>{user.role}</div>
          </div>
          <button className="text-white/45 hover:text-white">
            <Icon name="logout" size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─── Topbar ──────────────────────────────────────────────────────────────────
function Topbar({ crumbs, role, onRoleChange }) {
  return (
    <header className="h-[60px] bg-[var(--paper)] hairline-b flex items-center px-6 sticky top-0 z-30">
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--ink-soft)]">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Icon name="chevRight" size={12} className="text-[var(--ink-mute)]" />}
            <span className={i === crumbs.length - 1 ? 'text-[var(--ink)] font-semibold' : 'hover:text-[var(--ink)] cursor-pointer'}>
              {c}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Search */}
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 h-8 hairline w-[260px] text-[12px] text-[var(--ink-mute)]">
          <Icon name="search" size={14} />
          <span>Buscar atleta, torneo, reporte…</span>
          <span className="ml-auto font-mono text-[10px] px-1 py-0.5" style={{ background: 'var(--cream)' }}>⌘K</span>
        </div>
        {/* Role switcher (Tweaks alternative) */}
        <div className="hidden lg:flex items-center hairline h-8 overflow-hidden">
          <div className="px-2.5 eyebrow text-[var(--ink-mute)]">VER COMO</div>
          {['coach', 'admin', 'atleta', 'padre'].map(r => (
            <button key={r} onClick={() => onRoleChange(r)}
              className={`px-2.5 h-full text-[11px] uppercase font-semibold tracking-wider transition ${
                role === r ? 'text-white' : 'text-[var(--ink-mute)] hover:text-[var(--ink)]'
              }`}
              style={role === r ? { background: 'var(--accent)' } : {}}>
              {r}
            </button>
          ))}
        </div>
        <button className="w-8 h-8 flex items-center justify-center hairline text-[var(--ink-soft)] hover:text-[var(--ink)] relative">
          <Icon name="bell" size={15} />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center hairline text-[var(--ink-soft)] hover:text-[var(--ink)]">
          <Icon name="settings" size={15} />
        </button>
      </div>
    </header>
  );
}

// ─── Roster panel (athletes list) ────────────────────────────────────────────
function RosterPanel({ selectedId, onSelect }) {
  const [q, setQ] = useStateShell('');
  const [sort, setSort] = useStateShell('utr');
  const filtered = ROSTER.filter(a => a.nombre.toLowerCase().includes(q.toLowerCase()));
  filtered.sort((a, b) => sort === 'utr' ? b.utr - a.utr : a.nombre.localeCompare(b.nombre));

  return (
    <aside className="w-[300px] shrink-0 bg-[var(--paper)] hairline-b h-[calc(100vh-60px)] sticky top-[60px] overflow-y-auto"
           style={{ borderRight: '1px solid var(--line)' }}>
      <div className="px-4 py-3 hairline-b sticky top-0 bg-[var(--paper)] z-10">
        <div className="flex items-center justify-between mb-2">
          <Eyebrow>Atletas <span className="font-mono text-[var(--ink)]">·  {ROSTER.length}</span></Eyebrow>
          <button className="text-[10px] font-mono uppercase text-[var(--accent)] hover:underline">+ Nuevo</button>
        </div>
        <div className="flex items-center gap-2 px-2 h-8 hairline text-[12px]">
          <Icon name="search" size={13} className="text-[var(--ink-mute)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…"
                 className="flex-1 outline-none placeholder:text-[var(--ink-mute)]" />
        </div>
        <div className="flex gap-1 mt-2">
          {[
            { id: 'utr',  label: 'UTR ↓' },
            { id: 'name', label: 'A–Z' },
          ].map(s => (
            <button key={s.id} onClick={() => setSort(s.id)}
                    className={`text-[10px] font-mono uppercase px-2 py-1 transition ${
                      sort === s.id ? 'text-white' : 'text-[var(--ink-mute)] hover:text-[var(--ink)]'
                    }`}
                    style={sort === s.id ? { background: 'var(--ink)' } : { background: 'var(--cream)' }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        {filtered.map(a => {
          const isActive = a.id === selectedId;
          return (
            <button key={a.id} onClick={() => onSelect(a.id)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 hairline-b transition ${
                isActive ? '' : 'hover:bg-[var(--cream)]'
              }`}
              style={isActive ? { background: 'var(--cream)', borderLeft: '2px solid var(--accent)' } : { borderLeft: '2px solid transparent' }}>
              <div className="w-10 h-10 court-bg shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-display font-bold text-[13px] truncate">{a.nombre}</div>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-[var(--ink-mute)]">{a.id}</span>
                  <span className="text-[10px] font-mono text-[var(--ink-mute)]">·</span>
                  <span className="text-[10px] font-mono text-[var(--ink-mute)]">{a.cat}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-num font-black text-[18px] leading-none tnum"
                     style={{ color: isActive ? 'var(--accent)' : 'var(--ink)' }}>{a.utr.toFixed(1)}</div>
                <div className="text-[9px] eyebrow text-[var(--ink-mute)] mt-0.5">UTR</div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

Object.assign(window, { Sidebar, Topbar, RosterPanel });
