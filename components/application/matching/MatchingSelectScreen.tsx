'use client';

import { Button } from '@/components/Button';
import { useApplicationContext } from '@/contexts/ApplicationContext';
import MatchingCard from './MatchingCard';

export default function MatchingSelectScreen() {
  const { appState } = useApplicationContext();

  return (
    <div className="flex w-full flex-col gap-12 pt-8">
      <div className="flex flex-col items-center gap-4">
        <h1>Pick your adoptee!</h1>
        <p className="w-[clamp(300px,60%,400px)] text-center text-sm text-gray-11">
          Click the cards in your order of preference. Click to reorder anytime,
          or click again to change rankings.
        </p>
      </div>

      <div className="flex w-full gap-8 px-12">
        {appState.matches?.map(m => <MatchingCard match={m} key={m.id} />)}
      </div>

      <div className="flex w-full justify-center">
        <Button
          type="button"
          variant="primary"
          className="w-9/10 py-2 sm:w-[clamp(200px,50%,400px)]"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
