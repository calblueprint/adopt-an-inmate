'use client';

import { useMemo } from 'react';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { useCurrentQuestion } from '@/hooks/questions';
import { cn } from '@/lib/utils';

export default function ProgressBar({
  stepsToSkip = 1,
}: {
  stepsToSkip?: number;
}) {
  const currentQuestion = useCurrentQuestion();
  const { questionsCompleted, questions } = useQuestionsContext();
  const numQuestions = useMemo(
    () => Math.max(0, questions.length - stepsToSkip),
    [questions, stepsToSkip],
  );

  return (
    <div
      className={cn('flex gap-1', currentQuestion >= numQuestions && 'hidden')}
    >
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
