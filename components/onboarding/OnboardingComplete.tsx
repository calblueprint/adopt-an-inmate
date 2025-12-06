'use client';

import { useState } from 'react';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Logger from '@/actions/logging';
import { Button } from '@/components/Button';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function OnboardingComplete() {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleContinue = async () => {
    setIsUpdating(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        data: { onboarding_complete: true },
      });

      if (error) {
        Logger.error(`Error updating user metadata: ${error.message}`);
        throw error;
      }

      router.push('/');
    } catch (error) {
      Logger.error(`Failed to complete onboarding: ${error}`);
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="my-6 grid w-full place-items-center">
        <FaHandHoldingHeart size={64} className="text-red-12" />
      </div>
      <h1>Thank you!</h1>
      <p>
        Thanks for providing your information! We will only use this to help us
        match you with an adoptee.
      </p>
      <div className="mt-6">
        <Button
          onClick={handleContinue}
          disabled={isUpdating}
          variant="primary"
          className="w-full py-2"
        >
          {isUpdating ? 'Loading...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
