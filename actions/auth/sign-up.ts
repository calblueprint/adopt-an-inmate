'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import { EmailPasswordCredentials } from '@/types/types';
import Logger from '../logging';

export async function signUpWithEmailPassword({
  email,
  password,
}: EmailPasswordCredentials) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    Logger.error(`Error attempting sign up: ${error.message} (${error.code})`);
    return { error: JSON.parse(JSON.stringify(error)) };
  }

  revalidatePath('/');
  redirect('/');
}
