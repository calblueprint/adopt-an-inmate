'use server';

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

/**
 * Creates a SERVICE Supabase Client, which
 * bypasses security checks. ONLY USE THIS IF YOU
 * KNOW WHAT YOU ARE DOING.
 */
export async function dangerous_getSupabaseServiceClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_KEY
  ) {
    throw new Error(
      'No Supabase environment variables detected, please make sure they are in place!',
    );
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
