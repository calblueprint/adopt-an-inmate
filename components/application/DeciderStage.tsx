'use client';

import { useMemo } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { useApplicationStageRecorder } from '@/hooks/application';
import StageMain from './stages/StageMain';
import StageMatching from './stages/StageMatching';
import StagePre from './stages/StagePre';
import StageSubmitted from './stages/StageSubmitted';

export default function DeciderStage() {
  const searchParam = useSearchParams();
  const stage = useMemo(() => searchParam.get('stage') || 'pre', [searchParam]);

  useApplicationStageRecorder();

  if (stage === 'pre') return <StagePre />;
  if (stage === 'main') return <StageMain />;
  if (stage === 'matches') return <StageMatching />;
  if (stage === 'submitted') return <StageSubmitted />;

  throw notFound();
}
