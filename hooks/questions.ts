'use client';

import { Fragment, useCallback, useEffect, useMemo } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useQuestionsContext } from '@/contexts/QuestionsContext';

/**
 * Fetches the current question as a number using
 * the "q" search parameter. Runs validation checks
 * using the questions context.
 *
 * If invalidated, this hook will throw a notFound error.
 * If valid, this hook will return the current question index.
 */
export const useCurrentQuestion = () => {
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
  if (currQuestionInt < 0) throw notFound();

  return currQuestionInt;
};

/**
 * Every time the search query is updated,
 * check if the current question (from search params)
 * against the number of questions completed.
 *
 * This hook assumes the number of questions completed
 * is updated diligently, so it will update the
 * current question (in search param) to the
 * last question completed.
 *
 * In doing so, the user will be taken to that question
 * within the application as well.
 */
export const useSequenceSkipBlocker = () => {
  const { questionsCompleted } = useQuestionsContext();
  const currentQuestion = useCurrentQuestion();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // correct any URL brute force injection
    if (questionsCompleted < currentQuestion) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('q', questionsCompleted.toString());
      router.replace(`?${params.toString()}`);
    }
  }, [questionsCompleted, currentQuestion, router, searchParams]);
};

/**
 * Gets the current question component based on
 * the current question index.
 *
 * If question component list is empty, return a
 * React fragment.
 *
 * If current question index is greater than the
 * number of question components available,
 * this hook will throw a notFound error.
 */
export const useCurrentQuestionElement = () => {
  const currentQuestion = useCurrentQuestion();
  const { questions } = useQuestionsContext();

  if (questions.length === 0) return Fragment;
  if (currentQuestion < questions.length) return questions[currentQuestion];

  throw notFound();
};

/**
 * Provides a helper function that abstracts logic
 * to advance to the next question.
 */
export const useQuestionAdvancer = () => {
  const { setQuestionsCompleted } = useQuestionsContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const advanceToQuestion = useCallback(
    (currentQuestion: number) => {
      setQuestionsCompleted(prev =>
        prev >= currentQuestion ? prev : currentQuestion,
      );

      const params = new URLSearchParams(searchParams);
      params.set('q', `${currentQuestion}`);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router, setQuestionsCompleted],
  );

  return { advanceToQuestion };
};
