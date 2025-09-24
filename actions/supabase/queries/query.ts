import supabase from "../client";

// Example query to fetch all rows from your_table_name
export async function fetchAllRows() {
  const { data, error } = await supabase.from("your_table_name").select("*");

  if (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }

  return data;
}
