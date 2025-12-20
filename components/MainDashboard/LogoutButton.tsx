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
      return '';
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
    <div className="rounded-2xl bg-black/3 px-4 py-3">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-3">
          <div className="h-7 w-7 rounded-full bg-black/25" />
          <p className="text-lg font-medium">{displayName}</p>
        </div>

        <div>
          <TbLogout
            className="h-5 w-5 cursor-pointer text-red-12"
            onClick={() => handleSignOut()}
          />
        </div>
      </div>
    </div>
  );
}
