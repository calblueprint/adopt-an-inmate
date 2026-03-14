'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import Logger from '../logging';

export const continueApplication = async (appId: string) => {
  const supabase = await getSupabaseServerClient();

  // get user
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError) {
    Logger.error(`Error getting user: ${getUserError}`);
    return { data: null, error: 'An unexpected error occurred' };
  }

  if (!user) {
    return { data: null, error: 'User is not logged in.' };
  }

  // check if an incomplete app already exists
  const { data: appData, error: getAppError } = await supabase
    .from('adopter_applications_dummy')
    .select()
    .eq('app_uuid', appId)
    .maybeSingle();

  // error handling
  if (getAppError) {
    Logger.error(`Error getting existing application: ${getAppError.message}`);
    return { data: null, error: 'Error fetching applications' };
  }

  if (!appData) {
    return {
      data: null,
      error: `Couldn't find application with id ${appId}`,
    };
  }

  return {
    data: appData,
    error: null,
  };
};
