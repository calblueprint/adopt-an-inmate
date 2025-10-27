'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Logger from '@/actions/logging';
import { Button } from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Textbox } from '@/components/Textbox';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/utils';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPassword() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const bufferTimer = useRef<NodeJS.Timeout>(null);
  const cooldownSecondsRef = useRef(0);
  const numTries = useRef(0);

  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get('email') ?? '', [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordForm>({ defaultValues: { email } });

  const router = useRouter();

  // function for buffer timer
  const bufferTimerFunction = useCallback(() => {
    cooldownSecondsRef.current = Math.max(cooldownSecondsRef.current - 1, 0);
    setCooldownSeconds(cooldownSecondsRef.current);

    // clear timer
    if (cooldownSecondsRef.current === 0) {
      if (bufferTimer.current) clearInterval(bufferTimer.current);
      bufferTimer.current = null;

      // make button available
      setIsProcessing(false);
    }
  }, []);

  // send email
  const sendResetEmail = useCallback(
    async (email: string) => {
      // brute force check
      if (cooldownSecondsRef.current > 0) return;

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
    },
    [router, setError],
  );

  const onSubmit = async ({ email }: ForgotPasswordForm) => {
    // set is processing
    setIsProcessing(true);

    // send email
    await sendResetEmail(email);

    // set buffer timer
    const bufferCooldown = 10;
    cooldownSecondsRef.current = bufferCooldown;
    setCooldownSeconds(cooldownSecondsRef.current);
    bufferTimer.current = setInterval(bufferTimerFunction, 1000);
    numTries.current++;
  };

  return (
    <form
      className="flex w-106 flex-col gap-7 rounded-2xl bg-gray-1 p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-3xl font-medium">Forgot password?</p>

      <div className="flex flex-col">
        <div className="flex flex-col">
          <p className="text-base text-gray-9">Email</p>
          <Textbox
            type="email"
            placeholder="jamie@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
        <Button
          variant="login"
          type="submit"
          className="mt-7 flex items-center justify-center gap-2"
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
