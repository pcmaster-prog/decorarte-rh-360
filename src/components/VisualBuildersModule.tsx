import React, { useState } from 'react';
import { useApp, type Puesto, type Course, type Task, type Rutina } from '../context/AppContext';
import {
  Wrench,
  BookOpen,
  Briefcase,
  Layers,
  CheckSquare,
  HelpCircle
} from 'lucide-react';

export const VisualBuildersModule: React.FC = () => {
  const {
    addPuesto,
    addCourse,
    addTask,
    addRutina,
    puestos,
    tasks,
    cursos
  } = useApp();

  // Active builder selection
  const [activeBuilder, setActiveBuilder] = useState<'puestos' | 'cursos' | 'tareas' | 'rutinas'>('puestos');

  // 1. Puestos Builder Form State
  const [puestoForm, setPuestoForm] = useState({
    nombre: '',
    departamento: 'Ventas',
    nivel: 'Operativo' as Puesto['nivel'],
    sueldo: 8000,
    prestaciones: 'IMSS, Aguinaldo LFT, Infonavit',
    horario: '08:30 - 17:00',
    vacaciones: 12,
    supervisor: 'Encargado turno',
    kpis: '',
    checklistOnboarding: ''
  });

  // 2. Cursos Builder Form State
  const [courseForm, setCourseForm] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Protocolos' as Course['categoria'],
    xpRecompensa: 100,
    insignia: '',
    videosInput: '',
    pdfsInput: ''
  });

  // Course Quiz Questions Builder list
  const [quizQuestions, setQuizQuestions] = useState<{ pregunta: string; opciones: string[]; respuestaCorrecta: number }[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    pregunta: '',
    op1: '',
    op2: '',
    op3: '',
    respuestaCorrecta: 0
  });

  // 3. Tareas Builder Form State
  const [taskForm, setTaskForm] = useState({
    titulo: '',
    descripcion: '',
    area: 'Caja',
    seccion: 'Góndolas',
    puesto: 'Cajero',
    tiempoEstimado: '30 min',
    toolTipo: 'evidencia' as 'contador' | 'limpieza' | 'evidencia',
    counterTarget: 50
  });

  // 4. Rutinas Builder Form State
  const [rutinaForm, setRutinaForm] = useState({
    nombre: '',
    descripcion: '',
    frecuencia: 'Diaria' as Rutina['frecuencia'],
    horario: 'Apertura' as Rutina['horario'],
    asignableA: 'Cajero'
  });
  const [rutinaSelectedTasks, setRutinaSelectedTasks] = useState<string[]>([]);

  // Form Submission handlers
  const handlePuestoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!puestoForm.nombre) return;
    addPuesto({
      nombre: puestoForm.nombre,
      departamento: puestoForm.departamento,
      nivel: puestoForm.nivel,
      sueldo: Number(puestoForm.sueldo),
      prestaciones: puestoForm.prestaciones.split(',').map((x) => x.trim()),
      horario: puestoForm.horario,
      vacaciones: Number(puestoForm.vacaciones),
      permisos: ['Permiso regular'],
      supervisor: puestoForm.supervisor,
      kpis: puestoForm.kpis.split('\n').filter((x) => x.trim()),
      cursos: [],
      checklistOnboarding: puestoForm.checklistOnboarding.split('\n').filter((x) => x.trim()),
      tareasFrecuentes: []
    });
    alert(`Puesto "${puestoForm.nombre}" guardado y disponible en ERP/Reclutamiento.`);
    setPuestoForm({ nombre: '', departamento: 'Ventas', nivel: 'Operativo', sueldo: 8000, prestaciones: 'IMSS, Aguinaldo LFT, Infonavit', horario: '08:30 - 17:00', vacaciones: 12, supervisor: 'Encargado turno', kpis: '', checklistOnboarding: '' });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.pregunta || !newQuestion.op1 || !newQuestion.op2) {
      alert('Completa la pregunta y al menos dos opciones de respuesta.');
      return;
    }
    setQuizQuestions([
      ...quizQuestions,
      {
        pregunta: newQuestion.pregunta,
        opciones: [newQuestion.op1, newQuestion.op2, newQuestion.op3].filter(Boolean),
        respuestaCorrecta: Number(newQuestion.respuestaCorrecta)
      }
    ]);
    setNewQuestion({ pregunta: '', op1: '', op2: '', op3: '', respuestaCorrecta: 0 });
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.titulo || quizQuestions.length === 0) {
      alert('Completa el título del curso y agrega al menos una pregunta al examen.');
      return;
    }
    
    const videosArr = courseForm.videosInput
      ? [{ id: `v-${Date.now()}`, titulo: courseForm.videosInput, url: '#', duracion: '10:00' }]
      : [];

    const pdfsArr = courseForm.pdfsInput
      ? [{ titulo: courseForm.pdfsInput, url: '#' }]
      : [];

    addCourse({
      titulo: courseForm.titulo,
      descripcion: courseForm.descripcion,
      categoria: courseForm.categoria,
      xpRecompensa: Number(courseForm.xpRecompensa),
      insignia: courseForm.insignia || 'Logro Especial',
      videos: videosArr,
      pdfs: pdfsArr,
      examen: quizQuestions
    });

    alert(`Curso "${courseForm.titulo}" creado de manera exitosa. Aparecerá en el mapa de Academia.`);
    setCourseForm({ titulo: '', descripcion: '', categoria: 'Protocolos', xpRecompensa: 100, insignia: '', videosInput: '', pdfsInput: '' });
    setQuizQuestions([]);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.titulo) return;

    let toolConfig: Task['herramientaAuxiliar'] | undefined;
    if (taskForm.toolTipo === 'contador') {
      toolConfig = { tipo: 'contador', current: 0, target: Number(taskForm.counterTarget) };
    } else if (taskForm.toolTipo === 'limpieza') {
      toolConfig = {
        tipo: 'limpieza',
        checklist: [
          { item: 'Asegurar limpieza inicial', checked: false },
          { item: 'Registrar incidencias', checked: false }
        ]
      };
    } else {
      toolConfig = { tipo: 'evidencia' };
    }

    addTask({
      titulo: taskForm.titulo,
      descripcion: taskForm.descripcion,
      area: taskForm.area,
      seccion: taskForm.seccion,
      puesto: taskForm.puesto,
      status: 'Pendiente',
      herramientaAuxiliar: toolConfig,
      tiempoEstimado: taskForm.tiempoEstimado
    });

    alert(`Tarea "${taskForm.titulo}" agregada a los tableros de área.`);
    setTaskForm({ titulo: '', descripcion: '', area: 'Caja', seccion: 'Góndolas', puesto: 'Cajero', tiempoEstimado: '30 min', toolTipo: 'evidencia', counterTarget: 50 });
  };

  const toggleRutinaTaskSelection = (tid: string) => {
    setRutinaSelectedTasks((prev) =>
      prev.includes(tid) ? prev.filter((x) => x !== tid) : [...prev, tid]
    );
  };

  const handleRutinaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rutinaForm.nombre || rutinaSelectedTasks.length === 0) {
      alert('Ingresa el nombre y selecciona al menos una tarea asociada para la rutina.');
      return;
    }

    addRutina({
      nombre: rutinaForm.nombre,
      descripcion: rutinaForm.descripcion,
      frecuencia: rutinaForm.frecuencia,
      horario: rutinaForm.horario,
      tareasIds: rutinaSelectedTasks,
      asignableA: rutinaForm.asignableA
    });

    alert(`Rutina "${rutinaForm.nombre}" guardada con éxito.`);
    setRutinaForm({ nombre: '', descripcion: '', frecuencia: 'Diaria', horario: 'Apertura', asignableA: 'Cajero' });
    setRutinaSelectedTasks([]);
  };

  return (
    <div className="p-6 space-y-6 text-left">
      {/* Studio Header Submenu */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <Wrench className="h-6 w-6 text-indigo-500" />
          <h2 className="text-xl font-bold text-white">Estudio de Constructores Visuales</h2>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900/60 p-1 rounded-xl border border-slate-850">
          {[
            { id: 'puestos', label: 'Estructurar Puestos', icon: Briefcase },
            { id: 'cursos', label: 'Diseñar Cursos', icon: BookOpen },
            { id: 'tareas', label: 'Crear Tareas', icon: Layers },
            { id: 'rutinas', label: 'Crear Rutinas', icon: CheckSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBuilder(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
                  activeBuilder === tab.id
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Form Builder */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-850">
          
          {/* 1. BUILDER: PUESTOS */}
          {activeBuilder === 'puestos' && (
            <form onSubmit={handlePuestoSubmit} className="space-y-4 text-xs text-slate-450">
              <h3 className="text-sm font-bold text-white mb-2">Constructor de Puestos de Trabajo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Nombre del Puesto</label>
                  <input
                    type="text"
                    required
                    value={puestoForm.nombre}
                    onChange={(e) => setPuestoForm((prev) => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej. Almacenista Principal"
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Departamento</label>
                  <select
                    value={puestoForm.departamento}
                    onChange={(e) => setPuestoForm((prev) => ({ ...prev, departamento: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  >
                    <option value="Cajas" className="bg-slate-950">Cajas</option>
                    <option value="Ventas" className="bg-slate-950">Ventas</option>
                    <option value="Almacén" className="bg-slate-950">Almacén</option>
                    <option value="Producción" className="bg-slate-950">Producción</option>
                    <option value="Administración" className="bg-slate-950">Administración</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Nivel Jerárquico</label>
                  <select
                    value={puestoForm.nivel}
                    onChange={(e) => setPuestoForm((prev) => ({ ...prev, nivel: e.target.value as any }))}
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  >
                    <option value="Operativo" className="bg-slate-950">Operativo</option>
                    <option value="Supervisión" className="bg-slate-950">Supervisión</option>
                    <option value="Administrativo" className="bg-slate-950">Administrativo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sueldo Base Mensual ($MXN)</label>
                  <input
                    type="number"
                    value={puestoForm.sueldo}
                    onChange={(e) => setPuestoForm((prev) => ({ ...prev, sueldo: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Vacaciones Anuales Iniciales</label>
                  <input
                    type="number"
                    value={puestoForm.vacaciones}
                    onChange={(e) => setPuestoForm((prev) => ({ ...prev, vacaciones: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Horario Oficial de Turno</label>
                  <input
                    type="text"
                    value={puestoForm.horario}
                    onChange={(e) => setPuestoForm((prev) => ({ ...prev, horario: e.target.value }))}
                    placeholder="Ej. 08:30 - 17:00"
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Reporta a (Supervisor)</label>
                  <input
                    type="text"
                    value={puestoForm.supervisor}
                    onChange={(e) => setPuestoForm((prev) => ({ ...prev, supervisor: e.target.value }))}
                    placeholder="Ej. Supervisor de Almacén"
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Prestaciones LFT / Superiores (Separadas por comas)</label>
                <input
                  type="text"
                  value={puestoForm.prestaciones}
                  onChange={(e) => setPuestoForm((prev) => ({ ...prev, prestaciones: e.target.value }))}
                  placeholder="Ej. IMSS, Infonavit, Caja de ahorro, Seguro Gastos Médicos"
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Pautas / KPIs de Evaluación (Un KPI por línea)</label>
                  <textarea
                    rows={3}
                    value={puestoForm.kpis}
                    onChange={(e) => setPuestoForm((prev) => ({ ...prev, kpis: e.target.value }))}
                    placeholder="Ej. Precisión de inventarios > 99%&#10;Apego a protocolos de orden..."
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Checklist de Inducción Inicial (Un ítem por línea)</label>
                  <textarea
                    rows={3}
                    value={puestoForm.checklistOnboarding}
                    onChange={(e) => setPuestoForm((prev) => ({ ...prev, checklistOnboarding: e.target.value }))}
                    placeholder="Ej. Lectura reglamento de almacén&#10;Aprender códigos de chocolates..."
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-indigo-650 text-xs font-bold text-white hover:bg-indigo-600 shadow-md shadow-indigo-600/10 transition-all duration-200"
              >
                Habilitar Puesto y KPIs
              </button>
            </form>
          )}

          {/* 2. BUILDER: CURSOS */}
          {activeBuilder === 'cursos' && (
            <form onSubmit={handleCourseSubmit} className="space-y-4 text-xs text-slate-450">
              <h3 className="text-sm font-bold text-white mb-2">Diseñador Gamificado de Cursos (LMS)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Título del Curso</label>
                  <input
                    type="text"
                    required
                    value={courseForm.titulo}
                    onChange={(e) => setCourseForm((prev) => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Ej. Protocolo de Atención Premium"
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Categoría</label>
                  <select
                    value={courseForm.categoria}
                    onChange={(e) => setCourseForm((prev) => ({ ...prev, categoria: e.target.value as any }))}
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  >
                    <option value="Caja" className="bg-slate-950">Caja</option>
                    <option value="SICAR" className="bg-slate-950">SICAR</option>
                    <option value="Ventas" className="bg-slate-950">Ventas</option>
                    <option value="Supervisor" className="bg-slate-950">Supervisor</option>
                    <option value="Protocolos" className="bg-slate-950">Protocolos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Descripción del Curso</label>
                <textarea
                  rows={2}
                  value={courseForm.descripcion}
                  onChange={(e) => setCourseForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Ingresa el objetivo de aprendizaje..."
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Video Inicial (Nombre del video)</label>
                  <input
                    type="text"
                    value={courseForm.videosInput}
                    onChange={(e) => setCourseForm((prev) => ({ ...prev, videosInput: e.target.value }))}
                    placeholder="Ej. Introducción al Protocolo"
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">PDF / Manual de apoyo</label>
                  <input
                    type="text"
                    value={courseForm.pdfsInput}
                    onChange={(e) => setCourseForm((prev) => ({ ...prev, pdfsInput: e.target.value }))}
                    placeholder="Ej. Manual_Atencion_DecorArte.pdf"
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Recompensa (XP)</label>
                  <input
                    type="number"
                    value={courseForm.xpRecompensa}
                    onChange={(e) => setCourseForm((prev) => ({ ...prev, xpRecompensa: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Insignia / Badge a Desbloquear</label>
                  <input
                    type="text"
                    value={courseForm.insignia}
                    onChange={(e) => setCourseForm((prev) => ({ ...prev, insignia: e.target.value }))}
                    placeholder="Ej. Profesional del Trato"
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
              </div>

              {/* Quiz Creator */}
              <div className="border border-slate-800 p-4 rounded-xl space-y-3 bg-slate-950/40">
                <h4 className="font-bold text-white uppercase text-[10px] tracking-wide flex items-center space-x-1.5">
                  <HelpCircle className="h-4.5 w-4.5 text-indigo-400" />
                  <span>Configurar Examen ({quizQuestions.length} preguntas agregadas)</span>
                </h4>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Pregunta Evaluativa</label>
                    <input
                      type="text"
                      value={newQuestion.pregunta}
                      onChange={(e) => setNewQuestion((prev) => ({ ...prev, pregunta: e.target.value }))}
                      placeholder="Ej. ¿Cuál es el primer paso al saludar al cliente?"
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-850 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-500">Opción A (Correcta)</label>
                      <input
                        type="text"
                        value={newQuestion.op1}
                        onChange={(e) => setNewQuestion((prev) => ({ ...prev, op1: e.target.value }))}
                        placeholder="Sonreír y saludar"
                        className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-850 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-500">Opción B</label>
                      <input
                        type="text"
                        value={newQuestion.op2}
                        onChange={(e) => setNewQuestion((prev) => ({ ...prev, op2: e.target.value }))}
                        placeholder="Ignorar"
                        className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-850 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-500">Opción C</label>
                      <input
                        type="text"
                        value={newQuestion.op3}
                        onChange={(e) => setNewQuestion((prev) => ({ ...prev, op3: e.target.value }))}
                        placeholder="Cobrar rápido"
                        className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-850 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-white rounded-lg"
                  >
                    Agregar Pregunta a Examen
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-emerald-650 hover:bg-emerald-600 text-xs font-bold text-white shadow-md transition-all duration-200"
              >
                Habilitar Curso en Academia
              </button>
            </form>
          )}

          {/* 3. BUILDER: TAREAS */}
          {activeBuilder === 'tareas' && (
            <form onSubmit={handleTaskSubmit} className="space-y-4 text-xs text-slate-450">
              <h3 className="text-sm font-bold text-white mb-2">Constructor de Tareas</h3>

              <div>
                <label className="block font-semibold mb-1">Título de la Tarea</label>
                <input
                  type="text"
                  required
                  value={taskForm.titulo}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Ej. Revisión de Mermas de Chocolates"
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Instrucciones / Descripción</label>
                <textarea
                  rows={2}
                  value={taskForm.descripcion}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Describe detalladamente los pasos a realizar..."
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Área</label>
                  <select
                    value={taskForm.area}
                    onChange={(e) => setTaskForm((prev) => ({ ...prev, area: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  >
                    <option value="Caja" className="bg-slate-950">Caja</option>
                    <option value="Pesaje" className="bg-slate-950">Pesaje</option>
                    <option value="Patio" className="bg-slate-950">Patio</option>
                    <option value="Mostrador" className="bg-slate-950">Mostrador</option>
                    <option value="Almacén" className="bg-slate-950">Almacén</option>
                    <option value="Pasillo chocolates" className="bg-slate-950">Pasillo chocolates</option>
                    <option value="Bodega" className="bg-slate-950">Bodega</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sección específica</label>
                  <input
                    type="text"
                    value={taskForm.seccion}
                    onChange={(e) => setTaskForm((prev) => ({ ...prev, seccion: e.target.value }))}
                    placeholder="Ej. Góndola 4 o Patio 1"
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tiempo Estimado</label>
                  <input
                    type="text"
                    value={taskForm.tiempoEstimado}
                    onChange={(e) => setTaskForm((prev) => ({ ...prev, tiempoEstimado: e.target.value }))}
                    placeholder="Ej. 15 min o 1 hora"
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Herramienta Auxiliar Incorporada</label>
                  <select
                    value={taskForm.toolTipo}
                    onChange={(e) => setTaskForm((prev) => ({ ...prev, toolTipo: e.target.value as any }))}
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  >
                    <option value="evidencia" className="bg-slate-950">Subir Evidencia (Foto/Nota)</option>
                    <option value="contador" className="bg-slate-950">Contador Rápido (Cantidad/Surtido)</option>
                    <option value="limpieza" className="bg-slate-950">Checklist de Pautas Limpieza</option>
                  </select>
                </div>
                {taskForm.toolTipo === 'contador' && (
                  <div>
                    <label className="block font-semibold mb-1">Cantidad Objetivo</label>
                    <input
                      type="number"
                      value={taskForm.counterTarget}
                      onChange={(e) => setTaskForm((prev) => ({ ...prev, counterTarget: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Asignada a Puesto</label>
                <select
                  value={taskForm.puesto}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, puesto: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                >
                  {puestos.map((p) => (
                    <option key={p.id} value={p.nombre} className="bg-slate-950">{p.nombre}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-indigo-650 text-xs font-bold text-white hover:bg-indigo-600 shadow-md transition-all"
              >
                Habilitar Tarea en Tableros
              </button>
            </form>
          )}

          {/* 4. BUILDER: RUTINAS */}
          {activeBuilder === 'rutinas' && (
            <form onSubmit={handleRutinaSubmit} className="space-y-4 text-xs text-slate-450">
              <h3 className="text-sm font-bold text-white mb-2">Constructor de Rutinas Operativas</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Nombre de la Rutina</label>
                  <input
                    type="text"
                    required
                    value={rutinaForm.nombre}
                    onChange={(e) => setRutinaForm((prev) => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej. Rutina de Apertura de Almacén"
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Frecuencia</label>
                  <select
                    value={rutinaForm.frecuencia}
                    onChange={(e) => setRutinaForm((prev) => ({ ...prev, frecuencia: e.target.value as any }))}
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  >
                    <option value="Diaria" className="bg-slate-950">Diaria</option>
                    <option value="Semanal" className="bg-slate-950">Semanal</option>
                    <option value="Mensual" className="bg-slate-950">Mensual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Tipo de Rutina / Horario</label>
                  <select
                    value={rutinaForm.horario}
                    onChange={(e) => setRutinaForm((prev) => ({ ...prev, horario: e.target.value as any }))}
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  >
                    <option value="Apertura" className="bg-slate-950">Apertura</option>
                    <option value="Cierre" className="bg-slate-950">Cierre</option>
                    <option value="Limpieza" className="bg-slate-950">Limpieza</option>
                    <option value="Inventario" className="bg-slate-950">Inventario</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Asignar a Puesto Responsable</label>
                  <select
                    value={rutinaForm.asignableA}
                    onChange={(e) => setRutinaForm((prev) => ({ ...prev, asignableA: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                  >
                    {puestos.map((p) => (
                      <option key={p.id} value={p.nombre} className="bg-slate-950">{p.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Instrucciones Generales</label>
                <textarea
                  rows={2}
                  value={rutinaForm.descripcion}
                  onChange={(e) => setRutinaForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Detalles sobre cuándo y cómo ejecutar esta rutina..."
                  className="w-full px-4 py-2.5 rounded-lg text-xs glass-input"
                />
              </div>

              {/* Tasks multiselect lists */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-400">Asociar Tareas Operativas</label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl">
                  {tasks.map((task) => {
                    const isSelected = rutinaSelectedTasks.includes(task.id);
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleRutinaTaskSelection(task.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded border text-left text-[11px] transition-colors ${
                          isSelected
                            ? 'bg-indigo-650/10 border-indigo-500/40 text-indigo-400 font-semibold'
                            : 'bg-slate-900 border-slate-850 text-slate-350 hover:bg-slate-850'
                        }`}
                      >
                        <span>{task.titulo}</span>
                        <span className="text-[9px] text-slate-500 uppercase">{task.area}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-650 text-xs font-bold text-white rounded-lg hover:bg-indigo-600 transition-all shadow-md"
              >
                Habilitar Rutina de Trabajo
              </button>
            </form>
          )}

        </div>

        {/* Right Column: Visual Summary and List of Active Elements */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Active Jobs summary */}
          {activeBuilder === 'puestos' && (
            <div className="glass-panel p-5 rounded-2xl text-left space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Briefcase className="h-4.5 w-4.5 text-indigo-400" />
                <span>Puestos Habilitados</span>
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {puestos.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">{p.nombre}</span>
                      <span className="text-[10px] text-slate-500">{p.departamento} ({p.nivel})</span>
                    </div>
                    <span className="text-emerald-400 font-extrabold">${p.sueldo.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Courses summary */}
          {activeBuilder === 'cursos' && (
            <div className="glass-panel p-5 rounded-2xl text-left space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <BookOpen className="h-4.5 w-4.5 text-amber-500" />
                <span>Mapa de Cursos LMS</span>
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {cursos.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">{c.titulo}</span>
                      <span className="text-[9px] text-indigo-400 font-bold block mt-0.5">{c.insignia}</span>
                    </div>
                    <span className="text-slate-500 uppercase text-[9px] bg-slate-950 px-2 py-0.5 rounded">
                      {c.categoria}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Tasks summary */}
          {activeBuilder === 'tareas' && (
            <div className="glass-panel p-5 rounded-2xl text-left space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Layers className="h-4.5 w-4.5 text-indigo-400" />
                <span>Tareas Registradas</span>
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">{t.titulo}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">{t.area} — {t.seccion}</span>
                    </div>
                    <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {t.puesto}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
