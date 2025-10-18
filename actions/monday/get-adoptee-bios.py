from dotenv import load_dotenv
import os
import requests
import json
import pandas as pd

load_dotenv(".env.local")

apiKey = os.environ["MONDAY_API_KEY"]
apiUrl = "https://api.monday.com/v2"
headers = {"Authorization" : apiKey, "API-Version" : "2023-04"}


def fetchAdopteeBios():

  def verifyNotNull(itemToIndex):
    if itemToIndex:
      return itemToIndex
    else:
      raise Exception(f'{itemToIndex} is null / not indexable')

  def getQueryString(isInitial=True, c=None):
    return f"""query {{
                    boards(ids: {os.getenv("MONDAY_BOARD_ID")}) {{
                      name
                      items_page (limit: 100{'' if isInitial else f', cursor: "{c}"'}) {{ 
                        cursor
                        items {{
                          id
                          name
                          group {{ id title }} 
                          column_values(ids: "notes_for_matching__1") {{ id value }} }} }} }} }}"""

  def requestNextPage(argQuery, cursor=None):
    data = {'query' : argQuery}
    r = requests.post(url=apiUrl, json=data, headers=headers)
    response = r.json()

    board = verifyNotNull(response["data"]["boards"])
    itemsPage = board[0]["items_page"]["items"] 
    cursor = board[0]["items_page"]["cursor"]

    nextBios = []
    for item in itemsPage:
      if verifyNotNull(item)['group']['id'] == "1715196990_inmate_data_report___1": 
        rawMatchNote = verifyNotNull(item['column_values'])[0]['value']
        if rawMatchNote:
          note = json.loads(rawMatchNote).get('text', '') 
        else:
          note = ''
        nextBios.append((item['name'], note))
    return (cursor, nextBios)

  initialQuery = getQueryString(isInitial=True)
  currCursor, fullBios = requestNextPage(initialQuery)

  while currCursor:
    print("\nstarting new page\n")
    nextQuery = getQueryString(isInitial=False, c=currCursor)
    nextPg = requestNextPage(nextQuery, cursor=currCursor)
    currCursor = verifyNotNull(nextPg)[0]
    fullBios.extend(nextPg[1])

  adopteeIDs = [item[0] for item in fullBios]
  adopteeBios = [item[1] for item in fullBios]
  biosdf = pd.DataFrame(data={'Adoptee ID': adopteeIDs, 'Adoptee Bio': adopteeBios})

  return biosdf

