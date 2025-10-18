'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import Logger from '../logging';

export async function signOut() {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    Logger.error(`Error signing out: ${error.message}`);
    return { error };
  }

  revalidatePath('/');
  redirect('/login');
}
