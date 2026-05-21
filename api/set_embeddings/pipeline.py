from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from ._fetch_data import MondayBoardFetcher
from ._embed_and_upsert import upsert_embeddings
from ._clients import vx

class handler(BaseHTTPRequestHandler):

  def do_GET(self):
    try:
        print("Fetching data from Monday.com...")
        fetcher = MondayBoardFetcher()
        adoptee_data = fetcher.fetch_data()
        print(f"Fetched {len(adoptee_data)} records from Monday.com.")

        print("Upserting embeddings to vector database...")
        upsert_embeddings(adoptee_data)
        print("Embeddings upserted.")
        
        vx.disconnect()
        print("Pipeline complete.")

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"status": "success", "message": "Full pipeline executed successfully."}
        self.wfile.write(json.dumps(response).encode('utf-8'))

    except Exception as e:
        self.send_response(500)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"status": "error", "message": str(e)}
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    return
  
if __name__ == "__main__":
    # To run this locally (from the project's root directory):
    # python -m api.set_embeddings.pipeline   
    #
    # Then, in another terminal, trigger it with:
    # curl http://localhost:8000/
    
    port = 8000
    print(f"Starting local server at http://localhost:{port}")
    server = HTTPServer(("localhost", port), handler)
    server.serve_forever()