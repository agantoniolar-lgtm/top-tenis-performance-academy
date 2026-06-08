import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './hooks/useAuth';

import PublicLayout   from './components/public/PublicLayout';
import PortalLayout   from './components/portal/PortalLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Sitio público
const Home      = lazy(() => import('./pages/public/Home'));
const Nosotros  = lazy(() => import('./pages/public/Nosotros'));
const Programas = lazy(() => import('./pages/public/Programas'));
const CaminoUSA = lazy(() => import('./pages/public/CaminoUSA'));
const Torneos   = lazy(() => import('./pages/public/Torneos'));
const Alianzas  = lazy(() => import('./pages/public/Alianzas'));
const Contacto  = lazy(() => import('./pages/public/Contacto'));
const Login     = lazy(() => import('./pages/public/Login'));

// Portal — solo lo conectado a Supabase
const Dashboard     = lazy(() => import('./pages/portal/Dashboard'));        // redirect → /portal/alumnos
const Alumnos       = lazy(() => import('./pages/portal/coach/Alumnos'));
const AlumnoDetalle = lazy(() => import('./pages/portal/coach/AlumnoDetalle'));
const NuevoReporte  = lazy(() => import('./pages/portal/coach/NuevoReporte'));
const TalentCard    = lazy(() => import('./pages/portal/TalentCard'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400 text-sm">Cargando…</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Sitio público */}
            <Route element={<PublicLayout />}>
              <Route path="/"           element={<Home />} />
              <Route path="/nosotros"   element={<Nosotros />} />
              <Route path="/programas"  element={<Programas />} />
              <Route path="/camino-usa" element={<CaminoUSA />} />
              <Route path="/torneos"    element={<Torneos />} />
              <Route path="/alianzas"   element={<Alianzas />} />
              <Route path="/contacto"   element={<Contacto />} />
            </Route>

            <Route path="/login" element={<Login />} />

            {/* Portal — protegido */}
            <Route element={<ProtectedRoute />}>
              <Route element={<PortalLayout />}>
                <Route path="/portal"                   element={<Dashboard />} />
                <Route path="/portal/alumnos"           element={<Alumnos />} />
                <Route path="/portal/alumnos/:id"       element={<AlumnoDetalle />} />
                <Route path="/portal/reportes/nuevo"    element={<NuevoReporte />} />
                <Route path="/portal/alumnos/:id/talent-card" element={<TalentCard />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
