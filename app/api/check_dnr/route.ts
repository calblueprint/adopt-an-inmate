import { NextRequest } from 'next/server';
import Logger from '@/actions/logging';
import { mondayApiClient } from '@/actions/monday/core';
import { dangerous_getSupabaseServiceClient } from '@/lib/supabase/service';
import { getEnvVar } from '@/lib/utils';

const CRON_SECRET = getEnvVar('CRON_SECRET');
const MONDAY_ADOPTER_DATA_SUBITEM_BOARD_ID = getEnvVar(
  'MONDAY_ADOPTER_DATA_SUBITEM_BOARD_ID',
);
const MONDAY_WL_PIPS_BOARD_ID = getEnvVar('MONDAY_WL_PIPS_BOARD_ID');

export async function GET(request: NextRequest) {
  // check that this is issued by cron job
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // find apps waiting for confirmation and 2 weeks late
  const supabase = await dangerous_getSupabaseServiceClient();
  const now = new Date();

  const { data: dnrApps, error: getAppsError } = await supabase.rpc(
    'get_dnr_applications',
  );

  if (getAppsError) {
    Logger.error(`Error fetching DNR apps: ${getAppsError}`);
    return new Response('An unexpected error occurred.', { status: 500 });
  }

  if (!dnrApps || dnrApps.length === 0) {
    return new Response('No apps past confirmation deadline. Skipped.');
  }

  // map ids
  const dnrAppIds = dnrApps.map(app => app.app_uuid);

  const dnrMondayIds = dnrApps
    .map(app => app.app_monday_id)
    .filter(id => id !== null);

  const dnrAdopteeGroups = dnrApps
    .map(app => ({
      id: app.matched_adoptee,
      formerlyAdopted: app.formerly_adopted,
    }))
    .filter(adoptee => adoptee.id !== null);

  // db: update app status
  const { error: updateAppStatusError } = await supabase
    .from('adopter_applications_dummy')
    .update({
      status: 'REAPPLY',
      time_ended: now.toISOString(),
      ended_reason: 'Adopter DNR',
      time_confirmation_due: null,
      waiting_confirmation: false,
    })
    .in('app_uuid', dnrAppIds);

  if (updateAppStatusError) {
    Logger.error(
      `Error trying to update application statuses: ${updateAppStatusError.message}`,
    );
    return new Response('An unexpected error occurred.', { status: 500 });
  }

  // db: update adoptee status
  const { error: updateAdopteeStatusError } = await supabase
    .from('adoptee_vector_test')
    .update({ status: 'WAIT_LISTED' })
    .in(
      'id',
      dnrAdopteeGroups.map(g => g.id),
    );

  if (updateAdopteeStatusError) {
    Logger.error(
      `Error trying to update adoptee statuses: ${updateAdopteeStatusError.message}`,
    );
    return new Response('An unexpected error occurred.', { status: 500 });
  }

  // monday: update app status to DNR
  const generateUpdateStatusQuery = (id: string) => `
    app${id}:change_simple_column_value(
      board_id: ${MONDAY_ADOPTER_DATA_SUBITEM_BOARD_ID},
      item_id: ${id},
      column_id: "status",
      value: "DNR (Did Not Respond)"
    ) { id }
  `;

  const updateAppStatusQueries = dnrMondayIds.map(id =>
    generateUpdateStatusQuery(id),
  );

  // monday: update adoptee status to WL/WLFA
  const generateUpdateAdopteeStatusQuery = (
    id: string,
    formerlyAdopted: boolean,
  ) => `
    adoptee${id}:change_simple_column_value(
      board_id: "${MONDAY_WL_PIPS_BOARD_ID}",
      item_id: "${id}",
      column_id: "status__1",
      value: "${formerlyAdopted ? 'WLFA: Wait Listed Formerly Adopted' : 'WL: Wait Listed'}"
    ) { id }
  `;

  const updateAdopteeStatusQueries = dnrAdopteeGroups.map(g =>
    generateUpdateAdopteeStatusQuery(g.id, g.formerlyAdopted),
  );

  const query = `
    mutation {
      ${updateAppStatusQueries.join('\n')}
      ${updateAdopteeStatusQueries.join('\n')}
    }
  `;

  try {
    await mondayApiClient.request(query);
  } catch (error) {
    Logger.error(
      `Error trying to update adoptee and app status on Monday: ${error}`,
    );
    return new Response('An unexpected error occurred.', { status: 500 });
  }

  return new Response('Success.');
}
