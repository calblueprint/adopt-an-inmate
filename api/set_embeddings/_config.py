import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env.local"))

# Model configuration
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

dimensions = {"sentence-transformers/all-MiniLM-L6-v2": 384}
MODEL_DIMENSION = dimensions[MODEL_NAME]

# Collection configuration
VECS_COLLECTION_NAME = "adoptee_vector_test"

# Monday configuration
MONDAY_API_URL = "https://api.monday.com/v2"
MONDAY_API_VERSION = "2023-04"
MONDAY_API_KEY = os.getenv("MONDAY_API_KEY")
MONDAY_BOARD_ID = os.getenv("MONDAY_BOARD_ID")
MONDAY_GROUP_ID = "1715196990_inmate_data_report___1"

MONDAY_COLUMN_IDS = {
  "first_name": "fname__1",
  "last_name": "lname__1",
  "bio": "notes_for_matching__1",
  "gender": "gender__1",
  "dob": "date_of_birth__1",
  "veteran_status": "color1__1",
  "offense": "offense__1",
  "state": "dropdown9__1"
}