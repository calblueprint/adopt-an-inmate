'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logger from '@/actions/logging';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function ForgotPasswordLoading() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const timeout = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    // set 10s timer - redirect to error if it takes too long to get auth event
    if (!timeout.current) {
      timeout.current = setTimeout(() => {
        Logger.error(
          'Error while loading reset password screen: took too long to receive password recovery event',
        );
        const params = new URLSearchParams(searchParams.toString());
        params.set('status', 'error');
        router.replace(`?${params.toString()}`);
      }, 10000);
    }

    // listen for password recovery event, then redirect to password reset form
    const supabase = getSupabaseBrowserClient();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const params = new URLSearchParams(searchParams.toString());

        if (event === 'SIGNED_IN') {
          params.set('status', 'resetting');
          router.replace('/reset-password');
        } else if (event === 'INITIAL_SESSION' && session === null) {
          params.set('status', 'error');
          router.replace(`?${params.toString()}`);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [router, searchParams]);

  return <LoadingSpinner />;
}
