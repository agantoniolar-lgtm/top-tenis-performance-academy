// ============================================================
// Datos dummy para Top Tenis Performance Academy
// ============================================================

// --- Alumnos ---
export const alumnos = [
  {
    id: 1,
    nombre: 'Carlos Mendoza',
    edad: 16,
    utr: 8.4,
    ranking: '#47 U18',
    horario: 'Matutino',
    coach: 'Marco Reyes',
    avatar: null,
  },
  {
    id: 2,
    nombre: 'Sofía Ruiz',
    edad: 15,
    utr: 7.2,
    ranking: '#23 U16',
    horario: 'Vespertino',
    coach: 'Marco Reyes',
    avatar: null,
  },
  {
    id: 3,
    nombre: 'Diego Vargas',
    edad: 17,
    utr: 9.1,
    ranking: '#12 U18',
    horario: 'Matutino',
    coach: 'Alejandro',
    avatar: null,
  },
  {
    id: 4,
    nombre: 'Valentina Torres',
    edad: 14,
    utr: 6.8,
    ranking: '#31 U14',
    horario: 'Matutino',
    coach: 'Marco Reyes',
    avatar: null,
  },
  {
    id: 5,
    nombre: 'Rodrigo Ávila',
    edad: 18,
    utr: 10.3,
    ranking: '#8 U18',
    horario: 'Matutino',
    coach: 'Alejandro',
    avatar: null,
  },
  {
    id: 6,
    nombre: 'Camila Soto',
    edad: 13,
    utr: 5.9,
    ranking: '#44 U14',
    horario: 'Vespertino',
    coach: 'Marco Reyes',
    avatar: null,
  },
];

// --- Torneos Públicos (sitio público) ---
export const torneosPublicos = [
  {
    id: 1,
    nombre: 'AMTP Puebla Open U18',
    fecha: 'Marzo 2026',
    ubicacion: 'Puebla',
    categoria: 'U18',
    resultadoEquipo: {
      resumen: '2 semifinalistas, 1 finalista',
      destacados: [
        'Rodrigo Ávila — Campeón',
        'Carlos Mendoza — Semifinal',
        'Diego Vargas — Semifinal',
      ],
    },
  },
  {
    id: 2,
    nombre: 'UTR Pro Match Series CDMX',
    fecha: 'Febrero 2026',
    ubicacion: 'Ciudad de México',
    categoria: 'Abierta',
    resultadoEquipo: {
      resumen: '1 campeón, 1 finalista',
      destacados: [
        'Carlos Mendoza — Finalista',
        'Rodrigo Ávila — Cuartos de final',
      ],
    },
  },
  {
    id: 3,
    nombre: 'ITF J60 Guadalajara',
    fecha: 'Enero 2026',
    ubicacion: 'Guadalajara',
    categoria: 'ITF Junior',
    resultadoEquipo: {
      resumen: '3 participantes en cuadro principal',
      destacados: [
        'Diego Vargas — Cuartos de final',
        'Rodrigo Ávila — 2da ronda',
        'Carlos Mendoza — Qualy R2',
      ],
    },
  },
  {
    id: 4,
    nombre: 'AMTP Navidad Classic',
    fecha: 'Diciembre 2025',
    ubicacion: 'Monterrey',
    categoria: 'U18',
    resultadoEquipo: {
      resumen: '1 subcampeón, 2 semifinalistas',
      destacados: [
        'Carlos Mendoza — Subcampeón U18',
        'Sofía Ruiz — Semifinal U16',
        'Valentina Torres — Cuartos U14',
      ],
    },
  },
  {
    id: 5,
    nombre: 'ITF J30 Monterrey',
    fecha: 'Noviembre 2025',
    ubicacion: 'Monterrey',
    categoria: 'ITF Junior',
    resultadoEquipo: {
      resumen: '2 participantes en cuadro principal',
      destacados: [
        'Rodrigo Ávila — Semifinal',
        'Diego Vargas — 1ra ronda',
      ],
    },
  },
];

// --- Próximos Torneos ---
export const proximosTorneos = [
  {
    id: 1,
    nombre: 'AMTP Querétaro Open U18',
    fecha: '25-28 Abril 2026',
    ubicacion: 'Querétaro',
    categoria: 'U18',
    inscripcionCierre: '18 Abril 2026',
    inscritos: ['Carlos Mendoza', 'Diego Vargas', 'Rodrigo Ávila'],
  },
  {
    id: 2,
    nombre: 'ITF J60 Cancún',
    fecha: '10-16 Mayo 2026',
    ubicacion: 'Cancún',
    categoria: 'ITF Junior',
    inscripcionCierre: '1 Mayo 2026',
    inscritos: ['Rodrigo Ávila', 'Diego Vargas'],
  },
  {
    id: 3,
    nombre: 'UTR Pro Match Series Puebla',
    fecha: '23-24 Mayo 2026',
    ubicacion: 'Puebla',
    categoria: 'Abierta',
    inscripcionCierre: '16 Mayo 2026',
    inscritos: ['Carlos Mendoza'],
  },
  {
    id: 4,
    nombre: 'AMTP Nacional U14/U16',
    fecha: '5-10 Junio 2026',
    ubicacion: 'Ciudad de México',
    categoria: 'U14 / U16',
    inscripcionCierre: '25 Mayo 2026',
    inscritos: ['Sofía Ruiz', 'Valentina Torres', 'Camila Soto'],
  },
];

// --- Historial de Torneos de Carlos Mendoza ---
export const torneoCarlos = [
  {
    id: 1,
    nombre: 'AMTP Puebla Open U18',
    fecha: 'Marzo 2026',
    ronda: 'Semifinal',
    resultado: 'Derrota 6-4 3-6 4-6',
    victoria: false,
    ptf: {
      estado: 'Pendiente',
      completado: false,
    },
  },
  {
    id: 2,
    nombre: 'UTR Match Series CDMX',
    fecha: 'Febrero 2026',
    ronda: 'Final',
    resultado: 'Victoria 6-3 6-2',
    victoria: true,
    ptf: {
      estado: 'Completado',
      completado: true,
    },
  },
  {
    id: 3,
    nombre: 'ITF J60 Guadalajara',
    fecha: 'Enero 2026',
    ronda: 'Q2 (Qualy segunda ronda)',
    resultado: 'Derrota 3-6 2-6',
    victoria: false,
    ptf: {
      estado: 'Completado',
      completado: true,
    },
  },
  {
    id: 4,
    nombre: 'AMTP Navidad Classic',
    fecha: 'Diciembre 2025',
    ronda: 'Final U18',
    resultado: 'Subcampeón',
    victoria: false,
    ptf: {
      estado: 'Completado',
      completado: true,
    },
  },
];

// --- UTR Histórico de Carlos ---
export const utrHistorico = {
  meses: [
    'May 25', 'Jun 25', 'Jul 25', 'Ago 25', 'Sep 25', 'Oct 25',
    'Nov 25', 'Dic 25', 'Ene 26', 'Feb 26', 'Mar 26', 'Abr 26',
  ],
  valores: [7.8, 7.9, 7.9, 8.0, 8.1, 8.0, 8.2, 8.3, 8.3, 8.4, 8.4, 8.4],
};

// --- Balance de Partidos de Carlos ---
export const balancePartidos = {
  total: {
    victorias: 14,
    derrotas: 8,
  },
  porCategoria: [
    { categoria: 'AMTP', victorias: 9, derrotas: 4 },
    { categoria: 'ITF', victorias: 3, derrotas: 3 },
    { categoria: 'UTR', victorias: 2, derrotas: 1 },
  ],
};

// --- Reporte Mensual de Carlos (Enero 2026) ---
export const reporteCarlos = {
  alumno: 'Carlos Mendoza',
  periodo: 'Enero 2026',
  coach: 'Marco Reyes',
  resumenCoach:
    'Carlos mostró un progreso constante durante enero. Su compromiso en los entrenamientos fue destacable, especialmente en las sesiones de táctica. Si bien el resultado en el ITF J60 no fue el esperado, la experiencia de enfrentar un nivel más alto de competencia es valiosa para su desarrollo. Necesita trabajar en el control emocional durante momentos de presión y mejorar la consistencia de su segundo servicio.',
  dimensiones: [
    {
      nombre: 'Técnica',
      puntaje: 7.5,
      nota: 'Buen avance en el revés a dos manos. El drive sigue siendo su golpe más sólido. Hay que pulir la volea de revés y la consistencia del segundo servicio.',
    },
    {
      nombre: 'Táctica',
      puntaje: 7.0,
      nota: 'Entiende patrones de juego básicos y los aplica bien en entrenamientos. En torneo tiende a abandonar el plan de juego cuando va abajo en el marcador.',
    },
    {
      nombre: 'Físico',
      puntaje: 8.0,
      nota: 'Excelente condición aeróbica. Ha mejorado la velocidad lateral. Debe seguir trabajando en la fuerza del tren superior para ganar potencia en el servicio.',
    },
    {
      nombre: 'Mental',
      puntaje: 6.5,
      nota: 'Área de mayor oportunidad. Se frustra con facilidad en partidos cerrados. Estamos implementando rutinas de respiración y visualización pre-punto.',
    },
    {
      nombre: 'Torneos',
      puntaje: 7.0,
      nota: 'Buen nivel en torneos AMTP. El salto a ITF aún es un reto, pero la exposición es necesaria. Debe enfocarse en ganar rondas de qualy de manera consistente.',
    },
  ],
  areasDeOportunidad: [
    'Control emocional en partidos cerrados y bajo presión',
    'Consistencia del segundo servicio (actualmente ~52% de efectividad)',
    'Transición a la red y volea de revés',
    'Mantener el plan de juego táctico durante todo el partido',
  ],
  proximosObjetivos: [
    'Subir UTR a 8.5+ antes de junio 2026',
    'Ganar al menos una ronda de qualy en el próximo ITF',
    'Mejorar porcentaje de segundo servicio a 60%+',
    'Completar programa de fortalecimiento de tren superior (12 semanas)',
    'Implementar rutina mental pre-partido de forma consistente',
  ],
};

// --- Ejercicios Asignados a Carlos ---
export const ejerciciosCarlos = [
  {
    id: 1,
    titulo: 'Trabajo de piernas',
    descripcion: 'Ejercicio de agilidad con escalera y conos. 3 series de 8 repeticiones con descanso de 45 segundos entre series.',
    fechaAsignacion: '7 Abril 2026',
    estado: 'Video enviado',
    videoUrl: null,
    comentarioCoach: null,
  },
  {
    id: 2,
    titulo: 'Rutina de preventivos',
    descripcion: 'Rutina de calentamiento y estiramientos preventivos para hombro y codo. Realizar antes de cada sesión de entrenamiento.',
    fechaAsignacion: '2 Abril 2026',
    estado: 'Revisado',
    videoUrl: null,
    comentarioCoach: 'Buena ejecución. Asegúrate de mantener la postura correcta en el estiramiento de hombro.',
  },
  {
    id: 3,
    titulo: 'Sombra de golpes',
    descripcion: 'Práctica de sombra enfocada en el swing del revés a dos manos. 50 repeticiones con foco en la rotación de cadera.',
    fechaAsignacion: '1 Abril 2026',
    estado: 'Revisado',
    videoUrl: null,
    comentarioCoach: 'Muy bien la rotación. Cuida que el codo izquierdo no se abra al momento del impacto.',
  },
];

// --- Actividad Reciente (feed del dashboard del coach) ---
export const actividadReciente = [
  {
    id: 1,
    tipo: 'video',
    mensaje: 'Carlos Mendoza subió un video de "Trabajo de piernas"',
    fecha: '7 Abril 2026',
    hora: '18:32',
    alumno: 'Carlos Mendoza',
  },
  {
    id: 2,
    tipo: 'ptf',
    mensaje: 'Rodrigo Ávila completó el Post-Torneo Form del AMTP Puebla Open',
    fecha: '6 Abril 2026',
    hora: '21:15',
    alumno: 'Rodrigo Ávila',
  },
  {
    id: 3,
    tipo: 'ejercicio',
    mensaje: 'Sofía Ruiz marcó como completado "Circuito de resistencia"',
    fecha: '5 Abril 2026',
    hora: '17:45',
    alumno: 'Sofía Ruiz',
  },
  {
    id: 4,
    tipo: 'inscripcion',
    mensaje: 'Diego Vargas se inscribió al AMTP Querétaro Open U18',
    fecha: '5 Abril 2026',
    hora: '10:20',
    alumno: 'Diego Vargas',
  },
  {
    id: 5,
    tipo: 'reporte',
    mensaje: 'Se publicó el reporte mensual de Valentina Torres (Marzo 2026)',
    fecha: '4 Abril 2026',
    hora: '09:00',
    alumno: 'Valentina Torres',
  },
  {
    id: 6,
    tipo: 'ptf',
    mensaje: 'Carlos Mendoza tiene pendiente el PTF del AMTP Puebla Open',
    fecha: '3 Abril 2026',
    hora: '08:00',
    alumno: 'Carlos Mendoza',
  },
];
