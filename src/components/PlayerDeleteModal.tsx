import { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Player } from '../types';

interface PlayerDeleteModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (player: Player) => Promise<void>;
}

export function PlayerDeleteModal({
  player,
  isOpen,
  onClose,
  onConfirmDelete,
}: PlayerDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !player) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirmDelete(player);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      id="player-delete-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        id="player-delete-modal-content"
        className="bg-white rounded-2xl border-2 border-rose-500 shadow-2xl max-w-md w-full p-6 relative flex flex-col"
      >
        {/* Close Button */}
        <button
          id="btn-close-delete-modal"
          type="button"
          disabled={isDeleting}
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>

        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>

        {/* Header */}
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
          ¿Eliminar jugador de la plantilla?
        </h3>

        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Estás a punto de eliminar a{' '}
          <strong className="text-slate-900">
            {player.nombre} {player.apellidos}
          </strong>{' '}
          (Dorsal #{player.dorsal}, {player.posicion}) del sistema y de la base de datos Supabase.
        </p>

        <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl my-4 text-xs text-rose-800">
          <p className="font-semibold">⚠️ Acción irreversible:</p>
          <p className="mt-0.5 opacity-90">
            También se eliminarán sus evaluaciones de rendimiento asociadas.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            id="btn-cancel-delete"
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Cancelar
          </button>

          <button
            id="btn-confirm-delete"
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Trash2 size={15} />
            <span>{isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
