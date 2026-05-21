import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Clock,
  Download,
  Filter,
  CheckCircle
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  // Report configurations
  const [selectedReport, setSelectedReport] = useState<'asistencia' | 'nomina' | 'capacitacion' | 'productividad'>('asistencia');
  const [chartType, setChartType] = useState<'bar' | 'area' | 'pie'>('bar');
  const [selectedDept, setSelectedDept] = useState('Todos');

  // Simulated data for each report type
  const reportData = {
    asistencia: [
      { name: 'Lun', Asistencia: 98, Retardos: 2, Faltas: 0 },
      { name: 'Mar', Asistencia: 94, Retardos: 4, Faltas: 2 },
      { name: 'Mie', Asistencia: 96, Retardos: 3, Faltas: 1 },
      { name: 'Jue', Asistencia: 90, Retardos: 7, Faltas: 3 },
      { name: 'Vie', Asistencia: 97, Retardos: 1, Faltas: 2 },
      { name: 'Sab', Asistencia: 100, Retardos: 0, Faltas: 0 }
    ],
    nomina: [
      { name: 'Cajas', Costo: 42000, Bonos: 6000, Deducciones: 3400 },
      { name: 'Ventas', Costo: 38000, Bonos: 4800, Deducciones: 2900 },
      { name: 'Almacén', Costo: 32000, Bonos: 3000, Deducciones: 2150 },
      { name: 'Producción', Costo: 54000, Bonos: 9500, Deducciones: 4600 },
      { name: 'Admin', Costo: 28000, Bonos: 1500, Deducciones: 1900 }
    ],
    capacitacion: [
      { name: 'Inducción', Completados: 15, Reprobados: 1, EnCurso: 4 },
      { name: 'SICAR', Completados: 10, Reprobados: 2, EnCurso: 8 },
      { name: 'Caja Reg.', Completados: 12, Reprobados: 0, EnCurso: 3 },
      { name: 'Ventas Premium', Completados: 6, Reprobados: 3, EnCurso: 11 },
      { name: 'Supervisor', Completados: 3, Reprobados: 0, EnCurso: 1 }
    ],
    productividad: [
      { name: 'Semana 1', TareasCompletadas: 145, MermasReportadas: 12 },
      { name: 'Semana 2', TareasCompletadas: 178, MermasReportadas: 8 },
      { name: 'Semana 3', TareasCompletadas: 160, MermasReportadas: 15 },
      { name: 'Semana 4', TareasCompletadas: 195, MermasReportadas: 5 }
    ]
  };

  const pieDataMap = {
    asistencia: [
      { name: 'Asistencia', value: 95.8, color: '#10b981' },
      { name: 'Retardos', value: 2.8, color: '#f59e0b' },
      { name: 'Faltas', value: 1.4, color: '#ef4444' }
    ],
    nomina: [
      { name: 'Sueldo Base', value: 72, color: '#6366f1' },
      { name: 'Bonificaciones', value: 18, color: '#10b981' },
      { name: 'Deducciones ISR/IMSS', value: 10, color: '#ef4444' }
    ],
    capacitacion: [
      { name: 'Completados', value: 65, color: '#10b981' },
      { name: 'En Proceso', value: 28, color: '#3b82f6' },
      { name: 'No Acreditados', value: 7, color: '#f59e0b' }
    ],
    productividad: [
      { name: 'Caja', value: 35, color: '#6366f1' },
      { name: 'Ventas', value: 30, color: '#10b981' },
      { name: 'Producción', value: 25, color: '#3b82f6' },
      { name: 'Almacén', value: 10, color: '#f59e0b' }
    ]
  };

  const currentData = reportData[selectedReport];
  const currentPieData = pieDataMap[selectedReport] || [];

  return (
    <div className="p-6 space-y-6 text-left">
      {/* Executive stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Plantilla Activa', val: '24 Colaboradores', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Asistencia General', val: '95.8% Promedio', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Acreditación Academia', val: '86.4% Aprobados', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Productividad Turnos', val: '92.1% Tareas Ok', icon: TrendingUp, color: 'text-pink-400', bg: 'bg-pink-500/10' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-panel p-5 rounded-2xl flex items-center justify-between border border-slate-900 shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">{item.label}</span>
                <h3 className="text-base font-extrabold text-white">{item.val}</h3>
              </div>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${item.bg}`}>
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Report Builder workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Control Panel */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <BarChart3 className="h-4.5 w-4.5 text-indigo-400" />
            <span>Creador Visual de Reportes</span>
          </h3>
          <p className="text-xs text-slate-450 leading-relaxed">
            Personaliza el reporte. Elige el indicador de negocio, la visualización de gráfico y el departamento.
          </p>

          <div className="space-y-4 text-xs text-slate-400">
            {/* Metric select */}
            <div>
              <label className="block font-semibold mb-1">Indicador Principal</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-lg glass-input text-xs"
              >
                <option value="asistencia" className="bg-slate-950">Asistencias y Retardos</option>
                <option value="nomina" className="bg-slate-950">Estructura y Costo de Nómina</option>
                <option value="capacitacion" className="bg-slate-950">Capacitación y Academia</option>
                <option value="productividad" className="bg-slate-950">Productividad y Tareas</option>
              </select>
            </div>

            {/* Chart Type select */}
            <div>
              <label className="block font-semibold mb-1">Tipo de Gráfica</label>
              <div className="flex gap-2">
                {[
                  { id: 'bar', label: 'Barras' },
                  { id: 'area', label: 'Áreas' },
                  { id: 'pie', label: 'Pie (Distribución)' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setChartType(type.id as any)}
                    className={`flex-1 py-2 text-center rounded-lg font-bold transition-all duration-150 border ${
                      chartType === type.id
                        ? 'bg-indigo-650 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Department filter */}
            <div>
              <label className="block font-semibold mb-1">Filtro de Departamento</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg glass-input text-xs"
              >
                <option value="Todos" className="bg-slate-950">Todos los Departamentos</option>
                <option value="Cajas" className="bg-slate-950">Cajas</option>
                <option value="Ventas" className="bg-slate-950">Ventas</option>
                <option value="Almacen" className="bg-slate-950">Almacén</option>
                <option value="Produccion" className="bg-slate-950">Producción</option>
              </select>
            </div>

            {/* Simulated Export */}
            <button
              onClick={() => alert('Generando informe ejecutivo y descargando...')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-indigo-400 hover:text-white rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exportar Informe Ejecutivo</span>
            </button>
          </div>
        </div>

        {/* Right Chart Visualization Panel */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-850 space-y-6 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-3 border-b border-slate-900">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">Panel Analítico</span>
              <h4 className="text-sm font-bold text-white mt-0.5 capitalize">
                Reporte de {selectedReport} ({chartType})
              </h4>
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-slate-500 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-850">
              <Filter className="h-3 w-3" />
              <span>Depto: {selectedDept}</span>
            </div>
          </div>

          {/* Recharts chart wrapper */}
          <div className="h-72 w-full text-xs font-medium relative flex items-center justify-center py-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={currentData as any[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#374151', color: '#f3f4f6' }} />
                  <Legend />
                  {selectedReport === 'asistencia' && (
                    <>
                      <Bar dataKey="Asistencia" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Retardos" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Faltas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </>
                  )}
                  {selectedReport === 'nomina' && (
                    <>
                      <Bar dataKey="Costo" name="Costo Base" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Bonos" name="Bonos" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Deducciones" name="Deducciones LFT" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </>
                  )}
                  {selectedReport === 'capacitacion' && (
                    <>
                      <Bar dataKey="Completados" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="EnCurso" name="En Curso" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </>
                  )}
                  {selectedReport === 'productividad' && (
                    <>
                      <Bar dataKey="TareasCompletadas" name="Tareas Hechas" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="MermasReportadas" name="Reportes Mermas" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </>
                  )}
                </BarChart>
              ) : chartType === 'area' ? (
                <AreaChart data={currentData as any[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#374151', color: '#f3f4f6' }} />
                  <Legend />
                  {selectedReport === 'asistencia' && (
                    <>
                      <Area type="monotone" dataKey="Asistencia" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="Retardos" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                    </>
                  )}
                  {selectedReport === 'nomina' && (
                    <>
                      <Area type="monotone" dataKey="Costo" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="Bonos" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                    </>
                  )}
                  {selectedReport === 'capacitacion' && (
                    <>
                      <Area type="monotone" dataKey="Completados" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="EnCurso" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                    </>
                  )}
                  {selectedReport === 'productividad' && (
                    <>
                      <Area type="monotone" dataKey="TareasCompletadas" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                    </>
                  )}
                </AreaChart>
              ) : (
                <PieChart>
                  <Pie
                    data={currentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {currentPieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#374151', color: '#f3f4f6' }} />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Quick analysis summary */}
          <div className="p-3.5 bg-slate-900/60 border border-slate-850 rounded-xl text-[11px] text-slate-400 leading-relaxed flex items-start space-x-2.5">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Análisis automático:</strong> El indicador de {selectedReport} muestra un desempeño favorable durante el periodo de monitoreo actual. Se mantiene en un nivel por encima del 85% de cumplimiento estándar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
