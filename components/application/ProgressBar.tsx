'use client';

import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { cn } from '@/lib/utils';

export default function ProgressBar() {
  const { questionsCompleted, numQuestions } = useQuestionsContext();

  return (
    <div className="flex gap-1">
      {[...Array(numQuestions).keys()].map((k, idx) => (
        <ProgressBarNode key={k} highlighted={idx < questionsCompleted} />
      ))}
    </div>
  );
}

function ProgressBarNode({ highlighted }: { highlighted?: boolean }) {
  return (
    <div
      className={cn('h-1 w-8 rounded bg-gray-6', highlighted && 'bg-cyan-12')}
    />
  );
}
