import { createContext, useContext, useState, useEffect } from 'react';

const PortalContext = createContext(null);

export function PortalProvider({ children }) {
  const [role,      setRole]      = useState('coach');
  const [athleteId, setAthleteId] = useState('TTPA-014');
  const [accent,    setAccent]    = useState('#8B4513');
  const [density,   setDensity]   = useState('regular');

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', accent);
    const lightAccents = ['#C8A24B', '#C5D62E'];
    root.style.setProperty('--accent-ink', lightAccents.includes(accent) ? '#1A1A1A' : '#FFFFFF');
    document.body.setAttribute('data-density', density);
  }, [accent, density]);

  return (
    <PortalContext.Provider value={{ role, setRole, athleteId, setAthleteId, accent, setAccent, density, setDensity }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  return useContext(PortalContext);
}
