import { Play } from 'lucide-react';

export default function VideoPlaceholder({ description, className = '' }) {
  return (
    <div
      className={`bg-[#1B3A2A] aspect-video rounded-xl flex flex-col items-center justify-center ${className}`}
    >
      <Play size={64} className="text-[#8B4513]" fill="#8B4513" />
      {description && (
        <p className="text-white text-sm mt-3 opacity-80">{description}</p>
      )}
    </div>
  );
}
