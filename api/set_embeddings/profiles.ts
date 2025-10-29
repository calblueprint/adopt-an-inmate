import { UUID } from 'crypto';
import { getSupabaseBrowserClient as supabase } from '@/lib/supabase/client';
import { Profile } from '@/utils/schema';

export async function upsertProfile(profile: Profile) {
  const supabaseClient = supabase();
  const { data, error } = await supabaseClient
    .from('adopter_profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw new Error(`Error upserting profile data: ${error.message}`);

  return data;
}

export async function fetchProfileById(userId: UUID) {
  const supabaseClient = supabase();
  const { data, error } = await supabaseClient
    .from('adopter_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error)
    throw new Error(`Error fetching profile id ${userId}: ${error.message}`);

  return data;
}
