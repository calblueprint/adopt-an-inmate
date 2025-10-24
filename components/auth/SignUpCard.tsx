'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmailPassword } from '@/actions/auth';
import { Button } from '../Button';
import CustomLink from '../CustomLink';
import Checkbox from './Checkbox';
import { TextBox } from './TextBoxField';

export function SignUpCard() {
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
    <div className="flex w-106 flex-col rounded-2xl bg-gray-1">
      <div className="px-8 py-7">
        <div className="pb-5">
          <p className="text-3xl font-bold">Sign Up</p>
          <p className="text-gray-9">
            Already have an account?{' '}
            <CustomLink href="/" className="text-link">
              Sign In
            </CustomLink>
          </p>
        </div>

        <div className="flex flex-col py-5">
          <div className="flex flex-col gap-6">
            {/* This is the Email title and textbox */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-9">Email</p>
              <TextBox
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* This is the password title and textbox */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-9">Password</p>
              <TextBox
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {/* This is the password confirmation title and textbox */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-9">Password Confirmation</p>
              <TextBox
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* This is the checkbox and the terms of service line */}
          <div className="flex flex-row gap-2 pt-8">
            <Checkbox />
            <p>I&#39;ve read and agreed to the terms of service</p>
          </div>

          {confirmPassword.length > 0 &&
            (passwordsMatch ? (
              <p>Passwords match</p>
            ) : (
              <p>Passwords do not match</p>
            ))}

          <Button variant="login" className="mt-7" onClick={handleSignUp}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
