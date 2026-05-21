import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UploadCloud,
  CheckCircle,
  FileText,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Check,
  AlertCircle,
  Award,
  Zap,
} from 'lucide-react';

export const ApplicantPortal: React.FC = () => {
  const { puestos, addCandidate, updateCandidateFase } = useApp();

  // Navigation and wizard steps
  // 'landing' | 'apply' | 'documents' | 'exam' | 'success'
  const [stage, setStage] = useState<'landing' | 'apply' | 'documents' | 'exam' | 'success'>('landing');
  const [selectedPuestoId, setSelectedPuestoId] = useState<string>('p-1');
  const [currentStep, setCurrentStep] = useState(1);
  const [applicantId, setApplicantId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    curp: '',
    rfc: '',
    nss: '',
    escolaridad: 'Preparatoria',
    experiencia: '',
    disponibilidad: 'Inmediata',
    referencias: '',
    emergenciaNombre: '',
    emergenciaTelefono: '',
  });

  const [uploadedDocs, setUploadedDocs] = useState({
    ine: false,
    curp: false,
    rfc: false,
    nss: false,
    domicilio: false,
    antecedentes: false,
    cv: false,
  });

  // Exam states
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [examScore, setExamScore] = useState(0);

  const selectedPuesto = puestos.find((p) => p.id === selectedPuestoId) || puestos[0];

  // Dummy vacancies descriptions
  const vacanciesInfo: Record<string, { duties: string[]; icon: string }> = {
    'p-1': {
      icon: '🛒',
      duties: [
        'Cobro rápido y exacto de mercancía.',
        'Arqueos de caja al inicio y final del turno.',
        'Atención de calidad y saludo protocolario al cliente.',
        'Manejo de terminales punto de venta y software SICAR.',
      ],
    },
    'p-2': {
      icon: '📦',
      duties: [
        'Acomodo y surtido de mercancía en piso de ventas.',
        'Limpieza diaria de pasillos y orden de góndolas.',
        'Apoyo al cliente en la localización de productos.',
        'Recepción de mercancía de proveedores en bodega.',
      ],
    },
    'p-3': {
      icon: '🛡️',
      duties: [
        'Supervisión de operaciones de caja y arqueos.',
        'Resolución de incidencias y quejas de clientes.',
        'Control de asistencia y asignación de tareas operativas.',
        'Capacitación de cajeros de nuevo ingreso.',
      ],
    },
  };

  // Mock exam questions
  const examQuestions = [
    {
      pregunta: '¿Cuál es el protocolo de DecorArte cuando un cliente llega a ventanilla?',
      opciones: [
        'Cobrar directamente sin hablar',
        'Saludar con sonrisa cordial, preguntar si encontró todo lo que buscaba y agradecer al final',
        'Llamar al supervisor inmediatamente',
      ],
      correct: 1,
    },
    {
      pregunta: 'Si hay sospecha de que un billete de $500 MXN es falso, ¿cuál es el procedimiento?',
      opciones: [
        'Aceptarlo para no discutir con el cliente',
        'Discutir fuertemente con el cliente y retener su identificación',
        'Informar cordialmente que la terminal no lo lee, llamar al supervisor discretamente y no aceptarlo',
      ],
      correct: 2,
    },
    {
      pregunta: '¿Cuál es el límite de tolerancia de asistencia diaria según el reglamento oficial?',
      opciones: [
        'No hay tolerancia',
        '10 minutos de tolerancia (entrada oficial 8:30, límite 8:40 AM)',
        '30 minutos de tolerancia',
      ],
      correct: 1,
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate candidate ID generation
    const generatedId = `cand-${Date.now()}`;
    setApplicantId(generatedId);

    // Add candidate to global AppContext
    addCandidate({
      nombre: formData.nombre,
      correo: formData.correo,
      telefono: formData.telefono,
      puestoInteres: selectedPuesto.nombre,
      fase: 'Postulado',
      curp: formData.curp.toUpperCase(),
      rfc: formData.rfc.toUpperCase(),
      nss: formData.nss,
      escolaridad: formData.escolaridad,
      experiencia: formData.experiencia,
      disponibilidad: formData.disponibilidad,
      referencias: formData.referencias,
      emergenciaNombre: formData.emergenciaNombre,
      emergenciaTelefono: formData.emergenciaTelefono,
      documentos: {
        ine: false,
        curp: false,
        rfc: false,
        nss: false,
        domicilio: false,
        antecedentes: false,
        cv: false,
      },
    });

    setStage('documents');
  };

  const simulateUpload = (key: keyof typeof uploadedDocs) => {
    setUploadedDocs((prev) => ({ ...prev, [key]: true }));
  };

  const handleDocumentsDone = () => {
    // If we have an applicantId, we can simulate updating their document check statuses in context.
    // In our simplified mock context, the last candidate gets updated.
    setStage('exam');
  };

  const handleAnswerSelect = (qIdx: number, oIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleExamSubmit = () => {
    let score = 0;
    examQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score += 1;
      }
    });

    const percent = Math.round((score / examQuestions.length) * 100);
    setExamScore(percent);

    if (applicantId) {
      // Update candidate phase in context to Examen
      updateCandidateFase(applicantId, 'Examen');
    }

    setStage('success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-8 px-4 relative overflow-hidden font-sans">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[50%] rounded-full bg-indigo-650/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[50%] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-center">
        {/* Header Branding */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-900">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              DA
            </div>
            <div className="text-left">
              <h1 className="text-base font-black text-white leading-none">DecorArte</h1>
              <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">
                Portal de Aspirantes
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-850 text-[10px] text-slate-400 font-bold">
            <QrCode className="h-3.5 w-3.5 text-indigo-400" />
            <span>Sucursal Irapuato</span>
          </div>
        </div>

        {/* --------------------- STAGE 1: LANDING --------------------- */}
        {stage === 'landing' && (
          <div className="space-y-6 text-left">
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-indigo-500">
              <h2 className="text-xl font-extrabold text-white">¡Únete a la Familia DecorArte!</h2>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Buscamos talento apasionado por el servicio y la excelencia operativa. Revisa nuestras
                vacantes disponibles en Sucursal Irapuato, postúlate completando tu información básica, carga
                tus archivos PDF y realiza la evaluación inicial.
              </p>
            </div>

            <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mt-6">
              Vacantes Disponibles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {puestos
                .filter((p) => p.nombre !== 'RH')
                .map((p) => {
                  const info = vacanciesInfo[p.id] || { icon: '💼', duties: [] };
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPuestoId(p.id);
                        setStage('apply');
                        setCurrentStep(1);
                      }}
                      className="glass-panel p-5 rounded-2xl border border-slate-900 hover:border-indigo-500/35 transition-all duration-300 cursor-pointer hover:scale-[1.01] group relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute right-0 top-0 h-16 w-16 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full group-hover:from-indigo-500/10 transition-all" />
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{info.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {p.nombre}
                            </h4>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-slate-950 text-slate-450 border border-slate-900 font-bold uppercase mt-1 inline-block">
                              {p.nivel}
                            </span>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-450 font-bold mb-2">
                          Sueldo Base: <span className="text-emerald-400">${p.sueldo.toLocaleString()} MXN / mensual</span>
                        </div>

                        <ul className="space-y-1 mt-3">
                          {info.duties.slice(0, 3).map((duty, idx) => (
                            <li key={idx} className="text-[10px] text-slate-400 flex items-start space-x-1.5 leading-relaxed">
                              <span className="text-indigo-400 mt-0.5 font-bold">•</span>
                              <span>{duty}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full mt-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-200 hover:text-white text-[11px] font-bold border border-slate-850 hover:border-indigo-500 transition-all flex items-center justify-center space-x-1">
                        <span>Postularse Ahora</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* --------------------- STAGE 2: APPLICATION FORM (WIZARD) --------------------- */}
        {stage === 'apply' && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 text-left">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900">
              <div>
                <h3 className="text-sm font-black text-white">Postulación para: {selectedPuesto.nombre}</h3>
                <span className="text-[9px] text-slate-500 font-bold">Completa los 3 pasos de tu perfil</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                      currentStep === step ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : currentStep > step ? 'bg-indigo-850' : 'bg-slate-900'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* STEP 1: Datos Personales */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    Paso 1: Información Personal & RFC
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Ej. Sofía Martínez López"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        name="correo"
                        required
                        value={formData.correo}
                        onChange={handleInputChange}
                        placeholder="sofia.martinez@ejemplo.com"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                        Teléfono Móvil (10 dígitos)
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        required
                        pattern="[0-9]{10}"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="4491234567"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                        CURP (Clave Única)
                      </label>
                      <input
                        type="text"
                        name="curp"
                        required
                        value={formData.curp}
                        onChange={handleInputChange}
                        placeholder="18 caracteres"
                        maxLength={18}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input uppercase tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                        RFC
                      </label>
                      <input
                        type="text"
                        name="rfc"
                        required
                        value={formData.rfc}
                        onChange={handleInputChange}
                        placeholder="13 caracteres"
                        maxLength={13}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input uppercase tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                        NSS (IMSS)
                      </label>
                      <input
                        type="text"
                        name="nss"
                        required
                        value={formData.nss}
                        onChange={handleInputChange}
                        placeholder="11 dígitos"
                        maxLength={11}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input tracking-wider"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Estudios & Experiencia */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    Paso 2: Formación & Historial
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                        Último Grado de Estudios
                      </label>
                      <select
                        name="escolaridad"
                        value={formData.escolaridad}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input bg-slate-900"
                      >
                        <option value="Secundaria">Secundaria</option>
                        <option value="Preparatoria">Preparatoria / Bachillerato</option>
                        <option value="Técnico">Carrera Técnica</option>
                        <option value="Licenciatura">Licenciatura / Universidad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                        Disponibilidad
                      </label>
                      <input
                        type="text"
                        name="disponibilidad"
                        required
                        value={formData.disponibilidad}
                        onChange={handleInputChange}
                        placeholder="Ej. Inmediata, Turno matutino, Rotativo"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                      Resumen de Experiencia Laboral
                    </label>
                    <textarea
                      name="experiencia"
                      required
                      rows={3}
                      value={formData.experiencia}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos brevemente dónde has trabajado y qué funciones realizabas..."
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Emergencias & Referencias */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    Paso 3: Contactos & Referencias
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                        Contacto de Emergencia (Nombre)
                      </label>
                      <input
                        type="text"
                        name="emergenciaNombre"
                        required
                        value={formData.emergenciaNombre}
                        onChange={handleInputChange}
                        placeholder="Ej. Carlos Martínez (Padre)"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                        Teléfono de Emergencia
                      </label>
                      <input
                        type="tel"
                        name="emergenciaTelefono"
                        required
                        pattern="[0-9]{10}"
                        value={formData.emergenciaTelefono}
                        onChange={handleInputChange}
                        placeholder="4499876543"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">
                      Referencias Personales o Laborales
                    </label>
                    <textarea
                      name="referencias"
                      required
                      rows={3}
                      value={formData.referencias}
                      onChange={handleInputChange}
                      placeholder="Ej. Nombre, Parentesco/Relación, Teléfono..."
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-900 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 1) {
                      setStage('landing');
                    } else {
                      setCurrentStep((prev) => prev - 1);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-800 text-xs font-bold text-slate-300 transition flex items-center space-x-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Atrás</span>
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center space-x-1"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-650 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition flex items-center space-x-1"
                  >
                    <span>Guardar y Cargar Documentos</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* --------------------- STAGE 3: DOCUMENTS UPLOAD --------------------- */}
        {stage === 'documents' && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 text-left">
            <h3 className="text-sm font-black text-white">Paso 4: Expediente Documental Digital</h3>
            <p className="text-[11px] text-slate-400 mt-1 mb-5">
              Carga tus documentos oficiales en formato PDF o Imagen. Estos archivos se guardarán en tu expediente
              digital para evaluación del equipo de Recursos Humanos.
            </p>

            <div className="space-y-3.5">
              {(Object.keys(uploadedDocs) as Array<keyof typeof uploadedDocs>).map((docKey) => {
                const isUploaded = uploadedDocs[docKey];
                return (
                  <div
                    key={docKey}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                      isUploaded ? 'bg-emerald-950/10 border-emerald-500/30' : 'bg-slate-900/40 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          isUploaded ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 capitalize">
                          {docKey === 'ine'
                            ? 'Identificación Oficial (INE)'
                            : docKey === 'curp'
                            ? 'CURP Oficial'
                            : docKey === 'rfc'
                            ? 'RFC (SAT)'
                            : docKey === 'nss'
                            ? 'NSS (IMSS)'
                            : docKey === 'domicilio'
                            ? 'Comprobante de Domicilio'
                            : docKey === 'antecedentes'
                            ? 'Carta de Antecedentes No Penales'
                            : 'Curriculum Vitae (CV)'}
                        </span>
                        <span className="text-[8px] text-slate-500 block font-semibold uppercase mt-0.5">
                          {isUploaded ? 'Documento Listo para Revisión' : 'Pendiente de Cargar'}
                        </span>
                      </div>
                    </div>

                    {isUploaded ? (
                      <div className="h-6 px-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-extrabold flex items-center space-x-1">
                        <Check className="h-3 w-3" />
                        <span>CARGADO</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => simulateUpload(docKey)}
                        className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-750 text-slate-300 hover:text-white text-[10px] font-bold flex items-center space-x-1.5 transition-all"
                      >
                        <UploadCloud className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Examinar Archivo</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-900 mt-6">
              <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                <span>Puedes completar documentos pendientes en la sucursal.</span>
              </span>
              <button
                onClick={handleDocumentsDone}
                className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-650 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition flex items-center space-x-1"
              >
                <span>Proceder a la Evaluación</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* --------------------- STAGE 4: EXAM --------------------- */}
        {stage === 'exam' && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-6">
              <div>
                <h3 className="text-sm font-black text-white">Evaluación Inicial del Aspirante</h3>
                <span className="text-[9px] text-slate-500 font-bold block mt-0.5">
                  Pregunta {currentExamIndex + 1} de {examQuestions.length}
                </span>
              </div>
              <div className="flex items-center space-x-1 py-1 px-2.5 rounded bg-slate-900 text-[10px] text-indigo-400 font-extrabold uppercase border border-slate-850">
                <Zap className="h-3.5 w-3.5 mr-1" />
                <span>Selector</span>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold text-slate-200 leading-relaxed">
                {examQuestions[currentExamIndex].pregunta}
              </h4>

              <div className="space-y-2.5">
                {examQuestions[currentExamIndex].opciones.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentExamIndex] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(currentExamIndex, idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all duration-150 ${
                        isSelected
                          ? 'bg-indigo-650/15 border-indigo-500 text-indigo-400 font-bold shadow-[0_0_12px_rgba(99,102,241,0.08)]'
                          : 'bg-slate-900/40 border-slate-900 hover:border-slate-800 text-slate-350 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500 text-white'
                              : 'border-slate-700 bg-slate-950 text-slate-500'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-900 mt-6">
              <button
                type="button"
                disabled={currentExamIndex === 0}
                onClick={() => setCurrentExamIndex((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-850 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-800 text-[10px] font-bold text-slate-400 transition"
              >
                Pregunta Anterior
              </button>

              {currentExamIndex < examQuestions.length - 1 ? (
                <button
                  type="button"
                  disabled={selectedAnswers[currentExamIndex] === undefined}
                  onClick={() => setCurrentExamIndex((prev) => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 disabled:pointer-events-none text-xs font-bold text-white transition"
                >
                  Siguiente Pregunta
                </button>
              ) : (
                <button
                  type="button"
                  disabled={selectedAnswers[currentExamIndex] === undefined}
                  onClick={handleExamSubmit}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-xs font-bold text-white shadow-lg shadow-emerald-500/10 transition"
                >
                  Finalizar Evaluación
                </button>
              )}
            </div>
          </div>
        )}

        {/* --------------------- STAGE 5: SUCCESS --------------------- */}
        {stage === 'success' && (
          <div className="glass-panel p-8 rounded-2xl border border-slate-900 text-center space-y-6">
            <div className="h-16 w-16 bg-emerald-500/15 text-emerald-400 rounded-full border border-emerald-500/25 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-black text-white">¡Postulación Enviada con Éxito!</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Hemos recibido tu solicitud para el puesto de <span className="text-white font-bold">{selectedPuesto.nombre}</span> en Sucursal Irapuato.
                Tu folio único de seguimiento ha sido registrado.
              </p>
            </div>

            {/* Assessment Score Badge */}
            <div className="glass-panel max-w-sm mx-auto p-4 rounded-xl border border-slate-850 flex items-center justify-between text-left">
              <div>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">
                  Resultado de Evaluación Inicial
                </span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block">
                  {examScore >= 70 ? 'Aprobado satisfactoriamente' : 'En revisión de aptitudes'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-slate-500 font-bold block">Puntaje</span>
                <span
                  className={`text-base font-black ${
                    examScore >= 70 ? 'text-emerald-400' : 'text-amber-500'
                  }`}
                >
                  {examScore}%
                </span>
              </div>
            </div>

            {/* Next Steps List */}
            <div className="max-w-md mx-auto text-left space-y-3 bg-slate-900/30 p-5 rounded-xl border border-slate-900">
              <h4 className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest flex items-center space-x-1.5">
                <Award className="h-4 w-4 text-indigo-400" />
                <span>Próximos Pasos en el Proceso</span>
              </h4>
              <div className="space-y-2.5 mt-2.5">
                <div className="flex items-start space-x-2.5 text-xs">
                  <div className="h-4 w-4 rounded-full bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    <span className="text-white font-bold">Revisión de Expediente:</span> Recursos Humanos verificará tus datos, CURP, RFC, NSS y documentos cargados.
                  </p>
                </div>
                <div className="flex items-start space-x-2.5 text-xs">
                  <div className="h-4 w-4 rounded-full bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    <span className="text-white font-bold">Contacto para Entrevista:</span> Te contactaremos vía correo o llamada telefónica para programar tu entrevista de selección.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900 flex justify-center">
              <button
                onClick={() => {
                  setStage('landing');
                  setFormData({
                    nombre: '',
                    correo: '',
                    telefono: '',
                    curp: '',
                    rfc: '',
                    nss: '',
                    escolaridad: 'Preparatoria',
                    experiencia: '',
                    disponibilidad: 'Inmediata',
                    referencias: '',
                    emergenciaNombre: '',
                    emergenciaTelefono: '',
                  });
                  setUploadedDocs({
                    ine: false,
                    curp: false,
                    rfc: false,
                    nss: false,
                    domicilio: false,
                    antecedentes: false,
                    cv: false,
                  });
                  setSelectedAnswers({});
                  setCurrentExamIndex(0);
                  setApplicantId(null);
                }}
                className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-750 text-slate-300 hover:text-white text-xs font-bold transition-all"
              >
                Volver a la Bolsa de Trabajo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <footer className="text-[10px] text-slate-600 mt-8 text-center">
        DecorArte RH 360 v2.1 (2026) • Proceso regulado conforme a la Ley Federal del Trabajo.
      </footer>
    </div>
  );
};
