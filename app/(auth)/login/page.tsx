'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuEye, LuEyeOff } from 'react-icons/lu';
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

            {/* email title and textbox */}
            <div className="flex flex-col">
              <p className="text-base text-gray-9">Email</p>
              <Textbox
                type="email"
                placeholder="jamie@example.com"
                {...register('email', { required: true })}
              />
            </div>

            {/* password title and textbox */}
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

              <div className="relative">
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
                    // Eye icon (password visible)
                    <LuEye />
                  ) : (
                    // Eye closed icon (password hidden)
                    <LuEyeOff />
                  )}
                </button>
              </div>

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
