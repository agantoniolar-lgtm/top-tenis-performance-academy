import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/programas', label: 'Programas' },
  { to: '/camino-usa', label: 'Camino USA' },
  { to: '/torneos', label: 'Torneos' },
  { to: '/alianzas', label: 'Alianzas' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#1B3A2A] flex items-center px-6">
      {/* Logo */}
      <Link to="/" className="flex flex-col leading-tight shrink-0">
        <span className="text-white font-bold text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
          Top Tenis
        </span>
        <span className="text-[#A7C4B0] text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
          Performance Academy
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden lg:flex items-center gap-6 mx-auto">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-white text-sm hover:text-[#A7C4B0] transition"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Desktop buttons */}
      <div className="hidden lg:flex items-center gap-3 shrink-0">
        <Link
          to="/login"
          className="rounded-md px-5 py-2 text-sm font-semibold border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white transition"
        >
          Acceder al Portal
        </Link>
        <Link
          to="/contacto"
          className="rounded-md px-5 py-2 text-sm font-semibold bg-[#8B4513] text-white hover:bg-[#A0522D] transition"
        >
          Inscríbete
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="lg:hidden ml-auto text-white"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-[#1B3A2A] p-6 flex flex-col">
            <button
              className="self-end text-white mb-8"
              onClick={() => setMobileOpen(false)}
            >
              <X size={28} />
            </button>

            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white text-lg hover:text-[#A7C4B0] transition"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                to="/login"
                className="rounded-md px-5 py-3 text-sm font-semibold border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white transition text-center"
                onClick={() => setMobileOpen(false)}
              >
                Acceder al Portal
              </Link>
              <Link
                to="/contacto"
                className="rounded-md px-5 py-3 text-sm font-semibold bg-[#8B4513] text-white hover:bg-[#A0522D] transition text-center"
                onClick={() => setMobileOpen(false)}
              >
                Inscríbete
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
