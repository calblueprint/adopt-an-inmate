'use client';

import { useEffect, useState } from 'react';
import { fetchProfileById } from '@/actions/queries/profile';
import EditProfileForm from '@/components/EditProfilePage';
import { useAuth } from '@/contexts/AuthProvider';
import { Profile } from '@/types/schema';

export default function EditProfilePage() {
  const { userId } = useAuth();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchProfileById(userId);
        setProfileData(profile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  if (loading) return null; // or a loading spinner

  if (!profileData) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Profile</h1>

      <EditProfileForm profile={profileData} />
    </div>
  );
}
