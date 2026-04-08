'use client';

import { LuCake, LuMapPin, LuUser } from 'react-icons/lu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getStateAbbv } from '@/lib/utils';
import { RankedAdopteeMatch } from '@/types/schema';

interface MobileMatchingCardProps {
  match: RankedAdopteeMatch;
  rank?: number;
  onReadMore?: (match: RankedAdopteeMatch) => void;
  isReview?: boolean;
}

export default function MobileMatchingCard({
  match,
  rank,
  onReadMore,
  isReview = false,
}: MobileMatchingCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: match.id, disabled: isReview });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReadMore?.(match);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex w-full items-stretch overflow-hidden rounded-lg border border-gray-7 bg-white"
    >
      {/* Rank badge */}
      {rank !== undefined && (
        <div
          className={`flex shrink-0 items-center justify-center ${isReview ? 'bg-red-12' : 'bg-red-3'}`}
          style={{
            width: '1.75rem',
            borderRadius: '0.3125rem 0 0 0.3125rem',
          }}
        >
          <p
            className={`text-sm font-normal ${isReview ? 'text-white' : 'text-red-9'}`}
          >
            {rank}
          </p>
        </div>
      )}

      {/* Card content */}
      <div className="flex flex-1 flex-col gap-1 px-3 py-2">
        <p className="font-medium text-gray-12">{match.first_name}</p>
        <div className="flex items-center gap-3 text-sm text-gray-11">
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
        <p className="line-clamp-2 text-sm text-gray-11">{match.bio}</p>
        <button
          type="button"
          onClick={handleReadMore}
          className="self-start text-xs font-semibold text-red-12 underline"
        >
          Read more
        </button>
      </div>

      {/* Drag handle */}
      {!isReview && (
        <div
          {...attributes}
          {...listeners}
          className="flex shrink-0 cursor-grab touch-none items-center px-2 text-gray-9 active:cursor-grabbing"
          style={{
            background: 'rgba(220, 220, 220, 0.12)',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="5" cy="4" r="1.5" fill="currentColor" />
            <circle cx="5" cy="8" r="1.5" fill="currentColor" />
            <circle cx="5" cy="12" r="1.5" fill="currentColor" />
            <circle cx="11" cy="4" r="1.5" fill="currentColor" />
            <circle cx="11" cy="8" r="1.5" fill="currentColor" />
            <circle cx="11" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}
