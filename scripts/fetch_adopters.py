import os
import requests
from dotenv import load_dotenv
from supabase import create_client
from datetime import datetime

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env.local"))

###
# CONFIGURATION / SETUP
###

# Monday configuration
MONDAY_API_URL = "https://api.monday.com/v2"
MONDAY_API_VERSION = "2023-04"
MONDAY_API_KEY = os.getenv("MONDAY_API_KEY")
MONDAY_ADOPTER_DATA_BOARD_ID = os.getenv("MONDAY_ADOPTER_DATA_BOARD_ID")

# Supabase variables
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL');
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY');

###
# INITIALIZATION
###

# initialize client
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

###
# DATA FETCHER
###

class MondayBoardFetcher:
  """
    Fetches and aggregates adopters' data from monday.com to return as a DataFrame.

    Attributes:
        API_KEY (str): monday.com API key loaded from environment.
        API_URL (str): Base URL for monday.com API, also loaded from environment.
        HEADERS (dict): Headers for requests.
        BOARD_ID (str): ID of the board to fetch, also loaded from environment.

    Methods:
        _build_query(is_initial=True, cursor=None):
            Constructs GraphQL query string for fetching board data.
        _fetch_page(query):
            Sends request to monday.com and returns cursor and a page-batch of adopter rows. 
            Takes in a query string (from helper function _build_query).
        fetch_data():
            Fetches all pages of items and returns a pandas DataFrame with the relevant columns.
            Makes repeated calls to _fetch_page.
    """
  
  def __init__(self):
    self.API_KEY = MONDAY_API_KEY
    self.API_URL = MONDAY_API_URL
    self.HEADERS = {"Authorization": self.API_KEY, "API-Version": MONDAY_API_VERSION}
    self.BOARD_ID = MONDAY_ADOPTER_DATA_BOARD_ID

  def _build_query(self, cursor=None):
    cursor_str = f'cursor: "{cursor}"' if cursor else ''

    return f"""query {{
      boards(ids: [{self.BOARD_ID}]) {{
        items_page (limit: 500, {cursor_str}) {{
          cursor
          items {{
            id 
            name
            group {{ id title }} 
            column_values(ids: ["email__1"]) {{ 
              id 
              value
            }}
          }} }} }} }}"""

  def _fetch_page(self, query):
    data = {"query": query}

    try:
      r = requests.post(url=self.API_URL, json=data, headers=self.HEADERS)
      response = r.json()
    except Exception:
      raise Exception("Error: request failed, or failed to convert to JSON")

    try:
      board = response["data"]["boards"][0]
      items_page = board["items_page"]["items"]
      cursor = board["items_page"]["cursor"]
    except:
      raise Exception(f'Error: response is null or failed to index board: {response}')

    adoptee_batch = []
    for item in items_page:
      try:
        email = item["column_values"][0]["value"]["email"]
      except:
        email = item["name"]
      
      item_data = {
        "id": item["id"],
        "email": str(email).lower(),
        "group": item["group"]
      }
      adoptee_batch.append(item_data)

    return cursor, adoptee_batch

  def fetch_data(self):
    initial_query = self._build_query()
    curr_cursor, rows = self._fetch_page(initial_query)

    while curr_cursor:
      next_query = self._build_query(curr_cursor)
      try:
        next_cursor, next_page = self._fetch_page(next_query)
        curr_cursor = next_cursor
        rows.extend(next_page)
      except Exception:
        raise Exception(f"Error: unable to request next page at cursor: {curr_cursor}")
        
    # Organize data into a list of dictionary for upserting
    data_dict = {}    # Use dict to avoid duplicates
    for row in rows:
      email = row["email"]
      current_time = datetime.now().strftime('%Y-%m-%d')
      data_dict[email] = {
        "adopter_email": email, 
        "monday_id": row["id"], 
        "date_added": current_time, 
        "group": row["group"]["title"]
      }

    table_data = list(data_dict.values())
    
    return table_data

###
# MAIN EXECUTION
###

def fetch_adopters():
  try:
    print("Fetching data from Monday.com...")
    fetcher = MondayBoardFetcher()
    adopter_data = fetcher.fetch_data()
    print(f"Fetched {len(adopter_data)} records from Monday.com.")

    print("Upserting data to Supabase...")
    supabase_client.table('adopter_monday_ids').upsert(adopter_data).execute()
    print("Data upserted, pipeline complete.")

  except Exception as e:
    print(str(e))

fetch_adopters()
