'use client';

import EditProfileForm from '@/components/EditProfilePage';
import { useProfile } from '@/contexts/ProfileProvider';

export default function EditProfilePage() {
  const { profileData, profileReady } = useProfile();

  // Wait until profile is loaded from provider
  if (!(profileReady && profileData)) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Profile</h1>

      <EditProfileForm profile={profileData} />
    </div>
  );
}
