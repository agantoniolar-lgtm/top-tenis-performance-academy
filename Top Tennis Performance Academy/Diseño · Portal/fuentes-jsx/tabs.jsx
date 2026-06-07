// tabs.jsx — Expediente tab panels

// ─────────────────────────────────────────────────────────────────────────────
// RESUMEN — the killer overview
// ─────────────────────────────────────────────────────────────────────────────
function TabResumen({ file, onOpenTalentCard, onTab }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* 5 dimensions */}
      <div className="col-span-12 lg:col-span-8">
        <Card label="Expediente · 5 dimensiones"
              title="Las 5 dimensiones que evalúa la academia"
              action={
                <div className="flex items-center gap-2">
                  <Btn size="sm" variant="outline" icon="download">Exportar</Btn>
                  <Btn size="sm" variant="primary" icon="sparkle" onClick={onOpenTalentCard}>Talent Card</Btn>
                </div>
              } noPad>
          <div className="grid grid-cols-2 md:grid-cols-5">
            {file.dimensions.map((d, i) => (
              <button key={d.key} onClick={() => onTab(d.key)}
                      className={`flex flex-col items-center py-6 px-4 text-center hairline-r relative group transition hover:bg-[var(--cream)]`}
                      style={{ borderRight: i < 4 ? '1px solid var(--line)' : 'none' }}>
                <div className="w-9 h-9 flex items-center justify-center mb-3"
                     style={{ background: 'var(--green)', color: '#fff' }}>
                  <Icon name={d.icon} size={16} />
                </div>
                <Eyebrow className="!text-[9px] mb-1">{String(i+1).padStart(2,'0')} · {d.label}</Eyebrow>
                <div className="font-num font-black text-[40px] leading-none tnum">{d.score.toFixed(1)}</div>
                <div className="text-[10px] text-[var(--ink-mute)] mt-1 font-mono">{d.updated}</div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition" style={{ color: 'var(--accent)' }}>
                  <Icon name="arrow" size={12} />
                </div>
              </button>
            ))}
          </div>

          {/* Owner & ranges */}
          <div className="px-5 py-3 hairline-t flex items-center justify-between text-[11px] font-mono uppercase">
            <div className="text-[var(--ink-mute)]">Rúbrica 1–5 · anécdota escrita por dimensión</div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2" style={{ background: 'var(--good)' }} /> 4.0–5.0</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2" style={{ background: 'var(--warn)' }} /> 3.0–3.9</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2" style={{ background: 'var(--bad)' }} /> &lt; 3.0</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Composite radar */}
      <div className="col-span-12 lg:col-span-4">
        <Card label="Perfil multidimensional" title="Composite">
          <Radar dimensions={file.dimensions} self={file.voice.selfRating} />
          <div className="hairline-t pt-3 mt-2 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1.5" style={{ background: 'var(--accent)' }} />
              <span className="text-[var(--ink)] font-medium">Coach / staff</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 border" style={{ borderColor: 'var(--ink)' }} />
              <span className="text-[var(--ink-soft)]">Auto-evaluación</span>
            </span>
          </div>
        </Card>
      </div>

      {/* UTR Progression */}
      <div className="col-span-12 lg:col-span-8">
        <Card label="Progresión UTR · 18 meses"
              title="UTR 9.2 / +1.8 vs hace 12m"
              action={
                <div className="flex items-center gap-1">
                  {['UTR', 'AMTP', 'ITF SJR'].map((p, i) => (
                    <button key={p} className={`px-2.5 h-7 text-[11px] font-mono uppercase tracking-wider ${i===0?'text-white':'text-[var(--ink-mute)]'}`}
                            style={i===0?{ background: 'var(--ink)' }:{}}>{p}</button>
                  ))}
                </div>
              }>
          <UTRChart points={file.utrHistory} />
          <div className="mt-4 grid grid-cols-4 gap-px hairline">
            <Metric label="Actual"  v={file.utr.now.toFixed(1)} />
            <Metric label="Hace 12m" v="7.4" delta="+1.8" good />
            <Metric label="AMTP"    v={`#${file.amtp.now}`} delta="↑7" good />
            <Metric label="ITF SJR" v={`#${file.itf.sjr}`} delta="+86 pts" good />
          </div>
        </Card>
      </div>

      {/* Activity feed */}
      <div className="col-span-12 lg:col-span-4">
        <Card label="Actividad reciente" title="Últimos eventos"
              action={<button className="text-[10px] font-mono uppercase hover:underline" style={{ color: 'var(--accent)' }}>Ver todo</button>}
              noPad>
          <div>
            {file.activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3 hairline-b last:border-b-0">
                <div className="w-7 h-7 flex items-center justify-center shrink-0 mt-0.5"
                     style={{ background: 'var(--cream)', color: 'var(--accent)' }}>
                  <Icon name={
                    a.type === 'video' ? 'play' :
                    a.type === 'ptf' ? 'mic' :
                    a.type === 'session' ? 'pulse' :
                    a.type === 'fitness' ? 'bolt' :
                    a.type === 'check' ? 'check' : 'file'
                  } size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-[var(--ink)] leading-snug">{a.what}</div>
                  <div className="text-[10px] text-[var(--ink-mute)] mt-0.5 flex items-center gap-1.5">
                    <span>{a.who}</span>·<span>{a.when}</span>
                  </div>
                </div>
                <Tag color="var(--accent)" bg="transparent" className="!px-0 !text-[9px]">{a.tag}</Tag>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Latest tournament */}
      <div className="col-span-12 lg:col-span-7">
        <Card label="Torneos recientes" title="Resultados · últimos 6"
              action={<Btn size="sm" variant="ghost" onClick={() => onTab('tournaments')}>Ver todos →</Btn>}
              noPad>
          <table className="w-full text-[12px]">
            <thead className="text-[10px] eyebrow text-[var(--ink-mute)]">
              <tr>
                <th className="text-left px-5 py-2.5">Torneo</th>
                <th className="text-left px-3 py-2.5 hidden md:table-cell">Fecha</th>
                <th className="text-left px-3 py-2.5">Ronda</th>
                <th className="text-left px-3 py-2.5">Resultado</th>
                <th className="text-right px-5 py-2.5">UTR</th>
              </tr>
            </thead>
            <tbody>
              {file.tournaments.slice(0, 6).map(t => {
                const win = t.result.startsWith('W');
                return (
                  <tr key={t.id} className="hairline-t hover:bg-[var(--cream)] transition">
                    <td className="px-5 py-3">
                      <div className="font-display font-bold text-[13px] leading-tight">{t.name}</div>
                      <div className="text-[10px] text-[var(--ink-mute)] mt-0.5">{t.cat}</div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell font-mono text-[11px] text-[var(--ink-soft)]">{t.date}</td>
                    <td className="px-3 py-3">
                      <Tag bg="var(--cream)">{t.round}</Tag>
                    </td>
                    <td className="px-3 py-3 font-mono text-[11px]" style={{ color: win ? 'var(--good)' : 'var(--ink)' }}>
                      <span className="font-bold mr-1">{t.result.slice(0,1)}</span>{t.result.slice(2)}
                    </td>
                    <td className="px-5 py-3 text-right font-num font-black text-[16px] tnum">{t.utr.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Athlete voice — latest PTF */}
      <div className="col-span-12 lg:col-span-5">
        <Card label="05 · Athlete Voice · último PTF"
              title="La voz del propio atleta"
              action={<Tag color="var(--accent)" bg="var(--cream)">Completo</Tag>}>
          <div className="mb-3">
            <div className="font-display font-bold text-[15px] leading-tight">{file.voice.latestPTF.torneo}</div>
            <div className="text-[11px] font-mono text-[var(--ink-mute)] mt-1">{file.voice.latestPTF.fecha} · {file.voice.latestPTF.result}</div>
          </div>
          <div className="relative pl-4 mt-4 border-l-2" style={{ borderColor: 'var(--accent)' }}>
            <Icon name="quote" size={20} className="absolute -left-3 -top-1" style={{ color: 'var(--accent)' }} />
            <p className="text-[14px] leading-relaxed text-[var(--ink)] italic">
              "{file.voice.latestPTF.reflection}"
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
            <div className="bg-[var(--cream)] p-3">
              <Eyebrow className="mb-1.5 !text-[9px]">Lo que aprendí</Eyebrow>
              <div className="leading-snug">{file.voice.latestPTF.learned}</div>
            </div>
            <div className="bg-[var(--cream)] p-3">
              <Eyebrow className="mb-1.5 !text-[9px]">Próximo foco</Eyebrow>
              <div className="leading-snug">{file.voice.latestPTF.nextFocus}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, v, delta, good }) {
  return (
    <div className="bg-[var(--paper)] px-4 py-3">
      <div className="eyebrow !text-[9px] mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="font-num font-black text-[24px] leading-none tnum">{v}</div>
        {delta && (
          <div className="text-[10px] font-mono font-bold" style={{ color: good ? 'var(--good)' : 'var(--bad)' }}>{delta}</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UTR Chart
// ─────────────────────────────────────────────────────────────────────────────
function UTRChart({ points }) {
  const [hover, setHover] = useStateShell(null);
  const W = 720, H = 200, P = 28;
  const min = 6.0, max = 9.6;
  const x = (i) => P + (i / (points.length - 1)) * (W - P * 2);
  const y = (v) => H - P - ((v - min) / (max - min)) * (H - P * 2);
  const path = points.map((p, i) => (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(p.v).toFixed(1)).join(' ');
  const area = path + ` L${x(points.length - 1)},${H - P} L${x(0)},${H - P} Z`;
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[6, 7, 8, 9].map((v, i) => (
          <g key={v}>
            <line x1={P} x2={W-P} y1={y(v)} y2={y(v)} stroke="var(--line)" />
            <text x={4} y={y(v)+3} fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-mute)">{v}.0</text>
          </g>
        ))}
        <path d={area} fill="var(--accent)" opacity="0.10" />
        <path d={path} stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <rect x={x(i) - 12} y={P} width={24} height={H - P*2} fill="transparent" />
            {(i === points.length - 1 || hover === i) && (
              <circle cx={x(i)} cy={y(p.v)} r="4" fill="var(--accent)" stroke="white" strokeWidth="2" />
            )}
            {hover === i && (
              <g>
                <line x1={x(i)} x2={x(i)} y1={P} y2={H-P} stroke="var(--ink)" strokeDasharray="2 3" opacity="0.4" />
                <rect x={x(i)-30} y={y(p.v)-30} width="60" height="22" fill="var(--ink)" />
                <text x={x(i)} y={y(p.v)-15} textAnchor="middle" fontSize="11" fontFamily="Big Shoulders Display" fontWeight="900" fill="white">{p.v.toFixed(1)}</text>
              </g>
            )}
          </g>
        ))}
        {/* x-axis labels */}
        {points.filter((_, i) => i % 4 === 0).map((p, i) => (
          <text key={i} x={x(i * 4)} y={H - 8} fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-mute)" textAnchor="middle">{p.m}</text>
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Radar
// ─────────────────────────────────────────────────────────────────────────────
function Radar({ dimensions, self }) {
  const dims = dimensions.map(d => ({ label: d.label, score: d.score }));
  const selfMap = Object.fromEntries(self.map(s => [s.k, s.v]));
  // Add a 5th self entry for Voice = score itself
  const N = dims.length;
  const cx = 110, cy = 110, R = 80;
  const angle = (i) => -Math.PI / 2 + (2 * Math.PI * i) / N;
  const point = (i, val) => {
    const r = (val / 5) * R;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };
  const coachPts = dims.map((d, i) => point(i, d.score));
  const selfPts  = dims.map((d, i) => point(i, selfMap[d.label] != null ? selfMap[d.label] : d.score));
  const toStr = (pts) => pts.map(p => p.join(',')).join(' ');
  return (
    <svg viewBox="0 0 220 220" className="w-full">
      {/* rings */}
      {[1,2,3,4,5].map(r => (
        <polygon key={r} fill="none" stroke="var(--line)"
                 points={dims.map((_, i) => point(i, r).join(',')).join(' ')} />
      ))}
      {/* spokes */}
      {dims.map((d, i) => {
        const [px, py] = point(i, 5);
        return <line key={i} x1={cx} y1={cy} x2={px} y2={py} stroke="var(--line)" />;
      })}
      {/* self */}
      <polygon points={toStr(selfPts)} fill="none" stroke="var(--ink)" strokeWidth="1.2" strokeDasharray="3 3" />
      {/* coach */}
      <polygon points={toStr(coachPts)} fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="2" />
      {/* labels */}
      {dims.map((d, i) => {
        const [px, py] = point(i, 5.6);
        return (
          <text key={i} x={px} y={py} textAnchor="middle" dominantBaseline="middle"
                fontSize="9" fontFamily="Manrope" fontWeight="700" letterSpacing="0.06em"
                fill="var(--ink-soft)" style={{ textTransform: 'uppercase' }}>
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ON-COURT tab
// ─────────────────────────────────────────────────────────────────────────────
function TabOnCourt({ file }) {
  const oc = file.oncourt;
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8">
        <Card label="Rúbrica de calidad de golpes" title="Stroke quality"
              action={<Btn size="sm" variant="outline" icon="edit">Nuevo reporte</Btn>}>
          <div className="space-y-5">
            {oc.strokes.map(s => (
              <div key={s.key} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-3 md:col-span-2">
                  <div className="font-display font-bold text-[14px] capitalize">{s.label}</div>
                  <Eyebrow className="!text-[9px] mt-1">1–5</Eyebrow>
                </div>
                <div className="col-span-9 md:col-span-4">
                  <ScoreBar value={s.score} />
                </div>
                <div className="col-span-12 md:col-span-6 text-[12px] text-[var(--ink-soft)] leading-snug">{s.note}</div>
              </div>
            ))}
          </div>

          <div className="hairline-t mt-6 pt-5">
            <div className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-3 md:col-span-2">
                <div className="font-display font-bold text-[14px]">Tactics</div>
                <Eyebrow className="!text-[9px] mt-1">Decisión</Eyebrow>
              </div>
              <div className="col-span-9 md:col-span-4">
                <ScoreBar value={oc.tactics.score} />
              </div>
              <div className="col-span-12 md:col-span-6 text-[12px] text-[var(--ink-soft)] leading-snug">{oc.tactics.note}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <Card label="Clips" title="Resumen de partido"
              action={<Btn size="sm" variant="ghost" icon="plus">Subir</Btn>}
              noPad>
          {oc.clips.map(c => (
            <div key={c.id} className="hairline-b last:border-b-0 flex items-center gap-3 p-4 group hover:bg-[var(--cream)] cursor-pointer">
              <div className="relative w-20 h-12 court-bg shrink-0 flex items-center justify-center">
                <Icon name="play" size={16} className="text-white absolute" />
                <div className="absolute bottom-0.5 right-1 text-[9px] font-mono text-white">{c.dur}</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium leading-snug">{c.label}</div>
                <div className="text-[10px] font-mono text-[var(--ink-mute)] mt-1">{c.date}</div>
              </div>
            </div>
          ))}
          <div className="px-4 py-3 hairline-t flex items-center justify-between text-[11px] font-mono">
            <span className="text-[var(--ink-mute)]">UTR al reporte: <span className="text-[var(--ink)] font-bold">9.2</span></span>
            <button className="hover:underline" style={{ color: 'var(--accent)' }}>+ Adjuntar más →</button>
          </div>
        </Card>
      </div>

      <div className="col-span-12">
        <Card label="Resumen del coach · Marco Reyes · 02 May 2026"
              title="Reporte mensual" dark>
          <div className="grid md:grid-cols-2 gap-6 text-white/85 text-[14px] leading-relaxed">
            <p>
              Daniela tuvo un mes muy productivo. La final del AMTP Puebla fue una excelente lectura de su nivel: ganó dos sets contra una jugadora top y solo perdió porque su patrón se rompió en momentos clave. Su saque sigue mejorando: el primero llegó al 64% promedio del mes, con velocidades medias arriba de 150 km/h.
            </p>
            <p>
              Lo que sigue es la consolidación: trabajar el segundo servicio bajo presión y la volea de revés. En lo táctico es muy disciplinada; lo que necesita es la fortaleza mental para mantener su plan cuando la cuenta se cierra. Ya estamos coordinando con la Dra. Solís rutinas específicas para el último game.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHYSICAL tab
// ─────────────────────────────────────────────────────────────────────────────
function TabPhysical({ file }) {
  const p = file.physical;
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-4">
        <Card label="Antropometría" title="Cuerpo">
          <div className="space-y-4">
            {p.anthro.map((a, i) => (
              <div key={i} className="flex items-baseline justify-between hairline-b last:border-b-0 pb-3 last:pb-0">
                <Eyebrow className="!text-[10px]">{a.k}</Eyebrow>
                <div className="text-right">
                  <div className="font-num font-black text-[22px] leading-none tnum">{a.v}</div>
                  <div className="text-[10px] font-mono text-[var(--ink-mute)] mt-0.5">{a.d}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <Card label="Batería de fitness · Q2 2026" title="Performance tests"
              action={<Tag color="var(--good)" bg="rgba(22,163,74,.12)">Todas mejoran</Tag>}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px hairline">
            {p.fitness.map((f, i) => (
              <div key={i} className="bg-[var(--paper)] p-4">
                <Eyebrow className="!text-[10px] mb-2">{f.k}</Eyebrow>
                <div className="font-num font-black text-[32px] leading-none tnum">{f.v}</div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono"
                     style={{ color: f.good ? 'var(--good)' : 'var(--bad)' }}>
                  <Icon name={f.good ? 'arrowUp' : 'arrowDown'} size={12} />
                  <span className="font-bold">{f.d}</span>
                  <span className="text-[var(--ink-mute)]">vs Q1</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="col-span-12">
        <Card label="Timeline de lesiones" title="Historial · sin lesiones activas"
              action={<Tag color="var(--good)" bg="rgba(22,163,74,.12)">Apto · sin restricciones</Tag>}>
          <div className="relative">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-[var(--line-strong)]" />
            {p.injuries.map((inj, i) => (
              <div key={i} className="relative pl-10 pb-5 last:pb-0">
                <div className="absolute left-[8px] top-1 w-3 h-3"
                     style={{ background: inj.status === 'Activa' ? 'var(--bad)' : 'var(--good)' }} />
                <div className="flex items-baseline justify-between mb-1">
                  <div>
                    <div className="font-display font-bold text-[14px]">{inj.type}</div>
                    <div className="text-[11px] font-mono text-[var(--ink-mute)] mt-0.5">{inj.date} · {inj.weeks} semanas</div>
                  </div>
                  <Tag color={inj.status === 'Activa' ? 'var(--bad)' : 'var(--ink-soft)'}
                       bg={inj.status === 'Activa' ? 'rgba(220,38,38,.1)' : 'var(--cream)'}>
                    {inj.status}
                  </Tag>
                </div>
                <p className="text-[12px] text-[var(--ink-soft)]">{inj.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MENTAL tab
// ─────────────────────────────────────────────────────────────────────────────
function TabMental({ file }) {
  const m = file.mental;
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-7">
        <Card label="Métricas psicología · Dra. Solís"
              title="Mental performance · evaluación periódica"
              action={<Btn size="sm" variant="outline" icon="edit">Nueva sesión</Btn>}>
          <div className="space-y-6">
            {m.metrics.map((mt, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-start hairline-b pb-5 last:border-b-0 last:pb-0">
                <div className="col-span-12 md:col-span-4">
                  <div className="font-display font-bold text-[14px]">{mt.k}</div>
                  <Eyebrow className="!text-[9px] mt-1">1–5</Eyebrow>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <ScoreBar value={mt.v} />
                </div>
                <div className="col-span-12 md:col-span-5 text-[12px] text-[var(--ink-soft)] leading-snug">{mt.note}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-5">
        <Card label="Sesiones recientes" title="Bitácora psicología" noPad>
          {m.recentSessions.map((s, i) => (
            <div key={i} className="p-4 hairline-b last:border-b-0">
              <div className="flex items-baseline justify-between mb-1.5">
                <Eyebrow className="!text-[10px]">{s.topic}</Eyebrow>
                <span className="text-[10px] font-mono text-[var(--ink-mute)]">{s.date}</span>
              </div>
              <div className="text-[13px] text-[var(--ink)]">{s.focus}</div>
            </div>
          ))}
          <div className="p-4 hairline-t bg-[var(--cream)]">
            <div className="flex items-center gap-2 text-[12px]">
              <Icon name="quote" size={14} style={{ color: 'var(--accent)' }} />
              <span className="italic text-[var(--ink-soft)]">
                "Es coachable. Lo más importante es la coherencia entre lo que dice y lo que hace en cancha."
              </span>
            </div>
            <div className="text-[10px] font-mono uppercase text-[var(--ink-mute)] mt-2">Dra. Solís · 24 Abr 2026</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHARACTER tab
// ─────────────────────────────────────────────────────────────────────────────
function TabCharacter({ file }) {
  const c = file.character;
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-5">
        <Card label="Ética de trabajo · 1–5" title="Work ethic">
          <div className="flex items-center gap-6">
            <ScoreRing value={c.workEthic} size={120} />
            <div className="flex-1">
              <Eyebrow className="!text-[10px] mb-1">Anécdota</Eyebrow>
              <p className="text-[13px] leading-relaxed">{c.workEthicNote}</p>
              <div className="mt-3 text-[10px] font-mono text-[var(--ink-mute)] uppercase">Owner · Marco Reyes</div>
            </div>
          </div>
        </Card>

        <div className="mt-4">
          <Card label="Liderazgo y mentoría" title="Evidencia">
            <p className="text-[13px] leading-relaxed text-[var(--ink)]">{c.leadership}</p>
          </Card>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-7">
        <Card label="Registro de conducta" title="Conduct log"
              action={<Btn size="sm" variant="ghost" icon="plus">Agregar</Btn>}
              noPad>
          {c.conduct.map((e, i) => (
            <div key={i} className="p-5 hairline-b last:border-b-0 flex gap-4">
              <div className="w-9 h-9 flex items-center justify-center shrink-0"
                   style={{
                     background: e.type === 'positivo' ? 'rgba(22,163,74,.12)' : 'rgba(220,38,38,.1)',
                     color: e.type === 'positivo' ? 'var(--good)' : 'var(--bad)'
                   }}>
                <Icon name={e.type === 'positivo' ? 'check' : 'flag'} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <Tag color={e.type === 'positivo' ? 'var(--good)' : 'var(--bad)'}
                       bg={e.type === 'positivo' ? 'rgba(22,163,74,.12)' : 'rgba(220,38,38,.1)'}>
                    {e.type}
                  </Tag>
                  <span className="text-[10px] font-mono text-[var(--ink-mute)]">{e.date}</span>
                </div>
                <p className="text-[13px] leading-relaxed">{e.note}</p>
              </div>
            </div>
          ))}
          <div className="px-5 py-3 hairline-t text-[11px] font-mono text-[var(--ink-mute)] flex items-center justify-between">
            <span>Cero violaciones de código en 12 meses</span>
            <span className="text-[var(--good)] font-bold">★ ★ ★ ★ ★</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VOICE tab — Athlete Voice (PTFs + goals + self-rating)
// ─────────────────────────────────────────────────────────────────────────────
function TabVoice({ file }) {
  const v = file.voice;
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Featured PTF */}
      <div className="col-span-12 lg:col-span-8">
        <Card dark label="PTF más reciente · en primera persona"
              title={v.latestPTF.torneo}
              action={<Tag color="white" bg="rgba(255,255,255,.12)">Mood {v.latestPTF.mood}/5</Tag>}>
          <div className="text-[12px] font-mono uppercase mb-4" style={{ color: 'var(--green-soft)' }}>
            {v.latestPTF.fecha} · {v.latestPTF.result}
          </div>
          <div className="relative pl-6 border-l-2" style={{ borderColor: 'var(--accent)' }}>
            <Icon name="quote" size={28} className="absolute -left-4 -top-2" style={{ color: 'var(--accent)' }} />
            <p className="font-display italic text-[24px] leading-[1.25] text-white">
              "{v.latestPTF.reflection}"
            </p>
          </div>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4">
              <Eyebrow className="mb-2 !text-[9px]" color="var(--green-soft)">Lo que aprendí</Eyebrow>
              <div className="text-[14px] leading-relaxed text-white">{v.latestPTF.learned}</div>
            </div>
            <div className="bg-white/5 p-4">
              <Eyebrow className="mb-2 !text-[9px]" color="var(--green-soft)">Próximo foco</Eyebrow>
              <div className="text-[14px] leading-relaxed text-white">{v.latestPTF.nextFocus}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Self-rating */}
      <div className="col-span-12 lg:col-span-4">
        <Card label="Auto-evaluación" title="Cómo se ve a sí misma">
          <div className="space-y-4">
            {v.selfRating.map((s, i) => {
              const coach = file.dimensions.find(d => d.label === s.k);
              return (
                <div key={i}>
                  <div className="flex items-baseline justify-between mb-2">
                    <Eyebrow className="!text-[10px]">{s.k}</Eyebrow>
                    <div className="font-mono text-[10px] text-[var(--ink-mute)]">
                      vs coach <span className="text-[var(--ink)] font-bold">{coach ? coach.score.toFixed(1) : '—'}</span>
                    </div>
                  </div>
                  <div className="relative h-2.5">
                    <div className="absolute inset-0" style={{ background: 'var(--line)' }} />
                    {coach && (
                      <div className="absolute top-0 bottom-0" style={{
                        left: 0, width: `${(coach.score / 5) * 100}%`, background: 'var(--accent)'
                      }} />
                    )}
                    <div className="absolute -top-1 bottom-[-4px] w-px"
                         style={{ left: `${(s.v / 5) * 100}%`, background: 'var(--ink)' }} />
                    <div className="absolute -top-1 w-2 h-2"
                         style={{ left: `calc(${(s.v / 5) * 100}% - 4px)`, background: 'var(--ink)' }} />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-num font-black text-[14px] tnum">{s.v.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hairline-t mt-5 pt-3 flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1.5" style={{ background: 'var(--accent)' }} /> Coach</span>
            <span className="flex items-center gap-1.5"><span className="w-px h-3" style={{ background: 'var(--ink)' }} /> Self</span>
          </div>
        </Card>
      </div>

      {/* Goals */}
      <div className="col-span-12 lg:col-span-7">
        <Card label="Metas a 6 meses · declaradas por la atleta" title="Goals">
          <ul className="space-y-3">
            {v.goals.map((g, i) => (
              <li key={i} className="flex items-start gap-3 hairline-b pb-3 last:border-b-0 last:pb-0">
                <div className="w-6 h-6 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold text-white" style={{ background: 'var(--accent)' }}>
                  {String(i+1).padStart(2,'0')}
                </div>
                <div className="text-[14px] leading-snug pt-0.5">{g}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-5">
        <Card label="PTFs · histórico" title="Reflexiones por torneo"
              action={<button className="text-[10px] font-mono uppercase" style={{ color: 'var(--accent)' }}>Ver todos →</button>}
              noPad>
          {file.tournaments.slice(0, 5).map((t, i) => (
            <div key={t.id} className="px-4 py-3 hairline-b last:border-b-0 flex items-center gap-3">
              <Icon name="mic" size={14} style={{ color: 'var(--accent)' }} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium leading-tight truncate">{t.name}</div>
                <div className="text-[10px] font-mono text-[var(--ink-mute)] mt-0.5">{t.date}</div>
              </div>
              <Tag color="var(--good)" bg="rgba(22,163,74,.12)">Completo</Tag>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOURNAMENTS tab
// ─────────────────────────────────────────────────────────────────────────────
function TabTournaments({ file }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <Card label="Historial de torneos" title="Tournaments · 2024–2026"
              action={
                <div className="flex items-center gap-1">
                  {['Todos','AMTP','ITF','UTR'].map((p, i) => (
                    <button key={p} className={`px-2.5 h-7 text-[11px] font-mono uppercase ${i===0?'text-white':'text-[var(--ink-mute)]'}`}
                            style={i===0?{ background: 'var(--ink)' }:{}}>{p}</button>
                  ))}
                </div>
              } noPad>
          <table className="w-full text-[12px]">
            <thead className="text-[10px] eyebrow text-[var(--ink-mute)] bg-[var(--cream)]">
              <tr>
                <th className="text-left px-5 py-2.5 w-[36px]">#</th>
                <th className="text-left px-3 py-2.5">Torneo</th>
                <th className="text-left px-3 py-2.5">Cat.</th>
                <th className="text-left px-3 py-2.5">Fecha</th>
                <th className="text-left px-3 py-2.5">Ronda</th>
                <th className="text-left px-3 py-2.5">Resultado</th>
                <th className="text-right px-3 py-2.5">UTR</th>
                <th className="text-right px-5 py-2.5">PTF</th>
              </tr>
            </thead>
            <tbody>
              {file.tournaments.map((t, i) => {
                const win = t.result.startsWith('W');
                return (
                  <tr key={t.id} className="hairline-t hover:bg-[var(--cream)]">
                    <td className="px-5 py-3 font-mono text-[10px] text-[var(--ink-mute)]">{String(i+1).padStart(2,'0')}</td>
                    <td className="px-3 py-3 font-display font-bold">{t.name}</td>
                    <td className="px-3 py-3"><Tag bg="var(--cream)">{t.cat}</Tag></td>
                    <td className="px-3 py-3 font-mono text-[11px] text-[var(--ink-soft)]">{t.date}</td>
                    <td className="px-3 py-3 font-semibold">{t.round}</td>
                    <td className="px-3 py-3 font-mono text-[11px]" style={{ color: win ? 'var(--good)' : 'var(--ink)' }}>{t.result}</td>
                    <td className="px-3 py-3 text-right font-num font-black text-[16px] tnum">{t.utr.toFixed(1)}</td>
                    <td className="px-5 py-3 text-right">
                      <Tag color="var(--good)" bg="rgba(22,163,74,.12)">Completo</Tag>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTS tab
// ─────────────────────────────────────────────────────────────────────────────
function TabDocuments({ file }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <Card label="Documentos del expediente" title="Reports · PTFs · Plans"
              action={<Btn size="sm" variant="outline" icon="plus">Subir documento</Btn>}
              noPad>
          <table className="w-full text-[12px]">
            <thead className="text-[10px] eyebrow text-[var(--ink-mute)] bg-[var(--cream)]">
              <tr>
                <th className="text-left px-5 py-2.5">Documento</th>
                <th className="text-left px-3 py-2.5">Dimensión</th>
                <th className="text-left px-3 py-2.5">Tipo</th>
                <th className="text-left px-3 py-2.5">Tamaño</th>
                <th className="text-left px-3 py-2.5">Fecha</th>
                <th className="text-right px-5 py-2.5">Acción</th>
              </tr>
            </thead>
            <tbody>
              {file.documents.map((d, i) => (
                <tr key={i} className="hairline-t hover:bg-[var(--cream)]">
                  <td className="px-5 py-3 font-display font-bold flex items-center gap-3">
                    <Icon name="file" size={16} style={{ color: 'var(--accent)' }} />
                    {d.name}
                  </td>
                  <td className="px-3 py-3"><Tag bg="var(--cream)">{d.tag}</Tag></td>
                  <td className="px-3 py-3 font-mono text-[11px]">{d.type}</td>
                  <td className="px-3 py-3 font-mono text-[11px] text-[var(--ink-soft)]">{d.size}</td>
                  <td className="px-3 py-3 font-mono text-[11px] text-[var(--ink-soft)]">{d.date}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-[var(--accent)] hover:underline text-[10px] font-mono uppercase">
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, {
  TabResumen, TabOnCourt, TabPhysical, TabMental, TabCharacter, TabVoice, TabTournaments, TabDocuments,
  UTRChart, Radar, Metric,
});
