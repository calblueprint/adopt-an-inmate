'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import { getResumeStageAndQuestion } from '@/lib/utils';
import Logger from '../logging';

export type NewApplicationResult = {
  app_uuid: string;
  stage: number;
  question: number;
} | null;

export const getNewApplicationId = async (): Promise<{
  data: NewApplicationResult;
  error: string | null;
}> => {
  const supabase = await getSupabaseServerClient();

  // get user auth
  const {
    data: { user },
    error: fetchUserError,
  } = await supabase.auth.getUser();

  if (fetchUserError || !user) {
    Logger.error(
      fetchUserError
        ? `Error getting user: ${fetchUserError.message}`
        : `User not logged in`,
    );
    return {
      data: null,
      error: fetchUserError
        ? `Error fetching user`
        : 'Access denied; user not logged in',
    };
  }

  // check if an incomplete app already exists
  const { data: existingIncompletes, error: getAppError } = await supabase
    .from('adopter_applications_dummy')
    .select()
    .eq('adopter_uuid', user.id)
    .eq('status', 'INCOMPLETE');

  if (getAppError) {
    Logger.error(`Error getting existing application: ${getAppError.message}`);
    return { data: null, error: 'Error fetching applications' };
  }

  // navigate to incomplete app if one exists - route to correct stage/question
  if (existingIncompletes && existingIncompletes.length > 0) {
    const existingApp = existingIncompletes[0];
    const { stage, question } = getResumeStageAndQuestion(existingApp);
    return {
      data: {
        app_uuid: existingApp.app_uuid,
        stage,
        question,
      },
      error: null,
    };
  }

  // create app with user id
  const { data: insertedRow, error: insertError } = await supabase
    .from('adopter_applications_dummy')
    .insert({
      adopter_uuid: user.id,
      status: 'INCOMPLETE',
    })
    .select()
    .maybeSingle();

  // error handling
  if (insertError || !insertedRow) {
    Logger.error(
      insertError
        ? `Error inserting: ${insertError.message}`
        : `No row inserted`,
    );
    return { data: null, error: 'An error occurred while trying to insert' };
  }

  // successful; new app starts at PRE stage, q 0
  return {
    data: {
      app_uuid: insertedRow.app_uuid,
      stage: 0,
      question: 0,
    },
    error: null,
  };
};
