'use client';

import { useSearchParams } from 'next/navigation';
import MainDashboardTabs from './MainDashboardTabs';
import NewApplicationButton from './NewApplicationButton';

export default function MainDashboard() {
  const searchParams = useSearchParams();
  const showHistory = searchParams.get('tab') === 'history';

  return (
    <div className="mx-auto flex w-full max-w-400 flex-row justify-end gap-7 px-7">
      <div className="flex w-full flex-col gap-14 rounded-2xl bg-white p-16">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-gray-12">
            {showHistory ? 'Past Applications' : 'Applications'}
          </h1>
          <div>{!showHistory && <NewApplicationButton />}</div>
        </div>

        <MainDashboardTabs />
      </div>
    </div>
  );
}
