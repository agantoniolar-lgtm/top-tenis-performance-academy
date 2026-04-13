const badgeStyles = {
  win: 'bg-green-100 text-green-800',
  loss: 'bg-red-100 text-red-800',
  utr: 'bg-blue-100 text-blue-800',
  pending: 'bg-amber-100 text-amber-800 animate-pulse',
  completed: 'bg-green-100 text-green-800',
  reviewed: 'bg-blue-100 text-blue-800',
  semifinal: 'bg-purple-100 text-purple-800',
};

const defaultLabels = {
  win: 'Victoria',
  loss: 'Derrota',
  pending: 'Pendiente',
  completed: 'Completado',
  reviewed: 'Revisado',
  semifinal: 'Semifinal',
};

export default function Badge({ type, children, className = '' }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[type] || 'bg-gray-100 text-gray-800'} ${className}`}
    >
      {children || defaultLabels[type] || type}
    </span>
  );
}
