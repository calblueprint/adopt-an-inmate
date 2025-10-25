import os
from dotenv import load_dotenv
import supabase
import vecs
from config import MODEL_NAME, MODEL_DIMENSION, VECS_COLLECTION_NAME, SUPABASE_TABLE_NAME
from huggingface_hub import InferenceClient

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env.local"))

# Initialize Hugging Face inference client
HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")  # add this to your .env.local
client = InferenceClient(model=MODEL_NAME, token=HF_TOKEN)

def get_huggingface_client():
    """Return the Hugging Face inference client."""
    return client

# Initialize Supabase
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
adoptee_table = supabase_client.table(SUPABASE_TABLE_NAME).select("*").execute().data

# Initialize Vecs
DB_CONNECTION = os.getenv("DATABASE_URL")
vx = vecs.create_client(DB_CONNECTION)
adoptee_vector_collection = vx.get_or_create_collection(
    name=VECS_COLLECTION_NAME,
    dimension=MODEL_DIMENSION
)
