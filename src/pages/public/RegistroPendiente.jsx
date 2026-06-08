import { Link } from 'react-router-dom';
import { CircleDot, MailCheck } from 'lucide-react';

export default function RegistroPendiente() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B3A2A] flex-col items-center justify-center text-white p-12">
        <CircleDot className="w-32 h-32 mb-8 text-[#8B4513] opacity-80" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-center leading-tight">
          Top Tenis<br />Performance Academy
        </h1>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md text-center">
          <MailCheck className="w-16 h-16 mx-auto mb-4 text-[#1B3A2A]" strokeWidth={1.5} />
          <h2 className="text-2xl font-bold text-[#1B3A2A] mb-2">Revisa tu email</h2>
          <p className="text-gray-500 mb-6">
            Te enviamos un link de confirmación. Una vez que confirmes tu cuenta, podrás iniciar sesión.
          </p>
          <Link to="/login"
                className="inline-block bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm">
            Ir al login
          </Link>
        </div>
      </div>
    </div>
  );
}
