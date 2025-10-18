import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { getSupabaseServerClient } from '@/lib/supabase';

/**
 * This route handler handles the email confirmation
 * flow, exchanging the secure token (from email) for
 * an auth token for authentication.
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await getSupabaseServerClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    // redirect to confirmation page
    if (!error) {
      redirect('/?confirmation=true');
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/error');
}
