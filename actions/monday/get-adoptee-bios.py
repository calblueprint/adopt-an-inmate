from dotenv import load_dotenv
import os
import requests
import pandas as pd

load_dotenv(".env.local")

API_KEY = os.environ["MONDAY_API_KEY"]
API_URL = "https://api.monday.com/v2"
HEADERS = {"Authorization" : API_KEY, "API-Version" : "2023-04"}
BOARD_ID = os.getenv("MONDAY_BOARD_ID")

def fetch_adoptee_bios():

  def get_query_string(is_initial=True, c=None):
    return f"""query {{
                    boards(ids: {BOARD_ID}) {{
                      name
                      items_page (limit: 100{'' if is_initial else f', cursor: "{c}"'}) {{ 
                        cursor
                        items {{
                          id
                          name
                          group {{ id title }} 
                          column_values(ids: ["gender__1",
                                              "offense__1",
                                              "notes_for_matching__1",
                                              "dropdown9__1",
                                              "color1__1",
                                              "last_modified_date__1"]) {{ id value text}} }} }} }} }}"""

  def request_next_page(arg_query, cursor=None):
    
    data = {'query' : arg_query}

    try:
      r = requests.post(url=API_URL, json=data, headers=HEADERS)
      response = r.json()
    except:
      raise Exception(f'Error: request failed, or failed to convert to json')

    try:
      board = response["data"]["boards"]
      items_page = board[0]["items_page"]["items"] 
      cursor = board[0]["items_page"]["cursor"]
    except:
      raise Exception(f'Error: response is null or failed to index: {response}')

    next_adoptee = []
    for item in items_page:
      if item is not None and 'group' in item and 'id' in item['group']:
        if item['group']['id'] == "1715196990_inmate_data_report___1": 
          row_tuple = (item['name'],)
          for col in item['column_values']:
            raw_val = col['text']
            if raw_val:
              row_tuple = row_tuple + (raw_val,) 
            else:
              row_tuple = row_tuple + ("NA",)
          next_adoptee.append(row_tuple)
    return (cursor, next_adoptee)

  initial_query = get_query_string(is_initial=True)
  curr_cursor, full_bios = request_next_page(initial_query)

  while curr_cursor:
    next_query = get_query_string(is_initial=False, c=curr_cursor)
    try:
      nextPg = request_next_page(next_query, cursor=curr_cursor)
      curr_cursor = nextPg[0]
    except:
      raise Exception(f'Error: unable to request next page')
    full_bios.extend(nextPg[1])

  col_names = ["Inmate ID", "Gender", "State", "Offense", "Adoptee Bio", "Veteran Status", "Date Entered"]
  data_dict = {}
  for col in range(len(col_names)):
    data_dict[col_names[col]] = [row[col] for row in full_bios]

  fulldf = pd.DataFrame(data=data_dict)
  return fulldf

print(fetch_adoptee_bios().head())