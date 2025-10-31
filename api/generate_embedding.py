import os
from huggingface_hub import InferenceClient
from http.server import BaseHTTPRequestHandler
import json

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
HF_TOKEN = os.getenv("HF_TOKEN")

def embed_text(text: str, client) -> list[float]:
    """Generates an embedding for the given text using Hugging Face Inference API."""
    try:
        embedding = client.feature_extraction(text)
        return embedding

    except Exception as e:
        raise Exception(f"Hugging Face Client Error: {str(e)}")


class handler(BaseHTTPRequestHandler):
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body_string = self.rfile.read(content_length)
                
        try:
            if not HF_TOKEN:
                raise Exception("Environment variable HF_TOKEN is not set.")
            
            data = json.loads(body_string)
            text_to_embed = data.get('text')

            if not text_to_embed:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'No text provided'}).encode())
                return
            
            hf_client = InferenceClient(model=MODEL_NAME, token=HF_TOKEN)
            embedding = embed_text(text_to_embed, hf_client)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response_data = {'embedding': embedding}
            self.wfile.write(json.dumps(response_data).encode())
        
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
            
        return