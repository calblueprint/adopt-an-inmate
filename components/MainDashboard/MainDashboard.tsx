'use client';

import { useEffect, useState } from 'react';
import { LuClock, LuLayoutDashboard } from 'react-icons/lu';
import { useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase'; // new import
import MainDashboardTabs from './MainDashboardTabs';
import NewApplicationButton from './NewApplicationButton';

export default function MainDashboard() {
  const searchParams = useSearchParams();
  const showHistory = searchParams.get('tab') === 'history';

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  // new: stats for history snackbar
  const [portalApps, setPortalApps] = useState<number>(0);
  const [externalApps, setExternalApps] = useState<number>(0);
  const [totalApps, setTotalApps] = useState<number>(0);

  // new: fetch history stats
  useEffect(() => {
    const fetchHistoryStats = async () => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // fetch portal (inactive) applications count
      const { data: apps } = await supabase
        .from('adopter_applications_dummy')
        .select('*')
        .eq('adopter_uuid', user.id);

      const inactiveApps = (apps ?? []).filter(
        app =>
          app.status === 'REJECTED' ||
          app.status === 'ENDED' ||
          app.status === 'REAPPLY',
      );
      setPortalApps(inactiveApps.length);

      // fetch external applications count
      const { data: externalData } = await supabase
        .from('adopter_num_external_active')
        .select('num_external_active')
        .eq('adopter_uuid', user.id)
        .maybeSingle();

      const external = externalData?.num_external_active ?? 0;
      setExternalApps(external);

      // fetch total from app_counter
      const { data: counterData } = await supabase
        .from('app_counter')
        .select('last_app_num')
        .eq('adopter_uuid', user.id)
        .maybeSingle();

      setTotalApps(counterData?.last_app_num ?? inactiveApps.length + external);
    };

    fetchHistoryStats();
  }, []);

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
    <main className="align-items flex w-full flex-col justify-center bg-gray-1">
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

      {/* new: history snackbar panel, only shown on history tab */}
      {showHistory && (
        <div className="flex flex-col gap-3 px-16 pt-7">
          <div className="flex w-full gap-4">
            {/* Total Applications card */}
            <div className="flex flex-1 flex-col gap-1 rounded-lg border border-gray-4 bg-white px-6 py-4">
              <p className="text-xs tracking-wide text-gray-11 uppercase">
                Total Applications
              </p>
              <p className="text-green-9 text-3xl">{totalApps}</p>
              <p className="text-sm text-gray-11">All time, incl. offline</p>
            </div>

            {/* Portal Applications card */}
            <div className="flex flex-1 flex-col gap-1 rounded-lg border border-gray-4 bg-white px-6 py-4">
              <p className="text-xs tracking-wide text-gray-11 uppercase">
                Portal Applications
              </p>
              <p className="text-3xl text-gray-12">{portalApps}</p>
              <p className="text-sm text-gray-11">Via this platform</p>
            </div>

            {/* External Applications card */}
            <div className="flex flex-1 flex-col gap-1 rounded-lg border border-gray-4 bg-white px-6 py-4">
              <p className="text-xs tracking-wide text-gray-11 uppercase">
                External Applications
              </p>
              <p className="text-3xl text-gray-12">{externalApps}</p>
              <p className="text-sm text-gray-11">Pre-platform records</p>
            </div>
          </div>

          {/* disclaimer message */}
          <p className="text-sm text-gray-11">
            We don&apos;t have adoptee info for matches made on external
            platforms. Email{' '}
            <a
              href="mailto:adopt@adoptaninmate.org"
              className="underline hover:text-gray-12"
            >
              adopt@adoptaninmate.org
            </a>{' '}
            if this number is inaccurate.
          </p>
        </div>
      )}

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
