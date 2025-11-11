'use server';

import { getSupabaseServerClient } from '@/lib/supabase';
import { Database } from '@/types/database.types';

type AdopteeRow =
  Database['public']['Functions']['find_top_k_filtered']['Returns'][number];

/* Fetch top k (by simliaity) adoptee rows with hierarchical filtering:
 * Start with all filters applied. If no results, progressively drop filters
 * starting with state, then veteran_status, and finally gender.
 */
export async function fetchTopK(
  embedding: number[],
  k_value: number,
  gender: string | null = null,
  veteran_status: string | null = null,
  offense: string | null = null,
  state: string,
) {
  const supabase = await getSupabaseServerClient();

  // helper function that makes call to supabase, takes in num of filters to use
  async function filterHelper(num_filters: number): Promise<AdopteeRow[]> {
    const { data, error } = await supabase.rpc('find_top_k_filtered', {
      query_embedding: embedding,
      k: k_value,
      adopter_gender: gender,
      adopter_veteran_status: veteran_status,
      adopter_offense: offense,
      adopter_state: state,
      num_filters,
    });

    if (error) {
      throw new Error(`Error fetching top k vectors: ${error.message}`);
    }

    return data;
  }

  let curr_filters = 4; // offense, gender, veteran_status, state
  let data: AdopteeRow[] = [];

  while (curr_filters == 4 || data.length == 0) {
    // if first run or no results
    data = await filterHelper(curr_filters); // call helper
    curr_filters--; // decrement num of filters in case no rows return
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
