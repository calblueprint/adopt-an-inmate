from http.server import BaseHTTPRequestHandler
from tqdm import tqdm
from clients import client, vx, adoptee_vector_collection, adoptee_table
import json

def upsert_data(client, database_table, vector_collection, batch_size=64):
  """
  Encodes and upserts data to a vector database in batches.

  Args:
      client: Hugging Face inference client for encoding text.
      database_table (list): A list of dictionaries containing the data.
      vector_collection: The vector collection to which to upsert records.
      batch_size (int): The number of records to process per batch.
  """
  
  for i in tqdm(range(0, len(database_table), batch_size)):
    batch = database_table[i:i + batch_size]

    ids = [row['id'] for row in batch]
    bios = [row['bio'] for row in batch]

    # Generate embeddings via Hugging Face Inference API
    embeddings = []
    for bio in bios:
        try:
            emb = client.feature_extraction(bio)
            embeddings.append(emb)
        except Exception as e:
            print(f"Embedding failed for entry: {bio[:50]}... Error: {e}")
            embeddings.append([0.0] * vector_collection.dimension)  # fallback

    records = []

    for j, row in enumerate(batch):
      metadata = {
        "first_name": row.get("first_name", ""),
        "last_name": row.get("last_name", ""),
        "bio": row.get("bio", ""),
        "gender": row.get("gender", ""),
        "age": row.get("age", ""),
        "veteran_status": row.get("veteran_status", ""),
        "offense": row.get("offense", ""),
        "state": row.get("state", "")
      }

      records.append((ids[j], embeddings[j], metadata))

    try:
      vector_collection.upsert(records)
      print(f"Successfully upserted batch starting at index {i}")
    except Exception as e:
      print(f"Upsert failed for batch starting at index {i}: {e}")

class handler(BaseHTTPRequestHandler):

  def do_GET(self):
    try:
      print("Starting data upsert...")
      upsert_data(client, adoptee_table, adoptee_vector_collection)
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

if __name__ == "__main__":
    # set up a simple HTTP server for local testing
    # run python embed.py && curl http://localhost:8000/ to trigger the handler
    from http.server import HTTPServer
    port = 8000
    print(f"Starting local server at http://localhost:{port}")
    server = HTTPServer(("localhost", port), handler)
    server.serve_forever()
