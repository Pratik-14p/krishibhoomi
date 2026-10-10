import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { FertilizerRecommendationModule } from '../components/fertilizer/FertilizerRecommendationModule';
import { UploadSoilModal } from '../components/dashboard/UploadSoilModal';
import { SoilMetrics } from '../types';
import { useAuth } from '../context/AuthContext';
import { soilAnalysisService } from '../services/soilAnalysisService';

export const FertilizerRecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleSelectTab = (tabId: string) => {
    if (tabId === 'fertilizer' || tabId === 'fertilizer-recommendation') return;
    if (tabId === 'soil-analysis') {
      navigate('/soil-analysis');
      return;
    }
    if (tabId === 'crop-recommendation') {
      navigate('/crop-recommendation');
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

  const handleSoilUploaded = (newSoil: SoilMetrics) => {
    try {
      soilAnalysisService.saveAnalysisFromMetrics(newSoil, user);
    } catch (err) {
      console.error('Failed to save soil analysis from metrics:', err);
    }
    setUploadModalOpen(false);
  };

  return (
    <>
      <DashboardLayout
        activeTab="fertilizer"
        onSelectTab={handleSelectTab}
        onOpenUploadModal={() => setUploadModalOpen(true)}
      >
        <FertilizerRecommendationModule />
      </DashboardLayout>

      <UploadSoilModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSoilReportUploaded={handleSoilUploaded}
      />
    </>
  );
};
