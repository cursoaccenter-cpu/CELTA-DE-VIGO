import { useState, useEffect, type FormEvent } from 'react';
import { X, Save, User, Hash, Calendar, Shield, Footprints, Globe, Compass, AlertCircle, Phone, Mail } from 'lucide-react';
import { Player } from '../types';

interface PlayerEditModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPlayer: Player) => Promise<void>;
}

export function PlayerEditModal({
  player,
  isOpen,
  onClose,
  onSave,
}: PlayerEditModalProps) {
  const [formData, setFormData] = useState<Partial<Player>>({
    nombre: '',
    apellidos: '',
    dorsal: 1,
    fechaNacimiento: '',
    posicion: 'Delantero',
    pieDominante: 'Derecho',
    nacionalidad: 'España',
    lugarNacimiento: '',
    telefono: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (player) {
      setFormData({
        id: player.id,
        nombre: player.nombre,
        apellidos: player.apellidos,
        dorsal: player.dorsal,
        fechaNacimiento: player.fechaNacimiento,
        posicion: player.posicion,
        pieDominante: player.pieDominante || 'Derecho',
        nacionalidad: player.nacionalidad || 'España',
        lugarNacimiento: player.lugarNacimiento || '',
        telefono: player.telefono || '',
        email: player.email || '',
      });
      setErrorMsg(null);
    }
  }, [player, isOpen]);

  if (!isOpen || !player) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nombre?.trim()) {
      setErrorMsg('El nombre del jugador es obligatorio');
      return;
    }
    if (!formData.dorsal || formData.dorsal < 1 || formData.dorsal > 99) {
      setErrorMsg('El dorsal debe ser un número entre 1 y 99');
      return;
    }
    if (!formData.fechaNacimiento?.trim()) {
      setErrorMsg('La fecha de nacimiento es requerida');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const updated: Player = {
        id: player.id,
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos ? formData.apellidos.trim() : '',
        dorsal: Number(formData.dorsal),
        fechaNacimiento: formData.fechaNacimiento.trim(),
        posicion: (formData.posicion as Player['posicion']) || 'Delantero',
        pieDominante: formData.pieDominante?.trim() || 'Derecho',
        nacionalidad: formData.nacionalidad?.trim() || 'España',
        lugarNacimiento: formData.lugarNacimiento?.trim() || '',
        telefono: formData.telefono?.trim() || '',
        email: formData.email?.trim() || '',
      };
      await onSave(updated);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar los cambios';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="player-edit-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        id="player-edit-modal-content"
        className="bg-white rounded-2xl border-2 border-[#E5252A] shadow-2xl max-w-lg w-full p-6 relative max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          id="btn-close-edit-modal"
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-[#E5252A]/40 flex items-center justify-center text-[#E5252A] font-black">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Editar Jugador
            </h3>
            <p className="text-xs text-slate-500">
              Modifica los datos oficiales de {player.nombre} {player.apellidos}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          {/* Nombre y Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-nombre" className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <User size={13} className="text-[#E5252A]" />
                Nombre <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-nombre"
                type="text"
                required
                value={formData.nombre || ''}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#E5252A] focus:outline-none focus:ring-1 focus:ring-[#E5252A] text-slate-900 font-medium"
                placeholder="Ej: Iago"
              />
            </div>

            <div>
              <label htmlFor="edit-apellidos" className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <User size={13} className="text-[#E5252A]" />
                Apellidos <span className="text-slate-400 font-normal">(Opcional)</span>
              </label>
              <input
                id="edit-apellidos"
                type="text"
                value={formData.apellidos || ''}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#E5252A] focus:outline-none focus:ring-1 focus:ring-[#E5252A] text-slate-900 font-medium"
                placeholder="Ej: Aspas Juncal"
              />
            </div>
          </div>

          {/* Dorsal y Posición */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-dorsal" className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Hash size={13} className="text-[#E5252A]" />
                Dorsal Oficial <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-dorsal"
                type="number"
                required
                min={1}
                max={99}
                value={formData.dorsal ?? ''}
                onChange={(e) => setFormData({ ...formData, dorsal: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#E5252A] focus:outline-none focus:ring-1 focus:ring-[#E5252A] text-slate-900 font-bold"
                placeholder="10"
              />
            </div>

            <div>
              <label htmlFor="edit-posicion" className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Shield size={13} className="text-[#E5252A]" />
                Posición en el Campo <span className="text-rose-500">*</span>
              </label>
              <select
                id="edit-posicion"
                value={formData.posicion || 'Delantero'}
                onChange={(e) =>
                  setFormData({ ...formData, posicion: e.target.value as Player['posicion'] })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#E5252A] focus:outline-none focus:ring-1 focus:ring-[#E5252A] text-slate-900 font-medium bg-white"
              >
                <option value="Portero">Portero</option>
                <option value="Defensa">Defensa</option>
                <option value="Centrocampista">Centrocampista</option>
                <option value="Delantero">Delantero</option>
              </select>
            </div>
          </div>

          {/* Fecha de Nacimiento & Pie Dominante */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-fecha-nac" className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Calendar size={13} className="text-[#E5252A]" />
                Fecha Nacimiento <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-fecha-nac"
                type="text"
                required
                value={formData.fechaNacimiento || ''}
                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#E5252A] focus:outline-none focus:ring-1 focus:ring-[#E5252A] text-slate-900 font-medium"
                placeholder="DD/MM/AAAA (ej: 01/08/1987)"
              />
            </div>

            <div>
              <label htmlFor="edit-pie" className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Footprints size={13} className="text-[#E5252A]" />
                Pie Dominante
              </label>
              <select
                id="edit-pie"
                value={formData.pieDominante || 'Derecho'}
                onChange={(e) => setFormData({ ...formData, pieDominante: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#E5252A] focus:outline-none focus:ring-1 focus:ring-[#E5252A] text-slate-900 font-medium bg-white"
              >
                <option value="Derecho">Derecho</option>
                <option value="Izquierdo">Izquierdo</option>
                <option value="Ambidiestro">Ambidiestro</option>
              </select>
            </div>
          </div>

          {/* Nacionalidad & Lugar de Nacimiento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-nacionalidad" className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Globe size={13} className="text-[#E5252A]" />
                Nacionalidad
              </label>
              <input
                id="edit-nacionalidad"
                type="text"
                value={formData.nacionalidad || ''}
                onChange={(e) => setFormData({ ...formData, nacionalidad: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#E5252A] focus:outline-none focus:ring-1 focus:ring-[#E5252A] text-slate-900 font-medium"
                placeholder="Ej: España"
              />
            </div>

            <div>
              <label htmlFor="edit-lugar-nac" className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Compass size={13} className="text-[#E5252A]" />
                Lugar de Nacimiento
              </label>
              <input
                id="edit-lugar-nac"
                type="text"
                value={formData.lugarNacimiento || ''}
                onChange={(e) => setFormData({ ...formData, lugarNacimiento: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#E5252A] focus:outline-none focus:ring-1 focus:ring-[#E5252A] text-slate-900 font-medium"
                placeholder="Ej: Moaña, Pontevedra"
              />
            </div>
          </div>

          {/* Teléfono & Correo Electrónico */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-telefono" className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Phone size={13} className="text-[#E5252A]" />
                Número de Teléfono
              </label>
              <input
                id="edit-telefono"
                type="tel"
                value={formData.telefono || ''}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#E5252A] focus:outline-none focus:ring-1 focus:ring-[#E5252A] text-slate-900 font-medium"
                placeholder="+34 600 00 00 00"
              />
            </div>

            <div>
              <label htmlFor="edit-email" className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Mail size={13} className="text-[#E5252A]" />
                Correo Electrónico
              </label>
              <input
                id="edit-email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#E5252A] focus:outline-none focus:ring-1 focus:ring-[#E5252A] text-slate-900 font-medium"
                placeholder="jugador@rccelta.es"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              id="btn-cancel-edit"
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              id="btn-save-edit"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-[#E5252A] border-2 border-[#E5252A] hover:bg-[#E5252A] hover:text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save size={15} />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
