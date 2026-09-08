import { CeltaLogo } from './CeltaLogo';
import { Shield, Award, Users, Database } from 'lucide-react';
import { TabType } from '../types';
import { SupabaseSyncStatus } from '../lib/supabase';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  totalPlayers: number;
  totalEvaluations: number;
  supabaseStatus: SupabaseSyncStatus;
  onOpenSupabaseModal: () => void;
}

export function Header({
  activeTab,
  onTabChange,
  totalPlayers,
  totalEvaluations,
  supabaseStatus,
  onOpenSupabaseModal,
}: HeaderProps) {
  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white border-b-2 border-[#E5252A] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 sm:gap-4">
            <CeltaLogo size={46} />
            <div>
              <div className="flex items-center gap-2">
                <h1
                  id="app-title"
                  className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 uppercase"
                >
                  CELTA DE VIGO
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-[#FEF2F2] text-[#991B1B] rounded border border-[#E5252A]/40">
                  R.C. CELTA 1923
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 tracking-tight flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5252A]"></span>
                Portal Deportivo • Plantilla & Evaluaciones
              </p>
            </div>
          </div>

          {/* Desktop Navigation & Supabase Cloud Status */}
          <div className="flex items-center gap-3">
            <nav id="desktop-navigation" className="hidden md:flex items-center gap-2" aria-label="Navegación principal">
              <button
                id="tab-btn-plantilla-desktop"
                type="button"
                onClick={() => onTabChange('plantilla')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === 'plantilla'
                    ? 'bg-[#E5252A] text-white shadow-sm ring-2 ring-[#E5252A]/30'
                    : 'bg-white text-slate-700 hover:text-[#E5252A] hover:bg-[#FFF5F5] border border-slate-200'
                }`}
              >
                <Users size={18} />
                <span>Plantilla</span>
                <span
                  className={`ml-1 px-2 py-0.2 rounded-full text-xs font-semibold ${
                    activeTab === 'plantilla'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {totalPlayers}
                </span>
              </button>

              <button
                id="tab-btn-evaluaciones-desktop"
                type="button"
                onClick={() => onTabChange('evaluaciones')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === 'evaluaciones'
                    ? 'bg-[#E5252A] text-white shadow-sm ring-2 ring-[#E5252A]/30'
                    : 'bg-white text-slate-700 hover:text-[#E5252A] hover:bg-[#FFF5F5] border border-slate-200'
                }`}
              >
                <Award size={18} />
                <span>Evaluaciones</span>
                {totalEvaluations > 0 && (
                  <span
                    className={`ml-1 px-2 py-0.2 rounded-full text-xs font-semibold ${
                      activeTab === 'evaluaciones'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FEF2F2] text-[#991B1B]'
                    }`}
                  >
                    {totalEvaluations}
                  </span>
                )}
              </button>
            </nav>

            {/* Supabase Status Trigger Button */}
            <button
              id="btn-supabase-status-badge"
              type="button"
              onClick={onOpenSupabaseModal}
              title="Haz clic para ver el estado de Supabase y el script SQL"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                supabaseStatus.tableReady
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Database size={15} className={supabaseStatus.tableReady ? 'text-emerald-600' : 'text-amber-600'} />
              <span className="hidden sm:inline">Supabase:</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    supabaseStatus.tableReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span>{supabaseStatus.tableReady ? 'Conectado' : 'Configurar'}</span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

