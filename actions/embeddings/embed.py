from tqdm import tqdm
from clients import model, vx, adoptee_vector_collection, adoptee_table

def upsert_data(model, database_table, vector_collection, batch_size=64):
  """
  Encodes and upserts data to a vector database in batches.

  Args:
      model: The embedding model.
      database_table (list): A list of dictionaries containing the data.
      vector_collection: The vector collection to which to upsert records.
      batch_size (int): The number of records to process per batch.
  """

  for i in tqdm(range(0, len(database_table), batch_size)):
    batch = database_table[i:i + batch_size]

    ids = [row['id'] for row in batch]
    bios = [row['bio'] for row in batch]

    embeddings = model.encode(bios, show_progress_bar=False).tolist()

    records = []

    for j, row in enumerate(batch):
      metadata = {
        "bio": row["bio"], 
        "gender": row["gender"],
        "age": row["age"],
        "veteran_status": row["veteran_status"],
        "offense": row["offense"],
        "state": row["state"]
      }

      records.append(((ids[j], embeddings[j], metadata)))

    try:
      vector_collection.upsert(records)
      print(f"Successfully upserted batch starting at index {i}")
    except Exception as e:
      print(f"Upsert failed for batch starting at index {i}: {e}")

if __name__ == "__main__":
  upsert_data(model, adoptee_table, adoptee_vector_collection)
  vx.disconnect()
