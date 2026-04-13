import { Link } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/programas', label: 'Programas' },
  { to: '/camino-usa', label: 'Camino USA' },
  { to: '/torneos', label: 'Torneos' },
  { to: '/alianzas', label: 'Alianzas' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Logo + tagline */}
          <div>
            <div className="mb-3">
              <span className="font-bold text-xl">Top Tenis</span>
              <br />
              <span className="text-[#A7C4B0] text-sm">Performance Academy</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Formando tenistas de alto rendimiento con valores, disciplina y un
              camino claro hacia el tenis universitario en Estados Unidos.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400">
              Navegación
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-300 text-sm hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400">
              Contacto
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Club de Tenis Top Tenis</li>
              <li>Monterrey, Nuevo León, México</li>
              <li>Tel: +52 (81) 1234-5678</li>
              <li>info@toptenispa.mx</li>
            </ul>
          </div>
        </div>

        {/* Sponsors */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <p className="text-center text-sm text-gray-400 mb-4">
            Nuestros patrocinadores
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 rounded-lg px-6 py-3 text-gray-400 font-semibold text-sm">
                YONEX
              </div>
              <span className="text-gray-500 text-xs mt-2">
                Patrocinador oficial de entrenamiento
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2026 Top Tenis Performance Academy. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
