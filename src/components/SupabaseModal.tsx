import { useState } from 'react';
import { Database, Copy, Check, ExternalLink, X, AlertTriangle, ShieldCheck, Users, Award, Code2, Phone, Mail } from 'lucide-react';
import {
  SUPABASE_URL,
  SUPABASE_SETUP_SQL,
  SUPABASE_JUGADORES_SQL,
  SUPABASE_ADD_TELEFONO_SQL,
  SUPABASE_ADD_EMAIL_SQL,
  SupabaseSyncStatus
} from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: SupabaseSyncStatus;
  onRetryCheck: () => void;
}

type SqlTab = 'jugadores' | 'evaluaciones' | 'completo' | 'telefono' | 'email';

const EVALUACIONES_ONLY_SQL = `-- 1. Crear tabla de evaluaciones para la app Celta de Vigo
CREATE TABLE IF NOT EXISTS public.evaluaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id TEXT UNIQUE NOT NULL,
  tecnica INTEGER NOT NULL CHECK (tecnica >= 1 AND tecnica <= 5),
  tactica INTEGER NOT NULL CHECK (tactica >= 1 AND tactica <= 5),
  condicional INTEGER NOT NULL CHECK (condicional >= 1 AND condicional <= 5),
  fecha TEXT NOT NULL,
  observaciones TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas para permitir lectura y guardado con clave anónima
DROP POLICY IF EXISTS "Lectura publica evaluaciones" ON public.evaluaciones;
CREATE POLICY "Lectura publica evaluaciones"
  ON public.evaluaciones FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Guardado publico evaluaciones" ON public.evaluaciones;
CREATE POLICY "Guardado publico evaluaciones"
  ON public.evaluaciones FOR ALL
  USING (true)
  WITH CHECK (true);
`;

export function SupabaseModal({ isOpen, onClose, status, onRetryCheck }: SupabaseModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState<SqlTab>('jugadores');

  if (!isOpen) return null;

  const currentSql =
    selectedTab === 'email'
      ? SUPABASE_ADD_EMAIL_SQL
      : selectedTab === 'telefono'
      ? SUPABASE_ADD_TELEFONO_SQL
      : selectedTab === 'jugadores'
      ? SUPABASE_JUGADORES_SQL
      : selectedTab === 'evaluaciones'
      ? EVALUACIONES_ONLY_SQL
      : SUPABASE_SETUP_SQL;

  const handleCopySql = () => {
    navigator.clipboard.writeText(currentSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="supabase-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="supabase-modal-content"
        className="bg-white rounded-2xl border-2 border-[#E5252A] shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          id="btn-close-supabase-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
          aria-label="Cerrar ventana"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-[#E5252A]/30 flex items-center justify-center text-[#E5252A]">
            <Database size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              Conexión con Supabase
            </h3>
            <p className="text-xs text-slate-500">
              Almacenamiento persistente en la nube en tiempo real
            </p>
          </div>
        </div>

        {/* Status Box */}
        <div
          className={`p-4 rounded-xl border mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            status.tableReady
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {status.tableReady ? (
              <ShieldCheck size={22} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-sm font-bold">
                {status.tableReady
                  ? 'Base de datos Supabase Activa y Conectada'
                  : 'Tabla "evaluaciones" pendiente de crear en Supabase'}
              </div>
              <p className="text-xs mt-0.5 opacity-90">
                {status.tableReady
                  ? 'Las evaluaciones se guardan y sincronizan automáticamente en tiempo real en la nube.'
                  : 'Copia el script SQL que aparece abajo y ejecútalo en el SQL Editor de tu panel de Supabase.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRetryCheck}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
          >
            Verificar Estado
          </button>
        </div>

        {/* Project Details */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mb-4 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Servidor Supabase:</span>
            <span className="font-mono text-slate-800 font-semibold truncate max-w-[280px]">
              {SUPABASE_URL}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Tabla Destino:</span>
            <span className="font-mono text-[#E5252A] font-bold">public.evaluaciones</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Autenticación:</span>
            <span className="font-semibold text-slate-700">Anon Public Key configurada</span>
          </div>
        </div>

        {/* SQL Script Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-3">
          <button
            type="button"
            onClick={() => setSelectedTab('email')}
            className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'email'
                ? 'bg-white text-[#E5252A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail size={13} />
            <span>Añadir Email</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('telefono')}
            className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'telefono'
                ? 'bg-white text-[#E5252A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone size={13} />
            <span>Añadir Teléfono</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('jugadores')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'jugadores'
                ? 'bg-white text-[#E5252A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={13} />
            <span>1. Jugadores</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('evaluaciones')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'evaluaciones'
                ? 'bg-white text-[#E5252A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award size={13} />
            <span>2. Evaluaciones</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('completo')}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'completo'
                ? 'bg-white text-[#E5252A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 size={13} />
            <span>Completo</span>
          </button>
        </div>

        {/* SQL Script Box */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {selectedTab === 'email'
                ? 'SQL: ALTER TABLE public.jugadores ADD COLUMN email'
                : selectedTab === 'telefono'
                ? 'SQL: ALTER TABLE public.jugadores ADD COLUMN telefono'
                : selectedTab === 'jugadores'
                ? 'SQL: Tabla public.jugadores + 10 Jugadores (con Teléfono y Email)'
                : selectedTab === 'evaluaciones'
                ? 'SQL: Tabla public.evaluaciones'
                : 'SQL: Script Completo (Jugadores + Evaluaciones)'}
            </span>
            <button
              type="button"
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#E5252A] text-white hover:bg-[#C51D22] transition-all cursor-pointer shadow-xs"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? '¡Copiado!' : 'Copiar SQL'}</span>
            </button>
          </div>

          <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-auto border border-slate-800 select-all leading-relaxed max-h-56 sm:max-h-64">
            {currentSql}
          </pre>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#E5252A] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ir al panel de Supabase (SQL Editor)</span>
            <ExternalLink size={13} />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
