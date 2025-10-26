'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { signUpWithEmailPassword } from '@/actions/auth';
import { Button } from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import CustomLink from '@/components/CustomLink';
import ErrorMessage from '@/components/ErrorMessage';
import { Textbox } from '@/components/Textbox';

const signUpForm = z
  .object({
    email: z.email().nonoptional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .nonoptional(),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .nonoptional(),
    tos: z.boolean().nonoptional(),
  })
  .superRefine((vals, ctx) => {
    if (vals.confirmPassword !== vals.password)
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: 'Passwords do not match',
      });

    if (!vals.tos)
      ctx.addIssue({
        code: 'custom',
        path: ['tos'],
        message: 'Please accept the Terms of Service before continuing',
      });
  });

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpForm>>({
    resolver: zodResolver(signUpForm),
  });
  const router = useRouter();

  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignUp = async ({
    email,
    password,
  }: z.infer<typeof signUpForm>) => {
    const { error } = await signUpWithEmailPassword({
      email,
      password,
    });

    // handle error cases
    if (error) {
      switch (error.code) {
        case 'user_already_exists':
          setAuthError(
            'This email is already registered, please use another email.',
          );
          break;
        case 'email_address_invalid':
          setAuthError('Email address not supported.');
          break;
        case 'weak_password':
          setAuthError('Password should be at least 6 characters.');
          break;
        default:
          setAuthError('An unexpected error occurred, please try again later.');
          break;
      }

      return;
    }

    setAuthError(null);
    router.push('/');
  };

  return (
    <form
      className="flex h-full w-full flex-col items-center justify-center"
      onSubmit={handleSubmit(handleSignUp)}
    >
      <div className="flex w-106 flex-col gap-4 rounded-2xl bg-gray-1 p-8">
        <div>
          <p className="text-3xl font-medium">Sign up</p>
          <p className="mt-2 text-gray-9">
            Already have an account?{' '}
            <CustomLink href="/login" className="text-link">
              Sign in.
            </CustomLink>
          </p>
        </div>

        {authError && <p className="py-2 text-error">{authError}</p>}

        <div className="flex flex-col">
          <div className="flex flex-col gap-6">
            {/* This is the Email title and textbox */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-9">Email</p>
              <Textbox
                type="email"
                placeholder="Email address"
                error={errors.email?.message}
                {...register('email', { required: true })}
              />
            </div>

            {/* This is the password title and textbox */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-9">Password</p>
              <Textbox
                type="password"
                placeholder="Enter password"
                error={errors.password?.message}
                {...register('password', { required: true })}
              />
            </div>

            {/* This is the password confirmation title and textbox */}
            <div className="flex flex-col">
              <p className="text-sm text-gray-9">Password confirmation</p>
              <Textbox
                type="password"
                placeholder="Confirm password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', { required: true })}
              />
            </div>
          </div>

          {/* This is the checkbox and the terms of service line */}
          <div className="flex flex-col gap-1">
            <label
              className="mt-8 flex cursor-pointer items-center gap-1.5 select-none"
              htmlFor="tos"
            >
              <Checkbox id="tos" {...register('tos', { required: true })} />
              <p className="text-gray-9">
                I&#39;ve read and agreed to the{' '}
                <CustomLink href="#">Terms of Service</CustomLink>
                <span className="text-error">*</span>
              </p>
            </label>
            <ErrorMessage error={errors.tos?.message} />
          </div>

          <Button variant="login" className="mt-7" type="submit">
            Sign Up
          </Button>
        </div>
      </div>
    </form>
  );
}
