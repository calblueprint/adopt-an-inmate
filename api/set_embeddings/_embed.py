from tqdm import tqdm
from _clients import hf_client, adoptee_vector_collection

def upsert_embeddings(data: list, model_dimension, batch_size=64):
    """Encodes and upserts data to the vector database in batches."""

    if not data:
        print("No data provided for embedding.")
        return

    for i in tqdm(range(0, len(data), batch_size)):
        batch = data[i:i + batch_size]
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
                "age", "veteran_status", "offense", "state", "adopted"
            ]}
            records.append((ids[j], embeddings[j], metadata))

        try:
            adoptee_vector_collection.upsert(records)
        except Exception as e:
            print(f"Upsert failed for batch starting at index {i}: {e}")