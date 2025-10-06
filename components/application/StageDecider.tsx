'use client';

import { useMemo } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { useApplicationStageRecorder } from '@/hooks/application';
import MainApplication from './MainApplication';
import MatchingView from './MatchingView';
import PreApplication from './PreApplication';
import SubmittedView from './SubmittedView';

export default function StageDecider() {
  const searchParam = useSearchParams();
  const stage = useMemo(() => searchParam.get('stage') || 'pre', [searchParam]);

  useApplicationStageRecorder();

  if (stage === 'pre') return <PreApplication />;
  if (stage === 'main') return <MainApplication />;
  if (stage === 'matches') return <MatchingView />;
  if (stage === 'submitted') return <SubmittedView />;

  throw notFound();
}
