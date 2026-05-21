'use client';

import { useMemo } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { ApplicationStage } from '@/types/enums';
import StageMain from './stages/StageMain';
import StageMatching from './stages/StageMatching';
import StagePre from './stages/StagePre';
import StageSubmitted from './stages/StageSubmitted';

export default function DeciderStage() {
  const searchParams = useSearchParams();
  const stage = useMemo(
    () => parseInt(searchParams.get('stage') || '0', 10),
    [searchParams],
  );

  // render stages
  if (stage === ApplicationStage.PRE) return <StagePre />;
  if (stage === ApplicationStage.MAIN) return <StageMain />;
  if (stage === ApplicationStage.MATCHING) return <StageMatching />;
  if (stage === ApplicationStage.SUBMITTED) return <StageSubmitted />;

  throw notFound();
}
