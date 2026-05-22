'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import Logger from '../logging';

export const verifyApplication = async (appId: string) => {
  const supabase = await getSupabaseServerClient();

  // fetch application
  const { data: appData, error: getAppError } = await supabase
    .from('adopter_applications_dummy')
    .select()
    .eq('app_uuid', appId)
    .maybeSingle();

  if (getAppError) {
    Logger.error(`Error getting application ${appId}: ${getAppError.message}`);
    return {
      data: null,
      error: 'An unexpected error occurred, please try again later.',
    };
  }

  // validate app

  // ensure app exists
  if (!appData) {
    return {
      data: { verified: false },
      error: "Couldn't find application, please refresh the page.",
    };
  }

  // ensure data existence:
  if (!appData.personal_bio)
    return {
      data: { verified: false },
      error: 'Please make sure bio is completed.',
    };

  if (!appData.gender_pref)
    return {
      data: { verified: false },
      error: 'Please make sure gender preferences are completed.',
    };

  // ensure data validity:
  //   bio: at least 300 chars
  //   age pref: 2 values for a range
  if (appData.personal_bio.length < 300)
    return {
      data: { verified: false },
      error: 'Please make sure bio is at least 300 characters.',
    };

  if (appData.age_pref && appData.age_pref.length !== 2)
    return {
      data: { verified: false },
      error: 'Please make sure age preferences are inputted correctly.',
    };

  return { data: { verified: true }, error: null };
};
