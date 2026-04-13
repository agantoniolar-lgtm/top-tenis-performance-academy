import { Image } from 'lucide-react';

export default function ImagePlaceholder({
  description,
  className = '',
  aspectRatio = 'aspect-video',
}) {
  return (
    <div
      className={`bg-gradient-to-br from-[#1B3A2A] to-[#2D5A3D] rounded-xl flex flex-col items-center justify-center ${aspectRatio} ${className}`}
    >
      <Image size={48} className="text-white opacity-60" />
      {description && (
        <p className="text-white text-sm mt-3 opacity-80">{description}</p>
      )}
    </div>
  );
}
