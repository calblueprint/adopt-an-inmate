'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { assertEnvVarExists, getEnvVar } from '@/lib/utils';
import Logger from '../logging';
import { mondayApiClient } from './core';

assertEnvVarExists('MONDAY_WL_PIPS_BOARD_ID');
assertEnvVarExists('MONDAY_ADOPTED_BOARD_ID');

const MONDAY_WL_PIPS_BOARD_ID = getEnvVar('MONDAY_WL_PIPS_BOARD_ID');
const MONDAY_ADOPTED_BOARD_ID = getEnvVar('MONDAY_ADOPTED_BOARD_ID');

export type MatchedAdopteeResult = {
  data: {
    matchedAdopteeId: string;
    unmatchedAdopteeIds: string[];
  } | null;
  error: string | null;
};

type MondayResponse = {
  items: {
    id: string;
    board: {
      id: string;
    };
  }[];
};

/**
 * Checks whether given item IDs exist in either the adopted or waitlist boards.
 * Ensures exactly one item is in the adopted board.
 * Returns a map of item IDs to whether they exist in the adopted board.
 */
async function validateItemIds(
  adoptedBoardId: string,
  wlBoardId: string,
  itemIds: string[],
): Promise<{ data: Record<string, boolean> | null; error: string | null }> {
  if (itemIds.length === 0) {
    return { data: {}, error: null };
  }

  const query = `
    query ($ids: [ID!]!) {
      items(ids: $ids) {
        id
        board {
          id
        }
      }
    }
  `;

  const exists: Record<string, boolean> = {};
  for (const id of itemIds) {
    exists[id] = false;
  }

  const response = await mondayApiClient.request<MondayResponse>(query, {
    ids: itemIds,
  });

  if (!response || !response.items) {
    Logger.warn(`Unexpected response from Monday: ${JSON.stringify(response)}`);
    return { data: null, error: 'An unexpected error occurred.' };
  }

  const returnedItems = response.items;

  let numAdopted = 0;
  let numWL = 0;

  for (const item of returnedItems) {
    const isAdopted = item.board.id === adoptedBoardId;
    const isWL = item.board.id === wlBoardId;

    if (!isAdopted && !isWL) {
      Logger.warn(`Item ${item.id} is in unexpected board ${item.board.id}`);
      return { data: null, error: 'An unexpected error occurred.' };
    }

    if (isAdopted) {
      exists[item.id] = true;
      numAdopted += 1;
    } else if (isWL) {
      numWL += 1;
    }
  }

  if (numAdopted > 1) {
    Logger.warn(
      `More than one item is in the adopted board: ${JSON.stringify(exists)}`,
    );
    return { data: null, error: 'An unexpected error occurred.' };
  }

  if (numWL === itemIds.length) {
    Logger.warn(`All items are in the WL board: ${JSON.stringify(exists)}`);
    return { data: null, error: 'An unexpected error occurred.' };
  }

  return { data: exists, error: null };
}

/**
 * Retrieves adoptee candidates for an application and determines
 * the single matched adoptee along with unmatched candidates.
 */
export async function queryMatchedAdoptees(
  applicationId: string,
): Promise<MatchedAdopteeResult> {
  const supabase = await getSupabaseServerClient();
  const { data: appData, error } = await supabase
    .from('adopter_applications_dummy')
    .select('ranked_cards')
    .eq('app_uuid', applicationId)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch ranked_cards: ${error.message}`);

  const candidateIds: string[] = appData?.ranked_cards ?? [];

  if (candidateIds.length === 0) {
    Logger.warn(`No candidate IDs found for application ${applicationId}`);
    return { data: null, error: 'An unexpected error occurred.' };
  }

  const { data: candsExist, error: candsExistError } = await validateItemIds(
    MONDAY_ADOPTED_BOARD_ID,
    MONDAY_WL_PIPS_BOARD_ID,
    candidateIds,
  );

  if (!candsExist || candsExistError) {
    Logger.error(
      `Error checking if candidates exist in board: ${candsExistError}`,
    );
    return { data: null, error: 'An unexpected error occurred.' };
  }

  const unmatchedAdopteeIds = [];
  let matchedAdopteeId = null;

  for (const id of candidateIds) {
    if (candsExist?.[id]) {
      matchedAdopteeId = id;
    } else {
      unmatchedAdopteeIds.push(id);
    }
  }

  if (!matchedAdopteeId) {
    Logger.error(
      `No matched adoptee found for application ${applicationId} with candidateIds ${candidateIds}`,
    );
    return { data: null, error: 'An unexpected error occurred.' };
  }

  return { data: { matchedAdopteeId, unmatchedAdopteeIds }, error: null };
}
