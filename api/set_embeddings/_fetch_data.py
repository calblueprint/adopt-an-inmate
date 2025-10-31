import requests
from _config import (
  MONDAY_API_KEY,
  MONDAY_API_URL,
  MONDAY_API_VERSION,
  MONDAY_BOARD_ID,
  MONDAY_GROUP_ID
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
    self.BOARD_ID = MONDAY_BOARD_ID

  def _build_query(self, is_initial=True, cursor=None):
    return f"""query {{
      boards(ids: {self.BOARD_ID}) {{
        name
        items_page (limit: 100{'' if is_initial else f', cursor: "{cursor}"'}) {{
          cursor
          items {{
            id 
            name
            group {{ id title }} 
            column_values(ids: ["fname__1",
                                "lname__1",
                                "notes_for_matching__1", 
                                "gender__1", 
                                "date_of_birth__1",
                                "color1__1",
                                "offense__1", 
                                "dropdown9__1", 
                                "last_modified_date__1",]) {{ id value text }}
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
          row_tuple = (item["name"],)
          for col in item["column_values"]:
            raw_val = col["text"]
            row_tuple += (raw_val if raw_val else "NA",)
          adoptee_batch.append(row_tuple)
    return cursor, adoptee_batch

  def fetch_data(self):
    initial_query = self._build_query(is_initial=True)
    curr_cursor, full_bios = self._fetch_page(query=initial_query)

    while curr_cursor:
      next_query = self._build_query(is_initial=False, cursor=curr_cursor)
      try:
        next_cursor, next_page = self._fetch_page(next_query)
        curr_cursor = next_cursor
        full_bios.extend(next_page)
      except Exception:
        raise Exception(f"Error: unable to request next page at cursor: {curr_cursor}")
    
    # Organize data into a list of dictionary for upserting
    adoptee_data_dict = {}    # Use dict to avoid duplicates
    for row in full_bios:
      record_id = row[0]
      record = {
        "id": row[0],
        "first_name": row[1] if row[1] != "NA" else "", 
        "last_name": row[2] if row[2] != "NA" else "",
        "bio": row[7] if row[7] != "NA" else "",
        "gender": row[3] if row[3] != "NA" else "",
        "dob": row[4] if row[4] != "NA" else None,
        "veteran_status": row[8] if row[8] != "NA" else "",
        "offense": row[6] if row[6] != "NA" else "",
        "state": row[5] if row[5] != "NA" else "",
        "adopted": False    # Default to False
      }
      adoptee_data_dict[record_id] = record   

    adoptee_table_data = list(adoptee_data_dict.values())
    
    return adoptee_table_data