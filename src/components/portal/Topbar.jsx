import { usePortal } from '../../contexts/PortalContext';
import { Icon } from './ui';

const ROLES = ['coach', 'admin', 'atleta', 'padre'];

export default function Topbar({ crumbs }) {
  const { role, setRole } = usePortal();

  return (
    <header
      className="h-[60px] bg-[var(--paper)] hairline-b flex items-center px-6 sticky top-0 z-30"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--ink-soft)]">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <Icon name="chevRight" size={12} className="text-[var(--ink-mute)]" />}
            <span className={i === crumbs.length - 1 ? 'text-[var(--ink)] font-semibold' : ''}>
              {c}
            </span>
          </span>
        ))}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 h-8 hairline w-[260px] text-[12px] text-[var(--ink-mute)]">
          <Icon name="search" size={14} />
          <span>Buscar atleta, torneo, reporte…</span>
          <span className="ml-auto font-mono text-[10px] px-1 py-0.5" style={{ background: 'var(--cream)' }}>⌘K</span>
        </div>

        {/* Role switcher */}
        <div className="hidden lg:flex items-center hairline h-8 overflow-hidden">
          <div className="px-2.5 eyebrow text-[var(--ink-mute)]">VER COMO</div>
          {ROLES.map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-2.5 h-full text-[11px] uppercase font-semibold tracking-wider transition ${
                role === r ? 'text-white' : 'text-[var(--ink-mute)] hover:text-[var(--ink)]'
              }`}
              style={role === r ? { background: 'var(--accent)' } : {}}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Bell */}
        <button className="w-8 h-8 flex items-center justify-center hairline text-[var(--ink-soft)] hover:text-[var(--ink)] relative">
          <Icon name="bell" size={15} />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
        </button>

        {/* Settings */}
        <button className="w-8 h-8 flex items-center justify-center hairline text-[var(--ink-soft)] hover:text-[var(--ink)]">
          <Icon name="settings" size={15} />
        </button>
      </div>
    </header>
  );
}
