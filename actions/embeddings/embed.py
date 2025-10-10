from config import supabase_client, vx, model

def store_data():
  """Store the vector information in the adoptee_vector table."""

  adoptee = supabase_client.table("adoptee").select("*").execute().data
  adoptee_vector = vx.get_or_create_collection("adoptee_vector", dimension=384)

  records = []

  for row in adoptee:
    row_id = row['id']
    text = row['bio']
    embedding = model.encode(text).tolist()

    metadata = {
      "bio": row["bio"], 
      "gender": row["gender"],
      "age": row["age"],
      "veteran_status": row["veteran_status"],
      "offense": row["offense"],
      "state": row["state"]
    }

    records.append(((row_id, embedding, metadata)))

  try:
    adoptee_vector.upsert(records)
  except Exception as e:
    print("Upsert failed:", e)

  vx.disconnect()

if __name__ == "__main__":
  store_data()
