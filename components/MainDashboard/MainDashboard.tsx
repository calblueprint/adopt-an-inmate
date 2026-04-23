'use client';

import { useEffect, useState } from 'react';
import { LuClock, LuLayoutDashboard } from 'react-icons/lu';
import { useSearchParams } from 'next/navigation';
import MainDashboardTabs from './MainDashboardTabs';
import NewApplicationButton from './NewApplicationButton';

export default function MainDashboard() {
  const searchParams = useSearchParams();
  const showHistory = searchParams.get('tab') === 'history';

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setIsSliding(true);
      setIsVisible(true);

      // start fade out after 4 seconds
      const fadeTimer = setTimeout(() => {
        setIsSliding(false);
        setIsVisible(false);
      }, 4000);

      // remove from DOM after fade completes
      const removeTimer = setTimeout(() => setErrorMessage(null), 5000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [errorMessage]);

  return (
    <main className="align-items flex h-svh w-full flex-col justify-center bg-gray-1">
      <div className="flex w-full flex-col gap-14 border-b-1 border-gray-4 px-16 pt-16 pb-4">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-2 text-3xl text-gray-12">
            {showHistory ? <LuClock /> : <LuLayoutDashboard />}
            <h1 className="text-3xl font-normal text-gray-12">
              {showHistory ? 'History' : 'Applications'}
            </h1>
          </div>
          <div>
            {!showHistory && <NewApplicationButton onError={setErrorMessage} />}
          </div>
        </div>
      </div>
      <div className="flex h-full w-full max-w-400 flex-row justify-end gap-7 px-16 py-7">
        <MainDashboardTabs />
      </div>

      {/* Error banner */}
      {errorMessage && (
        <div
          className={`absolute right-7 bottom-6 inline-flex items-center gap-2 rounded-[0.4375rem] border border-[#FAA5AA] bg-[#FCF2F2] px-[0.9375rem] py-[0.6875rem] shadow-md ${isSliding ? 'animate-slide-in-right' : ''} ${isVisible ? 'banner-visible' : 'banner-hidden'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="8" cy="8" r="7.5" stroke="#E5484D" />
            <path
              d="M5 5L11 11M11 5L5 11"
              stroke="#E5484D"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-sm text-gray-12">{errorMessage}</p>
        </div>
      )}
    </main>
  );
}
