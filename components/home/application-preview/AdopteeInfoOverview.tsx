'use client';

import { useMemo } from 'react';
import { LuCake, LuCalendar, LuGlobe, LuIdCard } from 'react-icons/lu';
import { TbGenderBigender } from 'react-icons/tb';
import { formatAmericanTime } from '@/lib/formatters';
import { calculateAge } from '@/lib/utils';
import { ApplicationWithAdoptees } from '@/types/schema';

export default function AdopteeInfoOverview({
  appData,
}: {
  appData: ApplicationWithAdoptees;
}) {
  const adoptee = useMemo(() => {
    if (!(appData && appData.matched)) return null;
    return appData.matchedAdoptee;
  }, [appData]);

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gray-3 p-6 font-medium">
      {/* inmate id */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LuIdCard />
          <p>Inmate ID</p>
        </div>
        <p className="text-black/60">{adoptee?.inmate_id}</p>
      </div>

      {/* gender */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TbGenderBigender />
          <p>Gender</p>
        </div>
        <p className="text-black/60">{adoptee?.gender}</p>
      </div>

      {/* age */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LuCake />
          <p>Age</p>
        </div>
        <p className="text-black/60">
          {adoptee?.dob ? calculateAge(adoptee.dob) : 'N/A'}
        </p>
      </div>

      {/* dob */}
      {appData?.appData.status === 'ACTIVE' && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LuCalendar />
            <p>Date of Birth</p>
          </div>
          <p className="text-black/60">
            {adoptee?.dob ? formatAmericanTime(adoptee.dob) : 'N/A'}
          </p>
        </div>
      )}

      {/* state */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LuGlobe />
          <p>State</p>
        </div>
        <p className="text-black/60">{adoptee?.state || 'N/A'}</p>
      </div>
    </div>
  );
}
