import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Logger from '@/actions/logging';
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
