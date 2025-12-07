'use server';

import { InferenceClient } from '@huggingface/inference';
import { getSupabaseServerClient } from '@/lib/supabase';
import { assertEnvVarExists } from '@/lib/utils';
import { RankedAdopteeMatch } from '@/types/schema';
import Logger from '../logging';
import { fetchTopK } from '../queries/query';

assertEnvVarExists('HF_TOKEN');

/**
 * Takes in an application ID and finds four matches
 * based on the application bio stored on the database.
 *
 * Returns existing matches if the application already has matches.
 * Errors if the application bio does not exist.
 */
export const findMatches = async (appId: string) => {
  // check if app id already has matches
  const supabase = await getSupabaseServerClient();

  // TODO: update table name when it's no longer dummy
  const { data: appData, error: fetchAppError } = await supabase
    .from('adopter_applications_dummy')
    .select()
    .eq('app_uuid', appId)
    .maybeSingle();

  if (fetchAppError) return { data: null, error: fetchAppError.message };
  if (!appData) return { data: null, error: 'Application not found' };
  if (!appData.personal_bio)
    return { data: null, error: 'Application has no bio' };
  console.log('App data:', appData); //DELETEEEEEEEEEE

  // return existing data
  if (appData.ranked_cards) {
    const { matches } = appData.ranked_cards as {
      matches: RankedAdopteeMatch[];
    };
    return { data: matches, error: null };
  }

  // if we reached this point,
  // then we have not yet created a match

  // find user
  console.log('will the real user id pls stand up: ', appData.adopter_uuid);
  const { data: userProfile, error: fetchUserError } = await supabase
    .from('adopter_profiles')
    .select()
    .eq('user_id', appData.adopter_uuid)
    .maybeSingle();

  if (fetchUserError) return { data: null, error: fetchUserError.message };
  if (!userProfile) return { data: null, error: 'User profile not found' };

  // generate embedding
  const hfClient = new InferenceClient(process.env.HF_TOKEN);
  const embedding = await hfClient.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: appData.personal_bio,
    provider: 'auto',
  });

  // assert embedding type
  if (!(embedding instanceof Array && typeof embedding[0] == 'number')) {
    Logger.error(`Unexpected embedding type received: ${embedding}`);
    return { data: null, error: 'An unexpected error occurred' };
  }

  // TODO: accurately map veteran status strings to boolean
  // or alternatively handle nuanced veteran status
  const matches = await fetchTopK(
    embedding as number[],
    4,
    appData.gender_pref ?? undefined,
    userProfile.veteran_status ? 'Yes' : 'No',
    undefined,
    userProfile.state,
  );

  const rankedMatches: RankedAdopteeMatch[] = matches.map(m => ({
    id: m.id,
    age: m.age,
    bio: m.bio,
    first_name: m.first_name,
    gender: m.gender,
    state: m.state,
  }));

  // update application
  const { error: updateError } = await supabase
    .from('adopter_applications_dummy')
    .update({ ranked_cards: rankedMatches })
    .eq('app_uuid', appId);

  if (updateError) {
    Logger.error(`Error updating to Supabase: ${updateError.message}`);
    return { data: null, error: 'An unexpected error occurred' };
  }

  return { data: rankedMatches, error: null };
};
