import { useState, useEffect, useCallback } from 'react';
import { TabType, MetricEvaluation, Player } from './types';
import { PLAYERS } from './data/players';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { PlantillaView } from './components/PlantillaView';
import { EvaluacionesView } from './components/EvaluacionesView';
import { SupabaseModal } from './components/SupabaseModal';
import { PlayerDetailsModal } from './components/PlayerDetailsModal';
import { PlayerEditModal } from './components/PlayerEditModal';
import { PlayerDeleteModal } from './components/PlayerDeleteModal';
import {
  checkSupabaseStatus,
  fetchEvaluationsFromSupabase,
  fetchPlayersFromSupabase,
  upsertPlayerInSupabase,
  deletePlayerInSupabase,
  saveEvaluationToSupabase,
  supabase,
  SupabaseSyncStatus
} from './lib/supabase';

const STORAGE_KEY = 'celta_vigo_evaluations_v1';
const PLAYERS_STORAGE_KEY = 'celta_vigo_players_v1';

// Initial pre-filled evaluation for Captain Iago Aspas so the interface feels populated
const INITIAL_EVALUATIONS: Record<string, MetricEvaluation> = {
  'aspas-10': {
    tecnica: 5,
    tactica: 5,
    condicional: 4,
    fecha: '08/09/2026',
    observaciones: 'Capitán y referente ofensivo. Definición sobresaliente y lectura táctica superior.'
  },
  'beltran-8': {
    tecnica: 4,
    tactica: 4,
    condicional: 5,
    fecha: '08/09/2026',
    observaciones: 'Gran despliegue físico en el mediocampo y recuperación constante de balones.'
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('plantilla');
  
  // Players state initialized with localStorage fallback or official default players
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem(PLAYERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => {
            const defaultMatch = PLAYERS.find((dp) => dp.id === p.id);
            return {
              ...p,
              telefono: p.telefono ?? defaultMatch?.telefono ?? '',
              email: p.email ?? defaultMatch?.email ?? '',
            };
          });
        }
      }
    } catch {
      // Fallback
    }
    return PLAYERS;
  });

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('aspas-10');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Player action modals state
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseSyncStatus>({
    connected: true,
    tableReady: false
  });
  
  // Local storage persistence as reliable baseline
  const [evaluations, setEvaluations] = useState<Record<string, MetricEvaluation>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback if local storage is restricted or empty
    }
    return INITIAL_EVALUATIONS;
  });

  // Save players to local storage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
    } catch {
      // ignore
    }
  }, [players]);

  // Verify Supabase connection and fetch existing cloud evaluations and players
  const verifySupabase = useCallback(async () => {
    const status = await checkSupabaseStatus();
    setSupabaseStatus(status);

    // Fetch players from Supabase if table exists
    const cloudPlayers = await fetchPlayersFromSupabase();
    if (cloudPlayers && cloudPlayers.length > 0) {
      setPlayers((prev) => {
        return cloudPlayers.map((cp) => {
          const local = prev.find((lp) => lp.id === cp.id);
          if (!local) return cp;
          return {
            ...cp,
            telefono: cp.telefono || local.telefono || '',
            email: cp.email || local.email || '',
          };
        });
      });
    }

    if (status.tableReady) {
      const res = await fetchEvaluationsFromSupabase();
      if (res.evaluations && Object.keys(res.evaluations).length > 0) {
        setEvaluations((prev) => ({
          ...prev,
          ...res.evaluations
        }));
      }
    }
  }, []);

  // Check Supabase on mount and listen to realtime changes if table exists
  useEffect(() => {
    verifySupabase();

    // Supabase realtime channel for evaluations
    const evalChannel = supabase
      .channel('public-evaluaciones-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'evaluaciones' },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'player_id' in payload.new) {
            const row = payload.new as {
              player_id: string;
              tecnica: number;
              tactica: number;
              condicional: number;
              fecha: string;
              observaciones?: string;
            };
            setEvaluations((prev) => ({
              ...prev,
              [row.player_id]: {
                tecnica: row.tecnica,
                tactica: row.tactica,
                condicional: row.condicional,
                fecha: row.fecha,
                observaciones: row.observaciones || ''
              }
            }));
          }
        }
      )
      .subscribe();

    // Supabase realtime channel for players
    const playersChannel = supabase
      .channel('public-jugadores-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jugadores' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as any;
            if (!row || !row.id) return;
            const updatedPlayer: Player = {
              id: row.id,
              nombre: row.nombre,
              apellidos: row.apellidos,
              dorsal: row.dorsal,
              fechaNacimiento: row.fecha_nacimiento,
              posicion: row.posicion,
              pieDominante: row.pie_dominante,
              nacionalidad: row.nacionalidad,
              lugarNacimiento: row.lugar_nacimiento,
              telefono: row.telefono || '',
              email: row.email || '',
            };
            setPlayers((prev) => {
              const idx = prev.findIndex((p) => p.id === updatedPlayer.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = updatedPlayer;
                return next;
              }
              return [...prev, updatedPlayer];
            });
          } else if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as any;
            if (oldRow && oldRow.id) {
              setPlayers((prev) => prev.filter((p) => p.id !== oldRow.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(evalChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [verifySupabase]);

  // Save to localStorage whenever evaluations change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
    } catch {
      // Storage quota or iframe permission fallback
    }
  }, [evaluations]);

  const handleSaveEvaluation = async (playerId: string, evalData: MetricEvaluation) => {
    // 1. Instant local update (optimistic UI)
    setEvaluations((prev) => ({
      ...prev,
      [playerId]: evalData
    }));

    // 2. Persist to Supabase cloud
    const result = await saveEvaluationToSupabase(playerId, evalData);
    if (result.success) {
      setSupabaseStatus((prev) => ({
        ...prev,
        tableReady: true,
        lastSync: new Date().toLocaleTimeString(),
        errorMessage: undefined
      }));
    } else {
      setSupabaseStatus((prev) => ({
        ...prev,
        tableReady: result.tableReady,
        errorMessage: result.error
      }));
    }
  };

  const handleSelectPlayerToEvaluate = (player: Player) => {
    setSelectedPlayerId(player.id);
    setActiveTab('evaluaciones');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View player handler
  const handleViewPlayer = (player: Player) => {
    setViewingPlayer(player);
    setIsViewModalOpen(true);
  };

  // Edit player handler
  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsEditModalOpen(true);
  };

  // Save edited or created player
  const handleSavePlayer = async (player: Player) => {
    // 1. Local update & immediate persistence to localStorage
    let nextPlayers: Player[] = [];
    setPlayers((prev) => {
      const idx = prev.findIndex((p) => p.id === player.id);
      if (idx >= 0) {
        nextPlayers = [...prev];
        nextPlayers[idx] = player;
      } else {
        nextPlayers = [...prev, player];
      }
      try {
        localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(nextPlayers));
      } catch {
        // ignore
      }
      return nextPlayers;
    });

    if (viewingPlayer?.id === player.id) {
      setViewingPlayer(player);
    }

    // 2. Cloud update in Supabase
    await upsertPlayerInSupabase(player);
  };

  // Add new player handler
  const handleAddNewPlayer = () => {
    const newId = `celta-${Date.now()}`;
    const nextDorsal = Math.max(...players.map((p) => p.dorsal), 0) + 1;
    const blankPlayer: Player = {
      id: newId,
      nombre: '',
      apellidos: '',
      dorsal: nextDorsal <= 99 ? nextDorsal : 1,
      fechaNacimiento: '01/01/2000',
      posicion: 'Centrocampista',
      pieDominante: 'Derecho',
      nacionalidad: 'España',
      lugarNacimiento: 'Vigo, Galicia',
    };
    setEditingPlayer(blankPlayer);
    setIsEditModalOpen(true);
  };

  // Delete player handler
  const handleDeletePlayer = (player: Player) => {
    setDeletingPlayer(player);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete player
  const handleConfirmDeletePlayer = async (player: Player) => {
    // 1. Remove from local players and localStorage
    setPlayers((prev) => {
      const next = prev.filter((p) => p.id !== player.id);
      try {
        localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    setEvaluations((prev) => {
      const next = { ...prev };
      delete next[player.id];
      return next;
    });

    // Reset selected player if needed
    if (selectedPlayerId === player.id) {
      const remaining = players.filter((p) => p.id !== player.id);
      if (remaining.length > 0) {
        setSelectedPlayerId(remaining[0].id);
      }
    }

    // 2. Remove from Supabase
    await deletePlayerInSupabase(player.id);
  };

  const totalEvaluated = Object.keys(evaluations).length;

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#E5252A] selection:text-white">
      {/* Top Header with Supabase integration status */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalPlayers={players.length}
        totalEvaluations={totalEvaluated}
        supabaseStatus={supabaseStatus}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Secondary Mobile Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalPlayers={players.length}
        totalEvaluations={totalEvaluated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16 md:mb-8">
        {activeTab === 'plantilla' ? (
          <PlantillaView
            players={players}
            evaluations={evaluations}
            onSelectPlayerToEvaluate={handleSelectPlayerToEvaluate}
            onViewPlayer={handleViewPlayer}
            onEditPlayer={handleEditPlayer}
            onDeletePlayer={handleDeletePlayer}
            onAddPlayer={handleAddNewPlayer}
          />
        ) : (
          <EvaluacionesView
            players={players}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={setSelectedPlayerId}
            onSaveEvaluation={handleSaveEvaluation}
            existingEvaluation={evaluations[selectedPlayerId]}
            allEvaluations={evaluations}
            supabaseStatus={supabaseStatus}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          />
        )}
      </main>

      {/* Modal: Ver detalles completos del jugador */}
      <PlayerDetailsModal
        player={viewingPlayer}
        evaluation={viewingPlayer ? evaluations[viewingPlayer.id] : undefined}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={(p) => {
          setIsViewModalOpen(false);
          handleEditPlayer(p);
        }}
        onDelete={(p) => {
          setIsViewModalOpen(false);
          handleDeletePlayer(p);
        }}
        onEvaluate={(p) => {
          setIsViewModalOpen(false);
          handleSelectPlayerToEvaluate(p);
        }}
      />

      {/* Modal: Editar o Crear jugador */}
      <PlayerEditModal
        player={editingPlayer}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSavePlayer}
      />

      {/* Modal: Confirmar Borrado de jugador */}
      <PlayerDeleteModal
        player={deletingPlayer}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDeletePlayer}
      />

      {/* Supabase Status & SQL Setup Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        status={supabaseStatus}
        onRetryCheck={verifySupabase}
      />

      {/* Footer with Athletic Celta de Vigo Identity */}
      <footer id="main-footer" className="bg-white border-t-2 border-[#E5252A] py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 text-slate-800 font-extrabold text-sm uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5252A]"></span>
            <span>REAL CLUB CELTA DE VIGO</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5252A]"></span>
          </div>
          <p className="text-slate-400">
            Estadio Abanca-Balaídos • Vigo, Galicia • Afouteza e Corazón
          </p>
          <p className="text-[11px] text-[#E5252A] font-semibold">
            Plantilla Oficial • Sincronización en la Nube con Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}
