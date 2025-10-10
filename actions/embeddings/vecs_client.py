import supabase
from config import SUPABASE_URL, SUPABASE_ANON_KEY

supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_adoptees():
    response = supabase_client.table("adoptee").select("*").execute()
    return response.data
