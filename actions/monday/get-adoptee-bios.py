from dotenv import load_dotenv
import os
import requests
import json

load_dotenv("example.env")

apiKey = os.environ["MONDAY_API_KEY"]
apiUrl = "https://api.monday.com/v2"
headers = {"Authorization" : apiKey, "API-Version" : "2023-04"}

def requestNextPage(argQuery, isFirst, cursor=None):

  data = {'query' : argQuery}
  r = requests.post(url=apiUrl, json=data, headers=headers)
  response = r.json()

  itemsPage = response["data"]["boards"][0]["items_page"]["items"] 
  cursor = response["data"]["boards"][0]["items_page"]["cursor"]

  nextBios = []
  for item in itemsPage:
    if item['group']['id'] == "1715196990_inmate_data_report___1": #ready to be matched group
      rawMatchNote = item['column_values'][0]['value']
      if rawMatchNote:
        note = json.loads(rawMatchNote).get('text', '') 
      else:
        note = '' #missing idk what we should do tbh, remove?
      nextBios.append((item['name'], note)) #tuple w ID, bio note
  
  return (cursor, nextBios)

initialQuery = f"""query {{
                  boards(ids: {os.getenv("MONDAY_BOARD_ID")}) {{
                    name
                    items_page (limit: 100) {{
                      cursor
                      items {{
                        id
                        name
                        group {{ id title }} 
                        column_values(ids: "notes_for_matching__1") {{
                          id value }} }} }} }} }}"""

currCursor, fullBios = requestNextPage(initialQuery, isFirst=True)

while currCursor:
  print("\nstarting new page\n")
  nextQuery = f"""query {{
                  boards(ids: {os.getenv("MONDAY_BOARD_ID")}) {{
                    name
                    items_page (limit: 100, cursor: "{currCursor}") {{
                      cursor
                      items {{
                        id
                        name
                        group {{ id title }} 
                        column_values(ids: "notes_for_matching__1") {{
                          id value }} }} }} }} }}"""
  nextPg = requestNextPage(nextQuery, isFirst=False, cursor=currCursor)
  currCursor = nextPg[0]
  fullBios.extend(nextPg[1])
  print(f'current cursor is {currCursor}')
  print(f'heres the first bio of the batch: {nextPg[1][0]}')
  print(f'and the updated fullBio length: {len(fullBios)}') #weird, ending length is 3954 > 3947



