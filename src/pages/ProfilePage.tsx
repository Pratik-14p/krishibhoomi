import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProfileView } from '../components/modules/ProfileView';
import { UploadSoilModal } from '../components/dashboard/UploadSoilModal';
import { SoilMetrics } from '../types';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleSelectTab = (tabId: string) => {
    if (tabId === 'profile') {
      return;
    }
    navigate(`/dashboard?tab=${tabId}`);
  };

  const handleSoilUploaded = (_newSoil: SoilMetrics) => {
    navigate('/dashboard?tab=soil-analysis');
  };

  return (
    <>
      <DashboardLayout
        activeTab="profile"
        onSelectTab={handleSelectTab}
        onOpenUploadModal={() => setUploadModalOpen(true)}
      >
        <ProfileView />
      </DashboardLayout>

      <UploadSoilModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSoilReportUploaded={handleSoilUploaded}
      />
    </>
  );
};
