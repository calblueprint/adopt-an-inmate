'use client';

import { useState } from 'react';
import { BsPerson } from 'react-icons/bs';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { useAuth } from '@/contexts/AuthProvider';
import { useProfile } from '@/contexts/ProfileProvider';

export default function ProfileView() {
  const { profileData, profileReady } = useProfile();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { userEmail } = useAuth();

  if (!profileReady) return null;
  if (!profileData) return null;

  return (
    <div className="flex flex-row">
      {/* <SideBar /> */}
      <div className="flex w-full flex-col justify-center gap-12">
        {/* Profile Header */}
        <div className="flex flex-row gap-4 border-b-2 border-gray-8 pt-19 pr-158 pb-4 pl-20">
          <BsPerson size={50} />
          <h1 className="mb-4 text-3xl font-semibold">Profile</h1>
        </div>

        <div className="flex justify-center">
          <div className="flex w-2xl flex-col gap-5">
            {/* Account Info*/}
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between">
                <p className="font-medium text-[#0000007d]">Account</p>
                <p
                  className="cursor-pointer font-medium text-[#0000007d] underline hover:text-black"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  {' '}
                  Edit Profile
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl bg-gray-5 px-6 py-4">
                <div className="flex flex-row justify-between gap-10">
                  <p className="font-medium">Name</p>
                  <p className="text-gray-11">
                    {' '}
                    {profileData.first_name + ' ' + profileData.last_name}{' '}
                  </p>
                </div>

                <div className="flex flex-row justify-between gap-10">
                  <p className="font-medium">Email</p>
                  <p className="text-gray-11"> {userEmail} </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-medium text-[#0000007d]">
                Personal Information
              </p>
              <div className="flex flex-col gap-3 rounded-2xl bg-gray-5 px-6 pt-5 pb-3">
                <div className="flex flex-row justify-between gap-10">
                  <p className="font-medium">Date of Birth</p>
                  {/* Will need to parse this data into the form we want */}
                  <p className="text-gray-11"> {profileData.date_of_birth} </p>
                </div>
                <div className="flex flex-row justify-between gap-10">
                  <p className="font-medium">Pronouns</p>
                  <p className="text-gray-11"> {profileData.pronouns} </p>
                </div>
                <div className="flex flex-row justify-between gap-10">
                  <p className="font-medium">State</p>
                  <p className="text-gray-11"> {profileData.state} </p>
                </div>
                <div className="flex flex-row justify-between gap-10">
                  <p className="font-medium">Veteran</p>
                  <p className="text-gray-11">
                    {' '}
                    {profileData.veteran_status ? 'Yes' : 'No'}{' '}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium text-[#0000007d]">More</p>
              <div className="flex flex-row rounded-2xl bg-gray-5 p-5">
                <div className="flex flex-row gap-4">
                  <p className="font-medium">Get Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditProfileOpen && (
          <EditProfileModal
            profileData={profileData}
            onClose={() => setIsEditProfileOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
