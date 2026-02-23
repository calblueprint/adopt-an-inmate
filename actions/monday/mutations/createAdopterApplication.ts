'use server';

import Logger from '@/actions/logging';
import { capitalize } from '@/lib/formatters';
import { getSupabaseServerClient } from '@/lib/supabase';
import { getEnvVar } from '@/lib/utils';
import { AdopterApplication, Profile } from '@/types/schema';
import { mondayApiClient } from '../core';

const createAdopterApplication = async (
  profile: Profile,
  application: AdopterApplication,
) => {
  // WARNING: this will throw an error if the environment variable
  // is not set correctly. If there is an error during deployment,
  // ensure these variables are defined in the server environment settings
  const boardId = getEnvVar('MONDAY_ADOPTER_DATA_BOARD_ID');
  const groupId = getEnvVar('MONDAY_ADOPTER_DATA_WAITING_GROUP_ID');

  // fetch email from cookies
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Invalid credentials.' };

  const email = user.email;

  // TODO: fetch application instead of receiving it
  // as a function parameter.

  // TODO: check against database to prevent duplicated
  // calls to push to Monday.com database.

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
  const capitalizedPronouns = profile.pronouns
    .split('/')
    .map(p => capitalize(p))
    .join(' / ');

  const mainColumnValues: Partial<Record<keyof typeof columnMap, unknown>> = {
    email: { email, text: email },
    added_time: currentDateISOString,
    current_status: 'Pending',
    date_of_birth: profile.date_of_birth,
    first_name: profile.first_name,
    last_name: profile.last_name,
    location: { lat: 0, lng: 0, address: profile.state },
    pronouns: capitalizedPronouns,
    veteran_status: profile.veteran_status ? 'Yes' : 'No',
    gender_preference: application.gender_pref,
    notes: application.personal_bio,
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
        item_name: "${email}",
        create_labels_if_missing: true,
        column_values: "${JSON.stringify(processedMainColumnValues).replaceAll('"', '\\"')}"
      ) { id }
    }
  `;

  // execute queries
  try {
    // extract item ID after query success
    const response = await mondayApiClient.request(mainItemQuery);
    if (!response) throw new Error('No response received');

    const createItemField = (response as Record<string, unknown>).create_item;
    if (!createItemField) throw new Error('Response has no create_item field');

    const itemId = (createItemField as Record<string, string>).id;
    if (!itemId) throw new Error('Response has no item id');

    return { success: true, id: itemId };
  } catch (error) {
    // handle error reporting
    Logger.error(`Error inserting to Monday: ${error}`);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export default createAdopterApplication;
