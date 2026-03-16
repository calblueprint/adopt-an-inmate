'use client';

import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { getNewApplicationId } from '@/actions/applications/newApplication';
import LoadingSpinner from '../LoadingSpinner';

export default function CreateApplicationCard() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    const { data, error } = await getNewApplicationId();
    if (error || !data) {
      setIsCreating(false);
      return;
    }
    router.push(`/app/${data.app_uuid}?stage=${data.stage}&q=${data.question}`);
  };

  return (
    <button
      type="button"
      onClick={handleCreate}
      disabled={isCreating}
      className="flex h-55 w-55 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-5 bg-gray-2 transition-colors hover:border-gray-6 hover:bg-gray-3 disabled:opacity-60"
    >
      {isCreating ? (
        <LoadingSpinner size="24" />
      ) : (
        <>
          <LuPlus className="h-10 w-10 text-gray-10" />
          <span className="text-sm font-medium text-gray-11">
            Create application
          </span>
        </>
      )}
    </button>
  );
}
