import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  UserCheck,
  FileSpreadsheet,
  BookOpen,
  ListTodo,
  Wrench,
  BarChart3,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { activeRole, sidebarOpen, setSidebarOpen } = useApp();

  // Define all available navigation tabs
  const allTabs = [
    {
      id: 'dashboard',
      label: 'Tablero Principal',
      icon: LayoutDashboard,
      roles: ['Administrador', 'Dirección', 'RH', 'Nómina', 'Supervisor', 'Capacitador', 'Empleado operativo', 'Empleado administrativo', 'Visualizador']
    },
    {
      id: 'reclutamiento',
      label: 'Reclutamiento / ATS',
      icon: UserCheck,
      roles: ['Administrador', 'RH', 'Aspirante']
    },
    {
      id: 'erp-rh',
      label: 'ERP Recursos Humanos',
      icon: FileSpreadsheet,
      roles: ['Administrador', 'Dirección', 'RH', 'Nómina', 'Supervisor', 'Empleado operativo', 'Empleado administrativo']
    },
    {
      id: 'lms',
      label: 'Academia DecorArte',
      icon: BookOpen,
      roles: ['Administrador', 'Dirección', 'RH', 'Supervisor', 'Capacitador', 'Empleado operativo', 'Empleado administrativo']
    },
    {
      id: 'tasks',
      label: 'Gestión de Tareas',
      icon: ListTodo,
      roles: ['Administrador', 'Dirección', 'RH', 'Supervisor', 'Empleado operativo', 'Empleado administrativo']
    },
    {
      id: 'builders',
      label: 'Estudio Visual',
      icon: Wrench,
      roles: ['Administrador', 'Dirección', 'Capacitador']
    },
    {
      id: 'reports',
      label: 'Reportes & Analíticas',
      icon: BarChart3,
      roles: ['Administrador', 'Dirección', 'RH', 'Nómina', 'Visualizador']
    }
  ];

  // Filter tabs by active role permissions
  const allowedTabs = allTabs.filter((tab) => tab.roles.includes(activeRole));

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between text-slate-300 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 absolute top-4 right-4 focus:outline-none transition-colors"
          aria-label="Cerrar Menú"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col flex-1 py-6">
        {/* Workspace Brand Indicator */}
        <div className="px-6 mb-8 flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            DA
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 leading-none">DecorArte</h2>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">SaaS Corporativo</span>
          </div>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="px-3 space-y-1">
          {allowedTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-650/15 text-indigo-400 border-l-4 border-indigo-500 bg-slate-900/60 font-semibold'
                    : 'hover:bg-slate-900/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding or Info */}
      <div className="p-4 border-t border-slate-900 text-left bg-slate-950/50">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Settings className="h-3.5 w-3.5" />
          <span>V2.1-Prod (2026)</span>
        </div>
        <div className="text-[9px] text-slate-600 mt-1 leading-relaxed">
          Diseñado bajo los lineamientos LFT de la República Mexicana.
        </div>
      </div>
    </aside>
    </>
  );
};
