'use server';

import { parseMondayValue } from '@/lib/monday/parser';
import { assertEnvVarExists } from '@/lib/utils';
import { Profile } from '@/types/schema';
import { mondayApiClient } from './core';

assertEnvVarExists('BOARD_ID');
assertEnvVarExists('GROUP_ID');

export const createRow = async (profile: Profile) => {
  const boardId = process.env.BOARD_ID ?? '';
  const groupId = process.env.GROUP_ID ?? '';

  const columnIdTranslation = {
    email: 'email_mkxah5b2',
    first_name: 'text_mkxaz93r',
    last_name: 'text_mkxa4ctx',
    date_of_birth: 'date_mkxagkrj',
    pronouns: 'color_mkxag5bm',
    state: 'location_mkxage9t',
    veteran_status: 'dropdown_mkxa18jg',
    user_id: '', // blank on purpose
  };

  // process veteran status from boolean to "yes" or "no"
  const processedProfile: Record<string, string> = Object.entries(
    profile,
  ).reduce((agg: Record<string, string>, [key, val]) => {
    if (key === 'veteran_status') agg[key] = val ? 'yes' : 'no';
    else agg[key] = val as string;
    return agg;
  }, {});

  // translate keys to column ids
  // process values according to monday types
  const parsedProfile = Object.entries(processedProfile).reduce(
    (agg: Record<string, unknown>, [key, val]) => {
      const translatedKey = columnIdTranslation[key as keyof Profile];
      if (!translatedKey) return agg;

      const [type] = translatedKey.split('_');
      agg[translatedKey] = parseMondayValue(val, type);

      return agg;
    },
    {},
  );

  const gpl = `mutation { create_item(board_id: "${boardId}", group_id: "${groupId}", item_name: "Incoming form answer", create_labels_if_missing: true, column_values: "${JSON.stringify(parsedProfile).replaceAll('"', '\\"')}") { id } }`;

  try {
    await mondayApiClient.request(gpl);
    return { success: true };
  } catch (error) {
    return { success: false, error: new String(error) };
  }
};
