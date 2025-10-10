'use server';

import { cookies } from 'next/headers';
import { createServerClient as createServerClientSB } from '@supabase/ssr';
import Logger from '../logging';

export async function getSupabaseServerClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error(
      'No Supabase environment variables detected, please make sure they are in place!',
    );
  }

  const cookieStore = await cookies();

  return createServerClientSB(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              Logger.error(
                `Error setting cookie ${name}:${value} with options ${options}`,
              );
            }
          });
        },
      },
    },
  );
}
