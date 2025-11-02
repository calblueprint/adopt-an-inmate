import os
from huggingface_hub import InferenceClient
from supabase import create_client, Client
from http.server import BaseHTTPRequestHandler
import json

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
HF_TOKEN = os.getenv("HF_TOKEN")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

def embed_text(text: str, client) -> list[float]:
    """Generates an embedding for the given text using Hugging Face Inference API."""
    try:
        embedding = client.feature_extraction(text)
        return embedding.tolist()

    except Exception as e:
        raise Exception(f"Hugging Face Client Error: {str(e)}")
    
def fetch_top_k(embedding: list[float], supabase_client: Client, k: int = 5) -> list[float]:
    """Query Supabase for similar bios using vector similarity."""
    try: 
        response = supabase_client.rpc(
            'find_top_k',
            {
                'query_embedding': embedding,
                'k': k
            }
        ).execute()
        return response.data
    
    except Exception as e:
        raise Exception(f"Supabase Query Error: {str(e)}")

class handler(BaseHTTPRequestHandler):
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body_string = self.rfile.read(content_length)
                
        try:
            if not HF_TOKEN:
                raise Exception("Environment variable HF_TOKEN is not set.")
            if not SUPABASE_URL or not SUPABASE_KEY:
                raise Exception("Supabase environment variables are not set.")
            
            data = json.loads(body_string)
            bio = data.get('text')
            k = data.get('k', 5)

            if not bio:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'No text provided'}).encode())
                return
            
            hf_client = InferenceClient(model=MODEL_NAME, token=HF_TOKEN)
            embedding = embed_text(bio, hf_client)

            supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            similar_bios = fetch_top_k(embedding, supabase, k)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response_data = {'embedding': embedding, 'similar_bios': similar_bios}
            self.wfile.write(json.dumps(response_data).encode())
        
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
            
        return