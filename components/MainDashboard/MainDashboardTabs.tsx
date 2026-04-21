'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { appIsActive } from '@/lib/utils';
import { AdopterApplication } from '@/types/schema';
import LoadingSpinner from '../LoadingSpinner';
import ApplicationCard from './ApplicationCard';

export default function MainDashBoardTabs() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const showHistory = tabParam === 'history';

  const loadStarted = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeApplications, setActiveApplications] = useState<
    AdopterApplication[]
  >([]);
  const [inactiveApplications, setInactiveApplications] = useState<
    AdopterApplication[]
  >([]);

  useEffect(() => {
    if (loadStarted.current) return;

    const loadData = async () => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();

      if (getUserError) throw new Error(getUserError.message);
      if (!user) return;

      const { data: applicationsData, error: fetchApplicationsError } =
        await supabase
          .from('adopter_applications_dummy')
          .select('*')
          .eq('adopter_uuid', user.id);

      if (fetchApplicationsError)
        throw new Error(fetchApplicationsError.message);

      // sort by newest first
      const sortedApps = applicationsData.sort(
        (a, b) =>
          new Date(b.time_created).getTime() -
          new Date(a.time_created).getTime(),
      );

      // filter active and inactive applications
      const activeApps = sortedApps.filter(app => appIsActive(app));
      const inactiveApps = sortedApps.filter(app => !appIsActive(app));

      setActiveApplications(activeApps);
      setInactiveApplications(inactiveApps);
      setIsLoading(false);
    };

    loadData();

    loadStarted.current = true;
  }, []);

  const applications = showHistory ? inactiveApplications : activeApplications;

  return isLoading ? (
    <div className="grid h-32 w-full place-items-center">
      <LoadingSpinner size="24" />
    </div>
  ) : (
    <div className="flex w-full flex-col gap-6">
      {/* Cards grid: Create card + application cards */}
      <div className="grid grid-cols-2 gap-8">
        {!showHistory && true}
        {applications.map(app => (
          <ApplicationCard key={app.app_uuid} app={app} />
        ))}
      </div>
    </div>
  );
}
