'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Logger from '@/actions/logging';
import { Button } from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/utils';

const incrementalCooldowns = [30, 45, 60, 90, 120];

export default function ForgotPasswordCheckEmail() {
  const [cooldownSeconds, setCooldownSeconds] = useState(20);
  const [error, setError] = useState('');
  const cooldownSecondsRef = useRef(20);
  const cooldownTimer = useRef<NodeJS.Timeout>(null);
  const numResends = useRef(0);

  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get('email') ?? '', [searchParams]);

  // count down function
  const timerFunction = useCallback(() => {
    cooldownSecondsRef.current = Math.max(0, cooldownSecondsRef.current - 1);
    setCooldownSeconds(cooldownSecondsRef.current);

    if (cooldownSecondsRef.current === 0) {
      if (cooldownTimer.current) clearInterval(cooldownTimer.current);
      cooldownTimer.current = null;
    }
  }, []);

  // initialize timer
  useEffect(() => {
    cooldownTimer.current = setInterval(timerFunction, 1000);

    return () => {
      if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    };
  }, [timerFunction]);

  const handleResendEmail = async () => {
    // brute force check
    if (cooldownSecondsRef.current > 0) return;

    // start cooldown
    const cooldown =
      incrementalCooldowns[
        Math.min(numResends.current, incrementalCooldowns.length - 1)
      ];
    cooldownSecondsRef.current = cooldown;
    setCooldownSeconds(cooldown);
    numResends.current++;
    cooldownTimer.current = setInterval(timerFunction, 1000);

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
        variant="login"
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
