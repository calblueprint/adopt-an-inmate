'use client';

import { Button } from '@/components/Button';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useApplicationNavigation } from '@/hooks/app-process';
import { ApplicationStage } from '@/types/enums';
import { RankedAdopteeMatch } from '@/types/schema';
import MatchingCard from './MatchingCard';
import MatchingDialog from './MatchingDialog';

interface MatchingReviewScreenProps {
  ranks: string[];
}

export default function MatchingReviewScreen({
  ranks,
}: MatchingReviewScreenProps) {
  const { appState } = useApplicationContext();

  const { advanceToStage } = useApplicationNavigation();

  const nextStage = () => {
    console.log('Submitting final ranked matches:', ranks);
    advanceToStage(ApplicationStage.SUBMITTED);
  };

  const allMatches = appState.matches || [];

  const rankedMatches: RankedAdopteeMatch[] = ranks
    .map(rankedId => allMatches.find(m => m.id === rankedId))
    .filter((match): match is RankedAdopteeMatch => !!match);

  return (
    <div className="flex w-full flex-col gap-12 pt-8">
      <div className="flex flex-col items-center gap-4">
        <h1>Review your preferences!</h1>
        <p className="w-[clamp(300px,60%,400px)] text-center text-sm text-gray-11">
          Make sure the cards below are your preference choices!
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex w-full gap-8 px-12">
          {rankedMatches.map((m, idx) => (
            <MatchingCard
              match={m}
              matchIndex={idx}
              key={m.id}
              rank={idx + 1}
              isReview={true}
            />
          ))}
        </div>
        <MatchingDialog />
      </div>

      <div className="flex w-full justify-center">
        <Button
          type="button"
          variant="primary"
          className="w-9/10 py-2 sm:w-[clamp(200px,50%,400px)]"
          onClick={nextStage}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
