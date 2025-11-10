'use server';

import { getSupabaseServerClient } from '@/lib/supabase';

export async function fetchTopK(
  embedding: number[],
  k_value: number,
  gender: string | null = null,
  veteran_status: string | null = null,
  offense: string | null = null,
  state: string,
) {
  async function filterHelper(
    embedding: number[],
    k_value: number,
    gender: string | null = null,
    veteran_status: string | null = null,
    offense: string | null = null,
    state: string,
    num_filters: number,
  ) {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.rpc('find_top_k_filtered', {
      query_embedding: embedding,
      k: k_value,
      adopter_gender: gender,
      adopter_veteran_status: veteran_status,
      adopter_offense: offense,
      adopter_state: state,
      num_filters: num_filters,
    });

    if (error) {
      throw new Error(`Error fetching top k vectors: ${error.message}`);
    }

    return data;
  }

  let num_filters = 4; // offense, gender, veteran_status, state
  let data = await filterHelper(
    embedding,
    k_value,
    gender,
    veteran_status,
    offense,
    state,
    num_filters,
  );
  while (num_filters == 4 || data.length == 0) {
    data = await filterHelper(
      embedding,
      k_value,
      gender,
      veteran_status,
      offense,
      state,
      num_filters,
    );
    num_filters--;
  }

  // if (error) {
  //   throw new Error(`Error fetching top k vectors: ${error.message}`);
  // }

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
