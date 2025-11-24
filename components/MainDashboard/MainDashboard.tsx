'use client';

import { Button } from '../Button';
import LogoutButton from './LogoutButton';
import TabsDemo from './MainDashboardTabs';

export default function MainDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-400 flex-row justify-end gap-7 px-7">
      <div className="min-w-61">
        <LogoutButton />
      </div>

      <div className="w-full rounded-2xl bg-white px-24">
        <div className="flex flex-row justify-between py-14">
          <div className="flex flex-col">
            <p className="text-2xl font-semibold text-cyan-12">Applications</p>
            <p className="text-gray-13">
              Welcome to your application dashboard
            </p>
          </div>

          <div>
            <Button variant="tertiary">New Application</Button>
          </div>
        </div>

        <div className="flex">
          <TabsDemo />
        </div>
      </div>
    </div>
  );
}
