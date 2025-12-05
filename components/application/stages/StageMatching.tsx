'use client';

import { useEffect, useRef, useState } from 'react';
import { findMatches } from '@/actions/matching';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import MatchingLoading from '../matching/MatchingLoading';
import MatchingSelectScreen from '../matching/MatchingSelectScreen';

export default function StageMatching() {
  const { appState, setAppState } = useApplicationContext();
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

      // upsert app data to db
      const { error: upsertError } = await supabase
        .from('adopter_applications_dummy')
        .upsert({
          adopter_uuid: user.id,
          app_uuid: appState.appId,
          status: 'incomplete',
          gender_pref: appState.form.genderPreference,
          personal_bio: appState.form.bio,
          return_explanation:
            appState.form.whyAdopting || appState.form.whyEnded,
        });

      if (upsertError) throw new Error(upsertError.message);

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

  if (isLoaded) return <MatchingSelectScreen />;

  return <MatchingLoading />;
}
