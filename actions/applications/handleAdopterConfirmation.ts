'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import { dangerous_getSupabaseServiceClient } from '@/lib/supabase/service';
import { getEnvVar } from '@/lib/utils';
import autoEmailSender from '../emails/email';
import Logger from '../logging';
import { mondayApiClient } from '../monday/core';

const MONDAY_WL_PIPS_BOARD_ID = getEnvVar('MONDAY_WL_PIPS_BOARD_ID');
const MONDAY_ADOPTER_DATA_SUBITEM_BOARD_ID = getEnvVar(
  'MONDAY_ADOPTER_DATA_SUBITEM_BOARD_ID',
);

export const handleAdopterConfirmation = async ({
  accepted,
  adopterId,
  email,
  adopteeMondayId,
  appId,
  appMondayId,
  reason,
}: {
  accepted: boolean;
  adopterId: string;
  email: string;
  adopteeMondayId: string;
  appId: string;
  appMondayId: string;
  reason?: string;
}) => {
  if (accepted) {
    // monday: update adoptee formerly adopted status
    const query = `
      mutation {
        change_simple_column_value(
          board_id: "${MONDAY_WL_PIPS_BOARD_ID}",
          item_id: "${adopteeMondayId}",
          column_id: "color_mm1pq72v",
          value: "Yes"
        ) { id }
      }
    `;

    try {
      await mondayApiClient.request(query);
    } catch (error) {
      Logger.error(
        `Error trying to update adoptee's formerly adopted status on Monday: ${error}`,
      );
      return { error: 'An unexpected error occurred.' };
    }

    // db: update adopter application status
    const supabase = await getSupabaseServerClient();
    const { error: updateAppError } = await supabase
      .from('adopter_applications_dummy')
      .update({
        status: 'ACTIVE',
        waiting_confirmation: false,
        time_confirmation_due: null,
        time_started: new Date().toISOString(),
      })
      .eq('app_uuid', appId);

    if (updateAppError) {
      Logger.error(
        `Error updating app status for ${appId}: ${updateAppError.message}`,
      );
      return { error: 'An unexpected error occurred.' };
    }

    // db: update adoptee status
    const supabaseService = await dangerous_getSupabaseServiceClient();
    const { error: updateAdopteeError } = await supabaseService
      .from('adoptee_vector_test')
      .update({ status: 'ADOPTED', formerly_adopted: true })
      .eq('id', adopteeMondayId);

    if (updateAdopteeError) {
      Logger.error(
        `Error updating adoptee status for ${adopteeMondayId}: ${updateAdopteeError.message}`,
      );
      return { error: 'An unexpected error occurred.' };
    }
  } else if (!reason) {
    return { error: 'A reason is required for rejecting match.' };
  } else {
    // db: update app status
    const supabase = await getSupabaseServerClient();
    const now = new Date();

    const { error: updateAppError } = await supabase
      .from('adopter_applications_dummy')
      .update({
        status: 'ENDED',
        time_ended: now.toISOString(),
        ended_reason: reason,
        time_confirmation_due: null,
        waiting_confirmation: false,
      })
      .eq('app_uuid', appId);

    if (updateAppError) {
      Logger.error(`Error updating app ${appId}: ${updateAppError.message}`);
      return { error: 'An unexpected error occurred.' };
    }

    // db: update adoptee status
    const supabaseService = await dangerous_getSupabaseServiceClient();

    const { error: updateAdopteeError } = await supabaseService
      .from('adoptee_vector_test')
      .update({ status: 'WAIT_LISTED' })
      .eq('id', adopteeMondayId);

    if (updateAdopteeError) {
      Logger.error(
        `Error updating adoptee status ${adopteeMondayId}: ${updateAdopteeError.message}`,
      );
      return { error: 'An unexpected error occurred.' };
    }

    // monday: update adoptee status
    const { data: adoptee, error: getAdopteeError } = await supabaseService
      .from('adoptee_vector_test')
      .select('id, formerly_adopted, inmate_id')
      .eq('id', adopteeMondayId)
      .maybeSingle();

    if (getAdopteeError) {
      Logger.error(
        `Error getting formerly adopted status from adoptee ${adopteeMondayId}: ${getAdopteeError.message}`,
      );
      return { error: 'An unexpected error occurred.' };
    }

    if (!adoptee) {
      Logger.error(
        `No adoptee row found for adoptee ${adopteeMondayId}, matched to app ${appId}`,
      );
      return { error: 'An unexpected error occurred.' };
    }

    // monday: update app status
    const query = `
      mutation {
        app:change_simple_column_value(
          board_id: "${MONDAY_ADOPTER_DATA_SUBITEM_BOARD_ID}",
          item_id: "${appMondayId}",
          column_id: "status",
          value: "Closed Out"
        ) { id }
        adoptee:change_simple_column_value(
          board_id: "${MONDAY_WL_PIPS_BOARD_ID}",
          item_id: "${adopteeMondayId}",
          column_id: "status__1",
          value: "${adoptee.formerly_adopted ? 'WLFA: Wait Listed Formerly Adopted' : 'WL: Wait Listed'}"
        ) { id }
      }
    `;

    try {
      await mondayApiClient.request(query);
    } catch (error) {
      Logger.error(`Error updating Monday adoptee and app status: ${error}`);
      return { error: 'An unexpected error occurred.' };
    }

    // send email to admins
    const emailContent = `
      Dear Adopt an Inmate team,

      An adopter rejected their match. Here are the details:
      - Adopter: ${email} (ID: ${adopterId})
      - Adoptee: ${adoptee.inmate_id} (ID: ${adopteeMondayId})
      - Timestamp: ${now.toLocaleTimeString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })} (UTC+0)
      - Reason: "${reason}"

      This is an automated email sent by the Adopt an Inmate web server. Please do not reply.
    `;

    await autoEmailSender(
      emailContent,
      'An adopter rejected a match',
      'adopt@adoptaninmate.org',
    );
  }

  return { error: null };
};
