'use client';

import { useMemo } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { useQuestionsContext } from '@/contexts/QuestionsContext';

/**
 * Fetches the current question as a number using
 * the "q" search parameter. Runs validation checks
 * using the questions context.
 *
 * If invalidated, this hook will throw a notFound error.
 * If valid, this hook will return the current question index.
 */
export const useCurrentQuestionInt = () => {
  const { numQuestions } = useQuestionsContext();
  const searchParams = useSearchParams();

  // get the q search param
  const currentQuestion = useMemo(
    () => searchParams.get('q') || '0',
    [searchParams],
  );

  // if it doesn't parse to a number, redirect to not found
  if (Number.isNaN(currentQuestion)) throw notFound();

  // parse as number
  const currQuestionInt = useMemo(
    () => parseInt(currentQuestion),
    [currentQuestion],
  );

  // validate bounds of the parsed number
  if (currQuestionInt < 0 || currQuestionInt >= numQuestions) throw notFound();

  return currQuestionInt;
};
