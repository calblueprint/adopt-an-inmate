'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmailPassword } from '@/actions/auth';
import CustomLink from '@/components/CustomLink';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const passwordsMatch = useMemo(
    () => password === confirmPassword,
    [password, confirmPassword],
  );

  const handleSignUp = async () => {
    if (!passwordsMatch) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    const { error } = await signUpWithEmailPassword({
      email,
      password,
    });

    if (error) {
      if (error.code && error.code === 'user_already_exists') {
        alert(
          'This email is already registered. Please use a different email.',
        );
      } else {
        alert(`Error signing up user: ${error.message}`);
      }
    } else {
      router.push('/');
    }
  };

  return (
    <div className="mx-auto mt-24 flex max-w-md flex-col gap-8 rounded-lg border border-gray-300 p-8 shadow-lg">
      <h2>Sign Up Page</h2>
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

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />

      {confirmPassword.length > 0 &&
        (passwordsMatch ? (
          <p>Passwords match</p>
        ) : (
          <p>Passwords do not match</p>
        ))}

      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}
