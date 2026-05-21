import React, { useState } from 'react';
import { useApp, type Candidate } from '../context/AppContext';
import {
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Eye,
  FileCheck,
  UploadCloud
} from 'lucide-react';

export const ATSModule: React.FC = () => {
  const { activeRole, candidates, addCandidate, updateCandidateFase, puestos } = useApp();

  // Internal states
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    puestoInteres: 'Cajero',
    curp: '',
    rfc: '',
    nss: '',
    escolaridad: 'Preparatoria',
    experiencia: '',
    disponibilidad: 'Inmediata',
    referencias: '',
    emergenciaNombre: '',
    emergenciaTelefono: ''
  });

  const [uploadedDocs, setUploadedDocs] = useState({
    ine: false,
    curp: false,
    rfc: false,
    nss: false,
    domicilio: false,
    antecedentes: false,
    cv: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const simulateDocUpload = (docKey: keyof typeof uploadedDocs) => {
    setUploadedDocs((prev) => ({ ...prev, [docKey]: true }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCandidate({
      ...formData,
      fase: 'Postulado',
      documentos: uploadedDocs
    });
    setShowApplyForm(false);
    alert('¡Solicitud de empleo enviada con éxito! Su folio de seguimiento ha sido generado.');
  };

  // ------------------------------
  // Candidate / Aspirante UI View
  // ------------------------------
  if (activeRole === 'Aspirante') {
    const myCandidate = candidates[candidates.length - 1]; // Assume the last candidate created is the current simulator candidate

    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-indigo-500">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
            <Briefcase className="text-indigo-400 h-6 w-6" />
            <span>Bolsa de Empleo DecorArte</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Bienvenido al portal de reclutamiento de DecorArte. Escanea el código QR de nuestras sucursales y postúlate en minutos. Completa tu perfil y carga tus documentos oficiales para iniciar tu proceso.
          </p>
        </div>

        {!myCandidate || showApplyForm ? (
          <div className="glass-panel p-8 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Nueva Solicitud de Empleo</h3>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
                      currentStep === step ? 'bg-indigo-500 glow-indigo' : currentStep > step ? 'bg-indigo-800' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
              {/* STEP 1: Datos Personales */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Paso 1: Información Personal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Ej. Juan Pérez López"
                        className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Puesto de Interés</label>
                      <select
                        name="puestoInteres"
                        value={formData.puestoInteres}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                      >
                        {puestos.map((p) => (
                          <option key={p.id} value={p.nombre} className="bg-slate-900 text-white">
                            {p.nombre} ({p.nivel})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Correo Electrónico</label>
                      <input
                        type="email"
                        name="correo"
                        required
                        value={formData.correo}
                        onChange={handleInputChange}
                        placeholder="juan.perez@ejemplo.com"
                        className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Teléfono Móvil (10 dígitos)</label>
                      <input
                        type="tel"
                        name="telefono"
                        required
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="4491234567"
                        className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">CURP</label>
                      <input
                        type="text"
                        name="curp"
                        required
                        value={formData.curp}
                        onChange={handleInputChange}
                        placeholder="18 caracteres"
                        className="w-full px-4 py-2.5 rounded-lg text-sm glass-input uppercase"
                        maxLength={18}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">RFC</label>
                      <input
                        type="text"
                        name="rfc"
                        required
                        value={formData.rfc}
                        onChange={handleInputChange}
                        placeholder="13 caracteres"
                        className="w-full px-4 py-2.5 rounded-lg text-sm glass-input uppercase"
                        maxLength={13}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">NSS (Número de Seguridad Social)</label>
                      <input
                        type="text"
                        name="nss"
                        required
                        value={formData.nss}
                        onChange={handleInputChange}
                        placeholder="11 caracteres"
                        className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                        maxLength={11}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Escolaridad y Experiencia */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Paso 2: Formación y Disponibilidad</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Último Grado de Estudios</label>
                      <select
                        name="escolaridad"
                        value={formData.escolaridad}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                      >
                        <option value="Secundaria" className="bg-slate-900">Secundaria</option>
                        <option value="Preparatoria" className="bg-slate-900">Preparatoria / Bachillerato</option>
                        <option value="Técnico" className="bg-slate-900">Carrera Técnica</option>
                        <option value="Licenciatura" className="bg-slate-900">Licenciatura / Profesional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Disponibilidad de Horario</label>
                      <input
                        type="text"
                        name="disponibilidad"
                        required
                        value={formData.disponibilidad}
                        onChange={handleInputChange}
                        placeholder="Ej. Turno matutino, Rotativo, Inmediata"
                        className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Resumen de Experiencia Laboral</label>
                    <textarea
                      name="experiencia"
                      required
                      rows={3}
                      value={formData.experiencia}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos brevemente sobre tus trabajos anteriores..."
                      className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Referencias y Emergencia */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Paso 3: Contactos de Confianza</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Contacto de Emergencia (Nombre)</label>
                      <input
                        type="text"
                        name="emergenciaNombre"
                        required
                        value={formData.emergenciaNombre}
                        onChange={handleInputChange}
                        placeholder="Ej. María López (Madre)"
                        className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Teléfono de Emergencia</label>
                      <input
                        type="tel"
                        name="emergenciaTelefono"
                        required
                        value={formData.emergenciaTelefono}
                        onChange={handleInputChange}
                        placeholder="4491112233"
                        className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Referencias Personales o Laborales</label>
                    <textarea
                      name="referencias"
                      required
                      rows={3}
                      value={formData.referencias}
                      onChange={handleInputChange}
                      placeholder="Ej. Nombre, Parentesco y Teléfono de 2 personas..."
                      className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Documentos */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Paso 4: Expediente Digital Inicial</h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Haz clic en cada botón para simular la carga exitosa de tus documentos requeridos para el expediente de DecorArte.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { key: 'ine', label: 'Identificación Oficial (INE)' },
                      { key: 'curp', label: 'Copia de CURP' },
                      { key: 'rfc', label: 'Constancia Fiscal (RFC)' },
                      { key: 'nss', label: 'Documento de NSS' },
                      { key: 'domicilio', label: 'Comprobante de Domicilio' },
                      { key: 'antecedentes', label: 'Carta de No Antecedentes' },
                      { key: 'cv', label: 'Curriculum Vitae (CV)' }
                    ].map((doc) => {
                      const isUploaded = uploadedDocs[doc.key as keyof typeof uploadedDocs];
                      return (
                        <button
                          key={doc.key}
                          type="button"
                          onClick={() => simulateDocUpload(doc.key as keyof typeof uploadedDocs)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-xs transition-all duration-200 ${
                            isUploaded
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <UploadCloud className={`h-4.5 w-4.5 ${isUploaded ? 'text-emerald-400' : 'text-slate-500'}`} />
                            <span className="font-semibold">{doc.label}</span>
                          </div>
                          {isUploaded && <CheckCircle className="h-4.5 w-4.5 text-emerald-400 fill-emerald-500/10" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-850 mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Atrás</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => s + 1)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-indigo-650 text-xs font-bold text-white hover:bg-indigo-600 shadow-md shadow-indigo-650/10 transition-all duration-200"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-550/20 transition-all duration-200"
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>Enviar Postulación</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            {/* Status card */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Estatus de mi Candidatura</h3>
                  <p className="text-xs text-slate-500 mt-1">Candidato ID: {myCandidate.id}</p>
                </div>
                <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                  Fase: {myCandidate.fase}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Progreso de Contratación</span>
                  <span>{myCandidate.progreso}%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-550 glow-indigo"
                    style={{ width: `${myCandidate.progreso}%` }}
                  />
                </div>
              </div>

              {/* Phase timeline */}
              <div className="relative pl-6 space-y-6 border-l-2 border-slate-800 ml-3">
                {[
                  { fase: 'Postulado', title: 'Postulación Recibida', desc: 'Tu solicitud de empleo fue registrada exitosamente.', done: true },
                  { fase: 'Entrevista', title: 'Entrevista de RH', desc: 'Evaluación técnica y psicométrica inicial con un especialista.', done: ['Entrevista', 'Examen', 'Documentos', 'Contratado'].includes(myCandidate.fase) },
                  { fase: 'Examen', title: 'Exámenes Teóricos/Prácticos', desc: 'Acreditación de cursos introductorios obligatorios en Academia.', done: ['Examen', 'Documentos', 'Contratado'].includes(myCandidate.fase) },
                  { fase: 'Documentos', title: 'Cotejo de Documentos', desc: 'Validación de tus datos del seguro social, RFC y referencias.', done: ['Documentos', 'Contratado'].includes(myCandidate.fase) },
                  { fase: 'Contratado', title: 'Firma de Contrato', desc: 'Generación del expediente del colaborador y alta LFT.', done: myCandidate.fase === 'Contratado' }
                ].map((step, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-9.5 top-0.5 h-6 w-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        step.done
                          ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/10'
                          : 'bg-slate-950 border-slate-850 text-slate-600'
                      }`}
                    >
                      {step.done ? <CheckCircle className="h-3.5 w-3.5 text-white" /> : <Clock className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${step.done ? 'text-white' : 'text-slate-500'}`}>{step.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-6 text-left">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white">Resumen de Registro</h4>
                <div className="text-xs space-y-3">
                  <div>
                    <span className="text-slate-500 block">Nombre</span>
                    <span className="text-slate-200 font-semibold">{myCandidate.nombre}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Puesto solicitado</span>
                    <span className="text-slate-200 font-semibold">{myCandidate.puestoInteres}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">CURP / RFC / NSS</span>
                    <span className="font-mono text-slate-300">{myCandidate.curp} / {myCandidate.rfc} / {myCandidate.nss}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contacto Emergencia</span>
                    <span className="text-slate-300">{myCandidate.emergenciaNombre} ({myCandidate.emergenciaTelefono})</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-white">Documentos Cargados</h4>
                <div className="space-y-2">
                  {Object.entries(myCandidate.documentos).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between text-xs py-1 border-b border-slate-900/60 last:border-0">
                      <span className="uppercase text-slate-400 font-semibold">{key}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${val ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {val ? 'Completado' : 'Faltante'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowApplyForm(true)}
                className="w-full py-3 rounded-lg border border-indigo-500/30 text-indigo-400 font-bold text-xs hover:bg-indigo-500/10 transition-all duration-200"
              >
                Actualizar / Nueva Postulación
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ------------------------------------
  // Internal HR / Administrador UI View
  // ------------------------------------
  const columns: Candidate['fase'][] = ['Postulado', 'Entrevista', 'Examen', 'Documentos', 'Contratado'];

  return (
    <div className="p-6 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Briefcase className="text-indigo-500 h-6 w-6" />
            <span>Mesa de Trabajo Reclutamiento (ATS)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestiona el flujo de atracción de talento para DecorArte. Arrastra o actualiza fases en tiempo real.
          </p>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((columnName) => {
          const filtered = candidates.filter((c) => c.fase === columnName);
          return (
            <div key={columnName} className="glass-panel p-4 rounded-xl flex flex-col min-h-[500px] border border-slate-900">
              {/* Header column */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{columnName}</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-bold text-slate-300">
                  {filtered.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                {filtered.map((candidate) => (
                  <div
                    key={candidate.id}
                    onClick={() => setSelectedCandidate(candidate)}
                    className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 group text-left"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {candidate.nombre}
                      </h4>
                      <Eye className="h-3.5 w-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5">{candidate.puestoInteres}</p>
                    
                    {/* Tiny stats inside card */}
                    <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500">
                      <span>Carga Docs:</span>
                      <span className="font-semibold text-slate-300">
                        {Object.values(candidate.documentos).filter(Boolean).length}/7
                      </span>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="h-32 border border-dashed border-slate-850 rounded-lg flex items-center justify-center text-slate-600 text-xs">
                    Sin candidatos
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl p-6 text-left relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedCandidate.nombre}</h3>
                <p className="text-xs text-indigo-400 font-medium">Postulado para: {selectedCandidate.puestoInteres}</p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white"
              >
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="space-y-4">
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-slate-400">Datos del Aspirante</h4>
                <div className="space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">CURP</span>
                    <span className="font-mono text-white font-semibold">{selectedCandidate.curp}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">RFC</span>
                    <span className="font-mono text-white font-semibold">{selectedCandidate.rfc}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">NSS</span>
                    <span className="font-mono text-white font-semibold">{selectedCandidate.nss}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">Escolaridad</span>
                    <span className="text-slate-200 font-semibold">{selectedCandidate.escolaridad}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Experiencia Laboral</span>
                    <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg leading-relaxed">{selectedCandidate.experiencia}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-slate-400">Referencias & Emergencia</h4>
                <div className="space-y-2.5">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Referencias Proporcionadas</span>
                    <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg leading-relaxed">{selectedCandidate.referencias}</p>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">Emergencia (Contacto)</span>
                    <span className="text-slate-200 font-semibold">{selectedCandidate.emergenciaNombre}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">Teléfono Emergencia</span>
                    <span className="text-slate-200 font-semibold">{selectedCandidate.emergenciaTelefono}</span>
                  </div>
                </div>

                <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-slate-400 pt-2">Expediente Oficial</h4>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {Object.entries(selectedCandidate.documentos).map(([docKey, isAvail]) => (
                    <div key={docKey} className="flex items-center space-x-1.5 p-2 bg-slate-900 rounded border border-slate-850">
                      <span className={`h-2 w-2 rounded-full ${isAvail ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="uppercase text-slate-300 font-semibold">{docKey}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage Modifier Widget inside Modal */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Mover fase actual:</span>
                <select
                  value={selectedCandidate.fase}
                  onChange={(e) => {
                    updateCandidateFase(selectedCandidate.id, e.target.value as Candidate['fase']);
                    setSelectedCandidate((prev) => prev ? { ...prev, fase: e.target.value as Candidate['fase'] } : null);
                  }}
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {columns.map((c) => (
                    <option key={c} value={c} className="bg-slate-950 text-white">{c}</option>
                  ))}
                </select>
              </div>

              {selectedCandidate.fase === 'Contratado' ? (
                <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold animate-pulse">
                  <CheckCircle className="h-4 w-4" />
                  <span>Candidato contratado. ¡Listo para ERP!</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    updateCandidateFase(selectedCandidate.id, 'Contratado');
                    setSelectedCandidate((prev) => prev ? { ...prev, fase: 'Contratado', progreso: 100 } : null);
                    alert(`¡Candidato ${selectedCandidate.nombre} contratado de forma exitosa! Se le ha generado acceso como Empleado Operativo.`);
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-650 text-xs font-bold text-white hover:bg-indigo-600 shadow-md shadow-indigo-600/10 transition-all duration-200"
                >
                  Contratar e Integrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
