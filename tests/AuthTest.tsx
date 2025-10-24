'use client';

import { useAuth } from '@/contexts/AuthProvider';

export default function AuthTest() {
  const { userId, userEmail } = useAuth();

  return (
    <div>
      <h2>Auth Test Component</h2>
      <p>User ID: {userId ?? 'Not logged in'}</p>
      <p>User Email: {userEmail ?? 'Not logged in'}</p>
    </div>
  );
}
