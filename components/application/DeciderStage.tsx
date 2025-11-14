'use client';

import { useEffect, useMemo } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { ApplicationStage } from '@/types/enums';
import StageMain from './stages/StageMain';
import StageMatching from './stages/StageMatching';
import StagePre from './stages/StagePre';
import StageSubmitted from './stages/StageSubmitted';

export default function DeciderStage() {
  const searchParams = useSearchParams();
  const stage = useMemo(
    () => parseInt(searchParams.get('stage') ?? '0', 10),
    [searchParams],
  );
  const { appStage } = useApplicationContext();
  const router = useRouter();

  // intercept brute force attempts to skip stages
  useEffect(() => {
    const currentStage = parseInt(searchParams.get('stage') ?? '0', 10);
    const lastRecordedStage = appStage.current;

    if (currentStage !== lastRecordedStage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('stage', lastRecordedStage.toString());
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, appStage, router]);

  // render stages
  if (stage === ApplicationStage.PRE) return <StagePre />;
  if (stage === ApplicationStage.MAIN) return <StageMain />;
  if (stage === ApplicationStage.MATCHING) return <StageMatching />;
  if (stage === ApplicationStage.SUBMITTED) return <StageSubmitted />;

  throw notFound();
}
