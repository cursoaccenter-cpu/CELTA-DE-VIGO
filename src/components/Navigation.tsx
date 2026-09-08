import { Users, Award } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  totalPlayers: number;
  totalEvaluations: number;
}

export function Navigation({ activeTab, onTabChange, totalPlayers, totalEvaluations }: NavigationProps) {
  return (
    <>
      {/* Top Tab Bar for Mobile / Tablet */}
      <div id="mobile-top-tabs" className="md:hidden sticky top-20 z-30 bg-white border-b-2 border-[#E5252A] px-4 py-2 shadow-xs">
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          <button
            id="tab-btn-plantilla-top"
            type="button"
            onClick={() => onTabChange('plantilla')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'plantilla'
                ? 'bg-[#E5252A] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-[#E5252A]/40 hover:bg-[#FFF5F5]'
            }`}
          >
            <Users size={18} />
            <span>Plantilla ({totalPlayers})</span>
          </button>

          <button
            id="tab-btn-evaluaciones-top"
            type="button"
            onClick={() => onTabChange('evaluaciones')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'evaluaciones'
                ? 'bg-[#E5252A] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-[#E5252A]/40 hover:bg-[#FFF5F5]'
            }`}
          >
            <Award size={18} />
            <span>Evaluaciones</span>
            {totalEvaluations > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-[#991B1B] text-white text-[10px] flex items-center justify-center">
                {totalEvaluations}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Sticky Navigation Bar for Mobile */}
      <nav
        id="bottom-navigation-bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#E5252A] py-2 px-6 shadow-lg"
        aria-label="Menú inferior de navegación"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            id="tab-btn-plantilla-bottom"
            type="button"
            onClick={() => {
              onTabChange('plantilla');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
              activeTab === 'plantilla'
                ? 'text-[#E5252A] font-extrabold scale-105'
                : 'text-slate-500 hover:text-[#E5252A] font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeTab === 'plantilla' ? 'bg-[#FEF2F2]' : ''}`}>
              <Users size={22} className={activeTab === 'plantilla' ? 'text-[#E5252A]' : 'text-slate-500'} />
            </div>
            <span className="text-xs uppercase tracking-wider">Plantilla</span>
          </button>

          <button
            id="tab-btn-evaluaciones-bottom"
            type="button"
            onClick={() => {
              onTabChange('evaluaciones');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'evaluaciones'
                ? 'text-[#E5252A] font-extrabold scale-105'
                : 'text-slate-500 hover:text-[#E5252A] font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeTab === 'evaluaciones' ? 'bg-[#FEF2F2]' : ''}`}>
              <Award size={22} className={activeTab === 'evaluaciones' ? 'text-[#E5252A]' : 'text-slate-500'} />
            </div>
            <span className="text-xs uppercase tracking-wider">Evaluaciones</span>
            {totalEvaluations > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-[#E5252A] text-white text-[9px] font-bold flex items-center justify-center">
                {totalEvaluations}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
