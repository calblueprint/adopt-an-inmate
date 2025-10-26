'use server';

import { getSupabaseServerClient } from '@/lib/supabase';

// Example query to fetch all rows from your_table_name
export async function fetchTopK(
  embedding: number[],
  k_value: number,
  gender: string | null = null,
  age: number | null = null,
  veteran_status: boolean | null = false,
  offense: string | null = null,
  state: string,
) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.rpc('find_top_k_filtered', {
    query_embedding: embedding,
    k: k_value,
    adopter_gender: gender,
    adopter_age: age,
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
