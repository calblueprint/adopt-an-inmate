import datetime
from pytz import timezone
import requests
import json
from _config import (
  MONDAY_API_KEY,
  MONDAY_API_URL,
  MONDAY_API_VERSION,
  MONDAY_BOARD_ID,
  MONDAY_GROUP_ID,
  MONDAY_COLUMN_IDS
)

class MondayBoardFetcher:
  """
    Fetches and aggregates adoptees' data from monday.com to return as a DataFrame.

    Attributes:
        API_KEY (str): monday.com API key loaded from environment.
        API_URL (str): Base URL for monday.com API, also loaded from environment.
        HEADERS (dict): Headers for requests.
        BOARD_ID (str): ID of the board to fetch, also loaded from environment.

    Methods:
        _build_query(is_initial=True, cursor=None):
            Constructs GraphQL query string for fetching board data.
        _fetch_page(query):
            Sends request to monday.com and returns cursor and a page-batch of adoptee rows. 
            Takes in a query string (from helper function _build_query).
        fetch_data():
            Fetches all pages of items and returns a pandas DataFrame with the relevant columns.
            Makes repeated calls to _fetch_page.
    """
  
  def __init__(self):
    self.API_KEY = MONDAY_API_KEY
    self.API_URL = MONDAY_API_URL
    self.HEADERS = {"Authorization": self.API_KEY, "API-Version": MONDAY_API_VERSION}
    self.GROUP_ID = MONDAY_GROUP_ID
    self.BOARD_ID = MONDAY_BOARD_ID

  def _build_query(self, since_date_str: str, is_initial=True, cursor=None):
    column_ids_list = list(MONDAY_COLUMN_IDS.values())
    query_params_str = f'query_params: {{ group_id: "{self.GROUP_ID}", rules: [{{ "column_id": "last_updated__1", "compare_value": ["{since_date_str}"], "operator": "greater_than" }}] }}'
    cursor_str = '' if is_initial else f', cursor: "{cursor}"'

    return f"""query {{
      boards(ids: {self.BOARD_ID}) {{
        name
        items_page (limit: 100, {query_params_str}{cursor_str}) {{
          cursor
          items {{
            id 
            name
            group {{ id title }} 
            column_values(ids: {json.dumps(column_ids_list)}) {{ 
              id 
              text 
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
      if item and "group" in item and "id" in item["group"]:
        if item["group"]["id"] == MONDAY_GROUP_ID:
          column_data = {}
          for col in item["column_values"]:
            column_data[col["id"]] = col["text"]
          item_data = {
            "id": item["name"],
            "columns": column_data
          }
          adoptee_batch.append(item_data)

    return cursor, adoptee_batch

  def fetch_data(self):
    one_month_ago = datetime.now(timezone.utc) - datetime.timedelta(days=31)
    since_date_str = one_month_ago.strftime('%Y-%m-%dT%H:%M:%SZ')   # ISO 8601 format for Monday.com

    print(f"Fetching all items updated since: {since_date_str}")
    
    initial_query = self._build_query(is_initial=True, since_date_str=since_date_str)
    curr_cursor, full_bios = self._fetch_page(query=initial_query)

    while curr_cursor:
      next_query = self._build_query(is_initial=False, cursor=curr_cursor)
      try:
        next_cursor, next_page = self._fetch_page(next_query)
        curr_cursor = next_cursor
        full_bios.extend(next_page)
      except Exception:
        raise Exception(f"Error: unable to request next page at cursor: {curr_cursor}")
    
    # Helper function to get column value with default handling
    def get_col_val(columns_dict, col_id, default=""):
      val = columns_dict.get(col_id)
      return default if (val is None or val == "NA" or val == "") else val
    
    # Organize data into a list of dictionary for upserting
    adoptee_data_dict = {}    # Use dict to avoid duplicates
    for item in full_bios:
      record_id = item["id"]
      columns = item["columns"]
      record = {
        "id": record_id,
        "first_name": get_col_val(columns, MONDAY_COLUMN_IDS["first_name"]),
        "last_name": get_col_val(columns, MONDAY_COLUMN_IDS["last_name"]),
        "bio": get_col_val(columns, MONDAY_COLUMN_IDS["bio"]),
        "gender": get_col_val(columns, MONDAY_COLUMN_IDS["gender"]),
        "dob": get_col_val(columns, MONDAY_COLUMN_IDS["dob"]),
        "veteran_status": get_col_val(columns, MONDAY_COLUMN_IDS["veteran_status"]),
        "offense": get_col_val(columns, MONDAY_COLUMN_IDS["offense"]),
        "state": get_col_val(columns, MONDAY_COLUMN_IDS["state"]),
        "adopted": "false"
      }
      adoptee_data_dict[record_id] = record   

    adoptee_table_data = list(adoptee_data_dict.values())
    print(adoptee_table_data)
    
    return adoptee_table_data