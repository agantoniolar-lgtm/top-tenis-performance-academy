import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import {
  calcCat, avg, ocAvgLabel, fmtSign, fmtPeriod, fmtPeriodLong, winLossRecord,
  STROKE_KEYS as OC_STROKE_KEYS,
  TACTIC_KEYS as OC_TACTIC_KEYS,
  STROKE_LABELS,
  TACTIC_LABELS,
  TACTIC_DESCS,
  OC_LABEL,
  onboardingGaps, hasPendingPTF,
  NOTE_SEGMENTS, SEGMENT_LABELS, noteValidationError, fmtRelativeTime,
  noteAudioPath, fmtDuration,
} from '../../../lib/athletics.js';

const AUDIO_BUCKET = 'athlete-notes-audio';

const OC_ALL_KEYS = [...OC_STROKE_KEYS, ...OC_TACTIC_KEYS];

function scoreColor(v) {
  if (v == null) return 'var(--ink-mute)';
  if (v < 0)    return 'var(--bad)';
  if (v === 0)  return 'var(--ink-mute)';
  return 'var(--good)';
}

export default function AlumnoDetalle() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const [athlete, setAth]   = useState(null);
  const [reports, setRep]   = useState([]);   // raw reports
  const [ocMap,   setOcMap] = useState({});   // report_id → on_court row
  const [phMap,   setPhMap] = useState({});
  const [chMap,   setChMap] = useState({});
  const [avMap,   setAvMap] = useState({});
  const [record,  setRec]   = useState({ w: 0, l: 0, total: 0 });
  const [amtp,    setAmtp]  = useState([]);   // últimos 2 períodos, desc
  const [recruitment,          setRecruitment]          = useState(null);
  const [pendingPTF,           setPendingPTF]           = useState(false);
  const [hasPhysicalBaseline,  setHasPhysicalBaseline]  = useState(true);
  const [loading, setLoad]  = useState(true);
  const [error,   setErr]   = useState(null);

  // Notas del atleta (T148 fase 1)
  const [notes,       setNotes]       = useState([]);
  const [athTourns,   setAthTourns]   = useState([]); // torneos del atleta, para el dropdown del composer
  const [noteBody,    setNoteBody]    = useState('');
  const [noteSegment, setNoteSegment] = useState('general');
  const [noteTournId, setNoteTournId] = useState('');
  const [noteSaving,  setNoteSaving]  = useState(false);
  const [noteErr,     setNoteErr]     = useState(null);
  const [confirmDelId, setConfirmDelId] = useState(null); // id de la nota con borrado armado (confirmación en 2 pasos)
  const [nowMs]       = useState(() => Date.now()); // estable por render (regla de pureza), para fechas relativas

  // Grabación de voz (T148 fase 2a)
  const [noteMode,   setNoteMode]   = useState('text'); // 'text' | 'voice'
  const [recording,  setRecording]  = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [audioBlob,  setAudioBlob]  = useState(null);
  const [audioUrl,   setAudioUrl]   = useState(null);  // object URL para el preview antes de guardar
  const [audioUrls,  setAudioUrls]  = useState({});    // note_id → signed URL, para reproducir en el timeline
  const mediaRecRef = useRef(null);
  const chunksRef   = useRef([]);
  const streamRef   = useRef(null);
  const timerRef    = useRef(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      // 1. Athlete
      const { data: ath, error: e1 } = await supabase
        .from('athletes')
        .select('id, nombre, apellido, segundo_apellido, fecha_nacimiento, mano_dominante, tipo_reves, altura_cm, peso_kg, email, telefono, nombre_padre, telefono_padre, email_padre, escuela, grado_escolar, fecha_ingreso, utr_actual, activo, coach_id')
        .eq('id', id).single();
      if (e1) { setErr(e1.message); setLoad(false); return; }

      // 2. Reports (last 6) + record de torneos (con fecha/PTF, T161) + AMTP últimos 2 períodos
      //    + perfil de reclutamiento + todos los report ids (para saber si ya hay baseline físico, T166)
      const [{ data: reps, error: e2 }, { data: tourns }, { data: amtpData }, { data: rec }, { data: allReps }, { data: notesData }, { data: athTournData }] = await Promise.all([
        supabase.from('reports').select('id, period, created_at')
          .eq('athlete_id', id).order('period', { ascending: false }).limit(6),
        supabase.from('athlete_tournaments')
          .select('victoria, partidos_jugados, tournaments(fecha), post_tournament_forms(id)').eq('athlete_id', id),
        supabase.from('amtp_rankings').select('posicion, puntos, periodo')
          .eq('athlete_id', id).order('periodo', { ascending: false }).limit(2),
        supabase.from('athlete_recruitment_profile')
          .select('division_objetivo, grad_year, english_level').eq('athlete_id', id).maybeSingle(),
        supabase.from('reports').select('id').eq('athlete_id', id),
        supabase.from('athlete_notes')
          .select('id, coach_id, kind, segment, tournament_id, body, audio_path, audio_duration_seconds, transcription_status, created_at, coaches(nombre), tournaments(nombre)')
          .eq('athlete_id', id).order('created_at', { ascending: false }),
        supabase.from('athlete_tournaments')
          .select('tournaments(id, nombre, fecha)').eq('athlete_id', id),
      ]);
      if (e2) { setErr(e2.message); setLoad(false); return; }
      if (!cancelled) {
        setRec(winLossRecord(tourns));
        setRecruitment(rec ?? null);
        setPendingPTF(hasPendingPTF(
          (tourns ?? []).map(t => ({ fecha: t.tournaments?.fecha ?? null, hasForm: (t.post_tournament_forms?.length ?? 0) > 0 })),
          new Date().toISOString().slice(0, 10),
        ));
        setNotes(notesData ?? []);
        // Signed URLs para reproducir el audio de las notas de voz en el timeline (bucket privado).
        const voiceWithAudio = (notesData ?? []).filter(n => n.kind === 'voice' && n.audio_path);
        if (voiceWithAudio.length > 0) {
          Promise.all(voiceWithAudio.map(async n => {
            const { data } = await supabase.storage.from(AUDIO_BUCKET).createSignedUrl(n.audio_path, 3600);
            return [n.id, data?.signedUrl ?? null];
          })).then(pairs => { if (!cancelled) setAudioUrls(Object.fromEntries(pairs)); });
        }
        // Torneos únicos del atleta, más reciente primero, para el dropdown del composer.
        const uniqTourns = Object.values(Object.fromEntries(
          (athTournData ?? [])
            .map(t => t.tournaments)
            .filter(Boolean)
            .map(t => [t.id, t]),
        )).sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));
        setAthTourns(uniqTourns);
      }

      const repIds = (reps ?? []).map(r => r.id);
      const allRepIds = (allReps ?? []).map(r => r.id);

      // Baseline físico (T166): sobre TODO el historial, no solo los últimos 6 reportes mostrados.
      const { data: physBaseline } = allRepIds.length > 0
        ? await supabase.from('report_physical').select('report_id').in('report_id', allRepIds).not('completed_at', 'is', null).limit(1)
        : { data: [] };
      if (!cancelled) setHasPhysicalBaseline((physBaseline ?? []).length > 0);

      if (repIds.length === 0) {
        if (!cancelled) { setAth(ath); setRep([]); setAmtp(amtpData ?? []); setLoad(false); }
        return;
      }

      // 3. Secciones — queries separadas para evitar problemas con PostgREST
      const [ocRes, phRes, chRes, avRes] = await Promise.all([
        supabase.from('report_on_court')
          .select('report_id, completed_at, utr, serve, forehand, backhand, volea, devolucion, footwork, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, transferencia_partido, tecnica_nota, tactica_nota')
          .in('report_id', repIds),
        supabase.from('report_physical')
          .select('report_id, completed_at').in('report_id', repIds),
        supabase.from('report_character')
          .select('report_id, completed_at, etica_trabajo, coachabilidad').in('report_id', repIds),
        supabase.from('report_athlete_voice')
          .select('report_id, completed_at').in('report_id', repIds),
      ]);

      const toMap = (rows) => Object.fromEntries((rows ?? []).map(r => [r.report_id, r]));

      if (!cancelled) {
        setAth(ath);
        setRep(reps ?? []);
        setOcMap(toMap(ocRes.data));
        setPhMap(toMap(phRes.data));
        setChMap(toMap(chRes.data));
        setAvMap(toMap(avRes.data));
        setAmtp(amtpData ?? []);
        setLoad(false);
      }
    }

    load().catch(e => { if (!cancelled) { setErr(e.message); setLoad(false); } });
    return () => { cancelled = true; };
  }, [id]);

  // Limpieza de grabación al desmontar: cortar el micrófono y el timer si quedaron activos.
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
  }, []);

  if (loading) return <Shell><p className="text-[var(--ink-mute)] text-sm">Cargando…</p></Shell>;
  if (error)   return <Shell><p className="text-red-500 text-sm">Error: {error}</p></Shell>;
  if (!athlete) return <Shell><p className="text-[var(--ink-mute)] text-sm">Atleta no encontrado.</p></Shell>;


  const lastRep  = reports[0];
  const prevRep  = reports[1];
  const lastOC   = lastRep ? ocMap[lastRep.id] : null;
  const prevOC   = prevRep ? ocMap[prevRep.id] : null;
  const lastCh   = lastRep ? chMap[lastRep.id] : null;
  const prevCh   = prevRep ? chMap[prevRep.id] : null;

  const deltaEtica = lastCh?.etica_trabajo != null && prevCh?.etica_trabajo != null
    ? lastCh.etica_trabajo - prevCh.etica_trabajo : null;
  const deltaCoach = lastCh?.coachabilidad != null && prevCh?.coachabilidad != null
    ? lastCh.coachabilidad - prevCh.coachabilidad : null;

  const currentAvg  = avg(lastOC, OC_ALL_KEYS);
  const prevAvg     = avg(prevOC, OC_ALL_KEYS);
  const deltaAvg    = currentAvg != null && prevAvg != null ? currentAvg - prevAvg : null;
  const ocLabel     = ocAvgLabel(currentAvg);

  const currentUTR  = lastOC?.utr ?? athlete.utr_actual;
  const prevUTR     = prevOC?.utr;
  const deltaUTR    = currentUTR && prevUTR ? Number(currentUTR) - Number(prevUTR) : null;

  const amtpCur     = amtp[0] ?? null;
  const amtpPrev    = amtp[1] ?? null;
  const amtpDeltaPos = amtpCur && amtpPrev ? amtpPrev.posicion - amtpCur.posicion : null;

  const gaps = onboardingGaps({ athlete, recruitment, pendingPTF, hasPhysicalBaseline });

  // ── Notas (T148 fase 1) ───────────────────────────────────────────────────
  const changeSegment = (seg) => {
    // No se borra noteTournId al cambiar de segmento: si el coach toca otro segmento por error y
    // vuelve a "Torneo", conserva su selección. El torneo solo se APLICA cuando el segmento es
    // 'tournament' (ver los save handlers y noteValidationError); en otros segmentos se ignora.
    setNoteSegment(seg);
    setNoteErr(null);
  };

  const handleSaveNote = async () => {
    const tournamentId = noteSegment === 'tournament' ? (noteTournId || null) : null;
    const payload = { body: noteBody, segment: noteSegment, tournamentId };
    const err = noteValidationError(payload);
    if (err) { setNoteErr(err); return; }
    if (!user?.coach_id) { setNoteErr('No se pudo identificar al coach.'); return; }

    setNoteSaving(true); setNoteErr(null);
    const { data, error: e } = await supabase
      .from('athlete_notes')
      .insert({
        athlete_id: id,
        coach_id: user.coach_id,
        kind: 'text',
        segment: noteSegment,
        tournament_id: tournamentId,
        body: noteBody.trim(),
      })
      .select('id, coach_id, segment, tournament_id, body, created_at, coaches(nombre), tournaments(nombre)')
      .single();
    setNoteSaving(false);
    if (e) { setNoteErr(e.message); return; }
    setNotes(prev => [data, ...prev]);
    setNoteBody(''); setNoteSegment('general'); setNoteTournId('');
  };

  const handleDeleteNote = async (noteId) => {
    const prev = notes;
    const deleted = prev.find(n => n.id === noteId);
    setConfirmDelId(null);
    setNotes(prev.filter(n => n.id !== noteId)); // optimista
    const { error: e } = await supabase.from('athlete_notes').delete().eq('id', noteId);
    if (e) { setNotes(prev); setNoteErr('No se pudo borrar la nota.'); return; } // revertir si falla
    // Borrar también el audio del bucket si era nota de voz (best-effort, no bloquea la UI).
    if (deleted?.kind === 'voice' && deleted.audio_path) {
      supabase.storage.from(AUDIO_BUCKET).remove([deleted.audio_path]).catch(() => {});
    }
  };

  // ── Grabación de voz (T148 fase 2a) ────────────────────────────────────────
  const resetRecording = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setRecording(false); setRecSeconds(0); setAudioBlob(null); setAudioUrl(null);
    mediaRecRef.current = null; chunksRef.current = [];
  };

  const changeMode = (mode) => {
    if (mode === 'text') resetRecording();
    setNoteMode(mode); setNoteErr(null);
  };

  const startRecording = async () => {
    setNoteErr(null);
    if (!navigator.mediaDevices?.getUserMedia) { setNoteErr('Este navegador no permite grabar audio.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
      };
      mediaRecRef.current = rec;
      rec.start();
      setAudioBlob(null); setAudioUrl(null); setRecSeconds(0); setRecording(true);
      timerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
    } catch {
      setNoteErr('No se pudo acceder al micrófono. Revisa los permisos.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (mediaRecRef.current && mediaRecRef.current.state !== 'inactive') mediaRecRef.current.stop();
    setRecording(false);
  };

  const handleSaveVoiceNote = async () => {
    const tournamentId = noteSegment === 'tournament' ? (noteTournId || null) : null;
    const payload = { body: 'voz', segment: noteSegment, tournamentId }; // body='voz' salta el check de vacío; la nota de voz no lleva body en fase 2a
    const err = noteValidationError(payload);
    if (err && !/vac/i.test(err)) { setNoteErr(err); return; } // solo nos importa segmento/torneo acá
    if (!audioBlob) { setNoteErr('Graba una nota primero.'); return; }
    if (!user?.coach_id) { setNoteErr('No se pudo identificar al coach.'); return; }

    setNoteSaving(true); setNoteErr(null);
    // 1. Insertar la fila primero (checkpoint durable): pending, sin body, con duración.
    const { data: inserted, error: e1 } = await supabase
      .from('athlete_notes')
      .insert({
        athlete_id: id,
        coach_id: user.coach_id,
        kind: 'voice',
        segment: noteSegment,
        tournament_id: tournamentId,
        body: null,
        transcription_status: 'pending',
        audio_duration_seconds: recSeconds,
      })
      .select('id, coach_id, kind, segment, tournament_id, body, audio_path, audio_duration_seconds, transcription_status, created_at, coaches(nombre), tournaments(nombre)')
      .single();
    if (e1) { setNoteSaving(false); setNoteErr(e1.message); return; }

    // 2. Subir el audio con el id de la nota como nombre.
    const path = noteAudioPath(inserted.id, audioBlob.type);
    const { error: e2 } = await supabase.storage.from(AUDIO_BUCKET)
      .upload(path, audioBlob, { contentType: audioBlob.type, upsert: true });
    if (e2) {
      // El audio no subió: la fila quedó sin audio_path. Borrarla para no dejar una nota huérfana.
      await supabase.from('athlete_notes').delete().eq('id', inserted.id);
      setNoteSaving(false); setNoteErr('No se pudo subir el audio. Intenta de nuevo.'); return;
    }

    // 3. Guardar audio_path en la fila (checkpoint durable completo).
    await supabase.from('athlete_notes').update({ audio_path: path }).eq('id', inserted.id);

    // 4. Firmar la URL para reproducir de inmediato y ponerla en el timeline.
    const { data: signed } = await supabase.storage.from(AUDIO_BUCKET).createSignedUrl(path, 3600);
    setAudioUrls(prev => ({ ...prev, [inserted.id]: signed?.signedUrl ?? null }));
    // La nota entra al timeline en estado "transcribiendo" (flag de cliente _transcribing).
    setNotes(prev => [{ ...inserted, audio_path: path, _transcribing: true }, ...prev]);
    setNoteSaving(false);
    resetRecording();
    setNoteMode('text'); setNoteSegment('general'); setNoteTournId('');

    // 5. Transcribir (2b). Audio corto → invoke síncrono; el fallo/disconnect lo recupera 2c.
    try {
      const { data: tr, error: te } = await supabase.functions.invoke('transcribe-note', {
        body: { note_id: inserted.id },
      });
      if (te || tr?.status !== 'done') {
        setNotes(prev => prev.map(n => n.id === inserted.id
          ? { ...n, _transcribing: false, transcription_status: 'failed' } : n));
      } else {
        setNotes(prev => prev.map(n => n.id === inserted.id
          ? { ...n, _transcribing: false, transcription_status: 'done', body: tr.transcript } : n));
      }
    } catch {
      setNotes(prev => prev.map(n => n.id === inserted.id
        ? { ...n, _transcribing: false, transcription_status: 'failed' } : n));
    }
  };

  return (
    <Shell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-[72px] h-[88px] court-bg shrink-0" />
          <div>
            <p className="eyebrow !text-[10px] mb-1" style={{ color: 'var(--ink-mute)' }}>Expediente</p>
            <h1 className="font-display font-extrabold text-[32px] leading-[0.95]">
              {athlete.nombre} {athlete.apellido}{athlete.segundo_apellido ? ` ${athlete.segundo_apellido}` : ''}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
              <span><b style={{ color: 'var(--ink)' }}>{calcCat(athlete.fecha_nacimiento)}</b></span>
              <span style={{ color: 'var(--ink-mute)' }}>·</span>
              <span className="capitalize">{athlete.mano_dominante ?? '—'}</span>
              {athlete.tipo_reves && (
                <><span style={{ color: 'var(--ink-mute)' }}>·</span>
                <span>Revés {athlete.tipo_reves === 'una_mano' ? '1 mano' : '2 manos'}</span></>
              )}
              {athlete.altura_cm && (
                <><span style={{ color: 'var(--ink-mute)' }}>·</span><span>{athlete.altura_cm} cm</span></>
              )}
              {athlete.peso_kg && (
                <><span style={{ color: 'var(--ink-mute)' }}>·</span><span>{athlete.peso_kg} kg</span></>
              )}
              {athlete.fecha_ingreso && <>
                <span style={{ color: 'var(--ink-mute)' }}>·</span>
                <span>Ingreso <b style={{ color: 'var(--ink)' }}>
                  {fmtPeriod(athlete.fecha_ingreso)}
                </b></span>
              </>}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px]" style={{ color: 'var(--ink-mute)' }}>
              {athlete.email && <span>{athlete.email}</span>}
              {athlete.telefono && <><span>·</span><span>{athlete.telefono}</span></>}
              {athlete.escuela && (
                <><span>·</span>
                <span>{athlete.escuela}{athlete.grado_escolar ? ` · ${athlete.grado_escolar}` : ''}</span></>
              )}
              {athlete.nombre_padre && (
                <><span>·</span>
                <span>Tutor: {athlete.nombre_padre}{athlete.telefono_padre ? ` · ${athlete.telefono_padre}` : ''}</span></>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate(`/portal/alumnos/${id}/talent-card`)}
            className="px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] hairline hover:bg-[var(--cream)] transition">
            Talent Card
          </button>
          <button
            onClick={() => navigate('/portal/reportes/nuevo', { state: { athleteId: id } })}
            className="px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white hover:opacity-90 transition"
            style={{ background: 'var(--accent)' }}>
            + Nuevo reporte
          </button>
        </div>
      </div>

      {/* Onboarding pendiente (T161) — desglose completo, sin cap (a diferencia de Equipo.jsx) */}
      {gaps.length > 0 && (
        <div className="hairline p-4 mb-6 flex flex-wrap gap-2" style={{ background: '#FFF6D6' }}>
          <span className="text-[11px] font-semibold shrink-0" style={{ color: '#8A6D00' }}>
            Onboarding pendiente:
          </span>
          {gaps.map(g => (
            <span key={g.key} className="tag text-[9px]" style={{ background: '#FFF0B3', color: '#8A6D00' }}>
              {g.label}
            </span>
          ))}
        </div>
      )}

      {/* Headline metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-px hairline bg-[var(--line)] mb-6">
        <MetricCard label="UTR"            value={currentUTR ? Number(currentUTR).toFixed(1) : '—'} delta={deltaUTR} deltaLabel="vs mes ant." />
        <MetricCard
          label="AMTP"
          value={amtpCur ? `#${amtpCur.posicion}` : '—'}
          delta={amtpDeltaPos}
          deltaLabel={amtpPrev ? `vs ${amtpPrev.periodo}` : 'vs ant.'}
          sub={!amtpCur ? 'sin ranking' : undefined}
          textValue={!amtpCur}
        />
        <MetricCard label="W / L"          value={record.total > 0 ? `${record.w}–${record.l}` : '—'}
                    sub={record.total > 0 ? `${record.total} torneo${record.total !== 1 ? 's' : ''} con resultado` : 'sin torneos con resultado'} />
        <MetricCard label="On-court"       value={ocLabel ?? '—'} delta={deltaAvg} deltaLabel="vs mes ant." textValue />
        <MetricCard label="Ética trabajo"  value={OC_LABEL[String(lastCh?.etica_trabajo)] ?? '—'} delta={deltaEtica} deltaLabel="vs mes ant." textValue />
        <MetricCard label="Coachabilidad"  value={OC_LABEL[String(lastCh?.coachabilidad)] ?? '—'} delta={deltaCoach} deltaLabel="vs mes ant." textValue />
      </div>

      {/* Strokes del último reporte */}
      {lastOC && lastOC.completed_at && (
        <div className="hairline bg-[var(--paper)] mb-6">
          <div className="px-5 py-4 hairline-b">
            <p className="eyebrow !text-[10px] mb-0.5" style={{ color: 'var(--ink-mute)' }}>Técnica · último reporte</p>
            <p className="font-display font-bold text-[16px]">
              {lastRep?.period ? fmtPeriodLong(lastRep.period) : '—'}
            </p>
          </div>
          {/* Mobile: lista de filas — Desktop: grid */}
          <div className="md:hidden">
            {OC_STROKE_KEYS.map(key => (
              <ScoreRow key={key} label={STROKE_LABELS[key]}
                        curr={lastOC?.[key]} prev={prevOC?.[key]} />
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-6 gap-px" style={{ background: 'var(--line)' }}>
            {OC_STROKE_KEYS.map(key => (
              <DimCell key={key} label={STROKE_LABELS[key]}
                       curr={lastOC?.[key]} prev={prevOC?.[key]} />
            ))}
          </div>
          {lastOC.tecnica_nota && (
            <div className="px-5 py-3 hairline-t text-[12px]" style={{ color: 'var(--ink-soft)', background: 'var(--cream)' }}>
              {lastOC.tecnica_nota}
            </div>
          )}

          {/* Táctica — sub-dimensiones propias */}
          <div className="px-5 py-4 hairline-t hairline-b flex items-center justify-between">
            <p className="eyebrow !text-[10px]" style={{ color: 'var(--ink-mute)' }}>Táctica · último reporte</p>
            <p className="font-display font-bold text-[14px]">
              {ocAvgLabel(avg(lastOC, OC_TACTIC_KEYS)) ?? '—'}
            </p>
          </div>
          <div className="md:hidden">
            {OC_TACTIC_KEYS.map(key => (
              <ScoreRow key={key} label={TACTIC_LABELS[key]} desc={TACTIC_DESCS[key]}
                        curr={lastOC?.[key]} prev={prevOC?.[key]} />
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-5 gap-px" style={{ background: 'var(--line)' }}>
            {OC_TACTIC_KEYS.map(key => (
              <DimCell key={key} label={TACTIC_LABELS[key]} desc={TACTIC_DESCS[key]}
                       curr={lastOC?.[key]} prev={prevOC?.[key]} />
            ))}
          </div>
          {lastOC.tactica_nota && (
            <div className="px-5 py-3 hairline-t text-[12px]" style={{ color: 'var(--ink-soft)', background: 'var(--cream)' }}>
              {lastOC.tactica_nota}
            </div>
          )}
        </div>
      )}

      {/* Historial */}
      <div>
        <h2 className="font-display font-bold text-[18px] mb-3">Historial de reportes</h2>
        {reports.length === 0 ? (
          <div className="hairline bg-[var(--paper)] p-4 md:p-8 text-center">
            <p className="text-[var(--ink-mute)] text-[13px]">Sin reportes aún.</p>
            <button onClick={() => navigate('/portal/reportes/nuevo', { state: { athleteId: id } })}
                    className="mt-3 text-[12px] font-mono uppercase hover:underline" style={{ color: 'var(--accent)' }}>
              Crear primer reporte →
            </button>
          </div>
        ) : (
          <div className="hairline bg-[var(--paper)] overflow-x-auto">
            <table className="w-full text-[12px] min-w-[480px]">
              <thead className="eyebrow text-[10px]" style={{ background: 'var(--cream)', color: 'var(--ink-mute)' }}>
                <tr>
                  <th className="text-left px-5 py-3">Periodo</th>
                  <th className="text-left px-4 py-3">On-court</th>
                  <th className="text-left px-4 py-3">Physical</th>
                  <th className="text-left px-4 py-3">Character</th>
                  <th className="text-left px-4 py-3">Athlete Voice</th>
                  <th className="text-right px-5 py-3">UTR</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => {
                  const oc = ocMap[r.id];
                  const ph = phMap[r.id];
                  const ch = chMap[r.id];
                  const av = avMap[r.id];
                  return (
                    <tr key={r.id} className="hairline-t hover:bg-[var(--cream)] transition">
                      <td className="px-5 py-3 font-display font-bold">
                        {fmtPeriodLong(r.period)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusDot done={!!oc?.completed_at} label={oc ? ocAvgLabel(avg(oc, OC_ALL_KEYS)) : null} />
                      </td>
                      <td className="px-4 py-3"><StatusDot done={!!ph?.completed_at} /></td>
                      <td className="px-4 py-3"><StatusDot done={!!ch?.completed_at} label={ch ? ocAvgLabel(avg(ch, ['etica_trabajo', 'coachabilidad'])) : null} /></td>
                      <td className="px-4 py-3"><StatusDot done={!!av?.completed_at} /></td>
                      <td className="px-5 py-3 text-right font-num font-black text-[16px] tnum">
                        {oc?.utr ? Number(oc.utr).toFixed(1) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notas (T148 fase 1) — captura ligera de texto + timeline */}
      <div className="mt-6">
        <h2 className="font-display font-bold text-[18px] mb-3">Notas</h2>

        {/* Composer */}
        <div className="hairline bg-[var(--paper)] p-4 mb-4">
          {/* Toggle de modo: texto o voz */}
          <div className="flex items-center gap-2 mb-3">
            {[['text', 'Texto'], ['voice', 'Voz']].map(([m, label]) => {
              const active = noteMode === m;
              return (
                <button key={m} type="button" onClick={() => changeMode(m)}
                  className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] hairline transition"
                  style={active
                    ? { background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' }
                    : { color: 'var(--ink-soft)' }}>
                  {label}
                </button>
              );
            })}
          </div>

          {noteMode === 'text' ? (
            <textarea
              value={noteBody}
              onChange={e => { setNoteBody(e.target.value); setNoteErr(null); }}
              rows={3}
              placeholder={`Escribe una nota sobre ${athlete.nombre}… lo que observaste en cancha, en un torneo o en entrenamiento.`}
              className="w-full text-[14px] p-3 hairline bg-[var(--cream)] resize-y focus:outline-none"
              style={{ color: 'var(--ink)' }}
            />
          ) : (
            <div className="hairline bg-[var(--cream)] p-4 flex flex-col items-center gap-3">
              {!recording && !audioUrl && (
                <button type="button" onClick={startRecording}
                  className="px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white hover:opacity-90 transition"
                  style={{ background: 'var(--accent)' }}>
                  ● Grabar
                </button>
              )}
              {recording && (
                <div className="flex flex-col items-center gap-2">
                  <span className="font-num font-black text-[28px] tnum" style={{ color: 'var(--bad)' }}>
                    {fmtDuration(recSeconds)}
                  </span>
                  <span className="text-[11px] flex items-center gap-1.5" style={{ color: 'var(--ink-mute)' }}>
                    <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--bad)' }} />
                    Grabando…
                  </span>
                  <button type="button" onClick={stopRecording}
                    className="px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] hairline transition hover:bg-[var(--paper)]">
                    ■ Detener
                  </button>
                </div>
              )}
              {!recording && audioUrl && (
                <div className="flex flex-col items-center gap-2 w-full">
                  <audio src={audioUrl} controls className="w-full max-w-[320px]" />
                  <div className="flex items-center gap-3">
                    <span className="text-[11px]" style={{ color: 'var(--ink-mute)' }}>{fmtDuration(recSeconds)}</span>
                    <button type="button" onClick={startRecording}
                      className="text-[11px] font-mono uppercase hover:underline" style={{ color: 'var(--ink-mute)' }}>
                      Volver a grabar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {NOTE_SEGMENTS.map(seg => {
              const active = noteSegment === seg;
              return (
                <button key={seg} type="button" onClick={() => changeSegment(seg)}
                  className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] hairline transition"
                  style={active
                    ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }
                    : { color: 'var(--ink-soft)' }}>
                  {SEGMENT_LABELS[seg]}
                </button>
              );
            })}
            {noteSegment === 'tournament' && (
              <select
                value={noteTournId}
                onChange={e => { setNoteTournId(e.target.value); setNoteErr(null); }}
                className="px-3 py-1.5 text-[12px] hairline bg-[var(--cream)] focus:outline-none"
                style={{ color: 'var(--ink)' }}>
                <option value="">¿Qué torneo?</option>
                {athTourns.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            )}
            <button type="button"
              onClick={noteMode === 'voice' ? handleSaveVoiceNote : handleSaveNote}
              disabled={noteSaving || (noteMode === 'voice' && (recording || !audioBlob))}
              className="ml-auto px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white hover:opacity-90 transition disabled:opacity-50"
              style={{ background: 'var(--accent)' }}>
              {noteSaving ? 'Guardando…' : 'Guardar nota'}
            </button>
          </div>
          {noteSegment === 'tournament' && athTourns.length === 0 && (
            <p className="mt-2 text-[11px]" style={{ color: 'var(--ink-mute)' }}>
              Este atleta no tiene torneos registrados todavía.
            </p>
          )}
          {noteErr && <p className="mt-2 text-[12px]" style={{ color: 'var(--bad)' }}>{noteErr}</p>}
        </div>

        {/* Timeline */}
        {notes.length === 0 ? (
          <div className="hairline bg-[var(--paper)] p-4 md:p-8 text-center">
            <p className="text-[var(--ink-mute)] text-[13px]">Sin notas todavía.</p>
          </div>
        ) : (
          <div className="hairline bg-[var(--paper)]">
            {notes.map(n => (
              <div key={n.id} className="px-5 py-4 hairline-b last:border-b-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="tag text-[9px]" style={{ background: 'var(--cream)', color: 'var(--ink-soft)' }}>
                    {SEGMENT_LABELS[n.segment] ?? n.segment}
                  </span>
                  {n.segment === 'tournament' && n.tournaments?.nombre && (
                    <span className="text-[11px] font-medium" style={{ color: 'var(--ink-soft)' }}>
                      {n.tournaments.nombre}
                    </span>
                  )}
                  <span className="text-[11px] ml-auto" style={{ color: 'var(--ink-mute)' }}>
                    {n.coaches?.nombre ? `${n.coaches.nombre} · ` : ''}{fmtRelativeTime(n.created_at, nowMs)}
                  </span>
                </div>
                {n.kind === 'voice' ? (
                  <div className="flex flex-col gap-1.5">
                    {audioUrls[n.id]
                      ? <audio src={audioUrls[n.id]} controls className="w-full max-w-[320px]" />
                      : <span className="text-[12px]" style={{ color: 'var(--ink-mute)' }}>Cargando audio…</span>}
                    <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--ink-mute)' }}>
                      <span>🎙 {fmtDuration(n.audio_duration_seconds)}</span>
                      {n.body
                        ? null
                        : n._transcribing
                          ? <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />· Transcribiendo…</span>
                          : n.transcription_status === 'failed'
                            ? <span style={{ color: 'var(--bad)' }}>· No se pudo transcribir — se reintentará</span>
                            : <span>· Transcripción pendiente</span>}
                    </div>
                    {n.body && <p className="text-[14px] whitespace-pre-wrap mt-0.5" style={{ color: 'var(--ink)' }}>{n.body}</p>}
                  </div>
                ) : (
                  <p className="text-[14px] whitespace-pre-wrap" style={{ color: 'var(--ink)' }}>{n.body}</p>
                )}
                {user?.coach_id === n.coach_id && (
                  confirmDelId === n.id ? (
                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                      <span className="text-[11px]" style={{ color: 'var(--bad)' }}>
                        Da click en Borrar otra vez para eliminar.
                      </span>
                      <button type="button" onClick={() => handleDeleteNote(n.id)}
                        className="text-[11px] font-mono uppercase font-bold hover:underline" style={{ color: 'var(--bad)' }}>
                        Borrar
                      </button>
                      <button type="button" onClick={() => setConfirmDelId(null)}
                        className="text-[11px] font-mono uppercase hover:underline" style={{ color: 'var(--ink-mute)' }}>
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setConfirmDelId(n.id)}
                      className="mt-2 text-[11px] font-mono uppercase hover:underline" style={{ color: 'var(--ink-mute)' }}>
                      Borrar
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}

function MetricCard({ label, value, delta, deltaLabel, sub, textValue = false, wide = false }) {
  return (
    <div className={`bg-[var(--paper)] px-5 py-4${wide ? ' col-span-2 md:col-span-1' : ''}`}>
      <p className="eyebrow !text-[9px] mb-2" style={{ color: 'var(--ink-mute)' }}>{label}</p>
      {textValue
        ? <p className="font-display font-bold text-[18px] leading-tight">{value}</p>
        : <p className="font-num font-black text-[40px] leading-none tnum">{value}</p>
      }
      {delta != null && (
        <p className="text-[11px] font-mono mt-1.5 font-bold"
           style={{ color: delta > 0 ? 'var(--good)' : delta < 0 ? 'var(--bad)' : 'var(--ink-mute)' }}>
          {delta > 0 ? '+' : ''}{delta.toFixed(2)} {deltaLabel}
        </p>
      )}
      {delta == null && sub && (
        <p className="text-[10px] mt-1.5" style={{ color: 'var(--ink-mute)' }}>{sub}</p>
      )}
    </div>
  );
}

function ScoreRow({ label, desc, curr, prev }) {
  const delta = curr != null && prev != null ? curr - prev : null;
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-[var(--paper)] hairline-b" title={desc}>
      <span className="text-[13px] font-medium" style={{ color: 'var(--ink-soft)' }}>{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-num font-black text-[22px] tnum leading-none" style={{ color: scoreColor(curr) }}>
          {curr != null ? fmtSign(curr) : '—'}
        </span>
        <span className="text-[11px] font-medium w-20 text-right" style={{ color: scoreColor(curr) }}>
          {OC_LABEL[String(curr)] ?? ''}
        </span>
        {delta != null && (
          <span className="text-[11px] font-mono w-10 text-right font-bold"
                style={{ color: delta > 0 ? 'var(--good)' : delta < 0 ? 'var(--bad)' : 'var(--ink-mute)' }}>
            {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}

function DimCell({ label, desc, curr, prev }) {
  const delta = curr != null && prev != null ? curr - prev : null;
  return (
    <div className="bg-[var(--paper)] px-4 py-4 text-center" title={desc}>
      <p className="eyebrow !text-[9px] mb-2" style={{ color: 'var(--ink-mute)', cursor: desc ? 'help' : 'default' }}>
        {label}
      </p>
      <p className="font-num font-black text-[28px] tnum leading-none" style={{ color: scoreColor(curr) }}>
        {curr != null ? fmtSign(curr) : '—'}
      </p>
      <p className="text-[9px] mt-1 font-medium leading-tight" style={{ color: scoreColor(curr) }}>
        {OC_LABEL[String(curr)] ?? ''}
      </p>
      {delta != null && (
        <p className="text-[10px] font-mono mt-1 font-bold"
           style={{ color: delta > 0 ? 'var(--good)' : delta < 0 ? 'var(--bad)' : 'var(--ink-mute)' }}>
          {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
        </p>
      )}
      {desc && (
        <p className="text-[9px] mt-1.5 leading-tight" style={{ color: 'var(--ink-mute)' }}>{desc}</p>
      )}
    </div>
  );
}

function StatusDot({ done, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ background: done ? 'var(--good)' : 'var(--line-strong)' }} />
      {label && <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{label}</span>}
    </span>
  );
}

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}
