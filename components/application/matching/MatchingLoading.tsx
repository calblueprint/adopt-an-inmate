import React from 'react';

export default function MatchingLoading() {
  return (
    <div className="flex w-9/10 flex-col gap-2 rounded-lg bg-gray-1 px-8 py-16 sm:w-[clamp(400px,50%,500px)] sm:py-32">
      <h1 className="text-[2rem]">Matching you...</h1>
      <p className="text-sm text-gray-11">
        We&apos;re now matching you with a potential inmate...
      </p>
    </div>
  );
}
