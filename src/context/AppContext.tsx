import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Role,
  Puesto,
  Candidate,
  AsistenciaRegistro,
  Course,
  Task,
  Rutina,
  BitacoraRegistro,
  ActaDisciplinaria,
  ActiveUser,
  ConfiguracionLaboral,
} from '../types';

export type {
  Role,
  Puesto,
  Candidate,
  AsistenciaRegistro,
  Course,
  Task,
  Rutina,
  BitacoraRegistro,
  ActaDisciplinaria,
  ActiveUser,
  ConfiguracionLaboral,
};

import {
  usePuestosQuery,
  useCreatePuestoMutation,
  useCandidatesQuery,
  useCreateCandidateMutation,
  useUpdateCandidateStatusMutation,
  useAttendanceQuery,
  useCheckInMutation,
  useCursosQuery,
  useCreateCourseMutation,
  useTasksQuery,
  useCreateTaskMutation,
  useCompleteTaskMutation,
  useRutinasQuery,
  useCreateRutinaMutation,
  useBitacorasQuery,
  useCreateBitacoraMutation,
  useActasQuery,
  useCreateActaMutation,
  useLaborSettingsQuery,
  useUpdateLaborSettingsMutation,
} from '../hooks/useApi';

interface AppContextProps {
  // Authentication & RBAC
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeUser: ActiveUser;
  setActiveUser: React.Dispatch<React.SetStateAction<ActiveUser>>;

  // Configurations
  configuracionLaboral: ConfiguracionLaboral;
  updateConfiguracionLaboral: (config: Partial<ConfiguracionLaboral>) => void;

  // Lists (with CRUD / state mutations)
  puestos: Puesto[];
  setPuestos: React.Dispatch<React.SetStateAction<Puesto[]>>;
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  asistencias: AsistenciaRegistro[];
  setAsistencias: React.Dispatch<React.SetStateAction<AsistenciaRegistro[]>>;
  cursos: Course[];
  setCursos: React.Dispatch<React.SetStateAction<Course[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  rutinas: Rutina[];
  setRutinas: React.Dispatch<React.SetStateAction<Rutina[]>>;
  bitacoras: BitacoraRegistro[];
  setBitacoras: React.Dispatch<React.SetStateAction<BitacoraRegistro[]>>;
  actas: ActaDisciplinaria[];
  setActas: React.Dispatch<React.SetStateAction<ActaDisciplinaria[]>>;

  // Helper functionality
  addPuesto: (p: Omit<Puesto, 'id'>) => void;
  addCandidate: (c: Omit<Candidate, 'id' | 'progreso'>) => void;
  updateCandidateFase: (id: string, fase: Candidate['fase']) => void;
  addAsistencia: (reg: Omit<AsistenciaRegistro, 'id'>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  addTask: (t: Omit<Task, 'id'>) => void;
  addRutina: (r: Omit<Rutina, 'id'>) => void;
  addBitacora: (b: Omit<BitacoraRegistro, 'id'>) => void;
  addActa: (a: Omit<ActaDisciplinaria, 'id'>) => void;
  completeTask: (
    taskId: string,
    evidence: { foto?: string; comentario?: string; toolsData?: any }
  ) => void;
  gainXp: (amount: number) => void;
  earnBadge: (badge: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Initial Preset Data
const initialPuestos: Puesto[] = [
  {
    id: 'p-1',
    nombre: 'Cajero',
    departamento: 'Cajas',
    nivel: 'Operativo',
    sueldo: 8500,
    prestaciones: ['Aguinaldo LFT', 'IMSS', 'Infonavit', 'Fondo de Ahorro'],
    horario: '08:00 - 16:30',
    vacaciones: 12,
    permisos: ['Día de cumpleaños', 'Médico'],
    supervisor: 'Supervisor cajas',
    kpis: ['Diferencia en caja < $50 MXN', 'Atención cliente > 95%', 'Cobro promedio < 45s'],
    cursos: ['c-caja', 'c-sicar'],
    checklistOnboarding: ['Conocer reglamento', 'Apertura de terminal', 'Protocolo de saludo'],
    tareasFrecuentes: ['t-1', 't-2'],
  },
  {
    id: 'p-2',
    nombre: 'Ayudante integral',
    departamento: 'Producción',
    nivel: 'Operativo',
    sueldo: 8000,
    prestaciones: ['IMSS', 'Aguinaldo LFT', 'Infonavit'],
    horario: '08:30 - 17:00',
    vacaciones: 12,
    permisos: ['Permiso escolar'],
    supervisor: 'Supervisor de producción',
    kpis: ['Surtido góndola 100%', 'Evidencia de orden diaria', 'Merma < 1%'],
    cursos: ['c-ventas', 'c-protocolos'],
    checklistOnboarding: ['Ubicación de mercancía', 'Uso de uniforme', 'Limpieza de áreas'],
    tareasFrecuentes: ['t-3'],
  },
  {
    id: 'p-3',
    nombre: 'Supervisor cajas',
    departamento: 'Cajas',
    nivel: 'Supervisión',
    sueldo: 14000,
    prestaciones: ['IMSS', 'Aguinaldo LFT', 'Infonavit', 'Vales despensa', 'Seguro Gastos Médicos'],
    horario: '08:00 - 17:00',
    vacaciones: 14,
    permisos: ['3 días económicos al año'],
    supervisor: 'Administración',
    kpis: ['Arqueos completos', 'Minimizar colas en horas pico', 'Asistencia de equipo 98%'],
    cursos: ['c-supervisor', 'c-sicar'],
    checklistOnboarding: ['Cortes de caja avanzado', 'Manejo de conflictos', 'Control de incidencias'],
    tareasFrecuentes: ['t-4'],
  },
  {
    id: 'p-4',
    nombre: 'RH',
    departamento: 'Administración',
    nivel: 'Administrativo',
    sueldo: 18000,
    prestaciones: ['Sueldo competitivo', 'SGMM', 'Vales', 'Vacaciones extendidas'],
    horario: '09:00 - 18:00',
    vacaciones: 15,
    permisos: ['Flexibilidad de horario'],
    supervisor: 'Dirección',
    kpis: ['Vacantes cubiertas < 15 días', 'Rotación < 3% mensual', 'Progreso capacitación > 85%'],
    cursos: ['c-supervisor'],
    checklistOnboarding: ['Lectura cultura DecorArte', 'Acceso a panel ERP'],
    tareasFrecuentes: [],
  },
  {
    id: 'p-5',
    nombre: 'Asesor de ventas',
    departamento: 'Ventas',
    nivel: 'Operativo',
    sueldo: 9000,
    prestaciones: ['IMSS', 'Aguinaldo LFT', 'Vales despensa'],
    horario: '09:00 - 18:00',
    vacaciones: 12,
    permisos: ['Día de cumpleaños'],
    supervisor: 'Administrador de Sucursal',
    kpis: ['Meta de venta individual 100%', 'Atención cliente > 95%'],
    cursos: ['c-induccion', 'c-ventas'],
    checklistOnboarding: ['Aprender catálogo de dulces', 'Técnicas de venta cruzada'],
    tareasFrecuentes: [],
  },
  {
    id: 'p-6',
    nombre: 'Operario de pesaje',
    departamento: 'Pesaje',
    nivel: 'Operativo',
    sueldo: 8400,
    prestaciones: ['IMSS', 'Aguinaldo LFT', 'Fondo de Ahorro'],
    horario: '08:30 - 17:00',
    vacaciones: 12,
    permisos: ['Médico'],
    supervisor: 'Supervisor de producción',
    kpis: ['Exactitud en peso > 99.8%', 'Reporte de mermas diario'],
    cursos: ['c-induccion'],
    checklistOnboarding: ['Uso correcto de básculas', 'Llenado de bitácoras de peso'],
    tareasFrecuentes: [],
  },
  {
    id: 'p-7',
    nombre: 'Almacenista',
    departamento: 'Almacén',
    nivel: 'Operativo',
    sueldo: 8700,
    prestaciones: ['IMSS', 'Aguinaldo LFT', 'Vales'],
    horario: '08:00 - 17:00',
    vacaciones: 12,
    permisos: ['Días económicos'],
    supervisor: 'Administrador de Sucursal',
    kpis: ['Precisión de inventario > 99%', 'Rotación PEPS 100%'],
    cursos: ['c-induccion'],
    checklistOnboarding: ['Acomodo de tarimas', 'Registro de entradas y salidas en ERP'],
    tareasFrecuentes: [],
  },
  {
    id: 'p-8',
    nombre: 'Auxiliar de Limpieza',
    departamento: 'Limpieza',
    nivel: 'Operativo',
    sueldo: 7200,
    prestaciones: ['IMSS', 'Aguinaldo LFT'],
    horario: '08:30 - 16:30',
    vacaciones: 12,
    permisos: ['Médico'],
    supervisor: 'Administrador de Sucursal',
    kpis: ['Evidencia fotográfica de limpieza diaria', 'Respeto de protocolos sanitarios'],
    cursos: ['c-induccion'],
    checklistOnboarding: ['Manejo de químicos', 'Protocolo de áreas comunes'],
    tareasFrecuentes: ['t-3'],
  },
];

const initialCandidates: Candidate[] = [
  {
    id: 'cand-1',
    nombre: 'Sofía Martínez',
    correo: 'sofia.martinez@gmail.com',
    telefono: '4491234567',
    puestoInteres: 'Cajero',
    fase: 'Postulado',
    curp: 'MASD990520MDFSLN08',
    rfc: 'MAS990520TX4',
    nss: '12345678901',
    escolaridad: 'Preparatoria',
    experiencia: '1 año en tiendas de autoservicio.',
    disponibilidad: 'Inmediata, turno matutino.',
    referencias: 'Ana Gómez (Gerente OXXO - 4492233445)',
    emergenciaNombre: 'Roberto Martínez (Padre)',
    emergenciaTelefono: '4493344556',
    documentos: {
      ine: true,
      curp: true,
      rfc: false,
      nss: false,
      domicilio: true,
      antecedentes: false,
      cv: true,
    },
    progreso: 45,
  },
  {
    id: 'cand-2',
    nombre: 'Javier Hernández',
    correo: 'javier.hdez@outlook.com',
    telefono: '4499876543',
    puestoInteres: 'Ayudante integral',
    fase: 'Entrevista',
    curp: 'HERJ951112MDFRRN04',
    rfc: 'HERJ951112XYZ',
    nss: '98765432102',
    escolaridad: 'Secundaria',
    experiencia: 'Ayudante general en almacén de calzado.',
    disponibilidad: 'Turno vespertino completo.',
    referencias: 'Pedro López (Supervisor - 4498877665)',
    emergenciaNombre: 'Lucía Ortiz (Esposa)',
    emergenciaTelefono: '4491122334',
    documentos: {
      ine: true,
      curp: true,
      rfc: true,
      nss: true,
      domicilio: true,
      antecedentes: true,
      cv: true,
    },
    progreso: 80,
  },
];

const initialCursos: Course[] = [
  {
    id: 'c-induccion',
    titulo: 'Inducción General DecorArte',
    descripcion:
      'Conoce la historia, visión, valores, el reglamento oficial y las normativas esenciales de DecorArte.',
    categoria: 'Induccion',
    videos: [
      { id: 'v-ind-1', titulo: 'Historia y Filosofía de DecorArte', url: '#', duracion: '08:45' },
      { id: 'v-ind-2', titulo: 'Reglamento, Uniforme y Seguridad', url: '#', duracion: '12:30' },
      { id: 'v-ind-3', titulo: 'LFT y Ley Silla: Derechos y Deberes', url: '#', duracion: '06:15' },
    ],
    pdfs: [
      { titulo: 'Manual del Colaborador DecorArte.pdf', url: '#' },
      { titulo: 'Reglamento Interno Oficial.pdf', url: '#' },
    ],
    examen: [
      {
        pregunta: '¿Cuál es el valor primordial de DecorArte respecto al cliente?',
        opciones: ['Atención premium y personalizada', 'Vender a toda costa', 'Cobrar rápido únicamente'],
        respuestaCorrecta: 0,
      },
      {
        pregunta: '¿Cuál es la regla de tolerancia de asistencia?',
        opciones: [
          'No hay límite de tolerancia',
          'Entrada 8:30 con 10 minutos de tolerancia (máx 8:40)',
          '20 minutos de tolerancia',
        ],
        respuestaCorrecta: 1,
      },
      {
        pregunta: '¿Qué es la "Ley Silla" en DecorArte?',
        opciones: [
          'Prohibición de sentarse',
          'Derecho a contar con un asiento para descanso en momentos sin clientes',
          'Obligación de trabajar sentados',
        ],
        respuestaCorrecta: 1,
      },
    ],
    xpRecompensa: 100,
    insignia: 'Pionero DecorArte',
  },
  {
    id: 'c-caja',
    titulo: 'Operación de Caja Registradora',
    descripcion:
      'Aprende los protocolos de cobro, arqueos de caja, manejo de terminales y atención al cliente al pagar.',
    categoria: 'Caja',
    videos: [
      { id: 'v-caj-1', titulo: 'Protocolo de Servicio en Caja', url: '#', duracion: '05:30' },
      { id: 'v-caj-2', titulo: 'Detección de Billetes Falsos', url: '#', duracion: '09:15' },
    ],
    pdfs: [{ titulo: 'Guía de Métodos de Pago.pdf', url: '#' }],
    examen: [
      {
        pregunta: '¿Qué hacer ante la sospecha de un billete falso?',
        opciones: [
          'Retenerlo a la fuerza',
          'Llamar al supervisor discretamente y no aceptarlo',
          'Aceptarlo de todas formas',
        ],
        respuestaCorrecta: 1,
      },
    ],
    xpRecompensa: 80,
    insignia: 'Maestro del Cambio',
  },
  {
    id: 'c-sicar',
    titulo: 'Sistema SICAR ERP Ventas',
    descripcion:
      'Manejo del software SICAR para búsqueda de códigos, inventarios rápidos, cobro y altas.',
    categoria: 'SICAR',
    videos: [
      { id: 'v-sic-1', titulo: 'Registro de Productos y Búsqueda en SICAR', url: '#', duracion: '10:00' },
    ],
    pdfs: [],
    examen: [
      {
        pregunta: '¿Qué tecla abre la sección de búsqueda rápida en SICAR?',
        opciones: ['F1', 'F10 o barra de búsqueda principal', 'ESC'],
        respuestaCorrecta: 1,
      },
    ],
    xpRecompensa: 120,
    insignia: 'Experto SICAR',
  },
];

const initialTasks: Task[] = [
  {
    id: 't-1',
    titulo: 'Relleno de Góndola de Chocolates',
    descripcion:
      'Verificar la cantidad de chocolates en pasillo central y rellenar faltantes desde bodega.',
    area: 'Pasillo chocolates',
    seccion: 'Góndolas centrales',
    puesto: 'Ayudante integral',
    asignadoA: 'Carlos Pérez',
    status: 'Pendiente',
    herramientaAuxiliar: {
      tipo: 'contador',
      current: 12,
      target: 50,
    },
    tiempoEstimado: '30 min',
  },
  {
    id: 't-2',
    titulo: 'Corte de Caja Turno Matutino',
    descripcion:
      'Realizar el arqueo, separar efectivo para depósito y cerrar terminal bancaria.',
    area: 'Caja',
    seccion: 'Caja 1',
    puesto: 'Cajero',
    asignadoA: 'Sofía Gómez',
    status: 'En Progreso',
    herramientaAuxiliar: {
      tipo: 'limpieza',
      checklist: [
        { item: 'Contar efectivo de fondo ($1,000)', checked: true },
        { item: 'Imprimir reporte de venta SICAR', checked: false },
        { item: 'Cuadrar contra vouchers de tarjeta', checked: false },
      ],
    },
    tiempoEstimado: '15 min',
  },
  {
    id: 't-3',
    titulo: 'Limpieza de Patio Trasero',
    descripcion:
      'Barrer el patio, acomodar tarimas y verificar stock de materiales de limpieza.',
    area: 'Patio',
    seccion: 'Área de tarimas',
    puesto: 'Limpieza',
    asignadoA: 'Manuel Ortiz',
    status: 'Pendiente',
    herramientaAuxiliar: {
      tipo: 'evidencia',
      checklist: [
        { item: 'Barrer hojas secas y basura', checked: false },
        { item: 'Apilar tarimas de madera de forma segura', checked: false },
        { item: 'Reportar jabón y cloro restante', checked: false },
      ],
    },
    tiempoEstimado: '45 min',
  },
];

const initialRutinas: Rutina[] = [
  {
    id: 'r-1',
    nombre: 'Rutina de Apertura',
    descripcion: 'Pautas para habilitar la tienda al público puntualmente y con orden.',
    frecuencia: 'Diaria',
    horario: 'Apertura',
    tareasIds: ['t-1'],
    asignableA: 'Ayudante integral',
  },
  {
    id: 'r-2',
    nombre: 'Rutina de Cierre de Caja',
    descripcion: 'Asegurar el resguardo de dinero y el cierre limpio de terminales.',
    frecuencia: 'Diaria',
    horario: 'Cierre',
    tareasIds: ['t-2'],
    asignableA: 'Cajero',
  },
];

const initialAsistencias: AsistenciaRegistro[] = [
  {
    id: 'a-1',
    empleadoId: 'emp-operativo',
    empleadoNombre: 'Carlos Pérez',
    puesto: 'Ayudante integral',
    fecha: '2026-05-20',
    entrada: '08:25',
    salida: '17:02',
    comidaInicio: '13:00',
    comidaFin: '14:00',
    gps: '21.8853, -102.2916',
    selfie:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    status: 'Asistencia',
  },
  {
    id: 'a-2',
    empleadoId: 'emp-caja',
    empleadoNombre: 'Sofía Gómez',
    puesto: 'Cajero',
    fecha: '2026-05-20',
    entrada: '08:42',
    salida: '16:30',
    comidaInicio: '12:30',
    comidaFin: '13:15',
    gps: '21.8850, -102.2910',
    selfie:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    status: 'Retardo',
  },
];

const initialConfiguracionLaboral: ConfiguracionLaboral = {
  toleranciaMinutos: 10,
  horaEntrada: '08:30',
  horaSalida: '17:00',
  retardosParaSancion: 3,
  descuentoDiasPorSancion: 1,
  leySillaActiva: true,
  reduccionJornada: {
    2026: 48,
    2027: 46,
    2028: 44,
    2029: 42,
    2030: 40,
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isApi = import.meta.env.VITE_API_MODE === 'api';

  // Local state fallbacks (Mock Mode)
  const [configuracionLaboral, setConfiguracionLaboral] = useState<ConfiguracionLaboral>(() => {
    const saved = localStorage.getItem('configuracionLaboral');
    return saved ? JSON.parse(saved) : initialConfiguracionLaboral;
  });

  const [activeRole, setActiveRole] = useState<Role>(() => {
    const saved = localStorage.getItem('activeRole');
    return (saved as Role) || 'Administrador';
  });

  const [activeUser, setActiveUser] = useState<ActiveUser>(() => {
    const saved = localStorage.getItem('activeUser');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Daniel Sánchez',
          puesto: 'Administrador de Operaciones',
          racha: 4,
          xp: 230,
          insignias: ['Bienvenida', 'Pionero DecorArte'],
        };
  });

  const [puestos, setPuestos] = useState<Puesto[]>(() => {
    const saved = localStorage.getItem('puestos');
    return saved ? JSON.parse(saved) : initialPuestos;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('candidates');
    return saved ? JSON.parse(saved) : initialCandidates;
  });

  const [asistencias, setAsistencias] = useState<AsistenciaRegistro[]>(() => {
    const saved = localStorage.getItem('asistencias');
    return saved ? JSON.parse(saved) : initialAsistencias;
  });

  const [cursos, setCursos] = useState<Course[]>(() => {
    const saved = localStorage.getItem('cursos');
    return saved ? JSON.parse(saved) : initialCursos;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [rutinas, setRutinas] = useState<Rutina[]>(() => {
    const saved = localStorage.getItem('rutinas');
    return saved ? JSON.parse(saved) : initialRutinas;
  });

  const [bitacoras, setBitacoras] = useState<BitacoraRegistro[]>(() => {
    const saved = localStorage.getItem('bitacoras');
    return saved ? JSON.parse(saved) : [];
  });

  const [actas, setActas] = useState<ActaDisciplinaria[]>(() => {
    const saved = localStorage.getItem('actas');
    return saved ? JSON.parse(saved) : [];
  });

  // API Queries (enabled only in live API Mode)
  const { data: apiPuestos } = usePuestosQuery();
  const { data: apiCandidates } = useCandidatesQuery();
  const { data: apiAsistencias } = useAttendanceQuery();
  const { data: apiCursos } = useCursosQuery();
  const { data: apiTasks } = useTasksQuery();
  const { data: apiRutinas } = useRutinasQuery();
  const { data: apiBitacoras } = useBitacorasQuery();
  const { data: apiActas } = useActasQuery();
  const { data: apiLaborSettings } = useLaborSettingsQuery();

  // API Mutations
  const createPuesto = useCreatePuestoMutation();
  const createCandidate = useCreateCandidateMutation();
  const updateCandidateStatus = useUpdateCandidateStatusMutation();
  const checkIn = useCheckInMutation();
  const createCourse = useCreateCourseMutation();
  const createTask = useCreateTaskMutation();
  const completeTaskMutation = useCompleteTaskMutation();
  const createRutina = useCreateRutinaMutation();
  const createBitacora = useCreateBitacoraMutation();
  const createActa = useCreateActaMutation();
  const updateLaborSettings = useUpdateLaborSettingsMutation();

  // Local storage synchronization (only sync local states in mock mode)
  useEffect(() => {
    localStorage.setItem('configuracionLaboral', JSON.stringify(configuracionLaboral));
  }, [configuracionLaboral]);

  // Synchronize API configuration to local state
  useEffect(() => {
    if (isApi && apiLaborSettings) {
      setConfiguracionLaboral(apiLaborSettings);
    }
  }, [apiLaborSettings, isApi]);

  useEffect(() => {
    localStorage.setItem('activeRole', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
  }, [activeUser]);

  useEffect(() => {
    if (!isApi) localStorage.setItem('puestos', JSON.stringify(puestos));
  }, [puestos, isApi]);

  useEffect(() => {
    if (!isApi) localStorage.setItem('candidates', JSON.stringify(candidates));
  }, [candidates, isApi]);

  useEffect(() => {
    if (!isApi) localStorage.setItem('asistencias', JSON.stringify(asistencias));
  }, [asistencias, isApi]);

  useEffect(() => {
    if (!isApi) localStorage.setItem('cursos', JSON.stringify(cursos));
  }, [cursos, isApi]);

  useEffect(() => {
    if (!isApi) localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks, isApi]);

  useEffect(() => {
    if (!isApi) localStorage.setItem('rutinas', JSON.stringify(rutinas));
  }, [rutinas, isApi]);

  useEffect(() => {
    if (!isApi) localStorage.setItem('bitacoras', JSON.stringify(bitacoras));
  }, [bitacoras, isApi]);

  useEffect(() => {
    if (!isApi) localStorage.setItem('actas', JSON.stringify(actas));
  }, [actas, isApi]);

  // Derived lists
  const activePuestos = isApi && apiPuestos ? apiPuestos : puestos;
  const activeCandidates = isApi && apiCandidates ? apiCandidates : candidates;
  const activeAsistencias = isApi && apiAsistencias ? apiAsistencias : asistencias;
  const activeCursos = isApi && apiCursos ? apiCursos : cursos;
  const activeTasks = isApi && apiTasks ? apiTasks : tasks;
  const activeRutinas = isApi && apiRutinas ? apiRutinas : rutinas;
  const activeBitacoras = isApi && apiBitacoras ? apiBitacoras : bitacoras;
  const activeActas = isApi && apiActas ? apiActas : actas;

  // MUTATIONS / ACTIONS
  const addPuesto = (p: Omit<Puesto, 'id'>) => {
    if (isApi) {
      createPuesto.mutate(p);
    } else {
      const newPuesto: Puesto = {
        ...p,
        id: `p-${Date.now()}`,
      };
      setPuestos((prev) => [...prev, newPuesto]);
    }
  };

  const addCandidate = (c: Omit<Candidate, 'id' | 'progreso'>) => {
    if (isApi) {
      createCandidate.mutate(c);
    } else {
      const newCandidate: Candidate = {
        ...c,
        id: `cand-${Date.now()}`,
        progreso: 25,
      };
      setCandidates((prev) => [...prev, newCandidate]);
    }
  };

  const updateCandidateFase = (id: string, fase: Candidate['fase']) => {
    if (isApi) {
      updateCandidateStatus.mutate({ id, fase });
    } else {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            let progreso = 25;
            if (fase === 'Entrevista') progreso = 50;
            if (fase === 'Examen') progreso = 75;
            if (fase === 'Documentos') progreso = 90;
            if (fase === 'Contratado') progreso = 100;
            return { ...c, fase, progreso };
          }
          return c;
        })
      );
    }
  };

  const addAsistencia = (reg: Omit<AsistenciaRegistro, 'id'>) => {
    if (isApi) {
      checkIn.mutate({ gps: reg.gps, selfie: reg.selfie });
    } else {
      const newReg: AsistenciaRegistro = {
        ...reg,
        id: `a-${Date.now()}`,
      };
      setAsistencias((prev) => [newReg, ...prev]);
    }
  };

  const addCourse = (course: Omit<Course, 'id'>) => {
    if (isApi) {
      createCourse.mutate(course);
    } else {
      const newCourse: Course = {
        ...course,
        id: `c-${Date.now()}`,
      };
      setCursos((prev) => [...prev, newCourse]);
    }
  };

  const addTask = (t: Omit<Task, 'id'>) => {
    if (isApi) {
      createTask.mutate(t);
    } else {
      const newTask: Task = {
        ...t,
        id: `t-${Date.now()}`,
      };
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const addRutina = (r: Omit<Rutina, 'id'>) => {
    if (isApi) {
      createRutina.mutate(r);
    } else {
      const newRutina: Rutina = {
        ...r,
        id: `r-${Date.now()}`,
      };
      setRutinas((prev) => [...prev, newRutina]);
    }
  };

  const addBitacora = (b: Omit<BitacoraRegistro, 'id'>) => {
    if (isApi) {
      createBitacora.mutate(b);
    } else {
      const newBitacora: BitacoraRegistro = {
        ...b,
        id: `bit-${Date.now()}`,
      };
      setBitacoras((prev) => [newBitacora, ...prev]);
    }
  };

  const addActa = (a: Omit<ActaDisciplinaria, 'id'>) => {
    if (isApi) {
      createActa.mutate(a);
    } else {
      const newActa: ActaDisciplinaria = {
        ...a,
        id: `acta-${Date.now()}`,
      };
      setActas((prev) => [newActa, ...prev]);
    }
  };

  const completeTask = (
    taskId: string,
    evidence: { foto?: string; comentario?: string; toolsData?: any }
  ) => {
    if (isApi) {
      completeTaskMutation.mutate({ id: taskId, evidence });
    } else {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            const updatedTask: Task = {
              ...t,
              status: 'Completado',
              evidenciaFoto: evidence.foto,
              evidenciaComentario: evidence.comentario,
              tiempoReal: 'Completado en momento',
            };
            if (t.herramientaAuxiliar && evidence.toolsData) {
              updatedTask.herramientaAuxiliar = {
                ...t.herramientaAuxiliar,
                ...evidence.toolsData,
              };
            }
            return updatedTask;
          }
          return t;
        })
      );
      gainXp(15);
    }
  };

  const gainXp = (amount: number) => {
    setActiveUser((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  const earnBadge = (badge: string) => {
    setActiveUser((prev) => {
      if (prev.insignias.includes(badge)) return prev;
      return {
        ...prev,
        insignias: [...prev.insignias, badge],
      };
    });
  };

  const updateConfiguracionLaboral = (config: Partial<ConfiguracionLaboral>) => {
    if (isApi) {
      updateLaborSettings.mutate(config);
    } else {
      setConfiguracionLaboral((prev) => ({
        ...prev,
        ...config,
      }));
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeUser,
        setActiveUser,
        configuracionLaboral,
        updateConfiguracionLaboral,
        puestos: activePuestos,
        setPuestos: setPuestos as any,
        candidates: activeCandidates,
        setCandidates: setCandidates as any,
        asistencias: activeAsistencias,
        setAsistencias: setAsistencias as any,
        cursos: activeCursos,
        setCursos: setCursos as any,
        tasks: activeTasks,
        setTasks: setTasks as any,
        rutinas: activeRutinas,
        setRutinas: setRutinas as any,
        bitacoras: activeBitacoras,
        setBitacoras: setBitacoras as any,
        actas: activeActas,
        setActas: setActas as any,
        addPuesto,
        addCandidate,
        updateCandidateFase,
        addAsistencia,
        addCourse,
        addTask,
        addRutina,
        addBitacora,
        addActa,
        completeTask,
        gainXp,
        earnBadge,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
