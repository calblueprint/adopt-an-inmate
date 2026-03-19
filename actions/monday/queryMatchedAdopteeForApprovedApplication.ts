'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import { assertEnvVarExists } from '@/lib/utils';
import { RankedAdopteeMatch } from '@/types/schema';
import { mondayApiClient } from './core';

export type MatchedAdopteeResult = {
  matchedAdopteeId: string;
  unmatchedAdopteeIds: string[];
};

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

type MondayItem = {
  id: string;
  group?: {
    title?: string | null;
  } | null;
};

async function fetchCandidateIdsFromBoard(params: {
  boardId: string;
  candidateIds: Set<string>;
  groupTitlePredicate: (groupTitle: string) => boolean;
  maxFound: number;
}) {
  const { boardId, candidateIds, groupTitlePredicate, maxFound } = params;

  const found = new Set<string>();
  let cursor: string | null = null;

  // Avoid infinite loops if Monday returns unexpected cursor behavior.
  for (let page = 0; page < 50 && found.size < maxFound; page++) {
    const cursorArg = cursor ? `cursor: "${cursor}"` : '';
    const itemsPageArgs = cursorArg ? `limit: 100, ${cursorArg}` : 'limit: 100';

    const gpl = `query {
      boards(ids: ${boardId}) {
        items_page(${itemsPageArgs}) {
          cursor
          items {
            id
            group { title }
          }
        }
      }
    }`;

    const response = await mondayApiClient.request(gpl);

    const responseObj = response as Record<string, unknown>;
    const maybeData = 'data' in responseObj ? responseObj.data : responseObj;
    const dataObj = maybeData as Record<string, unknown>;

    const boardsMaybe = dataObj.boards;
    const boardsArray = Array.isArray(boardsMaybe) ? boardsMaybe : [];
    const firstBoard = boardsArray[0] as Record<string, unknown> | undefined;
    const itemsPageMaybe = firstBoard?.['items_page'] as
      | Record<string, unknown>
      | undefined;

    const itemsMaybe = itemsPageMaybe?.items;
    const itemsArray = Array.isArray(itemsMaybe) ? itemsMaybe : [];

    const items: MondayItem[] = itemsArray as MondayItem[];

    for (const item of items) {
      if (!candidateIds.has(String(item.id))) continue;

      const groupTitle = item.group?.title ?? '';
      if (!groupTitle) continue;

      if (groupTitlePredicate(String(groupTitle))) {
        found.add(String(item.id));
        if (found.size >= maxFound) break;
      }
    }

    const cursorMaybe = itemsPageMaybe?.['cursor'];
    cursor = typeof cursorMaybe === 'string' ? cursorMaybe : null;
    if (!cursor) break;
  }

  return found;
}

export async function queryMatchedAdopteeForApprovedApplication(
  applicationId: string,
): Promise<MatchedAdopteeResult> {
  const wlBoardId = process.env.MONDAY_WL_PIPS_BOARD_ID ?? '';
  const adoptedBoardId = process.env.MONDAY_ADOPTED_BOARD_ID ?? '';

  assertEnvVarExists('MONDAY_WL_PIPS_BOARD_ID');
  assertEnvVarExists('MONDAY_ADOPTED_BOARD_ID');

  const supabase = await getSupabaseServerClient();
  const { data: appData, error } = await supabase
    .from('adopter_applications_dummy')
    .select('ranked_cards')
    .eq('app_uuid', applicationId)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch ranked_cards: ${error.message}`);
  if (!appData)
    throw new Error(`Application not found for app_uuid=${applicationId}`);

  const rankedCards = appData.ranked_cards as RankedAdopteeMatch[] | null;
  if (!rankedCards || !Array.isArray(rankedCards) || rankedCards.length !== 4) {
    throw new Error(
      `Expected ranked_cards to contain exactly 4 adoptee ids for app_uuid=${applicationId}`,
    );
  }

  // ranked_cards.id stores the Monday item id (as per testing guidance).
  const candidateIds = uniqueStrings(rankedCards.map(c => String(c.id)));
  const candidateSet = new Set(candidateIds);

  // 1) Check WL PIPs first to confirm the 3 non-matched adoptees are still OFC.
  const ofcTitlePredicate = (groupTitle: string) =>
    groupTitle.trim().startsWith('OFC:');

  const wlFound = await fetchCandidateIdsFromBoard({
    boardId: wlBoardId,
    candidateIds: candidateSet,
    groupTitlePredicate: ofcTitlePredicate,
    maxFound: 3,
  });

  // If 3 candidates exist in OFC, the remaining 4th is the matched one.
  if (wlFound.size === 3) {
    const matched = candidateIds.find(id => !wlFound.has(id));
    if (!matched) {
      throw new Error(
        'Inconsistent state: wlFound size was 3 but no unmatched candidate found.',
      );
    }

    const unmatchedAdopteeIds = candidateIds.filter(id => id !== matched);
    return { matchedAdopteeId: matched, unmatchedAdopteeIds };
  }

  // 2) Fallback: check Adopted board for the matched adoptee.
  const adoptedTitlePredicate = (groupTitle: string) => {
    const t = groupTitle.trim();
    return (
      t.startsWith('A: Adopted') ||
      t.startsWith('B: Adopted') ||
      t.startsWith('AO: Adopted')
    );
  };

  const adoptedFound = await fetchCandidateIdsFromBoard({
    boardId: adoptedBoardId,
    candidateIds: candidateSet,
    groupTitlePredicate: adoptedTitlePredicate,
    maxFound: 1,
  });

  if (adoptedFound.size !== 1) {
    throw new Error(
      `Could not uniquely determine matched adoptee. matchedFound=${Array.from(
        adoptedFound,
      ).join(
        ',',
      )} wlFound=${Array.from(wlFound).join(',')} candidates=${candidateIds.join(',')}`,
    );
  }

  const matchedAdopteeId = Array.from(adoptedFound)[0];
  const unmatchedAdopteeIds = candidateIds.filter(
    id => id !== matchedAdopteeId,
  );

  return { matchedAdopteeId, unmatchedAdopteeIds };
}
