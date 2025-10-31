import os
from dotenv import load_dotenv
import vecs
from _config import MODEL_NAME, MODEL_DIMENSION, VECS_COLLECTION_NAME
from huggingface_hub import InferenceClient

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env.local"))

# Initialize Hugging Face inference client
HF_TOKEN = os.getenv("HF_TOKEN")
hf_client = InferenceClient(model=MODEL_NAME, token=HF_TOKEN)

# Initialize Vecs
DB_CONNECTION = os.getenv("DATABASE_URL")
vx = vecs.create_client(DB_CONNECTION)
adoptee_vector_collection = vx.get_or_create_collection(
    name=VECS_COLLECTION_NAME,
    dimension=MODEL_DIMENSION
)