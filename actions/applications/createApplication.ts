'use server';

import { User } from '@supabase/supabase-js';
import { getSupabaseServerClient } from '@/lib/supabase';
import Logger from '../logging';

/**
 * Checks the requesting user's ability to create
 * a new application. Returns true if the user is
 * able to create, false otherwise.
 */
export const checkCreationConstraints = async (user: User) => {
  const supabase = await getSupabaseServerClient();

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

  // constraint: must be at least 18 years old
  const dob = new Date(profile.date_of_birth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const isUnder18 =
    age < 18 ||
    (age === 18 &&
      (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())));
  if (isUnder18) {
    return {
      data: false,
      error:
        'Adopters must be at least 18 years old before creating an application.',
    };
  }

  // constraint: invalid ended reason
  if (profile.past_inactive_reason === 'NPO_CANCELLED') {
    return {
      data: false,
      error:
        'There was an issue with your onboarding responses, please contact admin at adopt@adoptaninmate.org to fix this.',
    };
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

  // constraint: check number of active adoptees
  const numActiveApps = appsData.filter(
    app => app.status === 'ACCEPTED',
  ).length;
  const totalActiveAdoptees = numActiveApps + (profile.num_past_active || 0);

  if (totalActiveAdoptees >= 2) {
    return {
      data: false,
      error: 'You already have two active connections.',
    };
  }

  if (!appsData || appsData.length === 0) {
    return { data: true, error: null };
  }

  // constraint: has existing incomplete app
  if (appsData.some(app => app.status === 'INCOMPLETE')) {
    return {
      data: false,
      error:
        'Please complete your incomplete application before creating a new one.',
    };
  }

  // constraint: has existing pending app
  if (appsData.some(app => app.status === 'PENDING')) {
    return {
      data: false,
      error:
        'You still have one pending application, please wait for admin approval.',
    };
  }

  const now = new Date();

  for (const app of appsData) {
    // constraint: was rejected
    if (app.status === 'REJECTED') {
      return {
        data: false,
        error:
          'You have a past rejected application, please follow up with admin at adopt@adoptaninmate.org.',
      };
    }

    if (!app.time_submitted) continue;

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
        error:
          'Your most recent connection is still new, please wait before starting a new application.',
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
    return { data: null, error: 'An unexpected error occurred.' };
  }

  return {
    data: insertedRow.app_uuid,
    error: null,
  };
};
