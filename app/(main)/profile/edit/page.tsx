'use client';

import EditProfileForm from '@/components/EditProfilePage';
import { useProfile } from '@/contexts/ProfileProvider';

export default function EditProfilePage() {
  const { profileData, profileReady } = useProfile();

  if (!profileReady) return null;
  if (!profileData) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Profile</h1>

      {/* Current profile info */}
      <div className="mb-4">
        <p>First Name: {profileData.first_name}</p>
        <p>Last Name: {profileData.last_name}</p>
        <p>State: {profileData.state}</p>
        <p>Veteran: {profileData.veteran_status ? 'Yes' : 'No'}</p>
      </div>

      <EditProfileForm profile={profileData} />
    </div>
  );
}
