import type { Database } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';
import { expect, test } from 'vitest';
import { loadEnvironment } from '@/lib/test-utils';

const run = process.env.RUN_FIND_TOP_K_INTEGRATION === '1';

test.skipIf(!run)(
  'find_top_k_filtered matches TestTopK-style inputs',
  async () => {
    loadEnvironment();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Missing Supabase URL or key');
    }

    const embedding = Array.from({ length: 384 }, () => Math.random() * 2 - 1);
    const k_value = 3;
    const gender = 'Female';
    const veteran_status = 'Unknown';
    const state = 'Wyoming';
    /** Page used `age = 70` as a single number; RPC expects inclusive [min, max]. */
    const adopter_age_pref: [number, number] = [18, 70];

    const supabase = createClient<Database>(url, key);
    const { data, error } = await supabase.rpc('find_top_k_filtered', {
      query_embedding: JSON.stringify(embedding),
      k: k_value,
      adopter_gender: gender,
      adopter_veteran_status: veteran_status,
      adopter_state: state,
      adopter_age_pref,
    });

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data!.length).toBeLessThanOrEqual(k_value);

    if (data!.length > 0) {
      const row = data![0]!;
      expect(row).toHaveProperty('id');
      expect(row).toHaveProperty('similarity');
      expect(row).toHaveProperty('age');
      expect(row).not.toHaveProperty('offense');
    }
  },
);
