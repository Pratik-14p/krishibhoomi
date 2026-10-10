import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardMainView } from '../components/dashboard/DashboardMainView';
import { SoilAnalysisView } from '../components/modules/SoilAnalysisView';
import { CropRecommendationView } from '../components/modules/CropRecommendationView';
import { FertilizerView } from '../components/modules/FertilizerView';
import { PesticideView } from '../components/modules/PesticideView';
import { YieldPredictionView } from '../components/modules/YieldPredictionView';
import { MarketAnalysisView } from '../components/modules/MarketAnalysisView';
import { CostProfitView } from '../components/modules/CostProfitView';
import { ScenarioSimulatorView } from '../components/modules/ScenarioSimulatorView';
import { PersonalizedStrategyView } from '../components/modules/PersonalizedStrategyView';
import { ReportsHistoryView } from '../components/modules/ReportsHistoryView';
import { ProfileView } from '../components/modules/ProfileView';
import { UploadSoilModal } from '../components/dashboard/UploadSoilModal';
import { SoilMetrics } from '../types';
import { useAuth } from '../context/AuthContext';
import { soilAnalysisService } from '../services/soilAnalysisService';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab') || 'dashboard';
  const currentTab = requestedTab === 'settings' ? 'profile' : requestedTab;

  useEffect(() => {
    if (requestedTab === 'settings') {
      setSearchParams({ tab: 'profile' }, { replace: true });
    }
  }, [requestedTab, setSearchParams]);

  // Synchronize active soil metrics scoped to logged-in user
  const [activeSoil, setActiveSoil] = useState<SoilMetrics>(() => {
    const analysis = soilAnalysisService.getActiveAnalysis(user);
    return analysis.soilMetrics;
  });

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadModalTab, setUploadModalTab] = useState<'ocr' | 'manual'>('ocr');
  const [selectedCropForProfit, setSelectedCropForProfit] = useState(
    user?.preferredCrop?.split('&')[0]?.trim() || ''
  );

  const handleOpenUploadModal = (tab: 'ocr' | 'manual' = 'ocr') => {
    setUploadModalTab(tab);
    setUploadModalOpen(true);
  };

  // When user signs in, switches accounts, or updates profile, re-sync soil diagnostic data
  useEffect(() => {
    const analysis = soilAnalysisService.getActiveAnalysis(user);
    if (analysis?.soilMetrics) {
      setActiveSoil(analysis.soilMetrics);
    }
    if (user?.preferredCrop) {
      const primary = user.preferredCrop.split('&')[0]?.trim();
      if (primary) setSelectedCropForProfit(primary);
    }
  }, [user?.id, user?.soilType, user?.farmArea, user?.location, user?.preferredCrop]);

  // Reactive listener for OCR upload & soil update broadcasts
  useEffect(() => {
    const handleSoilEvent = (e: CustomEvent) => {
      if (e.detail?.soilMetrics) {
        setActiveSoil(e.detail.soilMetrics);
      }
    };
    window.addEventListener('krishibhoomi_soil_updated', handleSoilEvent as EventListener);
    return () => {
      window.removeEventListener('krishibhoomi_soil_updated', handleSoilEvent as EventListener);
    };
  }, []);

  const handleSelectTab = (tabId: string) => {
    setSearchParams({ tab: tabId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSoilUploaded = (newSoil: SoilMetrics) => {
    setActiveSoil(newSoil);
    soilAnalysisService.saveAnalysisFromMetrics(newSoil, user);
    // Switch to soil-analysis to see the newly updated report!
    setSearchParams({ tab: 'soil-analysis' });
  };

  const handleNavigateToProfitWithCrop = (cropName: string) => {
    setSelectedCropForProfit(cropName);
    setSearchParams({ tab: 'profit' });
  };

  const handleNavigateToMarketWithCrop = (cropName: string, location?: string) => {
    const nextParams: Record<string, string> = { tab: 'market', crop: cropName };
    if (location) nextParams.location = location;
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <DashboardLayout
        activeTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenUploadModal={() => handleOpenUploadModal('ocr')}
      >
        {currentTab === 'dashboard' && (
          <DashboardMainView
            onNavigateTab={handleSelectTab}
            onOpenUploadModal={handleOpenUploadModal}
            activeSoil={activeSoil}
          />
        )}

        {(currentTab === 'soil-analysis' || currentTab === 'soil') && (
          <SoilAnalysisView
            currentSoil={activeSoil}
            onOpenUpload={() => handleOpenUploadModal('ocr')}
          />
        )}

        {(currentTab === 'crop-recommendation' || currentTab === 'crop') && (
          <CropRecommendationView
            onSelectCropForProfit={handleNavigateToProfitWithCrop}
            onSelectCropForMarket={handleNavigateToMarketWithCrop}
          />
        )}

        {currentTab === 'fertilizer' && <FertilizerView />}

        {currentTab === 'pesticides' && <PesticideView />}

        {currentTab === 'yield' && <YieldPredictionView />}

        {(currentTab === 'market' || currentTab === 'market-analysis') && <MarketAnalysisView />}

        {(currentTab === 'profit' || currentTab === 'profit-calculator') && (
          <CostProfitView initialCrop={selectedCropForProfit} />
        )}

        {(currentTab === 'scenarios' || currentTab === 'scenario-simulator') && <ScenarioSimulatorView />}

        {(currentTab === 'strategy' || currentTab === 'personalized-strategy') && (
          <PersonalizedStrategyView onNavigateTab={handleSelectTab} />
        )}

        {currentTab === 'reports' && <ReportsHistoryView />}

        {currentTab === 'profile' && <ProfileView />}

      </DashboardLayout>

      {/* Upload Soil Dialog */}
      <UploadSoilModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSoilReportUploaded={handleSoilUploaded}
        initialTab={uploadModalTab}
      />
    </>
  );
};
