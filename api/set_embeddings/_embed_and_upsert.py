from tqdm import tqdm
import time
from _clients import hf_client, adoptee_vector_collection

def upsert_embeddings(data: list, batch_size=64):
    """Encodes and upserts data to the vector database in batches."""

    if not data:
        print("No data provided for embedding.")
        return

    for i in tqdm(range(0, len(data), batch_size)):
        batch = data[i:i + batch_size]
        ids = [row['id'] for row in batch]
        bios = [row['bio'] for row in batch]

        embeddings = None
        max_retries = 3
        for attempt in range(max_retries):
            try:
                embeddings = hf_client.feature_extraction(bios) 
                break
            except Exception as e:
                print(f"Batch embedding failed (attempt {attempt+1}): {e}")
                if attempt + 1 == max_retries:
                    print(f"All retries failed for batch starting at index {i}. Skipping batch.")
                    break
                else:
                    time.sleep(1)

        if embeddings is None:
            continue

        records = []
        for j, row in enumerate(batch):
            metadata = {k: row.get(k, "") for k in [
                "first_name", "last_name", "bio", "gender", 
                "dob", "veteran_status", "offense", "state", "adopted"
            ]}
            records.append((ids[j], embeddings[j], metadata))

        try:
            adoptee_vector_collection.upsert(records)
        except Exception as e:
            print(f"Upsert failed for batch starting at index {i}: {e}")