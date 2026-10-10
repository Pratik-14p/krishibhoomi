import React from 'react';
import { UploadCloud, TestTube, Sprout, Calculator, ArrowRight, Compass, Layers } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface QuickActionsProps {
  onOpenUploadModal: () => void;
  onNavigateTab: (tabKey: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenUploadModal,
  onNavigateTab,
}) => {
  const { t } = useI18n();

  const actions = [
    {
      id: 'upload',
      title: t('soil.uploadReport'),
      description: 'Import Soil Health Card or lab metrics',
      icon: UploadCloud,
      color: '#2E7D32',
      bg: '#E8F5E9',
      border: '#C8E6C9',
      action: onOpenUploadModal,
    },
    {
      id: 'analyze',
      title: t('soil.analysis'),
      description: 'Check N-P-K balances & pH health',
      icon: TestTube,
      color: '#1565C0',
      bg: '#E3F2FD',
      border: '#BBDEFB',
      action: () => onNavigateTab('soil-analysis'),
    },
    {
      id: 'crop',
      title: t('crop.recommendation'),
      description: 'Find highest-yielding crop matches',
      icon: Sprout,
      color: '#2E7D32',
      bg: '#F1F8E9',
      border: '#DCEDC8',
      action: () => onNavigateTab('crop-recommendation'),
    },
    {
      id: 'profit',
      title: t('crop.viewProfit'),
      description: 'Simulate farm inputs vs gross returns',
      icon: Calculator,
      color: '#7B1FA2',
      bg: '#F3E5F5',
      border: '#E1BEE7',
      action: () => onNavigateTab('profit'),
    },
    {
      id: 'scenarios',
      title: t('nav.scenarioSimulator'),
      description: 'Compare multi-crop profit & risk',
      icon: Layers,
      color: '#E65100',
      bg: '#FFF3E0',
      border: '#FFE0B2',
      action: () => onNavigateTab('scenarios'),
    },
    {
      id: 'strategy',
      title: t('nav.personalizedStrategy'),
      description: 'AI-synthesized seasonal action plan',
      icon: Compass,
      color: '#00695C',
      bg: '#E0F2F1',
      border: '#B2DFDB',
      action: () => onNavigateTab('strategy'),
    },
  ];

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-base text-[#37474F]">{t('dashboard.quickActions')}</h3>
          <p className="text-xs text-[#37474F]/70">Execute essential software analytics in one click</p>
        </div>
        <span className="text-[11px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
          AI Accelerated
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              id={`quick-action-${item.id}`}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E0E0E0] hover:border-[#A5D6A7] hover:bg-[#F7FBF7] transition-all text-left group cursor-pointer shadow-2xs hover:shadow-xs"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#37474F] group-hover:text-[#2E7D32] transition-colors truncate">
                    {item.title}
                  </h4>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#2E7D32] group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-[#37474F]/70 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
