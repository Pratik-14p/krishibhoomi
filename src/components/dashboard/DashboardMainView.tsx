import React from 'react';
import { NewFarmerOnboardingBanner } from './NewFarmerOnboardingBanner';
import { StatCards } from './StatCards';
import { QuickActions } from './QuickActions';
import { ProductionGauge } from './ProductionGauge';
import { CropFieldCard } from './CropFieldCard';
import { MonthlyYieldChart, CropSuitabilityChart, CostRevenueChart } from './ChartsSection';
import { RecentActivity, HarvestSummary } from './RecentActivity';

interface DashboardMainViewProps {
  onNavigateTab: (tabKey: string) => void;
  onOpenUploadModal: (defaultTab?: 'ocr' | 'manual') => void;
  activeSoil?: any;
}

export const DashboardMainView: React.FC<DashboardMainViewProps> = ({
  onNavigateTab,
  onOpenUploadModal,
  activeSoil,
}) => {
  return (
    <div className="space-y-6">
      {/* 0. New Farmer Onboarding Banner if Soil Data is Pending */}
      <NewFarmerOnboardingBanner
        onOpenUploadModal={onOpenUploadModal}
        onQuickNavigate={onNavigateTab}
      />

      {/* 1. Statistic Cards (5 cards matching prompt) */}
      <StatCards onQuickNavigate={onNavigateTab} activeSoil={activeSoil} />

      {/* 2. Quick Actions */}
      <QuickActions
        onOpenUploadModal={onOpenUploadModal}
        onNavigateTab={onNavigateTab}
      />

      {/* 3. Main Grid Row: Production Overview + Monthly Yield Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4">
          <ProductionGauge onNavigateTab={onNavigateTab} onOpenUploadModal={onOpenUploadModal} />
        </div>
        <div className="lg:col-span-8">
          <MonthlyYieldChart onNavigateTab={onNavigateTab} onOpenUploadModal={onOpenUploadModal} />
        </div>
      </div>

      {/* 4. Middle Grid Row: Crop Field Card + Crop Suitability Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5">
          <CropFieldCard
            onMoreDetails={() => onNavigateTab('crop-recommendation')}
            onOpenUploadModal={onOpenUploadModal}
          />
        </div>
        <div className="lg:col-span-7">
          <CropSuitabilityChart onNavigateTab={onNavigateTab} onOpenUploadModal={onOpenUploadModal} />
        </div>
      </div>

      {/* 5. Bottom Grid Row: Task & Advisory Management + Crop Harvest Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <RecentActivity />
        </div>
        <div className="lg:col-span-4">
          <HarvestSummary />
        </div>
      </div>

      {/* 6. Financial Overview: Cost vs Revenue Chart */}
      <CostRevenueChart onNavigateTab={onNavigateTab} onOpenUploadModal={onOpenUploadModal} />
    </div>
  );
};
