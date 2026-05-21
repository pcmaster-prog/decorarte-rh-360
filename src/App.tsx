import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ATSModule } from './components/ATSModule';
import { ERPModule } from './components/ERPModule';
import { LMSModule } from './components/LMSModule';
import { TaskManagerModule } from './components/TaskManagerModule';
import { ReportsModule } from './components/ReportsModule';
import { VisualBuildersModule } from './components/VisualBuildersModule';
import { ApplicantPortal } from './components/ApplicantPortal';
import {
  Sparkles,
  Flame,
  Award,
  Bell,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Users,
  CheckSquare,
  Briefcase,
  FileText,
  ShieldAlert,
  GraduationCap,
  DollarSign,
  Calendar
} from 'lucide-react';
import './App.css';

function MainAppContent() {
  const { activeRole, setActiveRole } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Route to correct module component based on tab selection
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView setCurrentTab={setCurrentTab} />;
      case 'reclutamiento':
        return <ATSModule />;
      case 'erp-rh':
        return <ERPModule />;
      case 'lms':
        return <LMSModule />;
      case 'tasks':
        return <TaskManagerModule />;
      case 'builders':
        return <VisualBuildersModule />;
      case 'reports':
        return <ReportsModule />;
      default:
        return <DashboardView setCurrentTab={setCurrentTab} />;
    }
  };

  // If candidate view, render full screen portal with simulator switcher bar
  if (activeRole === 'Aspirante') {
    return (
      <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden">
        {/* Developer preview banner */}
        <div className="bg-indigo-950/40 border-b border-indigo-900/30 px-6 py-2 flex items-center justify-between text-xs z-50">
          <span className="text-slate-350 flex items-center space-x-1.5 font-sans">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            <span>Simulador de Aspirante Público (DecorArte ATS)</span>
          </span>
          <button
            onClick={() => setActiveRole('Administrador')}
            className="px-3 py-1 bg-indigo-650 hover:bg-indigo-600 rounded text-[10px] font-bold text-white transition-all shadow-md shadow-indigo-650/15 font-sans"
          >
            Volver a Administrador
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ApplicantPortal />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans antialiased text-slate-100">
      {/* Sidebar navigation */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main app panel */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Global header bar */}
        <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Scrollable module contents */}
        <main className="flex-1 overflow-y-auto bg-slate-950/60 relative">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

// Inner Component: High-Fidelity Executive/Employee Dashboard View
const DashboardView: React.FC<{ setCurrentTab: (tab: string) => void }> = ({ setCurrentTab }) => {
  const { activeUser, activeRole, puestos, candidates, tasks, cursos, actas } = useApp();

  // Dynamic statistics calculations
  const totalEmployeesCount = 8; // Simulating active headcount
  const openVacanciesCount = puestos.filter(p => p.nombre !== 'RH').length;
  const inPipelineCandidatesCount = candidates.filter(c => c.fase !== 'Contratado').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Completado').length;
  const activeCoursesCount = cursos.length;
  const disciplineIncidentsCount = actas.length;

  // Mock announcements list
  const announcements = [
    {
      id: 1,
      tag: 'Importante',
      title: 'Uso Obligatorio de Uniforme Oficial',
      desc: 'A partir del lunes es obligatorio portar el chaleco de mezclilla y la playera polo corporativa con el logotipo bordado en el lado izquierdo. Aplican actas administrativas en caso de incumplimiento.',
      date: 'Hace 1 día',
      type: 'urgente'
    },
    {
      id: 2,
      tag: 'Bienestar',
      title: 'Alineación de Descanso - Ley Silla',
      desc: 'En DecorArte garantizamos asientos ergonómicos con respaldo en áreas de cajas y mostrador para prevenir fatiga laboral. Tu salud y bienestar son prioritarios en nuestra operación.',
      date: 'Hace 3 días',
      type: 'bienestar'
    },
    {
      id: 3,
      tag: 'Crecimiento',
      title: 'Programa de Ascenso Interno 2026',
      desc: '¿Quieres pasar a ser Supervisor? Completa todos los niveles de capacitación en la Academia y postúlate directamente en el ATS para vacantes internas automáticas.',
      date: 'Hace 5 días',
      type: 'crecimiento'
    }
  ];

  // Helper to render role-based metrics
  const renderRoleMetrics = () => {
    switch (activeRole) {
      case 'Administrador':
      case 'Dirección':
        return (
          <>
            {/* head count */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-indigo-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Plantilla Activa</span>
                <h3 className="text-xl font-black text-white flex items-center space-x-2">
                  <span>{totalEmployeesCount} Colaboradores</span>
                  <Users className="h-4.5 w-4.5 text-indigo-400" />
                </h3>
                <p className="text-[10px] text-slate-400">Sucursal Irapuato (Ventas & Almacén)</p>
              </div>
              <button onClick={() => setCurrentTab('erp-rh')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {/* attendance rate */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-emerald-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Asistencia General</span>
                <h3 className="text-xl font-black text-emerald-400 flex items-center space-x-2">
                  <span>94.8% hoy</span>
                  <CheckSquare className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">Tolerancia de 10 min aplicada</p>
              </div>
              <button onClick={() => setCurrentTab('reports')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {/* payroll cost */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-pink-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Nómina Acumulada</span>
                <h3 className="text-xl font-black text-pink-400 flex items-center space-x-2">
                  <span>$34,500 MXN</span>
                  <DollarSign className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">Periodo actual (Quincenal)</p>
              </div>
              <button onClick={() => setCurrentTab('reports')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        );

      case 'RH':
        return (
          <>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-indigo-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Postulantes en Pipeline</span>
                <h3 className="text-xl font-black text-white flex items-center space-x-2">
                  <span>{inPipelineCandidatesCount} Activos</span>
                  <Briefcase className="h-4.5 w-4.5 text-indigo-400" />
                </h3>
                <p className="text-[10px] text-slate-400">Revisión de documentos y exámenes</p>
              </div>
              <button onClick={() => setCurrentTab('reclutamiento')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-purple-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Vacantes Publicadas</span>
                <h3 className="text-xl font-black text-purple-400 flex items-center space-x-2">
                  <span>{openVacanciesCount} Puestos</span>
                  <FileText className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">Sucursal Irapuato activa</p>
              </div>
              <button onClick={() => setCurrentTab('reclutamiento')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-rose-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Incidencias / Actas</span>
                <h3 className="text-xl font-black text-rose-400 flex items-center space-x-2">
                  <span>{disciplineIncidentsCount} Expedientes</span>
                  <ShieldAlert className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">Requieren firma o aclaración</p>
              </div>
              <button onClick={() => setCurrentTab('erp-rh')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        );

      case 'Nómina':
        return (
          <>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-emerald-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Nómina Quincenal</span>
                <h3 className="text-xl font-black text-emerald-400 flex items-center space-x-2">
                  <span>$34,500 MXN</span>
                  <DollarSign className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">Total acumulado en este periodo</p>
              </div>
              <button onClick={() => setCurrentTab('reports')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-amber-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Retardos a Procesar</span>
                <h3 className="text-xl font-black text-amber-500 flex items-center space-x-2">
                  <span>2 Registros</span>
                  <Clock className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">Afectan bonos de puntualidad</p>
              </div>
              <button onClick={() => setCurrentTab('erp-rh')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-slate-800 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Periodo de Pago</span>
                <h3 className="text-xl font-black text-white flex items-center space-x-2">
                  <span>Q2 Mayo 2026</span>
                  <Calendar className="h-4.5 w-4.5 text-slate-400" />
                </h3>
                <p className="text-[10px] text-slate-400">Cierre el 31 de mayo</p>
              </div>
              <button onClick={() => setCurrentTab('erp-rh')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        );

      case 'Supervisor':
        return (
          <>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-indigo-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Equipo Asignado</span>
                <h3 className="text-xl font-black text-white flex items-center space-x-2">
                  <span>5 Colaboradores</span>
                  <Users className="h-4.5 w-4.5 text-indigo-400" />
                </h3>
                <p className="text-[10px] text-slate-400">Áreas: Cajas, Pasillos, Almacén</p>
              </div>
              <button onClick={() => setCurrentTab('erp-rh')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-emerald-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Asistencia del Equipo</span>
                <h3 className="text-xl font-black text-emerald-400 flex items-center space-x-2">
                  <span>4 Activos hoy</span>
                  <CheckSquare className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">1 Retardo reportado</p>
              </div>
              <button onClick={() => setCurrentTab('erp-rh')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-purple-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Tareas Pendientes</span>
                <h3 className="text-xl font-black text-purple-400 flex items-center space-x-2">
                  <span>{pendingTasksCount} de Rutina</span>
                  <Clock className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">Requieren supervisión o evidencia</p>
              </div>
              <button onClick={() => setCurrentTab('tasks')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        );

      case 'Capacitador':
        return (
          <>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-indigo-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Cursos en Academia</span>
                <h3 className="text-xl font-black text-white flex items-center space-x-2">
                  <span>{activeCoursesCount} Programas</span>
                  <GraduationCap className="h-4.5 w-4.5 text-indigo-400" />
                </h3>
                <p className="text-[10px] text-slate-400">Inducción, Caja y SICAR</p>
              </div>
              <button onClick={() => setCurrentTab('lms')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-emerald-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Progreso de Aprobación</span>
                <h3 className="text-xl font-black text-emerald-400 flex items-center space-x-2">
                  <span>87% Completado</span>
                  <Award className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">Porcentaje promedio global</p>
              </div>
              <button onClick={() => setCurrentTab('lms')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-purple-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Evaluaciones Aplicadas</span>
                <h3 className="text-xl font-black text-purple-400 flex items-center space-x-2">
                  <span>12 Exámenes</span>
                  <FileText className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">Esta semana (Aspirantes & Equipo)</p>
              </div>
              <button onClick={() => setCurrentTab('builders')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        );

      default:
        // Operational / Admin Employee dashboard fallback
        return (
          <>
            {/* learning streak */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-orange-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Mi Racha de Aprendizaje</span>
                <h3 className="text-xl font-black text-white flex items-center space-x-2">
                  <span>{activeUser.racha} Días Activos</span>
                  <Flame className="h-5 w-5 text-orange-500 fill-orange-500/20 animate-pulse" />
                </h3>
                <p className="text-[10px] text-slate-400">Sigue capacitándote en la academia</p>
              </div>
              <button onClick={() => setCurrentTab('lms')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {/* academy XP */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-amber-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Academia DecorArte</span>
                <h3 className="text-xl font-black text-amber-500 flex items-center space-x-2">
                  <span>{activeUser.xp} XP Acumulados</span>
                  <Award className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">{activeUser.insignias.length} insignias ganadas</p>
              </div>
              <button onClick={() => setCurrentTab('lms')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {/* pending tasks */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-indigo-500/20 transition-all">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Mis Deberes del Turno</span>
                <h3 className="text-xl font-black text-indigo-400 flex items-center space-x-2">
                  <span>{pendingTasksCount} Tareas pendientes</span>
                  <CheckSquare className="h-4.5 w-4.5" />
                </h3>
                <p className="text-[10px] text-slate-400">Verifica checklists y bitácoras</p>
              </div>
              <button onClick={() => setCurrentTab('tasks')} className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        );
    }
  };

  // Helper to render role-based quick actions or content widgets
  const renderRoleDynamicContent = () => {
    // If it's a manager role, show overall branch status. If it's an employee, show their custom checklist.
    const isManager = ['Administrador', 'Dirección', 'RH', 'Supervisor'].includes(activeRole);

    if (isManager) {
      return (
        <div className="glass-panel p-5 rounded-2xl border border-slate-900 text-left">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-900">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Users className="h-4 w-4 text-indigo-400" />
              <span>Estado de la Sucursal - Irapuato</span>
            </h4>
            <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-bold uppercase">
              Monitoreo en Vivo
            </span>
          </div>

          <div className="space-y-3">
            {/* Quick check list for sucursal */}
            <div className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-slate-900">
              <div className="text-xs font-medium text-slate-350">
                <span className="text-slate-200 font-bold block">Controles Tolerancia & Ley Silla</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Asientos en cajas activos • Tolerancia 10m activa</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Cumplido</span>
            </div>
            
            <div className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-slate-900">
              <div className="text-xs font-medium text-slate-350">
                <span className="text-slate-200 font-bold block">Bitácoras de Cierre de Turno</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Último registro guardado ayer por Cajero</span>
              </div>
              <span className="text-[10px] text-indigo-400 font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">Auditado</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-slate-900">
              <div className="text-xs font-medium text-slate-350">
                <span className="text-slate-200 font-bold block">Capacitación de Nuevos Ingresos</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Aspirante Sofía completó examen inicial (100% score)</span>
              </div>
              <span className="text-[10px] text-amber-500 font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">Revisar</span>
            </div>
          </div>
        </div>
      );
    }

    // Employee Dynamic checklist widget
    const employeePendingTasks = tasks.filter(t => t.status !== 'Completado').slice(0, 3);

    return (
      <div className="glass-panel p-5 rounded-2xl border border-slate-900 text-left">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-900">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <CheckSquare className="h-4 w-4 text-indigo-400" />
            <span>Mis Tareas Prioritarias de Hoy</span>
          </h4>
          <span className="text-[9px] text-slate-500 font-bold">
            {tasks.filter(t => t.status === 'Completado').length} de {tasks.length} completadas
          </span>
        </div>

        {employeePendingTasks.length > 0 ? (
          <div className="space-y-3">
            {employeePendingTasks.map(t => (
              <div 
                key={t.id}
                onClick={() => setCurrentTab('tasks')}
                className="p-3 bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{t.titulo}</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-450 border border-slate-850 uppercase font-semibold">
                      {t.area}
                    </span>
                    <span className="text-[9px] text-slate-500 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{t.tiempoEstimado}</span>
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-indigo-400 font-bold flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Hacer</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            <CheckSquare className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            ¡Felicidades! Completaste todas tus tareas del turno.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 text-left">
      {/* Welcome Hero Panel */}
      <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-indigo-500 relative overflow-hidden bg-gradient-to-r from-indigo-950/20 to-slate-900/30">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 pointer-events-none flex items-center justify-center">
          <Sparkles className="h-40 w-40 text-indigo-500" />
        </div>
        
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-450 flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Sucursal Irapuato • {activeRole}</span>
          </span>
          <h2 className="text-xl font-bold text-white mt-1">
            ¡Hola de nuevo, {activeUser.name}!
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
            Bienvenido al portal central de DecorArte RH 360. Aquí puedes gestionar tu asistencia diaria, capacitarte en la Academia, realizar tus listas de tareas y dar seguimiento a tu crecimiento profesional.
          </p>
        </div>
      </div>

      {/* Stats Summary widgets (Dynamic based on Role) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {renderRoleMetrics()}
      </div>

      {/* Main Grid: Announcements & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Bulletins & Contextual Module Panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Dynamic Role-specific list */}
          {renderRoleDynamicContent()}

          {/* Announcements list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Bell className="h-4 w-4 text-indigo-500" />
              <span>Pizarra de Anuncios Corporativos</span>
            </h3>

            <div className="space-y-3.5">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 bg-slate-900/60 ${
                    a.type === 'urgente'
                      ? 'border-rose-500/20 border-l-4 border-l-rose-500'
                      : a.type === 'bienestar'
                      ? 'border-emerald-500/20 border-l-4 border-l-emerald-500'
                      : 'border-slate-850 border-l-4 border-l-amber-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      a.type === 'urgente'
                        ? 'bg-rose-500/10 text-rose-400'
                        : a.type === 'bienestar'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {a.tag}
                    </span>
                    <span className="text-[10px] text-slate-550 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{a.date}</span>
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 leading-snug">{a.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Access Tools */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <span>Accesos Rápidos del Rol</span>
          </h3>

          <div className="glass-panel p-5 rounded-2xl border border-slate-900 space-y-3.5">
            {/* Quick action: attendance clocking */}
            {['Administrador', 'Dirección', 'RH', 'Nómina', 'Supervisor', 'Empleado operativo', 'Empleado administrativo'].includes(activeRole) && (
              <button
                onClick={() => setCurrentTab('erp-rh')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-xl text-left text-xs font-bold transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-7 w-7 rounded bg-indigo-500/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-white block">Marcar Asistencia</span>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Reloj Checador (Selfie / GPS)</span>
                  </div>
                </div>
              </button>
            )}

            {/* Quick action: lms training */}
            {['Administrador', 'RH', 'Supervisor', 'Empleado operativo', 'Empleado administrativo'].includes(activeRole) && (
              <button
                onClick={() => setCurrentTab('lms')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-xl text-left text-xs font-bold transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-7 w-7 rounded bg-indigo-500/10 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-white block">Academia de Capacitación</span>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Cursos de inducción y SICAR</span>
                  </div>
                </div>
              </button>
            )}

            {/* Quick action: task checklists */}
            {['Administrador', 'Supervisor', 'Empleado operativo'].includes(activeRole) && (
              <button
                onClick={() => setCurrentTab('tasks')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-xl text-left text-xs font-bold transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-7 w-7 rounded bg-indigo-500/10 flex items-center justify-center">
                    <CheckSquare className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-white block">Registrar Bitácora / Cierre</span>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Control de fin de turno</span>
                  </div>
                </div>
              </button>
            )}

            {/* Quick action: ATS pipelines */}
            {['Administrador', 'RH'].includes(activeRole) && (
              <button
                onClick={() => setCurrentTab('reclutamiento')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-xl text-left text-xs font-bold transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-7 w-7 rounded bg-indigo-500/10 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-white block">Bolsa de Trabajo ATS</span>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Revisar candidatos y vacantes</span>
                  </div>
                </div>
              </button>
            )}

            <div className="p-3.5 rounded-xl border border-dashed border-slate-850 text-slate-500 text-[10px] leading-relaxed">
              <div className="flex items-center space-x-1 text-slate-400 font-bold mb-1 uppercase tracking-wide">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Ayuda / Soporte</span>
              </div>
              ¿Tienes problemas con tu pago o asistencia? Reporta inmediatamente con el departamento de RH o tu Supervisor.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </QueryClientProvider>
  );
}
