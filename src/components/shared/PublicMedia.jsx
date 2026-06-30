import { youTubeId } from '../../lib/content';
import VideoPlaceholder from './VideoPlaceholder';

// Render de un video del CMS. Si hay una URL de YouTube válida, embebe el
// reproductor; si no, cae al placeholder actual (mismo look que hoy).
export function CmsVideo({ url, title = 'Video', fallbackDescription, className = '' }) {
  const id = youTubeId(url);
  if (!id) return <VideoPlaceholder description={fallbackDescription} className={className} />;
  return (
    <div className={`aspect-video w-full bg-black rounded-xl overflow-hidden ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    </div>
  );
}

// Render de una imagen del CMS. Si no hay URL subida, renderiza el fallback
// (normalmente el <ImagePlaceholder> actual), preservando el diseño.
export function CmsImage({ url, alt = '', aspectRatio = 'aspect-video', className = '', fallback = null }) {
  if (!url) return fallback;
  return (
    <div className={`${aspectRatio} w-full overflow-hidden rounded-xl ${className}`}>
      <img src={url} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
