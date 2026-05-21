export type Role =
  | 'Administrador'
  | 'Dirección'
  | 'RH'
  | 'Nómina'
  | 'Supervisor'
  | 'Capacitador'
  | 'Empleado operativo'
  | 'Empleado administrativo'
  | 'Aspirante'
  | 'Visualizador';

export interface Puesto {
  id: string;
  nombre: string;
  departamento: string;
  nivel: 'Operativo' | 'Supervisión' | 'Administrativo';
  sueldo: number;
  prestaciones: string[];
  horario: string;
  vacaciones: number;
  permisos: string[];
  supervisor: string;
  kpis: string[];
  cursos: string[]; // Course IDs
  checklistOnboarding: string[];
  tareasFrecuentes: string[];
}

export interface Candidate {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  puestoInteres: string;
  fase: 'Postulado' | 'Entrevista' | 'Examen' | 'Documentos' | 'Contratado';
  curp: string;
  rfc: string;
  nss: string;
  escolaridad: string;
  experiencia: string;
  disponibilidad: string;
  referencias: string;
  emergenciaNombre: string;
  emergenciaTelefono: string;
  documentos: {
    ine: boolean;
    curp: boolean;
    rfc: boolean;
    nss: boolean;
    domicilio: boolean;
    antecedentes: boolean;
    cv: boolean;
  };
  progreso: number;
}

export interface AsistenciaRegistro {
  id: string;
  empleadoId: string;
  empleadoNombre: string;
  puesto: string;
  fecha: string;
  entrada: string; // HH:MM
  salida?: string;
  comidaInicio?: string;
  comidaFin?: string;
  gps?: string;
  selfie?: string;
  status: 'Asistencia' | 'Retardo' | 'Falta';
}

export interface Course {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: 'Caja' | 'SICAR' | 'Ventas' | 'Operario' | 'Supervisor' | 'Protocolos' | 'Induccion';
  videos: { id: string; titulo: string; url: string; duracion: string }[];
  pdfs: { titulo: string; url: string }[];
  examen: {
    pregunta: string;
    opciones: string[];
    respuestaCorrecta: number;
  }[];
  xpRecompensa: number;
  insignia: string;
}

export interface Task {
  id: string;
  titulo: string;
  descripcion: string;
  area: string;
  seccion: string;
  puesto: string;
  asignadoA?: string;
  status: 'Pendiente' | 'En Progreso' | 'Completado';
  herramientaAuxiliar?: {
    tipo: 'contador' | 'limpieza' | 'evidencia';
    current?: number;
    target?: number;
    checklist?: { item: string; checked: boolean }[];
  };
  evidenciaFoto?: string;
  evidenciaComentario?: string;
  tiempoEstimado: string; // e.g. "30 min"
  tiempoReal?: string;
}

export interface Rutina {
  id: string;
  nombre: string;
  descripcion: string;
  frecuencia: 'Diaria' | 'Semanal' | 'Mensual';
  horario: 'Apertura' | 'Cierre' | 'Limpieza' | 'Inventario';
  tareasIds: string[];
  asignableA: string; // Puesto or Empleado
}

export interface BitacoraRegistro {
  id: string;
  fecha: string;
  empleadoNombre: string;
  puesto: string;
  descripcion: string;
  problemas: string;
  productosAgotados: string;
  evidenciaUrl?: string;
}

export interface ActaDisciplinaria {
  id: string;
  empleadoNombre: string;
  puesto: string;
  fecha: string;
  motivo: string;
  gravedad: 'Advertencia' | 'Acta Administrativa' | 'Suspensión';
  firmadoEmpleado: boolean;
  firmadoSupervisor: boolean;
}

export interface ActiveUser {
  name: string;
  puesto: string;
  racha: number;
  xp: number;
  insignias: string[];
}

export interface ConfiguracionLaboral {
  toleranciaMinutos: number;
  horaEntrada: string;
  horaSalida: string;
  retardosParaSancion: number;
  descuentoDiasPorSancion: number;
  leySillaActiva: boolean;
  reduccionJornada: Record<number, number>;
}
