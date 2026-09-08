import { X, Calendar, User, Hash, Globe, Compass, Footprints, Award, Star, Edit3, Trash2, Phone, Mail } from 'lucide-react';
import { Player, MetricEvaluation } from '../types';

interface PlayerDetailsModalProps {
  player: Player | null;
  evaluation?: MetricEvaluation;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
  onEvaluate: (player: Player) => void;
}

export function PlayerDetailsModal({
  player,
  evaluation,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onEvaluate,
}: PlayerDetailsModalProps) {
  if (!isOpen || !player) return null;

  const averageScore = evaluation
    ? ((evaluation.tecnica + evaluation.tactica + evaluation.condicional) / 3).toFixed(1)
    : null;

  return (
    <div
      id="player-details-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="player-details-modal-content"
        className="bg-white rounded-2xl border-2 border-[#E5252A] shadow-2xl max-w-lg w-full p-6 relative max-h-[92vh] flex flex-col"
      >
        {/* Close button */}
        <button
          id="btn-close-details-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header with Jersey & Name */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-[#E5252A] text-white flex flex-col items-center justify-center font-black shadow-md shrink-0 border-2 border-white ring-2 ring-[#E5252A]/30">
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90 leading-none">
              Dorsal
            </span>
            <span className="text-2xl leading-none mt-0.5">{player.dorsal}</span>
          </div>

          <div className="min-w-0 flex-1">
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#FFF5F5] text-[#991B1B] border border-[#E5252A]/30 mb-1">
              {player.posicion}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight truncate">
              {player.nombre} {player.apellidos}
            </h3>
            <p className="text-xs text-slate-500 font-medium">Ficha Oficial del Jugador</p>
          </div>
        </div>

        {/* Modal Body: Detailed fields */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-3 bg-[#FFF9F9] rounded-xl p-4 border border-[#E5252A]/20">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <User size={12} className="text-[#E5252A]" />
                Nombre
              </span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{player.nombre}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <User size={12} className="text-[#E5252A]" />
                Apellidos
              </span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{player.apellidos}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Hash size={12} className="text-[#E5252A]" />
                Dorsal
              </span>
              <p className="text-sm font-black text-[#E5252A] mt-0.5">#{player.dorsal}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={12} className="text-[#E5252A]" />
                Fecha de Nacimiento
              </span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{player.fechaNacimiento}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Footprints size={12} className="text-[#E5252A]" />
                Pie Dominante
              </span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {player.pieDominante || 'Derecho'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Globe size={12} className="text-[#E5252A]" />
                Nacionalidad
              </span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {player.nacionalidad || 'España'}
              </p>
            </div>

            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Phone size={12} className="text-[#E5252A]" />
                Teléfono de Contacto
              </span>
              {player.telefono ? (
                <a
                  href={`tel:${player.telefono.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E5252A] hover:underline mt-0.5"
                  title="Llamar al jugador"
                >
                  <Phone size={13} />
                  <span>{player.telefono}</span>
                </a>
              ) : (
                <p className="text-xs text-slate-400 italic mt-0.5">No registrado</p>
              )}
            </div>

            <div className="col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Mail size={12} className="text-[#E5252A]" />
                Correo Electrónico
              </span>
              {player.email ? (
                <a
                  href={`mailto:${player.email}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E5252A] hover:underline mt-0.5 break-all"
                  title="Enviar correo"
                >
                  <Mail size={13} />
                  <span>{player.email}</span>
                </a>
              ) : (
                <p className="text-xs text-slate-400 italic mt-0.5">No registrado</p>
              )}
            </div>

            {player.lugarNacimiento && (
              <div className="col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Compass size={12} className="text-[#E5252A]" />
                  Lugar de Nacimiento
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {player.lugarNacimiento}
                </p>
              </div>
            )}
          </div>

          {/* Performance Evaluation section */}
          <div className="rounded-xl border border-slate-200 p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-[#E5252A]" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Evaluación de Rendimiento
                </h4>
              </div>
              {averageScore && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEF2F2] border border-[#E5252A]/40 text-[#E5252A] font-black text-xs">
                  <Star size={13} className="fill-[#E5252A]" />
                  <span>Media: {averageScore}/5</span>
                </div>
              )}
            </div>

            {evaluation ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Técnica</span>
                    <span className="text-base font-black text-[#E5252A]">{evaluation.tecnica} / 5</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Táctica</span>
                    <span className="text-base font-black text-[#E5252A]">{evaluation.tactica} / 5</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Condicional</span>
                    <span className="text-base font-black text-[#E5252A]">{evaluation.condicional} / 5</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-700">Fecha de evaluación: </span>
                  {evaluation.fecha}
                  {evaluation.observaciones && (
                    <p className="mt-1 text-slate-600 italic">
                      &quot;{evaluation.observaciones}&quot;
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-3 text-xs text-slate-500 bg-slate-50 rounded-lg">
                Este jugador aún no tiene una evaluación registrada.
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons in Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              id="btn-details-modal-edit"
              type="button"
              onClick={() => {
                onClose();
                onEdit(player);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Editar</span>
            </button>

            <button
              id="btn-details-modal-delete"
              type="button"
              onClick={() => {
                onClose();
                onDelete(player);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Borrar</span>
            </button>
          </div>

          <button
            id="btn-details-modal-evaluate"
            type="button"
            onClick={() => {
              onClose();
              onEvaluate(player);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-[#E5252A] border-2 border-[#E5252A] hover:bg-[#E5252A] hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <Award size={14} />
            <span>{evaluation ? 'Modificar Evaluación' : 'Evaluar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
