'use client';

import { useApplicationContext } from '@/contexts/ApplicationContext';
import { ButtonLink } from './Button';
import LogoutButton from './LogoutButton';
import TabsDemo from './Tabs';

export default function StageMainDashboard() {
  const { appState } = useApplicationContext();

  return (
    <div className="bg-grey-3 flex flex-row gap-7 pl-3">
      <div>
        <LogoutButton />
      </div>

      <div className="w-246 rounded-2xl bg-white pr-24 pl-24">
        <div className="flex flex-row gap-x-75 py-14">
          <div className="flex flex-col">
            <p className="text-2xl font-semibold text-cyan-12">Applications</p>
            <p className="text-base text-[#C9C9CF]">
              Welcome to your application dashboard
            </p>
          </div>

          <ButtonLink
            href={`/app/${appState.appId}`}
            variant="applicationMainPage"
          >
            New Application
          </ButtonLink>
        </div>

        <div className="flex border-2">
          <TabsDemo />
        </div>
      </div>
    </div>
  );
}
