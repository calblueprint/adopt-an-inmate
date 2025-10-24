from http.server import BaseHTTPRequestHandler
from tqdm import tqdm
from clients import get_sentence_model, vx, adoptee_vector_collection, adoptee_table
import json


def upsert_data(model, database_table, vector_collection, batch_size=64):
  """
  Encodes and upserts data to a vector database in batches.

  Args:
      model: The model for encoding.
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

class handler(BaseHTTPRequestHandler):

  def do_GET(self):
    try:
      model = get_sentence_model()
      print("Starting data upsert...")
      upsert_data(model, adoptee_table, adoptee_vector_collection)
      vx.disconnect()
      print("Data upsert complete.")

      self.send_response(200)
      self.send_header('Content-type', 'application/json')
      self.end_headers()
      response = {"status": "success", "message": "Embeddings upserted successfully."}
      self.wfile.write(json.dumps(response).encode('utf-8'))
    
    except Exception as e:
      self.send_response(500)
      self.send_header('Content-type', 'application/json')
      self.end_headers()
      response = {"status": "error", "message": str(e)}
      self.wfile.write(json.dumps(response).encode('utf-8'))
      
    return
