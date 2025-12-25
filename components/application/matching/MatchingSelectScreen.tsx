'use client';

import { useState } from 'react';
import Logger from '@/actions/logging';
import { Button } from '@/components/Button';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import MatchingCard from './MatchingCard';

interface MatchingSelectScreenProps {
  onTransitionToReview: (rankedIds: string[]) => void;
}

export default function MatchingSelectScreen({
  onTransitionToReview,
}: MatchingSelectScreenProps) {
  const { appState } = useApplicationContext();
  const [rankedIds, setRankedIds] = useState<string[]>([]);

  /**
   * Toggles the rank of an adoptee.
   * If ranked, removes it from rankedIds.
   * If unranked, adds it to the end of rankedIds.
   */
  const handleRankToggle = (id: string) => {
    setRankedIds(prevIds => {
      const index = prevIds.indexOf(id);
      if (index > -1) {
        // unrank: filter out the id to remove it
        return prevIds.filter(rankedId => rankedId !== id);
      } else {
        // rank: add id
        return [...prevIds, id];
      }
    });
  };

  const handleNextClick = async () => {
    if (!appState.matches) {
      Logger.error(
        `Failed to fetch matches for application: ${appState.appId}`,
      );
      return;
    }

    onTransitionToReview(rankedIds);
  };

  const isNextDisabled = rankedIds.length != 4; // disable next if not all 4 ranked

  return (
    <div className="flex w-full flex-col gap-12 pt-8">
      <div className="flex flex-col items-center gap-4">
        <h1>Rank your preferences!</h1>
        <p className="w-[clamp(300px,60%,400px)] text-center text-sm text-gray-11">
          Click the cards in your order of preference.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex w-full gap-8 px-12">
          {appState.matches?.map(m => {
            // calculate current rank based on array index
            const rankIndex = rankedIds.indexOf(m.id);
            const currentRank = rankIndex > -1 ? rankIndex + 1 : undefined;
            return (
              <MatchingCard
                match={m}
                key={m.id}
                rank={currentRank}
                onSelect={handleRankToggle}
              />
            );
          })}
        </div>
      </div>

      <div className="flex w-full justify-center">
        <Button
          type="button"
          variant="primary"
          className="w-9/10 py-2 sm:w-[clamp(200px,50%,400px)]"
          disabled={isNextDisabled}
          onClick={handleNextClick}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
