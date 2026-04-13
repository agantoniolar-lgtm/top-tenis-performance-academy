import { useState } from 'react';
import { ejerciciosCarlos } from '../../data/dummy';
import { Dumbbell, Upload, X, Loader2, CheckCircle, Clock, Eye, MessageSquare } from 'lucide-react';

export default function Ejercicios() {
  const [ejercicios, setEjercicios] = useState(ejerciciosCarlos);
  const [modalId, setModalId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState('');

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setEjercicios((prev) =>
        prev.map((e) => (e.id === modalId ? { ...e, estado: 'Video enviado' } : e))
      );
      setModalId(null);
      setComment('');
      setToast('Video enviado exitosamente.');
      setTimeout(() => setToast(''), 3000);
    }, 2000);
  };

  const statusConfig = {
    'Pendiente': { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock, pulse: true, label: 'Pendiente de video' },
    'Video enviado': { bg: 'bg-green-100', text: 'text-green-700', icon: Upload, pulse: false, label: 'Video enviado' },
    'Revisado': { bg: 'bg-blue-100', text: 'text-blue-700', icon: Eye, pulse: false, label: 'Revisado por coach' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ejercicios</h1>
        <p className="text-gray-500">Ejercicios asignados por tu coach.</p>
      </div>

      <div className="space-y-4">
        {ejercicios.map((ej) => {
          const status = statusConfig[ej.estado] || statusConfig['Pendiente'];
          const StatusIcon = status.icon;
          return (
            <div key={ej.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#1B3A2A]/10 shrink-0">
                    <Dumbbell className="w-5 h-5 text-[#1B3A2A]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{ej.titulo}</h3>
                    <p className="text-sm text-gray-600 mt-1">{ej.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-2">Asignado: {ej.fechaAsignacion}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap ${status.bg} ${status.text} ${status.pulse ? 'animate-pulse' : ''}`}
                >
                  <StatusIcon className="w-3 h-3" /> {status.label}
                </span>
              </div>

              {ej.comentarioCoach && (
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Comentario del coach</span>
                  </div>
                  <p className="text-sm text-blue-800">{ej.comentarioCoach}</p>
                </div>
              )}

              {ej.estado === 'Pendiente' && (
                <button
                  onClick={() => setModalId(ej.id)}
                  className="mt-3 px-4 py-2 bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Subir video
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload modal */}
      {modalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => { setModalId(null); setComment(''); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-gray-900 text-lg mb-1">Subir video del ejercicio</h3>
            <p className="text-sm text-gray-500 mb-5">
              Sube el video de tu ejercicio (MP4, MOV, máx 100MB)
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1B3A2A] transition-colors cursor-pointer mb-4">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Arrastra tu archivo aquí o haz clic para seleccionar</p>
              <input type="file" accept="video/*" className="hidden" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comentario (opcional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] resize-none"
                rows={3}
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Enviar al coach
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4" /> {toast}
        </div>
      )}
    </div>
  );
}
