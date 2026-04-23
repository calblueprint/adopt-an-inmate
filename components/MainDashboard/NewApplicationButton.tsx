'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  checkCreationConstraints,
  createApplication,
} from '@/actions/applications/createApplication';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import LoadingSpinner from '../LoadingSpinner';

interface NewApplicationButtonProps {
  onError: (message: string) => void;
}

export default function NewApplicationButton({
  onError,
}: NewApplicationButtonProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);

  // check on mount if user is restricted
  useEffect(() => {
    const checkRestriction = async () => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: canCreate, error: errorMsg } =
        await checkCreationConstraints(user);
      //console.log('canCreate:', canCreate, 'error:', errorMsg);
      setIsRestricted(!canCreate);
      //console.log('isRestricted set to:', !canCreate);
    };
    checkRestriction();
  }, []);

  const createApp = async () => {
    setIsCreating(true);
    const { data: appId, error } = await createApplication();
    if (error || !appId) {
      setIsCreating(false);
      onError(error ?? 'An unexpected error occurred.');
      return;
    }
    // successful; redirect to app at correct stage/question
    router.push(`/app/${appId}`);
  };

  return (
    <button
      onClick={createApp}
      disabled={isCreating}
      className="flex cursor-pointer items-center gap-2 rounded-[0.5rem] px-[2.0625rem] py-[0.4375rem] text-white transition-opacity hover:opacity-90"
      style={{
        background: isRestricted
          ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%), #AF2028'
          : '#AF2028',
        //   'linear-gradient(0deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%), #AF2028',
        // opacity: isRestricted ? 0.5 : 1,
      }}
    >
      {isCreating ? (
        <>
          <LoadingSpinner variant="buttonSm" />
          Creating...
        </>
      ) : (
        <>
          Create new
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 5a1 1 0 1 0-2 0v4H7a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4V7z"
            />
          </svg>
        </>
      )}
    </button>
  );
}
