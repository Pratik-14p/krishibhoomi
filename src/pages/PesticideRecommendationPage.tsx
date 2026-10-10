import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PesticideRecommendationModule } from '../components/pesticide/PesticideRecommendationModule';
import { UploadSoilModal } from '../components/dashboard/UploadSoilModal';
import { SoilMetrics } from '../types';

export const PesticideRecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleSelectTab = (tabId: string) => {
    if (tabId === 'pesticides' || tabId === 'pesticide-recommendation') return;
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
  };

  return (
    <>
      <DashboardLayout
        activeTab="pesticides"
        onSelectTab={handleSelectTab}
        onOpenUploadModal={() => setUploadModalOpen(true)}
      >
        <PesticideRecommendationModule />
      </DashboardLayout>

      <UploadSoilModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSoilReportUploaded={handleSoilUploaded}
      />
    </>
  );
};
