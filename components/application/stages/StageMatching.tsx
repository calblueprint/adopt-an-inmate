'use client';

import { useEffect, useState } from 'react';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { sleep } from '@/lib/utils';
import { AdopteeMatch } from '@/types/types';
import MatchingLoading from '../matching/MatchingLoading';
import MatchingSelectScreen from '../matching/MatchingSelectScreen';

const hardcodedMatches: AdopteeMatch[] = [
  {
    id: 'ethan',
    name: 'Ethan',
    age: 33,
    bio: 'I love food',
    gender: 'male',
    state: 'California',
  },
  {
    id: 'carolyn',
    name: 'Carolyn',
    age: 29,
    bio: 'I like pandas',
    gender: 'female',
    state: 'California',
  },
  {
    id: 'austin',
    name: 'Austin',
    age: 22,
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    gender: 'male',
    state: 'Texas',
  },
  {
    id: 'sai',
    name: 'Sai',
    age: 19,
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    gender: 'male',
    state: 'California',
  },
];

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
    // TODO: replace with actual database call
    // should not be a fetch - if it already exists in db, we should've
    // fetched it during the initial load of application (in page.tsx)
    const findMatches = async () => {
      // simulate network delay
      await sleep(1000);
      setAppState(prev => ({ ...prev, matches: hardcodedMatches }));
      setIsLoaded(true);
    };

    findMatches();
  }, [appState, setAppState, isLoaded]);

  if (isLoaded) return <MatchingSelectScreen />;

  return <MatchingLoading />;
}
