'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import { dangerous_getSupabaseServiceClient } from '@/lib/supabase/service';
import { Profile } from '@/types/schema';
import Logger from '../logging';

export async function upsertProfile(profile: Profile, num_ext: number) {
  const supabase = await getSupabaseServerClient();
  const supabaseService = await dangerous_getSupabaseServiceClient();

  // upsert general app
  const { error: upsertAppError } = await supabase
    .from('adopter_profiles')
    .upsert(profile);

  if (upsertAppError) {
    Logger.error(`Error upserting profile data: ${upsertAppError.message}`);
    return { error: 'An unexpected error occurred.' };
  }

  // upsert num past active
  const { error: upsertNumPastActiveError } = await supabaseService
    .from('adopter_num_external_active')
    .upsert({
      adopter_uuid: profile.user_id,
      num_external_active: num_ext ?? 0,
    });

  if (upsertNumPastActiveError) {
    Logger.error(
      `Error upserting num past inactive: ${upsertNumPastActiveError.message}`,
    );
    return { error: 'An unexpected error occurred.' };
  }

  return { error: null };
}

export async function fetchProfileById(userId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('adopter_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(`Error fetching profile: ${error.message}`);

  return data;
}
