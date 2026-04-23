'use client';

import { Button } from '@/components/Button';
import EditProfileForm from '@/components/EditProfilePage';
import { useProfile } from '@/contexts/ProfileProvider';
import SideBar from './sidebar';

export default function EditProfilePage() {
  const { profileData, profileReady } = useProfile();

  if (!profileReady) return null;
  if (!profileData) return null;

  return (
    <div className="flex flex-row">
      {/* <div className="border-red flex w-xs flex-col border-2">
        <p>SIDE BAR</p>
        <p className="text-xl">Hi, {profileData.first_name}!</p>
      </div> */}
      <SideBar />
      <div className="flex w-full flex-col justify-center gap-12">
        {/* Profile Header */}
        <div className="flex flex-row gap-4 border-b-2 border-gray-8 pt-19 pr-158 pb-4 pl-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={31}
            height={37}
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M304 128a80 80 0 1 0-160 0a80 80 0 1 0 160 0m-208 0a128 128 0 1 1 256 0a128 128 0 1 1-256 0M49.3 464h349.5c-8.9-63.3-63.3-112-129-112h-91.4c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4c98.5 0 178.3 79.8 178.3 178.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3"
            ></path>
          </svg>
          <h1 className="mb-4 text-3xl font-semibold">Profile</h1>
        </div>

        <div className="flex justify-center">
          <div className="flex w-2xl flex-col gap-5">
            {/* Account Info*/}
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between">
                <p className="font-medium text-[#0000007d]">Account</p>
                <p className="font-medium text-[#0000007d] underline">
                  {' '}
                  Edit Profile
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl bg-gray-5 px-6 py-4">
                <div className="flex flex-row justify-between gap-10">
                  <p className="font-medium">First name</p>
                  <p className="text-gray-11"> {profileData.first_name} </p>
                </div>

                <div className="flex flex-row justify-between gap-10">
                  <p className="font-medium">Last name</p>
                  <p className="text-gray-11"> {profileData.last_name} </p>
                </div>

                <div className="flex flex-row justify-between gap-10">
                  <div className="flex flex-row gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"
                      />
                    </svg>
                    <p className="font-medium">Email</p>
                  </div>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                    >
                      <path d="M21.5 12a9.5 9.5 0 0 1-9.5 9.5c-1.628 0-3.16-.41-4.5-1.131c-1.868-1.007-3.125-.071-4.234.097a.53.53 0 0 1-.456-.156a.64.64 0 0 1-.117-.703c.436-1.025.835-2.969.29-4.607a9.5 9.5 0 0 1-.483-3a9.5 9.5 0 1 1 19 0" />
                      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.912 2.064C12.728 12.032 12 12.672 12 13.5m.125 3.25H12m.25 0a.25.25 0 1 1-.5 0a.25.25 0 0 1 .5 0" />
                    </g>
                  </svg>
                  <p className="font-medium">Get Support</p>
                </div>
              </div>
            </div>
            <Button>Delete Account</Button>
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
