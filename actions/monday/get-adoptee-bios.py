from dotenv import load_dotenv
import os
import requests
import json
# import gql

load_dotenv("example.env")

apiKey = os.environ["MONDAY_API_KEY"]
apiUrl = "https://api.monday.com/v2"
headers = {"Authorization" : apiKey, "API-Version" : "2023-04"}

print(os.getenv("MONDAY_BOARD_ID"))


queryBios = f"""query {{
                  boards(ids: {os.getenv("MONDAY_BOARD_ID")}) {{
                    name
                    items_page (limit: 100) {{
                      cursor
                      items {{
                        id
                        name
                        group {{ id title }} 
                        column_values(ids: "notes_for_matching__1") {{
                          id
                          value
                        }}
                      }}
                    }}
                  }}
                }}"""

data = {'query' : queryBios}
r = requests.post(url=apiUrl, json=data, headers=headers)
response = r.json()

itemsPage = response["data"]["boards"][0]["items_page"]["items"]  #first page of items
cursor = response["data"]["boards"][0]["items_page"]["cursor"]

bios = []

for item in itemsPage:
  if item['group']['id'] == "1715196990_inmate_data_report___1": #ready to be matched group
    rawMatchNote = item['column_values'][0]['value']
    if rawMatchNote:
      note = json.loads(rawMatchNote).get('text', '') 
    else:
      note = '' #missing idk what we should do tbh, remove?
    bios.append((item['name'], note)) #tuple w ID, bio note

while cursor: #next page!!
  ...

def requestNextPage():
  data = {'query' : queryBios}
  r = requests.post(url=apiUrl, json=data, headers=headers)
  response = r.json()

  itemsPage = response["data"]["boards"][0]["items_page"]["items"]  #first page of items
  cursor = response["data"]["boards"][0]["items_page"]["cursor"]

print(bios[0][1])


