'use client';

import { LuCake, LuMapPin, LuUser } from 'react-icons/lu';
import { Button } from '@/components/Button';
import MobileMatchingCard from '@/components/MobileMatchingCard';
import MobilePopUp from '@/components/MobilePopUp';
import { RankedAdopteeMatch } from '@/types/schema';

interface MobileMatchingSelectScreenProps {
  matches: RankedAdopteeMatch[];
  rankedIds: string[];
  isNextDisabled: boolean;
  selectedMatch: RankedAdopteeMatch | null;
  isRankingOpen: boolean;
  onRankToggle: (id: string) => void;
  onReadMore: (match: RankedAdopteeMatch) => void;
  onNextClick: () => void;
  onClosePopUp: () => void;
}

export default function MobileMatchingSelectScreen({
  matches,
  rankedIds,
  isNextDisabled,
  selectedMatch,
  isRankingOpen,
  onRankToggle,
  onReadMore,
  onNextClick,
  onClosePopUp,
}: MobileMatchingSelectScreenProps) {
  return (
    <div className="flex w-full flex-col gap-12 pt-8">
      <div className="flex flex-col items-center gap-4">
        <h1>Rank your preferences!</h1>
        <p className="w-[clamp(300px,60%,400px)] text-center text-sm text-gray-11">
          Click the cards in your order of preference.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 px-4">
        {matches.map(m => {
          const rankIndex = rankedIds.indexOf(m.id);
          const currentRank = rankIndex > -1 ? rankIndex + 1 : undefined;

          return (
            <MobileMatchingCard
              key={m.id}
              match={m}
              rank={currentRank}
              onSelect={onRankToggle}
              onReadMore={onReadMore}
            />
          );
        })}
      </div>

      <div className="flex w-full justify-center">
        <Button
          type="button"
          variant="primary"
          className="w-9/10 py-2 sm:w-[clamp(200px,50%,400px)]"
          disabled={isNextDisabled}
          onClick={onNextClick}
        >
          Next
        </Button>
      </div>

      <MobilePopUp
        open={isRankingOpen}
        onClose={onClosePopUp}
        title={selectedMatch?.first_name}
      >
        {selectedMatch && (
          <div className="flex flex-col gap-3 overflow-x-hidden">
            <div className="flex flex-wrap items-center gap-3 text-sm font-normal text-gray-12">
              <div className="flex items-center gap-1">
                <LuCake size={13} className="text-red-12" />
                <span>{selectedMatch.age}</span>
              </div>
              <div className="flex items-center gap-1">
                <LuUser size={13} className="text-red-12" />
                git
                <span className="capitalize">{selectedMatch.gender}</span>
              </div>
              <div className="flex items-center gap-1">
                <LuMapPin size={13} className="text-red-12" />
                <span>{selectedMatch.state}</span>
              </div>
            </div>

            <div className="w-full text-xs font-semibold text-gray-8">
              Biography
            </div>

            <p className="text-sm font-normal whitespace-pre-line text-gray-12">
              {selectedMatch.bio}
            </p>
          </div>
        )}
      </MobilePopUp>
    </div>
  );
}
