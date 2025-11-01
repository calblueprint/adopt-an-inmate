'use server';

import { getSupabaseServerClient } from '@/lib/supabase';

// Example query to fetch all rows from your_table_name
export async function fetchTopK(embedding: number[], k_value: number) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.rpc('find_top_k', {
    query_embedding: JSON.stringify(embedding),
    k: k_value,
  });

  if (error) {
    throw new Error(`Error fetching top k vectors: ${error.message}`);
  }

  return data;
}
