'use client';

import { useEffect, useRef, useState } from 'react';
import { LuCalendar, LuMapPin, LuUser } from 'react-icons/lu';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { calculateAge, getStateAbbv } from '@/lib/utils';
import { AdopteeMatch } from '@/types/types';

export default function MatchingCard({
  match,
  matchIndex,
}: {
  match: AdopteeMatch;
  matchIndex: number;
}) {
  const bioElmt = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calculateOverflow = () => {
      const lineHeight = 24;
      const lines = 8;
      const isOverflowingVar =
        bioElmt.current && bioElmt.current.clientHeight >= lineHeight * lines;
      setIsOverflowing(!!isOverflowingVar);
    };

    // initial overflow calculation
    calculateOverflow();

    // re-determine if text is overflowing with window resize
    window.addEventListener('resize', calculateOverflow);

    return () => {
      window.removeEventListener('resize', calculateOverflow);
    };
  }, []);

  const onShowMore = () => {
    const params = new URLSearchParams(searchParams);
    params.set('details', matchIndex.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-1 cursor-pointer flex-col gap-6 rounded-lg border border-gray-6 bg-gray-1 p-8 shadow-md transition-colors hover:border-gray-12 has-[button:hover]:border-gray-6!">
      {/* name and metadata */}
      <div className="flex flex-col gap-1">
        <h1>{match.first_name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <LuCalendar size={16} />
            <p>{calculateAge(match.dob)}</p>
          </div>
          <div className="flex items-center gap-1">
            <LuUser size={16} />
            <p className="capitalize">{match.gender}</p>
          </div>
          <div className="flex items-center gap-1">
            <LuMapPin size={16} />
            <p>{getStateAbbv(match.state)}</p>
          </div>
        </div>
      </div>

      {/* biography */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-8 uppercase">Biography</p>
        <div className="relative overflow-hidden pb-4">
          <p ref={bioElmt} className="line-clamp-8">
            {match.bio}
          </p>
          {isOverflowing && (
            <div className="absolute bottom-16 h-38 w-200 translate-y-full scale-x-300 bg-gray-1 blur-2xl" />
          )}
          {isOverflowing && (
            <div className="absolute bottom-0 flex w-full justify-center">
              <Button
                variant="rounded"
                className="py-2"
                type="button"
                onClick={onShowMore}
              >
                <p>Read more</p>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
