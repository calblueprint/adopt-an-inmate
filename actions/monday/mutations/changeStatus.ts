'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import { getEnvVar } from '@/lib/utils';
import { mondayApiClient } from '../core';

/** Short codes for adoptee status on the WL PIPs Monday board (column status__1). */
export type AdopteeMondayStatusCode = 'WL' | 'OFC';

const LABEL_WL = 'WL: Wait Listed';
const LABEL_WLFA = 'WLFA: Wait Listed Formerly Adopted';
const LABEL_OFC = 'OFC: Out for Consideration';

/**
 * Builds the inner body of a Monday `mutation { ... }` that updates status__1
 * for each item (comma-separated `change_simple_column_value` operations).
 */
function buildStatusUpdateMutationInner(
  boardId: string,
  mondayItemIds: string[],
  labelForIndex: (itemId: string, index: number) => string,
): string {
  return mondayItemIds
    .map(
      (id, idx) =>
        `update${idx + 1}:change_simple_column_value(
          board_id: "${boardId}",
          item_id: "${id}",
          column_id: "status__1",
          value: "${labelForIndex(id, idx).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
        ) { id }`,
    )
    .join(',');
}

/**
 * Updates adoptee rows on the WL PIPs board (column `status__1`).
 *
 * - **OFC**: Returns only the comma-separated mutation body (no `mutation` wrapper) so it can be
 *   composed into a larger mutation (e.g. with `create_subitem`). Does not execute the API call.
 * - **WL**: Loads `formerly_adopted` from `adoptee_vector_test` for each id, sets Monday to
 *   `WLFA: Wait Listed Formerly Adopted` or `WL: Wait Listed` accordingly, executes the mutation,
 *   and returns the full `mutation { ... }` string (callers typically ignore it).
 */
export async function updateAdopteeMondayStatus(
  mondayItemIds: string[],
  status: AdopteeMondayStatusCode,
): Promise<string> {
  if (mondayItemIds.length === 0) {
    return '';
  }

  const boardId = getEnvVar('MONDAY_WL_PIPS_BOARD_ID');

  if (status === 'OFC') {
    return buildStatusUpdateMutationInner(
      boardId,
      mondayItemIds,
      () => LABEL_OFC,
    );
  }

  const supabase = await getSupabaseServerClient();
  const { data: rows, error } = await supabase
    .from('adoptee_vector_test')
    .select('id, formerly_adopted')
    .in('id', mondayItemIds);

  if (error) {
    throw new Error(
      `updateAdopteeMondayStatus (WL): failed to load formerly_adopted: ${error.message}`,
    );
  }

  const formerlyById = new Map(
    (rows ?? []).map(r => [r.id, Boolean(r.formerly_adopted)]),
  );

  const inner = buildStatusUpdateMutationInner(boardId, mondayItemIds, id =>
    formerlyById.get(id) ? LABEL_WLFA : LABEL_WL,
  );

  const fullMutation = `mutation { ${inner} }`;
  await mondayApiClient.request(fullMutation);
  return fullMutation;
}
