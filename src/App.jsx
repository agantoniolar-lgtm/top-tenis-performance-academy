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
const NuevoReporte       = lazy(() => import('./pages/portal/coach/NuevoReporte'));
const ReportesPorPeriodo = lazy(() => import('./pages/portal/coach/ReportesPorPeriodo'));
const NuevoAtleta        = lazy(() => import('./pages/portal/coach/NuevoAtleta'));
const NuevoTorneoCoach   = lazy(() => import('./pages/portal/coach/NuevoTorneoCoach'));
const TorneosCoach       = lazy(() => import('./pages/portal/coach/Torneos'));
const TalentCard    = lazy(() => import('./pages/portal/TalentCard'));
const AtletaInicio        = lazy(() => import('./pages/portal/atleta/Inicio'));
const AtletaPerfil        = lazy(() => import('./pages/portal/atleta/Perfil'));
const AtletaReclutamiento = lazy(() => import('./pages/portal/atleta/Reclutamiento'));
const AtletaRendimiento   = lazy(() => import('./pages/portal/atleta/Rendimiento'));
const AthleteVoice        = lazy(() => import('./pages/portal/atleta/AthleteVoice'));
const MisTorneos          = lazy(() => import('./pages/portal/MisTorneos'));
const NuevoTorneo         = lazy(() => import('./pages/portal/NuevoTorneo'));
const PostTorneo          = lazy(() => import('./pages/portal/PostTorneo'));
const Signup             = lazy(() => import('./pages/public/Signup'));
const CoachSignup        = lazy(() => import('./pages/public/CoachSignup'));
const ContentSignup      = lazy(() => import('./pages/public/ContentSignup'));
const RegistroPendiente  = lazy(() => import('./pages/public/RegistroPendiente'));

// CDS — Content Delivery System
const PanelContenido = lazy(() => import('./pages/portal/content/PanelContenido'));

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

            <Route path="/login"               element={<Login />} />
            <Route path="/registro"            element={<Signup />} />
            <Route path="/registro-coach"      element={<CoachSignup />} />
            <Route path="/registro-content"    element={<ContentSignup />} />
            <Route path="/registro-pendiente"  element={<RegistroPendiente />} />

            {/* Portal — protegido */}
            <Route element={<ProtectedRoute />}>
              <Route element={<PortalLayout />}>
                <Route path="/portal" element={<Dashboard />} />

                {/* Rutas de coach */}
                <Route element={<ProtectedRoute allowedRoles={['Coach']} />}>
                  <Route path="/portal/alumnos"                    element={<Alumnos />} />
                  <Route path="/portal/alumnos/nuevo"              element={<NuevoAtleta />} />
                  <Route path="/portal/alumnos/:id"                element={<AlumnoDetalle />} />
                  <Route path="/portal/alumnos/:id/talent-card"    element={<TalentCard />} />
                  <Route path="/portal/reportes"              element={<ReportesPorPeriodo />} />
                  <Route path="/portal/reportes/nuevo"        element={<NuevoReporte />} />
                  <Route path="/portal/torneos"               element={<TorneosCoach />} />
                  <Route path="/portal/torneos/registrar"     element={<NuevoTorneoCoach />} />
                </Route>

                {/* Rutas de atleta */}
                <Route element={<ProtectedRoute allowedRoles={['Atleta']} />}>
                  <Route path="/portal/inicio"           element={<AtletaInicio />} />
                  <Route path="/portal/mi-perfil"        element={<AtletaPerfil />} />
                  <Route path="/portal/mi-reclutamiento" element={<AtletaReclutamiento />} />
                  <Route path="/portal/mi-rendimiento"   element={<AtletaRendimiento />} />
                  <Route path="/portal/mis-torneos"           element={<MisTorneos />} />
                  <Route path="/portal/torneos/nuevo"         element={<NuevoTorneo />} />
                  <Route path="/portal/post-torneo"           element={<PostTorneo />} />
                  <Route path="/portal/post-torneo/:torneoId" element={<PostTorneo />} />
                  <Route path="/portal/athlete-voice"        element={<AthleteVoice />} />
                </Route>

                {/* Rutas de content manager */}
                <Route element={<ProtectedRoute allowedRoles={['Content']} />}>
                  <Route path="/portal/contenido" element={<PanelContenido />} />
                </Route>
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
