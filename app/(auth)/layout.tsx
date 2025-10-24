import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import { getSupabaseServerClient } from '@/lib/supabase';

export default async function MainLayout({
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

  // redirect already logged-in users to main page
  if (user) return redirect('/');

  return (
    <div className="flex size-full flex-col items-center gap-4">
      <Logo />

      {children}

      {/* spacer */}
      <div className="h-22" />
    </div>
  );
}
