'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmailPassword } from '@/actions/auth';
import { Button } from '../Button';
import Checkbox from '../Checkbox';
import CustomLink from '../CustomLink';
import { Textbox } from '../Textbox';

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
        <div className="pb-2">
          <p className="text-3xl font-medium">Sign up</p>
          <p className="mt-2 text-gray-9">
            Already have an account?{' '}
            <CustomLink href="/" className="text-link">
              Sign in.
            </CustomLink>
          </p>
        </div>

        <div className="flex flex-col py-5">
          <div className="flex flex-col gap-6">
            {/* This is the Email title and textbox */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-9">Email</p>
              <Textbox
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* This is the password title and textbox */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-9">Password</p>
              <Textbox
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {/* This is the password confirmation title and textbox */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-9">Password confirmation</p>
              <Textbox
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            {confirmPassword.length > 0 && !passwordsMatch && (
              <p>Passwords do not match</p>
            )}
          </div>

          {/* This is the checkbox and the terms of service line */}
          <label
            className="mt-8 flex items-center gap-1.5 select-none"
            htmlFor="tos"
          >
            <Checkbox id="tos" />
            <p className="text-gray-9">
              I&#39;ve read and agreed to the{' '}
              <CustomLink href="#">Terms of Service</CustomLink>
            </p>
          </label>

          <Button variant="login" className="mt-7" onClick={handleSignUp}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
