import { useState, useEffect, type FormEvent } from 'react';
import { Award, CheckCircle2, User, Calendar, Hash, ArrowRight, RotateCcw, History, Sparkles, Database, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Player, MetricEvaluation } from '../types';
import { StarRating } from './StarRating';
import { SupabaseSyncStatus } from '../lib/supabase';

interface EvaluacionesViewProps {
  players: Player[];
  selectedPlayerId: string;
  onSelectPlayer: (playerId: string) => void;
  onSaveEvaluation: (playerId: string, evalData: MetricEvaluation) => void;
  existingEvaluation?: MetricEvaluation;
  allEvaluations: Record<string, MetricEvaluation>;
  supabaseStatus?: SupabaseSyncStatus;
  onOpenSupabaseModal?: () => void;
}

export function EvaluacionesView({
  players,
  selectedPlayerId,
  onSelectPlayer,
  onSaveEvaluation,
  existingEvaluation,
  allEvaluations,
  supabaseStatus,
  onOpenSupabaseModal
}: EvaluacionesViewProps) {
  // Current player object
  const currentPlayer = players.find((p) => p.id === selectedPlayerId) || players[0];

  // Ratings state for the 3 required metrics
  const [tecnica, setTecnica] = useState<number>(existingEvaluation?.tecnica || 0);
  const [tactica, setTactica] = useState<number>(existingEvaluation?.tactica || 0);
  const [condicional, setCondicional] = useState<number>(existingEvaluation?.condicional || 0);
  const [observaciones, setObservaciones] = useState<string>(existingEvaluation?.observaciones || '');

  // UI state for save feedback
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state when selected player or existing evaluation changes
  useEffect(() => {
    if (existingEvaluation) {
      setTecnica(existingEvaluation.tecnica);
      setTactica(existingEvaluation.tactica);
      setCondicional(existingEvaluation.condicional);
      setObservaciones(existingEvaluation.observaciones || '');
    } else {
      // Default to 0 (unrated) or blank
      setTecnica(0);
      setTactica(0);
      setCondicional(0);
      setObservaciones('');
    }
    setValidationError(null);
  }, [selectedPlayerId, existingEvaluation]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (tecnica === 0 || tactica === 0 || condicional === 0) {
      setValidationError('Por favor califica las 3 métricas (Técnica, Táctica y Condicional) del 1 al 5 antes de guardar.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    onSaveEvaluation(currentPlayer.id, {
      tecnica,
      tactica,
      condicional,
      fecha: todayStr,
      observaciones: observaciones.trim()
    });

    setValidationError(null);
    setShowSuccessToast(true);

    // Auto dismiss toast after 4s
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const handleReset = () => {
    setTecnica(0);
    setTactica(0);
    setCondicional(0);
    setObservaciones('');
    setValidationError(null);
  };

  const isFormFilled = tecnica > 0 && tactica > 0 && condicional > 0;
  const currentAverage = isFormFilled
    ? ((tecnica + tactica + condicional) / 3).toFixed(1)
    : null;

  return (
    <section id="evaluaciones-view-section" className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Section Header */}
      <div className="bg-white rounded-2xl border-2 border-[#E5252A] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#FEF2F2] text-[#E5252A]">
                <Award size={22} />
              </span>
              <h2
                id="evaluaciones-heading"
                className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight"
              >
                Panel de Evaluaciones Técnicas
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Selecciona a un jugador de la plantilla para registrar su calificación en Técnica, Táctica y Condicional.
            </p>
          </div>

          {currentAverage && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#FEF2F2] border-2 border-[#E5252A] rounded-xl self-start sm:self-auto">
              <Sparkles size={18} className="text-[#E5252A]" />
              <div>
                <span className="text-[10px] font-bold text-[#991B1B] uppercase tracking-wider block">
                  Promedio Actual
                </span>
                <span className="text-base font-black text-slate-900">
                  {currentAverage} / 5.0
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Selector */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <label
            htmlFor="player-select-dropdown"
            className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between"
          >
            <span>Seleccionar Jugador de la Plantilla ({players.length} Jugadores):</span>
            <span className="text-[#E5252A] text-[11px] font-semibold">
              {players.findIndex((p) => p.id === currentPlayer.id) + 1} de {players.length}
            </span>
          </label>

          <div className="relative">
            <select
              id="player-select-dropdown"
              value={currentPlayer.id}
              onChange={(e) => onSelectPlayer(e.target.value)}
              className="w-full appearance-none px-4 py-3.5 pr-10 rounded-xl bg-white border-2 border-[#E5252A] text-slate-900 text-base font-bold shadow-xs focus:outline-none focus:ring-3 focus:ring-[#E5252A]/30 cursor-pointer transition-all"
            >
              {players.map((player) => {
                const isEvaluated = !!allEvaluations[player.id];
                return (
                  <option key={player.id} value={player.id} className="py-2 text-slate-900">
                    Dorsal #{player.dorsal} — {player.nombre} {player.apellidos} ({player.posicion}) {isEvaluated ? '✓ [Evaluado]' : ''}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E5252A]">
              <ArrowRight size={18} className="rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Player Profile Summary Card */}
      <div
        id="selected-player-summary-card"
        className="bg-white rounded-2xl border-2 border-[#E5252A] p-5 sm:p-6 shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Athletic Dorsal Shield */}
            <div className="w-14 h-14 rounded-2xl bg-[#E5252A] text-white font-black text-2xl flex items-center justify-center shadow-sm shrink-0">
              {currentPlayer.dorsal}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#E5252A] uppercase tracking-wider">
                  {currentPlayer.posicion}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-500">
                  Dorsal #{currentPlayer.dorsal}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                {currentPlayer.nombre} {currentPlayer.apellidos}
              </h3>
              
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Calendar size={13} className="text-[#E5252A]" />
                Fecha de Nacimiento: <strong className="text-slate-700 font-semibold">{currentPlayer.fechaNacimiento}</strong>
              </p>
            </div>
          </div>

          {/* Quick info badges */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <div className="px-3 py-1.5 rounded-lg bg-[#FFF5F5] border border-[#E5252A]/30 text-xs text-[#991B1B] font-medium">
              Pie: <strong className="text-slate-800 font-bold">{currentPlayer.pieDominante || 'Derecho'}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#FFF5F5] border border-[#E5252A]/30 text-xs text-[#991B1B] font-medium">
              Origen: <strong className="text-slate-800 font-bold">{currentPlayer.nacionalidad || 'España'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Form with the 3 Required Metrics */}
      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Metric 1: TÉCNICA */}
        <StarRating
          idPrefix="metric-tecnica"
          label="1. TÉCNICA"
          description="Control de balón, pase en corto y largo, remate, conducción y precisión técnica bajo presión."
          value={tecnica}
          onChange={(val) => {
            setTecnica(val);
            setValidationError(null);
          }}
        />

        {/* Metric 2: TÁCTICA */}
        <StarRating
          idPrefix="metric-tactica"
          label="2. TÁCTICA"
          description="Posicionamiento táctico en el campo, visión de juego, toma de decisiones y transición ofensiva/defensiva."
          value={tactica}
          onChange={(val) => {
            setTactica(val);
            setValidationError(null);
          }}
        />

        {/* Metric 3: CONDICIONAL */}
        <StarRating
          idPrefix="metric-condicional"
          label="3. CONDICIONAL"
          description="Resistencia aeróbica/anaeróbica, velocidad punta, aceleración, fuerza en el choque e intensidad de juego."
          value={condicional}
          onChange={(val) => {
            setCondicional(val);
            setValidationError(null);
          }}
        />

        {/* Optional observations */}
        <div className="bg-white rounded-xl border-2 border-[#E5252A] p-4 sm:p-5">
          <label
            htmlFor="eval-notes-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Observaciones del Cuerpo Técnico (Opcional)
          </label>
          <textarea
            id="eval-notes-input"
            rows={2}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Añade comentarios sobre el rendimiento en entrenamientos o partidos recientes..."
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-[#E5252A] focus:outline-none focus:ring-2 focus:ring-[#E5252A]/20 text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div
            id="eval-validation-error"
            className="p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-700 text-sm font-semibold flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            {validationError}
          </div>
        )}

        {/* Success Toast / Notification with Supabase context */}
        {showSuccessToast && (
          <div
            id="eval-success-notification"
            className="p-4 rounded-xl bg-[#FEF2F2] border-2 border-[#E5252A] text-[#991B1B] text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-fade-in"
          >
            <div className="flex items-start sm:items-center gap-2.5">
              <CheckCircle2 size={22} className="text-[#E5252A] shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p>
                  ¡Evaluación de <strong>{currentPlayer.nombre} {currentPlayer.apellidos}</strong> guardada exitosamente!
                </p>
                <p className="text-xs font-medium text-slate-600 mt-0.5 flex items-center gap-1.5">
                  <Database size={13} className={supabaseStatus?.tableReady ? 'text-emerald-600' : 'text-amber-600'} />
                  {supabaseStatus?.tableReady
                    ? 'Sincronizada en Supabase Cloud en tiempo real.'
                    : 'Guardada localmente. Haz clic en "Supabase" arriba para crear la tabla SQL en tu proyecto.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccessToast(false)}
              className="text-xs font-bold text-[#E5252A] hover:text-[#991B1B] underline cursor-pointer self-end sm:self-auto"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Supabase status banner if table is pending */}
        {supabaseStatus && !supabaseStatus.tableReady && (
          <div
            id="supabase-pending-banner"
            className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} className="text-amber-600 shrink-0" />
              <span>
                <strong>Supabase conectado:</strong> Falta crear la tabla <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">evaluaciones</code> en tu panel de Supabase.
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenSupabaseModal}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              Ver SQL Listo
            </button>
          </div>
        )}

        {/* Action Buttons: Guardar Evaluación according to requirements */}
        {/* Requirement: Añade un botón al final que diga "Guardar Evaluación" (con fondo blanco, texto rojo y borde rojo grueso). */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 bg-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Restablecer Puntuaciones</span>
          </button>

          <button
            id="btn-guardar-evaluacion"
            type="submit"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest bg-white text-[#E5252A] border-[3px] border-[#E5252A] hover:bg-[#E5252A] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2.5 active:scale-98"
          >
            <Award size={20} />
            <span>Guardar Evaluación</span>
          </button>
        </div>

      </form>

      {/* Summary of Saved Evaluations for All Players */}
      {Object.keys(allEvaluations).length > 0 && (
        <div className="mt-8 bg-white rounded-2xl border-2 border-[#E5252A] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History size={18} className="text-[#E5252A]" />
              <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                Historial de Evaluaciones ({Object.keys(allEvaluations).length}/10 Jugadores)
              </h4>
            </div>
            <span className="text-xs font-semibold text-[#E5252A]">
              Actualizado
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players
              .filter((p) => allEvaluations[p.id])
              .map((p) => {
                const evalItem = allEvaluations[p.id];
                const avg = ((evalItem.tecnica + evalItem.tactica + evalItem.condicional) / 3).toFixed(1);
                const isCurrent = p.id === currentPlayer.id;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPlayer(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'border-[#E5252A] bg-[#FEF2F2]'
                        : 'border-slate-200 hover:border-[#E5252A] bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#E5252A] text-white text-[10px] font-bold flex items-center justify-center">
                          {p.dorsal}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {p.nombre} {p.apellidos}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1 ml-6.5">
                        Téc: {evalItem.tecnica} • Tác: {evalItem.tactica} • Cond: {evalItem.condicional}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#E5252A] block">
                        ★ {avg}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {evalItem.fecha}
                      </span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}

    </section>
  );
}
