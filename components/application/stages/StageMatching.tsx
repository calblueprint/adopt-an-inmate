'use client';

import { useEffect, useRef, useState } from 'react';
import { findMatches } from '@/actions/matching';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import MatchingLoading from '../matching/MatchingLoading';
import MatchingSelectScreen from '../matching/MatchingSelectScreen';

export default function StageMatching() {
  const { appState, setAppState } = useApplicationContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const loadStarted = useRef(false);

  useEffect(() => {
    if (loadStarted.current) return;
    loadStarted.current = true;

    // check if app already has matches
    if (appState.matches) {
      setIsLoaded(true);
      return;
    }

    // find matches
    const loadMatches = async () => {
      const { data: matches, error } = await findMatches(appState.appId);
      if (error) throw new Error(error);

      setAppState(prev => ({ ...prev, matches }));
      setIsLoaded(true);
    };

    loadMatches();
  }, [isLoaded, appState, setAppState]);

  if (isLoaded) return <MatchingSelectScreen />;

  return <MatchingLoading />;
}
