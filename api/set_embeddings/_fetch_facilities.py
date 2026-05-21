import os
import json
import requests
from dotenv import load_dotenv
from supabase import create_client
from ._config import (
    MONDAY_API_KEY,
    MONDAY_API_URL,
    MONDAY_API_VERSION,
)

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env.local"))

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

FACILITIES_BOARD_ID = 6465684455
NOT_IN_CUSTODY_GROUP_ID = "6620891062"

FACILITY_COLUMN_IDS = {
    "system": "status",
    "mailing_address": "long_text__1"
}

headers = {"Authorization": MONDAY_API_KEY, "API-Version": MONDAY_API_VERSION}

def fetch_and_populate_facilities():
    cursor = None
    total = 0

    while True:
        cursor_str = f', cursor: "{cursor}"' if cursor else ''
        column_ids = json.dumps(list(FACILITY_COLUMN_IDS.values()))
        query = f"""query {{
          boards(ids: {FACILITIES_BOARD_ID}) {{
            items_page(limit: 500{cursor_str}) {{
              cursor
              items {{
                id
                name
                group {{ id }}
                column_values(ids: {column_ids}) {{
                  id
                  text
                }}
              }}
            }}
          }}
        }}"""

        r = requests.post(MONDAY_API_URL, json={"query": query}, headers=headers)
        response = r.json()
        data = response["data"]["boards"][0]["items_page"]
        items = data["items"]
        cursor = data["cursor"]

        for item in items:
            if item["group"]["id"] == NOT_IN_CUSTODY_GROUP_ID:
                continue

            col_data = {col["id"]: col["text"] for col in item["column_values"]}

            record = {
                "facility_id": item["id"],
                "facility_name": item["name"],
                "system": col_data.get(FACILITY_COLUMN_IDS["system"], "") or "Unknown",
                "mailing_address": col_data.get(FACILITY_COLUMN_IDS["mailing_address"], "") or "Unknown",
            }

            supabase.from_("adoptee_facilities").upsert(record).execute()
            total += 1
            print(f"Upserted facility: {item['name']}")

        if not cursor:
            break

    print(f"Done! Upserted {total} facilities.")

if __name__ == "__main__":
    fetch_and_populate_facilities()