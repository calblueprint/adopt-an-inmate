import React from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function MatchingLoading() {
  return (
    <div className="flex w-8/10 flex-col gap-2 rounded-lg bg-gray-1 px-8 py-16 sm:w-[clamp(400px,50%,500px)] sm:pt-13 sm:pb-20">
      <div className="flex flex-col gap-5">
        <div className="flex flex-row justify-center">
          <div className="flex h-45 w-45 flex-col items-center justify-center">
            <LoadingSpinner className="h-23 w-23 stroke-red-10 stroke-3" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-8 font-golos">Matching you...</h1>
          <p className="font-golos text-sm text-gray-11">
            We&apos;re now matching you with potential adoptees.
          </p>
        </div>
      </div>
    </div>
  );
}
