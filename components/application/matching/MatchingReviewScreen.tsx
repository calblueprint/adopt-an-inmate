'use client';

import { Button } from '@/components/Button';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import { useApplicationNavigation } from '@/hooks/app-process';
import { ApplicationStage } from '@/types/enums';
import { RankedAdopteeMatch } from '@/types/schema';
import MatchingCard from './MatchingCard';

interface MatchingReviewScreenProps {
  ranks: string[];
  onBack: () => void;
}

export default function MatchingReviewScreen({
  ranks,
  onBack,
}: MatchingReviewScreenProps) {
  const { appState } = useApplicationContext();
  const { advanceToStage, upsertAppInfo } = useApplicationNavigation();

  const nextStage = async () => {
    upsertAppInfo({
      status: 'pending',
      ranked_cards: rankedMatches,
      time_submitted: new Date().toISOString(),
    }); //new upsert helper

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
            <MatchingCard match={m} key={m.id} rank={idx + 1} isReview={true} />
          ))}
        </div>
      </div>

      <div className="flex w-full justify-center gap-4">
        <Button
          type="button"
          variant="secondary"
          className="w-9/10 py-2 sm:w-[clamp(200px,50%,400px)]"
          onClick={onBack}
        >
          Back
        </Button>
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
