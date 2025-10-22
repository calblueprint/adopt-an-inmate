'use client';

import { useEffect, useMemo } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import StageMain from './stages/StageMain';
import StageMatching from './stages/StageMatching';
import StagePre from './stages/StagePre';
import StageSubmitted from './stages/StageSubmitted';

export default function DeciderStage() {
  const searchParams = useSearchParams();
  const stage = useMemo(
    () => searchParams.get('stage') || 'pre',
    [searchParams],
  );
  const { appState, setAppState } = useApplicationContext();

  // listen for search param changes and update the stage state
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

  if (stage === 'pre') return <StagePre />;
  if (stage === 'main') return <StageMain />;
  if (stage === 'matches') return <StageMatching />;
  if (stage === 'submitted') return <StageSubmitted />;

  throw notFound();
}
