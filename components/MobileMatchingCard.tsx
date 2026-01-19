'use client';

import { LuCake, LuMapPin, LuUser } from 'react-icons/lu';
import { cn, getStateAbbv } from '@/lib/utils';
import { RankedAdopteeMatch } from '@/types/schema';

interface MobileMatchingCardProps {
  match: RankedAdopteeMatch;
  rank?: number;
  onSelect?: (id: string) => void;
  onReadMore?: (match: RankedAdopteeMatch) => void;
  isReview?: boolean;
}

export default function MobileMatchingCard({
  match,
  rank,
  onSelect,
  onReadMore,
  isReview = false,
}: MobileMatchingCardProps) {
  const isSelected = rank !== undefined;

  const handleCardClick = () => {
    if (!isReview && onSelect) {
      onSelect(match.id);
    }
  };

  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReadMore?.(match);
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'relative flex flex-col rounded-lg border-4 bg-white p-4',
        'h-[11.25rem] w-[10.75rem]',
        isSelected ? 'border-red-12' : 'border-transparent',
        isReview ? 'cursor-default' : 'cursor-pointer',
      )}
    >
      {rank !== undefined && (
        <div className="absolute top-0 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-[65%] items-center justify-center rounded-full bg-red-12">
          <p className="text-xl font-bold text-white">{rank}</p>
        </div>
      )}

      {/* Content stack */}
      <div className="flex flex-col gap-2">
        {/* Name */}
        <h2 className="font-['Golos_Text'] text-[1.125rem] font-medium text-[#1E1F24]">
          {match.first_name}
        </h2>

        {/* Info row */}
        <div className="flex w-full items-center justify-between font-['Golos_Text'] text-[0.875rem] font-normal text-black">
          <div className="flex items-center gap-1">
            <LuCake size={13} className="text-red-12" />
            <span>{match.age}</span>
          </div>

          <div className="flex items-center gap-1">
            <LuUser size={13} className="text-red-12" />
            <span className="capitalize">{match.gender}</span>
          </div>

          <div className="flex items-center gap-1">
            <LuMapPin size={13} className="text-red-12" />
            <span>{getStateAbbv(match.state)}</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-2 w-full flex-1 overflow-hidden">
        <p className="line-clamp-2 font-['Golos_Text'] text-[0.875rem] font-normal text-black">
          {match.bio}
        </p>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleReadMore}
          className="rounded-full bg-red-12 text-xs font-semibold text-white"
          style={{ width: '5.5rem', height: '1.6875rem' }}
        >
          Read more
        </button>
      </div>
    </div>
  );
}
