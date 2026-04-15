'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import { dangerous_getSupabaseServiceClient } from '@/lib/supabase/service';
import { getEnvVar } from '@/lib/utils';
import autoEmailSender from '../emails/email';
import Logger from '../logging';
import { mondayApiClient } from '../monday/core';

const MONDAY_WL_PIPS_BOARD_ID = getEnvVar('MONDAY_WL_PIPS_BOARD_ID');
const MONDAY_ADOPTER_DATA_BOARD_ID = getEnvVar('MONDAY_ADOPTER_DATA_BOARD_ID');

export const handleAdopterConfirmation = async (
  accepted: boolean,
  adopterId: string,
  adopteeMondayId: string,
  appId: string,
  appMondayId: string,
  reason?: string,
) => {
  if (accepted) {
    // monday: update adoptee formerly adopted status
    const query = `
      mutation {
        change_simple_column_value(
          board_id: "${MONDAY_WL_PIPS_BOARD_ID}",
          item_id: "${adopteeMondayId}",
          column_id: "color_mm1pq72v",
          value: "Yes"
        ) {}
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
      .update({ status: 'ACTIVE' })
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
      .update({ status: 'ADOPTED' })
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
    // monday: update adoptee status
    // TODO: use function to update adoptee status

    // monday: update app status
    const query = `
      mutation {
        change_simple_column_value(
          board_id: "${MONDAY_ADOPTER_DATA_BOARD_ID}",
          item_id: "${appMondayId}",
          column_id: "status",
          value: "Closed Out"
        ) {}
      }
    `;

    try {
      await mondayApiClient.request(query);
    } catch (error) {
      Logger.error(`Error updating Monday adoptee and app status: ${error}`);
      return { error: 'An unexpected error occurred.' };
    }

    // db: update app status
    const supabase = await getSupabaseServerClient();
    const now = new Date();

    const { error: updateAppError } = await supabase
      .from('adopter_applications_dummy')
      .update({
        status: 'ENDED',
        time_ended: now.toISOString(),
        ended_reason: reason,
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

    // send email to admins
    const emailContent = `
      Dear Adopt an Inmate team,

      An adopter rejected their match. Here are the details:
      - Adopter ID: ${adopterId}
      - Adoptee ID: ${adopteeMondayId}
      - Timestamp: ${now.toLocaleTimeString('America/Los_Angeles', { month: 'short', day: 'numeric', year: 'numeric' })}
      - Reason: "${reason}"
    `;

    await autoEmailSender(
      emailContent,
      'An adopter rejected a match',
      'adopt@adoptaninmate.org',
    );
  }

  return { error: null };
};
