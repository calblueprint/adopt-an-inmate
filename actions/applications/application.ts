import { UUID } from 'crypto';
import Logger from '@/actions/logging';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

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

export async function createAdopterApplication(
  applicationData: Omit<AdopterApplication, 'id' | 'created_at' | 'updated_at'>,
) {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('adopter_applications_dummy')
    .insert([applicationData])
    .select()
    .single();

  if (error) {
    Logger.error('Error creating application:');
    throw error;
  }

  return data;
}
