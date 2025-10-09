import supabase from '../client';

// Example query to fetch all rows from your_table_name
export async function fetchAllRows() {
  const { data, error } = await supabase.from('your_table_name').select('*');

  if (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }

  return data;
}

export async function fetchTopK(embedding: number[], k_value: number) {
  const { data, error } = await supabase.rpc('find_top_k', {
    query_embedding: embedding,
    k: k_value,
  });

  if (error) {
    throw new Error(`Error fetching top k vectors: ${error.message}`);
  }

  return data;
}
