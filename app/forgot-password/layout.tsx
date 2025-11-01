import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';

export default async function ForgotPasswordLayout({
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
  } = await supabase.auth.getUser();

  // redirect already logged-in users to reset password instead
  if (user) return redirect('/reset-password');

  return children;
}
