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

export default function SignUpCheckEmail() {
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
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${siteUrl}/?dialog=confirmation`,
      },
    });

    if (error) {
      switch (error.code) {
        case 'email_address_invalid':
          setError('Invalid email');
          break;
        default:
          setError('An unexpected error occurred, please try again later.');
          Logger.error(
            `Unexpected error occurred while resending confirmation email: ${error.message}`,
          );
          break;
      }
    } else {
      setError('');
    }
  };

  return (
    <div className="flex w-106 flex-col gap-4 rounded-2xl bg-gray-1 p-8">
      <p className="text-3xl font-medium">Please verify your email.</p>

      <p className="text-gray-11">
        We&apos;ve sent a confirmation email to your email address. Please
        confirm your email.
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
