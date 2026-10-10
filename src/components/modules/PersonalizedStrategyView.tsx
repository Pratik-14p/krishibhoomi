import React from 'react';
import { PersonalizedStrategyModule } from '../strategy/PersonalizedStrategyModule';

interface PersonalizedStrategyViewProps {
  onNavigateTab?: (tabKey: string) => void;
}

export const PersonalizedStrategyView: React.FC<PersonalizedStrategyViewProps> = ({
  onNavigateTab,
}) => {
  return <PersonalizedStrategyModule onNavigateTab={onNavigateTab} />;
};
