import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { CostProfitCalculatorModule } from '../components/profit/CostProfitCalculatorModule';
import { UploadSoilModal } from '../components/dashboard/UploadSoilModal';
import { SoilMetrics } from '../types';

export const ProfitCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const cropParam = searchParams.get('crop') || undefined;

  const handleSelectTab = (tabId: string) => {
    if (tabId === 'profit' || tabId === 'profit-calculator') {
      return;
    }
    if (tabId === 'market' || tabId === 'market-analysis') {
      navigate('/market-analysis');
      return;
    }
    if (tabId === 'scenarios' || tabId === 'scenario-simulator') {
      navigate('/scenario-simulator');
      return;
    }
    if (tabId === 'soil-analysis') {
      navigate('/soil-analysis');
      return;
    }
    if (tabId === 'crop-recommendation') {
      navigate('/crop-recommendation');
      return;
    }
    if (tabId === 'fertilizer' || tabId === 'fertilizer-recommendation') {
      navigate('/fertilizer-recommendation');
      return;
    }
    if (tabId === 'pesticides' || tabId === 'pesticide-recommendation') {
      navigate('/pesticide-recommendation');
      return;
    }
    if (tabId === 'yield' || tabId === 'yield-prediction') {
      navigate('/yield-prediction');
      return;
    }
    if (tabId === 'profile') {
      navigate('/profile');
      return;
    }
    navigate(`/dashboard?tab=${tabId}`);
  };

  const handleSoilUploaded = (_newSoil: SoilMetrics) => {
    setUploadModalOpen(false);
    navigate('/soil-analysis');
  };

  return (
    <>
      <DashboardLayout
        activeTab="profit"
        onSelectTab={handleSelectTab}
        onOpenUploadModal={() => setUploadModalOpen(true)}
      >
        <CostProfitCalculatorModule initialCrop={cropParam} />
      </DashboardLayout>

      <UploadSoilModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSoilReportUploaded={handleSoilUploaded}
      />
    </>
  );
};
