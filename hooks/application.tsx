'use client';

import { useEffect } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { useApplicationContext } from '@/contexts/ApplicationContext';

export const useApplicationStageRecorder = () => {
  const searchParams = useSearchParams();
  const { appState, setAppState } = useApplicationContext();

  useEffect(() => {
    const stages = ['pre', 'main', 'matches', 'submitted'] as const;
    const currentStage = searchParams.get('stage') || 'pre';
    const highestAttainedStage = appState.highestStageAchieved;

    // parse current and highest achieved stages as index
    const currentIdx = stages.findIndex(stage => stage === currentStage);
    const highestIdx = stages.findIndex(
      stage => stage === highestAttainedStage,
    );
    if (currentIdx === -1) throw notFound();
    if (highestIdx === -1) throw new Error('An unexpected error occured');

    if (currentIdx > highestIdx) {
      // update highest achieved stage
      // TODO: add logic to prevent skips without filling out the form
      setAppState(state => ({
        ...state,
        highestStageAchieved: stages[currentIdx],
      }));
    }
  }, [searchParams, appState, setAppState]);
};
