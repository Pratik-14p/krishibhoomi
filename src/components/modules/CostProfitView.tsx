import React from 'react';
import { CostProfitCalculatorModule } from '../profit/CostProfitCalculatorModule';

interface CostProfitViewProps {
  initialCrop?: string;
}

export const CostProfitView: React.FC<CostProfitViewProps> = ({ initialCrop }) => {
  return <CostProfitCalculatorModule initialCrop={initialCrop} />;
};
