import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { SoilAnalysisModule } from '../components/soil/SoilAnalysisModule';
import { UploadSoilModal } from '../components/dashboard/UploadSoilModal';
import { SoilMetrics } from '../types';
import { useAuth } from '../context/AuthContext';
import { soilAnalysisService } from '../services/soilAnalysisService';

export const SoilAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleSelectTab = (tabId: string) => {
    if (tabId === 'soil-analysis') {
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
      console.error('Failed to save soil metrics in SoilAnalysisPage:', err);
    }
    setUploadModalOpen(false);
  };

  return (
    <>
      <DashboardLayout
        activeTab="soil-analysis"
        onSelectTab={handleSelectTab}
        onOpenUploadModal={() => setUploadModalOpen(true)}
      >
        <SoilAnalysisModule />
      </DashboardLayout>

      <UploadSoilModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSoilReportUploaded={handleSoilUploaded}
      />
    </>
  );
};
