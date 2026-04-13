import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Trophy,
  ClipboardList,
  Dumbbell,
  User,
  Users,
  FilePlus,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const mainNav = [
  { to: '/portal', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/portal/torneos', icon: Trophy, label: 'Mis Torneos' },
  { to: '/portal/reportes', icon: ClipboardList, label: 'Mis Reportes' },
  { to: '/portal/ejercicios', icon: Dumbbell, label: 'Ejercicios' },
  { to: '/portal/perfil', icon: User, label: 'Mi Perfil' },
];

const coachNav = [
  { to: '/portal/alumnos', icon: Users, label: 'Alumnos' },
  { to: '/portal/reportes/nuevo', icon: FilePlus, label: 'Crear Reporte' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const isCoachOrAdmin = user?.rol === 'Coach' || user?.rol === 'Admin';

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
      isActive
        ? 'bg-[#2D5A3D] text-white font-semibold'
        : 'text-gray-300 hover:bg-[#2D5A3D]/50 hover:text-white'
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-[#1B3A2A] text-white z-50 flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[#2D5A3D]">
          <span className="font-bold text-lg">Top Tenis</span>
          <br />
          <span className="text-[#A7C4B0] text-xs">Performance Academy</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={onClose}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}

          {isCoachOrAdmin && (
            <>
              <div className="border-t border-[#2D5A3D] my-3" />
              {coachNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={linkClass}
                  onClick={onClose}
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-[#2D5A3D]">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-red-900/40 hover:text-red-300 transition w-full"
          >
            <LogOut size={18} />
            Salir
          </button>
          <p className="text-[#A7C4B0] text-[10px] text-center mt-3 opacity-60">
            Powered by YONEX
          </p>
        </div>
      </aside>
    </>
  );
}
