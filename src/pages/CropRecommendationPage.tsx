import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { CropRecommendationModule } from '../components/crop/CropRecommendationModule';
import { UploadSoilModal } from '../components/dashboard/UploadSoilModal';
import { SoilMetrics } from '../types';
import { useAuth } from '../context/AuthContext';
import { soilAnalysisService } from '../services/soilAnalysisService';

export const CropRecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleSelectTab = (tabId: string) => {
    if (tabId === 'crop-recommendation') return;
    if (tabId === 'soil-analysis') {
      navigate('/soil-analysis');
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

  const handleSelectCropForProfit = (cropName: string) => {
    navigate(`/dashboard?tab=profit&crop=${encodeURIComponent(cropName)}`);
  };

  const handleSelectCropForAdvisory = (cropName: string) => {
    navigate(`/fertilizer-recommendation?crop=${encodeURIComponent(cropName)}`);
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
        activeTab="crop-recommendation"
        onSelectTab={handleSelectTab}
        onOpenUploadModal={() => setUploadModalOpen(true)}
      >
        <CropRecommendationModule
          onSelectCropForProfit={handleSelectCropForProfit}
          onSelectCropForAdvisory={handleSelectCropForAdvisory}
        />
      </DashboardLayout>

      <UploadSoilModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSoilReportUploaded={handleSoilUploaded}
      />
    </>
  );
};
