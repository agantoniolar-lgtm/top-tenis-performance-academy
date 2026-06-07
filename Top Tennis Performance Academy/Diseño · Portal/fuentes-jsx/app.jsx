// app.jsx — Portal root (Dashboard + Expediente + sidebar nav)

const { useState: useStateApp, useEffect: useEffectApp } = React;

const ACCENTS = [
  { name: 'Copper',     value: '#8B4513' },
  { name: 'Gold',       value: '#C8A24B' },
  { name: 'Crimson',    value: '#C8102E' },
  { name: 'Court Lime', value: '#C5D62E' },
];

function App() {
  const [t, setTweak] = useTweaks(window.PORTAL_TWEAKS);
  const initialPage = (window.PORTAL_DEFAULT_PAGE) || 'atletas';
  const [page, setPage] = useStateApp(initialPage);
  const [athleteId, setAthleteId] = useStateApp(t.athleteId || 'TTPA-014');
  const [talentOpen, setTalentOpen] = useStateApp(false);

  useEffectApp(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    const onLight = ['#C8A24B', '#C5D62E'];
    root.style.setProperty('--accent-ink', onLight.includes(t.accent) ? '#1A1A1A' : '#FFFFFF');
    document.body.setAttribute('data-density', t.density || 'regular');
  }, [t.accent, t.density]);

  const file = athleteId === FILE.id ? FILE : buildShallowFile(athleteId);
  if (!file) return null;

  const role = t.viewerRole;

  // Athlete + padre always view "their" athlete (Daniela for demo)
  const effectiveAthleteId = (role === 'atleta' || role === 'padre') ? FILE.id : athleteId;
  const effectiveFile = (role === 'atleta' || role === 'padre') ? FILE : file;

  // Auto-page: atleta/padre/especialista land on dashboard; coach/admin on whatever is selected
  const effectivePage = (role === 'atleta' || role === 'padre' || role === 'especialista')
    ? (page === 'atletas' ? 'dashboard' : page)
    : page;

  const user = role === 'admin'         ? { name: 'Alejandro T.',    role: 'Admin · Director' }
            :  role === 'atleta'        ? { name: file.nombre,       role: 'Atleta · ' + (file.cat || 'U16') }
            :  role === 'padre'         ? { name: 'Familia ' + file.nombre.split(' ').slice(-1)[0], role: 'Padre / madre' }
            :  role === 'especialista'  ? { name: 'Dra. Solís',      role: 'Psicología · Especialista' }
            :                              { name: 'Marco Reyes',    role: 'Coach · Head' };

  const crumbs = effectivePage === 'dashboard' ? ['Dashboard']
              :  effectivePage === 'atletas'   ? ['Atletas', effectiveFile.nombre]
              :  effectivePage === 'reportes'  ? ['Reportes']
              :  effectivePage === 'torneos'   ? ['Torneos']
              :  effectivePage === 'ejercicios' ? ['Ejercicios']
              :  effectivePage === 'talent'    ? ['Talent Cards']
              :  effectivePage === 'especialistas' ? ['Especialistas']
              :  [effectivePage];

  // Roster shown only on Atletas page AND for staff roles
  const showRoster = (role === 'coach' || role === 'admin' || role === 'especialista')
                  && effectivePage === 'atletas';

  return (
    <div className="flex min-h-screen">
      <Sidebar active={effectivePage} onNav={setPage} role={role} user={user} />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar crumbs={crumbs} role={role} onRoleChange={(r) => setTweak('viewerRole', r)} />
        <div className="flex flex-1 min-w-0">
          {showRoster && (
            <RosterPanel
              selectedId={athleteId}
              onSelect={(id) => { setAthleteId(id); setTweak('athleteId', id); }} />
          )}
          <div className="flex-1 min-w-0">
            {effectivePage === 'dashboard' && (
              <Dashboard role={role} file={effectiveFile}
                onOpenAthlete={(id) => { setPage('atletas'); setAthleteId(id); setTweak('athleteId', id); }} />
            )}
            {effectivePage === 'atletas' && (
              <Expediente
                athleteId={effectiveAthleteId}
                file={effectiveFile}
                role={role}
                onOpenTalentCard={() => setTalentOpen(true)} />
            )}
            {!['dashboard','atletas'].includes(effectivePage) && (
              <ComingSoon page={effectivePage} />
            )}
          </div>
        </div>
      </main>

      <TalentCardModal file={effectiveFile} open={talentOpen} onClose={() => setTalentOpen(false)} />

      <TweaksPanel>
        <TweakSection label="Viewer" />
        <TweakRadio label="Rol" value={role}
          options={[
            { value: 'coach',         label: 'Coach'  },
            { value: 'admin',         label: 'Admin'  },
            { value: 'atleta',        label: 'Atleta' },
            { value: 'padre',         label: 'Padre'  },
            { value: 'especialista',  label: 'Espec.' },
          ]}
          onChange={(v) => setTweak('viewerRole', v)} />

        <TweakSection label="Theme" />
        <div className="twk-row">
          <div className="twk-lbl"><span>Accent</span><span className="twk-val">{t.accentName}</span></div>
          <div className="grid grid-cols-4 gap-1.5">
            {ACCENTS.map(a => (
              <button key={a.name}
                onClick={() => setTweak({ accent: a.value, accentName: a.name })}
                title={a.name}
                className="h-8 transition"
                style={{ background: a.value, outline: t.accent === a.value ? '2px solid #111' : 'none', outlineOffset: 2 }} />
            ))}
          </div>
        </div>

        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'regular', label: 'Regular' },
            { value: 'comfy',   label: 'Comfy'   },
          ]}
          onChange={(v) => setTweak('density', v)} />

        {(role === 'coach' || role === 'admin') && (
          <>
            <TweakSection label="Atleta" />
            <TweakSelect label="Switch" value={athleteId}
              options={ROSTER.map(r => ({ value: r.id, label: `${r.nombre} · ${r.cat}` }))}
              onChange={(v) => { setAthleteId(v); setTweak('athleteId', v); }} />
          </>
        )}
      </TweaksPanel>
    </div>
  );
}

function ComingSoon({ page }) {
  const titles = {
    reportes: 'Reportes',
    torneos: 'Torneos',
    ejercicios: 'Ejercicios',
    talent: 'Talent Cards',
    especialistas: 'Especialistas',
  };
  return (
    <div className="p-12">
      <Eyebrow className="mb-3">En construcción</Eyebrow>
      <h1 className="font-display font-extrabold text-[40px] leading-tight mb-4">{titles[page] || page}</h1>
      <p className="text-[var(--ink-soft)] max-w-md">
        Esta sección viene en una siguiente iteración. Las épicas están descritas en el documento de producto.
      </p>
    </div>
  );
}

function buildShallowFile(id) {
  const r = ROSTER.find(x => x.id === id);
  if (!r) return null;
  return {
    ...FILE,
    id: r.id, nombre: r.nombre, edad: r.edad, cat: r.cat, coach: r.coach,
    turno: `${r.turno} · ${r.turno === 'Matutino' ? '9:00–12:00' : '16:00–19:00'}`,
    ingreso: r.ingreso,
    utr: { now: r.utr, delta12: 1.0, peak: r.utr },
    amtp: { now: r.amtp, delta12: 5, division: r.cat },
    itf: { entrants: r.itf, sjr: r.itf === '—' ? 999 : 500, points: r.itf === '—' ? 0 : 30 },
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
