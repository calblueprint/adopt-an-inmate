'use server';

import Logger from '@/actions/logging';
import { CONFIG } from '@/config';
import { capitalize } from '@/lib/formatters';
import { getSupabaseServerClient } from '@/lib/supabase';
import { assertEnvVarExists, getEnvVar } from '@/lib/utils';
import { mondayApiClient } from '../core';

// assert env var exists at system level to trigger
// error messages at build time (rather than run time)
// => alert us to setup these env vars before the function needs them
assertEnvVarExists('MONDAY_ADOPTER_DATA_BOARD_ID');
assertEnvVarExists('MONDAY_ADOPTER_DATA_WAITING_GROUP_ID');

const exportApplication = async (appId: string) => {
  if (!CONFIG.enableMondayMutations)
    return { success: false, error: 'Forbidden action.' };

  // WARNING: this will throw an error if the environment variable
  // is not set correctly. If there is an error during deployment,
  // ensure these variables are defined in the server environment settings
  const boardId = getEnvVar('MONDAY_ADOPTER_DATA_BOARD_ID');
  const groupId = getEnvVar('MONDAY_ADOPTER_DATA_WAITING_GROUP_ID');

  const supabase = await getSupabaseServerClient();

  // get logged in user
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();
  if (getUserError || !user) {
    Logger.error(
      `Error trying to get user when exporting Monday application ${appId}.`,
    );
    return { success: false, error: 'Failed to identify user.' };
  }

  // fetch app data from database
  const { data: appDataList, error: rpcFuncError } = await supabase.rpc(
    'get_user_and_application',
    { app_id: appId },
  );

  // unexpected error
  if (rpcFuncError) {
    Logger.error(
      `Error trying to invoke get_user_and_application(${appId}): ${rpcFuncError.message}`,
    );
    return { success: false };
  }

  // app not found
  if (appDataList.length === 0) {
    Logger.warn(`Could not find application with ID ${appId}`);
    return { success: false, error: 'Could not find application.' };
  }

  const appData = appDataList[0];

  // cross-check logged in user email with app id
  if (user.id != appData.user_id) {
    return { success: false, error: 'User ID mismatch.' };
  }

  // maps human-readable column names
  // to the column IDs on Monday.com
  const columnMap = {
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
  };

  // calculations to build the column values
  // for the adopter profile row (i.e. main item)
  const currentTime = new Date();
  const currentDateISOString = currentTime.toISOString().split('T')[0]; // ex: 2026-02-22
  const capitalizedPronouns = appData.pronouns
    .split('/')
    .map(p => capitalize(p))
    .join(' / ');

  const mainColumnValues: Partial<Record<keyof typeof columnMap, unknown>> = {
    email: { email: user.email, text: user.email },
    added_time: currentDateISOString,
    current_status: 'Pending',
    date_of_birth: appData.date_of_birth,
    first_name: appData.first_name,
    last_name: appData.last_name,
    location: { lat: 0, lng: 0, address: appData.state },
    pronouns: capitalizedPronouns,
    veteran_status: appData.veteran_status ? 'Yes' : 'No',
    gender_preference: appData.gender_pref,
    notes: appData.personal_bio,
  };

  // translate key in mainColumnValues
  // into the Monday.com column IDs
  const processedMainColumnValues = Object.entries(mainColumnValues).reduce(
    (agg: Record<string, unknown>, [key, val]) => {
      const k = key as keyof typeof columnMap;
      agg[columnMap[k]] = val;
      return agg;
    },
    {},
  );

  // calculations to build column values for the application(s)

  // query to create new main item (i.e. adopter row)
  const mainItemQuery = `
    mutation {
      create_item(
        board_id: "${boardId}",
        group_id: "${groupId}",
        item_name: "${user.email}",
        create_labels_if_missing: true,
        column_values: "${JSON.stringify(processedMainColumnValues).replaceAll('"', '\\"')}"
      ) { id }
    }
  `;

  // execute queries
  try {
    // create monday item
    const response = await mondayApiClient.request(mainItemQuery);
    if (!response) throw new Error('No response received');

    // extract item ID after query success
    const createItemField = (response as Record<string, unknown>).create_item;
    if (!createItemField) throw new Error('Response has no create_item field');

    const itemId = (createItemField as Record<string, string>).id;
    if (!itemId) throw new Error('Response has no item id');

    // mark as exported on supabase
    let attempts = 3;

    // max 3 attempts to mark to supabase before giving up
    while (attempts > 0) {
      const { error: updateError } = await supabase
        .from('adopter_applications_dummy')
        .update({ exported_to_monday: true })
        .eq('app_uuid', appId);

      if (updateError) {
        attempts--;
        Logger.error(
          `Error marking application ${appId} as already exported to Monday. Attempt ${3 - attempts}/3`,
        );
      } else {
        break;
      }
    }

    return { success: true, id: itemId };
  } catch (error) {
    // handle error reporting
    Logger.error(`Error inserting to Monday: ${error}`);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export default exportApplication;
