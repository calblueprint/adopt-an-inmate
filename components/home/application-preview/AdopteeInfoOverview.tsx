'use client';

import { useMemo } from 'react';
import { IoKeyOutline } from 'react-icons/io5';
import { LuCake, LuCalendar } from 'react-icons/lu';
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
    if (!(appData && appData.adoptees && appData.adoptees.length > 0))
      return null;
    return appData.adoptees[0];
  }, [appData]);

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gray-3 p-6 font-medium">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LuCalendar />
          <p>Date of Birth</p>
        </div>
        <p className="text-black/60">
          {adoptee?.dob ? formatAmericanTime(adoptee.dob) : 'N/A'}
        </p>
      </div>

      {/* inmate id */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IoKeyOutline />
          <p>Inmate ID</p>
        </div>
        <p className="text-black/60">{adoptee?.inmate_id}</p>
      </div>
    </div>
  );
}
