'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import { assertEnvVarExists } from '@/lib/utils';
import { mondayApiClient } from './core';

function isAdoptedStatusGroupTitle(groupTitle: string) {
  const t = groupTitle.trim();
  return (
    t.startsWith('A: Adopted') ||
    t.startsWith('B: Adopted') ||
    t.startsWith('AO: Adopted')
  );
}

interface MondayItemRow {
  id: string;
  group?: { title?: string };
  board?: { id?: string };
}

function parseMondayItemsResponse(response: unknown): MondayItemRow[] {
  const responseObj = response as Record<string, unknown>;
  const maybeData = 'data' in responseObj ? responseObj.data : responseObj;
  const dataObj = maybeData as Record<string, unknown>;
  const itemsMaybe = dataObj.items;
  return Array.isArray(itemsMaybe) ? (itemsMaybe as MondayItemRow[]) : [];
}

async function fetchMondayItemsByIds(ids: string[]): Promise<MondayItemRow[]> {
  const idsArg = ids.join(', ');
  const gpl = `query {
    items(ids: [${idsArg}]) {
      id
      group { title }
      board { id }
    }
  }`;

  const response = await mondayApiClient.request(gpl);
  return parseMondayItemsResponse(response);
}

export async function queryMatchedAdoptee(
  applicationId: string,
): Promise<{ matchedAdopteeId: string }> {
  assertEnvVarExists('MONDAY_ADOPTED_BOARD_ID');
  const adoptedBoardId = process.env.MONDAY_ADOPTED_BOARD_ID ?? '';

  const supabase = await getSupabaseServerClient();
  const { data: appData, error } = await supabase
    .from('adopter_applications_dummy')
    .select('ranked_cards')
    .eq('app_uuid', applicationId)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch ranked_cards: ${error.message}`);
  if (!appData)
    throw new Error(`Application not found for app_uuid=${applicationId}`);

  const rankedCards = appData.ranked_cards;
  if (
    !Array.isArray(rankedCards) ||
    rankedCards.length !== 4 ||
    !rankedCards.every((x): x is string => typeof x === 'string')
  ) {
    throw new Error(
      `Expected ranked_cards to be an array of exactly 4 strings (Monday item ids) for app_uuid=${applicationId}`,
    );
  }

  const candidateSet = new Set(rankedCards);
  const items = await fetchMondayItemsByIds(rankedCards);

  const adoptedMatches = items.filter(item => {
    if (!candidateSet.has(String(item.id))) return false;
    if (String(item.board?.id) !== String(adoptedBoardId)) return false;
    const title = item.group?.title ?? '';
    return isAdoptedStatusGroupTitle(title);
  });

  if (adoptedMatches.length !== 1) {
    throw new Error(
      `Expected exactly one ranked candidate on Adopted board with A:/B:/AO: status; found ${adoptedMatches.length} for app_uuid=${applicationId}`,
    );
  }

  return { matchedAdopteeId: String(adoptedMatches[0].id) };
}
