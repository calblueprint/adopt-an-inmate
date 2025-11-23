'use client';

import { useEffect, useState } from 'react';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import MatchingLoading from '../matching/MatchingLoading';
import MatchingSelectScreen from '../matching/MatchingSelectScreen';

export default function StageMatching() {
  const { appState, setAppState } = useApplicationContext();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    // matches already found
    if (appState.matches && appState.matches.length > 0) {
      setIsLoaded(true);
      return;
    }

    // find matches
    const findMatches = async () => {
      try {
        const response = await fetch('/api/embed_and_fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: appState.form.bio }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `API request failed with status ${response.status}: ${errorText}`,
          );
        }
        const result = await response.json();
        setAppState(prev => ({ ...prev, matches: result.similar_bios }));
      } catch (error) {
        console.error('Failed to find matches:', error);
        setAppState(prev => ({ ...prev, matches: [] }));
      } finally {
        setIsLoaded(true);
      }
    };
    findMatches();
  }, [appState.form.bio, appState.matches, setAppState, isLoaded]);

  if (isLoaded) return <MatchingSelectScreen />;

  return <MatchingLoading />;
}
