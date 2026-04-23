'use client';

import EditProfileForm from '@/components/EditProfilePage';
import { useProfile } from '@/contexts/ProfileProvider';

export default function EditProfilePage() {
  const { profileData, profileReady } = useProfile();

  if (!profileReady) return null;
  if (!profileData) return null;

  return (
    <div className="flex flex-row">
      <div className="border-red flex flex-col border-2">
        <p>SIDE BAR</p>
      </div>
      <div className="border-red flex flex-col items-center justify-center border-2 p-6">
        <h1 className="mb-4 text-2xl font-semibold">Profile</h1>

        <div className="flex flex-col gap-5 border-2 border-black">
          <div className="flex flex-col gap-3">
            <p>Account</p>
            <div className="flex flex-col gap-3 rounded-2xl bg-gray-13 px-6 py-4">
              <div className="flex flex-row justify-between gap-10">
                <p className="font-medium">First name</p>
                <p className="text-gray-11"> {profileData.first_name} </p>
              </div>

              <div className="flex flex-row justify-between gap-10">
                <p className="font-medium">Last name</p>
                <p className="text-gray-11"> {profileData.last_name} </p>
              </div>

              <div>
                <p className="font-medium">Email</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p>Personal Information</p>
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
            <p>More</p>
          </div>
        </div>

        {/* Current profile info */}
        {/* <div className="mb-4">
        <p>First Name: {profileData.first_name}</p>
        <p>Last Name: {profileData.last_name}</p>
        <p>State: {profileData.state}</p>
        <p>Veteran: {profileData.veteran_status ? 'Yes' : 'No'}</p>
      </div> */}

        <EditProfileForm profile={profileData} />
      </div>
    </div>
  );
}
