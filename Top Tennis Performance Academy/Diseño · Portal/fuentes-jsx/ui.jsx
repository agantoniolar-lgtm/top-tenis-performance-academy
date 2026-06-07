// ui.jsx — portal primitives

const { useState, useEffect, useRef, useMemo, useContext, createContext } = React;

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, className = '', stroke = 1.75 }) => {
  const paths = {
    home:        <><path d="M3 12l9-8 9 8v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z"/></>,
    users:       <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 21c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="6" r="2.5"/><path d="M21.5 18c0-2.5-1.9-4.2-4.4-4.2"/></>,
    folder:      <><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></>,
    book:        <><path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5z"/><path d="M4 17a2 2 0 012-2h12"/></>,
    file:        <><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z"/><path d="M14 3v6h6"/></>,
    fileDown:    <><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z"/><path d="M14 3v6h6M12 13v6M9 16l3 3 3-3"/></>,
    trophy:      <><path d="M8 4h8v4a4 4 0 01-8 0V4z"/><path d="M4 4h4v3a2 2 0 01-2 2v0a2 2 0 01-2-2V4zM16 4h4v3a2 2 0 01-2 2v0a2 2 0 01-2-2V4z"/><path d="M10 14h4v3h-4z"/><path d="M8 20h8"/></>,
    racket:      <><ellipse cx="9" cy="9" rx="6" ry="6.5"/><path d="M9 5v8M5 9h8M13 13l8 8"/></>,
    pulse:       <><path d="M3 12h4l2-6 4 12 2-6h6"/></>,
    bolt:        <><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" stroke="none"/></>,
    shield:      <><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"/></>,
    mic:         <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></>,
    target:      <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></>,
    play:        <><path d="M6 4v16l14-8z" fill="currentColor" stroke="none"/></>,
    download:    <><path d="M12 4v12M7 12l5 5 5-5M5 20h14"/></>,
    print:       <><path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6z"/></>,
    share:       <><circle cx="6" cy="12" r="3"/><circle cx="18" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.5 10.5L15.5 6.5M8.5 13.5L15.5 17.5"/></>,
    edit:        <><path d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5"/><path d="M18.5 2.5a2.1 2.1 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    more:        <><circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/></>,
    arrow:       <><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></>,
    arrowUp:     <><path d="M7 17L17 7M7 7h10v10"/></>,
    arrowDown:   <><path d="M7 7l10 10M17 7v10H7"/></>,
    chev:        <><path d="M6 9l6 6 6-6"/></>,
    chevRight:   <><path d="M9 6l6 6-6 6"/></>,
    search:      <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    bell:        <><path d="M6 8a6 6 0 1112 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 004 0"/></>,
    settings:    <><circle cx="12" cy="12" r="3"/><path d="M19 12l2-1-1-3-2 1m-3 9l-1 2-3-1 1-2m-3-7L7 5l-3 1 1 2m9 9l1 2 3-1-1-2m-9-3l-2 1 1 3 2-1m9-9l1-2-3-1-1 2"/></>,
    logout:      <><path d="M16 17l5-5-5-5M9 12h12M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/></>,
    sparkle:     <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></>,
    location:    <><path d="M12 22s7-7 7-13a7 7 0 10-14 0c0 6 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></>,
    calendar:    <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    eye:         <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    check:       <><path d="M5 12l5 5L20 7"/></>,
    x:           <><path d="M18 6L6 18M6 6l12 12"/></>,
    plus:        <><path d="M12 5v14M5 12h14"/></>,
    minus:       <><path d="M5 12h14"/></>,
    expand:      <><path d="M9 3H3v6M15 21h6v-6M3 3l7 7M21 21l-7-7"/></>,
    flag:        <><path d="M5 3v18M5 5h14l-2 4 2 4H5"/></>,
    heart:       <><path d="M12 21s-7-4.5-9.5-9C.8 8.5 3 5 6.5 5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3.5 0 5.7 3.5 4 7C19 16.5 12 21 12 21z"/></>,
    quote:       <><path d="M9 7H5a2 2 0 00-2 2v4a2 2 0 002 2h2v2a2 2 0 01-2 2v2c3 0 5-2 5-5V9a2 2 0 00-1-2z" fill="currentColor" stroke="none"/><path d="M20 7h-4a2 2 0 00-2 2v4a2 2 0 002 2h2v2a2 2 0 01-2 2v2c3 0 5-2 5-5V9a2 2 0 00-1-2z" fill="currentColor" stroke="none"/></>,
    clock:       <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    flask:       <><path d="M9 3v6L4 18a2 2 0 002 2h12a2 2 0 002-2L15 9V3M8 3h8"/></>,
    apple:       <><path d="M12 5c-1-2-3-2-4-2 0 2 2 3 4 2zm0 0c2.5 0 5 2 5 5.5 0 4.5-4 9-5 9s-5-4.5-5-9c0-3.5 2.5-5.5 5-5.5z"/></>,
    brain:       <><path d="M9 3a3 3 0 00-3 3v0a3 3 0 00-2 5v0a3 3 0 002 5v0a3 3 0 003 3M9 3a3 3 0 013 3v12a3 3 0 01-3 3M15 3a3 3 0 013 3v0a3 3 0 012 5v0a3 3 0 01-2 5v0a3 3 0 01-3 3M15 3a3 3 0 00-3 3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name] || null}
    </svg>
  );
};

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo({ tone = 'light' }) {
  const main = tone === 'light' ? '#fff' : 'var(--ink)';
  const sub  = tone === 'light' ? 'var(--green-soft)' : 'var(--ink-soft)';
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div className="relative w-8 h-8 flex items-center justify-center"
           style={{ background: 'var(--accent)' }}>
        <span className="font-display font-extrabold text-[13px] leading-none text-white" style={{ letterSpacing: '-0.04em' }}>TT</span>
        <span className="absolute inset-x-1 top-1/2 h-px" style={{ background: 'rgba(255,255,255,.45)' }} />
      </div>
      <div className="leading-tight">
        <div className="font-display font-extrabold text-[13px]" style={{ color: main, letterSpacing: '-0.02em' }}>
          Top Tenis<span style={{ color: 'var(--accent)' }}>.</span>
        </div>
        <div className="eyebrow !text-[9px]" style={{ color: sub }}>Performance Portal</div>
      </div>
    </div>
  );
}

// ─── Eyebrow / Section header ────────────────────────────────────────────────
const Eyebrow = ({ children, color, className = '' }) => (
  <div className={`eyebrow ${className}`} style={{ color: color || 'var(--ink-mute)' }}>{children}</div>
);

// ─── Card surface ────────────────────────────────────────────────────────────
const Card = ({ children, title, label, action, className = '', noPad, dark }) => (
  <section className={`relative ${dark ? 'text-white' : 'bg-[var(--paper)]'} hairline ${className}`}
           style={dark ? { background: 'var(--green-deep)', borderColor: 'rgba(255,255,255,.08)' } : {}}>
    {(title || label || action) && (
      <header className="px-5 py-4 flex items-center justify-between hairline-b"
              style={dark ? { borderColor: 'rgba(255,255,255,.08)' } : {}}>
        <div className="min-w-0">
          {label && <Eyebrow color={dark ? 'rgba(255,255,255,.55)' : undefined} className="mb-1">{label}</Eyebrow>}
          {title && <div className="font-display font-bold text-[16px] leading-tight truncate">{title}</div>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
    )}
    <div className={noPad ? '' : 'p-5'}>{children}</div>
  </section>
);

// ─── Button ─────────────────────────────────────────────────────────────────
const Btn = ({ variant = 'default', size = 'md', children, onClick, className = '', icon }) => {
  const sizes = {
    sm: 'h-7 px-2.5 text-[11px]',
    md: 'h-8 px-3 text-[12px]',
    lg: 'h-10 px-4 text-[13px]',
  };
  const styles = {
    default: { background: 'var(--paper)', color: 'var(--ink)', borderColor: 'var(--line-strong)' },
    primary: { background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'transparent' },
    dark:    { background: 'var(--green)', color: '#fff', borderColor: 'transparent' },
    ghost:   { background: 'transparent', color: 'var(--ink)', borderColor: 'transparent' },
    outline: { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--line-strong)' },
  };
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.08em] border transition-all hover:opacity-90 ${sizes[size]} ${className}`}
      style={styles[variant] || styles.default}>
      {icon && <Icon name={icon} size={size === 'lg' ? 14 : 12} />}
      {children}
    </button>
  );
};

// ─── Score Ring (1–5) ────────────────────────────────────────────────────────
function ScoreRing({ value = 0, max = 5, size = 64, label, color, sub }) {
  const C = 2 * Math.PI * 28;
  const pct = Math.max(0, Math.min(value / max, 1));
  const dash = C * pct;
  return (
    <div className="inline-flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" className="ring-bg" strokeWidth="4" fill="none" />
        <circle cx="32" cy="32" r="28" stroke={color || 'var(--accent)'} strokeWidth="4" fill="none"
                strokeLinecap="round" strokeDasharray={`${dash} ${C}`} transform="rotate(-90 32 32)" />
        <text x="32" y="36" textAnchor="middle" fontFamily="Big Shoulders Display" fontWeight="900"
              fontSize="22" fill="var(--ink)">{value.toFixed(1)}</text>
      </svg>
      {label && <div className="eyebrow text-[var(--ink-mute)] mt-1 !text-[9px]">{label}</div>}
      {sub && <div className="text-[10px] text-[var(--ink-mute)] mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Bar (1–5 slim score bar) ────────────────────────────────────────────────
function ScoreBar({ value = 0, max = 5, color }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} className="flex-1 h-2"
               style={{ background: i + 1 <= Math.round(value) ? (color || 'var(--accent)') : 'var(--line)' }} />
        ))}
      </div>
      <div className="font-num font-black text-[14px] leading-none tabular-nums w-7 text-right">{value.toFixed(1)}</div>
    </div>
  );
}

// ─── Tag ─────────────────────────────────────────────────────────────────────
const Tag = ({ children, color, bg, className = '' }) => (
  <span className={`tag ${className}`} style={{ color: color || 'var(--ink-soft)', background: bg || 'var(--cream)' }}>
    {children}
  </span>
);

// ─── Tab bar ─────────────────────────────────────────────────────────────────
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="hairline-b bg-[var(--paper)] sticky top-[60px] z-20">
      <div className="px-6 overflow-x-auto no-scrollbar flex gap-1 min-w-max">
        {tabs.map((tb) => {
          const isActive = active === tb.id;
          return (
            <button key={tb.id} onClick={() => onChange(tb.id)}
              className={`relative px-4 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition whitespace-nowrap flex items-center gap-2 ${
                isActive ? 'text-[var(--ink)]' : 'text-[var(--ink-mute)] hover:text-[var(--ink)]'
              }`}>
              {tb.icon && <Icon name={tb.icon} size={13} />}
              <span>{tb.label}</span>
              {tb.count != null && (
                <span className="font-mono text-[10px] px-1.5 py-0.5"
                  style={{ background: isActive ? 'var(--accent)' : 'var(--cream)', color: isActive ? 'var(--accent-ink)' : 'var(--ink-mute)' }}>
                  {tb.count}
                </span>
              )}
              {isActive && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px]" style={{ background: 'var(--accent)' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (d) => d; // already formatted in fixtures
const dimColor = (key) => ({
  oncourt: '#1B3A2A',
  physical: '#2D5A3D',
  mental: '#8B4513',
  character: '#5B4636',
  voice: '#A0522D',
}[key] || 'var(--accent)');

// Export
Object.assign(window, {
  Icon, Logo, Eyebrow, Card, Btn, ScoreRing, ScoreBar, Tag, Tabs, formatDate, dimColor,
});
