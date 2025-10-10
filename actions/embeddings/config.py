import os
from dotenv import load_dotenv
import supabase
import vecs
from sentence_transformers import SentenceTransformer

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env.local"))

# Initialize Supabase
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Initialize vecs
DB_CONNECTION = os.getenv("DATABASE_URL")
vx = vecs.create_client(DB_CONNECTION)

# Initialize model
model = SentenceTransformer("paraphrase-MiniLM-L3-v2")
