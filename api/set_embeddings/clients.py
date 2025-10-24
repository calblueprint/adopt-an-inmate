import os
from dotenv import load_dotenv
import supabase
from sentence_transformers import SentenceTransformer
import vecs
from config import MODEL_NAME, MODEL_DIMENSION, VECS_COLLECTION_NAME, SUPABASE_TABLE_NAME

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env.local"))

# Initialize model lazily
model = None
def get_sentence_model():
    global model
    if model is None:
      print("Loading sentence transformer model...")
      model = SentenceTransformer(MODEL_NAME)
    return model

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