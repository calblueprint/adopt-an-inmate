import { UUID } from 'crypto';
import Logger from '@/actions/logging';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

// import { AdopterApplication } from '@/types/schema';

export type AdopterApplication = {
  // Add all the columns from adopter_applications_dummy table
  app_uuid: UUID;
  adopter_uuid: UUID;
  personal_bio: string;
  gender_pref: string;
  return_explanation: string;
  in_complete: boolean;
  accepted: boolean;
  rejected: boolean;
};

export async function createAdopterApplication() {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('adopter_applications_dummy')
    .select()
    .single();

  if (error) {
    Logger.error('Error creating application:');
    throw error;
  }

  return data;
}
