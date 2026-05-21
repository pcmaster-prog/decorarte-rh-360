import React, { useState, useRef, useEffect } from 'react';
import { useApp, type Puesto, type AsistenciaRegistro, type ActaDisciplinaria } from '../context/AppContext';
import {
  Users,
  Clock,
  DollarSign,
  FileSignature,
  MapPin,
  Camera,
  Check,
  Download,
  Layers,
  ChevronRight,
  TrendingDown,
  Settings
} from 'lucide-react';

export const ERPModule: React.FC = () => {
  const {
    activeRole,
    puestos,
    asistencias,
    addAsistencia,
    actas,
    addActa,
    setActas,
    configuracionLaboral,
    updateConfiguracionLaboral
  } = useApp();

  // Internal Tabs within ERP
  const [subTab, setSubTab] = useState<'estructura' | 'asistencia' | 'nomina' | 'disciplina' | 'configuracion'>('estructura');
  
  // Selected Job for inspection
  const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null);

  // Clock-in form states
  const [clockInTime, setClockInTime] = useState('08:35');
  const [hasSelfie, setHasSelfie] = useState(false);
  const [gpsLogged, setGpsLogged] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);

  // Work week year slider
  const [targetYear, setTargetYear] = useState<number>(2026);

  // Payroll Calculation States
  const [selectedEmpPayroll, setSelectedEmpPayroll] = useState('Carlos Pérez');
  const [bonoAmount, setBonoAmount] = useState(1500);
  const [comisionAmount, setComisionAmount] = useState(800);
  const [retardosCount, setRetardosCount] = useState(2);
  const [isExporting, setIsExporting] = useState(false);

  // Disciplinary warning states
  const [newWarning, setNewWarning] = useState({
    empleadoNombre: '',
    puesto: 'Cajero',
    motivo: '',
    gravedad: 'Advertencia' as ActaDisciplinaria['gravedad']
  });

  // Digital Signature Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeSignActa, setActiveSignActa] = useState<ActaDisciplinaria | null>(null);

  // Initialize selected Puesto on load
  useEffect(() => {
    if (puestos.length > 0 && !selectedPuesto) {
      setSelectedPuesto(puestos[0]);
    }
  }, [puestos, selectedPuesto]);

  // Handle drawing on signature canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    if (!activeSignActa) return;
    // Simulate signature saving, update state
    setActas((prev) =>
      prev.map((act) =>
        act.id === activeSignActa.id ? { ...act, firmadoEmpleado: true } : act
      )
    );
    setActiveSignActa(null);
    alert('Acta firmada digitalmente con éxito.');
  };

  // Clock-in simulator action
  const handleClockInSubmit = () => {
    // Check tolerance rule dynamically using configuracionLaboral
    const [hrs, mins] = clockInTime.split(':').map(Number);
    const [configHrs, configMins] = configuracionLaboral.horaEntrada.split(':').map(Number);
    
    const checkInMinutes = hrs * 60 + mins;
    const regularMinutes = configHrs * 60 + configMins;
    const limitMinutes = regularMinutes + configuracionLaboral.toleranciaMinutos;
    const absoluteLimitMinutes = regularMinutes + 60; // 1 hour past entry is Falta

    let status: AsistenciaRegistro['status'] = 'Asistencia';
    if (checkInMinutes > limitMinutes) {
      status = 'Retardo';
    }
    if (checkInMinutes >= absoluteLimitMinutes) {
      status = 'Falta';
    }

    addAsistencia({
      empleadoId: 'current-user',
      empleadoNombre: 'Daniel Sánchez',
      puesto: activeRole,
      fecha: new Date().toISOString().split('T')[0],
      entrada: clockInTime,
      gps: gpsLogged ? '21.8853, -102.2916 (DecorArte Matriz)' : undefined,
      selfie: hasSelfie ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' : undefined,
      status
    });

    setIsClockedIn(true);
    alert(`Asistencia registrada. Estatus: ${status}`);
  };

  // Export payroll simulator
  const handleExportPayroll = (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Reporte de Nómina en formato ${format.toUpperCase()} descargado con éxito.`);
    }, 1500);
  };

  // Submit warning
  const handleWarningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWarning.empleadoNombre) return;
    addActa({
      empleadoNombre: newWarning.empleadoNombre,
      puesto: newWarning.puesto,
      fecha: new Date().toISOString().split('T')[0],
      motivo: newWarning.motivo,
      gravedad: newWarning.gravedad,
      firmadoEmpleado: false,
      firmadoSupervisor: true
    });
    setNewWarning({ empleadoNombre: '', puesto: 'Cajero', motivo: '', gravedad: 'Advertencia' });
    alert('Acta disciplinaria generada. Pendiente de firma de conformidad por parte del empleado.');
  };

  // Payroll calculations logic
  const calculatePayrollData = () => {
    const baseSueldo = selectedEmpPayroll === 'Carlos Pérez' ? 8000 : 8500;
    // Calculate deductions
    const isr = parseFloat((baseSueldo * 0.08).toFixed(2));
    const imss = parseFloat((baseSueldo * 0.025).toFixed(2));
    const infonavit = parseFloat((baseSueldo * 0.03).toFixed(2));
    
    // Check retardos penalty based on editable rules
    const dailyWage = baseSueldo / 30;
    const penalizaciones = Math.floor(retardosCount / configuracionLaboral.retardosParaSancion);
    const retardosPenalty = penalizaciones > 0 
      ? parseFloat((penalizaciones * configuracionLaboral.descuentoDiasPorSancion * dailyWage).toFixed(2)) 
      : 0;
    
    const totalDeducciones = isr + imss + infonavit + retardosPenalty;
    const totalBonificaciones = bonoAmount + comisionAmount;
    const sueldoNeto = parseFloat((baseSueldo + totalBonificaciones - totalDeducciones).toFixed(2));

    return {
      baseSueldo,
      isr,
      imss,
      infonavit,
      retardosPenalty,
      totalDeducciones,
      totalBonificaciones,
      sueldoNeto
    };
  };

  const payroll = calculatePayrollData();

  return (
    <div className="p-6 space-y-6 text-left">
      {/* Sub Menu Navbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <Layers className="h-6 w-6 text-indigo-500" />
          <h2 className="text-xl font-bold text-white">ERP Recursos Humanos</h2>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900/60 p-1 rounded-xl border border-slate-850">
          {[
            { id: 'estructura', label: 'Estructura & Puestos', icon: Users },
            { id: 'asistencia', label: 'Control de Asistencias', icon: Clock },
            { id: 'nomina', label: 'Cálculo de Nómina', icon: DollarSign },
            { id: 'disciplina', label: 'Disciplina & Actas', icon: FileSignature },
            { id: 'configuracion', label: 'Reglas Laborales', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
                  subTab === tab.id
                    ? 'bg-indigo-650 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. TAB: ESTRUCTURA LABORAL */}
      {subTab === 'estructura' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Puestos grouped by levels */}
          <div className="lg:col-span-1 space-y-4">
            {['Administrativo', 'Supervisión', 'Operativo'].map((level) => {
              const levelPuestos = puestos.filter((p) => p.nivel === level);
              return (
                <div key={level} className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                    Nivel {level}
                  </span>
                  <div className="space-y-1.5">
                    {levelPuestos.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPuesto(p)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 ${
                          selectedPuesto?.id === p.id
                            ? 'bg-indigo-650/10 border-indigo-500 text-indigo-400 font-semibold'
                            : 'bg-slate-900 border-slate-850 text-slate-300 hover:border-slate-800'
                        }`}
                      >
                        <span className="text-xs">{p.nombre}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 uppercase">
                            {p.departamento}
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details Panel of Selected Puesto */}
          <div className="lg:col-span-2">
            {selectedPuesto ? (
              <div className="glass-panel p-6 rounded-2xl border border-slate-850 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedPuesto.nombre}</h3>
                    <p className="text-xs text-indigo-400 font-semibold mt-1">
                      Nivel {selectedPuesto.nivel} — Depto. {selectedPuesto.departamento}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Sueldo Base Mensual</span>
                    <span className="text-base font-extrabold text-emerald-400">
                      ${selectedPuesto.sueldo.toLocaleString('es-MX')} MXN
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                  <div className="space-y-4">
                    {/* Horarios y prestaciones */}
                    <div>
                      <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">
                        Horario y Vacaciones
                      </h4>
                      <div className="space-y-1.5 p-3 bg-slate-950 rounded-xl">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Jornada</span>
                          <span className="text-slate-200">{selectedPuesto.horario}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Vacaciones Anuales</span>
                          <span className="text-slate-200">{selectedPuesto.vacaciones} días (LFT)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Supervisor Directo</span>
                          <span className="text-slate-200">{selectedPuesto.supervisor}</span>
                        </div>
                      </div>
                    </div>

                    {/* KPIs */}
                    <div>
                      <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">
                        Indicadores Clave (KPIs)
                      </h4>
                      <ul className="space-y-1.5 list-disc list-inside bg-slate-950 p-3 rounded-xl">
                        {selectedPuesto.kpis.map((kpi, idx) => (
                          <li key={idx} className="text-slate-350">{kpi}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Prestaciones */}
                    <div>
                      <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">
                        Prestaciones Otorgadas
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPuesto.prestaciones.map((pres, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-full bg-slate-950 text-[10px] text-slate-400 border border-slate-800"
                          >
                            {pres}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Checklist Onboarding */}
                    <div>
                      <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">
                        Inducción y Checklist Diario
                      </h4>
                      <ul className="space-y-1.5 bg-slate-950 p-3 rounded-xl">
                        {selectedPuesto.checklistOnboarding.map((item, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-slate-300">
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 border border-slate-900 border-dashed rounded-xl flex items-center justify-center text-slate-500">
                Seleccione un puesto de la lista
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. TAB: ASISTENCIAS & HORAS LFT */}
      {subTab === 'asistencia' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asistencia Clock-in Simulator */}
          <div className="lg:col-span-1 glass-panel p-6 rounded-2xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock className="h-4.5 w-4.5 text-indigo-400" />
              <span>Registrar Asistencia Diaria</span>
            </h3>

            {isClockedIn ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center space-y-3">
                <Check className="h-10 w-10 mx-auto bg-emerald-500/15 rounded-full p-2" />
                <h4 className="font-bold text-sm">Entrada Registrada</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Has marcado tu asistencia. El sistema detectó coordenadas y autenticación biométrica simulada.
                </p>
                <button
                  onClick={() => setIsClockedIn(false)}
                  className="mt-2 text-xs font-bold text-indigo-400 underline"
                >
                  Registrar otra entrada (Simular)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Time selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Hora de Checado (Simulada)</label>
                  <input
                    type="time"
                    value={clockInTime}
                    onChange={(e) => setClockInTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    * Entrada oficial: {configuracionLaboral.horaEntrada} AM. Tolerancia: +{configuracionLaboral.toleranciaMinutos} min.
                  </span>
                </div>

                {/* Biometric validation */}
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-slate-400">Validaciones Requeridas</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setHasSelfie(true)}
                      className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border text-xs font-bold transition-all duration-200 ${
                        hasSelfie
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Camera className="h-4 w-4" />
                      <span>{hasSelfie ? 'Selfie OK' : 'Tomar Selfie'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGpsLogged(true)}
                      className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border text-xs font-bold transition-all duration-200 ${
                        gpsLogged
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                      <span>{gpsLogged ? 'Ubicación OK' : 'Fijar GPS'}</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClockInSubmit}
                  className="w-full py-3 rounded-lg bg-indigo-650 text-xs font-bold text-white hover:bg-indigo-600 transition-all duration-200"
                >
                  Registrar Entrada / Salida
                </button>
              </div>
            )}
          </div>

          {/* LFT Progressive Hours reduction */}
          <div className="lg:col-span-2 space-y-6">
            {/* LFT Reducción gradual */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <TrendingDown className="h-4.5 w-4.5 text-indigo-400" />
                <span>Jornada Laboral Gradual (LFT México)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Selecciona el año para ver la simulación de reducción automática de horas semanales según la reforma laboral. Los cálculos de nómina ajustarán automáticamente las tarifas correspondientes.
              </p>

              {/* Slider / Timeline selection */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {[2026, 2027, 2028, 2029, 2030].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setTargetYear(yr)}
                    className={`p-3 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center ${
                      targetYear === yr
                        ? 'bg-indigo-650 text-white font-bold border-indigo-400'
                        : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs">{yr}</span>
                    <span className={`text-[10px] mt-1 ${targetYear === yr ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {configuracionLaboral.reduccionJornada[yr] || 48}h/sem
                    </span>
                  </button>
                ))}
              </div>

              {/* Dynamic status info */}
              <div className="p-3 bg-slate-950/80 rounded-xl text-xs flex justify-between items-center text-slate-350 border border-slate-900">
                <span>Límite Semanal de Horas Ordinarias:</span>
                <span className="font-bold text-indigo-400 text-sm">
                  {configuracionLaboral.reduccionJornada[targetYear] || 48} horas semanales sin recargo de extras
                </span>
              </div>
            </div>

            {/* Attendance logs list */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Registro Reciente de Entradas</h3>
              <div className="max-h-48 overflow-y-auto space-y-2.5">
                {asistencias.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-900/60 rounded-xl border border-slate-850/60 flex items-center justify-between text-xs text-slate-300"
                  >
                    <div>
                      <span className="font-semibold text-white block">{item.empleadoNombre}</span>
                      <span className="text-[10px] text-slate-500">{item.puesto} | {item.fecha}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Marcaje</span>
                        <span className="font-mono text-slate-200">{item.entrada}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                          item.status === 'Asistencia'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : item.status === 'Retardo'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: NÓMINA CALCULATOR */}
      {subTab === 'nomina' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form parameters */}
          <div className="lg:col-span-1 glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <DollarSign className="h-4.5 w-4.5 text-indigo-400" />
              <span>Calculadora de Nómina Quincenal</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Colaborador</label>
                <select
                  value={selectedEmpPayroll}
                  onChange={(e) => setSelectedEmpPayroll(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                >
                  <option value="Carlos Pérez" className="bg-slate-900">Carlos Pérez (Ayudante - $8,000)</option>
                  <option value="Sofía Gómez" className="bg-slate-900">Sofía Gómez (Cajero - $8,500)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Bono Incentivo</label>
                  <input
                    type="number"
                    value={bonoAmount}
                    onChange={(e) => setBonoAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg text-sm glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Comisiones</label>
                  <input
                    type="number"
                    value={comisionAmount}
                    onChange={(e) => setComisionAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg text-sm glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Faltas o Retardos (Periodo)</label>
                <input
                  type="number"
                  value={retardosCount}
                  onChange={(e) => setRetardosCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg text-sm glass-input"
                  min={0}
                />
                <span className="text-[9px] text-slate-500 block mt-1">
                  * 3 retardos = descuento de 1 día de salario ordinario.
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleExportPayroll('pdf')}
                  className="flex-1 flex items-center justify-center space-x-1.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 font-bold hover:text-white hover:border-slate-700 disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isExporting ? 'Exportando...' : 'Exportar PDF'}</span>
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleExportPayroll('excel')}
                  className="flex-1 flex items-center justify-center space-x-1.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 font-bold hover:text-white hover:border-slate-700 disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isExporting ? 'Exportando...' : 'Exportar Excel'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pay Slip Visual Display */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-indigo-950 space-y-6 bg-slate-950/70 text-slate-350">
            <div className="flex justify-between items-start border-b border-slate-900 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block">Recibo de Nómina Ordinaria</span>
                <h4 className="text-sm font-bold text-white mt-1">DecorArte S.A. de C.V.</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">RFC: DEC120401HSA | Periodo Quincenal: 01 - 15 Mayo</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Fecha cálculo</span>
                <span className="text-xs font-semibold text-slate-200">2026-05-20</span>
              </div>
            </div>

            {/* General employee data */}
            <div className="grid grid-cols-2 gap-4 text-[10px] bg-slate-900/60 p-3 rounded-lg border border-slate-900">
              <div>
                <span className="text-slate-550 block">Colaborador:</span>
                <span className="text-slate-200 font-semibold">{selectedEmpPayroll}</span>
              </div>
              <div>
                <span className="text-slate-550 block">Puesto:</span>
                <span className="text-slate-200 font-semibold">
                  {selectedEmpPayroll === 'Carlos Pérez' ? 'Ayudante integral' : 'Cajero'}
                </span>
              </div>
            </div>

            {/* Perks & Deductions tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Perception block */}
              <div className="space-y-2">
                <h5 className="font-bold text-emerald-400 border-b border-slate-900 pb-1 uppercase text-[9px] tracking-wide">
                  Percepciones (+)
                </h5>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>Sueldo Base Mensual</span>
                    <span>${payroll.baseSueldo.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-white">
                    <span>Incentivos / Bonos</span>
                    <span>+${bonoAmount.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-white">
                    <span>Comisiones Ventas</span>
                    <span>+${comisionAmount.toLocaleString('es-MX')}</span>
                  </div>
                </div>
              </div>

              {/* Deductions block */}
              <div className="space-y-2">
                <h5 className="font-bold text-rose-400 border-b border-slate-900 pb-1 uppercase text-[9px] tracking-wide">
                  Deducciones (-)
                </h5>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>ISR (Retenido)</span>
                    <span>-${payroll.isr.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IMSS (Seguridad Social)</span>
                    <span>-${payroll.imss.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Infonavit</span>
                    <span>-${payroll.infonavit.toLocaleString('es-MX')}</span>
                  </div>
                  {payroll.retardosPenalty > 0 && (
                    <div className="flex justify-between text-rose-400 font-semibold">
                      <span>Descuento Retardos ({retardosCount})</span>
                      <span>-${payroll.retardosPenalty.toLocaleString('es-MX')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total net payment banner */}
            <div className="pt-4 border-t border-slate-900 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Total Neto Depositado</span>
                <span className="text-xs text-slate-400">Transferencia Electrónica Directa</span>
              </div>
              <span className="text-xl font-extrabold text-emerald-400">
                ${payroll.sueldoNeto.toLocaleString('es-MX')} MXN
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: DISCIPLINA / FIRMAS ACTAS */}
      {subTab === 'disciplina' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Acta Generator form */}
          <div className="lg:col-span-1 glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileSignature className="h-4.5 w-4.5 text-indigo-400" />
              <span>Redactar Acta Administrativa</span>
            </h3>

            <form onSubmit={handleWarningSubmit} className="space-y-4 text-xs text-slate-400">
              <div>
                <label className="block font-semibold mb-1">Nombre del Colaborador</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carlos Pérez"
                  value={newWarning.empleadoNombre}
                  onChange={(e) => setNewWarning((p) => ({ ...p, empleadoNombre: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Puesto</label>
                <select
                  value={newWarning.puesto}
                  onChange={(e) => setNewWarning((p) => ({ ...p, puesto: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                >
                  {puestos.map((p) => (
                    <option key={p.id} value={p.nombre} className="bg-slate-900">{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Gravedad de la Falta</label>
                <select
                  value={newWarning.gravedad}
                  onChange={(e) => setNewWarning((p) => ({ ...p, gravedad: e.target.value as any }))}
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                >
                  <option value="Advertencia" className="bg-slate-900">Advertencia Verbal Escrita</option>
                  <option value="Acta Administrativa" className="bg-slate-900">Acta Administrativa Oficial</option>
                  <option value="Suspensión" className="bg-slate-900">Suspensión de Labores (1-3 días)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Descripción del Incidente</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe la omisión del reglamento o falta del colaborador..."
                  value={newWarning.motivo}
                  onChange={(e) => setNewWarning((p) => ({ ...p, motivo: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-650 text-xs font-bold text-white hover:bg-indigo-600 transition-all duration-200"
              >
                Generar Documento Disciplinario
              </button>
            </form>
          </div>

          {/* List of Warning files */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Actas y Expedientes Recientes</h3>
              
              <div className="space-y-3">
                {actas.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-slate-300"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{item.empleadoNombre}</span>
                        <span className="text-[10px] text-slate-500">({item.puesto})</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            item.gravedad === 'Advertencia'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {item.gravedad}
                        </span>
                      </div>
                      <p className="text-slate-400 leading-relaxed text-[11px]">{item.motivo}</p>
                      <span className="text-[9px] text-slate-550 block">Generada: {item.fecha}</span>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] text-slate-500">Firma Supervisor:</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${item.firmadoSupervisor ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-950 text-slate-655'}`}>
                          {item.firmadoSupervisor ? 'FIRMADO' : 'PENDIENTE'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] text-slate-500">Firma Colaborador:</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${item.firmadoEmpleado ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {item.firmadoEmpleado ? 'FIRMADO' : 'PENDIENTE'}
                        </span>
                      </div>

                      {!item.firmadoEmpleado && (
                        <button
                          type="button"
                          onClick={() => setActiveSignActa(item)}
                          className="mt-1 px-3 py-1 rounded bg-indigo-650 text-[10px] font-bold text-white hover:bg-indigo-600 transition-colors"
                        >
                          Firmar de Conformidad
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {actas.length === 0 && (
                  <div className="p-8 border border-dashed border-slate-850 rounded-xl text-center text-slate-600 text-xs">
                    No hay registros disciplinarios o actas administrativas registradas.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: CONFIGURACIÓN DE REGLAS LABORALES */}
      {subTab === 'configuracion' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-850 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Settings className="h-4.5 w-4.5 text-indigo-400" />
                <span>Configuración de Reglas Laborales y LFT</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ajusta las políticas operativas oficiales de DecorArte. Estos parámetros se aplican dinámicamente en los módulos de asistencia, nómina y reducción de jornada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-350">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Hora Oficial de Entrada</label>
                  <input
                    type="time"
                    value={configuracionLaboral.horaEntrada}
                    onChange={(e) => updateConfiguracionLaboral({ horaEntrada: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Hora Oficial de Salida</label>
                  <input
                    type="time"
                    value={configuracionLaboral.horaSalida}
                    onChange={(e) => updateConfiguracionLaboral({ horaSalida: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Tolerancia de Retardo (Minutos)</label>
                  <input
                    type="number"
                    value={configuracionLaboral.toleranciaMinutos}
                    onChange={(e) => updateConfiguracionLaboral({ toleranciaMinutos: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Límite de Retardos para Sanción</label>
                  <input
                    type="number"
                    value={configuracionLaboral.retardosParaSancion}
                    onChange={(e) => updateConfiguracionLaboral({ retardosParaSancion: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                    placeholder="Ej. 3 retardos"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Días de Descuento de Nómina por Sanción</label>
                  <input
                    type="number"
                    value={configuracionLaboral.descuentoDiasPorSancion}
                    onChange={(e) => updateConfiguracionLaboral({ descuentoDiasPorSancion: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850 mt-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Ley Silla Activa</span>
                    <span className="text-[9px] text-slate-500">Garantizar asiento de descanso</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={configuracionLaboral.leySillaActiva}
                    onChange={(e) => updateConfiguracionLaboral({ leySillaActiva: e.target.checked })}
                    className="h-4.5 w-4.5 rounded border-slate-800 text-indigo-650 focus:ring-indigo-500 bg-slate-950 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Reducción de Jornada Table */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[10px]">Tabla de Reducción Gradual de Jornada Semanal (LFT México)</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500 bg-slate-900/50">
                      <th className="px-4 py-3">Año de Transición</th>
                      <th className="px-4 py-3">Límite de Horas Semanales</th>
                      <th className="px-4 py-3">Estatus de Ley</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/50 text-slate-300">
                    {[2026, 2027, 2028, 2029, 2030].map((year) => (
                      <tr key={year}>
                        <td className="px-4 py-3 font-semibold text-slate-200">{year}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={configuracionLaboral.reduccionJornada[year]}
                            onChange={(e) => {
                              const updatedMap = {
                                ...configuracionLaboral.reduccionJornada,
                                [year]: parseInt(e.target.value) || 0
                              };
                              updateConfiguracionLaboral({ reduccionJornada: updatedMap });
                            }}
                            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 w-20 text-xs font-semibold text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {configuracionLaboral.reduccionJornada[year] === 40 ? 'Objetivo Cumplido (40h)' : 'Transición LFT'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-850 space-y-4">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Vista Previa de Impacto</span>
              <div className="space-y-3.5 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase block font-bold">Límite del Reloj Biométrico</span>
                  <p className="text-slate-200 font-semibold leading-relaxed">
                    Tolerancia de checado: <span className="text-indigo-400">{configuracionLaboral.horaEntrada}</span> a <span className="text-indigo-400">08:{(parseInt(configuracionLaboral.horaEntrada.split(':')[1]) + configuracionLaboral.toleranciaMinutos).toString().padStart(2, '0')}</span>. 
                    Checados posteriores a esta hora registrarán <span className="text-amber-500 font-bold">Retardo</span>.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase block font-bold">Regla Penalización de Nómina</span>
                  <p className="text-slate-200 font-semibold leading-relaxed">
                    Cada acumulación de <span className="text-pink-400 font-bold">{configuracionLaboral.retardosParaSancion} retardos</span> causará automáticamente la deducción de <span className="text-pink-400 font-bold">{configuracionLaboral.descuentoDiasPorSancion} día</span> de sueldo base en el cálculo de nómina.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase block font-bold">Protección Ley Silla</span>
                  <p className="text-slate-200 font-semibold leading-relaxed">
                    {configuracionLaboral.leySillaActiva ? (
                      <span className="text-emerald-400 font-bold">✓ Activa y Asegurada</span>
                    ) : (
                      <span className="text-slate-500">Desactivada (No recomendado)</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIGNATURE PAD MODAL POPUP */}
      {activeSignActa && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl p-6 text-left space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Firma Electrónica de Acta Administrativa</h3>
              <p className="text-[10px] text-slate-400 mt-1">
                Firma dibujando tu trazo oficial en el recuadro para validar tu conformidad con el acta.
              </p>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={380}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="cursor-crosshair w-full block"
              />
            </div>

            <div className="flex justify-between gap-3 text-xs font-bold pt-2">
              <button
                type="button"
                onClick={() => {
                  clearCanvas();
                  setActiveSignActa(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={saveSignature}
                  className="px-4 py-2 rounded-lg bg-indigo-650 text-white hover:bg-indigo-650"
                >
                  Confirmar Firma
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
