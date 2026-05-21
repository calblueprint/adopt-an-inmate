'use server';

import type { EndReasonOption } from '@/data/endCorrespondenceDropdown';
import { CONFIG } from '@/config';
import { getSupabaseServerClient } from '@/lib/supabase';
import { dangerous_getSupabaseServiceClient } from '@/lib/supabase/service';
import autoEmailSender from '../emails/email';
import Logger from '../logging';

interface HandleEndCorrespondenceParams {
  appId: string;
  adopteeId: string;
  reason: EndReasonOption;
  adopteeInmateId: string;
  adopterEmail: string;
  adopterId: string;
}

export async function handleEndCorrespondence({
  appId,
  adopteeId,
  reason,
  adopteeInmateId,
  adopterEmail,
  adopterId,
}: HandleEndCorrespondenceParams) {
  const supabase = await getSupabaseServerClient();
  const supabaseService = await dangerous_getSupabaseServiceClient();

  // db: update adoptee table
  const { error: updateAdopteeError } = await supabaseService
    .from('adoptee_vector_test')
    .update({ status: 'WAIT_LISTED' })
    .eq('id', adopteeId);

  if (updateAdopteeError) {
    Logger.error(
      `Error updating adoptee status for ${adopteeId}: ${updateAdopteeError.message}`,
    );
    return { error: 'An unexpected error occurred.' };
  }

  // db: update app table
  const now = new Date();

  const { error: updateAppError } = await supabase
    .from('adopter_applications_dummy')
    .update({
      status: 'ENDED',
      time_ended: now.toISOString(),
      ended_reason: reason.label,
    })
    .eq('app_uuid', appId);

  if (updateAppError) {
    Logger.error(
      `Error updating app ${appId} to ENDED with reason ${reason.label}: ${updateAppError.message}`,
    );
    return { error: 'An unexpected error occurred.' };
  }

  // send email to admins
  const emailContent = `
    Dear Adopt an Inmate team,

    An adopter has ended their correspondence. Here are the details:
    - Adopter: ${adopterEmail} (ID: ${adopterId})
    - Adoptee: ${adopteeInmateId} (ID: ${adopteeId})
    - Timestamp: ${now.toLocaleTimeString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })} (UTC+0)
    - Reason: ${reason.label} (${reason.value})

    This is an automated email sent by the Adopt an Inmate web server. Please do not reply.
  `;

  await autoEmailSender(
    emailContent,
    'An adopter ended their correspondence',
    CONFIG.adminEmail,
  );

  return { error: null };
}
