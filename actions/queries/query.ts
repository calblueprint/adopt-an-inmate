'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import { AdopteeMatch, AdopterApplication } from '@/types/schema';

/* Fetch top k (by simliaity) adoptee rows with hierarchical filtering:
 * Start with all filters applied. If no results, progressively drop filters
 * starting with state, then veteran_status, and finally gender.
 */
export async function fetchTopK(
  embedding: number[],
  k_value: number,
  gender?: string,
  veteran_status?: string,
  offense?: string[],
  state?: string,
): Promise<AdopteeMatch[]> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.rpc('find_top_k_filtered', {
    query_embedding: JSON.stringify(embedding),
    k: k_value,
    adopter_gender: gender,
    adopter_veteran_status: veteran_status,
    adopter_offense: offense,
    adopter_state: state,
  });

  if (error) {
    throw new Error(`Error fetching top k vectors: ${error.message}`);
  }

  return data;
}

export async function fetchApplication(app_UUID: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('adopter_applications_dummy')
    .select('*')
    .eq('app_uuid', app_UUID)
    .maybeSingle();

  if (error) {
    throw new Error(`Error fetching application: ${error.message}`);
  }

  return data;
}

export async function fetchUserApplicationUUIDs(adopter_UUID: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('adopter_applications_dummy')
    .select('*')
    .eq('adopter_uuid', adopter_UUID);

  if (error) {
    throw new Error(`Error fetching adopter's applications: ${error.message}`);
  }

  return data;
}

// accepted: boolean | null
// adopter_uuid: string
// app_uuid: string
// gender_pref: string | null
// incomplete: boolean | null
// personal_bio: string | null
// ranked_cards: Json | null
// reached_ranking: boolean
// rejected: boolean | null
// return_explanation: string | null
// time_submitted: string

export async function upsertApplication(app: AdopterApplication) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('adopter_applications_dummy')
    .upsert(app, { onConflict: 'app_uuid' })
    .select()
    .single();

  if (error)
    throw new Error(`Error upserting application data: ${error.message}`);

  return data;
}
