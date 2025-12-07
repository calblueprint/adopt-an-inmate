'use client';

import { useState } from 'react';
import { LuCake, LuMapPin, LuUser } from 'react-icons/lu';
import { cn, getStateAbbv } from '@/lib/utils';
import { RankedAdopteeMatch } from '@/types/schema';

interface MatchingCardProps {
  match: RankedAdopteeMatch;
  matchIndex: number;
  rank?: number;
  onSelect?: (id: string) => void;
  isReview?: boolean;
}

export default function MatchingCard({
  match,
  rank,
  onSelect,
}: {
  match: RankedAdopteeMatch;
  matchIndex: number;
  rank?: number;
  onSelect: (id: string) => void;
}) {
  const bioElmt = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const isSelected = !(rank === undefined);
  const [isFadeVisible, setIsFadeVisible] = useState(false);

  const handleBioScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const shouldFade = e.currentTarget.scrollTop > 16;
    if (isFadeVisible !== shouldFade) setIsFadeVisible(shouldFade);
  };

  const handleCardClick = () => {
    if (!isReview && onSelect) {
      onSelect(match.id);
    }
  };

  const interactiveClasses = !isReview ? 'cursor-pointer' : 'cursor-default';

  const hoverBorderClasses =
    !isReview &&
    (!isSelected
      ? 'hover:not-has-[button:hover]:border-gray-7'
      : 'hover:not-has-[button:hover]:border-red-10');

  const cardClassName = `relative flex flex-1 flex-col gap-6 rounded-lg border p-8 shadow-md transition-all ${
    interactiveClasses
  } ${hoverBorderClasses} ${
    isSelected ? 'border-4 border-red-12' : 'border-4 border-transparent'
  } bg-gray-1`;

  return (
    <div onClick={handleCardClick} className={cardClassName}>
      {/* rank badge */}
      {rank !== undefined && (
        <div className="absolute top-0 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-12">
          <h1 className="text-2.25 font-bold text-white">{rank}</h1>
        </div>
      )}
      {/* name and metadata */}
      <div className="flex flex-col gap-1">
        <h1>{match.first_name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <LuCake size={16} className="text-red-12" />
            <p>{match.age}</p>
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
        <div className="relative">
          <div className="h-52 overflow-y-auto pb-4" onScroll={handleBioScroll}>
            <p>{match.bio}</p>
          </div>
          <div
            className={cn(
              'absolute top-0 left-0 z-1 h-4 w-full bg-gradient-to-b from-gray-1 to-gray-1/0',
              !isFadeVisible && 'invisible',
            )}
          />
          <div className="absolute bottom-0 left-0 z-1 h-4 w-full bg-gradient-to-t from-gray-1 to-gray-1/0" />
        </div>
      </div>
    </div>
  );
}
