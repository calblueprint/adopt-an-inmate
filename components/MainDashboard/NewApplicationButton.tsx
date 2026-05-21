'use client';

import { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import {
  checkCreationConstraints,
  createApplication,
} from '@/actions/applications/createApplication';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { cn } from '@/lib/utils';
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
      const { data: canCreate } = await checkCreationConstraints(user);
      setIsRestricted(!canCreate);
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
      className={cn(
        'relative flex cursor-pointer items-center gap-2 rounded-lg bg-red-9 px-9 py-2 text-white transition-opacity hover:opacity-90',
        isRestricted &&
          'before:absolute before:inset-0 before:block before:bg-white/30',
      )}
    >
      {isCreating ? (
        <>
          <LoadingSpinner variant="buttonSm" />
          Creating...
        </>
      ) : (
        <>
          <LuPlus />
          Create new
        </>
      )}
    </button>
  );
}
