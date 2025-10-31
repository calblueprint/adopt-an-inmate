'use client';

import ApplicationCard from '@/components/application/stages/ApplicationCard';
import CreateAppButton from '@/components/CreateAppButton';
import { useApplicationContext } from '@/contexts/ApplicationContext';

export default function StageMain() {
  const { appState } = useApplicationContext();

  return (
    <div className="flex flex-col border-2 border-amber-500 pt-10">
      <div className="flex flex-col gap-y-11">
        <p className="text-3xl font-medium">Applications</p>

        <div className="flex flex-row gap-x-15">
          <CreateAppButton />
          {/* <button className="" onClick={() => console.log("You clicked on the pink circle!")}>+ Create Application</button> */}
          <ApplicationCard />
        </div>
      </div>
    </div>
  );
}
