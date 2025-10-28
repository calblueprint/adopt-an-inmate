'use client';

import React from 'react';
import { useProfile } from '@/contexts/ProfileProvider'; // adjust path if needed

export default function ProfileTest() {
  const { profileData, profileReady } = useProfile();

  if (!profileReady) return <div>Loading...</div>;
  if (!profileData) return <div>No profile data found.</div>;

  return (
    <div>
      <div>User ID: {profileData.user_id}</div>
      <div>First Name: {profileData.first_name}</div>
      <div>Last Name: {profileData.last_name}</div>
      <div>Email: {profileData.email}</div>
      <div>Date of Birth: {profileData.date_of_birth}</div>
      <div>Pronouns: {profileData.pronouns}</div>
      <div>State: {profileData.state}</div>
      <div>Veteran Status: {profileData.veteran_status ? 'true' : 'false'}</div>
    </div>
  );
}
