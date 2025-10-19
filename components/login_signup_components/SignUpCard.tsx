'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { signUpWithEmailPassword } from '@/actions/auth';
import { Button } from '../Button';
import Checkbox from './Checkbox';

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
    <div className="flex h-1/2 w-[26.438rem] flex-col rounded-[0.938rem] bg-[#FDFDFD]">
      <div className="pt-[27px] pr-[30px] pb-[27px] pl-[30px]">
        <div className="p-b-[1.188rem]">
          <p className="font-[Bespoke Sans Variable] text-[26px] font-bold">
            Sign Up
          </p>
          <p className="text-[#969696]">
            Already have an account?{' '}
            <a href="/" target="_blank" className="text-[#1D69B3]">
              Sign In
            </a>
          </p>
        </div>

        <div className="flex flex-col pt-[19px] pb-[1.25rem]">
          <div className="flex flex-col gap-[23px]">
            {/* This is the Email title and textbox */}
            <div className="flex flex-col gap-[0px]">
              <p className="font-[Bespoke Sans Variable] text-[13px] font-normal text-[#8C8D99] not-italic">
                Email
              </p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* This is the password title and textbox */}
            <div className="flex flex-col gap-[0px]">
              <p className="font-[Bespoke Sans Variable] text-[13px] font-normal text-[#8C8D99] not-italic">
                Password
              </p>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {/* This is the password confirmation title and textbox */}
            <div className="flex flex-col gap-[0px]">
              <p className="font-[Bespoke Sans Variable] text-[13px] font-normal text-[#8C8D99] not-italic">
                Password Confirmation
              </p>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* This is the checkbox and the terms of service line */}
          <div className="flex flex-row gap-[7px] pt-[31px]">
            <Checkbox />
            <p>I&#39;ve read and agreed to the terms of service</p>
          </div>

          {confirmPassword.length > 0 &&
            (passwordsMatch ? (
              <p>Passwords match</p>
            ) : (
              <p>Passwords do not match</p>
            ))}

          <Button variant="login" className="mt-[27px]" onClick={handleSignUp}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
