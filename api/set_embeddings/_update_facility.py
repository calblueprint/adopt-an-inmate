import os
import requests
from dotenv import load_dotenv
from supabase import create_client
from ._config import (
    MONDAY_API_KEY,
    MONDAY_API_URL,
    MONDAY_API_VERSION,
    MONDAY_BOARD_ID,
    MONDAY_GROUP_ID,
)

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env.local"))

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

headers = {"Authorization": MONDAY_API_KEY, "API-Version": MONDAY_API_VERSION}

def fetch_and_update_facilities():
    query = f"""query {{
      boards(ids: {MONDAY_BOARD_ID}) {{
        items_page(limit: 500) {{
          cursor
          items {{
            id
            group {{ id }}
            linked_items(link_to_item_column_id: "facility__1", linked_board_id: 6465684455) {{
              id
            }}
          }}
        }}
      }}
    }}"""
    
    r = requests.post(MONDAY_API_URL, json={"query": query}, headers=headers)
    items = r.json()["data"]["boards"][0]["items_page"]["items"]
    
    for item in items:
        if item["group"]["id"] != MONDAY_GROUP_ID:
            continue
        linked = item.get("linked_items", [])
        if not linked:
            continue
        facility_id = str(linked[0]["id"])
        supabase.from_("adoptee_vector_test").update(
            {"facility_id": facility_id}
        ).eq("id", item["id"]).execute()
        print(f"Updated {item['id']} with facility {facility_id}")

if __name__ == "__main__":
    fetch_and_update_facilities()