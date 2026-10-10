import React from 'react';
import { SoilMetrics } from '../../types';
import { SoilAnalysisModule } from '../soil/SoilAnalysisModule';

interface SoilAnalysisViewProps {
  currentSoil?: SoilMetrics;
  onOpenUpload?: () => void;
  onSoilMetricsUpdated?: (metrics: SoilMetrics) => void;
}

export const SoilAnalysisView: React.FC<SoilAnalysisViewProps> = ({
  onSoilMetricsUpdated,
}) => {
  return <SoilAnalysisModule onSoilMetricsUpdated={onSoilMetricsUpdated} />;
};
