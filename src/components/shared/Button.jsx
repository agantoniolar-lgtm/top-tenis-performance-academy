const variants = {
  primary:
    'bg-[#1B3A2A] text-white hover:bg-[#2D5A3D]',
  secondary:
    'border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white',
  copper:
    'bg-[#8B4513] text-white hover:bg-[#A0522D]',
  ghost:
    'text-white underline',
};

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`rounded-md px-6 py-3 font-semibold transition ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
