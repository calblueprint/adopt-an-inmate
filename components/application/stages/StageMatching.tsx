'use client';

import { useEffect, useRef, useState } from 'react';
import { findMatches } from '@/actions/matching';
import { fetchAdopteeCardsInfo } from '@/actions/queries/query';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { RankedAdopteeMatch } from '@/types/schema';
import MatchingLoading from '../matching/MatchingLoading';
import MatchingReviewScreen from '../matching/MatchingReviewScreen';
import MatchingSelectScreen from '../matching/MatchingSelectScreen';

export default function StageMatching() {
  const { appState, setAppState } = useApplicationContext();
  const [subStage, setSubStage] = useState<'select' | 'review'>('select');
  const [rankedIds, setRankedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [matchCards, setMatchCards] = useState<RankedAdopteeMatch[]>([]);
  const loadStarted = useRef(false);

  useEffect(() => {
    if (loadStarted.current) return;
    loadStarted.current = true;

    // find matches
    const loadMatches = async () => {
      console.log('loadMatches started');
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      console.log('user:', user);
      console.log('appState.matches:', appState.matches);

      if (authError) throw new Error(authError.message);

      // not logged in: should be redirected
      if (!user) return;

      // check if app already has matches
      if (appState.matches) {
        console.log('existing matches found, fetching card info');
        // fetch full card info from existing IDs
        const cards = await fetchAdopteeCardsInfo(appState.matches);
        console.log('cards:', cards);
        setMatchCards(cards);
        setIsLoaded(true);
        return;
      }

      // get existing match or find matches if none exist
      const { data: matchIds, error } = await findMatches(appState.appId);
      if (error) throw new Error(error);

      console.log('matchIds:', matchIds);

      // fetch full card info and store IDs in appState
      const cards = await fetchAdopteeCardsInfo(matchIds!);
      console.log('cards:', cards);
      setMatchCards(cards);
      setAppState(prev => ({ ...prev, matches: matchIds }));
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
        <MatchingSelectScreen
          matchCards={matchCards}
          onTransitionToReview={handleTransitionToReview}
        />
      );
    } else if (subStage === 'review') {
      return (
        <MatchingReviewScreen
          matchCards={matchCards}
          ranks={rankedIds}
          onBack={handleBackToSelect}
        />
      );
    }
  }

  return <MatchingLoading />;
}
