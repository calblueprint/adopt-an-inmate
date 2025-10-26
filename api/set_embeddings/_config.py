# Model configuration
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

dimensions = {"sentence-transformers/all-MiniLM-L6-v2": 384}
MODEL_DIMENSION = dimensions[MODEL_NAME]

# Supabase configuration
SUPABASE_TABLE_NAME = "adoptee_test"

# Collection configuration
VECS_COLLECTION_NAME = "adoptee_vector_test"
