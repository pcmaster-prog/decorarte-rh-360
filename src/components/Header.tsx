import React from 'react';
import { useApp, type Role } from '../context/AppContext';
import { Flame, Trophy, Award, Shield, ChevronDown, Menu } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const { activeRole, setActiveRole, activeUser, setSidebarOpen } = useApp();

  const rolesList: { value: Role; label: string; desc: string }[] = [
    { value: 'Administrador', label: 'Administrador', desc: 'Acceso total y herramientas de desarrollo' },
    { value: 'Dirección', label: 'Dirección', desc: 'KPIs globales, informes ejecutivos' },
    { value: 'RH', label: 'Recursos Humanos', desc: 'Gestión de reclutamiento, expedientes y actas' },
    { value: 'Nómina', label: 'Nómina', desc: 'Cálculo de sueldos, IMSS, ISR y retardos' },
    { value: 'Supervisor', label: 'Supervisor de Área', desc: 'Control de asistencia, rutinas y aprobación' },
    { value: 'Capacitador', label: 'Capacitador', desc: 'Administración de cursos y evaluaciones' },
    { value: 'Empleado operativo', label: 'Empleado Operativo', desc: 'Fichar, realizar tareas del día y cursos' },
    { value: 'Empleado administrativo', label: 'Empleado Admin', desc: 'Fichar, ver reportes de área y cursos' },
    { value: 'Aspirante', label: 'Aspirante (SaaS)', desc: 'Postulación a vacantes y carga de documentos' },
    { value: 'Visualizador', label: 'Visualizador', desc: 'Solo consulta de informes e indicadores' }
  ];

  return (
    <header className="glass-panel sticky top-0 z-40 flex h-20 items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/80 shadow-md">
      {/* Brand & Active Area Indicator */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Hamburger Toggle Button for mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none transition-colors"
          aria-label="Abrir Menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="text-sm sm:text-base md:text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">
          DecorArte <span className="hidden xs:inline">RH 360</span>
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <span className="hidden md:inline text-sm font-medium text-slate-300 capitalize px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700/30">
          {currentTab.replace('-', ' ')}
        </span>
      </div>

      {/* Center Widget: Gamification Tracker */}
      {activeRole !== 'Aspirante' && (
        <div className="hidden md:flex items-center space-x-6 text-sm">
          {/* XP */}
          <div className="flex items-center space-x-2 text-indigo-400 font-medium px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <Trophy className="h-4 w-4" />
            <span>{activeUser.xp} XP</span>
          </div>

          {/* Streak */}
          <div className="flex items-center space-x-2 text-amber-500 font-medium px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 animate-pulse">
            <Flame className="h-4 w-4 fill-amber-500/20" />
            <span>Racha: {activeUser.racha} días</span>
          </div>

          {/* Badges Count */}
          <div className="flex items-center space-x-2 text-emerald-400 font-medium px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <Award className="h-4 w-4" />
            <span>{activeUser.insignias.length} Logros</span>
          </div>
        </div>
      )}

      {/* Right Widget: RBAC Selector & Profile Info */}
      <div className="flex items-center space-x-4">
        {/* Dynamic RBAC Switcher dropdown */}
        <div className="relative group">
          <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-[10px] sm:text-xs font-semibold text-slate-200 hover:border-indigo-500 hover:text-indigo-400 transition-all duration-200">
            <Shield className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span><span className="hidden sm:inline">SIMULANDO: </span>{activeRole}</span>
            <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-indigo-400 transition-transform duration-200 shrink-0" />
          </button>
          
          {/* Dropdown Box */}
          <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 hover:opacity-100 hover:visible z-50">
            <div className="px-3 py-2 border-b border-slate-850">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Simular Acceso (RBAC)
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto mt-1 space-y-0.5">
              {rolesList.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setActiveRole(item.value);
                    // Automatic tab navigation based on role to avoid getting stuck in forbidden tabs
                    if (item.value === 'Aspirante') {
                      setCurrentTab('reclutamiento');
                    } else if (currentTab === 'reclutamiento' && item.value !== 'Administrador' && item.value !== 'RH') {
                      setCurrentTab('dashboard');
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150 flex flex-col ${
                    activeRole === item.value
                      ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-650/20'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span className="font-semibold">{item.label}</span>
                  <span className={`text-[10px] mt-0.5 leading-relaxed ${activeRole === item.value ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Badge */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-inner">
            {activeUser.name.charAt(0)}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-200 leading-tight">
              {activeUser.name}
            </span>
            <span className="text-[9px] text-slate-500">
              {activeRole === 'Aspirante' ? 'Candidato Externo' : activeUser.puesto}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
