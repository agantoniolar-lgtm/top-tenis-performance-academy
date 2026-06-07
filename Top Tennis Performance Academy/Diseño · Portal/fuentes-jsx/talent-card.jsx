// talent-card.jsx — Talent Card export preview modal

function TalentCardModal({ file, open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 no-print" style={{ background: 'rgba(14,36,25,.78)' }}>
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-[920px] max-h-[90vh] overflow-y-auto bg-[var(--paper)] hairline shadow-2xl">
        {/* Modal chrome */}
        <div className="sticky top-0 z-10 bg-[var(--paper)] hairline-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="sparkle" size={16} style={{ color: 'var(--accent)' }} />
            <Eyebrow>Talent Card · vista previa</Eyebrow>
            <Tag color="var(--accent)" bg="rgba(139,69,19,.1)">Listo para exportar</Tag>
          </div>
          <div className="flex items-center gap-2">
            <Btn size="sm" variant="outline" icon="download">PDF</Btn>
            <Btn size="sm" variant="outline" icon="share">Enlace</Btn>
            <Btn size="sm" variant="primary">Enviar a recruiter →</Btn>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hairline ml-2">
              <Icon name="x" size={14} />
            </button>
          </div>
        </div>

        {/* The Talent Card itself */}
        <TalentCardSheet file={file} />
      </div>
    </div>
  );
}

function TalentCardSheet({ file }) {
  return (
    <div className="bg-white" style={{ aspectRatio: '8.5 / 11', minHeight: 1100 }}>
      {/* Header band */}
      <div className="px-10 pt-10 pb-8 relative" style={{ background: 'var(--green-deep)', color: 'white' }}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex items-start justify-between">
          <div>
            <Eyebrow color="var(--green-soft)">Top Tenis Performance Academy · Talent Card</Eyebrow>
            <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--green-soft)' }}>
              REF · {file.id} · ISSUED 02 MAY 2026 · v2026.05
            </div>
          </div>
          <Logo />
        </div>

        <div className="relative mt-8 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-7">
            <Eyebrow color="var(--accent)">Athlete · {file.cat} · México</Eyebrow>
            <h1 className="font-display font-extrabold leading-[0.92] tracking-[-0.025em] mt-2"
                style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
              {file.nombre}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px]" style={{ color: 'var(--green-soft)' }}>
              <span>{file.edad} años · nac. {file.fechaNac}</span>
              <span>·</span><span>{file.altura} cm / {file.peso} kg · env. {file.envergadura}</span>
              <span>·</span><span>{file.mano} · {file.reves}</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 grid grid-cols-3 gap-3">
            <TCMetric label="UTR" v={file.utr.now.toFixed(1)} sub={`+${file.utr.delta12.toFixed(1)} / 12m`} accent />
            <TCMetric label="AMTP" v={`#${file.amtp.now}`} sub={file.amtp.division} />
            <TCMetric label="ITF SJR" v={`#${file.itf.sjr}`} sub={file.itf.entrants} />
          </div>
        </div>
      </div>

      {/* 5 dimensions strip */}
      <div className="px-10 pt-8">
        <Eyebrow className="mb-3">Five dimensions · 1–5 rubric</Eyebrow>
        <div className="grid grid-cols-5 gap-px hairline-strong">
          {file.dimensions.map((d, i) => (
            <div key={d.key} className="bg-white px-4 py-4 text-center relative">
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: d.score >= 4 ? 'var(--good)' : d.score >= 3 ? 'var(--warn)' : 'var(--bad)' }} />
              <Eyebrow className="!text-[9px] mb-2">{String(i+1).padStart(2,'0')} · {d.label}</Eyebrow>
              <div className="font-num font-black text-[44px] leading-none tnum">{d.score.toFixed(1)}</div>
              <div className="text-[9px] font-mono text-[var(--ink-mute)] mt-1.5 uppercase">{d.owner.split(' ').slice(-1)[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Headline narrative */}
      <div className="px-10 pt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-7">
          <Eyebrow className="mb-3">Coach summary · Marco Reyes, Head Coach</Eyebrow>
          <p className="text-[13px] leading-relaxed text-[var(--ink)]">
            Daniela ingresó en Ago 2024 con UTR 6.4. En 18 meses subió a UTR 9.2 con cuadro principal ITF J60 y finales en AMTP U16. Es una jugadora de plan: 78% de cumplimiento táctico bajo presión. Su área de mayor crecimiento es la respuesta al estrés en sets cerrados — donde ya se ven mejoras concretas (+0.4 vs hace 6 meses). Carácter ejemplar: mentora de jugadoras menores, cero violaciones de código en 12 meses.
          </p>
          <div className="mt-4 hairline-strong p-3 bg-[var(--cream)] text-[11px] flex items-center gap-3">
            <Icon name="quote" size={14} style={{ color: 'var(--accent)' }} />
            <span className="italic text-[var(--ink-soft)]">
              "Es coachable. Lo más importante es la coherencia entre lo que dice y lo que hace en cancha."
            </span>
            <span className="ml-auto font-mono text-[10px] text-[var(--ink-mute)]">Dra. Solís</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-5">
          <Eyebrow className="mb-3">UTR progression · 18 months</Eyebrow>
          <div className="hairline-strong p-3">
            <UTRMini points={file.utrHistory} />
            <div className="flex justify-between text-[9px] font-mono text-[var(--ink-mute)] mt-1">
              <span>{file.utrHistory[0].m}</span>
              <span>TODAY · {file.utr.now.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent results table */}
      <div className="px-10 pt-6">
        <Eyebrow className="mb-3">Recent results · last 6 events</Eyebrow>
        <table className="w-full text-[11px] hairline-strong">
          <thead className="bg-[var(--cream)]">
            <tr className="text-left text-[9px] eyebrow text-[var(--ink-mute)]">
              <th className="px-3 py-2">Event</th>
              <th className="px-3 py-2">Cat</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Round</th>
              <th className="px-3 py-2">Result</th>
              <th className="px-3 py-2 text-right">UTR</th>
            </tr>
          </thead>
          <tbody>
            {file.tournaments.slice(0, 6).map(t => {
              const win = t.result.startsWith('W');
              return (
                <tr key={t.id} className="hairline-t">
                  <td className="px-3 py-2 font-display font-bold">{t.name}</td>
                  <td className="px-3 py-2 font-mono">{t.cat}</td>
                  <td className="px-3 py-2 font-mono text-[var(--ink-soft)]">{t.date}</td>
                  <td className="px-3 py-2">{t.round}</td>
                  <td className="px-3 py-2 font-mono" style={{ color: win ? 'var(--good)' : 'var(--ink)' }}>{t.result}</td>
                  <td className="px-3 py-2 text-right font-num font-black text-[14px] tnum">{t.utr.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer band */}
      <div className="px-10 pt-6 pb-10 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-7">
          <Eyebrow className="mb-3">Athlete voice · last PTF</Eyebrow>
          <p className="text-[12px] italic leading-relaxed text-[var(--ink-soft)] border-l-2 pl-3" style={{ borderColor: 'var(--accent)' }}>
            "{file.voice.latestPTF.reflection}"
          </p>
          <div className="text-[10px] font-mono uppercase text-[var(--ink-mute)] mt-2">
            {file.voice.latestPTF.fecha} · {file.voice.latestPTF.torneo}
          </div>
        </div>
        <div className="col-span-12 md:col-span-5">
          <Eyebrow className="mb-3">Contact · TTPA</Eyebrow>
          <div className="text-[11px] leading-relaxed">
            <div><b>Alejandro Tlacaetel</b> · Director</div>
            <div className="text-[var(--ink-soft)]">alejandro@toptenispa.mx</div>
            <div className="text-[var(--ink-soft)]">+52 564 008 0407</div>
            <div className="font-mono text-[10px] uppercase mt-3 text-[var(--ink-mute)]">
              Casa Blanca Lomas Verdes · Naucalpan · MX
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stamp */}
      <div className="px-10 py-3 hairline-t flex items-center justify-between text-[10px] font-mono uppercase text-[var(--ink-mute)] tracking-wider"
           style={{ background: 'var(--cream)' }}>
        <div>TTPA · TALENT CARD · {file.id}</div>
        <div>EVIDENCE-BASED · 5 DIMENSIONS · {file.dimensions.length} OWNERS</div>
        <div>PG 1 / 1</div>
      </div>
    </div>
  );
}

function TCMetric({ label, v, sub, accent }) {
  return (
    <div className="px-3 py-3 relative" style={{ background: accent ? 'var(--accent)' : 'rgba(255,255,255,.08)', color: 'white' }}>
      <Eyebrow className="!text-[9px] mb-1" color={accent ? 'rgba(255,255,255,.85)' : 'var(--green-soft)'}>{label}</Eyebrow>
      <div className="font-num font-black text-[28px] leading-none tnum">{v}</div>
      <div className="text-[9px] font-mono mt-1 opacity-80">{sub}</div>
    </div>
  );
}

function UTRMini({ points }) {
  const W = 320, H = 100, P = 8;
  const min = 6.0, max = 9.4;
  const x = (i) => P + (i / (points.length - 1)) * (W - P * 2);
  const y = (v) => H - P - ((v - min) / (max - min)) * (H - P * 2);
  const path = points.map((p, i) => (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(p.v).toFixed(1)).join(' ');
  const area = path + ` L${x(points.length - 1)},${H - P} L${x(0)},${H - P} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <path d={area} fill="var(--accent)" opacity="0.12" />
      <path d={path} stroke="var(--accent)" strokeWidth="2" fill="none" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1].v)} r="3" fill="var(--accent)" />
    </svg>
  );
}

Object.assign(window, { TalentCardModal });
