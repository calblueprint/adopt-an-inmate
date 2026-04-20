'use client';

import { TbLogout } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import { signOut } from '@/actions/auth';
import Logger from '@/actions/logging';
import { useProfile } from '@/contexts/ProfileProvider';

export default function LogoutButton() {
  const router = useRouter();
  const { profileData, profileReady } = useProfile();

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) alert(error.message);
    else router.push('/');
  };

  const getDisplayName = () => {
    if (!profileReady || !profileData) {
      return 'Loading...';
    }

    const firstName = profileData.first_name?.trim();
    const lastName = profileData.last_name?.trim();

    if (!firstName || firstName.length === 0) {
      Logger.error(
        `First name is missing or empty in user: ${profileData.user_id}`,
      );
    }

    if (!lastName || lastName.length === 0) {
      Logger.error(
        `Last name is missing or empty in user: ${profileData.user_id}`,
      );
    }

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    return '';
  };

  const displayName = getDisplayName();

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-gray-2 px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gray-5" />
        <span className="truncate text-sm font-medium text-gray-12">
          {displayName}
        </span>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="rounded p-1.5 text-gray-9 transition-colors hover:bg-red-2 hover:text-red-12"
        aria-label="Logout"
      >
        <TbLogout className="h-5 w-5" />
      </button>
    </div>
  );
}
