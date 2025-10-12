'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginWithEmailPassword } from '@/actions/auth';
import { Button } from './Button';
import CustomLink from './CustomLink';

export function LogInCard() {
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
    <div className="flex h-1/2 w-[26.438rem] flex-col rounded-[0.938rem] bg-[#FDFDFD]">
      <div className="pt-[27px] pr-[30px] pb-[27px] pl-[30px]">
        <div className="p-b-[1.188rem]">
          <p className="font-[Bespoke Sans Variable] text-[26px] font-bold">
            Log in
          </p>
        </div>

        <div className="flex flex-col pt-[19px] pb-[1.25rem]">
          <div className="flex flex-col">
            {/* This is the Email title and textbox */}
            <div className="flex flex-col gap-[0px]">
              <p className="font-[Bespoke Sans Variable] text-[16px] font-normal text-[#8C8D99] not-italic">
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
              <div className="flex flex-row justify-between pt-[16px]">
                <p className="font-[Bespoke Sans Variable] text-[16px] font-normal text-[#8C8D99] not-italic">
                  Password
                </p>
                <CustomLink
                  variant="secondary"
                  className="text-[13px]"
                  href="/"
                >
                  Forgot your password?
                </CustomLink>
              </div>

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button variant="login" className="mt-[27px]" onClick={handleSignIn}>
            Login
          </Button>
        </div>

        <hr className="h-[2px] w-full border border-t-2 border-[#E1E1E1]" />

        <div className="flex flex-row items-center justify-between pt-[2rem]">
          <p className="font-[Bespoke Sans Variable] text-[0.813rem] text-[#1E1F24]">
            Don&#39;t have an account?
          </p>
          <Button variant="secondary">Sign Up</Button>
        </div>
      </div>
    </div>
  );
}
