import React, { useState } from 'react';
import { useApp, type Course } from '../context/AppContext';
import {
  BookOpen,
  Play,
  FileDown,
  Award,
  Flame,
  Check,
  Lock,
  Trophy,
  Zap,
  HelpCircle,
  Video,
  AlertTriangle
} from 'lucide-react';

export const LMSModule: React.FC = () => {
  const {
    activeUser,
    cursos,
    gainXp,
    earnBadge
  } = useApp();

  // Internal states
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ id: string; titulo: string } | null>(null);
  const [examActive, setExamActive] = useState(false);
  const [examAnswers, setExamAnswers] = useState<number[]>([]);
  const [examCurrentIndex, setExamCurrentIndex] = useState(0);
  const [examResult, setExamResult] = useState<{ passed: boolean; score: number } | null>(null);

  // Mock completed courses of user
  const [completedCursos, setCompletedCursos] = useState<string[]>(['c-caja']);

  const startCourse = (course: Course) => {
    setSelectedCourse(course);
    setExamActive(false);
    setExamResult(null);
    setExamAnswers([]);
    setExamCurrentIndex(0);
  };

  const handleStartExam = () => {
    setExamActive(true);
    setExamCurrentIndex(0);
    setExamAnswers([]);
    setExamResult(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    const newAns = [...examAnswers];
    newAns[examCurrentIndex] = optionIndex;
    setExamAnswers(newAns);

    if (selectedCourse && examCurrentIndex < selectedCourse.examen.length - 1) {
      setExamCurrentIndex((idx) => idx + 1);
    } else {
      // Calculate results
      if (!selectedCourse) return;
      let correct = 0;
      selectedCourse.examen.forEach((q, idx) => {
        if (newAns[idx] === q.respuestaCorrecta) {
          correct++;
        }
      });
      const score = Math.round((correct / selectedCourse.examen.length) * 100);
      const passed = score >= 70; // 70 is passing score

      if (passed) {
        gainXp(selectedCourse.xpRecompensa);
        earnBadge(selectedCourse.insignia);
        if (!completedCursos.includes(selectedCourse.id)) {
          setCompletedCursos([...completedCursos, selectedCourse.id]);
        }
      }
      setExamResult({ passed, score });
      setExamActive(false);
    }
  };

  // Gamification Leaderboard Mock
  const leaderboard = [
    { pos: 1, name: 'Karla Rojas', puesto: 'Supervisor Almacén', racha: 12, xp: 950 },
    { pos: 2, name: 'Eduardo Torres', puesto: 'Cajero', racha: 8, xp: 710 },
    { pos: 3, name: activeUser.name, puesto: activeUser.puesto, racha: activeUser.racha, xp: activeUser.xp, isSelf: true },
    { pos: 4, name: 'Miguel Ángel', puesto: 'Ayudante integral', racha: 3, xp: 480 },
    { pos: 5, name: 'Sofía Gómez', puesto: 'Cajero', racha: 2, xp: 320 }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="p-6 space-y-6 text-left">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        
        {/* Left Column: Learning Roadmap & Course Info */}
        <div className="flex-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-amber-500">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2.5">
              <BookOpen className="text-amber-500 h-5.5 w-5.5" />
              <span>Academia de Capacitación DecorArte</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Capacitación interactiva estilo Duolingo. Completa lecciones, acredita exámenes, acumula experiencia y gana insignias para crecer internamente dentro del organigrama laboral de DecorArte.
            </p>
          </div>

          {/* DUOLINGO ROADMAP VIEW */}
          {!selectedCourse ? (
            <div className="glass-panel p-8 rounded-2xl space-y-8 relative overflow-hidden bg-slate-950/40">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center">
                Mi Camino de Aprendizaje
              </h3>

              {/* Path nodes container */}
              <div className="flex flex-col items-center space-y-12 py-6 relative">
                {/* Visual track line background */}
                <div className="absolute top-12 bottom-12 w-1 border-r-4 border-dashed border-slate-800 z-0" />

                {cursos.map((c, index) => {
                  const isCompleted = completedCursos.includes(c.id);
                  const isAvailable = index === 0 || completedCursos.includes(cursos[index - 1].id) || isCompleted;
                  
                  // Zigzag offsets for Duolingo feel
                  const zigzagClass = index % 2 === 0 ? 'translate-x-8' : '-translate-x-8';

                  return (
                    <div key={c.id} className={`flex items-center space-x-4 z-10 transition-transform ${zigzagClass}`}>
                      {/* Circle button */}
                      <button
                        onClick={() => isAvailable && startCourse(c)}
                        disabled={!isAvailable}
                        className={`h-20 w-20 rounded-full flex flex-col items-center justify-center border-b-4 border transition-all duration-150 shadow-lg ${
                          isCompleted
                            ? 'bg-amber-500 border-amber-400 text-slate-950 border-b-amber-700 hover:scale-105 active:border-b-0 active:translate-y-1'
                            : isAvailable
                            ? 'bg-indigo-650 border-indigo-500 text-white border-b-indigo-850 hover:scale-105 active:border-b-0 active:translate-y-1 glow-indigo'
                            : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-7 w-7 stroke-[3]" />
                        ) : isAvailable ? (
                          <Zap className="h-7 w-7 fill-white animate-pulse" />
                        ) : (
                          <Lock className="h-6 w-6 text-slate-700" />
                        )}
                      </button>

                      {/* Course badge details */}
                      <div className="text-left bg-slate-900/90 border border-slate-850 p-3 rounded-xl max-w-xs shadow-md">
                        <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">
                          Nivel {index + 1}: {c.categoria}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-0.5 leading-snug">{c.titulo}</h4>
                        <span className="text-[9px] text-indigo-400 mt-1 block">
                          {isCompleted ? '¡Acreditado!' : isAvailable ? '¡Listo para aprender!' : 'Bloqueado'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // INDIVIDUAL COURSE MODULE VIEWER
            <div className="glass-panel p-6 rounded-2xl border border-slate-850 space-y-6">
              {/* Back navigation button */}
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white"
              >
                ← Volver al mapa de aprendizaje
              </button>

              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">
                    Curso {selectedCourse.categoria}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedCourse.titulo}</h3>
                  <p className="text-xs text-slate-450 mt-1.5 leading-relaxed">{selectedCourse.descripcion}</p>
                </div>
                <div className="text-right shrink-0 bg-slate-950 p-3 rounded-xl border border-slate-900">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Acredita para obtener</span>
                  <span className="text-xs text-indigo-400 font-bold block mt-0.5">+{selectedCourse.xpRecompensa} XP</span>
                  <span className="text-[10px] text-amber-500 font-semibold block">{selectedCourse.insignia}</span>
                </div>
              </div>

              {/* Lesson components: Videos & PDFs */}
              {!examActive && !examResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left sub-column: Videos */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                      <Video className="h-4 w-4" />
                      <span>Videos de Clase</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedCourse.videos.map((vid) => (
                        <button
                          key={vid.id}
                          onClick={() => setActiveVideo(vid)}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 text-left text-xs transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-7 w-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                              <Play className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400" />
                            </div>
                            <span className="font-semibold text-slate-200">{vid.titulo}</span>
                          </div>
                          <span className="text-slate-500 font-mono">{vid.duracion}</span>
                        </button>
                      ))}
                      {selectedCourse.videos.length === 0 && (
                        <p className="text-xs text-slate-500 italic p-3">No hay videos en este curso</p>
                      )}
                    </div>
                  </div>

                  {/* Right sub-column: PDFs & Exams triggers */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                        Manuales y Material de Apoyo
                      </h4>
                      <div className="space-y-2">
                        {selectedCourse.pdfs.map((pdf, idx) => (
                          <a
                            key={idx}
                            href="#"
                            onClick={(e) => { e.preventDefault(); alert(`Descargando ${pdf.titulo}...`); }}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 text-left text-xs transition-colors text-slate-350 hover:text-white"
                          >
                            <span className="font-semibold">{pdf.titulo}</span>
                            <FileDown className="h-4 w-4 text-slate-500" />
                          </a>
                        ))}
                        {selectedCourse.pdfs.length === 0 && (
                          <p className="text-xs text-slate-500 italic p-3">No hay archivos complementarios</p>
                        )}
                      </div>
                    </div>

                    {/* Examen card */}
                    <div className="p-4 rounded-xl border border-indigo-900 bg-indigo-650/10 space-y-3">
                      <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Examen Evaluativo</h5>
                      <p className="text-[11px] text-slate-400">
                        Contesta correctamente las preguntas para acreditar el módulo y recibir tu certificado digital.
                      </p>
                      <button
                        onClick={handleStartExam}
                        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md transition-all"
                      >
                        Iniciar Evaluación Módulo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* INTERACTIVE QUIZ WINDOW (Duolingo Style) */}
              {examActive && (
                <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-850 space-y-6">
                  {/* Duolingo style header */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <span className="text-xs font-bold text-indigo-400">
                      Pregunta {examCurrentIndex + 1} de {selectedCourse.examen.length}
                    </span>
                    <div className="w-48 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${((examCurrentIndex) / selectedCourse.examen.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-extrabold text-white leading-relaxed flex items-start space-x-2">
                      <HelpCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{selectedCourse.examen[examCurrentIndex].pregunta}</span>
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2.5">
                      {selectedCourse.examen[examCurrentIndex].opciones.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          className="w-full p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-indigo-500 hover:bg-slate-850 text-left text-xs font-bold text-slate-200 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="h-6 w-6 rounded-lg bg-slate-950 flex items-center justify-center text-[10px] text-slate-500">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EXAM RESULT BANNERS */}
              {examResult && (
                <div className={`p-6 rounded-xl border text-center space-y-4 ${
                  examResult.passed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  {examResult.passed ? (
                    <>
                      <Check className="h-12 w-12 mx-auto bg-emerald-500/15 p-2 rounded-full text-emerald-400" />
                      <h4 className="text-lg font-bold">¡Felicidades, Módulo Acreditado!</h4>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                        Has aprobado el examen con un puntaje de **{examResult.score}%**. Se han sumado **{selectedCourse.xpRecompensa} XP** a tu perfil y se ha desbloqueado la insignia **"{selectedCourse.insignia}"** en tu repisa.
                      </p>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-12 w-12 mx-auto bg-rose-500/15 p-2 rounded-full text-rose-400" />
                      <h4 className="text-lg font-bold">Evaluación No Acreditada</h4>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                        Tu puntaje fue de **{examResult.score}%** (requerido mínimo 70%). Te recomendamos repasar los manuales y videos instructivos de este módulo para intentar el examen nuevamente.
                      </p>
                    </>
                  )}

                  <div className="flex justify-center gap-3 font-bold text-xs pt-2">
                    <button
                      onClick={() => setExamResult(null)}
                      className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    >
                      Volver al Curso
                    </button>
                    {!examResult.passed && (
                      <button
                        onClick={handleStartExam}
                        className="px-4 py-2 rounded-lg bg-indigo-650 text-white hover:bg-indigo-600"
                      >
                        Reintentar Examen
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Gamification sidebar widgets */}
        <div className="w-full md:w-80 space-y-6">
          {/* XP & Level widget */}
          <div className="glass-panel p-5 rounded-2xl text-left space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>Mi Nivel de Academia</span>
            </h3>
            
            <div className="flex items-center space-x-3.5">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
                {Math.floor(activeUser.xp / 100) + 1}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Rango: Colaborador Platino</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{activeUser.xp} total XP acumulados</span>
              </div>
            </div>

            {/* XP progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>XP para siguiente nivel</span>
                <span>{activeUser.xp % 100} / 100</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${activeUser.xp % 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Leaderboard panel */}
          <div className="glass-panel p-5 rounded-2xl text-left space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>Ranking de Rachas</span>
            </h3>

            <div className="space-y-2">
              {leaderboard.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                    item.isSelf
                      ? 'bg-indigo-650/10 border-indigo-500 text-indigo-400 font-semibold'
                      : 'bg-slate-900/50 border-slate-850 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="font-bold text-[10px] text-slate-500 w-4">#{idx + 1}</span>
                    <div>
                      <span className="font-semibold block">{item.name}</span>
                      <span className="text-[9px] text-slate-500">{item.puesto}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 font-bold text-amber-500 text-xs">
                    <Flame className="h-3.5 w-3.5 fill-amber-500/10" />
                    <span>{item.racha}d</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insignias display shelf */}
          <div className="glass-panel p-5 rounded-2xl text-left space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Award className="h-4 w-4 text-indigo-400" />
              <span>Repisa de Insignias</span>
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              {activeUser.insignias.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-2 bg-slate-900 rounded-xl border border-slate-850 text-center space-y-1.5"
                  title={badge}
                >
                  <Award className="h-8 w-8 text-amber-500" />
                  <span className="text-[8px] font-bold text-slate-350 leading-tight block truncate max-w-full">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DUMMY VIDEO PLAYER MODAL SCREEN */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl p-6 text-left space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white flex items-center space-x-2">
                <Video className="h-4 w-4 text-indigo-500" />
                <span>Simulador de Video: {activeVideo.titulo}</span>
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="px-2.5 py-1 bg-slate-900 text-[10px] text-slate-400 hover:text-white rounded"
              >
                Cerrar
              </button>
            </div>

            {/* Video mockup player */}
            <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-850 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-indigo-500 animate-pulse w-3/4" />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Reproduciendo... (75% visto)</span>
                  <span>07:22 / 10:00</span>
                </div>
              </div>
              <Play className="h-12 w-12 text-indigo-500 bg-indigo-500/10 p-3 rounded-full border border-indigo-500/30 scale-110" />
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              * Ver la clase en un 80% o más marcará la lección como leída de forma automática para desbloquear el examen.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
