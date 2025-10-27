'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import Logger from '@/actions/logging';
import { Button } from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Textbox } from '@/components/Textbox';
import { useTimer } from '@/hooks/useTimer';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'Passwords must be at least 6 characters')
      .nonoptional(),
    confirmPassword: z
      .string()
      .min(6, 'Passwords must be at least 6 characters')
      .nonoptional(),
  })
  .superRefine((vals, ctx) => {
    if (vals.confirmPassword !== vals.password)
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
  });

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const { cooldownSeconds, startTimer } = useTimer({
    cooldowns: [10],
    onFinish: () => setIsProcessing(false),
  });

  const handleResetPassword = async (password: string) => {
    if (cooldownSeconds > 0) return;

    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.updateUser({ password });

    // error: same password
    if (error && error.code === 'same_password') {
      setError('confirmPassword', {
        type: 'validate',
        message: 'Password should be different from old password',
      });
      return;
    }

    // success: redirect to success page + log out
    if (data) {
      // we call sign out to sign out of all sessions (default scope is global)
      // this ensures future logins are only made by users who know the password (i.e. the user)
      await supabase.auth.signOut();
      router.push('?status=success');
    }

    // error: redirect to error page
    if (error) {
      Logger.error(
        `Error occurred while calling updateUser (reset password): ${error.message}`,
      );
      router.push('?status=error');
    }
  };

  const onSubmit = async ({
    password,
  }: z.infer<typeof resetPasswordSchema>) => {
    setIsProcessing(true);
    await handleResetPassword(password);
    startTimer();
  };

  return (
    <form
      className="flex w-106 flex-col gap-7 rounded-2xl bg-gray-1 p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-3xl font-medium">Reset password</h1>

      <div className="flex flex-col gap-4">
        <div className="space-y-6">
          <div className="flex flex-col">
            <p className="text-gray-9">Password</p>
            <Textbox
              type="password"
              placeholder="Password"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-gray-9">Confirm password</p>
            <Textbox
              type="password"
              placeholder="Confirm password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>
        </div>
        <Button
          variant="login"
          type="submit"
          className="mt-7"
          disabled={isProcessing}
        >
          Reset password
          {cooldownSeconds > 0 && ` (${cooldownSeconds} s)`}
          {isProcessing && <LoadingSpinner className="text-gray-1" />}
        </Button>
      </div>
    </form>
  );
}
