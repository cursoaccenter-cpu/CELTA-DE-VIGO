import { useState, useMemo } from 'react';
import { Search, Shield, Filter, Users, Sparkles, UserPlus } from 'lucide-react';
import { Player, MetricEvaluation } from '../types';
import { PlayerCard } from './PlayerCard';

interface PlantillaViewProps {
  players: Player[];
  evaluations: Record<string, MetricEvaluation>;
  onSelectPlayerToEvaluate: (player: Player) => void;
  onViewPlayer: (player: Player) => void;
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (player: Player) => void;
  onAddPlayer?: () => void;
}

export function PlantillaView({
  players,
  evaluations,
  onSelectPlayerToEvaluate,
  onViewPlayer,
  onEditPlayer,
  onDeletePlayer,
  onAddPlayer,
}: PlantillaViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('todos');

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch =
        player.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.dorsal.toString().includes(searchTerm);

      const matchesPosition =
        selectedPosition === 'todos' || player.posicion === selectedPosition;

      return matchesSearch && matchesPosition;
    });
  }, [players, searchTerm, selectedPosition]);

  const positions = ['todos', 'Portero', 'Defensa', 'Centrocampista', 'Delantero'];
  const evaluatedCount = Object.keys(evaluations).length;

  return (
    <section id="plantilla-view-section" className="space-y-6">
      
      {/* Top Banner / Summary */}
      <div className="bg-white rounded-2xl border-2 border-[#E5252A] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#FEF2F2] text-[#E5252A]">
                <Users size={20} />
              </span>
              <h2
                id="plantilla-heading"
                className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight"
              >
                Primer Equipo • Plantilla Oficial
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Gestión de jugadores del R.C. Celta de Vigo. Puedes ver la ficha completa, editar datos o dar de baja a futbolistas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {onAddPlayer && (
              <button
                id="btn-add-new-player"
                type="button"
                onClick={onAddPlayer}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#E5252A] border-2 border-[#E5252A] hover:bg-[#E5252A] hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
              >
                <UserPlus size={15} />
                <span>Nuevo Jugador</span>
              </button>
            )}

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF5F5] border border-[#E5252A]/40">
              <Shield size={16} className="text-[#E5252A]" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                  Total Plantilla
                </span>
                <span className="text-sm font-black text-slate-900">
                  {players.length} Jugadores
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF5F5] border border-[#E5252A]/40">
              <Sparkles size={16} className="text-[#E5252A]" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                  Evaluados
                </span>
                <span className="text-sm font-black text-[#E5252A]">
                  {evaluatedCount} / {players.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Position Filters */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E5252A]"
            />
            <input
              id="search-player-input"
              type="text"
              placeholder="Buscar por nombre, apellido o dorsal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border-2 border-[#E5252A]/60 focus:border-[#E5252A] focus:outline-none focus:ring-2 focus:ring-[#E5252A]/20 text-slate-800 placeholder-slate-400 font-medium transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Position Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Filter size={15} className="text-slate-400 shrink-0 hidden lg:block" />
            {positions.map((pos) => (
              <button
                key={pos}
                id={`filter-pos-${pos.toLowerCase()}`}
                type="button"
                onClick={() => setSelectedPosition(pos)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedPosition === pos
                    ? 'bg-[#E5252A] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-[#E5252A] border border-slate-200 hover:border-[#E5252A]'
                }`}
              >
                {pos === 'todos' ? 'Todos' : pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Players */}
      {filteredPlayers.length > 0 ? (
        <div
          id="players-cards-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              evaluation={evaluations[player.id]}
              onEvaluateClick={onSelectPlayerToEvaluate}
              onViewClick={onViewPlayer}
              onEditClick={onEditPlayer}
              onDeleteClick={onDeletePlayer}
            />
          ))}
        </div>
      ) : (
        <div
          id="empty-players-notice"
          className="bg-white rounded-2xl border-2 border-dashed border-[#E5252A]/60 p-12 text-center"
        >
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#E5252A]">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No se encontraron jugadores</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            No hay jugadores que coincidan con la búsqueda &quot;{searchTerm}&quot; y la posición seleccionada.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedPosition('todos');
            }}
            className="mt-4 px-4 py-2 bg-white text-[#E5252A] border-2 border-[#E5252A] font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#E5252A] hover:text-white transition-all cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

    </section>
  );
}

