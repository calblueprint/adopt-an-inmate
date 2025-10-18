'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmailPassword } from '@/actions/auth';
import CustomLink from '@/components/CustomLink';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    const { error } = await loginWithEmailPassword({
      email,
      password,
    });

    if (error) {
      if (error.code && error.code === 'invalid_credentials') {
        alert('Invalid login credentials. Please try again.');
      } else {
        alert(`Error signing in user: ${error.message}`); // in case there are other errors
      }
    } else {
      router.push('/');
    }
  };

  return (
    <div className="mx-auto mt-24 flex max-w-md flex-col gap-8 rounded-lg border border-gray-300 p-8 shadow-lg">
      <h2>Login</h2>
      <CustomLink href="/">← Back to Home</CustomLink>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}
