'use client';

import { LuCake, LuMapPin, LuUser } from 'react-icons/lu';
import { Button } from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import MobileMatchingCard from '@/components/MobileMatchingCard';
import MobilePopUp from '@/components/MobilePopUp';
import { RankedAdopteeMatch } from '@/types/schema';

interface MobileMatchingReviewScreenProps {
  rankedMatches: RankedAdopteeMatch[];
  isLoading: boolean;
  selectedMatch: RankedAdopteeMatch | null;
  isPopUpOpen: boolean;
  onReadMore: (match: RankedAdopteeMatch) => void;
  onClosePopUp: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function MobileMatchingReviewScreen({
  rankedMatches,
  isLoading,
  selectedMatch,
  isPopUpOpen,
  onReadMore,
  onClosePopUp,
  onBack,
  onSubmit,
}: MobileMatchingReviewScreenProps) {
  return (
    <div className="flex w-full flex-col gap-12 pt-8">
      <div className="flex flex-col items-center gap-4">
        <h1>Review your preferences!</h1>
        <p className="w-[clamp(300px,60%,400px)] text-center text-sm text-gray-11">
          Make sure the cards below are your preference choices!
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 px-4">
        {rankedMatches.map((m, idx) => (
          <MobileMatchingCard
            key={m.id}
            match={m}
            rank={idx + 1}
            onReadMore={onReadMore}
            isReview={true}
          />
        ))}
      </div>

      <div className="flex w-full justify-center gap-4 px-4">
        <Button
          type="button"
          variant="secondary"
          className="flex-1 py-2"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          className="flex-1 py-2"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner variant="button" /> : 'Submit'}
        </Button>
      </div>

      <MobilePopUp
        open={isPopUpOpen}
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
