
DROP FUNCTION IF EXISTS public.find_top_k_filtered(text, integer, text, text, text[], text);

CREATE OR REPLACE FUNCTION public.find_top_k_filtered(
  query_embedding text,
  k integer,
  adopter_gender text DEFAULT NULL,
  adopter_veteran_status text DEFAULT NULL,
  adopter_state text DEFAULT NULL,
  adopter_age_pref integer[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  bio text,
  gender text,
  state text,
  veteran_status text,
  age integer,
  embedding text,
  similarity double precision
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  qvec vector := trim(both from query_embedding)::vector;
  age_lo int;
  age_hi int;
  has_age boolean := adopter_age_pref IS NOT NULL AND coalesce(cardinality(adopter_age_pref), 0) >= 2;
  has_gender boolean := adopter_gender IS NOT NULL AND length(trim(adopter_gender)) > 0;
  has_state boolean := adopter_state IS NOT NULL AND length(trim(adopter_state)) > 0;
  has_vet boolean := adopter_veteran_status IS NOT NULL AND length(trim(adopter_veteran_status)) > 0;
  lvl int;
  winner int := 4;
  cnt int;
BEGIN
  IF has_age THEN
    age_lo := adopter_age_pref[1];
    age_hi := adopter_age_pref[2];
  END IF;

  FOR lvl IN 0..4 LOOP
    SELECT count(*)::int INTO cnt
    FROM adoptee_vector_test t
    WHERE t.embedding IS NOT NULL
      AND t.dob IS NOT NULL
      AND t.status = 'WAIT_LISTED'::adoptee_status
      AND (NOT has_age OR lvl >= 4 OR EXTRACT(YEAR FROM age(current_date, t.dob::date))::integer BETWEEN age_lo AND age_hi)
      AND (NOT has_gender OR lvl >= 3 OR lower(trim(t.gender)) = lower(trim(adopter_gender)))
      AND (NOT has_state OR lvl >= 2 OR lower(trim(t.state)) = lower(trim(adopter_state)))
      AND (NOT has_vet OR lvl >= 1 OR lower(trim(coalesce(t.veteran_status, ''))) = lower(trim(adopter_veteran_status)));

    IF cnt >= k THEN
      winner := lvl;
      EXIT;
    END IF;
  END LOOP;

  RETURN QUERY
  SELECT
    t.id,
    t.first_name,
    t.last_name,
    t.bio,
    t.gender,
    t.state,
    t.veteran_status,
    EXTRACT(YEAR FROM age(current_date, t.dob::date))::integer,
    t.embedding,
    (1 - (t.embedding::vector <=> qvec))::double precision
  FROM adoptee_vector_test t
  WHERE t.embedding IS NOT NULL
    AND t.dob IS NOT NULL
    AND t.status = 'WAIT_LISTED'::adoptee_status
    AND (NOT has_age OR winner >= 4 OR EXTRACT(YEAR FROM age(current_date, t.dob::date))::integer BETWEEN age_lo AND age_hi)
    AND (NOT has_gender OR winner >= 3 OR lower(trim(t.gender)) = lower(trim(adopter_gender)))
    AND (NOT has_state OR winner >= 2 OR lower(trim(t.state)) = lower(trim(adopter_state)))
    AND (NOT has_vet OR winner >= 1 OR lower(trim(coalesce(t.veteran_status, ''))) = lower(trim(adopter_veteran_status)))
  ORDER BY 1 - (t.embedding::vector <=> qvec) DESC
  LIMIT k;
END;
$$;

GRANT EXECUTE ON FUNCTION public.find_top_k_filtered(text, integer, text, text, text, integer[]) TO anon, authenticated, service_role;
