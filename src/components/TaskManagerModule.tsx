import React, { useState } from 'react';
import { useApp, type Task, type Rutina } from '../context/AppContext';
import {
  ListTodo,
  Layers,
  FileText,
  Calculator,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CheckSquare
} from 'lucide-react';

export const TaskManagerModule: React.FC = () => {
  const {
    tasks,
    rutinas,
    bitacoras,
    addBitacora,
    completeTask,
    activeRole
  } = useApp();

  // Internal Tabs
  const [taskSubTab, setTaskSubTab] = useState<'tareas' | 'rutinas' | 'bitacora'>('tareas');

  // Selected Area filter for Tasks
  const [selectedArea, setSelectedArea] = useState<string>('Todos');

  // Selected Routine for detail checklist view
  const [selectedRutina, setSelectedRutina] = useState<Rutina | null>(null);

  // Selected Task for auxiliary tool modal
  const [toolTask, setToolTask] = useState<Task | null>(null);

  // Auxiliary tool state: Current vs Target calculator
  const [calcCurrent, setCalcCurrent] = useState<number>(0);
  const [calcTarget, setCalcTarget] = useState<number>(0);
  const [calculatedFaltante, setCalculatedFaltante] = useState<number | null>(null);

  // Checklist status for active task tool
  const [toolChecklist, setToolChecklist] = useState<{ item: string; checked: boolean }[]>([]);

  // Evidence states for completing task
  const [commentInput, setCommentInput] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState(false);

  // Bitacora form state
  const [bitacoraForm, setBitacoraForm] = useState({
    descripcion: '',
    problemas: '',
    productosAgotados: ''
  });

  const areasList = ['Todos', 'Caja', 'Pesaje', 'Patio', 'Mostrador', 'Almacén', 'Pasillo chocolates', 'Producción', 'Bodega'];

  // Handle Current vs Target calculations
  const runCalculator = () => {
    const diff = calcTarget - calcCurrent;
    setCalculatedFaltante(diff > 0 ? diff : 0);
  };

  const openToolModal = (task: Task) => {
    setToolTask(task);
    setCalculatedFaltante(null);
    setCommentInput('');
    setEvidencePhoto(false);

    if (task.herramientaAuxiliar) {
      if (task.herramientaAuxiliar.current !== undefined) {
        setCalcCurrent(task.herramientaAuxiliar.current);
        setCalcTarget(task.herramientaAuxiliar.target || 0);
      }
      if (task.herramientaAuxiliar.checklist) {
        setToolChecklist([...task.herramientaAuxiliar.checklist]);
      }
    }
  };

  const handleToolChecklistToggle = (index: number) => {
    const updated = [...toolChecklist];
    updated[index].checked = !updated[index].checked;
    setToolChecklist(updated);
  };

  const submitCompletedTaskWithTool = () => {
    if (!toolTask) return;

    let toolsData = {};
    if (toolTask.herramientaAuxiliar?.tipo === 'contador') {
      toolsData = { current: calcCurrent, target: calcTarget };
    } else if (toolTask.herramientaAuxiliar?.tipo === 'limpieza' || toolTask.herramientaAuxiliar?.tipo === 'evidencia') {
      toolsData = { checklist: toolChecklist };
    }

    completeTask(toolTask.id, {
      foto: evidencePhoto ? 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=150' : undefined,
      comentario: commentInput,
      toolsData
    });

    setToolTask(null);
    alert('Tarea marcada como COMPLETADA. Se registraron los datos y evidencias correspondientes.');
  };

  const handleBitacoraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBitacora({
      fecha: new Date().toISOString().split('T')[0],
      empleadoNombre: 'Daniel Sánchez',
      puesto: activeRole,
      descripcion: bitacoraForm.descripcion,
      problemas: bitacoraForm.problemas,
      productosAgotados: bitacoraForm.productosAgotados,
      evidenciaUrl: evidencePhoto ? 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=150' : undefined
    });
    setBitacoraForm({ descripcion: '', problemas: '', productosAgotados: '' });
    setEvidencePhoto(false);
    alert('Bitácora del turno registrada exitosamente en el ERP.');
  };

  // Filter tasks based on Area and Role
  const filteredTasks = tasks.filter((t) => {
    const areaMatch = selectedArea === 'Todos' || t.area === selectedArea;
    
    // Hide administrative tasks for employees unless assigned
    if (activeRole === 'Empleado operativo' || activeRole === 'Empleado administrativo') {
      return areaMatch && (t.puesto === activeRole || t.asignadoA === 'Carlos Pérez' || t.asignadoA === 'Sofía Gómez');
    }
    return areaMatch;
  });

  return (
    <div className="p-6 space-y-6 text-left">
      {/* Sub navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <ListTodo className="h-6 w-6 text-indigo-500" />
          <h2 className="text-xl font-bold text-white">Tareas Inteligentes & Rutinas</h2>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900/60 p-1 rounded-xl border border-slate-850">
          {[
            { id: 'tareas', label: 'Tareas por Área', icon: Layers },
            { id: 'rutinas', label: 'Rutinas Operativas', icon: CheckSquare },
            { id: 'bitacora', label: 'Bitácora de Turno', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setTaskSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
                  taskSubTab === tab.id
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

      {/* 1. TAB: TAREAS POR ÁREA */}
      {taskSubTab === 'tareas' && (
        <div className="space-y-6">
          {/* Areas Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {areasList.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all duration-150 ${
                  selectedArea === area
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white hover:border-slate-800'
                }`}
              >
                {area}
              </button>
            ))}
          </div>

          {/* Grid Layout of Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`glass-panel p-5 rounded-2xl border flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-all duration-200 ${
                  t.status === 'Completado'
                    ? 'border-emerald-500/20 bg-slate-950/20'
                    : 'border-slate-850 bg-slate-900/40'
                }`}
              >
                <div>
                  {/* Card Header tag */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-[9px] font-semibold text-slate-450 uppercase">
                      {t.area}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        t.status === 'Completado'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : t.status === 'En Progreso'
                          ? 'bg-indigo-500/10 text-indigo-400'
                          : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">{t.titulo}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{t.descripcion}</p>
                </div>

                <div className="pt-4 border-t border-slate-900 space-y-3.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{t.tiempoEstimado} est.</span>
                    </div>
                    <span>Para: {t.puesto}</span>
                  </div>

                  {t.status !== 'Completado' ? (
                    <button
                      onClick={() => openToolModal(t)}
                      className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-lg bg-indigo-650/15 hover:bg-indigo-650 text-indigo-400 hover:text-white border border-indigo-500/20 text-xs font-bold transition-all duration-200"
                    >
                      <span>Abrir Herramientas Auxiliares</span>
                    </button>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400 space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="font-bold">Evidencia Cargada</span>
                      </div>
                      {t.evidenciaComentario && (
                        <p className="text-slate-450 italic">"{t.evidenciaComentario}"</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="col-span-full py-16 text-center border border-slate-900 border-dashed rounded-2xl text-slate-500 text-xs">
                No hay tareas activas en el área de "{selectedArea}" para tu puesto.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. TAB: RUTINAS */}
      {taskSubTab === 'rutinas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Routines */}
          <div className="lg:col-span-1 space-y-3">
            {rutinas.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRutina(r)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-150 ${
                  selectedRutina?.id === r.id
                    ? 'bg-indigo-650/10 border-indigo-500 text-indigo-400 font-semibold'
                    : 'bg-slate-900 border-slate-850 text-slate-300 hover:border-slate-800'
                }`}
              >
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-extrabold tracking-wider block">
                    {r.frecuencia} — {r.horario}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1">{r.nombre}</h4>
                </div>
                <div className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-500 font-bold uppercase shrink-0">
                  {r.tareasIds.length} tareas
                </div>
              </button>
            ))}
          </div>

          {/* Checklist details inside selected Routine */}
          <div className="lg:col-span-2">
            {selectedRutina ? (
              <div className="glass-panel p-6 rounded-2xl border border-slate-850 space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    Rutina {selectedRutina.frecuencia} de {selectedRutina.horario}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedRutina.nombre}</h3>
                  <p className="text-xs text-slate-450 mt-1.5 leading-relaxed">{selectedRutina.descripcion}</p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-slate-400">
                    Checklist de Tareas Asociadas
                  </h4>
                  
                  {/* Map over tasks belonging to routine */}
                  <div className="space-y-2">
                    {selectedRutina.tareasIds.map((tid) => {
                      const associatedTask = tasks.find((t) => t.id === tid || t.id === 't-1' || t.id === 't-2');
                      if (!associatedTask) return null;
                      return (
                        <div
                          key={tid}
                          className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs"
                        >
                          <div className="space-y-1">
                            <span className="font-semibold text-slate-200">{associatedTask.titulo}</span>
                            <p className="text-[10px] text-slate-500">{associatedTask.area} | {associatedTask.seccion}</p>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              associatedTask.status === 'Completado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-550'
                            }`}>
                              {associatedTask.status}
                            </span>
                            {associatedTask.status !== 'Completado' && (
                              <button
                                onClick={() => openToolModal(associatedTask)}
                                className="px-3 py-1.5 rounded bg-indigo-650 hover:bg-indigo-600 text-[10px] font-bold text-white"
                              >
                                Hacer
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 border border-slate-900 border-dashed rounded-xl flex items-center justify-center text-slate-550 text-xs">
                Seleccione una rutina de la lista para ver su checklist de ejecución.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB: BITÁCORA */}
      {taskSubTab === 'bitacora' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submit form */}
          <div className="lg:col-span-1 glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileText className="h-4.5 w-4.5 text-indigo-400" />
              <span>Nueva Entrada en Bitácora</span>
            </h3>

            <form onSubmit={handleBitacoraSubmit} className="space-y-4 text-xs text-slate-450">
              <div>
                <label className="block font-semibold mb-1">¿Qué hiciste hoy? (Descripción de turno)</label>
                <textarea
                  required
                  rows={3}
                  value={bitacoraForm.descripcion}
                  onChange={(e) => setBitacoraForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Ej. Realicé limpieza de patio trasero, rellené las góndolas de chocolates..."
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Problemas o Novedades Identificadas</label>
                <textarea
                  value={bitacoraForm.problemas}
                  onChange={(e) => setBitacoraForm((prev) => ({ ...prev, problemas: e.target.value }))}
                  placeholder="Ej. Fuga leve en el pasillo, un cliente tiró un empaque..."
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Productos Agotados (Para resurtir)</label>
                <input
                  type="text"
                  value={bitacoraForm.productosAgotados}
                  onChange={(e) => setBitacoraForm((prev) => ({ ...prev, productosAgotados: e.target.value }))}
                  placeholder="Ej. Chocolate Carlos V, Cloro galón..."
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                />
              </div>

              {/* Photo evidence */}
              <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="font-semibold text-slate-400">Adjuntar Foto Evidencia</span>
                <button
                  type="button"
                  onClick={() => setEvidencePhoto(true)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold ${
                    evidencePhoto
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-950 text-slate-500 hover:text-white'
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>{evidencePhoto ? 'Cargado' : 'Subir'}</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-indigo-650 text-xs font-bold text-white hover:bg-indigo-600 transition-all duration-200"
              >
                Enviar Bitácora
              </button>
            </form>
          </div>

          {/* List of recent logs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Registros de Turnos</h3>
              
              <div className="space-y-3.5 max-h-[500px] overflow-y-auto">
                {bitacoras.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 text-xs text-slate-350 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">{item.empleadoNombre}</span>
                        <span className="text-[10px] text-slate-550 block">{item.puesto} — {item.fecha}</span>
                      </div>
                      {item.evidenciaUrl && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">
                          CON FOTO
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-3 rounded-lg text-[11px] border border-slate-900">
                      <div>
                        <span className="text-slate-500 block uppercase font-bold text-[8px] tracking-wide mb-1">Descripción:</span>
                        <p className="text-slate-300 leading-relaxed">{item.descripcion}</p>
                      </div>
                      <div>
                        {item.problemas && (
                          <div className="mb-2">
                            <span className="text-rose-400 block uppercase font-bold text-[8px] tracking-wide mb-1 flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Novedades:</span>
                            </span>
                            <p className="text-slate-300 leading-relaxed">{item.problemas}</p>
                          </div>
                        )}
                        {item.productosAgotados && (
                          <div>
                            <span className="text-amber-500 block uppercase font-bold text-[8px] tracking-wide mb-1">Faltante Almacén:</span>
                            <p className="text-slate-300 font-semibold">{item.productosAgotados}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {bitacoras.length === 0 && (
                  <div className="p-8 border border-dashed border-slate-850 rounded-xl text-center text-slate-650">
                    No se han registrado bitácoras de turno el día de hoy.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED AUXILIARY TOOL MODAL WINDOW */}
      {toolTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl p-6 text-left space-y-5">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-bold">{toolTask.area}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{toolTask.titulo}</h3>
              </div>
              <button
                onClick={() => setToolTask(null)}
                className="px-2 py-1 bg-slate-900 border border-slate-800 text-[10px] text-slate-450 hover:text-white rounded"
              >
                Cerrar
              </button>
            </div>

            {/* Render tools based on config */}
            {toolTask.herramientaAuxiliar?.tipo === 'contador' && (
              <div className="space-y-4 p-4 bg-slate-900/60 rounded-xl border border-slate-850">
                <h4 className="text-xs font-bold text-indigo-400 flex items-center space-x-1.5">
                  <Calculator className="h-4 w-4" />
                  <span>Calculadora de Reabastecimiento</span>
                </h4>
                <p className="text-[10px] text-slate-450">
                  Ingresa las cantidades actuales en góndola y los objetivos definidos para que el sistema calcule los bultos a surtir desde Bodega.
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">Cantidad Actual en Estante</label>
                    <input
                      type="number"
                      value={calcCurrent}
                      onChange={(e) => setCalcCurrent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded bg-slate-950 text-white border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Cantidad Objetivo</label>
                    <input
                      type="number"
                      value={calcTarget}
                      onChange={(e) => setCalcTarget(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded bg-slate-950 text-white border border-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={runCalculator}
                  className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 text-xs font-bold text-white rounded-lg"
                >
                  Calcular Faltante Bodega
                </button>

                {calculatedFaltante !== null && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg text-center">
                    Faltan por surtir: {calculatedFaltante} unidades de la Bodega principal.
                  </div>
                )}
              </div>
            )}

            {toolTask.herramientaAuxiliar?.tipo === 'limpieza' && (
              <div className="space-y-4 p-4 bg-slate-900/60 rounded-xl border border-slate-850">
                <h4 className="text-xs font-bold text-indigo-400 flex items-center space-x-1.5">
                  <CheckSquare className="h-4 w-4" />
                  <span>Protocolo de Ejecución</span>
                </h4>
                
                <div className="space-y-2">
                  {toolChecklist.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToolChecklistToggle(idx)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg border text-left text-xs transition-colors ${
                        item.checked
                          ? 'bg-indigo-650/10 border-indigo-500/30 text-indigo-400'
                          : 'bg-slate-950 border-slate-900 text-slate-400'
                      }`}
                    >
                      <span className={`h-4.5 w-4.5 rounded flex items-center justify-center border ${
                        item.checked ? 'bg-indigo-500 border-indigo-400' : 'border-slate-850'
                      }`}>
                        {item.checked && <CheckSquare className="h-3 w-3 text-white" />}
                      </span>
                      <span className="font-semibold">{item.item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Comments & photo upload widget for completing */}
            <div className="space-y-3.5 pt-2 border-t border-slate-850 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Notas / Observaciones de Cumplimiento</label>
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Ej. Surtido completado, estante limpio..."
                  className="w-full px-4 py-2.5 rounded-lg glass-input text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEvidencePhoto(true)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg border text-xs font-bold transition-all ${
                    evidencePhoto
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750'
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span>{evidencePhoto ? 'Foto Cargada' : 'Subir Foto Evidencia'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={submitCompletedTaskWithTool}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg mt-4 shadow-lg shadow-emerald-600/10"
              >
                Concluir Tarea y Guardar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
