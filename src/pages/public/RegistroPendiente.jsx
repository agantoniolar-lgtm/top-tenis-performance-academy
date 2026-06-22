import { Link } from 'react-router-dom';
import { CircleDot, MailCheck } from 'lucide-react';

export default function RegistroPendiente() {
  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <div className="hidden lg:flex lg:w-1/2 bg-[#0E2419] flex-col items-center justify-center text-white p-12">
        <CircleDot className="w-32 h-32 mb-8 text-[#8B4513] opacity-80" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-center leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em' }}>
          Top Tenis<br />Performance Academy
        </h1>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md text-center">
          <MailCheck className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
          <h2 className="text-2xl font-bold text-[#14110D] mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em' }}>
            Revisa tu correo
          </h2>
          <p className="text-[#8A8780] mb-2 text-sm leading-relaxed">
            Enviamos un enlace de confirmación a tu cuenta de email.
          </p>
          <p className="text-[#8A8780] mb-6 text-sm leading-relaxed">
            Haz clic en el enlace para activar tu cuenta y entrar al portal por primera vez.
          </p>
          <Link to="/login"
                className="inline-block text-white font-semibold py-2.5 px-6 rounded-[2px] transition-opacity hover:opacity-90 uppercase tracking-[0.08em] text-sm"
                style={{ background: 'var(--accent)' }}>
            Ir al login
          </Link>
          <p className="mt-4 text-[11px] text-[#8A8780]">
            ¿No llegó? Revisa spam o{' '}
            <Link to="/login" className="hover:underline font-semibold" style={{ color: 'var(--accent)' }}>
              intenta de nuevo
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
