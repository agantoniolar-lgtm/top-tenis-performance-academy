import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './hooks/useAuth';

// Layouts
import PublicLayout from './components/public/PublicLayout';
import PortalLayout from './components/portal/PortalLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Public pages
const Home = lazy(() => import('./pages/public/Home'));
const Nosotros = lazy(() => import('./pages/public/Nosotros'));
const Programas = lazy(() => import('./pages/public/Programas'));
const CaminoUSA = lazy(() => import('./pages/public/CaminoUSA'));
const Torneos = lazy(() => import('./pages/public/Torneos'));
const Alianzas = lazy(() => import('./pages/public/Alianzas'));
const Contacto = lazy(() => import('./pages/public/Contacto'));

// Auth
const Login = lazy(() => import('./pages/public/Login'));

// Portal pages
const Dashboard = lazy(() => import('./pages/portal/Dashboard'));
const Perfil = lazy(() => import('./pages/portal/Perfil'));
const MisTorneos = lazy(() => import('./pages/portal/MisTorneos'));
const NuevoTorneo = lazy(() => import('./pages/portal/NuevoTorneo'));
const PostTorneo = lazy(() => import('./pages/portal/PostTorneo'));
const Reportes = lazy(() => import('./pages/portal/Reportes'));
const Ejercicios = lazy(() => import('./pages/portal/Ejercicios'));

// Coach / Admin pages
const Alumnos = lazy(() => import('./pages/portal/coach/Alumnos'));
const AlumnoDetalle = lazy(() => import('./pages/portal/coach/AlumnoDetalle'));
const NuevoReporte = lazy(() => import('./pages/portal/coach/NuevoReporte'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400">Cargando...</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/programas" element={<Programas />} />
              <Route path="/camino-usa" element={<CaminoUSA />} />
              <Route path="/torneos" element={<Torneos />} />
              <Route path="/alianzas" element={<Alianzas />} />
              <Route path="/contacto" element={<Contacto />} />
            </Route>

            {/* Login (standalone, no public layout) */}
            <Route path="/login" element={<Login />} />

            {/* Protected portal routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<PortalLayout />}>
                <Route path="/portal" element={<Dashboard />} />
                <Route path="/portal/perfil" element={<Perfil />} />
                <Route path="/portal/torneos" element={<MisTorneos />} />
                <Route path="/portal/torneos/nuevo" element={<NuevoTorneo />} />
                <Route path="/portal/post-torneo/:id" element={<PostTorneo />} />
                <Route path="/portal/reportes" element={<Reportes />} />
                <Route path="/portal/ejercicios" element={<Ejercicios />} />

                {/* Coach / Admin only */}
                <Route element={<ProtectedRoute allowedRoles={['Coach', 'Admin']} />}>
                  <Route path="/portal/alumnos" element={<Alumnos />} />
                  <Route path="/portal/alumnos/:id" element={<AlumnoDetalle />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['Coach']} />}>
                  <Route path="/portal/reportes/nuevo" element={<NuevoReporte />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
