'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Logger from '@/actions/logging';
import { Button } from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import { useTimer } from '@/hooks/useTimer';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/utils';

const incrementalCooldowns = [30, 45, 60, 90, 120];

export default function ForgotPasswordCheckEmail() {
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get('email') ?? '', [searchParams]);

  const [error, setError] = useState('');
  const { cooldownSeconds, startTimer } = useTimer({
    initialCooldown: 25,
    cooldowns: incrementalCooldowns,
  });

  const handleResendEmail = async () => {
    // brute force check
    if (cooldownSeconds > 0) return;

    // start cooldown
    startTimer();

    // resend email
    const supabase = getSupabaseBrowserClient();
    const siteUrl = getSiteUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}forgot-password?status=loading`,
    });

    if (error)
      Logger.error(
        `Error occurred while resending forgot password email: ${error?.message}`,
      );

    setError(
      error ? 'An unexpected error occurred, please try again later.' : '',
    );
  };

  return (
    <div className="flex w-106 flex-col gap-4 rounded-2xl bg-gray-1 p-8">
      <p className="text-3xl font-medium">Check your email.</p>

      <p className="text-gray-11">
        If {email} exists, you will receive a link to proceed with resetting
        your password.
      </p>

      <Button
        variant="primary"
        className="mt-2"
        disabled={cooldownSeconds > 0}
        onClick={handleResendEmail}
      >
        Resend email {cooldownSeconds > 0 && `(${cooldownSeconds} s)`}
      </Button>
      <ErrorMessage error={error} />
    </div>
  );
}
