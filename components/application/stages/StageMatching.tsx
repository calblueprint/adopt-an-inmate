'use client';

import { useEffect, useRef, useState } from 'react';
import { findMatches } from '@/actions/matching';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import MatchingLoading from '../matching/MatchingLoading';
import MatchingReviewScreen from '../matching/MatchingReviewScreen';
import MatchingSelectScreen from '../matching/MatchingSelectScreen';

export default function StageMatching() {
  const { appState, setAppState } = useApplicationContext();
  const [subStage, setSubStage] = useState<'select' | 'review'>('select');
  const [rankedIds, setRankedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const loadStarted = useRef(false);

  useEffect(() => {
    if (loadStarted.current) return;
    loadStarted.current = true;

    // find matches
    const loadMatches = async () => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw new Error(authError.message);

      // not logged in: should be redirected
      if (!user) return;

      // check if app already has matches
      if (appState.matches) {
        setIsLoaded(true);
        return;
      }

      // get existing match or find matches if none exist
      const { data: matches, error } = await findMatches(appState.appId);
      if (error) throw new Error(error);

      setAppState(prev => ({ ...prev, matches }));
      setIsLoaded(true);
    };

    loadMatches();
  }, [isLoaded, appState, setAppState]);

  /**
   * Function to finalize the ranks and transition to the review screen.
   * This is passed down as a prop.
   */
  const handleTransitionToReview = (rankedIds: string[]) => {
    setRankedIds(rankedIds);
    setAppState(prev => ({
      ...prev,
      rankedMatches: rankedIds,
    }));
    setSubStage('review');
  };

  const handleBackToSelect = () => {
    setSubStage('select');
  };

  if (isLoaded) {
    if (subStage === 'select') {
      return (
        <MatchingSelectScreen onTransitionToReview={handleTransitionToReview} />
      );
    } else if (subStage === 'review') {
      return (
        <MatchingReviewScreen ranks={rankedIds} onBack={handleBackToSelect} />
      );
    }
  }

  return <MatchingLoading />;
}
