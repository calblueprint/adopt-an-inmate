'use client';

import { ButtonLink } from './Button';
import LogoutButton from './LogoutButton';
import TabsDemo from './Tabs';

export default function MainDashboard() {
  return (
    <div className="flex flex-row justify-end gap-7 pl-3">
      <div>
        <LogoutButton />
      </div>

      <div className="mr-7 w-300 max-w-300 rounded-2xl bg-white pr-24 pl-24">
        <div className="flex flex-row justify-between py-14">
          <div className="flex flex-col">
            <p className="text-2xl font-semibold text-cyan-12">Applications</p>
            <p className="text-base text-[#C9C9CF]">
              Welcome to your application dashboard
            </p>
          </div>

          <ButtonLink href="/app/" variant="applicationMainPage">
            New Application
          </ButtonLink>
        </div>

        <div className="flex">
          <TabsDemo />
        </div>
      </div>
    </div>
  );
}
