'use server';

import { SupabaseClient } from '@supabase/supabase-js';
import Logger from '@/actions/logging';
import { CONFIG } from '@/config';
import { capitalize } from '@/lib/formatters';
import { getSupabaseServerClient } from '@/lib/supabase';
import { dangerous_getSupabaseServiceClient } from '@/lib/supabase/service';
import { assert, getEnvVar } from '@/lib/utils';
import { ProfileAndApplication } from '@/types/schema';
import { mondayApiClient } from '../core';
import { updateAdopteeMondayStatus } from './changeStatus';

// get env var and assert it exists at system level to trigger
// error messages at build time (rather than run time)
// => alert us to setup these env vars before the function needs them
const MONDAY_ADOPTER_DATA_BOARD_ID = getEnvVar('MONDAY_ADOPTER_DATA_BOARD_ID');
const MONDAY_ADOPTER_DATA_WAITING_GROUP_ID = getEnvVar(
  'MONDAY_ADOPTER_DATA_WAITING_GROUP_ID',
);

////
// HELPER FUNCTION
////

/**
 * Fetches relevant profile and application information
 * given the appId and userId. Performs data validation.
 * Returns { appData } if data is valid, otherwise
 * { error } with an error message
 */
const getAppData = async (
  supabase: SupabaseClient,
  appId: string,
  userId: string,
) => {
  // fetch app data from database
  const { data: appDataList, error: rpcFuncError } = await supabase.rpc(
    'get_user_and_application',
    { app_id: appId },
  );

  // validate app data
  let appData: ProfileAndApplication;
  try {
    assert(!rpcFuncError, {
      sysErr: `Error trying to invoke get_user_and_application(${appId}): ${rpcFuncError?.message}`,
      err: 'An unexpected error occurred.',
    });

    assert(!!appDataList && appDataList.length === 1, {
      sysErr: `Could not find application with ID ${appId}`,
      err: 'Could not find application.',
    });

    appData = appDataList![0];
  } catch (err) {
    const e = err as Record<string, string>;
    Logger.error(e.sysErr);
    return { error: e.sysErr };
  }

  // validate application
  try {
    assert(!appData.exported_to_monday, 'Application already exported.');
    assert(userId === appData.user_id, 'User ID mismatch.');
  } catch (error) {
    return { error };
  }

  // verify data integrity of ranked cards object
  try {
    assert(!!appData.ranked_cards);
    assert(appData.ranked_cards instanceof Array);
    const rankedCardsArray = appData.ranked_cards as Array<string>;
    assert(rankedCardsArray.length === 4);
  } catch {
    return { error: 'Invalid ranked cards object.' };
  }

  return { appData };
};

/**
 * Parses a column values object based on the
 * remapping of column names defined in the column mapping.
 */
const parseColumns = <K extends string>(
  columnMapping: Record<K, string>,
  columnValues: Partial<Record<K, unknown>>,
) => {
  return Object.entries(columnValues).reduce(
    (agg: Record<string, unknown>, [key, val]) => {
      const k = key as K;
      agg[columnMapping[k]] = val;
      return agg;
    },
    {},
  );
};

/**
 * Generate a mutation query to create the
 * main item.
 */
const getQueryCreateMainItem = (
  appData: ProfileAndApplication,
  email: string,
) => {
  // define and compute column values
  const currentTime = new Date();
  const currentDateISOString = currentTime.toISOString().split('T')[0]; // ex: 2026-02-22
  const capitalizedPronouns = appData.pronouns
    .split('/')
    .map(p => capitalize(p.trim()))
    .join(' / ');

  const mainItemColumnValues = parseColumns(
    {
      email: 'email__1',
      added_time: 'date7',
      first_name: 'text__1',
      last_name: 'text5__1',
      current_status: 'status4',
      gender: 'label__1',
      pronouns: 'single_select__1',
      gender_preference: 'color__1',
      date_of_birth: 'date',
      location: 'location7',
      notes: 'notes__1',
      veteran_status: 'dropdown__1',
    },
    {
      email: { email, text: email },
      added_time: currentDateISOString,
      current_status: 'Pending',
      date_of_birth: appData.date_of_birth,
      first_name: appData.first_name,
      last_name: appData.last_name,
      location: { lat: 0, lng: 0, address: appData.state },
      pronouns: capitalizedPronouns,
      veteran_status: appData.veteran_status ? 'Yes' : 'No',
    },
  );

  const mainItemCreateQuery = `
    mutation {
      create_item(
        board_id: "${MONDAY_ADOPTER_DATA_BOARD_ID}",
        group_id: "${MONDAY_ADOPTER_DATA_WAITING_GROUP_ID}",
        item_name: "${email}",
        create_labels_if_missing: true,
        column_values: "${JSON.stringify(mainItemColumnValues).replaceAll('"', '\\"')}"
      ) {
        id
      }
    }
  `;

  return mainItemCreateQuery;
};

/**
 * Generate a query to create a subitem
 * corresponding to the application,
 * under the main item that corresponds
 * to the adopter.
 */
const getQueryCreateSubItem = (
  appData: ProfileAndApplication,
  mainItemId: string,
  adopteeData: {
    id: string;
    inmate_id: string;
  }[],
) => {
  // get current time
  const currentTime = new Date();
  const currentDateISOString = currentTime.toISOString().split('T')[0];

  // parse gender preference
  const genderPrefMap = {
    no_preference: 'None',
    female: 'Female',
    male: 'Male',
  };

  const parsedGenderPref = Object.keys(genderPrefMap).includes(
    appData.gender_pref,
  )
    ? genderPrefMap[appData.gender_pref as keyof typeof genderPrefMap]
    : 'Default';

  // parse ranked cards
  const adopteeMap = adopteeData.reduce(
    (acc, cur) => {
      acc[cur.id] = cur.inmate_id;
      return acc;
    },
    {} as Record<string, string>,
  );

  const rankedCards = appData.ranked_cards as Array<string>;
  const rankedCardsOrder = rankedCards.map(c => adopteeMap[c]).join(', ');

  const subItemColumnValues = parseColumns(
    {
      status: 'status',
      gender_preference: 'status2__1',
      match_list_links: 'connect_boards1__1',
      bio: 'long_text__1',
      order: 'long_text5__1',
      date_received: 'date__1',
    },
    {
      status: 'Pending',
      gender_preference: parsedGenderPref,
      match_list_links: { item_ids: appData.ranked_cards },
      bio: appData.personal_bio,
      order: rankedCardsOrder,
      date_received: currentDateISOString,
    },
  );

  const subItemCreateQuery = `
    create_subitem(
      parent_item_id: "${mainItemId}",
      item_name: "Request",
      column_values: "${JSON.stringify(subItemColumnValues).replaceAll('"', '\\"')}"
    ) {
      id  
    }
  `;

  return subItemCreateQuery;
};

////
// MAIN FUNCTION
////

const exportApplication = async (appId: string) => {
  if (!CONFIG.enableMondayMutations)
    return { success: false, error: 'Forbidden action.' };

  const supabase = await getSupabaseServerClient();

  // get logged in user
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user) {
    Logger.error(`Error trying to get user when exporting Monday application.`);
    return { success: false, error: 'Failed to identify user.' };
  }

  // just a check to appease typescript bc email can technically be undefined
  // shouldn't happen for us since we only have email login
  if (!user.email) {
    return { success: false, error: 'User has no email.' };
  }

  // fetch app data from database
  const { appData, error: appDataError } = await getAppData(
    supabase,
    appId,
    user.id,
  );
  if (!appData) return { success: false, error: appDataError };

  // get relevant adoptee data
  const { data: adopteeData, error: getAdopteeError } = await supabase
    .from('adoptee_vector_test')
    .select('id, inmate_id')
    .in('id', appData.ranked_cards as Array<string>);
  if (getAdopteeError || !adopteeData || adopteeData.length !== 4) {
    Logger.error(
      `Error fetching adoptees for application ${appId}: ${getAdopteeError}`,
    );
    return { success: false, error: 'Failed to fetch adoptees.' };
  }

  // check if main item already exists on monday
  let mainItemId = appData.adopter_monday_id;

  // if main item doesn't exist, create it
  if (!appData.adopter_monday_id) {
    const createMainItemQuery = getQueryCreateMainItem(appData, user.email);

    const response = await mondayApiClient.request(createMainItemQuery);

    // interpret response, get main item id
    try {
      const resObj = response as Record<string, unknown>;
      const createItemField = resObj.create_item as Record<string, string>;
      mainItemId = createItemField.id;
    } catch (err) {
      Logger.error(
        `Error parsing response when creating item in Monday: ${err}`,
      );
      return { success: false, error: 'An unexpected error occurred.' };
    }

    // update supabase with adopter's monday ID (main item ID)
    const { error: updateError } = await supabase
      .from('adopter_profiles')
      .update({ monday_id: mainItemId })
      .eq('user_id', user.id);

    // highly unlikely
    // would only error if the profile row is deleted
    // or if the column was renamed/deleted
    if (updateError) {
      Logger.error(
        `[CRITICAL] Error trying to update adopter profile for user ${user.email} (ID ${user.id}): ${updateError}`,
      );
      // NOTE: allow pass through, don't want to report unsuccessful just
      // bc push to supabase fails. Should still aim to get data to Monday.
      // Then, admins can at least have access to data present here.
    }
  }

  // execute remaining supplementary queries to:
  // - create subitem, which corresponds with application
  // - update adoptee status on Monday to OFC
  const createSubitemQuery = getQueryCreateSubItem(
    appData,
    mainItemId,
    adopteeData,
  );
  const updateAdopteesQuery = await updateAdopteeMondayStatus(
    appData.ranked_cards as Array<string>,
    'OFC',
  );

  // if (updateAdopteesFieldsError || updateAdopteesQuery === null) {
  //   Logger.error(
  //     `exportApplication: could not build Monday OFC status fields for app ${appId}: ${updateAdopteesFieldsError ?? 'null data'}`,
  //   );
  //   return {
  //     success: false,
  //     error: updateAdopteesFieldsError ?? 'An unexpected error occurred.',
  //   };
  // }

  const supplementaryQuery = `
    mutation {
      ${createSubitemQuery},
      ${updateAdopteesQuery}
    }
  `;

  const response = await mondayApiClient.request(supplementaryQuery);

  // interpret subitem id
  let subitemId = '';
  try {
    const resObj = response as Record<string, unknown>;
    const createSubitemField = resObj.create_subitem as Record<string, string>;
    subitemId = createSubitemField.id;
  } catch (err) {
    Logger.error(`Error trying to interpret create_subitem response: ${err}`);
    return { success: false, error: 'An unexpected error occurred.' };
  }

  // update application record on supabase
  const { error: updateError } = await supabase
    .from('adopter_applications_dummy')
    .update({ exported_to_monday: true, monday_id: subitemId })
    .eq('app_uuid', appId);

  // would only error if app was deleted
  // or columns were renamed/deleted
  if (updateError) {
    Logger.error(`[CRITICAL] Error trying to update ${appId}: ${updateError}`);
    // NOTE: allow successful report to go through, since at least
    // the data reached the admins. If the push fails once,
    // chances are, it will fail again - the cause is likely permanent
    // and should be critical cause to investigate.
  }

  // mark adoptees as OFC on Supabase
  const supabaseService = await dangerous_getSupabaseServiceClient();
  const { error: updateAdopteesError } = await supabaseService
    .from('adoptee_vector_test')
    .update({ status: 'OUT_FOR_CONSIDERATION' })
    .in('id', appData.ranked_cards as Array<string>);

  if (updateAdopteesError) {
    Logger.error(
      `[CRITICAL] Error trying to update adoptees for ${appId}: ${updateAdopteesError}`,
    );
  }

  return { success: true };
};

export default exportApplication;
