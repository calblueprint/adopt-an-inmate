'use server';

import { UUID } from 'crypto';
import { getSupabaseServerClient } from '@/lib/supabase';
import { Profile } from '@/utils/schema';

const supabase = await getSupabaseServerClient();

export async function upsertProfile(profile: Profile) {
  const { data, error } = await supabase
    .from('adopter_profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw new Error(`Error upserting profile data: ${error.message}`);

  return data;
}

export async function fetchProfileById(userId: UUID) {
  const { data, error } = await supabase
    .from('adopter_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error)
    throw new Error(`Error fetching profile id ${userId}: ${error.message}`);

  return data;
}
