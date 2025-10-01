'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApplicationContext } from '@/contexts/ApplicationContext';

export const useApplicationStageRecorder = () => {
  const searchParams = useSearchParams();
  const { appState, setAppState } = useApplicationContext();

  useEffect(() => {
    const stages = ['pre', 'main', 'matches', 'submitted'] as const;
    const currentStage = searchParams.get('stage') || 'pre';
    const highestAttainedStage = appState.highestStageAchieved;

    const currentIdx = stages.findIndex(stage => stage === currentStage);
    const highestIdx = stages.findIndex(
      stage => stage === highestAttainedStage,
    );
    if (currentIdx === -1 || highestIdx === -1) return;

    if (currentIdx > highestIdx) {
      setAppState(state => ({
        ...state,
        highestStageAchieved: stages[currentIdx],
      }));
    }
  }, [searchParams, appState, setAppState]);
};
