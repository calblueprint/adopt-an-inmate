import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';

export default async function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();

  // note: we use getUser() instead of getSession() because
  // this sends a request to the Auth server to revalidate auth token,
  // preventing potential spoofing of cookies
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // redirect non-authenticated users to forgot password instead
  if (error || !user) return redirect('/forgot-password');

  return children;
}
