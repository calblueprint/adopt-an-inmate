from tqdm import tqdm
from _clients import hf_client, adoptee_vector_collection, supabase_client

def fetch_from_supabase(table_name):
    """Fetches all records from the Supabase table."""

    try:
        response = supabase_client.table(table_name).select("*").execute()
        return response.data
    
    except Exception as e:
        print(f"Error fetching from Supabase: {e}")
        raise

def save_to_supabase(data: list, table_name):
    """Upserts records to the Supabase table."""

    if not data:
        print("No data to save to Supabase.")
        return
    
    try:
        supabase_client.table(table_name).upsert(
            data,
            on_conflict="id"
        ).execute()

    except Exception as e:
        print(f"Error saving to Supabase: {e}")
        raise

def upsert_embeddings(database_table: list, model_dimension, batch_size=64):
    """Encodes and upserts data to the vector database in batches."""

    if not database_table:
        print("No data provided for embedding.")
        return

    for i in tqdm(range(0, len(database_table), batch_size)):
        batch = database_table[i:i + batch_size]
        ids = [row['id'] for row in batch]
        bios = [row['bio'] for row in batch]

        embeddings = []
        for bio in bios:
            try:
                emb = hf_client.feature_extraction(bio) 
                embeddings.append(emb)
            except Exception as e:
                print(f"Embedding failed for entry: {bio[:50]}... Error: {e}")
                embeddings.append([0.0] * model_dimension) 

        records = []
        for j, row in enumerate(batch):
            metadata = {k: row.get(k, "") for k in [
                "first_name", "last_name", "bio", "gender", 
                "age", "veteran_status", "offense", "state"
            ]}
            records.append((ids[j], embeddings[j], metadata))

        try:
            adoptee_vector_collection.upsert(records)
        except Exception as e:
            print(f"Upsert failed for batch starting at index {i}: {e}")