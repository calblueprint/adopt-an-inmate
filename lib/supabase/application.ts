import { UUID } from 'crypto';
import { getSupabaseBrowserClient } from './client';

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
    console.error('Error creating application:', error);
    throw error;
  }

  return data;
}
