'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import { Profile } from '@/utils/schema';

export async function upsertProfile(profile: Profile) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('adopter_profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw new Error(`Error upserting profile data: ${error.message}`);

  return data;
}

export async function fetchProfileById(userId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('adopter_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error)
    throw new Error(`Error fetching profile id ${userId}: ${error.message}`);

  return data;
}
