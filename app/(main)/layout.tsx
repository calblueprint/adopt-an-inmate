import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/actions/supabase/server';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // fetch session
  const supabase = await getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.expires_in <= 0) return redirect('/login');

  return children;
}
