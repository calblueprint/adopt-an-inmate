'use server';

import { User } from '@supabase/supabase-js';
import { getSupabaseServerClient } from '@/lib/supabase';
import { AdopterApplication } from '@/types/schema';
import Logger from '../logging';

/**
 * Checks the requesting user's ability to create
 * a new application. Returns true if the user is
 * able to create, false otherwise.
 */
export const checkCreationConstraints = async (user: User) => {
  const supabase = await getSupabaseServerClient();

  // constraint: invalid ended reason
  const { data: profile, error: getProfileError } = await supabase
    .from('adopter_profiles')
    .select()
    .eq('user_id', user.id)
    .maybeSingle();

  if (getProfileError) {
    Logger.error(
      `Error getting adopter profile for ${user.id}: ${getProfileError}`,
    );
    return { data: false, error: 'An unexpected error occurred.' };
  }

  if (!profile) {
    return { data: false, error: 'User has no profile.' };
  }

  // fetch applications
  const { data: appsData, error: getAppError } = await supabase
    .from('adopter_applications_dummy')
    .select()
    .eq('adopter_uuid', user.id);

  if (getAppError) {
    Logger.error(`Error getting app data for ${user.id}: ${getAppError}`);
    return { data: false, error: 'An unexpected error occurred.' };
  }

  if (!appsData || appsData.length === 0) {
    return { data: true, error: null };
  }

  const now = new Date();

  for (const app of appsData) {
    // constraint: was rejected
    if (app.status === 'rejected') {
      return { data: false, error: 'Application was rejected, contact NPO.' };
    }

    // constraint: has existing app
    const existingStatus: AdopterApplication['status'][] = [
      'incomplete',
      'pending',
    ];

    if (existingStatus.includes(app.status)) {
      return { data: false, error: 'An application is already in progress.' };
    }

    // constraint: 6mo recent
    const submittedTime = new Date(app.time_submitted);
    const yearDelta = now.getFullYear() - submittedTime.getFullYear();
    const yearMod = yearDelta === 0 ? 0 : 12 - submittedTime.getMonth();
    const yearRem = yearDelta > 1 ? (yearDelta - 1) * 12 : 0;
    const monthDelta =
      now.getMonth() - submittedTime.getMonth() + yearMod + yearRem;
    const dayDelta = now.getDate() - submittedTime.getDate();

    if (monthDelta < 6 || (monthDelta === 6 && dayDelta < 0)) {
      return {
        data: false,
        error: 'An application was already submitted within 6 months.',
      };
    }
  }

  return { data: true, error: null };
};

/**
 * Creates a new application if the requester is
 * able to. Returns the appId on success, an error
 * otherwise.
 */
export const createApplication = async () => {
  const supabase = await getSupabaseServerClient();

  // get user auth
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError) {
    Logger.error(`Error fetching user: ${getUserError}`);
    return { data: null, error: 'An unexpected error occurred.' };
  }

  if (!user) {
    return { data: null, error: 'User not logged in' };
  }

  // check create app constraint
  const { data: canCreate, error: constraintError } =
    await checkCreationConstraints(user);

  if (!canCreate || constraintError) {
    return {
      data: null,
      error: constraintError || 'Cannot create application',
    };
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
    return { data: null, error: 'An unexpected error occurred.' };
  }

  return {
    data: insertedRow.app_uuid,
    error: null,
  };
};
