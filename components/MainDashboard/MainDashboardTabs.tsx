'use client';

import { useEffect, useRef, useState } from 'react';
import { Tabs } from 'radix-ui';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { appIsActive } from '@/lib/utils';
import { AdopterApplication } from '@/types/schema';
import LoadingSpinner from '../LoadingSpinner';
import ApplicationCard from './ApplicationCard';

export default function MainDashBoardTabs() {
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
      // get user
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();

      // Next.js will handle routing to error page
      if (getUserError) throw new Error(getUserError.message);

      // not logged in: redirect should be handled by layout
      if (!user) return;

      // fetch user applications
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
          new Date(b.time_submitted).getTime() -
          new Date(a.time_submitted).getTime(),
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

  return isLoading ? (
    <div className="grid h-full w-full place-items-center">
      <LoadingSpinner size="24" />
    </div>
  ) : (
    <Tabs.Root className="w-full" defaultValue="active">
      <Tabs.List
        className="justify-items-center border-b-2 border-b-gray-300"
        aria-label="Manage your account"
      >
        <div className="flex w-full">
          <Tabs.Trigger
            className="-mb-0.5 flex-1 cursor-pointer border-b-2 border-b-transparent px-4 pb-2 text-gray-400 transition-colors data-[state=active]:border-b-cyan-9 data-[state=active]:text-cyan-9"
            value="active"
          >
            Active Applications
          </Tabs.Trigger>

          <Tabs.Trigger
            className="-mb-0.5 flex-1 cursor-pointer border-b-2 border-b-transparent px-4 pb-2 text-gray-400 transition-colors data-[state=active]:border-b-cyan-9 data-[state=active]:text-cyan-9"
            value="inactive"
          >
            Inactive Applications
          </Tabs.Trigger>
        </div>
      </Tabs.List>
      <Tabs.Content className="w-full pt-9" value="active">
        <div className="flex flex-row flex-wrap gap-x-12 gap-y-14">
          {activeApplications.map(app => (
            <ApplicationCard key={app.app_uuid} app={app} />
          ))}
        </div>
      </Tabs.Content>
      <Tabs.Content className="w-full pt-9" value="inactive">
        <div className="flex flex-row flex-wrap gap-x-12 gap-y-14">
          {inactiveApplications.map(app => (
            <ApplicationCard key={app.app_uuid} app={app} />
          ))}
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
