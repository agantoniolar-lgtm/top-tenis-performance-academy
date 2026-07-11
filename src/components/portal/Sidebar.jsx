import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Icon, Logo } from './ui';

const COACH_NAV = [
  { id: 'atletas',      label: 'Atletas',     icon: 'users',  path: '/portal/equipo' },
  { id: 'seguimiento',  label: 'Seguimiento', icon: 'check',  path: '/portal/reportes' },
  { id: 'planes',       label: 'Planes',      icon: 'target', path: '/portal/planes' },
  { id: 'torneos',      label: 'Torneos',     icon: 'trophy', path: '/portal/torneos' },
];

const ATLETA_NAV = [
  { id: 'inicio',      label: 'Inicio',         icon: 'home',   path: '/portal/inicio' },
  { id: 'rendimiento', label: 'Mi rendimiento',  icon: 'pulse',  path: '/portal/mi-rendimiento' },
  { id: 'plan',        label: 'Mi plan',         icon: 'target', path: '/portal/mi-plan' },
  { id: 'torneos',     label: 'Mis torneos',     icon: 'trophy', path: '/portal/mis-torneos' },
];

const CONTENT_NAV = [
  { id: 'contenido', label: 'Contenido', icon: 'edit', path: '/portal/contenido' },
];

function getNav(rol) {
  if (rol === 'Atleta')  return ATLETA_NAV;
  if (rol === 'Content') return CONTENT_NAV;
  return COACH_NAV;
}

export default function Sidebar({ open, onClose }) {
  const navigate         = useNavigate();
  const location         = useLocation();
  const { user, logout } = useAuth();

  const NAV = getNav(user?.rol);

  const isActive = (path) => {
    if (path === '/portal/equipo')    return location.pathname.startsWith('/portal/equipo') || location.pathname.startsWith('/portal/alumnos');
    if (path === '/portal/reportes')  return location.pathname === '/portal/reportes';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-[224px] z-50 flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ background: 'var(--green-deep)' }}
      >
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <Logo />
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {NAV.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => { navigate(item.path); onClose?.(); }}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13px] relative transition ${
                  active ? 'text-white' : 'text-white/65 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {active && (
                  <div
                    className="absolute left-0 top-1.5 bottom-1.5 w-[2px]"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
                <Icon name={item.icon} size={16} />
                <span className="flex-1 text-left font-medium tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 court-bg shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold text-white truncate">
                {user?.nombre ?? '—'}
              </div>
              <div className="text-[10px] eyebrow truncate" style={{ color: 'var(--green-soft)' }}>
                {user?.rol ?? 'coach'}
              </div>
            </div>
            <button onClick={logout} className="text-white/45 hover:text-white transition">
              <Icon name="logout" size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
