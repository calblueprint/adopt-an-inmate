import { redirect } from 'next/navigation';
import { fetchProfileById } from '@/actions/queries/profile';
import EditProfileForm from '@/components/EditProfilePage';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function EditProfilePage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await fetchProfileById(user.id);

  if (!profile) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Profile</h1>
      <EditProfileForm profile={profile} />
    </div>
  );
}
