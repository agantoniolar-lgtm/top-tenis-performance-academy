// dashboard.jsx — Dashboards per role

const { useState: useStateDB } = React;

// ─── Shared bits ─────────────────────────────────────────────────────────────
function Greeting({ eyebrow, name, sub, action }) {
  return (
    <div className="px-6 py-7 hairline-b bg-[var(--paper)]">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <Eyebrow className="mb-2">{eyebrow}</Eyebrow>
          <h1 className="font-display font-extrabold leading-[0.95] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}>
            {name}
          </h1>
          {sub && <p className="text-[var(--ink-soft)] mt-2 max-w-2xl">{sub}</p>}
        </div>
        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}

function StatTile({ v, label, sub, accent, icon, good }) {
  return (
    <div className="bg-[var(--paper)] px-5 py-4 relative hairline">
      {accent && <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: 'var(--accent)' }} />}
      <div className="flex items-start justify-between gap-3">
        <Eyebrow className="!text-[10px]">{label}</Eyebrow>
        {icon && (
          <div className="w-7 h-7 flex items-center justify-center text-[var(--accent)]" style={{ background: 'var(--cream)' }}>
            <Icon name={icon} size={13} />
          </div>
        )}
      </div>
      <div className="font-num font-black text-[44px] leading-none tnum mt-2">{v}</div>
      {sub && (
        <div className="text-[10px] font-mono mt-1.5" style={{ color: good ? 'var(--good)' : 'var(--ink-mute)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── COACH DASHBOARD ────────────────────────────────────────────────────────
function CoachDashboard({ onOpenAthlete }) {
  const myAthletes = ROSTER.filter(r => r.coach === 'Marco Reyes' || r.coach === 'Alejandro').slice(0, 6);
  const attention = [
    { athlete: 'Carlos Mendoza',     id: 'TTPA-001', flag: 'PTF pendiente · AMTP Puebla',     since: '5 días',  level: 'warn' },
    { athlete: 'Sofía Ruiz',         id: 'TTPA-002', flag: 'Video sin comentar · sombra',     since: '2 días',  level: 'info' },
    { athlete: 'Diego Vargas',       id: 'TTPA-007', flag: 'Reporte mensual atrasado',         since: '11 días', level: 'bad'  },
    { athlete: 'Daniela Hernández',  id: 'TTPA-014', flag: 'Inscripción ITF J60 Cancún',        since: 'Hoy',     level: 'info' },
    { athlete: 'Valentina Torres',   id: 'TTPA-009', flag: 'Padres pidieron reunión',           since: '1 día',   level: 'warn' },
  ];
  const schedule = [
    { day: 'Lun',  date: '12 May', mat: 'U16/U18 técnica · 5 atl',  vesp: 'Saque + return · 4 atl' },
    { day: 'Mar',  date: '13 May', mat: 'Match-play · 6 atl',       vesp: 'Físico · todos' },
    { day: 'Mié',  date: '14 May', mat: 'Volea + red · 5 atl',      vesp: 'Mental + cancha · Dra. Solís' },
    { day: 'Jue',  date: '15 May', mat: 'Match-play U16 · 4 atl',   vesp: 'Sesión grupal · liderazgo' },
    { day: 'Vie',  date: '16 May', mat: 'Patrones tácticos',         vesp: '—' },
  ];
  return (
    <>
      <Greeting
        eyebrow="Coach · Marco Reyes · Mié 14 May 2026"
        name={<>Buenos días, Marco.</>}
        sub="Hoy hay 3 reportes mensuales por entregar y 2 PTFs por revisar. Esta es tu academia."
        action={
          <>
            <Btn variant="outline" size="md" icon="edit">Nuevo reporte</Btn>
            <Btn variant="primary" size="md" icon="plus">Asignar ejercicio</Btn>
          </>
        }
      />
      <div className="p-6 grid grid-cols-12 gap-4">
        {/* KPI row */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-px hairline">
          <StatTile v="8 / 28" label="Mis atletas" sub="Marco + co-Alejandro" icon="users" accent />
          <StatTile v="3"  label="Reportes pendientes" sub="2 de este mes · 1 atrasado" icon="file" good={false} />
          <StatTile v="2"  label="PTFs por revisar" sub="Carlos · Sofía" icon="mic" />
          <StatTile v="14" label="Videos en bandeja" sub="4 sin comentar" icon="play" />
        </div>

        {/* Attention */}
        <div className="col-span-12 lg:col-span-7">
          <Card label="Necesita tu atención" title="Atletas con pendientes esta semana"
                action={<button className="text-[10px] font-mono uppercase" style={{ color: 'var(--accent)' }}>Ver todos →</button>}
                noPad>
            {attention.map((a, i) => (
              <button key={i} onClick={() => onOpenAthlete && onOpenAthlete(a.id)}
                className="w-full text-left flex items-center gap-4 px-5 py-3 hairline-b last:border-b-0 hover:bg-[var(--cream)] transition">
                <div className="w-10 h-10 court-bg shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <div className="font-display font-bold text-[14px]">{a.athlete}</div>
                    <div className="font-mono text-[10px] text-[var(--ink-mute)]">{a.id}</div>
                  </div>
                  <div className="text-[12px] text-[var(--ink-soft)] mt-0.5">{a.flag}</div>
                </div>
                <div className="text-right shrink-0">
                  <Tag
                    color={a.level === 'bad' ? 'var(--bad)' : a.level === 'warn' ? 'var(--warn)' : 'var(--ink-soft)'}
                    bg={a.level === 'bad' ? 'rgba(220,38,38,.1)' : a.level === 'warn' ? 'rgba(217,119,6,.12)' : 'var(--cream)'}>
                    {a.since}
                  </Tag>
                </div>
                <Icon name="chevRight" size={14} className="text-[var(--ink-mute)]" />
              </button>
            ))}
          </Card>
        </div>

        {/* My athletes */}
        <div className="col-span-12 lg:col-span-5">
          <Card label={`Mis atletas · ${myAthletes.length}`} title="Roster" noPad>
            {myAthletes.map((a) => (
              <button key={a.id} onClick={() => onOpenAthlete && onOpenAthlete(a.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hairline-b last:border-b-0 text-left hover:bg-[var(--cream)] transition">
                <div className="w-8 h-8 court-bg shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-display font-bold leading-tight truncate">{a.nombre}</div>
                  <div className="text-[10px] font-mono text-[var(--ink-mute)] mt-0.5">{a.id} · {a.cat}</div>
                </div>
                <div className="font-num font-black text-[18px] leading-none tnum">{a.utr.toFixed(1)}</div>
                <Icon name="chevRight" size={14} className="text-[var(--ink-mute)]" />
              </button>
            ))}
          </Card>
        </div>

        {/* Schedule */}
        <div className="col-span-12 lg:col-span-8">
          <Card label="Esta semana" title="Mi calendario · sem. 20"
                action={<Btn size="sm" variant="ghost" icon="plus">Bloque</Btn>}
                noPad>
            <table className="w-full text-[12px]">
              <thead className="text-[10px] eyebrow text-[var(--ink-mute)] bg-[var(--cream)]">
                <tr>
                  <th className="text-left px-5 py-2.5 w-[100px]">Día</th>
                  <th className="text-left px-3 py-2.5">9:00–12:00 · Matutino</th>
                  <th className="text-left px-3 py-2.5">16:00–19:00 · Vespertino</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((s, i) => (
                  <tr key={i} className="hairline-t" style={i === 2 ? { background: 'var(--cream)' } : {}}>
                    <td className="px-5 py-3">
                      <div className="font-display font-bold text-[13px]">{s.day}</div>
                      <div className="text-[10px] font-mono text-[var(--ink-mute)]">{s.date}</div>
                    </td>
                    <td className="px-3 py-3 text-[12px]">
                      {s.mat === '—' ? <span className="text-[var(--ink-mute)]">—</span> : s.mat}
                    </td>
                    <td className="px-3 py-3 text-[12px]">
                      {s.vesp === '—' ? <span className="text-[var(--ink-mute)]">—</span> : s.vesp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Recent activity */}
        <div className="col-span-12 lg:col-span-4">
          <Card label="Actividad reciente" title="Mis atletas · feed" noPad>
            {FILE.activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3 hairline-b last:border-b-0">
                <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5"
                     style={{ background: 'var(--cream)', color: 'var(--accent)' }}>
                  <Icon name={a.type === 'video' ? 'play' : a.type === 'ptf' ? 'mic' : a.type === 'session' ? 'pulse' : 'file'} size={10} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] leading-snug">{a.what}</div>
                  <div className="text-[10px] text-[var(--ink-mute)] mt-0.5">{a.who} · {a.when}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── ATLETA DASHBOARD ────────────────────────────────────────────────────────
function AtletaDashboard({ file }) {
  const exercises = [
    { id: 1, title: 'Sombra de revés · 50 reps · cadera', due: 'Hoy',     status: 'pendiente' },
    { id: 2, title: 'Trabajo de piernas · escalera + conos', due: 'Mañana', status: 'pendiente' },
    { id: 3, title: 'Rutina preventivos · hombro · codo', due: '15 May',   status: 'pendiente' },
    { id: 4, title: 'Servicio bajo presión · 30 reps',     due: '16 May',   status: 'pendiente' },
  ];
  const nextTourney = { name: 'ITF J60 Cancún', date: '10–16 May 2026', round: 'Cuadro principal', cierre: '5 May' };
  return (
    <>
      <Greeting
        eyebrow={`Atleta · ${file.id} · ${file.cat}`}
        name={<>Hola, {file.nombre.split(' ')[0]}.</>}
        sub={`Tu UTR subió a ${file.utr.now.toFixed(1)} esta semana. Tienes 1 PTF pendiente y 4 ejercicios asignados.`}
        action={
          <>
            <Btn variant="outline" size="md" icon="file">Mi expediente</Btn>
            <Btn variant="primary" size="md" icon="mic">Completar PTF</Btn>
          </>
        }
      />

      <div className="p-6 grid grid-cols-12 gap-4">
        {/* Big metrics */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-px hairline">
          <StatTile v={file.utr.now.toFixed(1)} label="UTR" sub={`+${file.utr.delta12.toFixed(1)} / 12m`} accent good />
          <StatTile v={`#${file.amtp.now}`} label="AMTP U16" sub={`↑${file.amtp.delta12} en 12m`} good />
          <StatTile v={`#${file.itf.sjr}`} label="ITF SJR" sub={`${file.itf.entrants} · ${file.itf.points} pts`} />
          <StatTile v="4" label="Ejercicios pendientes" sub="1 vence hoy" icon="pulse" />
        </div>

        {/* Pending PTF (priority) */}
        <div className="col-span-12 lg:col-span-7">
          <Card dark label="Acción pendiente · PTF" title={null}
                action={<Tag color="white" bg="rgba(255,255,255,.12)">Vence en 2 días</Tag>}>
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div>
                <Eyebrow color="var(--green-soft)" className="!text-[10px] mb-3">Post-tournament form</Eyebrow>
                <div className="font-display font-extrabold text-[28px] leading-[1] mb-3 text-white">
                  Cuéntanos cómo te fue.
                </div>
                <p className="text-white/75 text-[13px] leading-relaxed mb-5">
                  Completa el PTF de tu participación en el AMTP Puebla Open U16. La voz del propio atleta es uno de los datos más valiosos de tu expediente.
                </p>
                <Btn variant="primary" size="lg" icon="arrow">Empezar PTF</Btn>
              </div>
              <div className="bg-white/5 p-4">
                <Eyebrow color="var(--green-soft)" className="mb-2 !text-[10px]">Torneo a reflexionar</Eyebrow>
                <div className="font-display font-bold text-white text-[16px] leading-tight">AMTP Puebla Open U16</div>
                <div className="text-[11px] font-mono mt-1" style={{ color: 'var(--green-soft)' }}>08–12 Abr 2026 · Final</div>
                <div className="text-[12px] font-mono mt-3" style={{ color: 'var(--green-soft)' }}>Resultado · <span className="text-white">L 6-3 4-6 4-6</span></div>
                <div className="hairline-t mt-4 pt-3 text-[11px]" style={{ borderColor: 'rgba(255,255,255,.1)', color: 'var(--green-soft)' }}>
                  El PTF no es una formalidad — es tu voz dentro del expediente que llega a universidades.
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Next tournament */}
        <div className="col-span-12 lg:col-span-5">
          <Card label="Próximo torneo" title={nextTourney.name}
                action={<Tag color="var(--good)" bg="rgba(22,163,74,.12)">Inscrita</Tag>}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Icon name="calendar" size={16} className="text-[var(--ink-mute)]" />
                <div className="text-[13px]">{nextTourney.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="trophy" size={16} className="text-[var(--ink-mute)]" />
                <div className="text-[13px]">{nextTourney.round}</div>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="clock" size={16} className="text-[var(--ink-mute)]" />
                <div className="text-[13px] text-[var(--ink-soft)]">Inscripción cierra el {nextTourney.cierre}</div>
              </div>
            </div>
            <div className="hairline-t mt-4 pt-3">
              <Btn variant="outline" size="sm">Ver inscripción</Btn>
            </div>
          </Card>
        </div>

        {/* Exercises */}
        <div className="col-span-12 lg:col-span-7">
          <Card label="Ejercicios asignados" title="Tu próxima semana" noPad>
            {exercises.map((e, i) => (
              <div key={e.id} className="flex items-center gap-4 px-5 py-3 hairline-b last:border-b-0">
                <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: 'var(--cream)' }}>
                  <Icon name="pulse" size={14} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-[13px] leading-tight">{e.title}</div>
                  <div className="text-[10px] font-mono text-[var(--ink-mute)] mt-0.5">Vence · {e.due}</div>
                </div>
                <Btn variant="outline" size="sm" icon="play">Subir video</Btn>
              </div>
            ))}
            <div className="px-5 py-3 hairline-t flex items-center justify-between text-[11px] font-mono text-[var(--ink-mute)]">
              <span>4 pendientes · 12 completados este mes</span>
              <span className="text-[var(--good)] font-bold">★ 86% on-time</span>
            </div>
          </Card>
        </div>

        {/* My goals */}
        <div className="col-span-12 lg:col-span-5">
          <Card label="Mis metas · 6 meses" title="Lo que dijiste"
                action={<Btn size="sm" variant="ghost" icon="edit">Editar</Btn>}>
            <ul className="space-y-3">
              {file.voice.goals.map((g, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 font-mono text-[9px] font-bold text-white mt-0.5" style={{ background: 'var(--accent)' }}>
                    {String(i+1).padStart(2,'0')}
                  </div>
                  <div className="text-[13px] leading-snug">{g}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Last report from coach */}
        <div className="col-span-12">
          <Card label="Último reporte del coach · Marco Reyes · Abr 2026" title="Lo que dijeron de ti"
                action={<Btn size="sm" variant="outline" icon="fileDown">PDF</Btn>}>
            <div className="grid md:grid-cols-5 gap-4 text-[12px]">
              {file.dimensions.map((d, i) => (
                <div key={d.key} className="p-3 hairline">
                  <Eyebrow className="!text-[9px] mb-1.5">{String(i+1).padStart(2,'0')} · {d.label}</Eyebrow>
                  <div className="flex items-baseline gap-2 mb-2">
                    <div className="font-num font-black text-[24px] leading-none tnum">{d.score.toFixed(1)}</div>
                    <div className="text-[9px] font-mono text-[var(--ink-mute)]">/ 5</div>
                  </div>
                  <div className="text-[11px] text-[var(--ink-soft)] leading-snug line-clamp-3">{d.summary}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── PADRE DASHBOARD ─────────────────────────────────────────────────────────
function PadreDashboard({ file }) {
  return (
    <>
      <Greeting
        eyebrow={`Padre · Familia ${file.nombre.split(' ').slice(-1)[0]}`}
        name={<>El progreso de {file.nombre.split(' ')[0]}.</>}
        sub={`Vista de solo lectura. Aquí ves lo mismo que ven los coaches sobre el desarrollo de ${file.nombre.split(' ')[0]} en la academia.`}
        action={
          <>
            <Btn variant="outline" size="md" icon="fileDown">Reportes</Btn>
            <Btn variant="primary" size="md" icon="bell">Contactar coach</Btn>
          </>
        }
      />

      <div className="p-6 grid grid-cols-12 gap-4">
        {/* Read-only banner */}
        <div className="col-span-12 px-4 py-2.5 hairline flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider" style={{ background: 'var(--cream)' }}>
          <Icon name="eye" size={12} style={{ color: 'var(--accent)' }} />
          <span className="text-[var(--ink)]">Vista de solo lectura · puedes revisar todo lo que se documenta sobre tu hijo/a</span>
        </div>

        {/* Headline metrics */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-px hairline">
          <StatTile v={file.utr.now.toFixed(1)} label="UTR" sub={`+${file.utr.delta12.toFixed(1)} / 12m · ranking universal`} accent good />
          <StatTile v={`#${file.amtp.now}`} label="AMTP México" sub={file.cat} good />
          <StatTile v="22" label="Torneos jugados" sub="último año" />
          <StatTile v="4" label="Reportes recibidos" sub="último trimestre" />
        </div>

        {/* The voice — emotional hook */}
        <div className="col-span-12 lg:col-span-8">
          <Card dark label={`Lo que dice ${file.nombre.split(' ')[0]} de sí misma`}
                title="Athlete Voice · último PTF"
                action={<Tag color="white" bg="rgba(255,255,255,.12)">Reflexión propia</Tag>}>
            <div className="text-[11px] font-mono mb-4" style={{ color: 'var(--green-soft)' }}>
              {file.voice.latestPTF.torneo} · {file.voice.latestPTF.fecha}
            </div>
            <div className="relative pl-6 border-l-2" style={{ borderColor: 'var(--accent)' }}>
              <Icon name="quote" size={28} className="absolute -left-4 -top-2" style={{ color: 'var(--accent)' }} />
              <p className="font-display italic text-[22px] leading-[1.3] text-white">
                "{file.voice.latestPTF.reflection}"
              </p>
            </div>
            <div className="mt-5 text-[12px] leading-relaxed" style={{ color: 'var(--green-soft)' }}>
              Esta es la voz de tu hijo/a sobre su propio proceso. Es uno de los datos más importantes que documenta la academia.
            </div>
          </Card>
        </div>

        {/* 5 dimensions snapshot */}
        <div className="col-span-12 lg:col-span-4">
          <Card label="5 dimensiones" title="Snapshot · este mes">
            <div className="space-y-3">
              {file.dimensions.map((d, i) => (
                <div key={d.key}>
                  <div className="flex items-baseline justify-between mb-1">
                    <Eyebrow className="!text-[10px]">{String(i+1).padStart(2,'0')} · {d.label}</Eyebrow>
                    <span className="font-num font-black text-[16px] leading-none tnum">{d.score.toFixed(1)}</span>
                  </div>
                  <ScoreBar value={d.score} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent reports */}
        <div className="col-span-12 lg:col-span-7">
          <Card label="Reportes recientes" title="Lo que han documentado los coaches" noPad>
            {file.documents.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hairline-b last:border-b-0 hover:bg-[var(--cream)]">
                <Icon name="file" size={16} style={{ color: 'var(--accent)' }} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-[13px] leading-tight">{d.name}</div>
                  <div className="text-[10px] font-mono text-[var(--ink-mute)] mt-0.5">{d.tag} · {d.type} · {d.size}</div>
                </div>
                <span className="text-[10px] font-mono text-[var(--ink-mute)]">{d.date}</span>
                <Btn variant="outline" size="sm">Leer</Btn>
              </div>
            ))}
          </Card>
        </div>

        {/* Coach + venue */}
        <div className="col-span-12 lg:col-span-5">
          <Card label="Tu equipo" title="Quién entrena a Daniela">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 court-bg shrink-0" />
                <div className="flex-1">
                  <div className="font-display font-bold text-[14px]">{file.coach}</div>
                  <div className="text-[10px] font-mono text-[var(--ink-mute)]">Head coach · responsable</div>
                </div>
                <Btn variant="outline" size="sm" icon="bell">Mensaje</Btn>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 court-bg shrink-0" />
                <div className="flex-1">
                  <div className="font-display font-bold text-[14px]">Dra. Solís</div>
                  <div className="text-[10px] font-mono text-[var(--ink-mute)]">Psicóloga deportiva</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 court-bg shrink-0" />
                <div className="flex-1">
                  <div className="font-display font-bold text-[14px]">R. García</div>
                  <div className="text-[10px] font-mono text-[var(--ink-mute)]">Preparador físico</div>
                </div>
              </div>
            </div>
            <div className="hairline-t mt-5 pt-3 text-[11px] text-[var(--ink-soft)]">
              <Icon name="location" size={12} className="inline mr-1" />
              {file.sede} · {file.turno}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard({ onOpenAthlete }) {
  const pipeline = [
    { stage: '01 · Evaluación',           count: 4, label: 'Evaluaciones agendadas' },
    { stage: '02 · Plan de desarrollo',   count: 6, label: 'Roadmaps activos' },
    { stage: '03 · Circuito de torneos',  count: 14, label: 'Compitiendo regular' },
    { stage: '04 · Perfil universitario', count: 6, label: 'Construyendo Talent Card' },
    { stage: '05 · Contacto universidades', count: 3, label: 'En proceso de outreach' },
    { stage: '06 · La beca',              count: 1, label: 'Carta de oferta recibida' },
  ];
  return (
    <>
      <Greeting
        eyebrow="Admin · Alejandro Tlacaetel · Director"
        name={<>Tu academia hoy.</>}
        sub="Vista global de Top Tenis Performance Academy. Atletas, actividad, pipeline a USA y reportes para sponsors."
        action={
          <>
            <Btn variant="outline" size="md" icon="fileDown">Reporte sponsor</Btn>
            <Btn variant="primary" size="md" icon="plus">Nuevo atleta</Btn>
          </>
        }
      />
      <div className="p-6 grid grid-cols-12 gap-4">
        {/* Big stats */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-5 gap-px hairline">
          <StatTile v="28" label="Atletas activos" sub="+3 vs trim. pasado" icon="users" accent good />
          <StatTile v="8.4" label="UTR promedio" sub="+0.6 / 12m" icon="bolt" good />
          <StatTile v="12" label="Reportes mes" sub="3 pendientes" icon="file" />
          <StatTile v="42" label="Torneos / año" sub="12 ITF · 30 AMTP/UTR" icon="trophy" />
          <StatTile v="6" label="Talent Cards" sub="3 enviadas a USA" icon="sparkle" />
        </div>

        {/* Camino USA Pipeline */}
        <div className="col-span-12">
          <Card label="Pipeline · Camino a USA" title="Atletas por etapa del proceso"
                action={<Btn size="sm" variant="ghost">Ver detalle →</Btn>}>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-px hairline">
              {pipeline.map((p, i) => (
                <div key={i} className="bg-[var(--paper)] p-4 relative">
                  <Eyebrow className="!text-[9px] mb-3">{p.stage}</Eyebrow>
                  <div className="font-num font-black text-[44px] leading-none tnum"
                       style={{ color: i === pipeline.length - 1 ? 'var(--accent)' : 'var(--ink)' }}>
                    {p.count}
                  </div>
                  <div className="text-[10px] text-[var(--ink-soft)] mt-2 leading-snug">{p.label}</div>
                  <div className="absolute bottom-0 left-0 h-[2px]" style={{
                    width: `${Math.min(p.count / 14, 1) * 100}%`,
                    background: i === pipeline.length - 1 ? 'var(--accent)' : 'var(--green-mid)'
                  }} />
                </div>
              ))}
            </div>
            <div className="hairline-t mt-5 pt-3 flex items-center justify-between text-[11px] font-mono text-[var(--ink-mute)] uppercase">
              <span>El embudo se mueve hacia la derecha · cada paso deja entregable</span>
              <span>34 atletas en pipeline · 1 conversión activa</span>
            </div>
          </Card>
        </div>

        {/* Coach performance */}
        <div className="col-span-12 lg:col-span-7">
          <Card label="Equipo de coaches" title="Productividad · este mes"
                action={<Btn size="sm" variant="ghost">Editar equipo</Btn>}
                noPad>
            <table className="w-full text-[12px]">
              <thead className="text-[10px] eyebrow text-[var(--ink-mute)] bg-[var(--cream)]">
                <tr>
                  <th className="text-left px-5 py-2.5">Coach</th>
                  <th className="text-left px-3 py-2.5">Rol</th>
                  <th className="text-right px-3 py-2.5">Atletas</th>
                  <th className="text-right px-3 py-2.5">Reportes</th>
                  <th className="text-right px-5 py-2.5">On-time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Alejandro Tlacaetel', rol: 'Director',      atl: 6, rep: '6/6',  pct: '100%' },
                  { name: 'Marco Reyes',          rol: 'Head Coach',    atl: 8, rep: '7/8',  pct: '88%'  },
                  { name: 'Roberto García',      rol: 'Entrenador',    atl: 7, rep: '6/7',  pct: '86%'  },
                  { name: 'Laura Méndez',        rol: 'Entrenadora',   atl: 7, rep: '7/7',  pct: '100%' },
                ].map((c, i) => (
                  <tr key={i} className="hairline-t hover:bg-[var(--cream)]">
                    <td className="px-5 py-3 font-display font-bold">{c.name}</td>
                    <td className="px-3 py-3 text-[var(--ink-soft)]">{c.rol}</td>
                    <td className="px-3 py-3 text-right font-num font-black text-[16px] tnum">{c.atl}</td>
                    <td className="px-3 py-3 text-right font-mono">{c.rep}</td>
                    <td className="px-5 py-3 text-right">
                      <Tag color={c.pct === '100%' ? 'var(--good)' : 'var(--warn)'}
                           bg={c.pct === '100%' ? 'rgba(22,163,74,.12)' : 'rgba(217,119,6,.12)'}>{c.pct}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Sponsor snapshot */}
        <div className="col-span-12 lg:col-span-5">
          <Card label="Snapshot patrocinador · Yonex" title="Q2 2026"
                action={<Btn size="sm" variant="outline" icon="fileDown">Generar reporte</Btn>}>
            <div className="grid grid-cols-2 gap-px hairline">
              <div className="bg-[var(--paper)] p-3">
                <Eyebrow className="!text-[9px] mb-1">Apariciones · torneos</Eyebrow>
                <div className="font-num font-black text-[28px] leading-none tnum">42</div>
                <div className="text-[10px] font-mono text-[var(--ink-mute)]">tournament photo refs</div>
              </div>
              <div className="bg-[var(--paper)] p-3">
                <Eyebrow className="!text-[9px] mb-1">Resultados destacados</Eyebrow>
                <div className="font-num font-black text-[28px] leading-none tnum">6</div>
                <div className="text-[10px] font-mono text-[var(--ink-mute)]">finales / semis</div>
              </div>
              <div className="bg-[var(--paper)] p-3">
                <Eyebrow className="!text-[9px] mb-1">Atletas con kit</Eyebrow>
                <div className="font-num font-black text-[28px] leading-none tnum">28</div>
                <div className="text-[10px] font-mono text-[var(--ink-mute)]">100% roster</div>
              </div>
              <div className="bg-[var(--paper)] p-3">
                <Eyebrow className="!text-[9px] mb-1">Hashtag mentions</Eyebrow>
                <div className="font-num font-black text-[28px] leading-none tnum">214</div>
                <div className="text-[10px] font-mono text-[var(--ink-mute)]">IG · Q2</div>
              </div>
            </div>
            <div className="hairline-t mt-4 pt-3 text-[11px] text-[var(--ink-soft)]">
              Reporte trimestral programado para envío automático cada 1 del mes siguiente.
            </div>
          </Card>
        </div>

        {/* Cross-academy activity */}
        <div className="col-span-12">
          <Card label="Actividad de la academia" title="Últimas 48 horas" noPad>
            {[
              { who: 'Daniela Hernández',  what: 'PTF · AMTP Puebla Open',          when: 'Hace 5h',   tag: 'Voice',     icon: 'mic' },
              { who: 'Carlos Mendoza',     what: 'Video · Trabajo de piernas',      when: 'Hace 8h',   tag: 'On-court',  icon: 'play' },
              { who: 'Diego Vargas',       what: 'Inscripción ITF J100 Mérida',     when: 'Ayer',      tag: 'Torneos',   icon: 'trophy' },
              { who: 'Sofía Ruiz',         what: 'Reporte mensual · Marco Reyes',  when: 'Ayer',      tag: 'On-court',  icon: 'file' },
              { who: 'Valentina Torres',   what: 'Sesión psicología · Dra. Solís',  when: '2 días',    tag: 'Mental',    icon: 'pulse' },
              { who: 'Rodrigo Ávila',      what: 'Carta de oferta · Univ. Texas',   when: '2 días',    tag: 'Talent',    icon: 'sparkle' },
            ].map((a, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-center px-5 py-3 hairline-b last:border-b-0 hover:bg-[var(--cream)]">
                <div className="col-span-1">
                  <div className="w-7 h-7 flex items-center justify-center" style={{ background: 'var(--cream)', color: 'var(--accent)' }}>
                    <Icon name={a.icon} size={12} />
                  </div>
                </div>
                <div className="col-span-3 font-display font-bold text-[13px]">{a.who}</div>
                <div className="col-span-5 text-[13px]">{a.what}</div>
                <div className="col-span-2">
                  <Tag bg="var(--cream)">{a.tag}</Tag>
                </div>
                <div className="col-span-1 text-right font-mono text-[10px] text-[var(--ink-mute)]">{a.when}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── ESPECIALISTA DASHBOARD (psicólogo as example) ──────────────────────────
function EspecialistaDashboard() {
  const sessions = [
    { athlete: 'Daniela Hernández',  id: 'TTPA-014', when: 'Hoy · 11:00', topic: 'Rutina pre-partido · seguimiento' },
    { athlete: 'Carlos Mendoza',     id: 'TTPA-001', when: 'Hoy · 14:00', topic: 'Control emocional · sets cerrados' },
    { athlete: 'Sofía Ruiz',         id: 'TTPA-002', when: 'Mañana 10:00', topic: 'Primera sesión · evaluación' },
  ];
  return (
    <>
      <Greeting
        eyebrow="Especialista · Dra. Solís · Psicología deportiva"
        name={<>Hola, Dra. Solís.</>}
        sub="Tienes 3 sesiones programadas hoy y 2 reportes mensuales pendientes para el cierre de mes."
        action={<Btn variant="primary" size="md" icon="edit">Capturar reporte</Btn>}
      />
      <div className="p-6 grid grid-cols-12 gap-4">
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-px hairline">
          <StatTile v="12" label="Mis atletas" sub="6 activos esta semana" icon="users" accent />
          <StatTile v="3"  label="Sesiones hoy" sub="2 en cancha · 1 oficina" icon="calendar" />
          <StatTile v="2"  label="Reportes pendientes" sub="cierran 31 May" icon="file" />
          <StatTile v="48" label="Sesiones · trimestre" sub="+12% vs Q1" icon="pulse" good />
        </div>

        <div className="col-span-12 lg:col-span-7">
          <Card label="Sesiones de hoy y mañana" title="Mi agenda" noPad>
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hairline-b last:border-b-0 hover:bg-[var(--cream)]">
                <div className="w-10 h-10 court-bg shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-[14px]">{s.athlete}</div>
                  <div className="text-[11px] text-[var(--ink-soft)] mt-0.5">{s.topic}</div>
                </div>
                <div className="font-mono text-[11px] text-[var(--ink-mute)]">{s.when}</div>
                <Btn variant="outline" size="sm">Abrir</Btn>
              </div>
            ))}
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <Card label="Reportes recientes" title="Últimas evaluaciones que registré" noPad>
            {[
              { who: 'Daniela Hernández', when: '24 Abr', score: 3.9 },
              { who: 'Carlos Mendoza',    when: '20 Abr', score: 3.4 },
              { who: 'Rodrigo Ávila',     when: '15 Abr', score: 4.6 },
              { who: 'Diego Vargas',      when: '08 Abr', score: 4.1 },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hairline-b last:border-b-0">
                <div className="flex-1">
                  <div className="font-display font-bold text-[13px]">{r.who}</div>
                  <div className="text-[10px] font-mono text-[var(--ink-mute)]">{r.when} · Mental</div>
                </div>
                <div className="font-num font-black text-[20px] leading-none tnum">{r.score.toFixed(1)}</div>
                <Icon name="chevRight" size={14} className="text-[var(--ink-mute)]" />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── Dispatch ────────────────────────────────────────────────────────────────
function Dashboard({ role, file, onOpenAthlete }) {
  if (role === 'coach')       return <CoachDashboard onOpenAthlete={onOpenAthlete} />;
  if (role === 'admin')       return <AdminDashboard onOpenAthlete={onOpenAthlete} />;
  if (role === 'atleta')      return <AtletaDashboard file={file} />;
  if (role === 'padre')       return <PadreDashboard file={file} />;
  if (role === 'especialista') return <EspecialistaDashboard />;
  return <CoachDashboard onOpenAthlete={onOpenAthlete} />;
}

Object.assign(window, { Dashboard, CoachDashboard, AtletaDashboard, PadreDashboard, AdminDashboard, EspecialistaDashboard });
