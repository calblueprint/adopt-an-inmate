from http.server import BaseHTTPRequestHandler
import json
from _data_operations import fetch_from_supabase, upsert_embeddings
from _clients import vx

class handler(BaseHTTPRequestHandler):

  def do_GET(self):
    try:
      print("Starting data fetch from Supabase...")
      adoptee_table_data = fetch_from_supabase()
      print("Data fetch complete.")

      print("Starting data upsert...")
      upsert_embeddings(adoptee_table_data)
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