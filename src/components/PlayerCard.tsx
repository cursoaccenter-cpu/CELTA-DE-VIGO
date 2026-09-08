import { Calendar, User, Hash, Star, Award, ChevronRight, Eye, Edit3, Trash2, Phone, Mail } from 'lucide-react';
import { Player, MetricEvaluation } from '../types';

interface PlayerCardProps {
  key?: string;
  player: Player;
  onEvaluateClick: (player: Player) => void;
  onViewClick: (player: Player) => void;
  onEditClick: (player: Player) => void;
  onDeleteClick: (player: Player) => void;
  evaluation?: MetricEvaluation;
}

export function PlayerCard({
  player,
  onEvaluateClick,
  onViewClick,
  onEditClick,
  onDeleteClick,
  evaluation,
}: PlayerCardProps) {
  const averageScore = evaluation
    ? ((evaluation.tecnica + evaluation.tactica + evaluation.condicional) / 3).toFixed(1)
    : null;

  return (
    <div
      id={`player-card-${player.id}`}
      className="group relative bg-white rounded-2xl border-2 border-[#E5252A] p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
    >
      {/* Top Bar inside Card: Dorsal Badge & Position */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {/* Dorsal Jersey Shield */}
          <div
            id={`player-dorsal-badge-${player.id}`}
            className="w-10 h-10 rounded-xl bg-[#E5252A] text-white font-black text-lg flex items-center justify-center shadow-xs"
            title={`Dorsal número ${player.dorsal}`}
          >
            {player.dorsal}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Dorsal Oficial
            </span>
            <p className="text-xs font-semibold text-[#991B1B]">
              N° {player.dorsal}
            </p>
          </div>
        </div>

        {/* Position Badge */}
        <span
          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-[#E5252A]/30 bg-[#FFF5F5] text-[#991B1B]"
        >
          {player.posicion}
        </span>
      </div>

      {/* Main Content Area: Nombre y Apellidos clearly separated */}
      <div className="py-4 space-y-3">
        {/* Nombre & Apellidos */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <User size={12} className="text-[#E5252A]" />
            Jugador
          </span>
          <div className="mt-0.5">
            <h3
              id={`player-name-${player.id}`}
              className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight"
            >
              {player.nombre} {player.apellidos ? player.apellidos : ''}
            </h3>
          </div>
        </div>

        {/* Organized Info Grid: Nombre, Apellidos, Dorsal, Fecha de Nacimiento */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 bg-[#FFF9F9] rounded-xl p-3 border border-[#E5252A]/20">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <User size={10} className="text-[#E5252A]" />
              Nombre
            </span>
            <p className="text-xs font-bold text-[#E5252A] mt-0.5 truncate" title={player.nombre}>
              {player.nombre}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <User size={10} className="text-[#E5252A]" />
              Apellidos
            </span>
            <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate" title={player.apellidos || '—'}>
              {player.apellidos || '—'}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Hash size={10} className="text-[#E5252A]" />
              Dorsal
            </span>
            <p className="text-xs font-bold text-[#E5252A] mt-0.5">
              #{player.dorsal}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar size={10} className="text-[#E5252A]" />
              Fecha Nac.
            </span>
            <p
              id={`player-birth-${player.id}`}
              className="text-xs font-semibold text-slate-800 mt-0.5"
            >
              {player.fechaNacimiento}
            </p>
          </div>

          {player.telefono && (
            <div className="col-span-2 pt-1 border-t border-slate-100/80 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Phone size={10} className="text-[#E5252A]" />
                Teléfono
              </span>
              <a
                href={`tel:${player.telefono.replace(/\s+/g, '')}`}
                className="text-xs font-bold text-[#E5252A] hover:underline"
                onClick={(e) => e.stopPropagation()}
                title="Llamar"
              >
                {player.telefono}
              </a>
            </div>
          )}

          {player.email && (
            <div className="col-span-2 pt-1 border-t border-slate-100/80 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Mail size={10} className="text-[#E5252A]" />
                Email
              </span>
              <a
                href={`mailto:${player.email}`}
                className="text-xs font-semibold text-[#E5252A] hover:underline truncate max-w-[170px]"
                onClick={(e) => e.stopPropagation()}
                title={player.email}
              >
                {player.email}
              </a>
            </div>
          )}
        </div>

        {/* Status of Evaluation if already evaluated */}
        {evaluation && averageScore && (
          <div className="bg-[#FEF2F2] border border-[#E5252A]/40 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Award size={16} className="text-[#E5252A]" />
              <span className="text-xs font-bold text-[#991B1B]">Evaluación Registrada</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-[#E5252A] text-[#E5252A]" />
              <span className="text-xs font-black text-slate-900">{averageScore}/5</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons: Ver, Editar, Borrar & Evaluar */}
      <div className="pt-2 space-y-2 border-t border-slate-100">
        {/* Row with Ver, Editar, Borrar */}
        <div className="grid grid-cols-3 gap-2">
          {/* Botón Ver */}
          <button
            id={`btn-ver-${player.id}`}
            type="button"
            onClick={() => onViewClick(player)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
            title="Ver detalles completos del jugador"
          >
            <Eye size={14} className="text-slate-600" />
            <span>Ver</span>
          </button>

          {/* Botón Editar */}
          <button
            id={`btn-editar-${player.id}`}
            type="button"
            onClick={() => onEditClick(player)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all cursor-pointer"
            title="Editar datos del jugador"
          >
            <Edit3 size={14} className="text-amber-700" />
            <span>Editar</span>
          </button>

          {/* Botón Borrar */}
          <button
            id={`btn-borrar-${player.id}`}
            type="button"
            onClick={() => onDeleteClick(player)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-bold text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
            title="Eliminar jugador de la plantilla"
          >
            <Trash2 size={14} className="text-rose-600" />
            <span>Borrar</span>
          </button>
        </div>

        {/* Botón Evaluar Principal */}
        <button
          id={`btn-evaluar-${player.id}`}
          type="button"
          onClick={() => onEvaluateClick(player)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-[#E5252A] border-2 border-[#E5252A] hover:bg-[#E5252A] hover:text-white transition-all duration-200 cursor-pointer group-hover:border-[#E5252A] shadow-2xs"
        >
          <Award size={15} />
          <span>{evaluation ? 'Modificar Evaluación' : 'Evaluar Jugador'}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

