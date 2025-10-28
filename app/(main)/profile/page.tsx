'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/actions/auth';
import CustomLink from '@/components/CustomLink';
import ProfileTest from '@/tests/ProfileTest';

export default function ProfilePage() {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) alert(error.message);
    else router.push('/');
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <CustomLink href="/">← Go back</CustomLink>
      <p>Profile page</p>
      <ProfileTest />
      <button onClick={() => handleSignOut()}>Sign out</button>
    </div>
  );
}
