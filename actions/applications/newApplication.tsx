'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import Logger from '../logging';

export const getNewApplicationId = async () => {
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
    .eq('status', 'incomplete');

  if (getAppError) {
    Logger.error(`Error getting existing application: ${getAppError.message}`);
    return { data: null, error: 'Error fetching applications' };
  }

  // navigate to incomplete app if one exists
  if (existingIncompletes && existingIncompletes.length > 0) {
    const existingApp = existingIncompletes[0];
    return { data: existingApp.app_uuid, error: null };
  }

  // create app with user id
  const { data: insertedRow, error: insertError } = await supabase
    .from('adopter_applications_dummy')
    .insert({
      adopter_uuid: user.id,
      status: 'incomplete',
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

  // successful; redirect
  return { data: insertedRow.app_uuid, error: null };
};
