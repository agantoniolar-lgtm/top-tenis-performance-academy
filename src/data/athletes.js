// athletes.js — fixtures para el Portal (Expediente del Atleta)

export const ROSTER = [
  { id: 'TTPA-014', nombre: 'Daniela Hernández',  edad: 16, cat: 'U16', utr: 9.2,  amtp: 14, itf: 'J60',  coach: 'Marco Reyes',     turno: 'Matutino',   ingreso: 'Ago 2024' },
  { id: 'TTPA-003', nombre: 'Rodrigo Ávila',      edad: 18, cat: 'U18', utr: 10.3, amtp: 8,  itf: 'J100', coach: 'Alejandro',        turno: 'Matutino',   ingreso: 'Mar 2022' },
  { id: 'TTPA-007', nombre: 'Diego Vargas',       edad: 17, cat: 'U18', utr: 9.1,  amtp: 12, itf: 'J60',  coach: 'Alejandro',        turno: 'Matutino',   ingreso: 'Sep 2022' },
  { id: 'TTPA-001', nombre: 'Carlos Mendoza',     edad: 16, cat: 'U18', utr: 8.4,  amtp: 47, itf: '—',    coach: 'Marco Reyes',     turno: 'Matutino',   ingreso: 'Jun 2023' },
  { id: 'TTPA-002', nombre: 'Sofía Ruiz',         edad: 15, cat: 'U16', utr: 7.2,  amtp: 23, itf: '—',    coach: 'Marco Reyes',     turno: 'Vespertino', ingreso: 'Ene 2024' },
  { id: 'TTPA-009', nombre: 'Valentina Torres',   edad: 14, cat: 'U14', utr: 6.8,  amtp: 31, itf: '—',    coach: 'Marco Reyes',     turno: 'Matutino',   ingreso: 'Jul 2024' },
  { id: 'TTPA-022', nombre: 'Camila Soto',        edad: 13, cat: 'U14', utr: 5.9,  amtp: 44, itf: '—',    coach: 'Laura Méndez',    turno: 'Vespertino', ingreso: 'Nov 2024' },
  { id: 'TTPA-018', nombre: 'Andrés Beltrán',     edad: 16, cat: 'U18', utr: 7.9,  amtp: 28, itf: '—',    coach: 'Roberto García',  turno: 'Vespertino', ingreso: 'Feb 2024' },
];

export const FILE = {
  id: 'TTPA-014',
  nombre: 'Daniela Hernández',
  edad: 16,
  fechaNac: '14 Mar 2010',
  altura: 168,
  peso: 56,
  envergadura: 172,
  mano: 'Diestra',
  reves: 'A dos manos',
  cat: 'U16',
  coach: 'Marco Reyes',
  turno: 'Matutino · 9:00–12:00',
  ingreso: 'Ago 2024',
  sede: 'Casa Blanca Lomas Verdes',
  utr:  { now: 9.2, delta12: 1.8, peak: 9.2 },
  amtp: { now: 14, delta12: 21, division: 'U16' },
  itf:  { entrants: 'J60', sjr: 412, points: 56 },
  dimensions: [
    { key: 'oncourt',   icon: 'racket', label: 'On-court',     score: 4.4, owner: 'Marco Reyes',       updated: '02 May 2026',
      summary: 'Saque mejorado +0.4 en 6 meses. Patrones tácticos consistentes. Volea de revés sigue siendo área a desarrollar.' },
    { key: 'physical',  icon: 'bolt',   label: 'Physical',     score: 4.1, owner: 'R. García + Fisio', updated: '28 Apr 2026',
      summary: 'Sprint 20m mejoró +0.12s. Resistencia VO2 estable. Sin lesiones activas; última (codo) cerrada Mar 2026.' },
    { key: 'mental',    icon: 'pulse',  label: 'Mental',       score: 3.9, owner: 'Dra. Solís',         updated: '24 Apr 2026',
      summary: 'Foco en aumento. Respuesta al estrés en partidos cerrados sigue siendo el área de mayor oportunidad.' },
    { key: 'character', icon: 'shield', label: 'Character',    score: 4.6, owner: 'Marco Reyes',       updated: '02 May 2026',
      summary: 'Ética de trabajo ejemplar (4.8/5). Mentora activa de Camila Soto (U14). Cero violaciones de código.' },
    { key: 'voice',     icon: 'mic',    label: 'Athlete Voice', score: 4.2, owner: 'Daniela H.',         updated: '14 Apr 2026',
      summary: 'PTFs completos al 100%. Auto-evaluación muy alineada con el equipo (diff < 0.4 en todas las dimensiones).' },
  ],
  utrHistory: [
    { m: 'Nov 23', v: 6.4 }, { m: 'Dic 23', v: 6.6 }, { m: 'Ene 24', v: 6.5 }, { m: 'Feb 24', v: 6.9 },
    { m: 'Mar 24', v: 7.1 }, { m: 'Abr 24', v: 7.4 }, { m: 'May 24', v: 7.3 }, { m: 'Jun 24', v: 7.7 },
    { m: 'Jul 24', v: 8.0 }, { m: 'Ago 24', v: 8.1 }, { m: 'Sep 24', v: 8.4 }, { m: 'Oct 24', v: 8.6 },
    { m: 'Nov 24', v: 8.5 }, { m: 'Dic 24', v: 8.8 }, { m: 'Ene 25', v: 9.0 }, { m: 'Feb 25', v: 9.1 },
    { m: 'Mar 25', v: 9.2 },
  ],
  oncourt: {
    strokes: [
      { key: 'serve',    label: 'Serve',    score: 4.3, note: 'Primer servicio 64%, velocidad media 152 km/h. Segundo servicio a trabajar.' },
      { key: 'forehand', label: 'Forehand', score: 4.6, note: 'Golpe más sólido. Topspin pesado, capaz de cambiar dirección con confianza.' },
      { key: 'backhand', label: 'Backhand', score: 4.2, note: 'A dos manos. Buena dirección, sigue trabajando paralelo cruzado bajo presión.' },
      { key: 'volley',   label: 'Volley',   score: 3.8, note: 'Volea derecha sólida, volea revés inconsistente. Programa específico iniciado.' },
      { key: 'return',   label: 'Return',   score: 4.4, note: 'Excelente lectura del servicio. Returns de revés en bloque muy efectivos.' },
    ],
    tactics: { score: 4.3, note: 'Mantiene plan de juego en 78% de los partidos analizados. Tiende a abandonarlo en sets cerrados.' },
    clips: [
      { id: 1, label: 'AMTP Puebla · Final · 3er set tiebreak', date: '12 Abr 2026', dur: '2:14' },
      { id: 2, label: 'ITF J60 Cancún · Q2 · primer servicio',  date: '04 Mar 2026', dur: '1:48' },
      { id: 3, label: 'Entrenamiento · cambio de dirección',     date: '18 Feb 2026', dur: '0:54' },
    ],
  },
  physical: {
    anthro: [
      { k: 'Altura',      v: '168 cm', d: '+2 cm/año' },
      { k: 'Peso',        v: '56 kg',  d: '+3 kg/12m' },
      { k: 'Envergadura', v: '172 cm', d: 'Ratio 1.02' },
    ],
    fitness: [
      { k: 'Sprint 20m',      v: '3.14 s', d: '-0.12 s',  good: true },
      { k: 'Agilidad 5-10-5', v: '4.62 s', d: '-0.08 s',  good: true },
      { k: 'Salto vertical',  v: '42 cm',  d: '+3 cm',    good: true },
      { k: 'VO2 estimado',    v: '52.4',   d: '+1.8',     good: true },
      { k: 'Plank',           v: '2:48',   d: '+0:22',    good: true },
      { k: 'Fuerza pull',     v: '8 reps', d: '+2',       good: true },
    ],
    injuries: [
      { date: 'Feb 2026', type: 'Codo · tendinitis leve', status: 'Cerrada', weeks: 3, note: 'Fisio aplicó protocolo de reposo + carga progresiva.' },
      { date: 'Sep 2025', type: 'Tobillo · esguince G1',  status: 'Cerrada', weeks: 2, note: 'Recuperación completa, sin secuelas.' },
    ],
  },
  mental: {
    metrics: [
      { k: 'Respuesta al estrés',       v: 3.6, note: 'Mejor que hace 6 meses (+0.4). Aún cae en sets cerrados.' },
      { k: 'Foco / atención',            v: 4.2, note: 'Excelente en entrenamiento. En torneo cae después de la primera hora.' },
      { k: 'Mentalidad de crecimiento',  v: 4.4, note: 'Coachable, escucha y aplica. Pide feedback proactivamente.' },
    ],
    recentSessions: [
      { date: '24 Abr 2026', topic: 'Rutinas pre-partido', focus: 'Visualización + respiración 4-7-8' },
      { date: '17 Abr 2026', topic: 'Manejo de error',     focus: 'Reset entre puntos · 8 segundos' },
      { date: '03 Abr 2026', topic: 'Cierre de partido',   focus: 'Lo que pasa en el último game' },
    ],
  },
  character: {
    workEthic: 4.8,
    workEthicNote: 'Primera en llegar, última en irse. Suma sesiones extras de saque por iniciativa propia.',
    conduct: [
      { date: '12 Abr 2026', type: 'positivo', note: 'Después de perder la final del AMTP Puebla, felicitó públicamente a la rival.' },
      { date: '04 Feb 2026', type: 'positivo', note: 'Mentora oficial asignada a Camila Soto (U14, TTPA-022).' },
    ],
    leadership: 'Lidera la sesión grupal del jueves cuando el coach delega. Las jugadoras menores la ven como referente.',
  },
  voice: {
    goals: [
      'Subir a UTR 9.6 antes de septiembre 2026',
      'Llegar a cuadro principal de un ITF J100',
      'Avanzar TOEFL a 85+ para perfil universitario',
      'Bajar % errores no forzados en revés a < 18%',
    ],
    selfRating: [
      { k: 'On-court',  v: 4.1 },
      { k: 'Physical',  v: 4.0 },
      { k: 'Mental',    v: 3.5 },
      { k: 'Character', v: 4.4 },
    ],
    latestPTF: {
      torneo:     'AMTP Puebla Open U16 · Final',
      fecha:      '12 Abr 2026',
      result:     'Subcampeona · 6-3 4-6 6-4',
      reflection: 'Sentí que controlaba el partido hasta el 4-2 del tercer set. Después me empecé a apurar y perdí mi patrón. La rival mereció ganar porque ella no cambió su plan y yo sí. Mi primer servicio bajó al 51% en el set definitivo, ahí está la lección.',
      mood:       4,
      learned:    'Cuando voy adelante, mi mente cambia de "construir" a "defender". Tengo que mantener la intención.',
      nextFocus:  'Trabajar primer servicio bajo presión + rutina entre puntos (8s).',
    },
  },
  tournaments: [
    { id: 1, name: 'AMTP Puebla Open U16',    date: '08–12 Abr 2026', cat: 'AMTP U16', round: 'Final',     result: 'L 6-3 4-6 4-6',    utr: 9.2 },
    { id: 2, name: 'ITF J60 Cancún',          date: '02–06 Mar 2026', cat: 'ITF J60',  round: 'Q2',        result: 'L 4-6 3-6',        utr: 9.1 },
    { id: 3, name: 'UTR Match Series CDMX',   date: '15–17 Feb 2026', cat: 'UTR Open', round: 'Cuartos',   result: 'L 5-7 6-4 6-10',   utr: 9.0 },
    { id: 4, name: 'AMTP Navidad Classic',    date: '15–19 Dic 2025', cat: 'AMTP U16', round: 'Semifinal', result: 'L 6-7 6-4 4-6',    utr: 8.8 },
    { id: 5, name: 'ITF J30 Monterrey',       date: '12–16 Nov 2025', cat: 'ITF J30',  round: 'R1',        result: 'W 6-2 6-3 / L R2', utr: 8.5 },
    { id: 6, name: 'AMTP Aguascalientes U16', date: '10–13 Oct 2025', cat: 'AMTP U16', round: 'Final',     result: 'W 6-4 6-2',        utr: 8.6 },
  ],
  activity: [
    { type: 'report',  who: 'Marco Reyes', what: 'Reporte On-court · mes Abr 2026', when: 'Hace 2 días',    tag: 'On-court' },
    { type: 'ptf',     who: 'Daniela H.',  what: 'PTF · AMTP Puebla Final',         when: 'Hace 5 días',    tag: 'Voice' },
    { type: 'session', who: 'Dra. Solís',  what: 'Sesión psicología · 50 min',     when: 'Hace 1 semana',  tag: 'Mental' },
    { type: 'video',   who: 'Daniela H.',  what: 'Clip · cambio de dirección',      when: 'Hace 1 semana',  tag: 'On-court' },
    { type: 'fitness', who: 'R. García',   what: 'Batería fitness Q2',              when: 'Hace 2 semanas', tag: 'Physical' },
    { type: 'check',   who: 'Fisio',       what: 'Check semanal · sin alertas',     when: 'Hace 2 semanas', tag: 'Physical' },
  ],
  documents: [
    { name: 'Reporte mensual · Abr 2026',  type: 'PDF', size: '1.2 MB', date: '02 May 2026', tag: 'On-court' },
    { name: 'Batería fitness Q2 2026',     type: 'PDF', size: '420 KB', date: '28 Abr 2026', tag: 'Physical' },
    { name: 'Notas psicología · 24 Abr',   type: 'PDF', size: '180 KB', date: '24 Abr 2026', tag: 'Mental' },
    { name: 'PTF · AMTP Puebla',           type: 'DOC', size: '64 KB',  date: '14 Abr 2026', tag: 'Voice' },
    { name: 'Plan nutrición Q2',           type: 'PDF', size: '320 KB', date: '01 Abr 2026', tag: 'Physical' },
    { name: 'Talent Card · borrador',      type: 'PDF', size: '2.8 MB', date: '15 Mar 2026', tag: 'Talent' },
  ],
};

export function buildShallowFile(id) {
  const r = ROSTER.find(x => x.id === id);
  if (!r) return null;
  return {
    ...FILE,
    id: r.id,
    nombre: r.nombre,
    edad: r.edad,
    cat: r.cat,
    coach: r.coach,
    turno: `${r.turno} · ${r.turno === 'Matutino' ? '9:00–12:00' : '16:00–19:00'}`,
    ingreso: r.ingreso,
    utr:  { now: r.utr,  delta12: 1.0, peak: r.utr },
    amtp: { now: r.amtp, delta12: 5,   division: r.cat },
    itf:  { entrants: r.itf, sjr: r.itf === '—' ? 999 : 500, points: r.itf === '—' ? 0 : 30 },
  };
}
