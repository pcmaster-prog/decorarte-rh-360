import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type {
  Puesto,
  Candidate,
  AsistenciaRegistro,
  Course,
  Task,
  Rutina,
  BitacoraRegistro,
  ActaDisciplinaria,
  ConfiguracionLaboral,
} from '../types';

// Auth Hook
export function useLoginMutation() {
  return useMutation({
    mutationFn: async (credentials: { email: string; password?: string; google_token?: string }) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
  });
}

// Dashboard Hook
export function useDashboardQuery(role: string) {
  return useQuery({
    queryKey: ['dashboard', role],
    queryFn: async () => {
      const response = await api.get(`/dashboard?role=${role}`);
      return response.data;
    },
    enabled: import.meta.env.VITE_API_MODE === 'api',
  });
}

// Puestos Hooks
export function usePuestosQuery() {
  return useQuery<Puesto[]>({
    queryKey: ['puestos'],
    queryFn: async () => {
      const response = await api.get('/users/puestos');
      return response.data;
    },
    enabled: import.meta.env.VITE_API_MODE === 'api',
  });
}

export function useCreatePuestoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (puesto: Omit<Puesto, 'id'>) => {
      const response = await api.post('/users/puestos', puesto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puestos'] });
    },
  });
}

// Candidates Hooks
export function useCandidatesQuery() {
  return useQuery<Candidate[]>({
    queryKey: ['candidates'],
    queryFn: async () => {
      const response = await api.get('/recruitment/applicants');
      return response.data;
    },
    enabled: import.meta.env.VITE_API_MODE === 'api',
  });
}

export function useCreateCandidateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (candidate: Omit<Candidate, 'id' | 'progreso'>) => {
      const response = await api.post('/recruitment/applicants', candidate);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}

export function useUpdateCandidateStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, fase }: { id: string; fase: Candidate['fase'] }) => {
      const response = await api.put(`/recruitment/applicants/${id}/status`, { status: fase });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}

// Attendance Hooks
export function useAttendanceQuery() {
  return useQuery<AsistenciaRegistro[]>({
    queryKey: ['attendance'],
    queryFn: async () => {
      const response = await api.get('/attendance');
      return response.data;
    },
    enabled: import.meta.env.VITE_API_MODE === 'api',
  });
}

export function useCheckInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { selfie?: string; gps?: string }) => {
      const response = await api.post('/attendance/check-in', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useCheckOutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/attendance/check-out');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

// LMS Cursos Hooks
export function useCursosQuery() {
  return useQuery<Course[]>({
    queryKey: ['cursos'],
    queryFn: async () => {
      const response = await api.get('/academy/courses');
      return response.data;
    },
    enabled: import.meta.env.VITE_API_MODE === 'api',
  });
}

export function useCreateCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (course: Omit<Course, 'id'>) => {
      const response = await api.post('/academy/courses', course);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
    },
  });
}

// Tasks Hooks
export function useTasksQuery() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await api.get('/work-areas/task-assignments');
      return response.data;
    },
    enabled: import.meta.env.VITE_API_MODE === 'api',
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Omit<Task, 'id'>) => {
      const response = await api.post('/work-areas/task-assignments', task);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useCompleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      evidence,
    }: {
      id: string;
      evidence: { foto?: string; comentario?: string; toolsData?: any };
    }) => {
      const response = await api.put(`/work-areas/task-assignments/${id}/complete`, evidence);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// Routines Hooks
export function useRutinasQuery() {
  return useQuery<Rutina[]>({
    queryKey: ['rutinas'],
    queryFn: async () => {
      const response = await api.get('/routines');
      return response.data;
    },
    enabled: import.meta.env.VITE_API_MODE === 'api',
  });
}

export function useCreateRutinaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rutina: Omit<Rutina, 'id'>) => {
      const response = await api.post('/routines', rutina);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutinas'] });
    },
  });
}

// Bitacoras Hooks
export function useBitacorasQuery() {
  return useQuery<BitacoraRegistro[]>({
    queryKey: ['bitacoras'],
    queryFn: async () => {
      const response = await api.get('/reports/bitacoras');
      return response.data;
    },
    enabled: import.meta.env.VITE_API_MODE === 'api',
  });
}

export function useCreateBitacoraMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bitacora: Omit<BitacoraRegistro, 'id'>) => {
      const response = await api.post('/reports/bitacoras', bitacora);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras'] });
    },
  });
}

// Actas Disciplinarias Hooks
export function useActasQuery() {
  return useQuery<ActaDisciplinaria[]>({
    queryKey: ['actas'],
    queryFn: async () => {
      const response = await api.get('/employees/disciplinary/actas');
      return response.data;
    },
    enabled: import.meta.env.VITE_API_MODE === 'api',
  });
}

export function useCreateActaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (acta: Omit<ActaDisciplinaria, 'id'>) => {
      const response = await api.post('/employees/disciplinary/actas', acta);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actas'] });
    },
  });
}

// Labor Settings Hooks
export function useLaborSettingsQuery() {
  return useQuery<ConfiguracionLaboral>({
    queryKey: ['labor-settings'],
    queryFn: async () => {
      const response = await api.get('/labor-settings');
      return response.data;
    },
    enabled: import.meta.env.VITE_API_MODE === 'api',
  });
}

export function useUpdateLaborSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: Partial<ConfiguracionLaboral>) => {
      const response = await api.put('/labor-settings', config);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labor-settings'] });
    },
  });
}
