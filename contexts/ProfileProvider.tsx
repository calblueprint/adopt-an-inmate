'use client';

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Logger from '@/actions/logging';
import { fetchProfileById, upsertProfile } from '@/actions/queries/profile';
import { Profile } from '@/types/schema';
import { useAuth } from './AuthProvider';

type ProfileContextType = {
  profileData: Profile | null;
  profileReady: boolean;
  loadProfile: () => Promise<void>;
  setProfile: (profile: Profile, num_ext?: number) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export default function ProfileProvider({ children }: ProfileProviderProps) {
  const { userId } = useAuth();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [profileReady, setProfileReady] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setProfileData(null);
      setProfileReady(true);
      return;
    }

    try {
      setProfileReady(false);
      const fetchedProfile = await fetchProfileById(userId);
      setProfileData(fetchedProfile);
    } catch (error) {
      Logger.error(`Error fetching profile: ${error}`);
    } finally {
      setProfileReady(true);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const setProfile = useCallback(
    async (profile: Profile, num_ext: number = 0) => {
      const { error } = await upsertProfile(profile, num_ext);
      if (error) return; // TODO: error handling

      setProfileData(profile);
    },
    [],
  );

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        profileReady,
        loadProfile,
        setProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
