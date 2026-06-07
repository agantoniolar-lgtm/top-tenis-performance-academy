// expediente.jsx — Expediente header + tab orchestration

const { useState: useStateExp } = React;

function Expediente({ athleteId, file, role, onOpenTalentCard }) {
  const [tab, setTab] = useStateExp('resumen');

  const tabs = [
    { id: 'resumen',     label: 'Resumen',        icon: 'home' },
    { id: 'oncourt',     label: 'On-court',       icon: 'racket' },
    { id: 'physical',    label: 'Physical',       icon: 'bolt' },
    { id: 'mental',      label: 'Mental',         icon: 'pulse' },
    { id: 'character',   label: 'Character',      icon: 'shield' },
    { id: 'voice',       label: 'Athlete Voice',  icon: 'mic' },
    { id: 'tournaments', label: 'Torneos',        icon: 'trophy', count: file.tournaments.length },
    { id: 'documents',   label: 'Documentos',     icon: 'folder', count: file.documents.length },
  ];

  const goTab = (id) => {
    const targetMap = {
      oncourt: 'oncourt', physical: 'physical', mental: 'mental', character: 'character', voice: 'voice',
      tournaments: 'tournaments',
    };
    setTab(targetMap[id] || id);
  };

  return (
    <div className="flex-1 min-w-0">
      <ExpedienteHeader file={file} role={role} onOpenTalentCard={onOpenTalentCard} />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="p-6">
        {tab === 'resumen'     && <TabResumen     file={file} onOpenTalentCard={onOpenTalentCard} onTab={goTab} />}
        {tab === 'oncourt'     && <TabOnCourt     file={file} />}
        {tab === 'physical'    && <TabPhysical    file={file} />}
        {tab === 'mental'      && <TabMental      file={file} />}
        {tab === 'character'   && <TabCharacter   file={file} />}
        {tab === 'voice'       && <TabVoice       file={file} />}
        {tab === 'tournaments' && <TabTournaments file={file} />}
        {tab === 'documents'   && <TabDocuments   file={file} />}
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function ExpedienteHeader({ file, role, onOpenTalentCard }) {
  const readOnly = role === 'atleta' || role === 'padre';
  return (
    <header className="bg-[var(--paper)] hairline-b">
      <div className="px-6 py-6">
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Identity */}
          <div className="col-span-12 lg:col-span-5 flex gap-5">
            <div className="w-[88px] h-[112px] court-bg shrink-0 relative">
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <div className="font-mono text-[9px] text-white/80">{file.id}</div>
              </div>
            </div>
            <div className="min-w-0">
              <Eyebrow className="!text-[10px] mb-1">Expediente del atleta</Eyebrow>
              <h1 className="font-display font-extrabold text-[36px] leading-[0.95] tracking-[-0.02em]">{file.nombre}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[12px] text-[var(--ink-soft)]">
                <span><b className="text-[var(--ink)]">{file.cat}</b> · {file.edad} años</span>
                <span className="text-[var(--ink-mute)]">·</span>
                <span>Coach <b className="text-[var(--ink)]">{file.coach}</b></span>
                <span className="text-[var(--ink-mute)]">·</span>
                <span>Ingreso <b className="text-[var(--ink)]">{file.ingreso}</b></span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Tag color="var(--accent)" bg="rgba(139,69,19,.10)">{file.mano} · {file.reves}</Tag>
                <Tag bg="var(--cream)">{file.sede}</Tag>
                <Tag bg="var(--cream)">{file.turno}</Tag>
              </div>
            </div>
          </div>

          {/* Headline metrics */}
          <div className="col-span-12 lg:col-span-5">
            <div className="grid grid-cols-3 gap-px hairline">
              <HeadlineMetric label="UTR" v={file.utr.now.toFixed(1)} delta={`+${file.utr.delta12.toFixed(1)} / 12m`} accent />
              <HeadlineMetric label="AMTP" v={`#${file.amtp.now}`} delta={`↑${file.amtp.delta12} pos`} />
              <HeadlineMetric label="ITF SJR" v={`#${file.itf.sjr}`} delta={`${file.itf.entrants} · ${file.itf.points} pts`} />
            </div>
          </div>

          {/* Actions */}
          <div className="col-span-12 lg:col-span-2 flex lg:flex-col gap-2 lg:items-end">
            {!readOnly && (
              <Btn variant="primary" size="md" icon="sparkle" onClick={onOpenTalentCard}>Talent Card</Btn>
            )}
            <div className="flex gap-2">
              <Btn variant="outline" size="md" icon="print">PDF</Btn>
              <Btn variant="outline" size="md" icon="share">Share</Btn>
              {!readOnly && (
                <Btn variant="ghost" size="md" icon="more" className="!px-2" />
              )}
            </div>
            <div className="text-[10px] font-mono text-[var(--ink-mute)] mt-auto uppercase text-right hidden lg:block">
              Actualizado · 02 May 2026
            </div>
          </div>
        </div>
      </div>

      {/* Read-only banner */}
      {readOnly && (
        <div className="px-6 py-2 text-[11px] font-mono uppercase tracking-wider flex items-center gap-2 hairline-t"
             style={{ background: 'var(--cream)' }}>
          <Icon name="eye" size={12} style={{ color: 'var(--accent)' }} />
          <span>Vista de solo lectura · {role === 'atleta' ? 'Atleta' : 'Padre / madre'}</span>
        </div>
      )}
    </header>
  );
}

function HeadlineMetric({ label, v, delta, accent }) {
  return (
    <div className="bg-[var(--paper)] px-5 py-4 relative">
      {accent && <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: 'var(--accent)' }} />}
      <Eyebrow className="!text-[10px] mb-2">{label}</Eyebrow>
      <div className="flex items-baseline gap-3">
        <div className="font-num font-black text-[44px] leading-none tnum">{v}</div>
      </div>
      <div className="text-[11px] font-mono mt-1.5" style={{ color: 'var(--good)' }}>{delta}</div>
    </div>
  );
}

Object.assign(window, { Expediente });
