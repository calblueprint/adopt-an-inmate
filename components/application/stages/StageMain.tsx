'use client';

import CreateAppButton from '@/components/CreateAppButton';
import CustomLink from '@/components/CustomLink';
import StageMainDashboard from '@/components/StageMainDashboard';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import ApplicationCard from './ApplicationCard';

export default function StageMain() {
  const { appState } = useApplicationContext();

  return (
    // <div className="flex flex-col border-2 border-black pt-10 pl-9">
    //   <div className="flex flex-col gap-y-11 border-2 border-amber-600">
    //     <p className="text-3xl font-medium">Applications</p>

    //     <div className="flex flex-row gap-x-16">
    //       <CreateAppButton />
    //       {/* <button className="" onClick={() => console.log("You clicked on the pink circle!")}>+ Create Application</button> */}
    //       <ApplicationCard />
    //     </div>
    //   </div>
    // </div>
    <StageMainDashboard />
  );
}
