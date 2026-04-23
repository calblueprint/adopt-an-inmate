import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Logger from '@/actions/logging';
import { updateAdopteeMondayStatus } from '@/actions/monday/mutations/changeStatus';
import { queryMatchedAdoptees } from '@/actions/monday/queryMatchedAdoptee';
import { dangerous_getSupabaseServiceClient } from '@/lib/supabase/service';
import { assertEnvVarExists, getEnvVar } from '@/lib/utils';
import { ApplicationStatusEnum } from '@/types/schema';

assertEnvVarExists('MONDAY_SIGNING_SECRET');

export async function POST(request: NextRequest) {
  const signingSecret = getEnvVar('MONDAY_SIGNING_SECRET');

  const authHeader = request.headers.get('authorization');
  if (!authHeader) return new NextResponse(request.body);

  // verify jwt from request auth header
  try {
    jwt.verify(authHeader, signingSecret);
  } catch (error) {
    Logger.error(`Error decoding JWT from Monday webhook: ${error}`);
    return new NextResponse(request.body);
  }

  // parse events
  const data = await request.json();

  let appMondayId: string;
  let status: ApplicationStatusEnum;
  try {
    const { inputFields } = data.payload as Record<string, unknown>;
    const { subitemId, subitemStatus } = inputFields as Record<string, string>;

    // map item status code
    const statusCodeMap: Record<string, ApplicationStatusEnum> = {
      8: 'PENDING_CONFIRMATION',
      4: 'REJECTED',
      1: 'REAPPLY',
    };

    status = statusCodeMap[subitemStatus];
    appMondayId = subitemId;
  } catch (error) {
    Logger.error(`Error parsing webhook data: ${error}`);
    return Response.json({ data });
  }

  Logger.log(
    `Updating application with Monday ID ${appMondayId} to status ${status}`,
  );

  // update app status
  const supabase = await dangerous_getSupabaseServiceClient();
  const { error: updateError } = await supabase
    .from('adopter_applications_dummy')
    .update({ status })
    .eq('monday_id', appMondayId);

  if (updateError) {
    Logger.error(`Error updating Supabase application status: ${updateError}`);
    return Response.json({ data });
  }

  // if status is PENDING_CONFIRMATION, find and store matched adoptee
  if (status === 'PENDING_CONFIRMATION') {
    // fetch the application to get its app_uuid
    const { data: appData, error: fetchError } = await supabase
      .from('adopter_applications_dummy')
      .select('app_uuid')
      .eq('monday_id', appMondayId)
      .maybeSingle();

    if (fetchError || !appData) {
      Logger.error(
        `Error fetching application for monday_id ${appMondayId}: ${fetchError?.message}`,
      );
      return Response.json({ data });
    }

    // call Niranjana's query to find matched adoptee
    const { data: matchResult, error: matchError } = await queryMatchedAdoptees(
      appData.app_uuid,
    );

    if (matchError || !matchResult) {
      Logger.error(
        `Error finding matched adoptee for app ${appData.app_uuid}: ${matchError}`,
      );
      return Response.json({ data });
    }

    const { matchedAdopteeId, unmatchedAdopteeIds } = matchResult;

    // calculate time_confirmation_due: midnight UTC 2 weeks from now
    const confirmationDue = new Date();
    confirmationDue.setUTCDate(confirmationDue.getUTCDate() + 14);
    confirmationDue.setUTCHours(0, 0, 0, 0);

    // update application with matched adoptee, confirmation due date, and waiting_confirmation
    const { error: appUpdateError } = await supabase
      .from('adopter_applications_dummy')
      .update({
        matched_adoptee: matchedAdopteeId,
        time_confirmation_due: confirmationDue.toISOString(),
        waiting_confirmation: true,
      })
      .eq('app_uuid', appData.app_uuid);

    if (appUpdateError) {
      Logger.error(
        `Error updating matched adoptee for app ${appData.app_uuid}: ${appUpdateError.message}`,
      );
    }

    // mark matched adoptee as ADOPTED in adoptee_vector_test
    const { error: adoptedError } = await supabase
      .from('adoptee_vector_test')
      .update({ status: 'ADOPTED' })
      .eq('id', matchedAdopteeId);

    if (adoptedError) {
      Logger.error(
        `Error marking adoptee ${matchedAdopteeId} as ADOPTED: ${adoptedError.message}`,
      );
    }

    // mark unmatched adoptees as WAIT_LISTED in adoptee_vector_test and on Monday WL PIPs board
    if (unmatchedAdopteeIds.length > 0) {
      const { error: wlError } = await supabase
        .from('adoptee_vector_test')
        .update({ status: 'WAIT_LISTED' })
        .in('id', unmatchedAdopteeIds);

      if (wlError) {
        Logger.error(
          `Error marking unmatched adoptees as WAIT_LISTED: ${wlError.message}`,
        );
      }

      // update unmatched adoptees status on Monday WL PIPs board
      try {
        await updateAdopteeMondayStatus(unmatchedAdopteeIds, 'WL');
      } catch (e) {
        Logger.error(
          `Error updating unmatched adoptees on Monday WL PIPs board: ${e}`,
        );
      }
    }

    Logger.log(
      `Successfully processed PENDING_CONFIRMATION for app ${appData.app_uuid}. Matched: ${matchedAdopteeId}, Unmatched: ${unmatchedAdopteeIds}`,
    );
  }

  // // send error notification
  // const errorPayload = {
  //   success: false,
  //   severityCode: 4000,
  //   notificationErrorTitle: 'Failed to update status',
  //   notificationErrorDescription:
  //     "Couldn't identify which adoptee was matched. Did you update the adoptee's status?",
  //   runtimeErrorDescription: 'Webhook failed to identify matched adoptee',
  // };

  // // respond to received
  // const resp = new Response(JSON.stringify(errorPayload), {
  //   status: 404,
  //   statusText: 'Not Found',
  // });

  return Response.json({ data });
}
