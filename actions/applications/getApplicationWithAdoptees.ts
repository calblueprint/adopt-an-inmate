'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import { dangerous_getSupabaseServiceClient } from '@/lib/supabase/service';
import Logger from '../logging';

export const getApplicationWithAdoptees = async (appId: string) => {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user) {
    return { data: null, error: 'Unauthorized' };
  }

  // verify app is tied to user
  const { data: appData, error: getAppError } = await supabase
    .from('adopter_applications_dummy')
    .select()
    .eq('app_uuid', appId)
    .eq('adopter_uuid', user.id)
    .maybeSingle();
  if (getAppError || !appData) {
    return { data: null, error: 'Not found' };
  }

  if (!appData.ranked_cards)
    return {
      data: { matched: false, email: user.email, ...appData, adoptees: null },
      error: null,
    };

  // get adoptees
  const serviceSupabase = await dangerous_getSupabaseServiceClient();

  // matched: get only matched adoptee
  if (appData.matched_adoptee) {
    const { data: adopteeData, error: getAdopteeError } = await serviceSupabase
      .from('adoptee_vector_test')
      .select('id, gender, state, first_name, dob, bio')
      .eq('id', appData.matched_adoptee)
      .maybeSingle();

    if (getAdopteeError) {
      Logger.error(
        `Error fetching matched adoptee ${appData.matched_adoptee} for application ${appId}: ${getAdopteeError}`,
      );
      return { data: null, error: 'An unexpected error occurred' };
    }

    if (!adopteeData) {
      Logger.error(
        `Adoptee ${appData.matched_adoptee} for applciation ${appId} not found.`,
      );
      return { data: null, error: 'An unexpected error occurred' };
    }

    return {
      data: {
        matched: true,
        email: user.email,
        ...appData,
        adoptees: [adopteeData],
      },
      error: null,
    };
  }

  // get unmatched adoptees
  const { data: adopteeData, error: getAdopteeError } = await serviceSupabase
    .from('adoptee_vector_test')
    .select('id, gender, state, first_name, dob')
    .in('id', appData.ranked_cards);

  if (getAdopteeError) {
    Logger.error(
      `Error fetching adoptees for application ${appId}: ${getAdopteeError}`,
    );
    return { data: null, error: 'An unexpected error occurred' };
  }

  return {
    data: {
      matched: false,
      email: user.email,
      ...appData,
      adoptees: adopteeData,
    },
    error: null,
  };
};
