'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import LogoutButton from './LogoutButton';
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
    <div className="relative mx-auto flex w-full max-w-400 flex-row justify-end gap-7 px-7">
      <div className="min-w-61">
        <LogoutButton />
      </div>

      <div className="flex w-full flex-col gap-14 rounded-2xl bg-white p-16">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <p className="text-2xl font-semibold text-cyan-12">
              {showHistory ? 'Past Applications' : 'Applications'}
            </p>
            <p className="text-gray-13">
              Welcome to your application dashboard
            </p>
          </div>

          <div>
            {!showHistory && <NewApplicationButton onError={setErrorMessage} />}
          </div>
        </div>

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
    </div>
  );
}
