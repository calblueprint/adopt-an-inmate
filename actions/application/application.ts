import Logger from '@/actions/logging';
import { getSupabaseBrowserClient } from '@/lib/supabase';

// import { AdopterApplication } from '@/types/schema';

export async function createAdopterApplication() {
  // applicationData: Omit<AdopterApplication, 'id' | 'created_at' | 'updated_at'>,
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('adopter_applications_dummy')
    // .insert([applicationData])
    .select()
    .single();

  if (error) {
    Logger.error('Error creating application:');
    throw error;
  }

  return data;
}
