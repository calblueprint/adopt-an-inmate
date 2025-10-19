'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginWithEmailPassword } from '@/actions/auth';
import { Button } from '../Button';
import CustomLink from '../CustomLink';

export function LoginCard() {
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
    <div className="bg-gray1 flex w-106 flex-col rounded-2xl">
      <div className="px-8 py-7">
        <div className="pb-5">
          <p className="text-3xl font-bold">Log in</p>
        </div>

        <div className="flex flex-col py-5">
          <div className="flex flex-col">
            {/* This is the Email title and textbox */}
            <div className="flex flex-col">
              <p className="text-gray9 text-base">Email</p>
              {/* <TextBox input="email" placeholder="jamie@example.com" /> */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* This is the password title and textbox */}
            <div className="flex flex-col">
              <div className="flex flex-row justify-between pt-4">
                <p className="text-gray9 text-base">Password</p>
                <CustomLink variant="secondary" className="text-sm" href="/">
                  Forgot your password?
                </CustomLink>
              </div>

              {/* <TextBox input="password" placeholder="Password" /> */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button variant="login" className="mt-7" onClick={handleSignIn}>
            Login
          </Button>
        </div>

        <hr className="border-gray3 h-0.5 w-full border border-t-2" />

        <div className="flex flex-row items-center justify-between pt-8">
          <p className="text-gray12 text-sm font-medium">
            Don&#39;t have an account?
          </p>
          <Button variant="secondary">Sign Up</Button>
        </div>
      </div>
    </div>
  );
}
