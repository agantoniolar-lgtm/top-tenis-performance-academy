import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PortalProvider } from '../../contexts/PortalContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Icon } from './ui';

function crumbsFor(pathname) {
  if (pathname === '/portal')               return ['Dashboard'];
  if (pathname.startsWith('/portal/equipo'))  return ['Equipo'];
  if (pathname.startsWith('/portal/alumnos')) return ['Atletas'];
  if (pathname.startsWith('/portal/reportes')) return ['Reportes'];
  if (pathname.startsWith('/portal/torneos'))  return ['Torneos'];
  if (pathname.startsWith('/portal/ejercicios')) return ['Ejercicios'];
  if (pathname.startsWith('/portal/perfil'))  return ['Mi perfil'];
  return ['Portal'];
}

function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const crumbs   = crumbsFor(location.pathname);

  return (
    <div className="flex min-h-screen portal-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area (offset for fixed sidebar on lg) */}
      <main className="flex-1 min-w-0 flex flex-col lg:ml-[224px]">
        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center px-4 h-14 z-30 sticky top-0"
          style={{ background: 'var(--green-deep)' }}
        >
          <button className="text-white mr-3" onClick={() => setSidebarOpen(true)}>
            <Icon name="more" size={20} />
          </button>
          <span className="text-white font-display font-bold text-[15px]">Top Tenis</span>
        </div>

        <Topbar crumbs={crumbs} />

        <div className="flex flex-1 min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function PortalLayout() {
  return (
    <PortalProvider>
      <Shell />
    </PortalProvider>
  );
}
