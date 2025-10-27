'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Logger from '@/actions/logging';
import { Button } from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Textbox } from '@/components/Textbox';
import { useTimer } from '@/hooks/useTimer';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/utils';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPassword() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { cooldownSeconds, startTimer } = useTimer({
    cooldowns: [10],
    onFinish: () => setIsProcessing(false),
  });

  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get('email') ?? '', [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordForm>({ defaultValues: { email } });

  const router = useRouter();

  // send email
  const sendResetEmail = async (email: string) => {
    // brute force check
    if (cooldownSeconds > 0) return;

    // send email
    const supabase = getSupabaseBrowserClient();
    const siteUrl = getSiteUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}forgot-password?status=loading`,
    });

    // handle error cases
    if (error) {
      switch (error.code) {
        case 'email_address_invalid':
          setError('email', { message: 'Invalid email' });
          break;
        default:
          setError('email', { message: 'An unexpected error occurred' });
      }

      Logger.error(
        `Error occurred while sending forgot password email: ${error.message}`,
      );

      return;
    }

    router.push(`?status=check-email&email=${email}`);
  };

  const onSubmit = async ({ email }: ForgotPasswordForm) => {
    // set is processing
    setIsProcessing(true);

    // send email
    await sendResetEmail(email);

    // set buffer timer
    startTimer();
  };

  return (
    <form
      className="flex w-106 flex-col gap-7 rounded-2xl bg-gray-1 p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-3xl font-medium">Forgot password?</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <p className="text-base text-gray-9">Email</p>
          <Textbox
            type="email"
            placeholder="jamie@example.com"
            error={errors.email?.message}
            {...register('email', { required: true })}
          />
        </div>

        <Button variant="primary" type="submit" disabled={isProcessing}>
          Reset password
          {cooldownSeconds > 0 && `(${cooldownSeconds} s)`}
          {isProcessing && <LoadingSpinner className="text-gray-1" />}
        </Button>
      </div>
    </form>
  );
}
