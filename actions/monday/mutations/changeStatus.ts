'use server';

import Logger from '@/actions/logging';
import { dangerous_getSupabaseServiceClient } from '@/lib/supabase/service';
import { assertEnvVarExists } from '@/lib/utils';
import { mondayApiClient } from '../core';

assertEnvVarExists('MONDAY_WL_PIPS_BOARD_ID');

const MONDAY_WL_PIPS_BOARD_ID = process.env.MONDAY_WL_PIPS_BOARD_ID ?? ''; //store env var

export type MondayAdopteeStatus = 'WL' | 'OFC'; //restricts to 2 values

const OFC_STATUS_LABEL = 'OFC: Out for Consideration';
const WL_STATUS_LABEL = 'WL: Wait Listed';
const WLFA_STATUS_LABEL = 'WLFA: Wait Listed Formerly Adopted';

//build mutation operations
function buildStatusMutationFields(
  adopteeMondayIds: string[],
  statusLabelsById: Record<string, string>,
) {
  return adopteeMondayIds
    .map((id, idx) => {
      const value = statusLabelsById[id];
      return `update${idx + 1}:change_simple_column_value(
        board_id: "${MONDAY_WL_PIPS_BOARD_ID}",
        item_id: "${id}",
        column_id: "status__1",
        value: "${value}"
      ) { id }`;
    })
    .join(',');
}

//determine if adoptee is formerly adopted
async function getWaitListStatusLabels(adopteeMondayIds: string[]) {
  const supabaseService = await dangerous_getSupabaseServiceClient();
  const { data, error } = await supabaseService
    .from('adoptee_vector_test')
    .select('id, formerly_adopted')
    .in('id', adopteeMondayIds);

  if (error) {
    //if no ids
    throw new Error(`Failed to fetch formerly_adopted flags: ${error.message}`);
  }

  //2 step process to avoid O(N^2) - faster lookup with Map
  const formerlyAdoptedById = new Map(
    (data ?? []).map(row => [String(row.id), Boolean(row.formerly_adopted)]),
  );

  return adopteeMondayIds.reduce(
    (acc, id) => {
      acc[id] = formerlyAdoptedById.get(id)
        ? WLFA_STATUS_LABEL
        : WL_STATUS_LABEL;
      return acc;
    },
    {} as Record<string, string>,
  );
}

//main function
export async function updateAdopteeMondayStatus(
  adopteeMondayIds: string[],
  status: MondayAdopteeStatus,
) {
  if (adopteeMondayIds.length === 0) return '';

  const uniqueAdopteeMondayIds = Array.from(adopteeMondayIds);

  const statusLabelsById =
    status === 'WL'
      ? await getWaitListStatusLabels(uniqueAdopteeMondayIds)
      : Object.fromEntries(
          //for not string string
          uniqueAdopteeMondayIds.map(id => [id, OFC_STATUS_LABEL]),
        );

  const mutationFields = buildStatusMutationFields(
    uniqueAdopteeMondayIds,
    statusLabelsById,
  );

  //only run if WL to avoid extra queries
  if (status === 'WL') {
    const mutationQuery = ` 
      mutation {
        ${mutationFields}
      }
    `;

    try {
      await mondayApiClient.request(mutationQuery);
    } catch (error) {
      Logger.error(
        `Failed to update adoptee Monday status to WL for ids ${uniqueAdopteeMondayIds.join(',')}: ${error}`,
      );
      throw error;
    }
  }

  return mutationFields;
}
