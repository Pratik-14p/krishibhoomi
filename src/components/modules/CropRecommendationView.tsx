import React from 'react';
import { CropRecommendationModule } from '../crop/CropRecommendationModule';

interface CropRecommendationViewProps {
  onSelectCropForProfit: (cropName: string) => void;
  onSelectCropForMarket?: (cropName: string, location?: string) => void;
}

export const CropRecommendationView: React.FC<CropRecommendationViewProps> = ({
  onSelectCropForProfit,
  onSelectCropForMarket,
}) => {
  return (
    <CropRecommendationModule
      onSelectCropForProfit={onSelectCropForProfit}
      onSelectCropForMarket={onSelectCropForMarket}
    />
  );
};
