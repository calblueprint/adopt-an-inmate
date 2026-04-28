'use client';

import { LuLogOut } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { signOut } from '@/actions/auth';
import { Button } from '@/components/Button';

export default function LogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) alert(error.message);
    else router.push('/');
  };

  return (
    <Button
      type="button"
      onClick={handleSignOut}
      variant="outline"
      aria-label="Logout"
    >
      <LuLogOut className="h-5 w-5 text-red-9" />
    </Button>
  );
}
