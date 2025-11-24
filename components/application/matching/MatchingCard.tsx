'use client';

import { useEffect, useRef, useState } from 'react';
import { LuCake, LuMapPin, LuUser } from 'react-icons/lu';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { calculateAge, getStateAbbv } from '@/lib/utils';
import { AdopteeMatch } from '@/types/types';

export default function MatchingCard({
  match,
  matchIndex,
  rank,
  onSelect,
}: {
  match: AdopteeMatch;
  matchIndex: number;
  rank?: number;
  onSelect: (id: string) => void;
}) {
  const bioElmt = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isSelected = !(rank === undefined);

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

  const onShowMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const params = new URLSearchParams(searchParams);
    params.set('details', matchIndex.toString());
    router.push(`?${params.toString()}`);
  };

  const handleCardClick = () => {
    onSelect(match.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative flex flex-1 cursor-pointer flex-col gap-6 rounded-lg border p-8 shadow-md transition-all ${
        isSelected
          ? 'border-4 border-red-12'
          : 'border-4 border-transparent hover:not-has-[button:hover]:border-gray-7'
      } bg-gray-1`}
    >
      {/* rank badge */}
      {rank !== undefined && (
        <div className="absolute top-0 left-0 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-12">
          <h4 className="font-bold text-white">{rank}</h4>
        </div>
      )}
      {/* name and metadata */}
      <div className="flex flex-col gap-1">
        <h1>{match.first_name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <LuCake size={16} className="text-red-12" />
            <p>{calculateAge(match.dob)}</p>
          </div>
          <div className="flex items-center gap-1">
            <LuUser size={16} className="text-red-12" />
            <p className="capitalize">{match.gender}</p>
          </div>
          <div className="flex items-center gap-1">
            <LuMapPin size={16} className="text-red-12" />
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
