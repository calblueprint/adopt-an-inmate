'use server';

import { autoEmailSender } from '@/actions/emails/email';
import { getSupabaseServerClient } from '@/lib/supabase';
import { AdopteeMatch, AdopterApplicationUpdate } from '@/types/schema';

/* Fetch top k (by simliaity) adoptee rows with hierarchical filtering:
 * Start with all filters applied. If no results, progressively drop filters
 * starting with state, then veteran_status, and finally gender.
 */
export async function fetchTopK(
  embedding: number[],
  k_value: number,
  gender?: string,
  veteran_status?: string,
  offense?: string[],
  state?: string,
): Promise<AdopteeMatch[]> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.rpc('find_top_k_filtered', {
    query_embedding: JSON.stringify(embedding),
    k: k_value,
    adopter_gender: gender,
    adopter_veteran_status: veteran_status,
    adopter_offense: offense,
    adopter_state: state,
  });

  if (error) {
    throw new Error(`Error fetching top k vectors: ${error.message}`);
  }

  return data;
}

export async function fetchApplication(app_UUID: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('adopter_applications_dummy')
    .select('*')
    .eq('app_uuid', app_UUID)
    .maybeSingle();

  if (error) {
    throw new Error(`Error fetching application: ${error.message}`);
  }

  return data;
}

export async function fetchUserApplicationUUIDs(adopter_UUID: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('adopter_applications_dummy')
    .select('*')
    .eq('adopter_uuid', adopter_UUID);

  if (error) {
    throw new Error(`Error fetching adopter's applications: ${error.message}`);
  }

  return data;
}

export async function upsertApplication(
  app: AdopterApplicationUpdate & {
    adopter_uuid: string;
    app_uuid: string;
  },
) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('adopter_applications_dummy')
    .upsert(app)
    .select()
    .single();

  if (error)
    throw new Error(`Error upserting application data: ${error.message}`);

  return data;
}
//this function is used to submit the application and send an email to the adopter
export async function submitApplication(
  app: AdopterApplicationUpdate & {
    adopter_uuid: string;
    app_uuid: string;
  },
  adopterEmail: string,
) {
  const data = await upsertApplication(app);

  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_KEY) {
    throw new Error(
      'Missing email configuration: BREVO_SMTP_USER and BREVO_SMTP_KEY must be set in environment variables.',
    );
  }

  const text = `Hi! Thank you for submitting your adoption application (ID: ${app.app_uuid}). We'll review it and get back to you with a match soon.

Best,
The Adopt an Inmate Team`;

  await autoEmailSender(text, 'Adoption Application Submitted', adopterEmail);

  return data;
}
