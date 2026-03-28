'use client';

import { useState } from 'react';
import Logger from '@/actions/logging';
import { Button } from '@/components/Button';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import useMediaQuery from '@/hooks/useMediaQuery';
import { RankedAdopteeMatch } from '@/types/schema';
import MatchingCard from './MatchingCard';
import MobileMatchingSelectScreen from './MobileMatchingSelectScreen';

interface MatchingSelectScreenProps {
  matchCards: RankedAdopteeMatch[];
  onTransitionToReview: (rankedIds: string[]) => void;
}

export default function MatchingSelectScreen({
  matchCards,
  onTransitionToReview,
}: MatchingSelectScreenProps) {
  const { appState } = useApplicationContext();
  const [rankedIds, setRankedIds] = useState<string[]>([]);
  const isMobile = useMediaQuery('(max-width: 640px)');
  console.log('[MatchingSelectScreen] mode:', isMobile ? 'mobile' : 'desktop');
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<RankedAdopteeMatch | null>(
    null,
  );

  const handleRankToggle = (id: string) => {
    setRankedIds(prev => {
      const index = prev.indexOf(id);
      return index > -1
        ? prev.filter(rankedId => rankedId !== id)
        : [...prev, id];
    });
  };

  const handleReadMore = (match: RankedAdopteeMatch) => {
    setSelectedMatch(match);
    setIsRankingOpen(true);
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

  const isNextDisabled = rankedIds.length !== 4;

  if (isMobile) {
    return (
      <MobileMatchingSelectScreen
        matches={matchCards}
        rankedIds={rankedIds}
        isNextDisabled={isNextDisabled}
        selectedMatch={selectedMatch}
        isRankingOpen={isRankingOpen}
        onRankToggle={handleRankToggle}
        onRankedIdsChange={setRankedIds}
        onReadMore={handleReadMore}
        onNextClick={handleNextClick}
        onClosePopUp={() => setIsRankingOpen(false)}
      />
    );
  }

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
          {matchCards.map(m => {
            // calculate current rank based on array index
            const rankIndex = rankedIds.indexOf(m.id);
            const currentRank = rankIndex > -1 ? rankIndex + 1 : undefined;

            return (
              <MatchingCard
                key={m.id}
                match={m}
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
