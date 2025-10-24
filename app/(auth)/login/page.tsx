'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmailPassword } from '@/actions/auth';
import { Button, ButtonLink } from '@/components/Button';
import CustomLink from '@/components/CustomLink';
import { Textbox } from '@/components/Textbox';

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
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-106 flex-col rounded-2xl bg-gray-1">
        <div className="px-8 py-7">
          <div className="pb-2">
            <p className="text-3xl font-medium">Log in</p>
          </div>

          <div className="flex flex-col py-5">
            <div className="flex flex-col">
              {/* This is the Email title and textbox */}
              <div className="flex flex-col">
                <p className="text-base text-gray-9">Email</p>
                <Textbox
                  type="email"
                  placeholder="jamie@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {/* This is the password title and textbox */}
              <div className="flex flex-col">
                <div className="flex flex-row justify-between pt-4">
                  <p className="text-base text-gray-9">Password</p>
                  <CustomLink
                    variant="secondary"
                    className="text-sm"
                    href="/reset-password"
                  >
                    Forgot password?
                  </CustomLink>
                </div>

                <Textbox
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

          <div className="h-0.5 w-full border-t-2 border-gray-5" />

          <div className="flex flex-row items-center justify-between pt-8">
            <p className="text-sm font-medium text-gray-12">
              Don&#39;t have an account?
            </p>
            <ButtonLink variant="secondary" href="/sign-up">
              Sign Up
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
