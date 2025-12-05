'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { loginWithEmailPassword } from '@/actions/auth';
import { Button, ButtonLink } from '@/components/Button';
import CustomLink from '@/components/CustomLink';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Textbox } from '@/components/Textbox';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const router = useRouter();

  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async ({ email, password }: LoginForm) => {
    setIsLoading(true);
    try {
      const { error } = await loginWithEmailPassword({
        email,
        password,
      });

      // handle errors
      if (error) {
        switch (error.code) {
          case 'email_address_invalid':
            setAuthError('Email address not supported.');
            break;
          case 'email_not_confirmed':
            setAuthError('Email not confirmed.');
            break;
          case 'invalid_credentials':
            setAuthError('Either email or password is incorrect.');
            break;
          default:
            setAuthError(
              'An unexpected error occurred, please try again later.',
            );
        }

        return;
      }
      setAuthError(null);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex h-full w-full flex-col items-center justify-center"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <div className="flex w-106 flex-col gap-4 rounded-2xl bg-gray-1 p-8">
        <p className="text-3xl font-medium">Log in</p>

        {authError && <p className="py-2 text-error">{authError}</p>}

        <div className="flex flex-col">
          <div className="flex flex-col">
            {errors.root && <p className="text-error">{errors.root.message}</p>}

            {/* This is the Email title and textbox */}
            <div className="flex flex-col">
              <p className="text-base text-gray-9">Email</p>
              <Textbox
                type="email"
                placeholder="jamie@example.com"
                {...register('email', { required: true })}
              />
            </div>

            {/* This is the password title and textbox */}
            <div className="flex flex-col">
              <div className="flex flex-row justify-between pt-4">
                <p className="text-base text-gray-9">Password</p>
                <CustomLink
                  variant="secondary"
                  className="text-sm"
                  href="/forgot-password"
                >
                  Forgot password?
                </CustomLink>
              </div>

              <Textbox
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password', { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  // Eye slash icon (password visible)
                  // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-9">
                  //   <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  // </svg>
                  <LuEye />
                ) : (
                  // Eye icon (password hidden)
                  // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-9">
                  //   <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  //   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  // </svg>
                  <LuEyeClosed />
                )}
              </button>

              {errors.password && (
                <p className="text-right text-error">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="primary"
            className="mt-7"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner variant="button" /> : 'Login'}
          </Button>
        </div>

        <div className="h-0.5 w-full border-t-2 border-gray-5" />

        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-medium text-gray-12">
            Don&#39;t have an account?
          </p>
          <ButtonLink variant="secondary" href="/sign-up">
            Sign Up
          </ButtonLink>
        </div>
      </div>
    </form>
  );
}
